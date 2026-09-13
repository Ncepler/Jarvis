"use client";

// The hero's visual mechanism (replaces components/hero/VilasReveal.tsx +
// NameDefinition.tsx — see Hero.tsx). A single 5s overhead coffee-spill shot
// with NO timeline of its own: `currentTime` is a pure function of scroll
// position inside a 400vh pinned region, nothing else. No autoplay, no
// `.play()` call anywhere — setting `currentTime` on a paused video just
// seeks the paused frame, which is exactly what "scroll-scrubbed" means.
//
// Mechanism:
// - `wrapRef` is the 400vh scroll-distance box; the inner `sticky` div is
//   what's actually pinned on screen the whole time. Scroll progress
//   through the box (0 at pin-start, 1 at pin-end) maps linearly to virtual
//   video time (0 to DURATION seconds) — see `tick` below.
// - A rAF loop (not a scroll-event listener — those fire far more often
//   than a seek can keep up with, and dropped frames there stutter badly)
//   reads `getBoundingClientRect()` once a frame and *lerps* toward that
//   target time instead of snapping straight to it, so fast/jittery scroll
//   doesn't stutter the video. The lerp is framerate-independent (real
//   elapsed time, not a fixed per-frame factor) so it feels the same at
//   60Hz and 120Hz. Seeks are gated on `!video.seeking` so a slow decode
//   never gets a pile of redundant seeks queued behind it.
// - Video and image opacity are both driven by that SAME lerped virtual
//   time, recomputed fresh every frame (never a one-shot transition): flat
//   at 1/0 outside the 1.75s-4.75s window, and inside it the image's
//   opacity is always `1 - the video's opacity` — the two can only ever sum
//   to 1, so a rounding mismatch can never flash bare cream through
//   underneath both.
// - The video is fetched as a Blob and handed an object URL rather than a
//   plain `src` — some hosts mishandle Range requests, which silently
//   breaks `.currentTime` seeking in production even though it seeks fine
//   locally against a plain src.
//
// Fallbacks, in order: reduced motion or a phone-width screen skip the
// video entirely (no fetch, no <video> in the DOM at all) and show the
// still. No JS, or the fetch/video itself fails, lands on the exact same
// still — it's a plain <img>, already in the DOM from the first
// server-rendered byte, never something a failed video load triggers in
// with a script.
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/vilasherovideo.mp4";
const IMAGE_SRC = "/vilasheroimage.png";
// Same breakpoint components/demos/PremiumHeroMedia.tsx already uses for
// this exact "should we even attempt scroll video" decision.
const MOBILE_QUERY = "(max-width: 767px)";

// The shot's authored beats (see the task spec) — a fixed timeline, not
// `video.duration` (encoders round durations, e.g. to 5.03s, which would
// drift the fade window off its marks below).
const DURATION = 5;
const FADE_START = 1.75;
const FADE_END = 4.75;

// Time constant (seconds) for the currentTime lerp — bigger = smoother but
// laggier.
const SMOOTHING_TAU = 0.15;
// Skip a redundant seek once the lerped time is this close to the video's
// actual currentTime — each `currentTime` write has real seek cost, and
// without this the loop would reissue one on every single frame even after
// the lerp has fully converged.
const SEEK_EPSILON = 0.01;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Video opacity as a pure function of virtual time — three flat/ramp zones.
// Image opacity is always `1 - videoOpacityAt(t)`, computed from this same
// number, so the two can never sum to anything but 1.
function videoOpacityAt(t: number) {
  if (t <= FADE_START) return 1;
  if (t >= FADE_END) return 0;
  return 1 - (t - FADE_START) / (FADE_END - FADE_START);
}

export function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Starts true so server, first paint, and no-JS all agree on the same
  // (safest) state — a real <img>, no <video> at all — flipping to false
  // only once the effect below actually clears it for use (same SSR-safe
  // convention as PremiumHeroMedia.tsx's `skipVideo`).
  const [skipVideo, setSkipVideo] = useState(true);
  const [videoBroken, setVideoBroken] = useState(false);
  const [ready, setReady] = useState(false); // a real decoded frame exists

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia(MOBILE_QUERY).matches;
    setSkipVideo(reduced || mobile);
  }, []);

  // Fetch the video as a Blob and hand the element an object URL instead of
  // a plain `src` (see the header comment) — never issued at all when the
  // reduced-motion/mobile check above already decided to skip video.
  useEffect(() => {
    if (skipVideo) return;
    let cancelled = false;
    let objectUrl: string | null = null;

    fetch(VIDEO_SRC)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        const video = videoRef.current;
        if (video) {
          video.src = objectUrl;
          video.load();
        }
      })
      .catch(() => {
        if (!cancelled) setVideoBroken(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [skipVideo]);

  // The scroll-scrub loop — only once a frame has actually decoded, and
  // only while the pinned section is anywhere near the viewport.
  useEffect(() => {
    if (skipVideo || videoBroken || !ready) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    const img = imgRef.current;
    if (!wrap || !video || !img) return;

    let raf = 0;
    let lastFrameAt = 0;
    let virtualTime = 0; // lerped seconds, persists across frames

    const tick = (now: number) => {
      const dt = lastFrameAt ? Math.min(0.1, (now - lastFrameAt) / 1000) : 0;
      lastFrameAt = now;

      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scrollable = rect.height - vh;
      const progress =
        scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      const target = progress * DURATION;

      const alpha = dt ? 1 - Math.exp(-dt / SMOOTHING_TAU) : 1;
      virtualTime += (target - virtualTime) * alpha;
      if (Math.abs(target - virtualTime) < 0.001) virtualTime = target;

      if (
        !video.seeking &&
        Math.abs(video.currentTime - virtualTime) > SEEK_EPSILON
      ) {
        video.currentTime = virtualTime;
      }

      const vOpacity = videoOpacityAt(virtualTime);
      video.style.opacity = String(vOpacity);
      img.style.opacity = String(1 - vOpacity);

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) {
          lastFrameAt = 0;
          raf = requestAnimationFrame(tick);
        }
        if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      // Restore the safe default (image fully visible) rather than leaving
      // whatever mid-crossfade values the loop last wrote — matters when
      // this teardown is `videoBroken` flipping true mid-session, since the
      // <video> unmounts but this <img> doesn't.
      img.style.opacity = "";
      video.style.opacity = "";
    };
  }, [skipVideo, videoBroken, ready]);

  const showVideo = !skipVideo && !videoBroken;

  return (
    <div ref={wrapRef} className="relative h-[400vh]">
      <div
        aria-hidden="true"
        className="sticky top-0 h-svh w-full overflow-hidden bg-[#EDE7DA]"
      >
        {showVideo && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0"
            poster={IMAGE_SRC}
            muted
            playsInline
            disablePictureInPicture
            preload="none"
            onLoadedData={() => setReady(true)}
            onError={() => setVideoBroken(true)}
          />
        )}
        {/* Real <img>, unconditionally in the DOM — the no-JS/video-broken
            fallback needs no script to appear. Opacity is driven
            imperatively every rAF frame above; next/image's own lazy-load
            layer would fight that (same reasoning as the plain <img> in
            components/demos/PremiumHeroMedia.tsx). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={IMAGE_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
