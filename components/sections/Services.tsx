"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useCanHover } from "@/lib/hooks";
import { COPY } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PATHS = [
  {
    key: "style",
    title: "Pick a style",
    price: "~$300",
    copy: COPY.services.paths.style,
  },
  {
    key: "custom",
    title: "Custom build",
    price: "from $500",
    copy: COPY.services.paths.custom,
  },
  {
    key: "flagship",
    title: "Flagship",
    price: "let's talk",
    copy: COPY.services.paths.flagship,
  },
] as const;

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
      {/* the frame-breaking element — grows past the card bounds on expand */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 size-44 rounded-full border border-line"
        initial={false}
        animate={{ scale: expanded ? 1 : 0.35, opacity: expanded ? 1 : 0 }}
        transition={
          reduced ? { duration: 0.15 } : { duration: 0.6, ease: EASE }
        }
      />

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
            href="#contact"
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
      </div>
    </section>
  );
}
