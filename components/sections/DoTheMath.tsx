"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// The "do the math" ROI beat (sits immediately before #why). The whole point
// is honesty: it multiplies the VISITOR'S OWN numbers — a single recurring
// missed customer vs a one-time ~$300 site. It never promises returns; it's
// opportunity cost, and the "your numbers, not ours" line says so out loud.
// Kept on the light field as a raised surface panel (not a second dark band —
// CLAUDE.md §5 spends the one dark beat on FullBleed), big readout in accent.

const SITE_COST = 300; // style-build price the kicker compares against (~$300)
const CV_MIN = 50;
const CV_MAX = 2500;
const CV_STEP = 50;
const MPM_MIN = 1;
const MPM_MAX = 10;

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

// Tweens the big annual figure smoothly on change; snaps instantly under
// reduced motion. tabular-nums + centered so changing digit counts don't shift
// the layout around it.
function AnnualReadout({
  value,
  reduced,
}: {
  value: number;
  reduced: boolean | null;
}) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    if (reduced) {
      current.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(current.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, reduced]);

  return (
    <span className="tabular-nums" aria-hidden="true">
      {usd(display)}
    </span>
  );
}

export function DoTheMath() {
  const reduced = useReducedMotion();
  const [cv, setCv] = useState(SITE_COST); // one new customer is worth…
  const [mpm, setMpm] = useState(MPM_MIN); // …missed per month (hypothetical)
  const cvId = useId();

  const annual = cv * mpm * 12;
  const multiple = Math.round(annual / SITE_COST);
  const m = COPY.math;

  const setCvSafe = (n: number) =>
    setCv(Math.min(CV_MAX, Math.max(CV_MIN, Math.round(n / CV_STEP) * CV_STEP)));
  const stepMpm = (d: number) =>
    setMpm((v) => Math.min(MPM_MAX, Math.max(MPM_MIN, v + d)));

  return (
    <section
      id="worth"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={m.eyebrow} a={m.heading.a} b={m.heading.b} />
        <Reveal>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {m.intro}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:mt-20 md:grid-cols-[1.1fr_1fr]">
            {/* ---- inputs ---- */}
            <div className="flex flex-col justify-center gap-12 bg-surface p-8 md:p-12">
              {/* Q1 — customer value: slider + typed entry */}
              <div>
                <label
                  htmlFor={cvId}
                  className="block text-lg leading-snug text-ink"
                >
                  {m.q1.label}
                </label>
                <p className="mt-1 text-sm text-muted">{m.q1.sub}</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="relative flex items-center text-ink">
                    <span className="pointer-events-none absolute left-3 font-mono text-muted">
                      $
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={CV_MIN}
                      max={CV_MAX}
                      step={CV_STEP}
                      value={cv}
                      onChange={(e) => setCvSafe(Number(e.target.value) || CV_MIN)}
                      aria-label={m.q1.label}
                      className="w-28 rounded-sm border border-line bg-bg py-2 pl-7 pr-3 font-mono tabular-nums text-ink focus:border-accent focus:outline-none"
                    />
                  </div>
                  <input
                    id={cvId}
                    type="range"
                    min={CV_MIN}
                    max={CV_MAX}
                    step={CV_STEP}
                    value={cv}
                    onChange={(e) => setCvSafe(Number(e.target.value))}
                    aria-label={m.q1.label}
                    aria-valuetext={`${usd(cv)} per customer`}
                    className="range flex-1"
                  />
                </div>
              </div>

              {/* Q2 — missed per month: stepper */}
              <div>
                <p className="text-lg leading-snug text-ink">
                  {m.q2.pre}{" "}
                  <span className="whitespace-nowrap">
                    <span
                      className="mx-1 inline-flex items-center gap-3 align-middle"
                      role="group"
                      aria-label={`${m.q2.pre} this many ${m.q2.post}`}
                    >
                      <button
                        type="button"
                        onClick={() => stepMpm(-1)}
                        disabled={mpm <= MPM_MIN}
                        aria-label="One fewer per month"
                        className="press flex h-9 w-9 items-center justify-center rounded-sm border border-line text-xl leading-none text-ink transition-colors hover:border-accent disabled:opacity-30 disabled:hover:border-line"
                      >
                        −
                      </button>
                      <span
                        className="w-6 text-center font-mono text-xl tabular-nums text-accent"
                        aria-live="polite"
                      >
                        {mpm}
                      </span>
                      <button
                        type="button"
                        onClick={() => stepMpm(1)}
                        disabled={mpm >= MPM_MAX}
                        aria-label="One more per month"
                        className="press flex h-9 w-9 items-center justify-center rounded-sm border border-line text-xl leading-none text-ink transition-colors hover:border-accent disabled:opacity-30 disabled:hover:border-line"
                      >
                        +
                      </button>
                    </span>
                  </span>{" "}
                  {m.q2.post}
                </p>
                <p className="mt-2 text-sm text-muted">{m.q2.sub}</p>
              </div>
            </div>

            {/* ---- live output ---- */}
            <div className="flex flex-col justify-center gap-6 bg-bg p-8 md:p-12">
              <p
                className="font-display leading-[0.95] tracking-[-0.02em] text-accent"
                style={{ fontSize: "clamp(2.75rem, 7vw, 5rem)" }}
              >
                <AnnualReadout value={annual} reduced={reduced} />{" "}
                <span className="text-ink">{m.readoutSuffix}</span>
              </p>
              <p className="max-w-xs text-lg leading-snug text-muted">
                {m.readoutCaption}
              </p>
              <div className="mt-2 border-t border-line pt-6">
                <p className="text-base leading-relaxed text-ink">
                  {m.kicker}
                </p>
                {multiple >= 3 && (
                  <p className="mt-1 text-base leading-relaxed text-muted">
                    {m.multiple.replace("{n}", String(multiple))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {m.honest}
        </p>

        {/* JS-off: the panel still SSRs its default state, but spell the math
            out plainly for no-JS visitors too. */}
        <noscript>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
            {m.jsOff}
          </p>
        </noscript>
      </div>
    </section>
  );
}
