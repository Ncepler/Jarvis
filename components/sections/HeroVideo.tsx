"use client";

import { useReducedMotion } from "motion/react";

// Optional ambient background clip — Noah supplies it later. Keep null until
// the asset exists; the hero works without it.
const VIDEO: { src: string; poster: string } | null = null;

export function HeroVideo() {
  const reduced = useReducedMotion();
  if (!VIDEO) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover opacity-30"
      src={VIDEO.src}
      poster={VIDEO.poster}
      muted
      loop
      playsInline
      preload="none"
      autoPlay={!reduced}
      aria-hidden="true"
    />
  );
}
