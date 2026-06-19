"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Transition,
} from "motion/react";
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

// The final VALIS → VILAS step swaps A and I. The DOM keeps the VALIS order;
// at LAST they revolve around the centre on a transform (see `finalAnim`) and
// settle in each other's slots, so the motion reads as a revolve, not a reorder.
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
  // LAST — same DOM order as VALIS; the reassembly (finalAnim) revolves A & I
  // into the swapped slots on a transform, so this phase reads as VILAS.
  phases.push([cV, cA, cL, swapI, swapS]);
  return phases;
}

const PHASES = buildPhases(TOUR);
// Correct final order (A & I in their VILAS slots), used for reduced motion /
// SSR where the orbit never runs.
const RESOLVED: Token[] = [cV, swapI, cL, cA, swapS];
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
  const [reduced, setReduced] = useState(false);
  const [scale, setScale] = useState(1);
  // horizontal gap between the A and I slot centers — the swap's orbit diameter
  const [dist, setDist] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dotted = SITE.domain.slice(SITE.domain.indexOf("."));

  // ── Final reveal choreography (VALIS → VILAS) ───────────────────────────
  // The word breaks apart and reassembles: V flies all the way out left, S all
  // the way out right, L shrinks to a dot in the middle, and A & I revolve
  // around that center (A over the top, I under the bottom) into each other's
  // slots. As the revolution finishes, V/S/L spring back and everything lands
  // as a normally-spaced VILAS. The DOM order stays VALIS; A & I just settle on
  // a transform that lands them in the swapped slots, so there's no reflow and
  // the read is "V I L A S" — every settle uses a bubbly overshoot.
  const FINAL_DUR = 1.5; // seconds the break-apart-and-reassemble takes
  const lin = (n: number) => Array.from({ length: n }, (_, i) => i / (n - 1));

  // Half-circle arc for A / I around the shared center (the L slot). x/y are
  // offsets from the letter's VALIS slot (where it currently sits), starting at
  // 0 — so the hand-off from the previous phase has no jump — and ending one
  // half-word over, in the OTHER letter's slot (A: slot1→slot3 over the top;
  // I: slot3→slot1 under the bottom). The DOM order never changes, so there's
  // no reflow flash; the swapped look is pure transform.
  const arc = (which: "A" | "I") => {
    const R = dist / 2;
    const x: number[] = [];
    const y: number[] = [];
    const STEPS = 13;
    for (let i = 0; i < STEPS; i++) {
      const t = i / (STEPS - 1);
      const phi = Math.PI * (which === "A" ? 1 - t : t);
      if (which === "A") {
        x.push(R * Math.cos(phi) + R); // 0 → +2R  (slot1 → slot3)
        y.push(-R * Math.sin(phi) * 1.2); // up and over the top
      } else {
        x.push(R * Math.cos(phi) - R); // 0 → −2R  (slot3 → slot1)
        y.push(R * Math.sin(phi) * 1.2); // down and under the bottom
      }
    }
    return { x, y };
  };

  // Per-letter keyframes for the LAST phase. `dist` must be measured first; if
  // it isn't, return null and the letters simply land in their resolved slots.
  type FinalA = {
    anim: { x?: number[]; y?: number[]; scale?: number[] };
    times: number[];
    ease: Record<string, string | string[]>;
  };
  const finalAnim = (id: string): FinalA | null => {
    if (dist <= 0) return null;
    const OUT = dist * 1.4; // how far V / S shoot off to the sides
    const sideTimes = [0, 0.3, 0.62, 1];
    const sideEase = ["easeOut", "easeInOut", "backOut"]; // bubbly snap home
    if (id === "cV")
      return { anim: { x: [0, -OUT, -OUT, 0] }, times: sideTimes, ease: { x: sideEase } };
    if (id === "swapS")
      return { anim: { x: [0, OUT, OUT, 0] }, times: sideTimes, ease: { x: sideEase } };
    if (id === "cL")
      return {
        anim: { scale: [1, 0.12, 0.12, 1] },
        times: sideTimes,
        ease: { scale: ["easeIn", "easeInOut", "backOut"] },
      };
    if (id === "cA" || id === "swapI") {
      const { x, y } = arc(id === "cA" ? "A" : "I");
      return { anim: { x, y }, times: lin(x.length), ease: { x: "easeInOut", y: "easeInOut" } };
    }
    return null;
  };

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
      // once the A and I are in their VALIS slots, measure the gap between their
      // centers (layout coords, pre-transform) — the orbit diameter
      if (phase >= LAST - 1) {
        const a = row.querySelector<HTMLElement>('[data-letter="cA"]');
        const i = row.querySelector<HTMLElement>('[data-letter="swapI"]');
        if (a && i) {
          const ca = a.offsetLeft + a.offsetWidth / 2;
          const ci = i.offsetLeft + i.offsetWidth / 2;
          const d = Math.abs(ci - ca);
          if (d > 0) setDist(d);
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  // The timed sequence — skippable, plays once, never gates the page.
  useEffect(() => {
    if (prefersReduced()) {
      setReduced(true);
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
        }, acc + FINAL_DUR * 1000 + 250), // wait out the reassembly before copy fades in
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
                {(reduced ? RESOLVED : PHASES[phase]).map(
                  (t) => {
                    const final =
                      !reduced && phase === LAST ? finalAnim(t.id) : null;
                    const trans: Record<string, object> = {
                      opacity: { duration: final ? 0.4 : 0.7, ease: EASE },
                      color: { duration: 0.7, ease: EASE },
                    };
                    if (final) {
                      for (const key of ["x", "y", "scale"] as const) {
                        if (Array.isArray(final.anim[key]))
                          trans[key] = {
                            duration: FINAL_DUR,
                            times: final.times,
                            ease: final.ease[key] ?? "easeInOut",
                          };
                      }
                    } else {
                      trans.layout = { duration: TRAVEL, ease: EASE };
                    }
                    return (
                      <motion.span
                        key={t.id}
                        data-letter={t.id}
                        layout={phase !== LAST}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          color: colorFor(t),
                          x: final?.anim.x ?? 0,
                          y: final?.anim.y ?? 0,
                          scale: final?.anim.scale ?? 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={trans as Transition}
                        className="inline-block"
                        style={{ fontWeight: 500, transformOrigin: "center" }}
                      >
                        {t.char}
                      </motion.span>
                    );
                  },
                )}
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
