"use client";

import { useEffect } from "react";

// Site-wide Lenis smooth scroll. Gated behind prefers-reduced-motion at init
// time (per CLAUDE.md §11) and dynamically imported so the lib only loads
// when motion is allowed.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null =
      null;
    let frame = 0;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ anchors: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
