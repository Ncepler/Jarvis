"use client";

// Premium-tier lawn care hero: a scroll-scrubbed video. A tall wrapper holds a
// sticky 100svh stage; scroll progress (0→1 across the wrapper) drives the
// video's currentTime (0→0.9 maps onto the clip, 0.9→1 holds the final frame,
// which the encode pads with a 1s freeze so the scroll lands on a resting shot).
// Same engine as AutoBodyScrollHero. The clip's bottom third is dark at both the
// first and last frame, so every beat is light text on one dark scrim (no tone
// swap), even though the demo itself is a light theme. Only mounted when
// tier === "premium": Basic never requests the video.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

const VIDEO_SRC = "/videos/lawncare-hero.mp4";
const POSTER_SRC = "/videos/lawncare-hero-poster.jpg";
const SCRUB_END = 0.9; // progress at which the video reaches its last frame

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// 0 before `a`, ramps to 1 by `b`.
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

const SCRIM =
  "linear-gradient(0deg, color-mix(in srgb, var(--d-fg) 72%, transparent) 0%, color-mix(in srgb, var(--d-fg) 35%, transparent) 30%, transparent 58%)";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-2.5 text-[15px] font-bold uppercase tracking-[0.12em]">
      <span aria-hidden className="inline-block h-px w-6" style={{ background: "var(--d-accent)" }} />
      {children}
    </p>
  );
}

function CopyCta({ label, contactId }: { label: string; contactId: string }) {
  return (
    <a
      href={`#${contactId}`}
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

function Headline({ eyebrow, line1, line2 }: { eyebrow: string; line1: string; line2: string }) {
  return (
    <>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1
        className="max-w-3xl text-balance text-[40px] font-bold leading-[1.04] tracking-[-0.035em] md:text-[72px]"
        style={{ fontFamily: "var(--d-display)" }}
      >
        {line1}
        <br />
        {line2}
      </h1>
    </>
  );
}

export function LawnCareScrollHero({
  eyebrow,
  line1,
  line2,
  subline,
  cta,
  contactId,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  subline: string;
  cta: string;
  contactId: string;
}) {
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
          <div style={{ color: "var(--d-surface)" }}>
            <Headline eyebrow={eyebrow} line1={line1} line2={line2} />
            <div>
              <CopyCta label={cta} contactId={contactId} />
            </div>
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
          <div className="relative" style={{ color: "var(--d-surface)" }}>
            {/* supporting line sits in the same lower-left slot, between headline states */}
            <div
              ref={subRef}
              className="pointer-events-none absolute bottom-0 left-0 max-w-xl opacity-0"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-[19px] leading-[1.55] md:text-[22px]">{subline}</p>
            </div>
            <div ref={headRef} style={{ willChange: "transform, opacity" }}>
              <Headline eyebrow={eyebrow} line1={line1} line2={line2} />
            </div>
            <div ref={ctaRef} className="pointer-events-none opacity-0" style={{ willChange: "transform, opacity" }}>
              <CopyCta label={cta} contactId={contactId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
