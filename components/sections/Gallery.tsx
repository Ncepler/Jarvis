"use client";

// The styles section: a picker, not a gallery (Styles section ticket).
// A visitor self-identifies by business type (the chip row), sees one style
// at a time in a fixed-height stage, and the CTA never leaves the section.
// Proof is the live embed: a screenshot on load, a real scrollable iframe of
// the actual demo route once the visitor acts on it.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { useCanHover } from "@/lib/hooks";
import { COPY } from "@/lib/site";
import { stylePickerEntries, type StylePickerEntry } from "@/lib/projects";

type Device = "desktop" | "phone";

// The stage: screenshot first (free to render, costs nothing on load),
// swapping to a real same-origin iframe once the visitor activates it — on
// hover for pointer devices, on tap of "Preview it live" for touch. Only one
// style's frame exists at a time (this component itself), so switching
// styles is what unmounts the previous iframe. Minimal chrome: no fake
// traffic lights, no fake URL bar — the one real control is the device width.
function Stage({
  entry,
  device,
  live,
  loaded,
  canHover,
  onActivate,
  onDeviceChange,
}: {
  entry: StylePickerEntry;
  device: Device;
  live: boolean;
  loaded: boolean;
  canHover: boolean;
  onActivate: () => void;
  onDeviceChange: (d: Device) => void;
}) {
  const frameStyle =
    device === "phone"
      ? { width: 320, aspectRatio: "9 / 16" }
      : { width: "100%", maxWidth: 720, aspectRatio: "16 / 10" };

  return (
    <div className="mx-auto max-w-3xl border border-line bg-surface">
      {/* chrome strip: structure, not decoration — just the device control */}
      <div className="flex items-center justify-end gap-1 border-b border-line px-3 py-2">
        <div role="group" aria-label="Preview width" className="flex gap-1">
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => onDeviceChange("desktop")}
            className={`press px-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
              device === "desktop" ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={device === "phone"}
            onClick={() => onDeviceChange("phone")}
            className={`press px-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
              device === "phone" ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            Phone
          </button>
        </div>
      </div>

      <div
        className="relative mx-auto overflow-hidden bg-bg"
        style={frameStyle}
        onMouseEnter={canHover && !live ? onActivate : undefined}
      >
        {live && (
          <iframe
            key={entry.slug}
            src={entry.route}
            title={`${entry.label} style, live preview`}
            className="h-full w-full border-0"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms var(--ease-out-expo)" }}
          />
        )}
        {!live && entry.screenshot && (
          <Image
            src={entry.screenshot}
            alt={`${entry.label} website style`}
            fill
            sizes="(max-width: 768px) 90vw, 720px"
            className="object-cover object-top"
          />
        )}
        {!live && !entry.screenshot && (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            Preview
          </div>
        )}
        {!live && !canHover && (
          <button
            type="button"
            onClick={onActivate}
            className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-200 hover:bg-ink/10"
          >
            <span className="press border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink">
              Preview it live
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function Gallery() {
  const canHover = useCanHover();
  const entries = stylePickerEntries;
  const [activeSlug, setActiveSlug] = useState(entries[0]?.slug ?? "");
  const [device, setDevice] = useState<Device>("desktop");
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const active = entries.find((e) => e.slug === activeSlug) ?? entries[0];

  const selectStyle = (slug: string) => {
    if (slug === activeSlug) return;
    setActiveSlug(slug);
    setLive(false);
    setLoaded(false);
  };

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
          <Stage
            entry={active}
            device={device}
            live={live}
            loaded={loaded}
            canHover={canHover}
            onActivate={() => {
              setLive(true);
              setLoaded(true);
            }}
            onDeviceChange={setDevice}
          />
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
    </section>
  );
}
