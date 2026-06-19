"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Two-line oversized section header (Axel-style: a bright lead line over a
// muted second line). Each line sits in an overflow-hidden mask and slides up
// from below as it scrolls into view — the quiet, repeated motion beat that
// carries the whole page between the one loud moment (the gallery). Reduced
// motion renders it flat. Headings are real <h2>s for outline/SEO; the inner
// spans do the moving.
export function SectionHeading({
  a,
  b,
  eyebrow,
  className = "",
}: {
  a: string;
  b: string;
  eyebrow?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const Line = ({ text, muted, i }: { text: string; muted?: boolean; i: number }) => {
    if (reduced) {
      return (
        <span className={`block ${muted ? "text-muted" : ""}`}>{text}</span>
      );
    }
    return (
      <span className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className={`block ${muted ? "text-muted" : ""}`}
          initial={{ y: "115%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.05 + i * 0.08 }}
        >
          {text}
        </motion.span>
      </span>
    );
  };

  return (
    <div className={className}>
      {eyebrow && (
        <motion.span
          className="mb-5 block font-mono text-xs uppercase tracking-[0.2em] text-accent"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {eyebrow}
        </motion.span>
      )}
      <h2 className="font-display text-title leading-[1.02]">
        <Line text={a} i={0} />
        <Line text={b} muted i={1} />
      </h2>
    </div>
  );
}
