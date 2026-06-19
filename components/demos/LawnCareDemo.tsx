// Style demo — a lawn-care homepage in the fresh-daylight "Fresh Cut" mood
// (SKILL §13e): soft fresh off-white, deep grass near-black, grass-green accent,
// a friendly grotesque, sunny daylight photography. Light because it's a
// friendly, low-stakes weekly service — sunny and approachable. Same editorial
// skeleton as the dark demos. "Fresh Cut Lawn Co." is a sample brand, not a client.

import {
  Contact,
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoHero,
  DemoMarquee,
  DemoShell,
  type DemoTheme,
  Faq,
  FullBleedBreak,
  Intro,
  ServiceCards,
  ValueProps,
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
const firstLawnCareImage = "";

const SERVICES = [
  { title: "Weekly mowing", copy: "Cut, trimmed, edged, blown clean. Same crew, same day every week, and the stripes stay straight." },
  { title: "Spring & fall cleanups", copy: "Leaves, branches, beds, and gutters cleared at ground level. One visit, done." },
  { title: "Mulch & edging", copy: "Fresh mulch and crisp bed lines — the detail the neighbors actually notice." },
  { title: "Fertilizing & weed control", copy: "A simple seasonal program to keep the lawn thick and green without the guesswork." },
];

const WORK = [
  { tag: "Mowing", caption: "Weekly cut with clean edges" },
  { tag: "Stripes", caption: "Straight mow lines, front to back" },
  { tag: "Cleanup", caption: "Fall leaf cleanup — beds cleared" },
  { tag: "Mulch", caption: "Fresh mulch & re-cut bed lines" },
  { tag: "Treatment", caption: "Seasonal fertilizer application" },
  { tag: "Edging", caption: "Crisp walkway & driveway edges" },
];

const PROPS = [
  { title: "Same crew, same day", copy: "You get the same people on the same day each week, so the work stays consistent." },
  { title: "No contracts", copy: "No lock-in. Skip or cancel by text anytime — we earn the next visit." },
  { title: "A price that night", copy: "Text a photo and your address; we send a firm number for your exact yard, no visit needed." },
  { title: "Fully insured", copy: "Covered and careful around your beds, fences, and the kids' stuff in the yard." },
  { title: "We answer", copy: "No voicemail tag. Text us and a real person texts back the same day." },
];

const FAQ = [
  { q: "What areas do you serve?", a: "The South Shore of Nassau County and nearby towns. Send your address and we'll confirm you're on the route." },
  { q: "Do I need a contract?", a: "No. We run week to week. Skip a cut or cancel entirely by text — no penalty, no paperwork." },
  { q: "How do I get a price?", a: "Text a photo of the yard and your address. You'll have a firm weekly number that night, no site visit required." },
  { q: "What day will you come?", a: "You get a set day each week with the same crew. If weather pushes it, we'll text you the new day." },
  { q: "Are you insured?", a: "Yes, fully insured. Happy to send proof before your first visit." },
];

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
      <ServiceCards
        eyebrow="What we do"
        line1="Four services."
        line2="One tidy yard."
        services={SERVICES}
        thumbPrefix="SERVICE"
      />
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
      <ValueProps
        eyebrow="Why homeowners pick us"
        line1="Reasons they"
        line2="don't switch."
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
        line1="Get your quote"
        line2="tonight."
        copy="Text a photo of your yard, call, or fill out the form. We reply the same day with a real price. No contracts, no pressure."
        phone={PHONE}
        email="hello@freshcut.demo"
        location="South Shore, Nassau County, NY"
        serviceLabel="What you need"
        serviceOptions={["Weekly mowing", "Spring / fall cleanup", "Mulch & edging", "Fertilizing & weed control", "Multiple", "Not sure yet"]}
        propertyTypes={["Residential", "Commercial"]}
      />
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
