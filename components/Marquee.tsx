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
import { useRef } from "react";
import { COPY } from "@/lib/site";

// Slow looping marquee of the niches we serve. Drifts on its own; scroll
// velocity nudges its speed (the page's pace bleeds into the strip). Two
// copies of the row sit side by side and the x wraps over -50%..0 so the loop
// is seamless. Reduced motion drops to a static, wrapping row of the same
// words — no drift, no scroll coupling.
const BASE_VELOCITY = -2.2; // % of one copy width per second-ish

function Track({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex shrink-0 items-center whitespace-nowrap">
      {children}
    </span>
  );
}

function Row() {
  return (
    <Track>
      {COPY.marquee.map((niche) => (
        <span key={niche} className="flex items-center">
          <span className="px-6 md:px-9">{niche}</span>
          <span aria-hidden="true" className="text-accent">
            ●
          </span>
        </span>
      ))}
    </Track>
  );
}

export function Marquee() {
  const reduced = useReducedMotion();

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

  // duplicated content → wrap across half the total width
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * BASE_VELOCITY * (delta / 1000);
    // flip the marquee's lean to match scroll direction
    if (velocityFactor.get() < 0) direction.current = -1;
    else if (velocityFactor.get() > 0) direction.current = 1;
    moveBy += moveBy * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy);
  });

  const label = COPY.marquee.join(", ");

  return (
    <section
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
            <Row />
            <Row />
          </motion.div>
        )}
      </div>
    </section>
  );
}
