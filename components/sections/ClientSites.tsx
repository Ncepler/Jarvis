"use client";

import InfiniteMenu from "@/components/InfiniteMenu";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import type { ClientSite } from "@/lib/clientSites";

function label(site: ClientSite) {
  return site.build_type === "custom" ? "Custom" : `Built from the ${site.style_name} style`;
}

// "Out in the world" — real client sites. This is the flex, not a decision
// tool: React Bits' InfiniteMenu (vendored, converted to TS — see
// components/InfiniteMenu.tsx), a draggable sphere of live sites. Clicking
// (InfiniteMenu's own action button) opens the site's real URL in a new
// tab — same destination the old plain-grid tile's <a target="_blank">
// used. Renders nothing if there's nothing published yet — the site never
// fabricates a client site to fill the space (CLAUDE.md §7).
export function ClientSites({ sites }: { sites: ClientSite[] }) {
  const withImages = sites.filter((s) => s.image);
  if (withImages.length === 0) return null;

  const items = withImages.map((site) => ({
    image: site.image!.url,
    link: site.url,
    title: site.name,
    description: label(site),
  }));

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
        <div className="client-sites-menu relative mx-auto mt-16 h-[70vh] max-h-[720px] min-h-[420px] max-w-6xl border border-line">
          <InfiniteMenu items={items} backgroundColor="var(--color-surface)" />
        </div>
      </Reveal>
    </section>
  );
}
