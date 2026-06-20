"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { demos } from "@/components/demos";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useCanHover } from "@/lib/hooks";
import { COPY } from "@/lib/site";
import { orderedProjects, type Project } from "@/lib/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const GAP = 24;
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

// The Lusion-style cursor label: a "step inside →" pill that trails the
// pointer with spring inertia while it's over the draggable row. Hover-only,
// motion-only — touch taps the card and reduced motion never mounts this.
function StepInsideCursor({
  x,
  y,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
}) {
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-2 font-mono text-xs tracking-wide text-white shadow-[0_8px_30px_rgba(31,26,20,0.25)]"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        step inside →
      </motion.span>
    </motion.div>
  );
}

// What the card shows in the row — a fast static thumbnail (the demo's hero
// image), NOT a live mini-render. Mounting all 7 full demos at once was the
// "takes a second to load" lag; the live homepage now mounts only on open.
function CardFace({
  project,
  sizes,
}: {
  project: Project;
  sizes: string;
}) {
  if (!project.screenshot) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface">
        <span className="text-sm text-muted">Preview</span>
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
  reduced,
  onSelect,
}: {
  project: Project;
  index: number;
  x: MotionValue<number>;
  step: number;
  width: number;
  isActive: boolean;
  reduced: boolean;
  onSelect: (index: number) => void;
}) {
  // Finite coverflow (Noah 2026-06-20 — a bounded list, not an endless loop):
  // each card sits at its fixed slot offset from the current center; the row
  // simply ends at the first and last card. d is the signed distance in slots.
  const d = useTransform(x, (v) => index - -v / step);
  const tx = useTransform(d, (o) => o * step);
  const mag = useTransform(d, (o) => Math.min(Math.abs(o), 1));
  const scale = useTransform(mag, [0, 1], [1, 0.88]);
  const opacity = useTransform(mag, [0, 1], [1, 0.45]);
  // hide cards far off either edge so they don't paint outside the row
  const display = useTransform(d, (o) => (Math.abs(o) > 2.6 ? "none" : "block"));
  const zIndex = useTransform(mag, (m) => Math.round((1 - m) * 100));

  // hovering the centered card lifts + sharpens it with inertia — the Lusion
  // "the live one comes forward" beat. Neighbours stay quiet.
  const [hovered, setHovered] = useState(false);
  const lift = hovered && isActive && !reduced;

  return (
    <motion.button
      type="button"
      aria-label={`${project.name}, ${project.category}, ${project.priceLabel}`}
      className={
        reduced
          ? "relative shrink-0 cursor-pointer overflow-hidden border border-line bg-surface"
          : "absolute left-1/2 top-0 cursor-pointer overflow-hidden border border-line bg-surface"
      }
      style={
        reduced
          ? { width }
          : { width, marginLeft: -width / 2, x: tx, scale, opacity, display, zIndex }
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={() => onSelect(index)}
    >
      {/* static thumbnail box; the hover lift/sharpen rides an INNER element.
          Opening no longer morphs this box — the live demo slides in below. */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            scale: lift ? 1.04 : 1,
            filter: lift
              ? "saturate(1.08) contrast(1.05)"
              : "saturate(1) contrast(1)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <CardFace
            project={project}
            sizes="(max-width: 768px) 72vw, 480px"
          />
        </motion.div>
      </div>
      {/* category, name + price, caption — slide in a beat after the card
          settles into the center (Axel "Recent work" anatomy) */}
      <motion.div
        className="border-t border-line px-4 py-3 text-left"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
        transition={{
          duration: reduced ? 0 : 0.4,
          delay: isActive && !reduced ? 0.25 : 0,
          ease: EASE,
        }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {project.category}
        </span>
        <span className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-sm">{project.name}</span>
          <span className="shrink-0 text-xs text-accent">
            {project.priceLabel}
          </span>
        </span>
        <span className="mt-1 block text-xs text-muted">{project.caption}</span>
      </motion.div>
    </motion.button>
  );
}

// The opened card's homepage. Clicking the centered card slides this panel up
// into the page below the row — the live, interactive demo mounts here (and
// ONLY here, so the row stays light). It stays physically in the page flow (no
// floating window, §6.3): the visitor scrolls our page straight through it.
// Source order: registered demo (inline, no iframe) → mirror → live iframe →
// capture.
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
  const Demo = demos[project.slug];
  const frameSrc =
    project.preview ||
    (canHover && project.embeddable && project.url ? project.url : "");
  const stagger = (i: number) =>
    reduced
      ? { duration: 0.15 }
      : { duration: 0.4, delay: 0.3 + i * 0.07, ease: EASE };

  return (
    // the whole panel slides up into place like a drawer pulling open
    // (Noah 2026-06-20 — replaced the tall layoutId FLIP morph)
    <motion.div
      role="region"
      aria-label={`${project.name} homepage`}
      className="w-full"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: reduced ? 0 : 24,
        transition: { duration: 0.2, ease: EASE },
      }}
      transition={reduced ? { duration: 0.2 } : { duration: 0.55, ease: EASE }}
    >
      <div className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4 md:px-10">
          <motion.span
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(0)}
          >
            {project.category}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(1)}
          >
            {project.name}
          </motion.span>
          <motion.span
            className="text-sm text-accent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(2)}
          >
            {project.priceLabel}
          </motion.span>

          <span className="ml-auto flex items-baseline gap-6">
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-200 hover:text-accent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(3)}
              >
                View live →
              </motion.a>
            )}
            {project.isStyleDemo && (
              <motion.a
                href="#contact"
                className="text-sm text-accent transition-colors duration-200 hover:text-ink"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={stagger(4)}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("preselect-style", { detail: project.slug }),
                  );
                }}
              >
                Start with this style →
              </motion.a>
            )}
            <motion.button
              type="button"
              onClick={onClose}
              className="press cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(5)}
            >
              Close ✕
            </motion.button>
          </span>
        </div>
      </div>

      {/* slim gutter of our own bg + hairline around the homepage — a quiet
          reminder you're browsing it from inside this site (Noah 2026-06-11) */}
      <div className="border-b border-line bg-bg p-3 md:px-6 md:py-5">
        <div className="overflow-hidden border border-line bg-surface">
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
              Preview unavailable
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);
  // which card has been opened into its full demo (null = row only; the
  // thumbnails are static hero images until you step inside one)
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const cardW = Math.min(containerW * 0.72, 480) || 340;
  const step = cardW + GAP;
  const count = projects.length;
  // absolute-positioned coverflow needs an explicit row height (media 16:10 +
  // the name/caption footer)
  const rowHeight = Math.round(cardW * 0.625) + 108;

  const x = useMotionValue(0);
  // current center slot index, clamped to [0, count-1] (finite row); kept so a
  // resize re-centers on the same card
  const virtualRef = useRef(0);
  // the row is bounded: x runs from 0 (first card centered) to the last card
  const minX = -(count - 1) * step;

  // raw pointer position for the trailing "step inside →" cursor label
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [cursorOn, setCursorOn] = useState(false);

  // which card is nearest center RIGHT NOW — tracks continuously during the
  // drag (not just on snap) so the backdrop and labels follow the scroll
  const [centerIdx, setCenterIdx] = useState(0);
  useMotionValueEvent(x, "change", (v) => {
    const i = clamp(Math.round(-v / step), 0, count - 1);
    virtualRef.current = i;
    if (i !== centerIdx) setCenterIdx(i);
  });

  // the panel follows the center with a short settle delay, so flinging
  // across the row doesn't mount and unmount every homepage in between
  const [panelIdx, setPanelIdx] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPanelIdx(centerIdx), 160);
    return () => clearTimeout(t);
  }, [centerIdx]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setContainerW(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // keep the centered card centered when the container resizes
  useEffect(() => {
    x.set(-virtualRef.current * step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // snap to a slot, clamped to the finite range [0, count-1]
  const snapTo = useCallback(
    (slot: number) => {
      const i = clamp(slot, 0, count - 1);
      virtualRef.current = i;
      animate(x, -i * step, { duration: 0.6, ease: EASE });
    },
    [step, x, count],
  );

  // open the centered card: mount its live demo in the panel below, which
  // slides up, then bring it into view. the short delay lets the panel mount
  // before we scroll to it.
  const openCard = useCallback(
    (index: number) => {
      const p = projects[index];
      if (!p) return;
      setOpenSlug(p.slug);
      window.setTimeout(
        () =>
          panelRef.current?.scrollIntoView({
            behavior: reduced ? "auto" : "smooth",
            block: "nearest",
          }),
        reduced ? 0 : 90,
      );
    },
    [projects, reduced],
  );

  const closeCard = useCallback(() => {
    setOpenSlug(null);
    regionRef.current?.focus();
  }, []);

  // the "Every site" index (AllSites) dispatches this to step straight into a
  // demo: center that card, then open it into its live panel.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      const idx = projects.findIndex((p) => p.slug === slug);
      if (idx < 0) return;
      snapTo(idx);
      window.setTimeout(() => openCard(idx), reduced ? 0 : 420);
    };
    window.addEventListener("vilas:open-demo", onOpen as EventListener);
    return () =>
      window.removeEventListener("vilas:open-demo", onOpen as EventListener);
  }, [projects, snapTo, openCard, reduced]);

  // a pointer-up at the end of a drag also lands on a card — ignore it
  const dragging = useRef(false);

  const onSelect = useCallback(
    (index: number) => {
      if (dragging.current) return;
      const center = clamp(Math.round(-x.get() / step), 0, count - 1);
      // the centered card steps inside; a side card just centers itself
      if (index === center) openCard(index);
      else snapTo(index);
    },
    [snapTo, openCard, x, step, count],
  );

  // manual drag: we drive `x` ourselves so each card can self-position and wrap
  // around infinitely. (Motion's built-in drag writes its own transform, which
  // would double up with the per-card wrap math.)
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startClient: number;
    lastClient: number;
    lastT: number;
    v: number;
    moved: boolean;
    move?: (e: PointerEvent) => void;
    up?: () => void;
  }>({ active: false, startX: 0, startClient: 0, lastClient: 0, lastT: 0, v: 0, moved: false });

  const startDrag = (e: React.PointerEvent) => {
    if (reduced) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = dragState.current;
    s.active = true;
    s.moved = false;
    s.startX = x.get();
    s.startClient = e.clientX;
    s.lastClient = e.clientX;
    s.lastT = performance.now();
    s.v = 0;

    const move = (ev: PointerEvent) => {
      if (!s.active) return;
      const dx = ev.clientX - s.startClient;
      if (!s.moved && Math.abs(dx) > 4) {
        s.moved = true;
        dragging.current = true;
        setOpenSlug(null); // browsing the row closes the open demo
      }
      // finite row: past either end, resist with a soft rubber-band so the
      // drag clearly "hits" a boundary instead of scrolling on forever
      const raw = s.startX + dx;
      const over = raw > 0 ? raw : raw < minX ? raw - minX : 0;
      x.set(raw - over + over * 0.35);
      const now = performance.now();
      const dt = now - s.lastT;
      if (dt > 0) s.v = ((ev.clientX - s.lastClient) / dt) * 1000;
      s.lastClient = ev.clientX;
      s.lastT = now;
    };
    const up = () => {
      s.active = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const predicted = x.get() + s.v * 0.2; // flick momentum
      snapTo(Math.round(-predicted / step));
      if (s.moved) setTimeout(() => (dragging.current = false), 60);
    };
    s.move = move;
    s.up = up;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // clean up listeners if we unmount mid-drag
  useEffect(
    () => () => {
      const s = dragState.current;
      if (s.move) window.removeEventListener("pointermove", s.move);
      if (s.up) window.removeEventListener("pointerup", s.up);
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const vc = Math.round(-x.get() / step);
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      snapTo(vc - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      snapTo(vc + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openCard(centerIdx);
    } else if (e.key === "Escape" && openSlug) {
      e.preventDefault();
      closeCard();
    }
  };

  // the ambient backdrop follows the settled center index (not the live drag
  // index) so a fling across the row doesn't mount every demo in between
  const backdrop = projects[panelIdx];
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-line py-24 md:py-40"
    >
      {/* the active site's homepage fills the screen behind the row,
          crossfading as cards settle in the center. Clipped to the first
          screenful — past that the open panel shows the same homepage for
          real, and a dimmed copy bleeding behind it reads as a duplicate */}
      {!reduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-svh overflow-hidden"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={backdrop.slug}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {backdrop.screenshot && (
                <Image
                  src={backdrop.screenshot}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover object-top opacity-25"
                />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-b from-bg via-bg/40 to-bg" />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          eyebrow="The work"
          a={COPY.headings.gallery.a}
          b={COPY.headings.gallery.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">
            Styles we build from, and the sites that came out of them. Drag
            through and step inside one.
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
                reduced
                onSelect={() => openCard(i)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={regionRef}
          tabIndex={0}
          role="group"
          aria-label="Portfolio gallery. Drag or use arrow keys to browse; the centered site opens below."
          className={`relative mt-16 touch-pan-y select-none ${canHover ? "md:cursor-none" : ""}`}
          // The cards are positioned by motion values that only apply after
          // hydration + the first width measure; until then they'd pile up at
          // the row's origin (a visible flash of stacked demos). containerW is 0
          // through SSR, so this ships opacity:0 in the HTML and fades the row in
          // once it's actually measured and laid out.
          style={{
            height: rowHeight,
            opacity: containerW > 0 ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
          onKeyDown={onKeyDown}
          onPointerDown={startDrag}
          onPointerMove={(e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setCursorOn(true);
          }}
          onPointerLeave={() => setCursorOn(false)}
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
              reduced={false}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* mode="wait" would delay the slide-in; let the panel mount immediately
          and animate its own entrance */}
      <div ref={panelRef} className="relative mt-12 scroll-mt-6">
        <AnimatePresence initial={false}>
          {openProject ? (
            <HomepagePanel
              key={openProject.slug}
              project={openProject}
              reduced={reduced}
              canHover={canHover}
              onClose={closeCard}
            />
          ) : (
            <motion.p
              key="hint"
              className="px-6 text-center text-sm text-muted md:px-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              {canHover
                ? "Click the centered card to step inside."
                : "Tap a card to step inside."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {canHover && !reduced && (
        <StepInsideCursor x={cursorX} y={cursorY} visible={cursorOn} />
      )}
    </section>
  );
}
