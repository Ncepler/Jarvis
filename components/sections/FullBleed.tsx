"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { COPY, SITE } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The one full-bleed break mid-page (Sallem's aerial-photo moment, done our
// way). We don't fabricate a website screenshot (§7), so the "still" is the
// brand's own reveal motif: an oversized, ghosted VAL wordmark drifting on
// scroll behind one line and one CTA. Deliberately the page's dark beat — a
// cinematic inversion of the light field around it.
export function FullBleed() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const motifY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      aria-label="Why your website matters"
      className="relative flex min-h-[68svh] items-center overflow-hidden bg-ink px-6 py-28 text-bg md:px-10"
    >
      {/* the reveal motif, ghosted and oversized */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-wordmark font-medium leading-none text-bg/[0.06] select-none"
        style={{
          y: reduced ? 0 : motifY,
          fontSize: "clamp(10rem, 38vw, 34rem)",
          letterSpacing: "-0.04em",
        }}
      >
        VAL
      </motion.span>

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.p
          className="max-w-3xl font-display text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.02em]"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {COPY.fullBleed.line}
        </motion.p>
        <motion.a
          href="#work"
          className="press mt-10 inline-block border border-bg/30 px-6 py-3 text-sm text-bg transition-colors duration-200 hover:border-bg hover:bg-bg hover:text-ink"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        >
          {COPY.fullBleed.cta} →
        </motion.a>
        <span className="sr-only">{SITE.name}</span>
      </div>
    </section>
  );
}
