"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanHover } from "@/lib/hooks";
import { orderedProjects, type Project } from "@/lib/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GAP = 24;

// What the card shows in the row and in the expanded preview's poster slot.
function CardFace({ project, sizes }: { project: Project; sizes: string }) {
  if (!project.screenshot) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bg">
        <span className="text-sm text-muted">In the works</span>
      </div>
    );
  }
  return (
    <Image
      src={project.screenshot}
      alt={`Screenshot of ${project.name}`}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

function GalleryCard({
  project,
  index,
  x,
  step,
  width,
  isActive,
  hidden,
  reduced,
  onSelect,
}: {
  project: Project;
  index: number;
  x: MotionValue<number>;
  step: number;
  width: number;
  isActive: boolean;
  hidden: boolean;
  reduced: boolean;
  onSelect: (index: number) => void;
}) {
  // 0 when centered, ±1 one slot away — drives the coverflow depth
  const offset = useTransform(x, (v) =>
    Math.min(Math.abs((v + index * step) / step), 1),
  );
  const scale = useTransform(offset, [0, 1], [1, 0.88]);
  const opacity = useTransform(offset, [0, 1], [1, 0.45]);

  return (
    <motion.button
      type="button"
      layoutId={reduced ? undefined : `gallery-${project.slug}`}
      aria-label={`${project.name}, ${project.priceLabel}`}
      className="relative shrink-0 cursor-pointer overflow-hidden border border-line"
      style={
        reduced
          ? { width }
          : { width, scale, opacity, visibility: hidden ? "hidden" : undefined }
      }
      onTap={() => onSelect(index)}
    >
      <div className="relative aspect-[16/10]">
        <CardFace project={project} sizes="(max-width: 768px) 72vw, 400px" />
      </div>
      {/* name + price tag slide in a beat after the card settles */}
      <motion.div
        className="flex items-baseline justify-between gap-3 border-t border-line px-4 py-3 text-left"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
        transition={{
          duration: reduced ? 0 : 0.4,
          delay: isActive && !reduced ? 0.25 : 0,
          ease: EASE,
        }}
      >
        <span className="text-sm">{project.name}</span>
        <span className="shrink-0 text-xs text-muted">
          {project.priceLabel}
        </span>
      </motion.div>
    </motion.button>
  );
}

function ExpandedCard({
  project,
  reduced,
  canHover,
  onClose,
}: {
  project: Project;
  reduced: boolean;
  canHover: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const showIframe = canHover && project.embeddable && project.url;
  const stagger = (i: number) =>
    reduced
      ? { duration: 0.15 }
      : { duration: 0.4, delay: 0.45 + i * 0.08, ease: EASE };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={reduced ? undefined : `gallery-${project.slug}`}
        {...(reduced
          ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
            }
          : {})}
        transition={reduced ? { duration: 0.2 } : { duration: 0.6, ease: EASE }}
        className="w-[min(92vw,1200px)] overflow-hidden border border-line bg-bg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {showIframe ? (
            // live, interactive, scaled-down view of the real site —
            // mounted only while expanded
            <iframe
              src={project.url}
              title={`Live preview of ${project.name}`}
              className="h-[200%] w-[200%] origin-top-left scale-50 border-0"
            />
          ) : (
            <CardFace project={project} sizes="92vw" />
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line px-5 py-4">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(0)}
          >
            {project.name}
          </motion.span>
          <motion.span
            className="text-sm text-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(1)}
          >
            {project.priceLabel}
          </motion.span>

          <span className="ml-auto flex items-baseline gap-6">
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-200 hover:text-muted"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(2)}
              >
                View live →
              </motion.a>
            )}
            {project.isStyleDemo && (
              <motion.a
                href="#contact"
                className="text-sm transition-colors duration-200 hover:text-muted"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(3)}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("preselect-style", {
                      detail: project.slug,
                    }),
                  );
                  onClose();
                }}
              >
                Start with this style →
              </motion.a>
            )}
            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={stagger(4)}
            >
              Close
            </motion.button>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const reduced = useReducedMotion() ?? false;
  const canHover = useCanHover();
  const projects = orderedProjects;

  const regionRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  const [active, setActive] = useState(0);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const cardW = Math.min(containerW * 0.72, 400) || 340;
  const step = cardW + GAP;
  const sidePad = Math.max((containerW - cardW) / 2, 24);

  const x = useMotionValue(0);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setContainerW(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // keep the active card centered when the container resizes
  useEffect(() => {
    x.set(-active * step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const snapTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, index));
      setActive(clamped);
      animate(x, -clamped * step, { duration: 0.6, ease: EASE });
    },
    [projects.length, step, x],
  );

  // where focus was when the preview opened — restored on close (a11y §10)
  const lastTrigger = useRef<HTMLElement | null>(null);

  const openProject = useCallback(
    (project: Project) => {
      if (canHover) {
        lastTrigger.current = document.activeElement as HTMLElement | null;
        setExpandedSlug(project.slug);
      } else if (project.url) {
        // mobile: never iframes — straight to the real site
        window.open(project.url, "_blank", "noopener,noreferrer");
      }
    },
    [canHover],
  );

  // a pointer-up at the end of a drag also lands on a card — ignore it
  const dragging = useRef(false);

  const onSelect = useCallback(
    (index: number) => {
      if (dragging.current) return;
      if (index !== active) {
        snapTo(index);
      } else {
        openProject(projects[index]);
      }
    },
    [active, snapTo, openProject, projects],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      snapTo(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      snapTo(active + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openProject(projects[active]);
    }
  };

  const expanded = projects.find((p) => p.slug === expandedSlug) ?? null;
  const close = useCallback(() => {
    setExpandedSlug(null);
    lastTrigger.current?.focus();
  }, []);

  return (
    <section id="work" className="overflow-hidden border-t border-line py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="font-display text-title">The work</h2>
        <p className="mt-4 max-w-md text-muted">
          Styles we build from, and the sites that came out of them.
        </p>
      </div>

      {reduced ? (
        // reduced motion: flat scrollable row, no coverflow, no drag physics
        <div
          ref={regionRef}
          className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-10"
          aria-label="Portfolio gallery"
        >
          {projects.map((p, i) => (
            <div key={p.slug} className="snap-center">
              <GalleryCard
                project={p}
                index={i}
                x={x}
                step={step}
                width={cardW}
                isActive
                hidden={false}
                reduced
                onSelect={() => openProject(p)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={regionRef}
          tabIndex={0}
          role="group"
          aria-label="Portfolio gallery. Drag or use arrow keys to browse, Enter to open."
          className="mt-16"
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="flex items-start"
            style={{ x, gap: GAP, paddingLeft: sidePad, paddingRight: sidePad }}
            drag="x"
            dragConstraints={{ left: -(projects.length - 1) * step, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => {
              dragging.current = true;
            }}
            onDragEnd={(_, info) => {
              const predicted = -(x.get() + info.velocity.x * 0.25);
              snapTo(Math.round(predicted / step));
              setTimeout(() => {
                dragging.current = false;
              }, 80);
            }}
          >
            {projects.map((p, i) => (
              <GalleryCard
                key={p.slug}
                project={p}
                index={i}
                x={x}
                step={step}
                width={cardW}
                isActive={i === active}
                hidden={expandedSlug === p.slug}
                reduced={false}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <ExpandedCard
            project={expanded}
            reduced={reduced}
            canHover={canHover}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
