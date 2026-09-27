// Style demo — a flower-shop homepage in the bright & airy "Wildstem" mood
// (SKILL §13a + §14h): warm paper-white, daylight photography, a Fraunces serif
// for headers, rose accent. People shop a florist by OCCASION and the
// arrangements are the show, so "what we do" is occasion tiles, the work grid is
// a bouquet gallery, and "why us" is a soft warm set — not the numbered grid.
// "Wildstem Florals" is a sample brand for the demo, not a client.

import Image from "next/image";
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
  Media,
  Rise,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

const PREMIUM_HERO = heroConceptFor("demo-florist");

const ACCENT = "#B14A63"; // deep bloom rose

// Bright & airy florist mood (SKILL §13a).
const THEME: DemoTheme = {
  bg: "#FBF8F3", // warm paper white
  surface: "#FFFFFF",
  fg: "#2A2622", // soft warm near-black
  body: "#5A534B",
  muted: "#9A9289",
  line: "#ECE6DC", // very light hairline
  accent: ACCENT,
  onAccent: "#FFFFFF",
  font: "var(--font-tight)", // clean sans body
  display: "var(--font-fraunces)", // elegant serif headers
  heroScrim: "linear-gradient(180deg, rgba(251,248,243,.12), rgba(251,248,243,.78))",
  breakScrim: "linear-gradient(180deg, rgba(251,248,243,.4), rgba(251,248,243,.86))",
};
const PHONE = "(516) 555-0167";
const NAME = "Wildstem Florals";

// Shared container width/gutters (mirrors system.tsx's private `wrap`, which
// isn't exported — kept identical so hand-built sections below line up with
// the shared primitives around them).
const wrap = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// The only real photo on this demo — everything else below is a labeled
// placeholder (SKILL §10). New cooler/wedding-table photography was planned
// for this rebuild but couldn't be fetched, so this stays the sole image.
const firstFloristImage = "/previews/firstFloristImage.webp";

// People self-select by why they're buying (§14h).
const OCCASIONS = [
  { name: "Weddings", note: "From two tables to the whole room." },
  { name: "Sympathy", note: "Quiet, handled, sent same-day." },
  { name: "Everyday", note: "Loose, seasonal, no two alike." },
  { name: "Events", note: "Dinners, openings, the long table." },
];

// The shop, as a plain price list — no photo-collage (see IMAGE CONSTRAINT in
// the rebuild brief: the cooler still life couldn't be sourced). Every $
// figure below is unchanged from the original demo; items that only ever
// carried an occasion label (not a price) now say so plainly instead of
// guessing a number.
const BOUQUETS = [
  { name: "Seasonal hand-tie", occasion: "Everyday", price: "from $55" },
  { name: "Garden-style ceremony arch", occasion: "Weddings", price: "let's talk" },
  { name: "Long-table dinner runner", occasion: "Events", price: "let's talk" },
  { name: "Soft white standing spray", occasion: "Sympathy", price: "let's talk" },
  { name: "Weekly café arrangement", occasion: "Weekly", price: "from $40 / wk" },
  { name: "Market bunch, wrapped", occasion: "Everyday", price: "from $28" },
];

const FAQ = [
  { q: "Do you deliver?", a: "Yes, same-day across Rockville Centre and nearby towns for orders placed by 2pm, and scheduled delivery beyond that." },
  { q: "How far ahead should I book a wedding?", a: "The best dates book a season out. Reach out early with the venue and the month and we'll bring ideas to a first call." },
  { q: "Can I just say a budget and let you design?", a: "Absolutely. That's most of what we do. Give us a number and a vibe and we'll run with it." },
  { q: "Do you do sympathy arrangements on short notice?", a: "We do, same-day when we can. Call the shop and we'll handle it gently." },
  { q: "Can I set up weekly flowers?", a: "Yes. A standing weekly order for the house or a business, billed simply, skip any week by text." },
];

const VALUES = [
  { h: "Arranged the morning it ships", p: "Nothing sits in a cooler for a week. We build it the day it goes out." },
  { h: "Seasonal & local where we can", p: "We buy what's actually good that week, so it looks picked, never produced." },
  { h: "A real local florist", p: "You talk to the people holding the shears on Maple Ave, not a 1-800 order desk." },
];

const FACTS: [string, string][] = [
  ["Daily to weddings", "Full range"],
  ["Arranged same morning", "Never pre-made"],
  ["Same-day until 2pm", "Local delivery"],
  ["Family-run", "Talk to the maker"],
];

// ── Who we are — merges the old two-section "about" + "why order from us"
// into one: eyebrow/header/paragraphs, an honest facts row, then the three
// value reasons folded in underneath. One section, not two. ─────────────────
function AboutSection() {
  return (
    <section className="w-full py-20 md:py-36">
      <div className={wrap}>
        <div className="grid gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
          <Rise>
            <Eyebrow>Who we are</Eyebrow>
            <div className="mt-5">
              <TwoLine a="A small shop." b="Real flowers." />
            </div>
          </Rise>
          <Rise delay={0.1}>
            <div className="space-y-5">
              <p className="text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                We&apos;re a working flower shop, not a website that ships boxes. What&apos;s in the cooler is what came in good that week.
              </p>
              <p className="text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                Tell us the person and the occasion and we&apos;ll design around it: loose, seasonal, and arranged the day it goes out.
              </p>
            </div>
          </Rise>
        </div>

        {/* honest descriptor pairs — not invented numbers */}
        <div
          className="mt-14 grid grid-cols-2 gap-px md:grid-cols-4"
          style={{ background: "var(--d-line)", border: "1px solid var(--d-line)" }}
        >
          {FACTS.map(([label, value], i) => (
            <Rise key={label} delay={Math.min(i * 0.06, 0.24)}>
              <div className="h-full p-6" style={{ background: "var(--d-bg)" }}>
                <p className="text-[16px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {label}
                </p>
                <p className="mt-1.5 text-[13px]" style={{ color: "var(--d-muted)" }}>
                  {value}
                </p>
              </div>
            </Rise>
          ))}
        </div>

        {/* folded in from the old "why order from us" section */}
        <Rise delay={0.12}>
          <p
            className="mt-16 text-[13px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--d-muted)" }}
          >
            Why it feels different
          </p>
        </Rise>
        <div className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Rise key={v.h} delay={Math.min(0.16 + i * 0.08, 0.4)}>
              <div className="pt-5" style={{ borderTop: "1px solid var(--d-line)" }}>
                <h3
                  className="text-[20px] font-semibold leading-[1.2]"
                  style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                >
                  {v.h}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {v.p}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── The shop — a plain ruled price list, no photos (IMAGE CONSTRAINT). ───────
function BouquetList() {
  return (
    <section className="w-full py-16 md:py-28" style={{ background: "var(--d-surface)" }}>
      <div className={wrap}>
        <Rise>
          <Eyebrow>The shop</Eyebrow>
          <div className="mt-5">
            <TwoLine a="A look" b="at what we make." />
          </div>
        </Rise>
        <div className="mt-12" style={{ borderTop: "1px solid var(--d-line)" }}>
          {BOUQUETS.map((b, i) => (
            <Rise key={b.name} delay={Math.min(i * 0.05, 0.25)}>
              <div
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
                style={{ borderBottom: "1px solid var(--d-line)" }}
              >
                <p
                  className="text-[20px] md:text-[24px]"
                  style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                >
                  {b.name}
                </p>
                <span
                  className="text-[12px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--d-muted)" }}
                >
                  {b.occasion}
                </span>
                <span className="text-[15px] font-semibold" style={{ color: "var(--d-accent)" }}>
                  {b.price}
                </span>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What we do — occasion tiles, the occasion name in the serif (§14h). ──────
function OccasionTiles() {
  return (
    <section className="w-full py-24 md:py-40">
      <div className={wrap}>
        <Rise>
          <Eyebrow>What we do</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Tell us the moment." b="We'll make it." />
          </div>
        </Rise>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {OCCASIONS.map((o, i) => (
            <Rise key={o.name} delay={Math.min(i * 0.06, 0.18)}>
              <figure className="group">
                <div
                  className="overflow-hidden transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ borderRadius: "var(--d-radius)", boxShadow: "0 8px 24px rgba(42,38,34,.06)" }}
                >
                  <Media label={`Occasion — ${o.name}`} file={`occasion-${i + 1}.jpg`} ratio="3/4" rounded={false} />
                </div>
                <figcaption className="mt-3">
                  <h3
                    className="text-[22px] font-semibold leading-[1.1]"
                    style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                  >
                    {o.name}
                  </h3>
                  <p className="mt-1 text-[14px]" style={{ color: "var(--d-muted)" }}>
                    {o.note}
                  </p>
                </figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Weekly flowers — a calm split, sticky against the one real photo we
// have (SKILL translation note: "StickySplit" — a plain two-column split with
// the image column pinned via CSS position:sticky while the copy sits beside
// it; degrades to a normal stacked column on mobile / short viewports). ─────
function WeeklyFlowers() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className={wrap}>
        <div className="grid items-start gap-10 md:grid-cols-[1fr_0.9fr] md:gap-16">
          <Rise>
            <Eyebrow>Weekly flowers</Eyebrow>
            <div className="mt-5">
              <TwoLine a="Fresh stems," b="every week." />
            </div>
            <p className="mt-6 max-w-md text-[16px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
              A standing weekly or biweekly arrangement for the house, the
              restaurant, or the front desk. We choose what&apos;s best that week,
              you skip any week by text, and there&apos;s nothing to reorder.
            </p>
            <a
              href="#contact"
              className="press mt-7 inline-block px-6 py-3.5 text-[14px] font-semibold"
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              Start weekly flowers
            </a>
          </Rise>
          <Rise delay={0.1}>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden md:sticky md:top-28"
              style={{ borderRadius: "var(--d-radius)", border: "1px solid var(--d-line)" }}
            >
              <Image
                src={firstFloristImage}
                alt="Fresh stems at Wildstem Florals"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

export function FloristDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order flowers" />
      <StickyScene image={firstFloristImage} priority>
        <DemoHero
          pinned
          heroImage={firstFloristImage}
          eyebrow="Flower shop · Rockville Centre"
          line1="Picked,"
          line2="not produced."
          sub="Seasonal stems, arranged the morning you order them. Walk in, call ahead, or set up weekly flowers for the house."
          primaryCta="Order for pickup"
          phone={PHONE}
          mediaLabel="Shop & blooms"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <AboutSection />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      {/* moved out from over the pinned hero photo — it was unreadable riding
          over the image, so it now sits as a plain sibling on the page bg */}
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Weddings", "Events", "Daily", "Weekly", "Sympathy"]} />
      </div>
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <BouquetList />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <OccasionTiles />
      </div>
      <FullBleedBreak
        eyebrow="Weddings & events"
        line1="Getting married?"
        line2="Let's talk early."
        paragraph="The best dates book a season out. Tell us the venue and the month, and we'll bring ideas to a first call. The call costs nothing."
        checklist={[
          "Free first consultation",
          "Designed around your venue",
          "Seasonal, sourced that week",
          "From two tables to the whole room",
        ]}
        cta="Start a wedding inquiry"
        mediaLabel="Wedding & event florals"
      />
      <WeeklyFlowers />
      <Faq
        eyebrow="Questions"
        line1="A few things"
        line2="worth knowing."
        items={FAQ}
      />
      {/* kept to 3 fields — name, email, message. Occasion/timing is easy
          enough to say in the message, and walk-ins/calls cover the rest */}
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
        <Contact
          eyebrow="Get in touch"
          line1="Come smell"
          line2="the shop."
          copy="14 Maple Ave, Rockville Centre · Tue–Sat 9–6, Sun 10–2 · or call and we'll have it wrapped when you arrive."
          phone={PHONE}
          email="hello@wildstem.demo"
          location="14 Maple Ave, Rockville Centre, NY"
          minimal
        />
      </div>
      <CtaBand
        line1="Need flowers?"
        line2="We're here for it."
        cta="Order for pickup"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A working flower shop: daily arrangements, weddings, and weekly flowers."
        area="Rockville Centre & nearby Long Island towns"
        services={["Daily arrangements", "Weddings & events", "Weekly flowers", "Sympathy"]}
        phone={PHONE}
        email="hello@wildstem.demo"
        location="14 Maple Ave, Rockville Centre, NY"
        hours="Tue–Sat 9–6 · Sun 10–2"
        strip="Same-day until 2pm · Local delivery · Family-run"
      />
    </DemoShell>
  );
}
