"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COPY } from "@/lib/site";

// Slow looping marquee of the niches we serve. Drifts on its own; scroll
// velocity nudges its speed (the page's pace bleeds into the strip). It loops
// seamlessly at any width: we measure one copy of the row, then render as many
// copies as it takes to overfill the viewport and wrap x by exactly one copy
// width — so the track never runs out and shows a gap (Noah 2026-06-20).
// Reduced motion drops to a static, wrapping row of the same words.
const SPEED = 55; // px/sec base drift

function Row({ inner }: { inner?: React.Ref<HTMLSpanElement> }) {
  return (
    <span
      ref={inner}
      className="flex shrink-0 items-center whitespace-nowrap"
      aria-hidden={inner ? undefined : "true"}
    >
      {COPY.marquee.map((niche) => (
        <span key={niche} className="flex items-center">
          <span className="px-6 md:px-9">{niche}</span>
          <span aria-hidden="true" className="text-accent">
            ●
          </span>
        </span>
      ))}
    </span>
  );
}

export function Marquee() {
  const reduced = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const [rowW, setRowW] = useState(0);
  const [copies, setCopies] = useState(2);

  // measure one copy + the container, then render enough copies to overfill it
  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const w = rowRef.current?.offsetWidth ?? 0;
      const cw = containerRef.current?.offsetWidth ?? 0;
      if (w > 0) {
        setRowW(w);
        setCopies(Math.max(2, Math.ceil(cw / w) + 1));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [reduced]);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // scroll speed bends the marquee speed, capped so it never sprints
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const direction = useRef(1);

  // wrap by exactly one copy width (px) so the loop is seamless
  const x = useTransform(baseX, (v) => `${rowW ? wrap(-rowW, 0, v) : 0}px`);

  useAnimationFrame((_, delta) => {
    if (!rowW) return;
    let moveBy = direction.current * -SPEED * (delta / 1000);
    if (velocityFactor.get() < 0) direction.current = -1;
    else if (velocityFactor.get() > 0) direction.current = 1;
    moveBy += moveBy * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy);
  });

  const label = COPY.marquee.join(", ");

  return (
    <section
      ref={containerRef}
      aria-label={`Niches we build for: ${label}`}
      className="overflow-hidden border-y border-line bg-surface py-6 md:py-8"
    >
      <div className="flex select-none text-[clamp(1.25rem,3.4vw,2.4rem)] tracking-tight text-ink/80">
        {reduced ? (
          // static: wraps every niche onto as many lines as it needs, no drift
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3 px-6">
            {COPY.marquee.map((niche, i) => (
              <span key={niche} className="flex items-center">
                <span className="px-3">{niche}</span>
                {i < COPY.marquee.length - 1 && (
                  <span aria-hidden="true" className="text-accent">
                    ●
                  </span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <motion.div className="flex flex-nowrap" style={{ x }}>
            {Array.from({ length: copies }, (_, i) => (
              <Row key={i} inner={i === 0 ? rowRef : undefined} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
