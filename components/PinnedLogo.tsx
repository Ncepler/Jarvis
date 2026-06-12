"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SITE, isTBD } from "@/lib/site";
import { Logo } from "./Logo";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Brand mark pinned to the gallery section. Clicking it morphs the mark
// into a small personal business card (Noah 2026-06-11) — same element,
// layoutId morph, not a swap. Visible only while the gallery is on screen.
export function PinnedLogo() {
  const reduced = useReducedMotion() ?? false;
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const gallery = document.getElementById("work");
    if (!gallery) return;
    // threshold 0 + shrunken root, NOT threshold 0.2: the section's height
    // changes with the open panel, and once 20% of it exceeds a screenful
    // the 0.2 crossing never fires again — the logo got stuck visible over
    // other sections
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-20% 0px", threshold: 0 },
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  // scrolled away from the gallery → the anchor is gone, close the card
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

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
    // visibility lives on this plain wrapper, NOT the motion.button below —
    // the layoutId morph writes an inline opacity that overrides any
    // class-based opacity on the button itself
    <div
      className={`fixed bottom-6 left-6 z-40 hidden transition-opacity duration-300 sm:block ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <AnimatePresence initial={false} mode={reduced ? "wait" : "popLayout"}>
        {open ? (
          <motion.div
            key="card"
            ref={cardRef}
            layoutId={layoutId}
            role="dialog"
            aria-label={`Business card of ${SITE.founder}`}
            className="flex w-[300px] min-h-[180px] flex-col border border-line bg-surface p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
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
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {SITE.email}
                </a>
              )}
              {!isTBD(SITE.instagram) && (
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-accent"
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
            className="block cursor-pointer text-ink/35 transition-colors duration-300 hover:text-ink/70"
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
