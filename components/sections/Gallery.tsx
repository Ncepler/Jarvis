"use client";

// The styles section: a picker, not a gallery (Styles section ticket).
// A visitor self-identifies by business type (the chip row), sees one style
// at a time as a screenshot, and steps inside a FULLSCREEN live preview when
// they want proof — never a small embedded iframe sitting inside the page's
// own scroll (that fought the page scroll, Noah 2026-09-05). Fullscreen is
// its own scroll context with the page locked behind it, so there's exactly
// one thing on screen that can scroll at a time.

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { COPY } from "@/lib/site";
import { stylePickerEntries, type StylePickerEntry } from "@/lib/projects";

type Device = "desktop" | "phone";

// The inline stage: always just a screenshot (free on load, never an iframe
// sitting in the page's own scroll) plus a "Step inside" affordance that
// opens the fullscreen preview. Same on every device — no hover branching.
function Stage({
  entry,
  onOpen,
}: {
  entry: StylePickerEntry;
  onOpen: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl border border-line bg-surface">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block aspect-[16/10] w-full overflow-hidden bg-bg"
      >
        {entry.screenshot ? (
          <Image
            src={entry.screenshot}
            alt={`${entry.label} website style`}
            fill
            sizes="(max-width: 768px) 90vw, 720px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            Preview
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-200 group-hover:bg-ink/10"
        >
          <span className="press border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Step inside →
          </span>
        </span>
      </button>
    </div>
  );
}

// Fullscreen live preview: the ONLY place an iframe of the real demo route
// ever mounts. Takes over the whole viewport (own scroll context, page
// scroll locked behind it), so scrolling near the preview never bleeds into
// the Vilas page. Exit is a floating button, bottom-right, that exists only
// while this is open.
function FullscreenPreview({
  entry,
  onClose,
}: {
  entry: StylePickerEntry;
  onClose: () => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const exitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    exitRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.label} style, live preview`}
      className="fixed inset-0 z-50 flex flex-col bg-bg"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="text-sm font-semibold text-ink">{entry.label}</span>
        <div role="group" aria-label="Preview width" className="flex gap-1">
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
            className={`press px-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
              device === "desktop" ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={device === "phone"}
            onClick={() => setDevice("phone")}
            className={`press px-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
              device === "phone" ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Phone
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden bg-line/40">
        <iframe
          src={entry.route}
          title={`${entry.label} style, live preview`}
          className="h-full border-0 bg-bg"
          style={device === "phone" ? { width: 390 } : { width: "100%" }}
        />
      </div>

      {/* the exit affordance — sticky bottom-right, only exists while open */}
      <button
        ref={exitRef}
        type="button"
        onClick={onClose}
        className="press fixed bottom-6 right-6 z-50 border border-line bg-ink px-5 py-3 text-sm font-semibold text-surface shadow-[0_12px_30px_rgba(20,17,12,0.25)] transition-opacity duration-200 hover:opacity-90"
      >
        Exit ✕
      </button>
    </div>
  );
}

export function Gallery() {
  const entries = stylePickerEntries;
  const [activeSlug, setActiveSlug] = useState(entries[0]?.slug ?? "");
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const openTriggerRef = useRef<HTMLElement | null>(null);

  const active = entries.find((e) => e.slug === activeSlug) ?? entries[0];

  const selectStyle = (slug: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
  };

  const openPreview = useCallback((trigger?: HTMLElement | null) => {
    openTriggerRef.current = trigger ?? document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setOpen(false);
    openTriggerRef.current?.focus();
  }, []);

  // keep the rail's active thumbnail in view when a chip picks a style
  // that's scrolled off-screen in the rail
  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>(
      `[data-slug="${activeSlug}"]`,
    );
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeSlug]);

  const onChipKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? Math.min(i + 1, entries.length - 1) : Math.max(i - 1, 0);
    const slug = entries[next]?.slug;
    if (!slug) return;
    selectStyle(slug);
    document.getElementById(`style-chip-${slug}`)?.focus();
  };

  if (!active) return null;

  return (
    <section id="work" className="relative border-t border-line py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading a={COPY.headings.gallery.a} b={COPY.headings.gallery.b} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">
            Pick the kind of business you run. See that style, live.
          </p>
        </Reveal>

        {/* business-type chips — self-identification, the important control */}
        <div
          role="tablist"
          aria-label="Business type"
          className="no-scrollbar mt-10 -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          {entries.map((e, i) => {
            const selected = e.slug === activeSlug;
            return (
              <button
                key={e.slug}
                id={`style-chip-${e.slug}`}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectStyle(e.slug)}
                onKeyDown={(ev) => onChipKeyDown(ev, i)}
                className={`shrink-0 whitespace-nowrap border px-4 py-2 text-sm transition-colors duration-200 ${
                  selected
                    ? "border-ink bg-ink text-surface"
                    : "border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {e.label}
              </button>
            );
          })}
        </div>

        {/* stage */}
        <div className="mt-8">
          <Stage entry={active} onOpen={(e) => openPreview(e.currentTarget)} />
        </div>

        {/* CTA — sits with the stage, always reflects the selected style */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted">{active.label}</span>
          <Link
            href={`/start?style=${active.slug}`}
            className="press border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-opacity duration-200 hover:opacity-85"
          >
            Start with this style
          </Link>
        </div>

        {/* thumbnail rail — stays in sync with the chips; either one drives
            the same state */}
        <div
          ref={railRef}
          role="group"
          aria-label="Style thumbnails"
          className="no-scrollbar mt-8 -mx-6 flex gap-3 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          {entries.map((e) => {
            const selected = e.slug === activeSlug;
            return (
              <button
                key={e.slug}
                data-slug={e.slug}
                type="button"
                aria-current={selected}
                aria-label={e.label}
                onClick={() => selectStyle(e.slug)}
                className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden border sm:w-28 ${
                  selected ? "border-ink" : "border-line"
                }`}
              >
                {e.screenshot ? (
                  <Image src={e.screenshot} alt="" fill sizes="112px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-muted">
                    {e.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {open && <FullscreenPreview entry={active} onClose={closePreview} />}
    </section>
  );
}
