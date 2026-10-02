"use client";

// Premium-tier auto body hero: a scroll-scrubbed video. A tall wrapper holds a
// sticky 100svh stage; scroll progress (0→1 across the wrapper) drives the
// video's currentTime (0→0.9 maps onto the clip, 0.9→1 holds the final frame,
// which the encode pads with a 1s freeze so the scroll lands on a resting shot).
// Only mounted when tier === "premium" — Basic never loads the video.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eyebrow } from "./system";

const VIDEO_SRC = "/videos/autobody-hero.mp4";
const POSTER_SRC = "/videos/autobody-hero-poster.jpg";
const SCRUB_END = 0.9; // progress at which the video reaches its last frame

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// 0 before `a`, ramps to 1 by `b`.
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const HEADLINE = (
  <>
    Wrecked.
    <br />
    Like it never happened.
  </>
);
const SUBLINE =
  "Collision repair, refinishing, and glass: done to factory spec. We handle the insurance claim, you get your car back right.";

function CopyCta({ accent2 }: { accent2: string }) {
  return (
    <a
      href="#apex-contact"
      className="press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
      style={{ background: accent2, color: "#0A0C0F" }}
    >
      Get a free estimate
    </a>
  );
}

function Headline() {
  return (
    <>
      <div className="mb-6">
        <Eyebrow>Collision center · Nassau County</Eyebrow>
      </div>
      <h1
        className="max-w-3xl text-[40px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[72px]"
        style={{ color: "var(--d-fg)" }}
      >
        {HEADLINE}
      </h1>
    </>
  );
}

const SCRIM = "linear-gradient(0deg, rgba(10,12,15,.72) 0%, rgba(10,12,15,.35) 30%, transparent 58%)";

export function AutoBodyScrollHero({ accent2 }: { accent2: string }) {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced !== false) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let progress = 0;
    let current = 0;
    let last = performance.now();
    let raf = 0;

    const readProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const span = Math.max(wrap.offsetHeight - window.innerHeight, 1);
      progress = clamp01(-rect.top / span);
    };

    const paintText = (p: number) => {
      const set = (el: HTMLElement | null, o: number, y: number) => {
        if (!el) return;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * y).toFixed(2)}px)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      };
      // headline: 0–0.25, then back for the closing state (0.8–1)
      const head = Math.max(1 - ramp(p, 0.2, 0.28), ramp(p, 0.76, 0.84));
      set(headRef.current, head, 16);
      // supporting line: ~0.45–0.7, fades in and out
      set(subRef.current, Math.min(ramp(p, 0.42, 0.5), 1 - ramp(p, 0.64, 0.72)), 16);
      // primary CTA: 0.8–1, stays
      set(ctaRef.current, ramp(p, 0.8, 0.88), 12);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      readProgress();
      paintText(progress);
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const target = clamp01(progress / SCRUB_END) * dur;
      // light easing toward the target; snap the last hair so it settles exactly
      current += (target - current) * (1 - Math.exp(-dt * 12));
      if (Math.abs(target - current) < 0.004) current = target;
      if (Math.abs(video.currentTime - current) > 1 / 60 && !video.seeking) {
        video.currentTime = current;
      }
    };

    // iOS Safari only honours seeks after the media has been "played" once.
    const prime = () => {
      video.muted = true;
      const p = video.play();
      if (p) p.then(() => video.pause()).catch(() => {});
    };
    if (video.readyState >= 1) prime();
    else video.addEventListener("loadedmetadata", prime, { once: true });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", prime);
    };
  }, [reduced]);

  // Reduced motion: static 100svh poster with the final text state.
  if (reduced) {
    return (
      <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560 }}>
        <Image src={POSTER_SRC} alt="" fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ background: SCRIM }} />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col justify-end px-6 pb-20 md:px-16">
          <Headline />
          <div>
            <CopyCta accent2={accent2} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden" style={{ background: "var(--d-bg)" }}>
        {/* poster shows until the first frame is ready (and if the video fails) */}
        <Image src={POSTER_SRC} alt="" fill priority sizes="100vw" className="object-cover" />
        {reduced === false && (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
        )}
        <div aria-hidden className="absolute inset-0" style={{ background: SCRIM }} />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col justify-end px-6 pb-20 md:px-16">
          <div className="relative">
            {/* supporting line sits in the same lower-left slot, between headline states */}
            <div
              ref={subRef}
              className="pointer-events-none absolute bottom-0 left-0 max-w-xl opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-[19px] leading-[1.55] md:text-[22px]" style={{ color: "var(--d-fg)" }}>
                {SUBLINE}
              </p>
            </div>
            <div ref={headRef} style={{ willChange: "transform, opacity" }}>
              <Headline />
            </div>
            <div ref={ctaRef} className="pointer-events-none opacity-0" style={{ willChange: "transform, opacity" }}>
              <CopyCta accent2={accent2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
