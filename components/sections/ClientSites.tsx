"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import type { ClientSite } from "@/lib/clientSites";

// The hero is rendered full-size and scaled down to fit the tile, so it reads
// like a real live window rather than a cropped screenshot.
const FRAME_W = 1440;
const FRAME_H = 900;
const LOAD_TIMEOUT_MS = 4000;

function label(site: ClientSite) {
  return site.build_type === "custom"
    ? "Custom"
    : `Built from the ${site.style_name} style`;
}

// True once past the md breakpoint. Starts `false` (mobile-first: no iframe
// until we know better) so a server-rendered tile never ships an iframe that
// a phone then has to tear down.
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setDesktop(mq.matches);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

function ScreenshotOrCard({ site }: { site: ClientSite }) {
  if (site.screenshot_url) {
    return (
      // A screenshot's intrinsic size is unknown (Noah pastes in whatever he
      // captures), same reasoning as Gallery.tsx's screenshotFull fallback.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={site.screenshot_url}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover object-top"
      />
    );
  }
  // No live embed and no screenshot — a blocked embed must never render as
  // an empty box, so this is the last resort: name + a plain link.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface px-4 text-center">
      <span className="text-sm text-ink">{site.name}</span>
      <span className="text-xs text-accent">Visit site →</span>
    </div>
  );
}

// The live embed: full-size iframe, scaled down with a CSS transform to fit
// the tile. `pointer-events: none` on the iframe means the wrapping <a> is
// what's clickable and what the page scrolls over — the embedded site never
// steals the scroll or the click.
function LiveFrame({
  site,
  loaded,
  onBlocked,
  onLoaded,
}: {
  site: ClientSite;
  loaded: boolean;
  onBlocked: () => void;
  onLoaded: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / FRAME_W),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // Some sites send X-Frame-Options: DENY or a frame-ancestors CSP and
    // simply refuse to render — there's no reliable cross-origin signal for
    // that, so a load timeout stands in for one. If `load` hasn't fired by
    // then, treat the embed as blocked and fall back.
    const t = window.setTimeout(onBlocked, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-500"
      // Stays invisible (but mounted, so `load` can still fire) until it's
      // actually ready — otherwise a still-loading iframe paints blank white
      // over the screenshot sitting underneath it.
      style={{ opacity: loaded ? 1 : 0 }}
    >
      {scale > 0 && (
        <iframe
          src={site.url}
          title=""
          tabIndex={-1}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onLoad={onLoaded}
          className="pointer-events-none origin-top-left border-0"
          style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}

type Status = "idle" | "loaded" | "blocked";

function Tile({ site }: { site: ClientSite }) {
  const desktop = useIsDesktop();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [nearView, setNearView] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  // Mount the iframe only once the tile is close to the viewport — three
  // live embeds loading at once on page load is too heavy.
  useEffect(() => {
    if (!desktop) return;
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [desktop]);

  const mountLiveFrame = desktop && nearView && status !== "blocked";

  return (
    <a
      ref={cardRef}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[16/10] w-[min(78vw,340px)] shrink-0 overflow-hidden border border-line bg-surface"
    >
      {/* The screenshot (or the plain card) is always the base layer, so a
          blocked or still-loading embed is never an empty box. */}
      <div className="absolute inset-0">
        <ScreenshotOrCard site={site} />
      </div>
      {mountLiveFrame && (
        <LiveFrame
          site={site}
          loaded={status === "loaded"}
          onLoaded={() => setStatus("loaded")}
          onBlocked={() => setStatus((s) => (s === "loaded" ? s : "blocked"))}
        />
      )}
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
  if (sites.length === 0) return null;

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
            {sites.map((site) => (
              <Tile key={site.id} site={site} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
