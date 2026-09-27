"use client";

// Style demo — a landscape design/build homepage in the FOREST-DARK "Stone &
// Sage" mood (SKILL §13g + §14f): a near-black warmed toward dark forest green,
// sage accent, green-tinted scrims. The signature move is a day↔night lighting
// toggle on a featured outdoor space, built as a real clip-path wipe (not a
// plain cross-fade) so it reads as the site's one showpiece interaction.
// "Stone & Sage Landscapes" is a sample brand for the demo, not a client.

import { useReducedMotion } from "motion/react";
import { useState } from "react";
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
  Media,
  ProcessStepper,
  Rise,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

const PREMIUM_HERO = heroConceptFor("demo-landscaping");

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
  { title: "Design", copy: "A measured plan for the whole property — plantings, stone, lighting, grading — worked out before anything gets dug." },
  { title: "Patios & walkways", copy: "Bluestone, pavers, and gravel laid on a base built to outlast freeze-thaw seasons, so it still looks right ten years in." },
  { title: "Retaining walls", copy: "Engineered to hold the grade and drain right, so the wall is still plumb a decade out." },
  { title: "Garden & planting", copy: "Native and seasonal plantings picked for your light and soil, set to fill in fast and hold up through a real Long Island winter." },
  { title: "Maintenance", copy: "Seasonal care by the people who built it, so year five looks better than year one." },
  { title: "Custom features", copy: "Fire pits, pergolas, outdoor kitchens, water. The pieces that turn a yard into a place you sit." },
];

// "Our process" — a short Design → Build → Grow stepper (§14f).
const PROCESS = [
  { title: "Design", what: "We walk the property, take measurements, and draw a plan you can see before anything's dug.", duration: "2–3 weeks" },
  { title: "Build", what: "Grading, drainage, stone, and structure: the base you can't see, done right first.", duration: "2–6 weeks" },
  { title: "Grow", what: "Planting, then seasonal care by the same crew, so it fills in and keeps looking right.", duration: "Ongoing" },
];

// Recent projects — text-only ruled list (name / town / scope), no photos
// (this section skips imagery entirely). Every project name is the same
// descriptor the gallery has always used; entries that didn't already name a
// town use "North Shore," the same regional line used throughout this page.
const PROJECTS = [
  { name: "Bayside bluestone terrace", town: "Port Washington", scope: "Patios" },
  { name: "Tiered retaining wall & steps", town: "Huntington", scope: "Walls" },
  { name: "Native meadow front yard", town: "Northport", scope: "Gardens" },
  { name: "Low-voltage path & garden lighting", town: "North Shore", scope: "Lighting" },
  { name: "Sunken fire pit & seating wall", town: "Cold Spring Harbor", scope: "Fire pits" },
  { name: "Pool surround in bluestone", town: "Huntington", scope: "Patios" },
  { name: "Pollinator border & gravel garden", town: "North Shore", scope: "Gardens" },
  { name: "Uplit specimen trees & façade wash", town: "North Shore", scope: "Lighting" },
  { name: "Dry-stack stone wall & planted terrace", town: "North Shore", scope: "Walls" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The North Shore of Long Island: Huntington, Northport, Port Washington, Cold Spring Harbor, and nearby towns." },
  { q: "Do you do design and build, or just one?", a: "Both, and we prefer to do both. When the crew that builds it drew it, far less gets lost between the plan and the ground." },
  { q: "Do you install landscape lighting?", a: "Yes, low-voltage path, uplighting, and fixtures for fire and water features. It's the part of a project most people underestimate, and the part you enjoy most after dark." },
  { q: "How long does a project take?", a: "A patio is usually a couple of weeks; a full property runs a season. We give you a real schedule before we start." },
  { q: "Do you give free estimates?", a: "Yes. We walk the property, talk through what you want, and put a written number in front of you. No pressure." },
  { q: "Do you maintain what you build?", a: "We do, and we'd rather. Seasonal care by the people who built it keeps it looking right for years." },
];

// ── Day ↔ night lighting toggle — landscaping's signature interactive (§14f).
// A full-bleed featured space that WIPES from day to night via clip-path
// (~900ms, eased) when toggled — the same pitch real landscape lighting sites
// make with a day rendering and a night one. Real day/night photography isn't
// in the build yet, so both slots are labeled Media placeholders; the toggle
// mechanism itself is fully working and keyboard-accessible (plain <button>s
// with aria-pressed), so dropping real photos in later is a one-line swap.
// Reduced motion: the wipe becomes an instant swap, no animated transition.
function DayNightSignature() {
  const reduced = useReducedMotion();
  const [night, setNight] = useState(false);
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100svh" }}>
      <div className="absolute inset-0">
        <Media label="Patio — day" className="h-full w-full" rounded={false} />
      </div>
      <div
        className="absolute inset-0"
        style={{
          clipPath: night ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
          transition: reduced ? undefined : "clip-path 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Media label="Patio — night, lights on" className="h-full w-full" rounded={false} />
      </div>
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--d-break-scrim)" }} />
      <div
        className="relative mx-auto flex w-full max-w-[1200px] flex-col justify-end px-6 pb-16 pt-28 md:px-16 md:pb-24"
        style={{ minHeight: "100svh" }}
      >
        <Rise>
          <Eyebrow>After dark</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Same patio." b="After the sun goes down." />
          </div>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-fg)" }}>
            Flip it to night and the uplighting, path lights, and fire feature
            come on. We design the after-dark view right alongside the daytime
            one, since that&apos;s usually the view that sells it.
          </p>
          <div
            className="mt-9 inline-flex overflow-hidden"
            style={{ border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)" }}
            role="group"
            aria-label="Day or night view"
          >
            {(
              [
                ["Day", false],
                ["After dark", true],
              ] as const
            ).map(([label, isNight]) => {
              const on = night === isNight;
              return (
                <button
                  key={label}
                  type="button"
                  className="press px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors"
                  onClick={() => setNight(isNight)}
                  aria-pressed={on}
                  style={{
                    background: on ? "var(--d-accent)" : "transparent",
                    color: on ? "var(--d-onaccent)" : "var(--d-fg)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Rise>
      </div>
    </section>
  );
}

// ── Specialties — a numbered ruled list, text only. The day↔night feature
// that used to live above this list is now its own full-bleed section, so
// this reads as a clean, confident list rather than a crowded combo block. ──
function Specialties() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-16">
        <Rise>
          <Eyebrow>What we do</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Six specialties." b="One property." />
          </div>
        </Rise>
        <div className="mt-14" style={{ borderTop: "1px solid var(--d-line)" }}>
          {SERVICES.map((s, i) => (
            <Rise key={s.title} delay={Math.min(i * 0.05, 0.25)}>
              <div
                className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-[64px_220px_1fr] sm:items-baseline sm:gap-8"
                style={{ borderBottom: "1px solid var(--d-line)" }}
              >
                <span className="text-[13px] font-semibold tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                  0{i + 1}
                </span>
                <h3 className="text-[19px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {s.title}
                </h3>
                <p className="text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {s.copy}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects — a text-only ruled list (project / town / scope), no photos.
// The existing "WORK:" captions become the three columns directly. ──────────
function ProjectsList() {
  return (
    <section className="w-full py-24 md:py-36">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-16">
        <Rise>
          <Eyebrow>Recent work</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Nine projects," b="around the North Shore." />
          </div>
        </Rise>
        <div className="mt-12" style={{ borderTop: "1px solid var(--d-line)" }}>
          <div
            className="hidden gap-6 pb-3 pt-5 text-[12px] font-semibold uppercase tracking-[0.12em] sm:grid sm:grid-cols-[1fr_200px_140px]"
            style={{ color: "var(--d-muted)" }}
          >
            <span>Project</span>
            <span>Town</span>
            <span>Scope</span>
          </div>
          {PROJECTS.map((p, i) => (
            <Rise key={p.name} delay={Math.min(i * 0.03, 0.2)}>
              <div
                className="grid grid-cols-1 gap-1.5 py-5 sm:grid-cols-[1fr_200px_140px] sm:items-center sm:gap-6"
                style={{ borderTop: "1px solid var(--d-line)" }}
              >
                <span className="text-[16px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {p.name}
                </span>
                <span className="text-[14px]" style={{ color: "var(--d-body)" }}>
                  {p.town}
                </span>
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                  {p.scope}
                </span>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandscapingDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free consult" />
      <StickyScene image={firstLandscapingImage} priority>
        <DemoHero
          pinned
          heroImage={firstLandscapingImage}
          eyebrow="Landscape design & build · North Shore"
          line1="Built to be lived in."
          line2="Built to stay."
          sub="We design and build the whole property (stone, plantings, lighting, water), then we keep it. One studio, one crew, one standard."
          primaryCta="Book a consultation"
          phone={PHONE}
          mediaLabel="Hero — finished property"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="One studio."
                line2="One crew."
                paragraphs={[
                  "Most yards get passed between a designer, a mason, and a landscaper who never talk. The seams show.",
                  "Stone & Sage draws it, builds it, and maintains it with our own people, so the property reads like it was planned by one hand.",
                ]}
                badges={[
                  ["Design through maintenance", "Full scope"],
                  ["Licensed & insured", "Fully covered"],
                  ["Our own crew, no subs", "Held to the drawing"],
                  ["Free consultations", "No pressure"],
                ]}
              />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      {/* Marquee moved out from over the pinned hero image (it used to ride
          the StickyScene as a SceneBlock child, fighting the photo underneath
          it) — it now sits on solid --d-bg as its own quiet divider band. */}
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Patios", "Retaining Walls", "Gardens", "Lighting", "Fire Pits"]} />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <Specialties />
      </div>
      <DayNightSignature />
      <ProcessStepper
        eyebrow="Our process"
        line1="Design."
        line2="Build. Grow."
        steps={PROCESS}
        note="Most projects run a few weeks to a full season, depending on scope. We give you a real schedule before we break ground."
      />
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <ProjectsList />
      </div>
      <Faq
        eyebrow="Questions"
        line1="What neighbors"
        line2="usually ask us."
        items={FAQ}
      />
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
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
      </div>
      <CtaBand
        line1="Ready to start?"
        line2="Let's walk the property."
        cta="Book a consultation"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="Landscape design, build, and maintenance: one crew from drawing to care."
        area="Serving the North Shore of Long Island"
        services={["Design", "Patios & walkways", "Retaining walls", "Garden & planting", "Lighting", "Maintenance"]}
        phone={PHONE}
        email="hello@stoneandsage.demo"
        location="North Shore, Long Island, NY"
        hours="Mon–Sat, 7am–6pm"
        strip="Licensed & Insured · Free Consultations · Design-Build"
      />
    </DemoShell>
  );
}
