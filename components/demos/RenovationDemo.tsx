// Style demo — a renovation/remodeling contractor homepage in the dark,
// photographic, editorial "Axel's / Sallem" system (see
// .claude/skills/local-service-design-system/SKILL.md §9). "Maple & Main
// Renovation Co." is a sample brand for the demo, not a client. This is the
// REFERENCE build the other six demos match for quality.

import {
  Contact,
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoHero,
  DemoMarquee,
  DemoShell,
  Faq,
  FullBleedBreak,
  Intro,
  ServiceCards,
  ValueProps,
  WorkGrid,
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

const WORK = [
  { tag: "Kitchen", caption: "Kitchen — full gut renovation" },
  { tag: "Bath", caption: "Primary bath — walk-in tile shower" },
  { tag: "Addition", caption: "Rear addition — framed & finished" },
  { tag: "Whole-home", caption: "1920s colonial — full restoration" },
  { tag: "Exterior", caption: "Front entry & porch rebuild" },
  { tag: "Basement", caption: "Basement — finished living suite" },
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
      <ServiceCards
        eyebrow="What we do"
        line1="Six things."
        line2="Done right."
        services={SERVICES}
        thumbPrefix="SERVICE"
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
      <WorkGrid
        eyebrow="Recent work"
        line1="The work"
        line2="speaks plainly."
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
