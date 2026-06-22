"use client";

// Style demo — a lawn-care homepage in the fresh-daylight "Fresh Cut" mood
// (SKILL §13e + §14g): fresh off-white, grass-green accent, a friendly
// grotesque, sunny photography. Lawn care is a recurring-PLAN business and the
// whole funnel is "get a price," so "what we do" is plan tier cards plus a live
// instant-estimate widget, and "why us" is a compact strip — not the numbered
// grid. "Fresh Cut Lawn Co." is a sample brand for the demo, not a client.

import { useState } from "react";
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
  ProofStrip,
  Rise,
  Section,
  TwoLine,
  WorkGrid,
} from "./system";

const ACCENT = "#4E9A4A"; // fresh grass green

// Fresh daylight lawn-care mood (SKILL §13e).
const THEME: DemoTheme = {
  bg: "#F6F8F1", // soft fresh off-white, faint green
  surface: "#FFFFFF",
  fg: "#1C2417", // deep grass near-black
  body: "#515B47", // muted olive-gray
  muted: "#8E9882", // sage gray
  line: "#E5EBDB", // light green hairline
  accent: ACCENT,
  onAccent: "#FFFFFF",
  font: "var(--font-tight)", // friendly grotesque, no serif
  heroScrim: "linear-gradient(180deg, rgba(246,248,241,.1), rgba(246,248,241,.76))",
  breakScrim: "linear-gradient(180deg, rgba(246,248,241,.38), rgba(246,248,241,.85))",
};
const PHONE = "(516) 555-0148";
const NAME = "Fresh Cut Lawn Co.";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/lawncare-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstLawnCareImage = "/previews/firstLawnCareImage.webp";

// Recurring plans, laid out like pricing tiers (§14g). Starting prices, clear.
const PLANS = [
  {
    name: "Basic Mow",
    price: "from $40",
    unit: "/ visit",
    blurb: "The weekly cut, done right.",
    includes: ["Mow, trim & edge", "Blown clean every time", "Same crew, same day"],
    popular: false,
  },
  {
    name: "Full Care",
    price: "from $65",
    unit: "/ visit",
    blurb: "Mowing plus a green, thick lawn.",
    includes: ["Everything in Basic Mow", "Seasonal fertilizing", "Weed & crabgrass control"],
    popular: true,
  },
  {
    name: "Seasonal",
    price: "from $90",
    unit: "/ visit",
    blurb: "The whole yard, all season.",
    includes: ["Everything in Full Care", "Spring & fall cleanups", "Mulch & fresh bed edges"],
    popular: false,
  },
];

const WORK = [
  { tag: "Mowing", caption: "Weekly cut with clean edges" },
  { tag: "Stripes", caption: "Straight mow lines, front to back" },
  { tag: "Cleanup", caption: "Fall leaf cleanup — beds cleared" },
  { tag: "Mulch", caption: "Fresh mulch & re-cut bed lines" },
  { tag: "Treatment", caption: "Seasonal fertilizer application" },
  { tag: "Edging", caption: "Crisp walkway & driveway edges" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The South Shore of Nassau County and nearby towns. Send your address and we'll confirm you're on the route." },
  { q: "Do I need a contract?", a: "No. We run week to week. Skip a cut or cancel entirely by text — no penalty, no paperwork." },
  { q: "How do I get a price?", a: "Text a photo of the yard and your address. You'll have a firm weekly number that night, no site visit required." },
  { q: "What day will you come?", a: "You get a set day each week with the same crew. If weather pushes it, we'll text you the new day." },
  { q: "Are you insured?", a: "Yes, fully insured. Happy to send proof before your first visit." },
];

// ── Service plans — pricing tiers, one marked most popular (§14g). ───────────
function PlanCards() {
  return (
    <Section>
      <Rise>
        <Eyebrow>What we do</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Pick a plan." b="We handle the rest." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <Rise key={p.name} delay={Math.min(i * 0.08, 0.2)}>
            <div
              className="flex h-full flex-col p-7"
              style={{
                background: "var(--d-surface)",
                border: `1px solid ${p.popular ? "var(--d-accent)" : "var(--d-line)"}`,
                borderRadius: "var(--d-radius)",
                boxShadow: p.popular ? "0 12px 32px rgba(78,154,74,.12)" : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[22px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {p.name}
                </h3>
                {p.popular && (
                  <span
                    className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                    style={{ background: "var(--d-accent)", color: "var(--d-onaccent)", borderRadius: "var(--d-radius)" }}
                  >
                    Most picked
                  </span>
                )}
              </div>
              <p className="mt-2 text-[15px]" style={{ color: "var(--d-body)" }}>
                {p.blurb}
              </p>
              <p className="mt-5">
                <span className="text-[32px] font-bold" style={{ color: "var(--d-fg)" }}>
                  {p.price}
                </span>{" "}
                <span className="text-[14px]" style={{ color: "var(--d-muted)" }}>
                  {p.unit}
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-[15px]" style={{ color: "var(--d-body)" }}>
                    <span style={{ color: "var(--d-accent)" }}>✓</span>
                    {inc}
                  </li>
                ))}
              </ul>
              <a
                href="#freshcut-contact"
                className="mt-7 inline-block px-5 py-3 text-center text-[14px] font-semibold"
                style={
                  p.popular
                    ? { background: "var(--d-accent)", color: "var(--d-onaccent)" }
                    : { border: "1px solid var(--d-line)", color: "var(--d-fg)" }
                }
              >
                Start this plan
              </a>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Instant estimate — size × frequency → live rough price (§14g). ───────────
const SIZES = [
  { label: "Small", note: "Up to ¼ acre", base: 40 },
  { label: "Medium", note: "¼ – ½ acre", base: 55 },
  { label: "Large", note: "½ acre +", base: 75 },
];
const FREQ = [
  { label: "Weekly", mult: 1 },
  { label: "Biweekly", mult: 1.25 }, // more growth per visit
];
const round5 = (n: number) => Math.round(n / 5) * 5;

function EstimateWidget() {
  const [size, setSize] = useState(1);
  const [freq, setFreq] = useState(0);
  const per = round5(SIZES[size].base * FREQ[freq].mult);

  return (
    <Section dark>
      <Rise>
        <Eyebrow>Instant estimate</Eyebrow>
        <div className="mt-5">
          <TwoLine a="A price" b="in ten seconds." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_0.8fr] md:gap-14">
        <Rise>
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
                Lawn size
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSize(i)}
                    aria-pressed={i === size}
                    className="px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: i === size ? "var(--d-accent)" : "transparent",
                      color: i === size ? "var(--d-onaccent)" : "var(--d-body)",
                      border: `1px solid ${i === size ? "var(--d-accent)" : "var(--d-line)"}`,
                      borderRadius: "var(--d-radius)",
                    }}
                  >
                    <span className="block text-[15px] font-semibold">{s.label}</span>
                    <span className="block text-[12px] opacity-80">{s.note}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
                How often
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {FREQ.map((f, i) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setFreq(i)}
                    aria-pressed={i === freq}
                    className="px-4 py-2.5 text-[15px] font-semibold transition-colors"
                    style={{
                      background: i === freq ? "var(--d-accent)" : "transparent",
                      color: i === freq ? "var(--d-onaccent)" : "var(--d-body)",
                      border: `1px solid ${i === freq ? "var(--d-accent)" : "var(--d-line)"}`,
                      borderRadius: "var(--d-radius)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div
            className="flex h-full flex-col justify-between p-7"
            style={{ background: "var(--d-surface)", border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)" }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
                Roughly
              </p>
              <p className="mt-3 text-[40px] font-bold leading-none" style={{ color: "var(--d-fg)" }}>
                ${per}
                <span className="text-[18px] font-medium" style={{ color: "var(--d-muted)" }}>
                  {" "}/ visit
                </span>
              </p>
              <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
                Rough estimate, not a quote. Text a photo and we&apos;ll confirm a firm number that night.
              </p>
            </div>
            <a
              href="#freshcut-contact"
              className="mt-7 inline-block px-6 py-3.5 text-center text-[14px] font-semibold"
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              Lock in this price →
            </a>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

export function LawnCareDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free quote" />
      <DemoHero
        heroImage={firstLawnCareImage}
        eyebrow="Lawn care · Nassau County"
        line1="Your lawn,"
        line2="handled."
        sub="Weekly mowing, cleanups, and edging for homes on the South Shore. No contracts, no voicemail tag. Text a photo, get a price."
        primaryCta="Get a free quote"
        phone={PHONE}
        mediaLabel="HERO VIDEO — fresh-cut lawn (16:9)"
      />
      <DemoMarquee terms={["Mowing", "Cleanups", "Edging", "Mulch", "Fertilizing"]} />
      <Intro
        eyebrow="Who we are"
        line1="Show up."
        line2="Cut it right."
        paragraphs={[
          "Lawn care isn't complicated — it's whether the crew shows up, does it right, and you never have to chase them. That's the whole job.",
          "Fresh Cut runs a tight weekly route with the same crew, a firm price up front, and no contract to trap you if we don't earn it.",
        ]}
        badges={[
          ["Mowing to fertilizing", "Full season"],
          ["Same crew every week", "Consistent"],
          ["No contracts", "Skip anytime"],
          ["Fully insured", "Quotes same day"],
        ]}
      />
      <PlanCards />
      <EstimateWidget />
      <FullBleedBreak
        eyebrow="How it works"
        line1="Text a photo."
        line2="Get a price that night."
        paragraph="Send a picture of the yard and your address — that's the whole form. We reply with a firm weekly number, then put you on the route with the same crew, same day."
        checklist={[
          "Firm price, no site visit",
          "Same crew, same day",
          "No contract, skip anytime",
          "Fully insured",
        ]}
        cta="Text us a photo"
        mediaLabel="ON THE JOB — crew & route (16:9)"
      />
      <WorkGrid
        eyebrow="Recent work"
        line1="Yards we"
        line2="keep sharp."
        items={WORK}
      />
      <ProofStrip
        eyebrow="Why homeowners pick us"
        line1="Reasons they"
        line2="don't switch."
        claims={[
          { label: "Same crew each week", sub: "The same people, the same set day." },
          { label: "We text before we come", sub: "No surprise visits, no chasing us down." },
          { label: "Easy to cancel", sub: "No contract — skip or stop by text." },
          { label: "We show up", sub: "When we say we'll be there, we're there." },
        ]}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <div id="freshcut-contact">
        <Contact
          eyebrow="Free quote"
          line1="Get your quote"
          line2="tonight."
          copy="Text a photo of your yard, call, or fill out the form. We reply the same day with a real price. No contracts, no pressure."
          phone={PHONE}
          email="hello@freshcut.demo"
          location="South Shore, Nassau County, NY"
          serviceLabel="What you need"
          serviceOptions={["Basic Mow", "Full Care", "Seasonal", "Mulch & edging", "One-time cleanup", "Not sure yet"]}
          propertyTypes={["Residential", "Commercial"]}
        />
      </div>
      <CtaBand
        line1="Ready for a clean cut?"
        line2="Text us a photo."
        cta="Get a free quote"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="Weekly mowing, cleanups, and lawn care with the same crew, no contracts."
        area="Serving the South Shore of Nassau County"
        services={["Weekly mowing", "Spring & fall cleanups", "Mulch & edging", "Fertilizing & weed control"]}
        phone={PHONE}
        email="hello@freshcut.demo"
        location="South Shore, Nassau County, NY"
        hours="Mon–Sat, 7am–5pm"
        strip="Fully Insured · No Contracts · Same-Day Quotes"
      />
    </DemoShell>
  );
}
