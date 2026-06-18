"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

type Token = { id: string; char: string; core: boolean; bright?: boolean };
type TourWord = { word: string; coreAt: number };

// Config-driven tour: the brand's V·A·L hides inside three words for what a
// good site earns a business — valid (trustworthy) → invaluable (worth it) →
// approval (endorsed). Swap freely; each word just needs "VAL" at `coreAt`.
const TOUR: TourWord[] = [
  { word: "VALID", coreAt: 0 }, // prefix:  VAL·id
  { word: "INVALUABLE", coreAt: 2 }, // infix:   in·VAL·uable
  { word: "APPROVAL", coreAt: 5 }, // suffix:  appro·VAL
];

const EASE = [0.16, 1, 0.3, 1] as const;

// The three persistent nodes. Same ids across every phase, so React keeps the
// real DOM elements and Motion's `layout` FLIP-travels them (never crossfades).
const cV: Token = { id: "cV", char: "V", core: true };
const cA: Token = { id: "cA", char: "A", core: true };
const cL: Token = { id: "cL", char: "L", core: true };

// The final VALIS → VILAS step is a real position swap: A and I trade slots.
// Keep them (and the static S) as persistent nodes across both phases — same
// ids — so they FLIP-travel instead of crossfading, and the A and I can spin
// past each other (see `spinFor`) for the circular switch.
const swapI: Token = { id: "swapI", char: "I", core: false };
const swapS: Token = { id: "swapS", char: "S", core: false };

const h = (p: number, i: number, char: string): Token => ({
  id: `h${p}-${i}`,
  char,
  core: false,
});

function buildPhases(tour: TourWord[]): Token[][] {
  const phases: Token[][] = [];
  phases.push([cV, h(0, 0, "I"), cL, cA, h(0, 1, "S")]); // 0 — VILAS (= resolved)
  phases.push([cV, cA, cL]); // 1 — VAL
  tour.forEach((t, ti) => {
    const p = 2 + ti;
    const before = t.word.slice(0, t.coreAt).split("");
    const after = t.word.slice(t.coreAt + 3).split("");
    phases.push([
      ...before.map((c, i) => h(p, i, c)),
      cV,
      cA,
      cL,
      ...after.map((c, i) => h(p, 50 + i, c)),
    ]);
  });
  phases.push([cV, cA, cL]); // VAL again
  phases.push([cV, cA, cL, swapI, swapS]); // VALIS  — A·I in source order
  phases.push([cV, swapI, cL, cA, swapS]); // VILAS — A & I swap slots (spin)
  return phases;
}

const PHASES = buildPhases(TOUR);
const LAST = PHASES.length - 1;
// ms a phase holds before advancing (index = the phase being left). Slow, with a
// full ~1.3s beat on each tour word so each one actually lands before it moves.
const HOLDS = [1000, 1000, 1300, 1300, 1300, 1000, 1000];

// Seconds for a letter to travel between slots (the VAL slide-in + every
// rearrange) — long and unhurried.
const TRAVEL = 1.1;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function VilasReveal({
  tagline,
  ctaHref,
  ctaLabel,
}: {
  tagline: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [phase, setPhase] = useState(0);
  const [resolved, setResolved] = useState(true); // SSR / no-JS: render resolved
  const [scale, setScale] = useState(1);
  const rowRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dotted = SITE.domain.slice(SITE.domain.indexOf("."));

  // On the final VALIS → VILAS swap, the A and I rotate a full turn (opposite
  // directions) as they trade slots — a circular switch that lands upright.
  // Quiet (0) in every other phase, so only the swap spins.
  const spinFor = (id: string) =>
    phase !== LAST ? 0 : id === "cA" ? 360 : id === "swapI" ? -360 : 0;

  // The three core nodes flash --accent while they tour the words (phases 1..6),
  // then settle to --ink on the final VILAS — so the *resolved* name stays
  // uniform (motion-only distinction, v11), the accent only lives in transit.
  const colorFor = (t: Token) =>
    t.core && phase >= 1 && phase <= LAST - 1
      ? "var(--color-accent)"
      : "var(--color-ink)";

  // Hide the post-reveal copy before first paint so the animation starts clean.
  useLayoutEffect(() => {
    if (!prefersReduced()) setResolved(false);
  }, []);

  // Scale the whole word to fit the viewport — long words shrink, never overflow.
  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      const box = boxRef.current;
      if (!row || !box) return;
      const natural = row.scrollWidth; // layout width — ignores the transform
      const avail = box.clientWidth - 16;
      setScale(natural > 0 ? Math.min(1, avail / natural) : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  // The timed sequence — skippable, plays once, never gates the page.
  useEffect(() => {
    if (prefersReduced()) {
      setPhase(LAST);
      setResolved(true);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const opts: AddEventListenerOptions = { passive: true };

    const skip = () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach(clearTimeout);
      setPhase(LAST);
      setResolved(true);
      detach();
    };
    const detach = () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip, opts);
      window.removeEventListener("touchstart", skip, opts);
    };

    const run = async () => {
      try {
        await document.fonts?.ready; // measure against the real face
      } catch {
        /* Font Loading API unavailable — proceed anyway */
      }
      if (cancelled) return;
      const k = window.innerWidth < 640 ? 0.85 : 1; // trim slightly on mobile
      let acc = 0;
      for (let p = 1; p <= LAST; p++) {
        acc += HOLDS[p - 1] * k;
        timers.push(
          setTimeout(() => {
            if (!cancelled) setPhase(p);
          }, acc),
        );
      }
      timers.push(
        setTimeout(() => {
          if (!cancelled) setResolved(true);
        }, acc + 1200 * k), // wait out the swap spin before the copy fades in
      );
    };

    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      detach();
    };
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center text-center">
      {/* Real, stable name for assistive tech; the letters below are decorative. */}
      <h1 className="sr-only">{SITE.name}</h1>

      <div ref={boxRef} aria-hidden className="w-full">
        <div
          className="mx-auto w-fit will-change-transform"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
            transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <LayoutGroup>
            <div
              ref={rowRef}
              className="flex flex-nowrap items-baseline justify-center whitespace-nowrap font-wordmark leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {PHASES[phase].map((t) => (
                  <motion.span
                    key={t.id}
                    layout
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      rotate: spinFor(t.id),
                      color: colorFor(t),
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.7, ease: EASE },
                      // The slide / rearrange + the swap spin share the slow beat.
                      layout: { duration: TRAVEL, ease: EASE },
                      rotate: { duration: TRAVEL, ease: EASE },
                      color: { duration: 0.7, ease: EASE },
                    }}
                    className="inline-block"
                    style={{ fontWeight: 500, transformOrigin: "center" }}
                  >
                    {t.char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        </div>

        <div
          className="mt-3 font-mono text-muted transition-opacity duration-700"
          style={{
            opacity: resolved ? 1 : 0,
            fontSize: "clamp(0.85rem, 2.4vw, 1.35rem)",
          }}
        >
          {dotted}
        </div>
      </div>

      <div
        className="transition-opacity duration-700"
        style={{ opacity: resolved ? 1 : 0, pointerEvents: resolved ? "auto" : "none" }}
      >
        <p className="mx-auto mt-10 max-w-sm text-balance text-base text-muted md:max-w-md md:text-lg">
          {tagline}
        </p>
        <a
          href={ctaHref}
          className="press mt-8 inline-block text-sm text-accent underline decoration-accent/40 underline-offset-8 transition-colors hover:decoration-accent"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
