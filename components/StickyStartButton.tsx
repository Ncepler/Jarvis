"use client";

import { useEffect, useState } from "react";

// TODO(noah): swap to the real /start page once it exists — for now this
// just jumps straight to the contact form.
const START_HREF = "#contact";

// Small fixed "Start" button, top-right. Hidden while the hero is on screen,
// fades in once the visitor scrolls past it — same CTA, always reachable
// without scrolling back up. IntersectionObserver on #top (the hero section)
// toggles it both ways.
export function StickyStartButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={START_HREF}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="press fixed right-5 top-5 z-50 flex h-9 items-center rounded-sm border border-accent bg-accent px-4 text-sm text-white shadow-[0_2px_12px_-2px_rgba(31,26,20,0.35)] transition-opacity duration-[250ms] md:right-8 md:top-6"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      Start
    </a>
  );
}
