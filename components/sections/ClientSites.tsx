"use client";

import Image from "next/image";
import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import type { ClientSite } from "@/lib/clientSites";

// A 1x1 warm-neutral pixel, inline — a real blur/shimmer placeholder without
// shipping a separate asset or computing a blurhash per screenshot.
const BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAANvj4wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

function label(site: ClientSite) {
  return site.build_type === "custom"
    ? "Custom"
    : `Built from the ${site.style_name} style`;
}

// The screenshot fills the tile, anchored to the top so the hero — not
// whatever's below the fold — is what shows. Round 2, job 4: this replaced
// an iframe embed that rendered as a blank white card on every tile, because
// there's no reliable way to detect a blocked cross-origin iframe from JS
// (`onload` can fire even when the frame was refused). A generated capture
// (lib/screenshot.ts) goes through next/image; a hand-pasted `screenshot_url`
// can point anywhere, so it renders as a plain <img> instead — next/image
// requires the host to be allow-listed ahead of time, which a value Noah
// pastes in later can't satisfy.
function Shot({ site }: { site: ClientSite }) {
  const [loaded, setLoaded] = useState(false);
  const image = site.image;
  if (!image) return null;

  return (
    <>
      {/* Skeleton stays under the image until it reports loaded, instead of
          a blank tile or the old white "Visit site" card. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-pulse bg-line"
        style={{ opacity: loaded ? 0 : 1, transition: "opacity 300ms ease" }}
      />
      {image.manual ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.url}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover object-top"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
        />
      ) : (
        <Image
          src={image.url}
          alt=""
          fill
          sizes="(min-width: 768px) 340px, 78vw"
          className="object-cover object-top"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
        />
      )}
    </>
  );
}

// Whole tile is a link — no separate "Visit site" affordance needed once the
// screenshot itself is the tile. Sites with no image at all (no manual
// override, never captured) render nothing: a missing image is hidden, never
// an empty box (ticket rule).
function Tile({ site }: { site: ClientSite }) {
  if (!site.image) return null;

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[16/10] w-[min(78vw,340px)] shrink-0 overflow-hidden border border-line bg-surface"
    >
      <Shot site={site} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent p-4 pt-10">
        <span className="block text-sm font-medium text-bg">{site.name}</span>
        <span className="mt-1 inline-block border border-bg/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bg/90">
          {label(site)}
        </span>
      </div>
    </a>
  );
}

// "Out in the world" — real client sites, replacing the old before/after
// section. A horizontally scrolling grid, two rows tall, columns filling
// top-to-bottom then left-to-right (native CSS grid: grid-auto-flow: column
// + an explicit two-row template), so it works with any number of sites with
// no code changes. Renders nothing if there's nothing published yet — the
// site never fabricates a client site to fill the space (CLAUDE.md §7).
export function ClientSites({ sites }: { sites: ClientSite[] }) {
  const reduced = useReducedMotion();
  const withImages = sites.filter((s) => s.image);
  if (withImages.length === 0) return null;

  return (
    <section className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Out in the world"
          a={COPY.headings.clientSites.a}
          b={COPY.headings.clientSites.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">{COPY.clientSites.sub}</p>
        </Reveal>
      </div>

      <Reveal delay={0.14}>
        <div
          className="mt-16 overflow-x-auto px-6 pb-2 md:px-10"
          style={reduced ? undefined : { scrollBehavior: "smooth" }}
        >
          <div
            className="grid gap-5"
            style={{
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(2, 1fr)",
              gridAutoColumns: "min(78vw, 340px)",
            }}
          >
            {withImages.map((site) => (
              <Tile key={site.id} site={site} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
