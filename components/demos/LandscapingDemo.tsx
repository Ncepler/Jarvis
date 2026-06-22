"use client";

// Style demo — a landscape design/build homepage in the FOREST-DARK "Stone &
// Sage" mood (SKILL §13g + §14f): a near-black warmed toward dark forest green,
// sage accent, green-tinted scrims. The signature move is a day↔night lighting
// toggle on a featured outdoor space. Same editorial spine as the other demos.
// "Stone & Sage Landscapes" is a sample brand for the demo, not a client.

import { useReducedMotion } from "motion/react";
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
  FilterableWorkGrid,
  FullBleedBreak,
  Intro,
  ProcessStepper,
  Rise,
  Section,
  TwoLine,
  ValueProps,
} from "./system";

const ACCENT = "#6E9A5C"; // moss / sage green, nudged brighter to pop on green-black

// Forest-dark landscaping mood (SKILL §13g) — only the background family shifts
// from cool pure-black to a green-tinted dark; everything else holds.
const THEME: DemoTheme = {
  bg: "#0C110B", // near-black with a forest-green undertone
  surface: "#141A11", // raised panel, green-tinted dark
  fg: "#F0F2E9", // warm off-white
  body: "#C7CCBE", // soft sage-gray body
  muted: "#828B79", // muted sage
  line: "#202820", // green-tinted hairline
  accent: ACCENT,
  onAccent: "#0C110B", // dark text on the sage accent
  font: "var(--font-tight)",
  heroScrim: "linear-gradient(180deg, rgba(12,17,11,.35), rgba(12,17,11,.85))",
  breakScrim: "linear-gradient(180deg, rgba(12,17,11,.55), rgba(12,17,11,.9))",
};

const PHONE = "(516) 555-0123";
const NAME = "Stone & Sage Landscapes";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/landscaping-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstLandscapingImage = "/previews/firstLandscapingImage.webp";

const SERVICES = [
  { title: "Design", copy: "A measured plan for the whole property — plantings, stone, lighting, grading — before anything is dug." },
  { title: "Patios & walkways", copy: "Bluestone, pavers, and gravel laid on a base built to outlast the freeze-thaw, not just look good in spring." },
  { title: "Retaining walls", copy: "Engineered to hold the grade and drain right, so the wall is still plumb a decade out." },
  { title: "Garden & planting", copy: "Native and seasonal plantings chosen for your light and soil, set to fill in instead of fight the site." },
  { title: "Maintenance", copy: "Seasonal care by the people who built it, so year five looks better than year one." },
  { title: "Custom features", copy: "Fire pits, pergolas, outdoor kitchens, water. The pieces that turn a yard into a place you sit." },
];

// "Our process" — a short Design → Build → Grow stepper (§14f).
const PROCESS = [
  { title: "Design", what: "We walk the property, take measurements, and draw a plan you can see before anything's dug.", duration: "2–3 weeks" },
  { title: "Build", what: "Grading, drainage, stone, and structure — the base you can't see, done right first.", duration: "2–6 weeks" },
  { title: "Grow", what: "Planting, then seasonal care by the same crew, so it fills in and keeps looking right.", duration: "Ongoing" },
];

// Work grid is filterable by type (§14f). Tags match the chip set below.
const WORK_CHIPS = ["Patios", "Walls", "Gardens", "Lighting", "Fire pits"];
const WORK = [
  { tag: "Patios", caption: "Bayside bluestone terrace — Port Washington" },
  { tag: "Walls", caption: "Tiered retaining wall & steps — Huntington" },
  { tag: "Gardens", caption: "Native meadow front yard — Northport" },
  { tag: "Lighting", caption: "Low-voltage path & garden lighting" },
  { tag: "Fire pits", caption: "Sunken fire pit & seating wall — Cold Spring Harbor" },
  { tag: "Patios", caption: "Pool surround in bluestone — Huntington" },
  { tag: "Gardens", caption: "Pollinator border & gravel garden" },
  { tag: "Lighting", caption: "Uplit specimen trees & façade wash" },
  { tag: "Walls", caption: "Dry-stack stone wall & planted terrace" },
];

const PROPS = [
  { title: "Designed in-house", copy: "The crew that builds it drew it, so far less gets lost between the plan and the ground." },
  { title: "Built to last", copy: "We build the base you can't see right, so the surface you can see stays put." },
  { title: "Straight, written pricing", copy: "A real number on paper before we break ground. No surprises mid-project." },
  { title: "Local & responsive", copy: "We're on the North Shore and we answer our phone. You deal with the people doing the work." },
  { title: "We maintain what we plant", copy: "Seasonal care by the people who built it keeps the whole property reading right for years." },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The North Shore of Long Island — Huntington, Northport, Port Washington, Cold Spring Harbor, and nearby towns." },
  { q: "Do you do design and build, or just one?", a: "Both, and we prefer to do both. When the crew that builds it drew it, far less gets lost between the plan and the ground." },
  { q: "Do you install landscape lighting?", a: "Yes — low-voltage path, uplighting, and fixtures for fire and water features. It's the part of a project most people underestimate, and the part you enjoy most after dark." },
  { q: "How long does a project take?", a: "A patio is usually a couple of weeks; a full property runs a season. We give you a real schedule before we start." },
  { q: "Do you give free estimates?", a: "Yes. We walk the property, talk through what you want, and put a written number in front of you. No pressure." },
  { q: "Do you maintain what you build?", a: "We do, and we'd rather. Seasonal care by the people who built it keeps it looking right for years." },
];

// ── Day ↔ night lighting toggle — landscaping's signature interactive (§14f).
// Two-button cross-fade between a daylight still and a dusk-with-lights-on
// still. The cross-fade is the whole pitch for the lighting service; reduced
// motion drops the transition but keeps the tap toggle (the mobile path too).
function DayNight() {
  const reduced = useReducedMotion();
  const [night, setNight] = useState(false);
  const fade = reduced ? undefined : "opacity .6s ease";
  return (
    <div>
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/9", border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)" }}
      >
        {/* DAY */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 text-center"
          style={{ background: "var(--d-surface)", opacity: night ? 0 : 1, transition: fade }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--d-muted)" }}>
            FEATURED — patio, DAY (16:9)
          </span>
        </div>
        {/* NIGHT — landscape lighting on */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4 text-center"
          style={{ background: "var(--d-bg)", opacity: night ? 1 : 0, transition: fade }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--d-accent)" }}>
            FEATURED — patio, NIGHT, lights on (16:9)
          </span>
        </div>
      </div>
      {/* the toggle */}
      <div
        className="mt-4 inline-flex overflow-hidden"
        style={{ border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)" }}
        role="group"
        aria-label="Day or night view"
      >
        {[
          ["Day", false],
          ["After dark", true],
        ].map(([label, isNight]) => {
          const on = night === isNight;
          return (
            <button
              key={String(label)}
              type="button"
              onClick={() => setNight(isNight as boolean)}
              aria-pressed={on}
              className="px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors"
              style={{
                background: on ? "var(--d-accent)" : "transparent",
                color: on ? "var(--d-onaccent)" : "var(--d-muted)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Services — the day↔night feature is the section hero, with the numbered
// 01–06 list beneath it (§14f). ──────────────────────────────────────────────
function LightingServices() {
  return (
    <Section>
      <Rise>
        <Eyebrow>What we do</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Six specialties." b="One property." />
        </div>
      </Rise>
      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1.3fr_1fr] md:gap-14">
        <Rise>
          <DayNight />
        </Rise>
        <Rise delay={0.1}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
            See it after dark
          </p>
          <h3 className="mt-3 text-[26px] font-semibold leading-[1.15]" style={{ color: "var(--d-fg)" }}>
            Lighting is where a yard earns its keep.
          </h3>
          <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Flip it to dusk and the same patio turns into a place you actually
            use at night — warm uplighting in the trees, low path lights, and the
            fire feature glowing. We design the night view alongside the day one,
            because that&apos;s when most people fall for it.
          </p>
        </Rise>
      </div>
      {/* numbered service list */}
      <div className="mt-16 grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Rise key={s.title} delay={Math.min(i * 0.05, 0.25)}>
            <div className="pt-5" style={{ borderTop: "1px solid var(--d-line)" }}>
              <span className="text-[13px] font-semibold tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                0{i + 1}
              </span>
              <h3 className="mt-2 text-[19px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {s.copy}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

export function LandscapingDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free consult" />
      <DemoHero
        heroImage={firstLandscapingImage}
        eyebrow="Landscape design & build · North Shore"
        line1="Built to be lived in."
        line2="Built to stay."
        sub="We design and build the whole property — stone, plantings, lighting, water — then we keep it. One studio, one crew, one standard."
        primaryCta="Book a consultation"
        phone={PHONE}
        mediaLabel="HERO VIDEO — finished property b-roll (16:9)"
      />
      <DemoMarquee terms={["Patios", "Retaining Walls", "Gardens", "Lighting", "Fire Pits"]} />
      <Intro
        eyebrow="Who we are"
        line1="One studio."
        line2="One crew."
        paragraphs={[
          "Most yards get passed between a designer, a mason, and a landscaper who never talk. The seams show.",
          "Stone & Sage draws it, builds it, and maintains it with our own people — so the property reads as one finished idea, not three.",
        ]}
        badges={[
          ["Design through maintenance", "Full scope"],
          ["Licensed & insured", "Fully covered"],
          ["Our own crew, no subs", "Held to the drawing"],
          ["Free consultations", "No pressure"],
        ]}
      />
      <LightingServices />
      <ProcessStepper
        eyebrow="Our process"
        line1="Design."
        line2="Build. Grow."
        steps={PROCESS}
        note="Most projects run a few weeks to a full season, depending on scope. We give you a real schedule before we break ground."
      />
      <FullBleedBreak
        eyebrow="See the transformation"
        line1="We read the land first."
        line2="Then we build for it."
        paragraph="Grading, drainage, and light decide what a yard can be long before the stone goes down. We plan for the property you have, not a photo of someone else's."
        checklist={[
          "Free on-site consultation",
          "Our own crew, no subs",
          "Plan before we break ground",
          "Licensed & insured",
        ]}
        cta="Walk the property with us"
        mediaLabel="TRANSFORMATION — before/after (16:9)"
      />
      <FilterableWorkGrid
        eyebrow="Recent work"
        line1="Work you can"
        line2="stand in."
        chips={WORK_CHIPS}
        items={WORK}
      />
      <ValueProps
        eyebrow="Why hire us"
        line1="Reasons it"
        line2="stays put."
        props={PROPS}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <Contact
        eyebrow="Free consult"
        line1="Walk the property"
        line2="with us."
        copy="Consultations run about an hour. You'll leave with a clear sense of what the land wants to be, whether or not you build with us."
        phone={PHONE}
        email="hello@stoneandsage.demo"
        location="North Shore, Long Island, NY"
        serviceLabel="What you're planning"
        serviceOptions={["Design", "Patio / walkway", "Retaining wall", "Garden & planting", "Lighting", "Maintenance", "Custom feature", "Not sure yet"]}
        propertyTypes={["Residential", "Commercial"]}
      />
      <CtaBand
        line1="Ready to start?"
        line2="Let's walk the property."
        cta="Book a consultation"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="Landscape design, build, and maintenance — one crew from drawing to care."
        area="Serving the North Shore of Long Island"
        services={["Design", "Patios & walkways", "Retaining walls", "Garden & planting", "Lighting", "Maintenance"]}
        phone={PHONE}
        email="hello@stoneandsage.demo"
        location="North Shore, Long Island, NY"
        hours="Mon–Sat, 7am–6pm"
        strip="Licensed & Insured · Free Consultations · Design–Build"
      />
    </DemoShell>
  );
}
