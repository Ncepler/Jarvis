// Style demo — a renovation/remodeling contractor homepage in the dark,
// photographic, editorial "Axel's / Sallem" system (see
// .claude/skills/local-service-design-system/SKILL.md §9 + §14e). "Maple & Main
// Renovation Co." is a sample brand for the demo, not a client. This is the
// REFERENCE build the other demos match for quality. Mood stays near-black §2,
// minimal and gallery-driven — the photography does the talking.

import {
  BeforeAfterSlider,
  Contact,
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoHero,
  DemoMarquee,
  DemoShell,
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

const ACCENT = "#C8893F"; // warm finished-wood caramel
const PHONE = "(516) 555-0000";
const NAME = "Maple & Main Renovation Co.";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/renovation-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstRenovationImage = "/previews/firstRenovationImage.webp";

const SERVICES = [
  { title: "Kitchens", copy: "Full gut to finish — cabinets, counters, tile, lighting. We handle the whole room, not just the pretty part." },
  { title: "Bathrooms", copy: "Walk-in showers, tile, vanities, plumbing. Built to handle water and last decades, not seasons." },
  { title: "Additions & extensions", copy: "More room without moving. Framed, wired, insulated, and finished to match the house you already have." },
  { title: "Basements", copy: "Dry, warm, finished space — living rooms, suites, gyms. Moisture handled first, drywall second." },
  { title: "Whole-home renovations", copy: "Top to bottom, one crew, one schedule. We live in your house's mess so you don't have to manage five trades." },
  { title: "Trim & finish carpentry", copy: "Crown, baseboard, built-ins, doors. The details that make a renovation read as custom instead of contractor-grade." },
];

// "How it goes" — the process timeline (§14e). Honest durations.
const PROCESS = [
  { title: "Design", what: "We measure, talk through the scope, and put a real written number in front of you.", duration: "1–2 weeks" },
  { title: "Demolition", what: "Floors covered, the old room out clean, and any surprises found before they cost you.", duration: "2–4 days" },
  { title: "Build", what: "Framing, plumbing, electric, and tile — our own crew, held to the drawing.", duration: "2–4 weeks" },
  { title: "Finish", what: "Trim, paint, fixtures, and a walk-through. We don't leave you a punch list.", duration: "3–5 days" },
];

// Work grid is filterable by room (§14e). Tags match the chip set below.
const WORK_CHIPS = ["Kitchen", "Bath", "Addition", "Whole-home", "Exterior"];
const WORK = [
  { tag: "Kitchen", caption: "Kitchen — full gut renovation" },
  { tag: "Bath", caption: "Primary bath — walk-in tile shower" },
  { tag: "Addition", caption: "Rear addition — framed & finished" },
  { tag: "Whole-home", caption: "1920s colonial — full restoration" },
  { tag: "Exterior", caption: "Front entry & porch rebuild" },
  { tag: "Kitchen", caption: "Galley kitchen — opened to the dining room" },
  { tag: "Bath", caption: "Guest bath — floating vanity & tile" },
  { tag: "Whole-home", caption: "Cape — second-story gut & rebuild" },
  { tag: "Exterior", caption: "Cedar siding & new windows" },
];

const PROPS = [
  { title: "One crew, every trade", copy: "Carpentry, tile, plumbing, electric — our people, not a rotating cast of subs you've never met." },
  { title: "Built to last", copy: "We fix what's behind the wall before we close it up. The work holds because the bones do." },
  { title: "Straight, written pricing", copy: "A real number on paper before we start. No surprise line items halfway through the job." },
  { title: "Local & responsive", copy: "We're on the North Shore and we answer our phone. You deal with the people doing the work." },
  { title: "Clean and on schedule", copy: "We protect your floors, sweep up daily, and show up when we say we will. No disappearing mid-job." },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The North Shore of Long Island — Huntington, Northport, Cold Spring Harbor, Port Washington, and the surrounding towns. If you're nearby, just ask." },
  { q: "Do you handle small remodels and whole-home?", a: "Both. A single bathroom or a full gut down to the studs — same crew, same standard. Tell us the scope and we'll tell you straight." },
  { q: "Are you licensed and insured?", a: "Yes. Fully licensed and insured, and happy to send proof before any work starts." },
  { q: "Do you give free estimates?", a: "Always. We walk the house, talk through what you want, and put a real written number in front of you. No pressure." },
  { q: "How long does a renovation take?", a: "A bathroom is usually a few weeks; a whole-home runs a few months. We give you a real schedule up front and keep you posted as we go." },
  { q: "Do you use your own crew?", a: "Yes — no subs. The people who quote the job are the people doing it. That's how the quality stays consistent." },
];

// ── Services — room before/after sliders carry the visual weight, with the
// numbered 01–06 list as a compact strip beneath (§14e). ──────────────────────
function RoomTransforms() {
  return (
    <Section>
      <Rise>
        <Eyebrow>What we do</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Drag to see" b="the difference." />
        </div>
        <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
          Same room, before and after. Drag the handle on a kitchen and a bath we
          took down to the studs and brought back better than new.
        </p>
      </Rise>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Rise>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
            Kitchen — full gut
          </p>
          <BeforeAfterSlider beforeLabel="BEFORE — kitchen (16:9)" afterLabel="AFTER — kitchen (16:9)" />
        </Rise>
        <Rise delay={0.1}>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
            Bath — walk-in tile shower
          </p>
          <BeforeAfterSlider beforeLabel="BEFORE — bath (16:9)" afterLabel="AFTER — bath (16:9)" />
        </Rise>
      </div>
      {/* compact numbered service list */}
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

export function RenovationDemo() {
  return (
    <DemoShell accent={ACCENT}>
      <DemoHeader name={NAME} phone={PHONE} />
      <DemoHero
        heroImage={firstRenovationImage}
        eyebrow="Renovation & remodeling · North Shore"
        line1="Old house."
        line2="New everything."
        sub="Kitchens, baths, additions, and whole-home renovations across the North Shore. One crew, start to finish."
        primaryCta="Get a free estimate"
        phone={PHONE}
        mediaLabel="HERO VIDEO — renovation b-roll (16:9)"
      />
      <DemoMarquee terms={["Kitchens", "Bathrooms", "Additions", "Basements", "Whole-Home", "Trim & Carpentry"]} />
      <Intro
        eyebrow="What we build"
        line1="Every trade."
        line2="One crew."
        paragraphs={[
          "Most renovation headaches come from juggling five contractors who each blame the other four. We don't work that way.",
          "Maple & Main runs the whole job with our own crew — framing through finish carpentry — so there's one number, one schedule, and one person to call.",
        ]}
        badges={[
          ["Small remodels to whole-home", "Full scope"],
          ["Licensed & insured", "Fully covered"],
          ["One crew, no subs", "Our people"],
          ["Free estimates", "No pressure"],
        ]}
      />
      <RoomTransforms />
      <ProcessStepper
        eyebrow="How it goes"
        line1="No mystery."
        line2="Here's the order."
        steps={PROCESS}
        note="Most kitchens run 4–6 weeks start to finish; a full bath is usually 2–3. We give you a real schedule before we start and keep you posted as we go."
      />
      <FullBleedBreak
        eyebrow="See the transformation"
        line1="We protect what's good."
        line2="We rebuild the rest."
        paragraph="Old houses have good bones and bad surprises. We keep the character worth keeping and quietly fix everything behind the wall that isn't."
        checklist={[
          "Free in-home estimate",
          "One crew, no subs",
          "Clean site, on schedule",
          "Licensed & insured",
        ]}
        cta="Meet the crew"
        mediaLabel="TRANSFORMATION — before/after (16:9)"
      />
      <FilterableWorkGrid
        eyebrow="Recent work"
        line1="The work"
        line2="speaks plainly."
        chips={WORK_CHIPS}
        items={WORK}
      />
      <ValueProps
        eyebrow="Why hire us"
        line1="Good reasons"
        line2="to call us first."
        props={PROPS}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <Contact
        eyebrow="Free quote"
        line1="Let's talk"
        line2="about the house."
        copy="Call, text, email, or fill out the form. We usually reply the same day. No pressure, no hard sell."
        phone={PHONE}
        email="hello@mapleandmain.demo"
        location="North Shore, Long Island, NY"
        serviceLabel="Project type"
        serviceOptions={["Kitchen", "Bathroom", "Addition", "Basement", "Whole-home", "Multiple", "Not sure yet"]}
        propertyTypes={["Residential", "Commercial"]}
      />
      <CtaBand
        line1="Ready to start?"
        line2="Let's walk the house."
        cta="Get a free estimate"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="Full-service renovation and remodeling, one crew from framing to finish."
        area="Serving the North Shore of Long Island"
        services={["Kitchens", "Bathrooms", "Additions", "Basements", "Whole-home", "Trim & carpentry"]}
        phone={PHONE}
        email="hello@mapleandmain.demo"
        location="North Shore, Long Island, NY"
        hours="Mon–Sat, 7am–6pm"
        strip="Licensed & Insured · Free Estimates · No Subs"
      />
    </DemoShell>
  );
}
