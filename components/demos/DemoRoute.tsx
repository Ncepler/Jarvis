"use client";

// Holds the tier state for one demo route and renders the Vilas chrome above
// it (Demo bar ticket, job 1/3/5). Defaults to "basic" on every load —
// deliberately not persisted (localStorage, URL, anything) so a fresh visit
// to any demo always starts at $300 and the visitor watches it get better.

import { useState } from "react";
import { ChatAssistant } from "@/components/ChatAssistant";
import { demos } from "./index";
import { DEMO_BAR_OFFSET_CLASS, VilasDemoBar, type Tier } from "./VilasDemoBar";

// Session 3: every demo gets the $30/month chat add-on too, in `floating`
// mode, so a prospect browsing a style can see it working. Each slug's
// content/chat/<slug>.json (isDemo: true, so the assistant's first reply
// says so) carries the business name — read statically rather than one
// `import()` per demo, since there are only 9 and it's all static JSON.
import demoRenovation from "@/content/chat/demo-renovation.json";
import demoLandscaping from "@/content/chat/demo-landscaping.json";
import demoPowerwash from "@/content/chat/demo-powerwash.json";
import demoFlorist from "@/content/chat/demo-florist.json";
import demoLawncare from "@/content/chat/demo-lawncare.json";
import demoBakery from "@/content/chat/demo-bakery.json";
import demoBarber from "@/content/chat/demo-barber.json";
import demoAutobody from "@/content/chat/demo-autobody.json";
import demoMagician from "@/content/chat/demo-magician.json";

const CHAT_FACTS: Record<string, { businessName: string; phone: string }> = {
  "demo-renovation": demoRenovation,
  "demo-landscaping": demoLandscaping,
  "demo-powerwash": demoPowerwash,
  "demo-florist": demoFlorist,
  "demo-lawncare": demoLawncare,
  "demo-bakery": demoBakery,
  "demo-barber": demoBarber,
  "demo-autobody": demoAutobody,
  "demo-magician": demoMagician,
};

// Looks up the demo itself (rather than receiving it as a prop) — a
// component reference can't cross the server/client boundary as a plain
// prop, so DemoRoute, a Client Component, resolves the slug from the same
// map app/demos/[slug]/page.tsx already used to validate it.
export function DemoRoute({ slug }: { slug: string }) {
  const [tier, setTier] = useState<Tier>("basic");
  const Demo = demos[slug];
  if (!Demo) return null;
  const chatFacts = CHAT_FACTS[slug];
  return (
    <>
      <VilasDemoBar slug={slug} tier={tier} onChange={setTier} />
      <div className={DEMO_BAR_OFFSET_CLASS}>
        <Demo tier={tier} />
      </div>
      {chatFacts && (
        <ChatAssistant
          mode="floating"
          siteSlug={slug}
          businessName={chatFacts.businessName}
          phone={chatFacts.phone || undefined}
        />
      )}
    </>
  );
}
