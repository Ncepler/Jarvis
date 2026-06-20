"use client";

import { motion, useReducedMotion } from "motion/react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

// The brand mark, fixed top-left, present on the WHOLE page (Noah 2026-06-20 —
// "logo throughout, not just on a demo"). Quiet: just the V disc, no nav bar,
// no background fill — it floats over the air like the rest of the layout.
// Mark-only on purpose: the disc reads on the light page, and its cream V still
// reads over the dark FullBleed band / dark demo panels (a wordmark wouldn't).
// Click returns to the top.
export function SiteHeader() {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.a
      href="#top"
      aria-label={`${SITE.name} — back to top`}
      className="press fixed left-5 top-5 z-50 block md:left-8 md:top-7"
      initial={reduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <Logo size={36} />
    </motion.a>
  );
}
