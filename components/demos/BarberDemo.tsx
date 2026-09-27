"use client";

// Style demo — a barbershop homepage in the warm leather-lounge "Standard" mood
// (SKILL §13c + §14c): warm espresso-black, candlelit bone text, BRASS/GOLD
// accent (oxblood secondary), an Oswald condensed display, warm lamplit
// photography. The cut list is a vintage PRICE BOARD with brass leader dots;
// "behind the chair" is a plain caption list (no photos exist yet); hours are
// a posted-sign table. "Standard Barber Co." is a sample brand for the demo,
// not a client.

import { useEffect, useState } from "react";
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
  FullBleedBreak,
  Intro,
  MobileStickyCta,
  Rise,
  Section,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

const PREMIUM_HERO = heroConceptFor("demo-barber");
const ACCENT = "#B0833F"; // brass / gold — warm lamplight (primary)
const OXBLOOD = "#9A3B33"; // deep oxblood (secondary, used once — the Hours CTA)

// Warm leather-lounge barber mood (SKILL §13c) — matches the spec exactly.
const THEME: DemoTheme = {
  bg: "#16110C", // warm espresso-black, leather-dark (NOT the cool #0B0B0C)
  surface: "#20180F", // worn-leather panel, a touch warmer/lighter
  fg: "#F0E7D6", // warm bone / candlelit cream
  body: "#C2B49C", // aged paper
  muted: "#8A7B65", // dim brass-gray
  line: "#2E2419", // dark leather seam
  accent: ACCENT,
  onAccent: "#16110C", // dark text on brass
  font: "var(--font-tight)",
  display: "var(--font-oswald)", // vintage condensed signage
  heroScrim: "linear-gradient(180deg, rgba(22,17,12,.35), rgba(22,17,12,.85))",
  breakScrim: "linear-gradient(180deg, rgba(22,17,12,.55), rgba(22,17,12,.9))",
  // Sharp-edged niche (SKILL §7 personality scale, tier 4/2/0) — the price
  // board stays sharp (radiusSm) while a rare larger panel gets radiusLg.
  radius: "2px",
  radiusLg: "4px",
  radiusSm: "0px",
};
const PHONE = "(631) 555-0185";
const NAME = "Standard Barber Co.";

// Matches system.tsx's private container class so custom, non-<Section>
// blocks below (CutMenu, HoursBoard) line up with the rest of the page.
const WRAP = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Real capture — kept as-is (see file report: no new barber photo could be
// fetched this pass; every other slot below stays a labeled placeholder).
const firstBarberImage = "/previews/firstBarberImage.webp";

// The price board — real prices, leader dots, the section itself (§14c).
const BOARD = [
  { name: "Haircut", price: "$35", note: "Scissor or clipper. No rush, no upsell." },
  { name: "Skin Fade", price: "$40", note: "Clean taper to the skin, blended by hand." },
  { name: "Beard & Line-up", price: "$20", note: "Trimmed, shaped, lined up sharp." },
  { name: "Hot-towel Shave", price: "$45", note: "Straight razor, hot towel, the full ritual." },
  { name: "The Works", price: "$70", note: "Cut, shave, and towel: the whole chair." },
  { name: "Kids (12 & under)", price: "$25", note: "Quick and easy, first cuts welcome." },
];

// "Behind the chair" — a plain caption list standing in for photos we don't
// have yet (no WORK grid, no THE CHAIR portrait — see file report).
const CUTS = [
  { name: "The Scissor Cut", copy: "Comb, scissors, a straight part — the cut every barber learns first because it never goes out of style." },
  { name: "The Skin Fade", copy: "Zero at the skin, blended up by hand until you can't find where it starts." },
  { name: "The Beard Line-up", copy: "Straight edges along the jaw and neck, shaped to how your beard actually grows." },
  { name: "The Hot-Towel Shave", copy: "A steamed towel, a straight razor, and no reason to rush either one." },
  { name: "The Kids' Cut", copy: "Same barber, same chair, just quicker — built for a nine-year-old's patience." },
  { name: "The Works", copy: "Every chair ends up here eventually: cut, shave, and a hot towel to finish." },
];

// Hours — same "Tue–Sat, 9am–7pm" fact as the FAQ and footer, laid out day by
// day for the posted-sign table below.
const HOURS = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "9am – 7pm" },
  { day: "Wednesday", hours: "9am – 7pm" },
  { day: "Thursday", hours: "9am – 7pm" },
  { day: "Friday", hours: "9am – 7pm" },
  { day: "Saturday", hours: "9am – 7pm" },
  { day: "Sunday", hours: "Closed" },
];

// ── Walk-in status chip — computed client-side from the HOURS data above and
// the visitor's own clock, the same way a shop's posted hours answer "are you
// open right now" (craft pass 2026-09-27). Two fixed states only, per spec:
// open now, or not. Nothing invented — it reads the real HOURS table above.
function parseClockLabel(raw: string): number | null {
  const m = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
}

function useWalkInStatus() {
  // null until the first client-side tick — no SSR guess at the visitor's
  // local clock, so there's nothing to correct after hydration.
  const [status, setStatus] = useState<{ open: boolean; closeLabel: string } | null>(null);
  useEffect(() => {
    const fallbackClose =
      HOURS.find((h) => h.hours !== "Closed")?.hours.split("–")[1]?.trim() ?? "7pm";
    const compute = () => {
      const now = new Date();
      // HOURS[0] is Monday; Date#getDay() returns 0 for Sunday.
      const today = HOURS[(now.getDay() + 6) % 7];
      if (today.hours === "Closed") {
        setStatus({ open: false, closeLabel: fallbackClose });
        return;
      }
      const [openRaw, closeRaw] = today.hours.split("–");
      const openMin = parseClockLabel(openRaw);
      const closeMin = parseClockLabel(closeRaw);
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const open = openMin !== null && closeMin !== null && nowMin >= openMin && nowMin < closeMin;
      setStatus({ open, closeLabel: closeRaw?.trim() ?? fallbackClose });
    };
    compute();
    const id = window.setInterval(compute, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

function WalkInStatusChip() {
  const status = useWalkInStatus();
  if (!status) return null;
  return (
    <span
      className="inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.08em]"
      style={{ color: status.open ? "var(--d-fg)" : "var(--d-muted)" }}
    >
      {/* a genuine liveness signal (is the shop taking walk-ins right now),
          not decoration — earns its continuous motion; static + opaque under
          reduced motion. */}
      <style>{`
        @keyframes barber-status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .barber-status-dot { animation: barber-status-pulse 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .barber-status-dot { animation: none; opacity: 1; }
        }
      `}</style>
      <span
        aria-hidden
        className="barber-status-dot inline-block h-2 w-2 rounded-full"
        style={{ background: status.open ? "var(--d-accent)" : "var(--d-muted)" }}
      />
      {status.open
        ? `Walk-ins open · until ${status.closeLabel}`
        : `Walk-ins by appointment after ${status.closeLabel}`}
    </span>
  );
}

const FAQ = [
  { q: "Do I need an appointment?", a: "No, walk-ins are always welcome. But booking online takes under a minute and skips the wait." },
  { q: "What are your hours?", a: "Tue–Sat, 9am to 7pm. If the pole out front is spinning, we're open and cutting." },
  { q: "Do you cut kids' hair?", a: "We do. Kids 12 and under are $25, and we keep it quick and easy for the first-timers." },
  { q: "How much is a cut?", a: "Haircut $35, skin fade $40, beard line-up $20, hot-towel shave $45. The works (cut, shave, towel) is $70." },
  { q: "Cash or card?", a: "Either. And if you rebook on the way out, your next chair's already on the calendar." },
];

// ── The list — a vintage price board: name, brass leader dots, price (§14c). ─
function PriceBoard() {
  return (
    <Section>
      <Rise>
        <Eyebrow>The list</Eyebrow>
        <div className="mt-5">
          <TwoLine a="The cuts." b="The prices." />
        </div>
      </Rise>
      {/* Single block reveal (not per-row) — the board reads as one posted
          sign, not a staggered list. d-grain gives it the same worn-leather
          film texture as the Hours band below (§13c "film grain"). */}
      <Rise delay={0.1}>
        <div
          className="d-grain mt-12 p-8 md:p-12"
          style={{
            background: "var(--d-surface)",
            // brass hairline frame, ~40% opacity (§14c's "vintage price
            // board" spec) rather than the plain --d-line hairline every
            // other panel uses.
            border: "1px solid color-mix(in srgb, var(--d-accent) 40%, transparent)",
            borderRadius: "var(--d-radius)",
            // warm lamplight on worn leather — texture, not a shape (§13c)
            backgroundImage:
              "radial-gradient(120% 80% at 50% 0%, rgba(176,131,63,.10), transparent 60%)",
          }}
        >
          {/* brass corner ticks, inset 2px — a small vintage-signage detail
              on the frame, not a second border. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 top-2 h-3 w-3"
            style={{ borderLeft: "2px solid var(--d-accent)", borderTop: "2px solid var(--d-accent)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-2 h-3 w-3"
            style={{ borderRight: "2px solid var(--d-accent)", borderBottom: "2px solid var(--d-accent)" }}
          />
          {BOARD.map((b, i) => (
            <div
              key={b.name}
              className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-4"
              style={i > 0 ? { borderTop: "1px solid var(--d-line)" } : undefined}
            >
              <span
                className="text-[24px] font-medium uppercase leading-none tracking-[0.02em] md:text-[28px]"
                style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
              >
                {b.name}
              </span>
              {/* brass leader dots */}
              <span
                aria-hidden
                className="hidden flex-1 translate-y-[-4px] md:block"
                style={{ borderBottom: "2px dotted var(--d-accent)", opacity: 0.5 }}
              />
              <span className="hidden max-w-[16rem] text-[13px] leading-[1.5] md:block md:text-right" style={{ color: "var(--d-muted)" }}>
                {b.note}
              </span>
              <span
                className="text-[24px] font-medium leading-none tabular-nums md:text-[28px]"
                style={{ color: "var(--d-accent)", fontFamily: "var(--d-display)" }}
              >
                {b.price}
              </span>
              <p className="text-[13px] leading-[1.5] md:hidden" style={{ color: "var(--d-muted)" }}>
                {b.note}
              </p>
            </div>
          ))}
        </div>
      </Rise>
    </Section>
  );
}

// ── Behind the chair — a plain caption list of the six cuts. Stands in for
// the WORK grid and THE CHAIR portrait: no new barbershop photo could be
// sourced this pass, so this section is text-only by design, not a stopgap
// placeholder box (§10's labeled-placeholder convention doesn't apply — there's
// no image slot here to label). Tight, dense padding (56/96) on purpose: a
// deliberate change of rhythm after the full-bleed break before it. ──────────
function CutMenu() {
  return (
    <section className="w-full py-14 md:py-24">
      <div className={WRAP}>
        <Rise>
          <Eyebrow>Behind the chair</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Six cuts." b="One standard." />
          </div>
        </Rise>
        <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {CUTS.map((c, i) => (
            <Rise key={c.name} delay={Math.min(i * 0.05, 0.25)}>
              <div className="pt-5" style={{ borderTop: "1px solid var(--d-line)" }}>
                <h3
                  className="text-[20px] font-medium leading-[1.2]"
                  style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                >
                  {c.name}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {c.copy}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Hours — a narrow, centered posted-sign table (not a two-column split, so
// it doesn't echo Faq/Contact's left-header/right-content grid right next to
// them). Surface bg + top/bottom hairlines and moderate padding (80/112) so
// it reads as its own quiet band between the cut list and the FAQ. ──────────
function HoursBoard() {
  return (
    <section
      className="d-grain w-full py-20 md:py-28"
      style={{
        background: "var(--d-surface)",
        borderTop: "1px solid var(--d-line)",
        borderBottom: "1px solid var(--d-line)",
      }}
    >
      <div className={WRAP}>
        <div className="mx-auto max-w-[560px]">
          <Rise>
            <Eyebrow>Hours</Eyebrow>
            <div className="mt-5">
              <TwoLine a="Walk in." b="Or call ahead." />
            </div>
            <p className="mt-6 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
              No appointment needed. Rather skip the wait? Call ahead and
              we&apos;ll have a chair ready when you get here.
            </p>
            <div className="mt-5">
              <WalkInStatusChip />
            </div>
          </Rise>
          <Rise delay={0.1} className="mt-10">
            <div>
              {HOURS.map((h, i) => (
                <div
                  key={h.day}
                  className="flex items-baseline justify-between py-3.5"
                  style={i > 0 ? { borderTop: "1px solid var(--d-line)" } : undefined}
                >
                  <span
                    className="text-[16px] font-medium"
                    style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                  >
                    {h.day}
                  </span>
                  <span
                    className="text-[15px] tabular-nums"
                    style={{ color: h.hours === "Closed" ? "var(--d-muted)" : "var(--d-body)" }}
                  >
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </Rise>
          <Rise delay={0.15} className="mt-9">
            <a
              href="#contact"
              className="d-press inline-block px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: OXBLOOD, color: "var(--d-fg)", outlineColor: "var(--d-accent)" }}
            >
              Book a chair
            </a>
          </Rise>
        </div>
      </div>
    </section>
  );
}

export function BarberDemo({ tier = "basic" }: { tier?: Tier }) {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Book a chair" />
      <StickyScene image={firstBarberImage} priority>
        <DemoHero
          pinned
          heroImage={firstBarberImage}
          eyebrow="Barbershop · Patchogue"
          line1="A good cut."
          line2="Every time."
          sub="Four chairs, no rush, no upsell. Book online or walk in; either way you leave sharp."
          primaryCta="Book a chair"
          phone={PHONE}
          mediaLabel="Hero: the shop floor"
          premium={tier === "premium" ? PREMIUM_HERO : undefined}
        />
        {/* Only the Intro rides over the pinned hero image now — the marquee
            moved out below (it needs its own opaque band, not a see-through
            one over a photo). */}
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="Old-school chair."
                line2="No nonsense."
                paragraphs={[
                  "No app trying to upsell you pomade, no rotating stranger who's never seen your hairline. Just a good cut from the same barbers.",
                  "Standard runs four chairs in Patchogue. Book online in a minute or walk in. If the pole's spinning, we're cutting.",
                ]}
                badges={[
                  ["Cuts to shaves", "Full menu"],
                  ["Walk-in or book", "Either works"],
                  ["Same barbers", "Consistent"],
                  ["Cash or card", "Easy"],
                ]}
              />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Cuts", "Fades", "Beards", "Shaves", "Kids"]} />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <PriceBoard />
      </div>
      <FullBleedBreak
        eyebrow="The shop"
        line1="Leather, brass,"
        line2="and warm light."
        paragraph="Standard is built to feel like a room you'd actually sit in: worn leather, a little brass, lamplight, and no one rushing you toward the door."
        checklist={[
          "Walk-ins always welcome",
          "Book online in under a minute",
          "Same barbers every visit",
          "Cash or card",
        ]}
        cta="Book a chair"
        mediaLabel="The shop: chairs, brass, lamplight"
        img="/demos/barber/shop.webp"
      />
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <CutMenu />
      </div>
      <HoursBoard />
      <Faq
        eyebrow="Questions"
        line1="Straight answers."
        line2="No surprises."
        items={FAQ}
      />
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
        <Contact
          eyebrow="Book or visit"
          line1="Your chair's"
          line2="waiting."
          copy="Book online in under a minute, call, or just come by: 311 Main St, Patchogue. If the pole's spinning, we're cutting."
          phone={PHONE}
          email="hello@standardbarber.demo"
          location="311 Main St, Patchogue, NY"
          serviceLabel="What you're booking"
          serviceOptions={["Haircut", "Skin fade", "Beard & line-up", "Hot-towel shave", "The works", "Kids"]}
        />
      </div>
      <CtaBand
        line1="Need a cut?"
        line2="Grab a chair."
        cta="Book a chair"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A four-chair barbershop: cuts, fades, beards, and hot-towel shaves."
        area="311 Main St, Patchogue, Long Island"
        services={["Haircut", "Skin fade", "Beard & line-up", "Hot-towel shave"]}
        phone={PHONE}
        email="hello@standardbarber.demo"
        location="311 Main St, Patchogue, NY"
        hours="Tue–Sat, 9am–7pm"
        strip="Walk-ins Welcome · Cash or Card · Same Barbers"
      />
      <MobileStickyCta phone={PHONE} bookLabel="Book a chair" contactId="contact" />
    </DemoShell>
  );
}
