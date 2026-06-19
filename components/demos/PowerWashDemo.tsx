// Style demo — a power-washing homepage in the clean & crisp "Tide Line" mood
// (SKILL §13d): cool off-white, deep cool ink, water-blue accent, a clean
// grotesque, high-key before/after photography. The bright white site proves
// "spotless" before a word is read. Same editorial skeleton as the dark demos.
// "Tide Line Power Washing" is a sample brand for the demo, not a client.

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

const ACCENT = "#1E86C4"; // clean water blue (deeper for contrast on white)

// Clean & crisp power-washing mood (SKILL §13d).
const THEME: DemoTheme = {
  bg: "#F4F7F9", // clean cool off-white (water-white)
  surface: "#FFFFFF",
  fg: "#14202A", // deep cool ink
  body: "#4D5A64", // cool slate
  muted: "#8A98A2", // cool gray
  line: "#E2E9ED", // cool light hairline
  accent: ACCENT,
  onAccent: "#FFFFFF",
  font: "var(--font-tight)", // clean grotesque, no serif
  heroScrim: "linear-gradient(180deg, rgba(244,247,249,.1), rgba(244,247,249,.76))",
  breakScrim: "linear-gradient(180deg, rgba(244,247,249,.38), rgba(244,247,249,.85))",
};
const PHONE = "(631) 555-0192";
const NAME = "Tide Line Power Washing";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/powerwash-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstPowerWashImage = "";

const SERVICES = [
  { title: "House soft wash", copy: "Siding, trim, and gutters. Low pressure, no stripped paint. Most homes done in a morning." },
  { title: "Driveways & walkways", copy: "Concrete and pavers back to the color you forgot they were. Oil stains included." },
  { title: "Decks, fences & patios", copy: "Wood and vinyl, cleaned and brightened, ready for staining or just for summer." },
  { title: "Roof & gutter wash", copy: "Black streaks and clogged gutters cleared with a soft-wash that won't tear up shingles." },
];

const WORK = [
  { tag: "House", caption: "Vinyl siding soft wash — full exterior" },
  { tag: "Driveway", caption: "Concrete driveway — grease & algae lifted" },
  { tag: "Deck", caption: "Cedar deck brightened before staining" },
  { tag: "Patio", caption: "Paver patio — sand re-set after wash" },
  { tag: "Roof", caption: "Roof soft wash — streaks gone" },
  { tag: "Fence", caption: "Vinyl fence line restored" },
];

const PROPS = [
  { title: "The right pressure", copy: "Soft wash where it belongs, high pressure where it's safe. Clean without the damage." },
  { title: "Flat, written quotes", copy: "One number for the whole job. No hourly meter, no surprise add-ons at the end." },
  { title: "Local & responsive", copy: "We're based in Suffolk and we answer our phone. Most quotes go out the same day." },
  { title: "Licensed & insured", copy: "Fully covered, and happy to show proof before anyone touches your house." },
  { title: "We show up", copy: "When we say we'll be there, we're there. No no-shows, no disappearing mid-job." },
];

const FAQ = [
  { q: "What areas do you serve?", a: "Suffolk County — Sayville, Patchogue, Bayport, Blue Point, Oakdale, Bohemia, Holbrook, and nearby towns." },
  { q: "Will pressure washing damage my siding?", a: "Not the way we do it. Houses get a low-pressure soft wash that cleans the surface without forcing water behind it." },
  { q: "Can I just text a photo for a price?", a: "Yes — that's the fastest way. Send a picture of the house or driveway and we'll send back a flat quote, usually the same day." },
  { q: "Are you licensed and insured?", a: "Fully licensed and insured. We'll send proof before we start if you'd like to see it." },
  { q: "How long does a wash take?", a: "Most homes and driveways are a single morning. We'll give you a real time window when we quote it." },
];

export function PowerWashDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free quote" />
      <DemoHero
        heroImage={firstPowerWashImage}
        eyebrow="Power washing · Suffolk County"
        line1="Like the day"
        line2="it was built."
        sub="Houses, driveways, decks, and fences washed back to new in one visit. Flat quotes, no surprises."
        primaryCta="Get a free quote"
        phone={PHONE}
        mediaLabel="HERO VIDEO — wash footage (16:9)"
      />
      <DemoMarquee terms={["Houses", "Driveways", "Decks", "Patios", "Fences"]} />
      <Intro
        eyebrow="Who we are"
        line1="One visit."
        line2="Back to new."
        paragraphs={[
          "Most of what looks worn out is just dirty. Siding, concrete, decks — a proper wash buys you years before you ever think about replacing anything.",
          "Tide Line does it in one visit, with the right pressure for each surface, and a flat number you agree to before we start.",
        ]}
        badges={[
          ["Soft wash to high pressure", "Right for each surface"],
          ["Flat written quotes", "No surprises"],
          ["Licensed & insured", "Fully covered"],
          ["Same-day quotes", "Text a photo"],
        ]}
      />
      <ServiceCards
        eyebrow="What we wash"
        line1="Four services."
        line2="One clean house."
        services={SERVICES}
        thumbPrefix="SERVICE"
      />
      <FullBleedBreak
        eyebrow="See the difference"
        line1="The difference"
        line2="is not subtle."
        paragraph="Same driveway, two hours apart. Send a photo of yours and we'll tell you exactly what it'll cost — no walkthrough required."
        checklist={[
          "Flat quote before we start",
          "Soft wash that won't strip paint",
          "Same crew, one visit",
          "Licensed & insured",
        ]}
        cta="Text us a photo"
        mediaLabel="TRANSFORMATION — before/after driveway (16:9)"
      />
      <WorkGrid
        eyebrow="Recent work"
        line1="Before, after,"
        line2="and done."
        items={WORK}
      />
      <ValueProps
        eyebrow="Why hire us"
        line1="Clean, without"
        line2="the headache."
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
        line1="Text a photo."
        line2="Get a price."
        copy="Send a picture of the house or driveway, call, or fill out the form. We reply with a flat quote, usually the same day. No pressure."
        phone={PHONE}
        email="hello@tideline.demo"
        location="Suffolk County, Long Island, NY"
        serviceLabel="What needs washing"
        serviceOptions={["House soft wash", "Driveway / walkway", "Deck / fence / patio", "Roof / gutters", "Multiple", "Not sure yet"]}
        propertyTypes={["Residential", "Commercial"]}
      />
      <CtaBand
        line1="Ready when you are."
        line2="Text us a photo."
        cta="Get a free quote"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="Exterior soft washing and pressure cleaning, done in a single visit."
        area="Serving Suffolk County, Long Island"
        services={["House soft wash", "Driveways & walkways", "Decks, fences & patios", "Roof & gutter wash"]}
        phone={PHONE}
        email="hello@tideline.demo"
        location="Suffolk County, Long Island, NY"
        hours="Mon–Sat, 8am–6pm"
        strip="Licensed & Insured · Flat Quotes · Same-Day Estimates"
      />
    </DemoShell>
  );
}
