// Style demo — a flower-shop homepage in the bright & airy "Wildstem" mood
// (SKILL §13a + §14h): warm paper-white, daylight photography, a Fraunces serif
// for headers, rose accent. People shop a florist by OCCASION and the
// arrangements are the show, so "what we do" is occasion tiles, the work grid is
// a bouquet gallery, and "why us" is a soft warm set — not the numbered grid.
// "Wildstem Florals" is a sample brand for the demo, not a client.

import {
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
  Section,
  TwoLine,
} from "./system";

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

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/florist-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstFloristImage = "/previews/firstFloristImage.webp";

// People self-select by why they're buying (§14h).
const OCCASIONS = [
  { name: "Weddings", note: "From two tables to the whole room." },
  { name: "Sympathy", note: "Quiet, handled, sent same-day." },
  { name: "Everyday", note: "Loose, seasonal, no two alike." },
  { name: "Events", note: "Dinners, openings, the long table." },
];

// The shop — a bouquet gallery, big photography, thin gutters (§14h). Doubles
// as the work grid.
const BOUQUETS = [
  { name: "Seasonal hand-tie", price: "from $55" },
  { name: "Garden-style ceremony arch", price: "wedding" },
  { name: "Long-table dinner runner", price: "event" },
  { name: "Soft white standing spray", price: "sympathy" },
  { name: "Weekly café arrangement", price: "from $40 / wk" },
  { name: "Market bunch, wrapped", price: "from $28" },
];

const FAQ = [
  { q: "Do you deliver?", a: "Yes — same-day across Rockville Centre and nearby towns for orders placed by 2pm, and scheduled delivery beyond that." },
  { q: "How far ahead should I book a wedding?", a: "The best dates book a season out. Reach out early with the venue and the month and we'll bring ideas to a first call." },
  { q: "Can I just say a budget and let you design?", a: "Absolutely — that's most of what we do. Give us a number and a vibe and we'll run with it." },
  { q: "Do you do sympathy arrangements on short notice?", a: "We do, same-day when we can. Call the shop and we'll handle it gently." },
  { q: "Can I set up weekly flowers?", a: "Yes. A standing weekly order for the house or a business, billed simply, skip any week by text." },
];

const VALUES = [
  { h: "Arranged the morning it ships", p: "Nothing sits in a cooler for a week. We build it the day it goes out." },
  { h: "Seasonal & local where we can", p: "We buy what's actually good that week, so it looks picked, never produced." },
  { h: "A real local florist", p: "You talk to the people holding the shears on Maple Ave — not a 1-800 order desk." },
];

// ── What we do — occasion tiles, the occasion name in the serif (§14h). ──────
function OccasionTiles() {
  return (
    <Section>
      <Rise>
        <Eyebrow>What we do</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Tell us the moment." b="We'll make it." />
        </div>
      </Rise>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {OCCASIONS.map((o, i) => (
          <Rise key={o.name} delay={Math.min(i * 0.06, 0.18)}>
            <figure className="group cursor-pointer">
              <div
                className="overflow-hidden transition-transform duration-500 group-hover:-translate-y-1"
                style={{ borderRadius: "var(--d-radius)", boxShadow: "0 8px 24px rgba(42,38,34,.06)" }}
              >
                <Media label={`OCCASION — ${o.name} (3:4)`} ratio="3/4" rounded={false} />
              </div>
              <figcaption className="mt-3">
                <h3 className="text-[22px] font-semibold leading-[1.1]" style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}>
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
    </Section>
  );
}

// ── The shop — bouquet gallery with big photography & thin gutters (§14h). ───
function BouquetGallery() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Rise>
          <Eyebrow>The shop</Eyebrow>
          <div className="mt-5">
            <TwoLine a="A look" b="in the cooler." />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: "var(--d-accent)" }}>
            See the gallery →
          </span>
        </Rise>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
        {BOUQUETS.map((b, i) => (
          <Rise key={b.name} delay={Math.min(i * 0.05, 0.25)}>
            <figure className="group">
              <div className="overflow-hidden" style={{ borderRadius: "var(--d-radius)" }}>
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Media label={`BOUQUET — ${b.name} (4:5)`} ratio="4/5" rounded={false} />
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <p className="text-[16px]" style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}>
                  {b.name}
                </p>
                <span className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.06em]" style={{ color: "var(--d-accent)" }}>
                  {b.price}
                </span>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Weekly flowers — a calm subscription block (§14h). ───────────────────────
function Subscription() {
  return (
    <Section dark>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_0.9fr] md:gap-16">
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
          <span
            className="mt-7 inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            Start weekly flowers
          </span>
        </Rise>
        <Rise delay={0.1}>
          <Media label="WEEKLY — standing arrangement (4:3)" />
        </Rise>
      </div>
    </Section>
  );
}

// ── Why order from us — a soft, light set (§14h), not a corporate grid. ──────
function SoftValues() {
  return (
    <Section>
      <Rise>
        <Eyebrow>Why order from us</Eyebrow>
        <div className="mt-5">
          <TwoLine a="The difference" b="is the morning of." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <Rise key={v.h} delay={Math.min(i * 0.08, 0.24)}>
            <div className="pt-5" style={{ borderTop: "1px solid var(--d-line)" }}>
              <h3 className="text-[20px] font-semibold leading-[1.2]" style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}>
                {v.h}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {v.p}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

export function FloristDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order flowers" />
      <DemoHero
        heroImage={firstFloristImage}
        eyebrow="Flower shop · Rockville Centre"
        line1="Picked,"
        line2="not produced."
        sub="Seasonal stems, arranged the morning you order them. Walk in, call ahead, or set up weekly flowers for the house."
        primaryCta="Order for pickup"
        phone={PHONE}
        mediaLabel="HERO VIDEO — shop & blooms (16:9)"
      />
      <DemoMarquee terms={["Weddings", "Events", "Daily", "Weekly", "Sympathy"]} />
      <Intro
        eyebrow="Who we are"
        line1="A small shop."
        line2="Real flowers."
        paragraphs={[
          "We're a working flower shop, not a website that ships boxes. What's in the cooler is what came in good that week.",
          "Tell us the person and the occasion and we'll design around it — loose, seasonal, and arranged the day it goes out.",
        ]}
        badges={[
          ["Daily to weddings", "Full range"],
          ["Arranged same morning", "Never pre-made"],
          ["Same-day until 2pm", "Local delivery"],
          ["Family-run", "Talk to the maker"],
        ]}
      />
      <OccasionTiles />
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
        mediaLabel="GALLERY — wedding & event florals (16:9)"
      />
      <BouquetGallery />
      <Subscription />
      <SoftValues />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <Contact
        eyebrow="Get in touch"
        line1="Come smell"
        line2="the shop."
        copy="14 Maple Ave, Rockville Centre · Tue–Sat 9–6, Sun 10–2 · or call and we'll have it wrapped when you arrive."
        phone={PHONE}
        email="hello@wildstem.demo"
        location="14 Maple Ave, Rockville Centre, NY"
        serviceLabel="What it's for"
        serviceOptions={["Everyday arrangement", "Wedding / event", "Weekly flowers", "Sympathy", "Not sure yet"]}
      />
      <CtaBand
        line1="Need flowers?"
        line2="We're here for it."
        cta="Order for pickup"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A working flower shop — daily arrangements, weddings, and weekly flowers."
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
