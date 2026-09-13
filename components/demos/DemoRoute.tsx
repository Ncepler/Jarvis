"use client";

// Holds the tier state for one demo route and renders the Vilas chrome above
// it (Demo bar ticket, job 1/3/5). Defaults to "basic" on every load —
// deliberately not persisted (localStorage, URL, anything) so a fresh visit
// to any demo always starts at $300 and the visitor watches it get better.

import { useState } from "react";
import { demos } from "./index";
import { DEMO_BAR_OFFSET_CLASS, VilasDemoBar, type Tier } from "./VilasDemoBar";

// Looks up the demo itself (rather than receiving it as a prop) — a
// component reference can't cross the server/client boundary as a plain
// prop, so DemoRoute, a Client Component, resolves the slug from the same
// map app/demos/[slug]/page.tsx already used to validate it.
export function DemoRoute({ slug }: { slug: string }) {
  const [tier, setTier] = useState<Tier>("basic");
  const Demo = demos[slug];
  if (!Demo) return null;
  return (
    <>
      <VilasDemoBar slug={slug} tier={tier} onChange={setTier} />
      <div className={DEMO_BAR_OFFSET_CLASS}>
        <Demo tier={tier} />
      </div>
    </>
  );
}
