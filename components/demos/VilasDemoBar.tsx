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
import SquishSwitch from "@/components/SquishSwitch";

export type Tier = "basic" | "premium";

// The bar is `sticky` (in normal document flow), so it already reserves its
// own height — DemoRoute must NOT add extra top padding on top of it (that
// used to double up into a dead, wrongly-colored strip between this bar and
// each demo's own header; see git history). Nothing to offset by anymore.
export const DEMO_BAR_OFFSET_CLASS = "";

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
    <div className="sticky top-3 z-50 w-full px-3">
      {nudge && (
        <style>{`
          @keyframes vilas-bar-nudge { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          .vilas-bar-nudge { animation: vilas-bar-nudge 0.7s ease-in-out 1; }
        `}</style>
      )}
      <div
        className="mx-auto grid h-11 max-w-[900px] grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border border-line/70 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] md:px-6"
        style={{
          background: "color-mix(in srgb, var(--color-surface) 72%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* left: exit control (always visible, every breakpoint) + wordmark
            (drops on mobile, per spec) — toggle + CTA never do */}
        <div className="flex items-center gap-3">
          <Link
            href="/#work"
            className="press whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.06em] text-muted transition-colors duration-150 hover:text-ink sm:text-[13px]"
            aria-label={`Exit to the ${SITE.name} gallery`}
          >
            ← Exit
          </Link>
          <Link href="/" className="hidden items-center gap-2 sm:flex" aria-label={SITE.name}>
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
          <SquishSwitch
            id="vilas-tier-switch"
            checked={isPremium}
            onChange={(next: boolean) => handleChange(next ? "premium" : "basic")}
            ariaLabel="Style price: $300 or $500"
            width={44}
            height={24}
            radius={12}
            trackColor="var(--color-bg)"
            trackOnColor="var(--color-ink)"
            className="shrink-0"
          />
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
            className="press whitespace-nowrap rounded-full bg-accent px-3.5 py-2 text-[12px] font-semibold text-surface transition-opacity duration-200 hover:opacity-90 sm:px-4 sm:text-[13px]"
          >
            Start with this style
          </Link>
        </div>
      </div>
    </div>
  );
}
