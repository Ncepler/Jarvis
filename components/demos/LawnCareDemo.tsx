"use client";

// Style demo — a lawn-care homepage in the fresh-daylight "Fresh Cut" mood
// (SKILL §13e + §14g): fresh off-white, grass-green accent, a friendly
// grotesque, sunny photography. Lawn care is a recurring-PLAN business and the
// whole funnel is "get a price," so "what we do" is plan tier cards plus a live
// instant-estimate widget, and "what we handle" is a plain ruled list — not a
// photo grid we don't have real photos for yet. "Fresh Cut Lawn Co." is a
// sample brand for the demo, not a client.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
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
  Intro,
  MobileStickyCta,
  Rise,
  Section,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

const PREMIUM_HERO = heroConceptFor("demo-lawncare");
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
  radius: "6px", // lawncare/powerwash personality tier (SKILL §7): 12/6/3
  radiusLg: "12px",
  radiusSm: "3px",
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

// What the crew handles, season by season — shown as a plain ruled list
// rather than a photo grid, since no real job photos exist yet (§10).
const SEASONS = [
  { tag: "Mowing", caption: "Weekly cut with clean edges" },
  { tag: "Stripes", caption: "Straight mow lines, front to back" },
  { tag: "Cleanup", caption: "Fall leaf cleanup: beds cleared" },
  { tag: "Mulch", caption: "Fresh mulch & re-cut bed lines" },
  { tag: "Treatment", caption: "Seasonal fertilizer application" },
  { tag: "Edging", caption: "Crisp walkway & driveway edges" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The South Shore of Nassau County and nearby towns. Send your address and we'll confirm you're on the route." },
  { q: "Do I need a contract?", a: "No. We run week to week. Skip a cut or cancel entirely by text, no penalty, no paperwork." },
  { q: "How do I get a price?", a: "Text a photo of the yard and your address. You'll have a firm weekly number that night, no site visit required." },
  { q: "What day will you come?", a: "You get a set day each week with the same crew. If weather pushes it, we'll text you the new day." },
  { q: "Are you insured?", a: "Yes, fully insured. Happy to send proof before your first visit." },
];

// ── Service plans — pricing tiers, one visually lifted as most picked (§14g).
// The cards are a plain pricing display, not a selectable/toggle group — each
// CTA is a plain link to #freshcut-contact, not a state change — so there is
// no shared-highlight `layoutId` here (that pattern belongs to an actual
// selection interaction, which this data doesn't have; see the gate report).
function PlanCards() {
  return (
    <Section className="!py-16 md:!py-[120px] relative overflow-hidden">
      {/* Mow-stripe motif (§14g signature detail #3) — a purely decorative,
          NEVER-animated band referencing lawn-stripe mowing. Two-tone
          repeating diagonal at ~2.5% contrast against the section
          background; static forever, no drift, no scroll-tie. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0px, transparent 56px, rgba(0,0,0,0.025) 56px, rgba(0,0,0,0.025) 112px)",
        }}
      />
      <div className="relative z-10">
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
                className={`relative flex h-full flex-col p-7 transition-transform duration-300 ${
                  p.popular ? "md:-translate-y-4 d-float" : ""
                }`}
                style={{
                  background: "var(--d-surface)",
                  border: "1px solid var(--d-line)",
                  borderTop: p.popular ? "1px solid var(--d-accent)" : undefined,
                  borderRadius: "var(--d-radius)",
                  zIndex: p.popular ? 10 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[19px] font-semibold md:text-[22px]" style={{ color: "var(--d-fg)" }}>
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
                  <span className="text-[28px] font-bold md:text-[32px]" style={{ color: "var(--d-fg)" }}>
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
                  className="d-press mt-7 inline-block px-5 py-3 text-center text-[14px] font-semibold"
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

// Custom range-slider chrome for the "Lawn size" control (§14g signature
// detail #2). Scoped to this one class name so it never leaks outside this
// file — accent fill up to the thumb, plain line-color track beyond it, a
// 28px thumb that scales to 1.1 on a real press only. The value itself stays
// a plain 3-step native <input type="range">, so drag tracking is the
// browser's own 1:1 pointer mapping — nothing here reimplements dragging.
function EstimateRangeStyles() {
  return (
    <style>{`
      .lawncare-range {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 999px;
        background: linear-gradient(to right, var(--d-accent) var(--range-fill, 50%), var(--d-line) var(--range-fill, 50%));
        outline: none;
        cursor: pointer;
      }
      .lawncare-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: var(--d-accent);
        border: 3px solid var(--d-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        transition: transform var(--d-dur-press, 160ms) var(--d-ease-out, cubic-bezier(0.23, 1, 0.32, 1));
      }
      .lawncare-range::-moz-range-thumb {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: var(--d-accent);
        border: 3px solid var(--d-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        transition: transform var(--d-dur-press, 160ms) var(--d-ease-out, cubic-bezier(0.23, 1, 0.32, 1));
      }
      .lawncare-range::-moz-range-track {
        height: 4px;
        border-radius: 999px;
        background: var(--d-line);
      }
      .lawncare-range::-moz-range-progress {
        height: 4px;
        border-radius: 999px;
        background: var(--d-accent);
      }
      .lawncare-range:active::-webkit-slider-thumb {
        transform: scale(1.1);
      }
      .lawncare-range:active::-moz-range-thumb {
        transform: scale(1.1);
      }
      .lawncare-range:focus-visible {
        outline: 2px solid var(--d-accent);
        outline-offset: 4px;
      }
      @media (prefers-reduced-motion: reduce) {
        .lawncare-range::-webkit-slider-thumb,
        .lawncare-range::-moz-range-thumb {
          transition: none;
        }
      }
    `}</style>
  );
}

function EstimateWidget() {
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState(1);
  const [freq, setFreq] = useState(0);
  const per = round5(SIZES[size].base * FREQ[freq].mult);

  // Crossfade-blur mask on the price number when it changes (Emil Kowalski's
  // "mask the cut" technique) — never a counting-up animation. The number
  // itself swaps instantly; a brief blur+fade hides the jump, then clears.
  // Size/frequency only ever have 3×2 = 6 possible states, so this is a
  // bounded, occasional change — never the "100+/day" case that should skip
  // animation entirely.
  const [priceUnsettled, setPriceUnsettled] = useState(false);
  const prevPer = useRef(per);
  useEffect(() => {
    if (prevPer.current === per) return;
    prevPer.current = per;
    setPriceUnsettled(true);
    const holdMs = reducedMotion ? 0 : 150;
    const t = setTimeout(() => setPriceUnsettled(false), holdMs);
    return () => clearTimeout(t);
  }, [per, reducedMotion]);
  const priceTransitionMs = reducedMotion ? 0 : 150;

  return (
    <Section dark className="!py-14 md:!py-[100px]">
      <EstimateRangeStyles />
      <Rise>
        <Eyebrow>Instant estimate</Eyebrow>
        <div className="mt-5">
          <TwoLine a="A price" b="in ten seconds." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_0.8fr] md:gap-14">
        <Rise>
          <div className="space-y-8">
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
                  Lawn size
                </p>
                <span className="text-[13px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {SIZES[size].label}
                  <span className="font-normal" style={{ color: "var(--d-muted)" }}> · {SIZES[size].note}</span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={SIZES.length - 1}
                step={1}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                aria-label="Lawn size"
                aria-valuetext={`${SIZES[size].label}, ${SIZES[size].note}`}
                className="lawncare-range mt-4 block"
                style={{ "--range-fill": `${(size / (SIZES.length - 1)) * 100}%` } as CSSProperties}
              />
              <div className="mt-2.5 flex justify-between text-[11px] font-medium" style={{ color: "var(--d-muted)" }}>
                {SIZES.map((s) => (
                  <span key={s.label}>{s.label}</span>
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
                    className="d-press px-4 py-2.5 text-[15px] font-semibold transition-colors"
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
              <p
                className="mt-3 text-[40px] font-bold leading-none"
                style={{
                  color: "var(--d-fg)",
                  filter: priceUnsettled ? "blur(2px)" : "blur(0px)",
                  opacity: priceUnsettled ? 0.7 : 1,
                  transition: `filter ${priceTransitionMs}ms var(--d-ease-out, cubic-bezier(0.23,1,0.32,1)), opacity ${priceTransitionMs}ms var(--d-ease-out, cubic-bezier(0.23,1,0.32,1))`,
                }}
              >
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
              className="d-press mt-7 inline-block px-6 py-3.5 text-center text-[14px] font-semibold"
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

// ── What we handle — a plain ruled list built from the six service/season
// entries (replaces a photo work-grid we don't have real job photos for). ────
function SeasonList() {
  return (
    <Section className="!py-20 md:!py-[150px]">
      <Rise>
        <Eyebrow>What we handle</Eyebrow>
        <div className="mt-5">
          <TwoLine a="One call," b="every season." />
        </div>
      </Rise>
      <div className="mt-12" style={{ borderTop: "1px solid var(--d-line)" }}>
        {SEASONS.map((s, i) => (
          <Rise key={s.tag} delay={Math.min(i * 0.05, 0.3)}>
            <div
              className="flex flex-wrap items-center justify-between gap-3 py-6 md:py-7"
              style={{ borderBottom: "1px solid var(--d-line)" }}
            >
              <div className="flex items-baseline gap-5">
                <span className="text-[13px] font-semibold tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                  0{i + 1}
                </span>
                <span className="text-[17px] font-semibold md:text-[19px]" style={{ color: "var(--d-fg)" }}>
                  {s.tag}
                </span>
              </div>
              <span className="text-[15px]" style={{ color: "var(--d-body)" }}>
                {s.caption}
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

export function LawnCareDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free quote" contactId="freshcut-contact" />
      <StickyScene image={firstLawnCareImage} priority>
        <DemoHero
          pinned
          heroImage={firstLawnCareImage}
          eyebrow="Lawn care · Nassau County"
          line1="Your lawn,"
          line2="handled."
          sub="Weekly mowing, cleanups, and edging for homes on the South Shore. No contracts, no voicemail tag. Text a photo, get a price."
          primaryCta="Get a free quote"
          phone={PHONE}
          mediaLabel="HERO — fresh-cut lawn"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="Show up."
                line2="Cut it right."
                paragraphs={[
                  "Lawn care isn't complicated. It's whether the crew shows up, does it right, and you never have to chase them. That's the whole job.",
                  "Fresh Cut runs a tight weekly route with the same crew, a firm price up front, and no contract to trap you if we don't earn it.",
                ]}
                badges={[
                  ["Mowing to fertilizing", "Full season"],
                  ["Same crew every week", "Consistent"],
                  ["No contracts", "Skip anytime"],
                  ["Fully insured", "Quotes same day"],
                ]}
              />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      {/* Marquee lives as its own band, outside the pinned hero image, so it
          never rides over the photo (was nested in the StickyScene stack). */}
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Mowing", "Cleanups", "Edging", "Mulch", "Fertilizing"]} />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <PlanCards />
      </div>
      <EstimateWidget />
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <SeasonList />
      </div>
      <Faq
        eyebrow="Questions"
        line1="What neighbors"
        line2="usually ask."
        items={FAQ}
      />
      <div id="freshcut-contact" className={ANCHOR_SCROLL_CLASS}>
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
        contactId="freshcut-contact"
      />
      <MobileStickyCta phone={PHONE} bookLabel="Get a quote" contactId="freshcut-contact" />
    </DemoShell>
  );
}
