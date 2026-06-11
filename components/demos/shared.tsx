"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Scroll-reveal for demo sections: rise + fade, once. The demos are
// marketing pages, so reveals run a touch longer than UI motion.
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Seamless ticker: two identical copies, the track translates by exactly
// half its width and loops. Constant motion, so linear. Pure CSS.
export function Marquee({
  children,
  className,
  duration = 24,
  label,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  label: string;
}) {
  return (
    <div
      role="marquee"
      aria-label={label}
      className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}
    >
      <style>{`
        @keyframes demo-marquee { to { transform: translateX(-50%); } }
        .demo-marquee {
          display: inline-flex;
          animation: demo-marquee var(--mq-dur) linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .demo-marquee { animation: none; }
        }
      `}</style>
      <div
        className="demo-marquee"
        style={{ "--mq-dur": `${duration}s` } as CSSProperties}
      >
        <span className="inline-flex items-center">{children}</span>
        <span className="inline-flex items-center" aria-hidden="true">
          {children}
        </span>
      </div>
    </div>
  );
}
