"use client";

// Style demo — a landscape design/build homepage in the FOREST-DARK "Stone &
// Sage" mood (SKILL §13g + §14f): a near-black warmed toward dark forest green,
// sage accent, green-tinted scrims. The signature move is a day↔night lighting
// toggle on a featured outdoor space, built as a real clip-path wipe (not a
// plain cross-fade) so it reads as the site's one showpiece interaction.
// "Stone & Sage Landscapes" is a sample brand for the demo, not a client.

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
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
  MobileStickyCta,
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
  // Sharp-edged niche (SKILL §7 personality scale) — 4/2/0 radius tier.
  radius: "2px",
  radiusLg: "4px",
  radiusSm: "0px",
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
// (~900ms, eased) — the same pitch real landscape lighting sites make with a
// day rendering and a night one. This is the page's one named exception to
// the 300ms UI ceiling: it's a rare, marketing-grade moment, not a control
// used dozens of times a visit. Both shots are now real photos (2026-09-27
// photo pass) of the same stone patio/fire-pit seating wall: golden-hour day,
// then blue-hour with the fire pit and path lights on.
//
// It plays itself once — the section auto-wipes day→night the first time
// it's 60% in view (named purpose: show the feature without asking anyone to
// find it), then hands control to a single real switch. Reduced motion skips
// the auto-play trigger entirely (there is no wipe to demonstrate once the
// transition itself is instant) and the switch always renders as a proper
// `role="switch"`, so Space/Enter toggles it like any native control.
function DayNightSignature() {
  const reduced = useReducedMotion();
  const [night, setNight] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const autoPlayed = useRef(false);

  useEffect(() => {
    if (reduced) return; // gentler, not zero: skip the self-playing demo, keep manual control
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoPlayed.current) {
          autoPlayed.current = true;
          setNight(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    autoPlayed.current = true; // a manual toggle counts as "shown" — never auto-play over it
    setNight((v) => !v);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden d-grain"
      style={{ minHeight: "100svh" }}
    >
      <div className="absolute inset-0">
        <Media
          label="Patio — day"
          img="/demos/landscaping/patio-day.webp"
          className="h-full w-full"
          rounded={false}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          clipPath: night ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
          transition: reduced ? undefined : "clip-path 900ms var(--d-ease-out)",
        }}
      >
        <Media
          label="Patio — night, lights on"
          img="/demos/landscaping/patio-night.webp"
          className="h-full w-full"
          rounded={false}
        />
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
          {/* A single real switch, not two selectable buttons — Space/Enter
              toggles it like any native control, and the sliding highlight is
              transform-only (never width) so it stays on the compositor. */}
          <button
            type="button"
            role="switch"
            aria-checked={night}
            aria-label={
              night
                ? "Showing the after-dark view. Switch to day."
                : "Showing the day view. Switch to after dark."
            }
            onClick={toggle}
            className="d-press relative mt-9 inline-flex overflow-hidden outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)", outlineColor: "var(--d-accent)" }}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/2"
              style={{
                background: "var(--d-accent)",
                transform: night ? "translateX(100%)" : "translateX(0%)",
                transition: reduced ? undefined : "transform var(--d-dur-ui) var(--d-ease-in-out)",
              }}
            />
            <span
              aria-hidden
              className="relative px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: night ? "var(--d-fg)" : "var(--d-onaccent)", transition: "color var(--d-dur-hover) ease" }}
            >
              Day
            </span>
            <span
              aria-hidden
              className="relative px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: night ? "var(--d-onaccent)" : "var(--d-fg)", transition: "color var(--d-dur-hover) ease" }}
            >
              After dark
            </span>
          </button>
        </Rise>
      </div>
    </section>
  );
}

// ── Specialties — a numbered accordion, text only. Each row expands on click
// to reveal its detail (grid-template-rows 0fr→1fr, the same technique as the
// shared Faq accordion in system.tsx, rebuilt locally since this row's shape
// — numeral / title / chevron header, detail below — differs from Faq's
// question/answer one). The day↔night feature that used to live above this
// list is now its own full-bleed section, so this reads as a clean, confident
// list rather than a crowded combo block. ──────────────────────────────────
function Specialties() {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const uid = useId();
  const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section className="w-full py-20 md:py-32 d-grain">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-16">
        <Rise>
          <Eyebrow>What we do</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Six specialties." b="One property." />
          </div>
        </Rise>
        <style>{`
          .ls-specialty-panel {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows var(--d-dur-ui) var(--d-ease-out);
          }
          .ls-specialty-panel[data-open="true"] { grid-template-rows: 1fr; }
          .ls-specialty-panel > div { overflow: hidden; min-height: 0; }
          .ls-specialty-num { transition: color 200ms ease; }
          .ls-specialty-chevron { transition: transform var(--d-dur-ui) var(--d-ease-out); }
          .ls-specialty-chevron[data-open="true"] { transform: rotate(45deg); }
          @media (prefers-reduced-motion: reduce) {
            .ls-specialty-panel { transition: none; }
            .ls-specialty-chevron { transition: none; }
          }
        `}</style>
        <div className="mt-14" style={{ borderTop: "1px solid var(--d-line)" }}>
          {SERVICES.map((s, i) => {
            const isOpen = !!open[i];
            const panelId = `${uid}-specialty-${i}`;
            return (
              <Rise key={s.title} delay={Math.min(i * 0.05, 0.25)}>
                <div style={{ borderBottom: "1px solid var(--d-line)" }}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="d-press flex w-full items-center gap-6 py-7 text-left"
                  >
                    <span
                      className="ls-specialty-num text-[13px] font-semibold tracking-[0.1em]"
                      style={{ color: isOpen ? "var(--d-accent)" : "var(--d-muted)" }}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1 text-[19px] font-semibold" style={{ color: "var(--d-fg)" }}>
                      {s.title}
                    </span>
                    <span
                      aria-hidden
                      data-open={isOpen}
                      className="ls-specialty-chevron shrink-0 text-[20px] leading-none"
                      style={{ color: "var(--d-muted)" }}
                    >
                      +
                    </span>
                  </button>
                  <div id={panelId} className="ls-specialty-panel" data-open={isOpen} role="region">
                    <div>
                      <p
                        className="pb-7 pl-[52px] pr-6 text-[15px] leading-[1.6] sm:pl-[64px]"
                        style={{ color: "var(--d-body)" }}
                      >
                        {s.copy}
                      </p>
                    </div>
                  </div>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Projects — a text-only ruled list (project / town / scope), no photos.
// The existing "WORK:" captions become the three columns directly, aligned to
// the same fixed-width grid as the header row. Each row draws in a full-width
// hairline under itself on hover — background-size 0%→100% on a 1px gradient,
// the same technique as the shared .d-link underline (system.tsx/globals.css)
// but horizontal and under the whole row instead of under text — so hovering
// a row down the list reads as a confirm, not decoration. Hover-only, gated
// to real pointers; a fine-pointer visitor is the only one who'd ever rest a
// cursor on a row long enough to notice it. ─────────────────────────────────
function ProjectsList() {
  return (
    <section className="w-full py-24 md:py-36 d-grain">
      <style>{`
        .ls-row-hairline {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background-image: linear-gradient(90deg, var(--d-accent), var(--d-accent));
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 0% 100%;
          transition: background-size 300ms var(--d-ease-out);
          pointer-events: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .ls-row:hover .ls-row-hairline { background-size: 100% 100%; }
        }
      `}</style>
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
                className="ls-row relative grid grid-cols-1 gap-1.5 py-5 sm:grid-cols-[1fr_200px_140px] sm:items-center sm:gap-6"
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
                <span aria-hidden className="ls-row-hairline" />
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
        className="py-6 d-grain"
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
      <MobileStickyCta phone={PHONE} bookLabel="Book a consult" contactId="contact" />
    </DemoShell>
  );
}
