"use client";

// Premium-tier florist hero: one seamless shot, scrubbed by scroll — an exploded
// bouquet assembles, flies off, and the camera flies into the shop. Same engine
// as RenovationScrollHero (tall wrapper + sticky 100svh stage; scroll progress
// 0→0.9 maps onto the clip, 0.9→1 holds the final frame, which the encode pads
// with a 1s freeze), but the copy is placed per beat because this clip changes
// from a pale grey studio to a warm shop interior: the opening headline sits
// top-left in dark ink on a light wash, everything after sits bottom-left in
// light text on a dark scrim. Only mounted when tier === "premium": Basic never
// requests the video.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

const VIDEO_SRC = "/videos/florist-hero.mp4";
const POSTER_SRC = "/videos/florist-hero-poster.jpg";
const SCRUB_END = 0.9; // progress at which the video reaches its last frame
const LERP = 0.12; // per-frame ease toward the target time
const MIN_SEEK = 0.01; // seconds; smaller gaps aren't worth a seek

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// 0 before `a`, ramps to 1 by `b`.
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

// Opening beat: pale studio, so a light wash behind dark ink (tokens only).
const SCRIM_LIGHT =
  "linear-gradient(180deg, color-mix(in srgb, var(--d-bg) 80%, transparent) 0%, color-mix(in srgb, var(--d-bg) 44%, transparent) 34%, transparent 62%)";
// Shop beats: warm, busy interior, so a deep scrim behind light text.
const SCRIM_DARK =
  "linear-gradient(0deg, color-mix(in srgb, var(--d-fg) 84%, transparent) 0%, color-mix(in srgb, var(--d-fg) 56%, transparent) 30%, color-mix(in srgb, var(--d-fg) 20%, transparent) 56%, transparent 74%)";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-2.5 text-[15px] font-bold uppercase tracking-[0.12em]">
      <span aria-hidden className="inline-block h-px w-6" style={{ background: "var(--d-accent)" }} />
      {children}
    </p>
  );
}

const headlineClass =
  "max-w-3xl text-balance text-[40px] font-bold leading-[1.04] tracking-[-0.035em] md:text-[72px]";
const headlineStyle = { fontFamily: "var(--d-display)", fontOpticalSizing: "auto" } as const;

function CopyCta({ label }: { label: string }) {
  return (
    <a
      href="#contact"
      className="d-press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
      style={{
        background: "var(--d-accent)",
        color: "var(--d-onaccent)",
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
        border: "1px solid color-mix(in srgb, var(--d-accent) 92%, black)",
      }}
    >
      {label}
    </a>
  );
}

export function FloristScrollHero({
  eyebrow,
  line1,
  line2,
  subline,
  cta,
  scrollVh = 500,
}: {
  eyebrow: string;
  line1: string;
  line2: ReactNode;
  subline: string;
  cta: string;
  // total wrapper height in vh; the clip is ~18s, so longer than the 4-beat default
  scrollVh?: number;
}) {
  const [reduced, setReduced] = useState<boolean | null>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const openRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lightScrimRef = useRef<HTMLDivElement>(null);
  const darkScrimRef = useRef<HTMLDivElement>(null);

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
      // opening headline: 0–0.25, top-left over the studio
      set(openRef.current, 1 - ramp(p, 0.2, 0.28), 16);
      // supporting line: ~0.45–0.7, bottom-left over the approach and doorway
      set(subRef.current, Math.min(ramp(p, 0.42, 0.5), 1 - ramp(p, 0.64, 0.72)), 16);
      // closing state: headline 0.8–1 and the CTA, bottom-left, stays
      set(headRef.current, ramp(p, 0.76, 0.84), 16);
      set(ctaRef.current, ramp(p, 0.8, 0.88), 12);
      // scrims swap while no text is visible (0.28–0.42)
      if (lightScrimRef.current) lightScrimRef.current.style.opacity = (1 - ramp(p, 0.3, 0.4)).toFixed(3);
      if (darkScrimRef.current) darkScrimRef.current.style.opacity = ramp(p, 0.32, 0.42).toFixed(3);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      readProgress();
      paintText(progress);
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const target = clamp01(progress / SCRUB_END) * dur;
      current += (target - current) * LERP;
      if (Math.abs(video.currentTime - current) >= MIN_SEEK && !video.seeking) {
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

  // Reduced motion: static 100svh poster (the final shop frame) with the final text state.
  if (reduced) {
    return (
      <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560 }}>
        <Image src={POSTER_SRC} alt="" fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0" style={{ background: SCRIM_DARK }} />
        <div
          className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col justify-end px-6 pb-20 md:px-16"
          style={{ color: "var(--d-surface)" }}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className={headlineClass} style={headlineStyle}>
            {line1}
            <br />
            {line2}
          </h1>
          <div>
            <CopyCta label={cta} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: `${scrollVh}vh` }}>
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
        <div ref={lightScrimRef} aria-hidden className="absolute inset-0" style={{ background: SCRIM_LIGHT }} />
        <div ref={darkScrimRef} aria-hidden className="absolute inset-0 opacity-0" style={{ background: SCRIM_DARK }} />
        {/* opening headline: a decorative copy (the real h1 is the closing one below).
            top padding clears the sticky demo bar + header. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
          <div
            ref={openRef}
            className="mx-auto w-full max-w-[1200px] px-6 pt-40 md:px-16 md:pt-44"
            style={{ color: "var(--d-fg)", willChange: "transform, opacity" }}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <div className={headlineClass} style={headlineStyle}>
              {line1}
              <br />
              {line2}
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col justify-end px-6 pb-20 md:px-16">
          <div className="relative" style={{ color: "var(--d-surface)" }}>
            {/* supporting line sits in the same lower-left slot, between headline states */}
            <div
              ref={subRef}
              className="pointer-events-none absolute bottom-0 left-0 max-w-xl opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-[19px] leading-[1.55] md:text-[22px]">{subline}</p>
            </div>
            <div ref={headRef} className="opacity-0" style={{ willChange: "transform, opacity" }}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className={headlineClass} style={headlineStyle}>
                {line1}
                <br />
                {line2}
              </h1>
            </div>
            <div ref={ctaRef} className="pointer-events-none opacity-0" style={{ willChange: "transform, opacity" }}>
              <CopyCta label={cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
