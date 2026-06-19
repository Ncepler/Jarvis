"use client";

import { motion, useReducedMotion } from "motion/react";
import { COPY } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The final push before the form. One oversized two-line statement, one
// button. Same action name as everywhere else ("Start a project", §8). The
// button scrolls to the contact form sitting right below it.
export function ClosingCta() {
  const reduced = useReducedMotion();

  const Line = ({ text, muted, i }: { text: string; muted?: boolean; i: number }) =>
    reduced ? (
      <span className={`block ${muted ? "text-muted" : ""}`}>{text}</span>
    ) : (
      <span className="block overflow-hidden pb-[0.08em]">
        <motion.span
          className={`block ${muted ? "text-muted" : ""}`}
          initial={{ y: "115%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.05 + i * 0.09 }}
        >
          {text}
        </motion.span>
      </span>
    );

  return (
    <section className="border-t border-line px-6 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.98] tracking-[-0.03em]">
          <Line text={COPY.closing.a} i={0} />
          <Line text={COPY.closing.b} muted i={1} />
        </p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
        >
          <a
            href="#contact"
            className="press mt-12 inline-block cursor-pointer border border-accent bg-accent px-8 py-4 text-white transition-colors duration-200 hover:bg-accent/90"
          >
            {COPY.closing.cta} →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
