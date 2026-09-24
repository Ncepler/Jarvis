"use client";

// The styles section: a decision tool, not a showpiece — a visitor is
// comparing options to pick one, so it needs to be fast to scan. Renders
// React Bits' AccordionGallery (vendored, converted to TS — see
// components/AccordionGallery.tsx) wired to the real style data. Panel
// hover/click expands it (the old chip/thumbnail-select behavior); clicking
// an already-expanded panel follows its `link` to the live demo in a new
// tab (the old "Step inside" fullscreen preview's deepest interaction). The
// "Start with this style" CTA tracks whichever panel is currently expanded
// via AccordionGallery's onActiveIndexChange, same destination as before
// (/start?style=<slug>).

import Link from "next/link";
import { useState } from "react";
import AccordionGallery from "@/components/AccordionGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { COPY } from "@/lib/site";
import { stylePickerEntries } from "@/lib/projects";

export function Gallery() {
  const entries = stylePickerEntries;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = entries[activeIndex] ?? entries[0];

  if (!active) return null;

  const items = entries.map((e) => ({
    image: e.screenshot,
    label: e.label,
    link: e.route,
    alt: `${e.label} website style`,
  }));

  return (
    <section id="work" className="relative border-t border-line py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading a={COPY.headings.gallery.a} b={COPY.headings.gallery.b} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">
            Pick the kind of business you run. See that style, live.
          </p>
        </Reveal>

        <div className="mt-10">
          <AccordionGallery
            items={items}
            defaultIndex={0}
            trigger="hover"
            duration={0.4}
            radius={4}
            height={420}
            accentColor="var(--color-accent)"
            overlayColor="var(--color-ink)"
            textColor="var(--color-surface)"
            linkTarget="_blank"
            onActiveIndexChange={setActiveIndex}
          />
        </div>

        {/* CTA — sits below the gallery, always reflects the expanded panel */}
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted">{active.label}</span>
          <Link
            href={`/start?style=${active.slug}`}
            className="press border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-opacity duration-200 hover:opacity-85"
          >
            Start with this style
          </Link>
        </div>
      </div>
    </section>
  );
}
