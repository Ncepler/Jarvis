// Style demo — a power-washing homepage in the clean & crisp "Tide Line" mood
// (SKILL §13d + §14a): cool off-white, water-blue accent, a clean grotesque,
// high-key before/after photography. The whole pitch is the transformation, so
// the services section is alternating before/after PROOF ROWS, the full-bleed
// break is a big interactive before/after slider, and "why us" is a proof strip
// — not the numbered grid. "Tide Line Power Washing" is a sample brand, not a client.

import {
  BeforeAfterSlider,
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
  ProofStrip,
  Rise,
  Section,
  TwoLine,
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
const firstPowerWashImage = "/previews/firstPowerWashImage.webp";

// Each service is a before/after proof row, not a text card (§14a).
const WASH = [
  {
    title: "House soft wash",
    slug: "house",
    copy: "Siding, trim, and gutters. Low pressure, no stripped paint. Most homes done in a morning.",
    includes: "Siding · soffits · gutters · trim",
  },
  {
    title: "Driveways & walkways",
    slug: "driveway",
    copy: "Concrete and pavers back to the color you forgot they were. Oil stains included.",
    includes: "Concrete · pavers · walkways · steps",
  },
  {
    title: "Decks, fences & patios",
    slug: "deck",
    copy: "Wood and vinyl, cleaned and brightened, ready for staining or just for summer.",
    includes: "Wood · composite · vinyl · pavers",
  },
  {
    title: "Roof & gutter wash",
    slug: "roof",
    copy: "Black streaks and clogged gutters cleared with a soft-wash that won't tear up shingles.",
    includes: "Roof streaks · gutters · downspouts",
  },
];

const WORK = [
  { tag: "House", caption: "Vinyl siding soft wash — full exterior" },
  { tag: "Driveway", caption: "Concrete driveway — grease & algae lifted" },
  { tag: "Deck", caption: "Cedar deck brightened before staining" },
  { tag: "Patio", caption: "Paver patio — sand re-set after wash" },
  { tag: "Roof", caption: "Roof soft wash — streaks gone" },
  { tag: "Fence", caption: "Vinyl fence line restored" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "Suffolk County — Sayville, Patchogue, Bayport, Blue Point, Oakdale, Bohemia, Holbrook, and nearby towns." },
  { q: "Will pressure washing damage my siding?", a: "Not the way we do it. Houses get a low-pressure soft wash that cleans the surface without forcing water behind it." },
  { q: "Can I just text a photo for a price?", a: "Yes — that's the fastest way. Send a picture of the house or driveway and we'll send back a flat quote, usually the same day." },
  { q: "Are you licensed and insured?", a: "Fully licensed and insured. We'll send proof before we start if you'd like to see it." },
  { q: "How long does a wash take?", a: "Most homes and driveways are a single morning. We'll give you a real time window when we quote it." },
];

// ── Services — alternating before/after proof rows (§14a). The result, not an
// icon, is the visual for every service. ─────────────────────────────────────
function WashProofRows() {
  return (
    <Section>
      <Rise>
        <Eyebrow>What we wash</Eyebrow>
        <div className="mt-5">
          <TwoLine a="We don't describe it." b="We show it." />
        </div>
      </Rise>
      <div className="mt-14 space-y-16 md:space-y-20">
        {WASH.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Rise key={s.slug}>
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                {/* before/after pair */}
                <div className={flip ? "md:order-2" : ""}>
                  <div className="grid grid-cols-2 gap-3">
                    <Media label={`BEFORE — ${s.slug} (4:3)`} />
                    <Media label={`AFTER — ${s.slug} (4:3)`} />
                  </div>
                </div>
                {/* text */}
                <div className={flip ? "md:order-1" : ""}>
                  <span className="text-[13px] font-semibold tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-[26px] font-semibold leading-[1.15]" style={{ color: "var(--d-fg)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                    {s.copy}
                  </p>
                  <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--d-muted)" }}>
                    {s.includes}
                  </p>
                </div>
              </div>
            </Rise>
          );
        })}
      </div>
    </Section>
  );
}

// ── The transformation — the prominent interactive before/after slider (§14a).
function WashTransformation() {
  return (
    <section className="w-full" style={{ borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-[80px] md:px-16 md:py-[120px]">
        <Rise>
          <Eyebrow>See the difference</Eyebrow>
          <div className="mt-5">
            <TwoLine a="The difference" b="is not subtle." />
          </div>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Same driveway, two hours apart. Drag the handle. Then send a photo of
            yours and we&apos;ll tell you exactly what it&apos;ll cost — no walkthrough required.
          </p>
        </Rise>
        <Rise delay={0.1}>
          <div className="mt-10">
            <BeforeAfterSlider beforeLabel="BEFORE — driveway (16:9)" afterLabel="AFTER — driveway (16:9)" />
          </div>
        </Rise>
        <Rise delay={0.15}>
          <span
            className="mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            Text us a photo
          </span>
        </Rise>
      </div>
    </section>
  );
}

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
      <WashProofRows />
      <WashTransformation />
      <WorkGrid
        eyebrow="Recent work"
        line1="Before, after,"
        line2="and done."
        items={WORK}
      />
      <ProofStrip
        eyebrow="Why hire us"
        line1="Clean, without"
        line2="the headache."
        claims={[
          { label: "Flat written quote", sub: "One number for the whole job. No hourly meter." },
          { label: "Soft wash that won't strip paint", sub: "The right pressure for each surface." },
          { label: "Same crew, one visit", sub: "We show up when we say, and finish in a day." },
          { label: "Licensed & insured", sub: "Fully covered, proof on request." },
        ]}
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
