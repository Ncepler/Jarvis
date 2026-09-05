"use client";

// The Vilas chrome sitting on top of every demo (Demo bar ticket, job 1/2/3/4).
// Deliberately NOT part of a demo's own design — it never reads --d-* vars,
// it stays on the studio's own bone/ink tokens (app/globals.css) so it always
// reads as "the frame around the painting," not a themed piece of the site
// underneath it. Sticky to the top of the viewport, above every demo's own
// (non-fixed) header in document order, so it's never scrolled past or
// covered. `components/demos/DemoRoute.tsx` holds the tier state and passes
// it down; every demo route imports THIS one file rather than rolling its own.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

export type Tier = "basic" | "premium";

// Single source for the bar's height, so DemoRoute's top-offset padding can
// never drift out of sync with the bar itself.
export const DEMO_BAR_OFFSET_CLASS = "pt-16";

export function VilasDemoBar({
  slug,
  tier,
  onChange,
}: {
  slug: string;
  tier: Tier;
  onChange: (tier: Tier) => void;
}) {
  const reduced = useReducedMotion();
  const interactedRef = useRef(false);
  const [nudge, setNudge] = useState(false);

  // One-time nudge (job 4): if the visitor hasn't touched the toggle after 4s,
  // pulse the $500 label once. Never loops, never repeats after an
  // interaction, and never runs at all under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => {
      if (!interactedRef.current) setNudge(true);
    }, 4000);
    return () => clearTimeout(id);
  }, [reduced]);

  const handleChange = (next: Tier) => {
    interactedRef.current = true;
    onChange(next);
  };

  const isPremium = tier === "premium";

  return (
    <div className="sticky top-0 z-50 w-full border-b border-line bg-surface">
      {nudge && (
        <style>{`
          @keyframes vilas-bar-nudge { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          .vilas-bar-nudge { animation: vilas-bar-nudge 0.7s ease-in-out 1; }
        `}</style>
      )}
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-6">
        {/* wordmark — drops on mobile, per spec; toggle + CTA never do */}
        <div className="hidden items-center sm:flex">
          <Link href="/" className="flex items-center gap-2" aria-label={SITE.name}>
            <Logo size={22} />
            <span className="font-display text-base text-ink">{SITE.name}</span>
          </Link>
        </div>

        {/* tier toggle (job 2) — iOS-settings pill + knob. No color change
            between states: position + label weight/opacity is the whole
            visual language. */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          <span
            className={`text-[11px] font-mono transition-opacity duration-200 sm:text-[13px] ${
              isPremium ? "font-normal text-muted opacity-50" : "font-semibold text-ink opacity-100"
            }`}
          >
            $300 + $50/mo
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isPremium}
            aria-label="Style price: $300 or $500"
            onClick={() => handleChange(isPremium ? "basic" : "premium")}
            className="relative h-6 w-11 shrink-0 rounded-full border border-line bg-bg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span
              aria-hidden
              className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ink transition-transform duration-200 ease-out"
              style={{ transform: isPremium ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
          <span
            className={`text-[11px] font-mono transition-opacity duration-200 sm:text-[13px] ${
              isPremium ? "font-semibold text-ink opacity-100" : "font-normal text-muted opacity-50"
            } ${nudge ? "vilas-bar-nudge" : ""}`}
          >
            $500 + $80/mo
          </span>
        </div>

        {/* CTA — always reflects the tier at click time (job 7) */}
        <div className="flex items-center justify-end">
          <Link
            href={`/start?style=${slug}&tier=${tier}`}
            className="whitespace-nowrap rounded-full bg-accent px-3.5 py-2 text-[12px] font-semibold text-surface transition-opacity duration-200 hover:opacity-90 sm:px-4 sm:text-[13px]"
          >
            Start with this style
          </Link>
        </div>
      </div>
    </div>
  );
}
