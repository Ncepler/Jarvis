"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { AdminDemo } from "@/components/addons/AdminDemo";
import { GiftBoxDemo } from "@/components/addons/GiftBoxDemo";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useCanHover } from "@/lib/hooks";
import { ADDONS, priceLabel, WAIVER_NAMES, type Addon } from "@/lib/pricing";
import { COPY } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PATHS = [
  {
    key: "basic",
    title: "Basic",
    price: "$300 + $50/month",
    copy: COPY.services.paths.basic,
  },
  {
    key: "premium",
    title: "Premium",
    price: "$500 + $80/month",
    copy: COPY.services.paths.premium,
  },
  {
    key: "custom",
    title: "Custom",
    price: "let's talk",
    copy: COPY.services.paths.custom,
  },
] as const;

// Plain scrollIntoView rather than a bare hash link — a hash href depends on
// Lenis's own anchor handling picking up the click, and "Try it out" needs to
// reliably land on the assistant every time regardless of that.
function scrollToAssistant() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById("assistant")
    ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function PathCard({ path, n }: { path: (typeof PATHS)[number]; n: number }) {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const [hovered, setHovered] = useState(false);
  // mobile has no hover: cards open as they scroll into view, tap overrides
  const [tapped, setTapped] = useState<boolean | null>(null);

  const expanded = canHover ? hovered : (tapped ?? inView);

  return (
    <motion.div
      ref={ref}
      className="relative border border-line p-8"
      onHoverStart={() => canHover && setHovered(true)}
      onHoverEnd={() => canHover && setHovered(false)}
    >
      <span
        aria-hidden="true"
        className="block font-display text-5xl leading-none text-muted/40 tabular-nums"
      >
        0{n}
      </span>

      <button
        type="button"
        aria-expanded={expanded}
        className="mt-6 flex w-full items-baseline justify-between gap-4 text-left"
        onClick={() => !canHover && setTapped((t) => !(t ?? inView))}
        onFocus={() => canHover && setHovered(true)}
        onBlur={() => canHover && setHovered(false)}
      >
        <span className="text-lg">{path.title}</span>
        <span className="shrink-0 text-sm text-accent">{path.price}</span>
      </button>

      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: expanded ? "auto" : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      >
        {/* content fades in well after the card opens — the delay is the trick */}
        <motion.div
          className="pt-6"
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{
            duration: reduced ? 0.15 : 0.4,
            delay: expanded && !reduced ? 0.75 : 0,
            ease: EASE,
          }}
        >
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {path.copy}
          </p>
          <a
            href="/start"
            tabIndex={expanded ? 0 : -1}
            className="mt-8 inline-block text-sm transition-colors duration-200 hover:text-accent"
          >
            Start a project →
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AddOnDemo({ addon }: { addon: Addon }) {
  if (addon.demo === "chat") {
    return (
      <button
        type="button"
        onClick={scrollToAssistant}
        className="press shrink-0 border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-opacity duration-200 hover:opacity-85"
      >
        {COPY.services.premiumAddons.chatCta}
      </button>
    );
  }
  if (addon.demo === "model") return <GiftBoxDemo />;
  if (addon.demo === "admin") return <AdminDemo />;
  return null;
}

function AddOnCard({ addon }: { addon: Addon }) {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const [hovered, setHovered] = useState(false);
  // mobile has no hover: cards open as they scroll into view, tap overrides
  const [tapped, setTapped] = useState<boolean | null>(null);

  const expanded = canHover ? hovered : (tapped ?? inView);

  return (
    <motion.div
      ref={ref}
      className="relative border border-line p-8"
      onHoverStart={() => canHover && setHovered(true)}
      onHoverEnd={() => canHover && setHovered(false)}
    >
      <button
        type="button"
        aria-expanded={expanded}
        className="flex w-full items-baseline justify-between gap-4 text-left"
        onClick={() => !canHover && setTapped((t) => !(t ?? inView))}
        onFocus={() => canHover && setHovered(true)}
        onBlur={() => canHover && setHovered(false)}
      >
        <span>
          <span className="block font-mono text-xs uppercase tracking-[0.14em] text-accent">
            {COPY.services.premiumAddons.cardLabel}
          </span>
          <span className="mt-1 block text-lg">{addon.name}</span>
        </span>
        <span className="shrink-0 text-sm text-accent">
          {addon.bundledWith
            ? "Comes standard with Premium — not sold as a separate add-on."
            : priceLabel(addon)}
        </span>
      </button>

      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: expanded ? "auto" : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      >
        {/* content fades in well after the card opens — the delay is the trick */}
        <motion.div
          className="pt-6"
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{
            duration: reduced ? 0.15 : 0.4,
            delay: expanded && !reduced ? 0.75 : 0,
            ease: EASE,
          }}
        >
          <p className="max-w-md text-sm leading-relaxed text-muted">
            {addon.blurb}
          </p>

          {/* demos mount only while the card is open */}
          {expanded && <div className="mt-6">{<AddOnDemo addon={addon} />}</div>}

          {addon.live && (
            <a
              href={addon.live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-accent transition-opacity duration-200 hover:opacity-80"
            >
              {addon.live.label}
            </a>
          )}

          <a
            href="/start"
            tabIndex={expanded ? 0 : -1}
            className="mt-8 block text-sm transition-colors duration-200 hover:text-accent"
          >
            Start a project →
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What you get"
          a={COPY.headings.services.a}
          b={COPY.headings.services.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">{COPY.services.bridge}</p>
        </Reveal>
        <div className="mt-16 grid items-start gap-6 md:grid-cols-3">
          {PATHS.map((path, i) => (
            <Reveal key={path.key} delay={i * 0.09}>
              <PathCard path={path} n={i + 1} />
            </Reveal>
          ))}
        </div>
        {/* the scam-killer, stated plainly where the prices are */}
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-md text-lg">
            {COPY.services.riskReversal}
          </p>
        </Reveal>

        {/* Add-ons bought separately from either tier — their own grid so
            none of them reads as bundled into a package. */}
        <Reveal delay={0.15}>
          <div className="mt-16">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {COPY.services.premiumAddons.label}
            </span>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Add any of these to Basic or Premium. Premium waives the build
              fee on one: {WAIVER_NAMES}.
            </p>
            <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
              {ADDONS.map((addon) => (
                <AddOnCard key={addon.id} addon={addon} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
