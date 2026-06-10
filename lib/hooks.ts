"use client";

import { useEffect, useState } from "react";

// True on devices with a real hover (mouse/trackpad). Defaults to true so the
// server render matches desktop; corrected on mount for touch devices.
export function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);
  return canHover;
}
