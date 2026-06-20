"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SITE, isTBD } from "@/lib/site";
import { Logo } from "./Logo";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Brand mark pinned bottom-left, visible the ENTIRE time (Noah 2026-06-20 —
// this is now the site's only persistent logo; the top-left header was dropped).
// Clicking it morphs the mark into a small personal business card
// (Noah 2026-06-11) — same element, layoutId morph, not a swap.
export function PinnedLogo() {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // reduced motion: fade between the two states instead of morphing
  const layoutId = reduced ? undefined : "founder-card";

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
      <AnimatePresence initial={false} mode={reduced ? "wait" : "popLayout"}>
        {open ? (
          <motion.div
            key="card"
            ref={cardRef}
            layoutId={layoutId}
            role="dialog"
            aria-label={`Business card of ${SITE.founder}`}
            className="flex w-[300px] min-h-[180px] flex-col border border-line bg-surface p-5 shadow-[0_12px_40px_rgba(20,53,57,0.14)]"
            initial={reduced ? { opacity: 0 } : undefined}
            animate={reduced ? { opacity: 1 } : undefined}
            exit={reduced ? { opacity: 0 } : undefined}
            transition={
              reduced ? { duration: 0.15 } : { duration: 0.45, ease: EASE }
            }
          >
            <div className="flex items-start justify-between">
              <motion.span
                className="font-display text-2xl leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: reduced ? 0 : 0.2 }}
              >
                {SITE.founder}
              </motion.span>
              <button
                type="button"
                aria-label="Close card"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className="press -mr-1 -mt-1 cursor-pointer px-1 text-muted transition-colors duration-200 hover:text-ink"
              >
                ×
              </button>
            </div>
            <motion.div
              className="mt-auto grid gap-1 pt-4 text-sm text-muted"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: reduced ? 0 : 0.28,
                ease: EASE,
              }}
            >
              <span className="text-ink">Designer · {SITE.name}</span>
              <span>{SITE.region}</span>
              {!isTBD(SITE.email) && (
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors duration-200 hover:text-accent-2"
                >
                  {SITE.email}
                </a>
              )}
              {!isTBD(SITE.instagram) && (
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-accent-2"
                >
                  Instagram
                </a>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="logo"
            ref={buttonRef}
            layoutId={layoutId}
            type="button"
            aria-label={`About ${SITE.founder}`}
            onClick={() => setOpen(true)}
            className="block cursor-pointer opacity-35 transition-opacity duration-300 hover:opacity-70"
            initial={reduced ? { opacity: 0 } : undefined}
            animate={reduced ? { opacity: 1 } : undefined}
            exit={reduced ? { opacity: 0 } : undefined}
            transition={
              reduced ? { duration: 0.15 } : { duration: 0.45, ease: EASE }
            }
          >
            <Logo size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
