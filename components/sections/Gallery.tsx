"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { demos } from "@/components/demos";
import { Reveal } from "@/components/Reveal";
import { useCanHover } from "@/lib/hooks";
import { orderedProjects, type Project } from "@/lib/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GAP = 24;
const DEMO_DESIGN_W = 1280; // inline demos are laid out at this width, then scaled

// The real demo component scaled down to fit a container — a live
// thumbnail, not a screenshot.
function DemoScaled({
  slug,
  width,
}: {
  slug: string;
  width: number;
}) {
  const Demo = demos[slug];
  if (!Demo || width <= 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        style={{
          width: DEMO_DESIGN_W,
          transform: `scale(${width / DEMO_DESIGN_W})`,
          transformOrigin: "top left",
        }}
      >
        <Demo />
      </div>
    </div>
  );
}

// What the card shows in the row.
function CardFace({
  project,
  width,
  sizes,
}: {
  project: Project;
  width: number;
  sizes: string;
}) {
  if (demos[project.slug]) {
    return <DemoScaled slug={project.slug} width={width} />;
  }
  if (!project.screenshot) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface">
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

// Same-origin mirrored pages: size the iframe to its full content height so
// it reads as one continuous page — the visitor scrolls OUR page and flows
// straight through the demo, no inner scrollbar, no tab-in-a-tab. The
// cross-origin live fallback can't be measured and stays a fixed window.
function AutoFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let ro: ResizeObserver | null = null;
    const measure = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc) return;
        const h = Math.max(
          doc.documentElement?.scrollHeight ?? 0,
          doc.body?.scrollHeight ?? 0,
        );
        if (h > 200) setHeight(h);
      } catch {
        // cross-origin — keep the fixed-height fallback
      }
    };
    const onLoad = () => {
      measure();
      try {
        const body = frame.contentDocument?.body;
        if (body) {
          ro = new ResizeObserver(measure);
          ro.observe(body);
        }
      } catch {
        // cross-origin
      }
    };
    frame.addEventListener("load", onLoad);
    if (frame.contentDocument?.readyState === "complete") onLoad();
    return () => {
      frame.removeEventListener("load", onLoad);
      ro?.disconnect();
    };
  }, [src]);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      // mirrored copies run the original site's scripts — sandbox without
      // allow-top-navigation so frame-busting can't hijack our page
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      scrolling={height ? "no" : "yes"}
      className="block w-full border-0"
      style={{ height: height || "85vh" }}
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
  isOpen,
  reduced,
  onSelect,
}: {
  project: Project;
  index: number;
  x: MotionValue<number>;
  step: number;
  width: number;
  isActive: boolean;
  isOpen: boolean;
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
      aria-label={`${project.name}, ${project.priceLabel}`}
      aria-expanded={isOpen}
      className="relative shrink-0 cursor-pointer overflow-hidden border border-line bg-surface"
      style={reduced ? { width } : { width, scale, opacity }}
      onTap={() => onSelect(index)}
    >
      <div className="relative aspect-[16/10]">
        <CardFace
          project={project}
          width={width}
          sizes="(max-width: 768px) 72vw, 480px"
        />
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

// The selected card's homepage, full-bleed below the row, physically part
// of this page. Source order: registered demo component (rendered inline,
// no iframe at all) → mirrored copy from /public/previews in a seamless
// auto-height frame → live iframe of the real URL (desktop, embeddable
// sites only) → full-length capture.
function HomepagePanel({
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
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project.slug, reduced, onClose]);

  const Demo = demos[project.slug];
  const frameSrc =
    project.preview ||
    (canHover && project.embeddable && project.url ? project.url : "");
  const stagger = (i: number) =>
    reduced
      ? { duration: 0.15 }
      : { duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE };

  return (
    <motion.div
      ref={ref}
      role="region"
      aria-label={`${project.name} homepage`}
      className="mt-12 w-full scroll-mt-6"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={reduced ? { duration: 0.2 } : { duration: 0.6, ease: EASE }}
    >
      <div className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4 md:px-10">
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
                  new CustomEvent("preselect-style", { detail: project.slug }),
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
      </div>

      {/* slim gutter of our own bg + hairline around the homepage — a quiet
          reminder you're browsing it from inside this site (Noah 2026-06-11) */}
      <div className="border-b border-line bg-bg p-3 md:px-6 md:py-5">
        <div className="overflow-hidden border border-line">
          {Demo ? (
            // our own build — the homepage IS part of this page, no iframe
            <Demo />
          ) : frameSrc ? (
            <AutoFrame src={frameSrc} title={`Homepage of ${project.name}`} />
          ) : project.screenshotFull ? (
            // full-page capture has an unknown intrinsic height, which next/image requires
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.screenshotFull}
              alt={`Full homepage of ${project.name}`}
              className="w-full"
              loading="lazy"
            />
          ) : (
            <div className="flex h-[40vh] items-center justify-center text-sm text-muted">
              In the works
            </div>
          )}
        </div>
      </div>
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

  const cardW = Math.min(containerW * 0.72, 480) || 340;
  const step = cardW + GAP;
  const sidePad = Math.max((containerW - cardW) / 2, 24);

  const x = useMotionValue(0);

  // which card is nearest center RIGHT NOW — tracks continuously during the
  // drag (not just on snap) so the backdrop and labels follow the scroll
  const [centerIdx, setCenterIdx] = useState(0);
  useMotionValueEvent(x, "change", (v) => {
    const i = Math.max(0, Math.min(projects.length - 1, Math.round(-v / step)));
    if (i !== centerIdx) setCenterIdx(i);
  });

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

  const toggleProject = useCallback((project: Project) => {
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setExpandedSlug((s) => (s === project.slug ? null : project.slug));
  }, []);

  // a pointer-up at the end of a drag also lands on a card — ignore it
  const dragging = useRef(false);

  const onSelect = useCallback(
    (index: number) => {
      if (dragging.current) return;
      if (index !== active) {
        snapTo(index);
      } else {
        toggleProject(projects[index]);
      }
    },
    [active, snapTo, toggleProject, projects],
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
      toggleProject(projects[active]);
    }
  };

  const expanded = projects.find((p) => p.slug === expandedSlug) ?? null;
  const close = useCallback(() => {
    setExpandedSlug(null);
    lastTrigger.current?.focus();
  }, []);

  const backdrop = projects[centerIdx];

  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-line py-24 md:py-40"
    >
      {/* the active site's homepage fills the screen behind the row,
          crossfading as cards pass through center */}
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={backdrop.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {backdrop.screenshot ? (
                <Image
                  src={backdrop.screenshot}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-top opacity-25"
                />
              ) : (
                <div className="absolute inset-0 opacity-25">
                  <DemoScaled slug={backdrop.slug} width={containerW} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-b from-bg via-bg/40 to-bg" />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <h2 className="font-display text-title">The work</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted">
            Styles we build from, and the sites that came out of them.
          </p>
        </Reveal>
      </div>

      {reduced ? (
        // reduced motion: flat scrollable row, no coverflow, no drag physics
        <div
          ref={regionRef}
          className="relative mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-10"
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
                isOpen={expandedSlug === p.slug}
                reduced
                onSelect={() => toggleProject(p)}
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
          className="relative mt-16"
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
                isActive={i === centerIdx}
                isOpen={expandedSlug === p.slug}
                reduced={false}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        </div>
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          {expanded && (
            <HomepagePanel
              key={expanded.slug}
              project={expanded}
              reduced={reduced}
              canHover={canHover}
              onClose={close}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
