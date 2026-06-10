"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

// Watermark-weight brand mark, visible only while the gallery section is on
// screen. Not a button — no behavior.
export function PinnedLogo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const gallery = document.getElementById("work");
    if (!gallery) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-6 left-6 z-40 hidden text-ink/35 transition-opacity duration-300 sm:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Logo size={24} />
    </div>
  );
}
