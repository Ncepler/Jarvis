"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The real objections a cold-email visitor has, as a numbered accordion
// (Q01–). One open at a time. Every answer is true with zero clients.
function Item({
  q,
  a,
  n,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  n: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const id = `faq-${n}`;
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-start gap-5 py-7 text-left md:gap-8"
      >
        <span className="shrink-0 font-mono text-sm text-accent tabular-nums">
          Q0{n}
        </span>
        <span className="flex-1 text-lg md:text-xl">{q}</span>
        <span
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform duration-300 ease-out-expo"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="overflow-hidden"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.4, ease: EASE }}
          >
            <p className="max-w-2xl pb-7 pl-[calc(2rem+1.25rem)] text-muted leading-relaxed md:pl-[calc(2rem+2rem)]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={COPY.faq.title}
          a={COPY.headings.faq.a}
          b={COPY.headings.faq.b}
        />
        <div className="mt-16 max-w-3xl">
          {COPY.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i * 0.05, 0.25)}>
              <Item
                q={item.q}
                a={item.a}
                n={i + 1}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
