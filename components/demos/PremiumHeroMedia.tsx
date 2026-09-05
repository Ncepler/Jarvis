"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { HeroConcept } from "@/lib/heroConcepts";

// The Premium hero mechanism (round 2, job 5): a looping background video, or
// a video whose playback position is driven by scroll instead of by time.
// Wired to `lib/heroConcepts.ts` so the same mechanic can point at any
// style — this component doesn't know or care which one it's rendering.
//
// Three-tier fallback, always: video → poster image → a plain text
// placeholder naming the exact concept and the exact file paths to drop real
// assets into (same "obviously a placeholder" convention as
// components/sections/HeroVideo.tsx and the rest of the demo system's
// labeled placeholders — CLAUDE.md §7 never fabricates the real thing). Any
// one of those three can fail — no video encoded yet, no poster JPG yet, or
// both — without ever leaving a blank box.
//
// Reduced motion, phones, and slow connections all skip straight to the
// still poster (or the text placeholder if there's no poster either):
// scroll-scrubbed video on a phone is bad, and CLAUDE.md's whole premise is
// that these visitors are mostly on phones.
//
// `fallbackImage` (Demo bar ticket, job 6): the demo's own existing hero
// photo, used as the still to animate when no `/premium/<slug>` poster has
// been dropped in yet — every demo already has one of these, so the $500
// state never falls all the way to the bare text placeholder while a real
// photo exists. Three-tier still fallback is now poster → fallbackImage →
// text placeholder, video always wins over any of them.
//
// The still (poster or fallbackImage) plays a one-time Ken Burns zoom — scale
// 1 to ~1.06 over ~10s, ease-out, then hold at 1.06 (no loop, no snap back).
// This IS "the $500 state" until a real video lands: the task's stand-in for
// "no video exists yet" lives exactly here, in this fallback path, per Noah's
// call — not as a parallel hero system. Reduced motion drops the zoom (still
// renders, just static) but never drops the still itself.
export function PremiumHeroMedia({
  concept,
  fallbackImage,
}: {
  concept: HeroConcept;
  fallbackImage?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoBroken, setVideoBroken] = useState(false);
  const [posterBroken, setPosterBroken] = useState(false);
  const [fallbackBroken, setFallbackBroken] = useState(false);
  const [skipVideo, setSkipVideo] = useState(true); // starts true: only enabled once checks pass, so SSR/first paint never ships a video tag it might have to tear down

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    // Best-effort — Network Information API isn't universal, and a browser
    // without it just skips this check rather than blocking video anywhere.
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    const slow =
      nav.connection?.saveData === true ||
      ["slow-2g", "2g"].includes(nav.connection?.effectiveType ?? "");
    setSkipVideo(reduced || mobile || slow);
  }, []);

  // Scroll-driven mode: currentTime is set from how far the hero has
  // scrolled past, never from a scroll event handler directly (a raw scroll
  // listener fires far more often than the video can actually seek, and
  // dropped frames there stutter badly). An IntersectionObserver tracks
  // whether the hero is on screen at all; a rAF loop only runs while it is,
  // reading scroll position once per frame and driving currentTime from it.
  useEffect(() => {
    if (concept.mode !== "scroll" || skipVideo || videoBroken) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let inView = false;
    let raf = 0;

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 at the moment the hero's top hits the bottom of the viewport, 1
      // once its bottom passes the top — the whole section's scroll range.
      const fraction = Math.min(
        1,
        Math.max(0, (vh - rect.top) / (rect.height + vh)),
      );
      // The source video needs a dense keyframe interval (encode with
      // something like `-g 15` / a keyframe every ~0.5s at 30fps in ffmpeg)
      // or repeatedly setting currentTime stutters badly — the decoder has
      // to seek back to the last keyframe and re-decode forward on every
      // jump, and a sparse-keyframe encode (the default for most exports)
      // makes that jump expensive enough to visibly lag behind the scroll.
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = fraction * video.duration;
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !raf) raf = requestAnimationFrame(tick);
        if (!inView && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [concept.mode, skipVideo, videoBroken]);

  const showVideo = !skipVideo && !videoBroken && concept.videoSrc;
  const posterOk = Boolean(concept.poster) && !posterBroken;
  const fallbackOk = Boolean(fallbackImage) && !fallbackBroken;
  // poster (the real /premium/<slug> asset) wins once it exists; until then
  // the demo's own hero photo carries the zoom instead of a bare placeholder.
  const stillSrc = posterOk ? concept.poster! : fallbackOk ? fallbackImage! : null;
  const showStill = !showVideo && Boolean(stillSrc);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {showStill && !reducedMotion && (
        <style>{`
          @keyframes vilas-kenburns { from { transform: scale(1); } to { transform: scale(1.06); } }
        `}</style>
      )}
      {showVideo && (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={concept.videoSrc!}
          poster={concept.poster ?? undefined}
          // Scroll mode drives currentTime itself, so it never autoplays or
          // loops on its own; loop mode just plays.
          autoPlay={concept.mode === "loop"}
          loop={concept.mode === "loop"}
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoBroken(true)}
        />
      )}
      {showStill && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stillSrc!}
          alt=""
          className="h-full w-full object-cover"
          style={
            reducedMotion
              ? undefined
              : { animation: "vilas-kenburns 10s ease-out 1 forwards" }
          }
          onError={() => (posterOk ? setPosterBroken(true) : setFallbackBroken(true))}
        />
      )}
      {!showVideo && !showStill && (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
          style={{ backgroundColor: "var(--d-surface)" }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--d-muted)" }}
          >
            {`PREMIUM HERO — ${concept.mode === "scroll" ? "scroll-driven" : "looping video"}`}
          </span>
          <span
            className="max-w-md text-[13px] leading-snug"
            style={{ color: "var(--d-muted)" }}
          >
            {concept.concept} Drop {concept.videoSrc} (and {concept.poster} as
            its poster) in to activate — nothing else to change.
          </span>
        </div>
      )}
    </div>
  );
}
