// Style demo — a landscape design/build homepage in the dark, photographic,
// editorial "Axel's / Sallem" system (see
// .claude/skills/local-service-design-system/SKILL.md). "Stone & Sage
// Landscapes" is a sample brand for the demo, not a client.

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

const ACCENT = "#5E7F52"; // moss / sage green
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

const WORK = [
  { tag: "Patio", caption: "Bayside terrace & plantings — Port Washington" },
  { tag: "Hardscape", caption: "Pool surround in bluestone — Huntington" },
  { tag: "Garden", caption: "Native meadow front yard — Northport" },
  { tag: "Feature", caption: "Outdoor kitchen & pergola — Cold Spring Harbor" },
  { tag: "Wall", caption: "Tiered retaining wall & steps" },
  { tag: "Lighting", caption: "Low-voltage path & garden lighting" },
];

const PROPS = [
  { title: "Built by hand", copy: "Every crew on site is ours. Masonry, carpentry, irrigation, and planting, held to the drawing." },
  { title: "Built to last", copy: "We build the base you can't see right, so the surface you can see stays put." },
  { title: "Straight, written pricing", copy: "A real number on paper before we break ground. No surprises mid-project." },
  { title: "Local & responsive", copy: "We're on the North Shore and we answer our phone. You deal with the people doing the work." },
  { title: "Full service", copy: "Design, build, and care under one roof, so there's no finger-pointing between trades." },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The North Shore of Long Island — Huntington, Northport, Port Washington, Cold Spring Harbor, and nearby towns." },
  { q: "Do you do design and build, or just one?", a: "Both, and we prefer to do both. When the crew that builds it drew it, far less gets lost between the plan and the ground." },
  { q: "How long does a project take?", a: "A patio is usually a couple of weeks; a full property runs a season. We give you a real schedule before we start." },
  { q: "Do you give free estimates?", a: "Yes. We walk the property, talk through what you want, and put a written number in front of you. No pressure." },
  { q: "Do you maintain what you build?", a: "We do, and we'd rather. Seasonal care by the people who built it keeps it looking right for years." },
];

export function LandscapingDemo() {
  return (
    <DemoShell accent={ACCENT}>
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
      <ServiceCards
        eyebrow="What we do"
        line1="Six specialties."
        line2="One property."
        services={SERVICES}
        thumbPrefix="SERVICE"
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
      <WorkGrid
        eyebrow="Recent work"
        line1="Work you can"
        line2="stand in."
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
        serviceOptions={["Design", "Patio / walkway", "Retaining wall", "Garden & planting", "Maintenance", "Custom feature", "Not sure yet"]}
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
        services={["Design", "Patios & walkways", "Retaining walls", "Garden & planting", "Maintenance", "Custom features"]}
        phone={PHONE}
        email="hello@stoneandsage.demo"
        location="North Shore, Long Island, NY"
        hours="Mon–Sat, 7am–6pm"
        strip="Licensed & Insured · Free Consultations · Design–Build"
      />
    </DemoShell>
  );
}
