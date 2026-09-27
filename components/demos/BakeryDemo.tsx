// Style demo — a neighborhood bakery homepage in the warm & inviting "Golden
// Hour" mood (SKILL §13b + §14b): warm cream, espresso text, crust-amber accent,
// a Fraunces display, softer corners. A bakery sells off a MENU and a CASE, so
// "what we bake" is a printed-menu layout beside the case, and the rest of the
// page follows the case, the ovens, and a cake order — not a numbered grid.
// "Golden Hour Bakehouse" is a sample brand for the demo, not a client.

import {
  ANCHOR_SCROLL_CLASS,
  Contact,
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoHero,
  DemoMarquee,
  DemoShell,
  type DemoTheme,
  Eyebrow,
  Faq,
  FullBleedBreak,
  Intro,
  Media,
  Rise,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

// Section/Faq/Contact/Intro all share one fixed vertical rhythm (72px/140px)
// via the shared <Section> primitive in system.tsx, which we're not touching.
// The two sections built by hand in this file get their own distinct rhythm
// instead of defaulting to that same number twice in a row — same container
// width (max-w-1200 + the shared side padding), different vertical air.
const wrap = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

const PREMIUM_HERO = heroConceptFor("demo-bakery");
const ACCENT = "#C9802F"; // warm crust amber

// Warm & inviting bakery mood (SKILL §13b).
const THEME: DemoTheme = {
  bg: "#F6EFE2", // warm cream / paper bag
  surface: "#FCF8F0",
  fg: "#2B2018", // warm espresso brown
  body: "#5E5142",
  muted: "#9C8B76",
  line: "#E7DCC8",
  accent: ACCENT,
  onAccent: "#FFFFFF",
  font: "var(--font-tight)",
  display: "var(--font-fraunces)", // warm characterful display
  radius: "8px", // a touch softer — handmade, not bubbly
  heroScrim: "linear-gradient(180deg, rgba(246,239,226,.12), rgba(246,239,226,.8))",
  breakScrim: "linear-gradient(180deg, rgba(246,239,226,.42), rgba(246,239,226,.88))",
};
const PHONE = "(631) 555-0173";
const NAME = "Golden Hour Bakehouse";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Real capture, wired and kept: /public/previews/firstBakeryImage.webp.
const firstBakeryImage = "/previews/firstBakeryImage.webp";

// The menu — category, a short appetizing line, an honest price/note (§14b).
const MENU = [
  { name: "Daily bread", desc: "Levain sourdough and seeded rye, 36-hour ferment, out of the oven at 7am.", price: "from $7" },
  { name: "Morning pastry", desc: "Cardamom morning buns, croissants, and one very good cookie, small batches.", price: "from $4" },
  { name: "Cakes to order", desc: "Vanilla or chocolate, plus seasonal specials. Two days' notice.", price: "from $45" },
  { name: "Wholesale", desc: "Standing morning deliveries of bread and pastry to cafés and restaurants nearby.", price: "ask us" },
];

const FAQ = [
  { q: "What days are you open?", a: "Wed–Sun, 7am until sold out. We post the morning's bake so you know what's in the case before you come." },
  { q: "Can I order ahead?", a: "Yes, order by 8pm and your bag is on the shelf with your name on it the next morning." },
  { q: "How much notice for a cake?", a: "Two days for whole cakes. Tell us vanilla or chocolate and the size and we'll have it ready." },
  { q: "Do you sell wholesale to cafés?", a: "We do, with standing morning deliveries of bread and pastry. Reach out and we'll talk about a route." },
  { q: "Do you do gluten-free?", a: "Not yet. We're a small flour-and-water shop and can't promise a clean kitchen for it. We'd rather be honest than careless." },
];

// ── What we bake — the menu beside the case, like stepping to the counter (§14b).
function BakeryMenu() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className={wrap}>
      <Rise>
        <Eyebrow>What we bake</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Step up" b="to the counter." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        {/* the menu */}
        <Rise>
          <div style={{ borderTop: "1px solid var(--d-line)" }}>
            {MENU.map((m) => (
              <div
                key={m.name}
                className="flex items-baseline justify-between gap-6 py-6"
                style={{ borderBottom: "1px solid var(--d-line)" }}
              >
                <div>
                  <h3
                    className="text-[26px] font-semibold leading-[1.1]"
                    style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                  >
                    {m.name}
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                    {m.desc}
                  </p>
                </div>
                <span className="shrink-0 text-[14px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--d-accent)" }}>
                  {m.price}
                </span>
              </div>
            ))}
          </div>
        </Rise>
        {/* the case */}
        <Rise delay={0.1}>
          <div className="md:sticky md:top-10">
            <Media label="The case" file="the-case.jpg" ratio="4/3" />
            <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
              The case at 7am. When it&apos;s empty, that&apos;s the day.
            </p>
          </div>
        </Rise>
      </div>
      </div>
    </section>
  );
}

// ── Whole-cake orders — a centered ask + a bench shot, not a corporate grid.
function CakeOrders() {
  return (
    <section className="w-full py-20 md:py-[176px]" style={{ background: "var(--d-surface)" }}>
      <div className={wrap}>
      <div className="mx-auto max-w-xl text-center">
        <Rise>
          <div className="flex justify-center">
            <Eyebrow>Custom orders</Eyebrow>
          </div>
          <div className="mt-5">
            <TwoLine a="Need a cake?" b="Give us two days." />
          </div>
          <p className="mt-6 text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Vanilla or chocolate, sized for the table, from $45. Order two days ahead and
            we&apos;ll have it ready when you walk in.
          </p>
          <a
            href="#contact"
            className="press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold no-underline"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            Order a cake
          </a>
        </Rise>
      </div>
      <Rise delay={0.12}>
        <div className="mx-auto mt-14 max-w-sm">
          <Media label="The bakehouse bench" file="bakehouse-bench.jpg" ratio="4/5" />
        </div>
      </Rise>
      </div>
    </section>
  );
}

export function BakeryDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order ahead" />
      <StickyScene image={firstBakeryImage} priority>
        <DemoHero
          pinned
          heroImage={firstBakeryImage}
          eyebrow="Bakery · Sayville"
          line1="Baked at 4am."
          line2="Gone by noon."
          sub="Sourdough, morning buns, and one very good cookie, baked in small batches every morning. When the case is empty, that's the day."
          primaryCta="Order ahead"
          phone={PHONE}
          mediaLabel="The bakery, from the sidewalk"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="Small batches."
                line2="Every morning."
                paragraphs={[
                  "We're a small bakehouse that does a few things and does them every day, instead of a long menu we phone in.",
                  "Sourdough on a long ferment, pastry out before the morning rush, and cakes to order. When the case is empty, we're proud of it.",
                ]}
                badges={[
                  ["Bread, pastry & cakes", "Daily"],
                  ["36-hour ferment", "No shortcuts"],
                  ["Order ahead", "Reserved by name"],
                  ["Open from 7am", "Until sold out"],
                ]}
              />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      {/* moved out of the pinned scene — it was riding over the hero photo and
          going unreadable there. Now a plain band on the page's own bg. */}
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Sourdough", "Pastry", "Cakes", "Focaccia", "Cookies"]} />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <BakeryMenu />
      </div>
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <FullBleedBreak
          eyebrow="Behind the counter"
          line1="In by 4am,"
          line2="out the door by noon."
          paragraph="Every loaf gets mixed, shaped, and baked in this room before the shop opens. Nothing is trucked in — if it's in the case, it came out of these ovens a few hours earlier."
          checklist={[
            "Dough mixed by hand",
            "Shaped on a floured bench",
            "Baked in small batches",
            "Case restocked all morning",
          ]}
          cta="See today's menu"
          mediaLabel="The bakehouse, early morning"
        />
      </div>
      <CakeOrders />
      <Faq
        eyebrow="Questions"
        line1="Before you"
        line2="place an order."
        items={FAQ}
      />
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
        <Contact
          eyebrow="Visit or order"
          line1="Come smell"
          line2="the bakehouse."
          copy="22 Main St, Sayville · Wed–Sun from 7am · or order ahead and we'll have your bag with your name on it. Cakes need two days."
          phone={PHONE}
          email="hello@goldenhour.demo"
          location="22 Main St, Sayville, NY"
          serviceLabel="What you're after"
          serviceOptions={["Daily bread", "Morning pastry", "Cake to order", "Wholesale", "Not sure yet"]}
        />
      </div>
      <CtaBand
        line1="Hungry yet?"
        line2="Order for the morning."
        cta="Order ahead"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A small bakehouse: sourdough, pastry, and cakes baked fresh every morning."
        area="22 Main St, Sayville, Long Island"
        services={["Daily bread", "Morning pastry", "Cakes to order", "Wholesale"]}
        phone={PHONE}
        email="hello@goldenhour.demo"
        location="22 Main St, Sayville, NY"
        hours="Wed–Sun, 7am until sold out"
        strip="Baked Fresh Daily · Order Ahead · Small Batches"
      />
    </DemoShell>
  );
}
