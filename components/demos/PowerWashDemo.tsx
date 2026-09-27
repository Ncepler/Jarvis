// Style demo — a power-washing homepage in the clean & crisp "Tide Line" mood
// (SKILL §13d + §14a): cool off-white, water-blue accent, a clean grotesque,
// high-key before/after photography. The whole pitch is the transformation,
// so the interactive before/after slider is the first thing after the hero —
// not a service description, not a "why us" list, the actual proof — and the
// four services and six recent jobs run as plain ruled lists instead of
// image-card grids so the page doesn't lean on placeholder photography it
// doesn't have yet. "Tide Line Power Washing" is a sample brand, not a client.

import type { ReactNode } from "react";
import {
  ANCHOR_SCROLL_CLASS,
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
  ProcessStepper,
  Rise,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

const PREMIUM_HERO = heroConceptFor("demo-powerwash");
const ACCENT = "#1E86C4"; // clean water blue (deeper for contrast on white)

// Clean & crisp power-washing mood (SKILL §13d) — matches the spec exactly,
// left unchanged.
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
const TEL_HREF = `tel:+1${PHONE.replace(/\D/g, "")}`;
const NAME = "Tide Line Power Washing";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
const firstPowerWashImage = "/previews/firstPowerWashImage.webp";

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
  { tag: "House", caption: "Vinyl siding soft wash: full exterior" },
  { tag: "Driveway", caption: "Concrete driveway: grease & algae lifted" },
  { tag: "Deck", caption: "Cedar deck brightened before staining" },
  { tag: "Patio", caption: "Paver patio: sand re-set after wash" },
  { tag: "Roof", caption: "Roof soft wash: streaks gone" },
  { tag: "Fence", caption: "Vinyl fence line restored" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "Suffolk County: Sayville, Patchogue, Bayport, Blue Point, Oakdale, Bohemia, Holbrook, and nearby towns." },
  { q: "Will pressure washing damage my siding?", a: "Not the way we do it. Houses get a low-pressure soft wash that cleans the surface without forcing water behind it." },
  { q: "Can I just text a photo for a price?", a: "Yes, that's the fastest way. Send a picture of the house or driveway and we'll send back a flat quote, usually the same day." },
  { q: "Are you licensed and insured?", a: "Fully licensed and insured. We'll send proof before we start if you'd like to see it." },
  { q: "How long does a wash take?", a: "Most homes and driveways are a single morning. We'll give you a real time window when we quote it." },
];

// ── The transformation — the section's centerpiece (§14a), moved to run
// directly after the hero/marquee/intro block, before the service list.
// The real before/after driveway photo pair couldn't be sourced for this
// pass (network policy blocked the host), so the slider runs on its built-in
// labeled-placeholder fallback — fully functional and correctly shaped,
// ready to take real images later.
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
            yours and we&apos;ll tell you exactly what it&apos;ll cost, no walkthrough required.
          </p>
        </Rise>
        <Rise delay={0.1}>
          <div className="mt-10">
            <BeforeAfterSlider beforeLabel="BEFORE: driveway" afterLabel="AFTER: driveway" beforeFile="before-1.jpg" afterFile="after-1.jpg" />
          </div>
        </Rise>
        <Rise delay={0.15}>
          <a
            href="#contact"
            className="press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            Text us a photo
          </a>
        </Rise>
      </div>
    </section>
  );
}

// ── A single hairline row: number, title, one-line copy, right-hand meta.
// This is the "RuledList" pattern (§build note): map over items, each row
// sitting on `borderTop: 1px solid var(--d-line)`. Shared by the services
// list below and the recent-work list, at two different densities.
function RuledRow({
  index,
  title,
  meta,
  children,
  dense,
}: {
  index: number;
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  dense?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8 ${dense ? "py-5" : "py-7"}`}
      style={{ borderTop: "1px solid var(--d-line)" }}
    >
      <div className={`flex items-baseline gap-4 sm:shrink-0 ${dense ? "sm:w-[200px]" : "sm:w-[260px]"}`}>
        <span
          className="text-[12px] font-semibold tracking-[0.1em]"
          style={{ color: dense ? "var(--d-muted)" : "var(--d-accent)" }}
        >
          0{index}
        </span>
        <span
          className={dense ? "text-[15px] font-semibold uppercase tracking-[0.06em]" : "text-[20px] font-semibold leading-[1.2]"}
          style={{ color: "var(--d-fg)" }}
        >
          {title}
        </span>
      </div>
      {children && (
        <p className="flex-1 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
          {children}
        </p>
      )}
      {meta && (
        <span
          className="text-[12px] font-semibold uppercase tracking-[0.1em] sm:shrink-0 sm:text-right"
          style={{ color: "var(--d-muted)" }}
        >
          {meta}
        </span>
      )}
    </div>
  );
}

// ── Services — a plain ruled list, one flat quote per job (§14a "simpler
// fallback"). No RESULT thumbnails: the slider above already carries the
// proof, so this stays fast, text-led, and honest about having no photos yet.
function WashServices() {
  return (
    <section className="w-full" style={{ borderBottom: "1px solid var(--d-line)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-[96px] md:px-16 md:py-[150px]">
        <Rise>
          <Eyebrow>What we wash</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Four services." b="One flat quote." />
          </div>
        </Rise>
        <div className="mt-14">
          {WASH.map((s, i) => (
            <Rise key={s.slug} delay={Math.min(i * 0.06, 0.24)}>
              <RuledRow index={i + 1} title={s.title} meta={s.includes}>
                {s.copy}
              </RuledRow>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Recent work — six real-shaped jobs as a dense ruled list rather than a
// thumbnail grid (§build note: keep it simple, no photos to show yet).
function RecentWork() {
  return (
    <section className="w-full" style={{ borderBottom: "1px solid var(--d-line)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-[64px] md:px-16 md:py-[112px]">
        <Rise>
          <Eyebrow>Recent work</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Recent jobs," b="close to home." />
          </div>
        </Rise>
        <div className="mt-10">
          {WORK.map((w, i) => (
            <Rise key={w.caption} delay={Math.min(i * 0.05, 0.25)}>
              <RuledRow index={i + 1} title={w.tag} dense>
                {w.caption}
              </RuledRow>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Text a photo — the phone number in large display type, leading into the
// full contact form (§7: Contact/ContactBlock led by "Text a photo").
function TextUsBand() {
  return (
    <section className="w-full" style={{ borderTop: "1px solid var(--d-line)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-[56px] md:px-16 md:py-[88px]">
        <Rise>
          <Eyebrow>Fastest way to reach us</Eyebrow>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Text a photo of the job and we&apos;ll text back a flat price. No walkthrough, no waiting on hold.
          </p>
          <a
            href={TEL_HREF}
            className="press mt-6 inline-block text-[48px] font-bold leading-[1.02] tracking-[-0.02em] md:text-[84px]"
            style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
          >
            {PHONE}
          </a>
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--d-muted)" }}>
            Call or text, 8am–6pm
          </p>
        </Rise>
      </div>
    </section>
  );
}

export function PowerWashDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free quote" />
      <StickyScene image={firstPowerWashImage} priority>
        <DemoHero
          pinned
          heroImage={firstPowerWashImage}
          eyebrow="Power washing · Suffolk County"
          line1="Like the day"
          line2="it was built."
          sub="Houses, driveways, decks, and fences washed back to new in one visit. Flat quotes, no surprises."
          primaryCta="Get a free quote"
          phone={PHONE}
          mediaLabel="HERO VIDEO: wash footage"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="One visit."
                line2="Back to new."
                paragraphs={[
                  "Most of what looks worn out is just dirty. Siding, concrete, decks: a proper wash buys you years before you ever think about replacing anything.",
                  "Tide Line does it in one visit, with the right pressure for each surface, and a flat number you agree to before we start.",
                ]}
                badges={[
                  ["Soft wash to high pressure", "Right for each surface"],
                  ["Flat written quotes", "No surprises"],
                  ["Licensed & insured", "Fully covered"],
                  ["Same-day quotes", "Text a photo"],
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
        <DemoMarquee terms={["Houses", "Driveways", "Decks", "Patios", "Fences"]} />
      </div>
      <WashTransformation />
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <WashServices />
      </div>
      <ProcessStepper
        eyebrow="How it works"
        line1="Before, after,"
        line2="and done."
        steps={[
          {
            title: "Send a photo",
            what: "Text a picture of the house, driveway, or deck. We measure off it and text back a flat price.",
            duration: "Same-day quote",
          },
          {
            title: "We wash",
            what: "One crew, one visit. Soft wash on siding and roofs, full pressure on concrete and pavers.",
            duration: "Usually one morning",
          },
          {
            title: "Walk it together",
            what: "We check every surface with you before we pack up. Anything missed gets fixed on the spot.",
            duration: "Before we go",
          },
        ]}
      />
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <RecentWork />
      </div>
      <Faq
        eyebrow="Questions"
        line1="Before you book,"
        line2="what to expect."
        items={FAQ}
      />
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
        <TextUsBand />
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
      </div>
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
