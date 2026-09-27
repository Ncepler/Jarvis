// Style demo — a neighborhood bakery homepage in the warm & inviting "Golden
// Hour" mood (SKILL §13b + §14b): warm cream, espresso text, crust-amber accent,
// a Fraunces display, softer corners. A bakery sells off a MENU and a CASE, so
// "what we bake" is a printed-menu layout beside the case, and the rest of the
// page follows the case, the ovens, and a cake order — not a numbered grid.
// "Golden Hour Bakehouse" is a sample brand for the demo, not a client.

"use client";

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
  Media,
  MobileStickyCta,
  Rise,
  SceneBlock,
  StickyReveal,
  StickyScene,
  TwoLine,
} from "./system";
import { heroConceptFor } from "@/lib/heroConcepts";
import type { Tier } from "./VilasDemoBar";

// Section/Faq/Contact/Intro all share one fixed vertical rhythm (72px/140px)
// via the shared <Section> primitive in system.tsx, which we're not touching.
// The two sections built by hand in this file get their own distinct rhythm
// instead of defaulting to that same number twice in a row — same container
// width (max-w-1200 + the shared side padding), different vertical air.
const wrap = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

const PREMIUM_HERO = heroConceptFor("demo-bakery");
const ACCENT = "#C9802F"; // warm crust amber

// Warm & inviting bakery mood (SKILL §13b).
const THEME: DemoTheme = {
  bg: "#F6EFE2", // warm cream / paper bag
  surface: "#FCF8F0",
  fg: "#2B2018", // warm espresso brown
  body: "#5E5142",
  muted: "#9C8B76",
  line: "#E7DCC8",
  accent: ACCENT,
  onAccent: "#FFFFFF",
  font: "var(--font-tight)",
  display: "var(--font-fraunces)", // warm characterful display
  radius: "8px", // a touch softer — handmade, not bubbly
  radiusLg: "14px",
  radiusSm: "4px",
  heroScrim: "linear-gradient(180deg, rgba(246,239,226,.12), rgba(246,239,226,.8))",
  breakScrim: "linear-gradient(180deg, rgba(246,239,226,.42), rgba(246,239,226,.88))",
};
const PHONE = "(631) 555-0173";
const NAME = "Golden Hour Bakehouse";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Real capture, wired and kept: /public/previews/firstBakeryImage.webp.
const firstBakeryImage = "/previews/firstBakeryImage.webp";

// The menu — category, a short appetizing line, an honest price/note (§14b).
const MENU = [
  { name: "Daily bread", desc: "Levain sourdough and seeded rye, 36-hour ferment, out of the oven at 7am.", price: "from $7" },
  { name: "Morning pastry", desc: "Cardamom morning buns, croissants, and one very good cookie, small batches.", price: "from $4" },
  { name: "Cakes to order", desc: "Vanilla or chocolate, plus seasonal specials. Two days' notice.", price: "from $45" },
  { name: "Wholesale", desc: "Standing morning deliveries of bread and pastry to cafés and restaurants nearby.", price: "ask us" },
];

const FAQ = [
  { q: "What days are you open?", a: "Wed–Sun, 7am until sold out. We post the morning's bake so you know what's in the case before you come." },
  { q: "Can I order ahead?", a: "Yes, order by 8pm and your bag is on the shelf with your name on it the next morning." },
  { q: "How much notice for a cake?", a: "Two days for whole cakes. Tell us vanilla or chocolate and the size and we'll have it ready." },
  { q: "Do you sell wholesale to cafés?", a: "We do, with standing morning deliveries of bread and pastry. Reach out and we'll talk about a route." },
  { q: "Do you do gluten-free?", a: "Not yet. We're a small flour-and-water shop and can't promise a clean kitchen for it. We'd rather be honest than careless." },
];

// ── Open/closed status — computed from facts already stated elsewhere on this
// page: "Wed–Sun, 7am" (footer/FAQ) and "gone by noon" (hero). No hours are
// invented here, just structured so the chip and the hours list can read off
// one place. Sun=0 … Sat=6, matching Date#getDay().
const OPEN_DAYS = new Set([0, 3, 4, 5, 6]); // Wed, Thu, Fri, Sat, Sun
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS_ROWS: { day: number; label: string; hours: string }[] = [
  { day: 1, label: "Monday", hours: "Closed" },
  { day: 2, label: "Tuesday", hours: "Closed" },
  { day: 3, label: "Wednesday", hours: "7am – sold out" },
  { day: 4, label: "Thursday", hours: "7am – sold out" },
  { day: 5, label: "Friday", hours: "7am – sold out" },
  { day: 6, label: "Saturday", hours: "7am – sold out" },
  { day: 0, label: "Sunday", hours: "7am – sold out" },
];

type BakeryStatus = { open: boolean; text: string };

function computeBakeryStatus(now: Date): BakeryStatus {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpenDay = OPEN_DAYS.has(day);
  // The case is realistically done by noon (the hero's own "gone by noon"),
  // even though the shop's line to customers is "until sold out".
  if (isOpenDay && hour >= 7 && hour < 12) {
    return { open: true, text: "Open now — until noon" };
  }
  if (isOpenDay && hour < 7) {
    return { open: false, text: "Opens today at 7am" };
  }
  for (let i = 1; i <= 7; i++) {
    const nextDay = (day + i) % 7;
    if (OPEN_DAYS.has(nextDay)) {
      return { open: false, text: `Opens 7am ${i === 1 ? "tomorrow" : DAY_NAMES[nextDay]}` };
    }
  }
  return { open: false, text: "Closed" };
}

// Recomputed once on mount (avoids an SSR/client clock mismatch) and every
// minute after — a live status reads stale fast otherwise on a long visit.
function useBakeryStatus(): BakeryStatus | null {
  const [status, setStatus] = useState<BakeryStatus | null>(null);
  useEffect(() => {
    const tick = () => setStatus(computeBakeryStatus(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return status;
}

// A soft pulsing dot + label. The pulse is one of the few constant-motion
// cases this system allows (animate/GUIDE.md): it's a live-status indicator,
// not decoration, and it goes fully static (solid dot) under reduced motion
// via the stylesheet below. Renders nothing until the client clock resolves,
// so it never flashes a wrong state.
function StatusChip({ status, className = "" }: { status: BakeryStatus | null; className?: string }) {
  if (!status) return null;
  return (
    <span
      className={`d-material inline-flex items-center gap-2 rounded-full px-3.5 py-[7px] text-[12px] font-semibold uppercase tracking-[0.06em] ${className}`}
      style={{ color: "var(--d-fg)", border: "1px solid var(--d-line)" }}
    >
      <span
        aria-hidden
        className="bakery-status-dot"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: status.open ? "var(--d-accent)" : "var(--d-muted)",
        }}
      />
      {status.text}
    </span>
  );
}

// Today's row gets a static tint + accent rule — no animation, just a state
// that's true or false the instant the clock is read (per spec §3).
function HoursTable({ today }: { today: number | null }) {
  return (
    <div style={{ borderTop: "1px solid var(--d-line)" }}>
      {HOURS_ROWS.map((r) => {
        const isToday = r.day === today;
        return (
          <div
            key={r.day}
            className="flex items-baseline justify-between gap-6 py-2.5 pr-3 text-[14px]"
            style={{
              borderBottom: "1px solid var(--d-line)",
              borderLeft: `2px solid ${isToday ? "var(--d-accent)" : "transparent"}`,
              paddingLeft: "12px",
              background: isToday ? "color-mix(in srgb, var(--d-accent) 7%, transparent)" : "transparent",
            }}
          >
            <span style={{ color: isToday ? "var(--d-fg)" : "var(--d-body)", fontWeight: isToday ? 600 : 400 }}>
              {r.label}
            </span>
            <span className="tabular-nums" style={{ color: isToday ? "var(--d-fg)" : "var(--d-muted)" }}>
              {r.hours}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── What we bake — the menu beside the case, like stepping to the counter (§14b).
// Menu rows read like a printed menu: an uppercase+tracked category head (a
// deterministic cross-browser stand-in for small-caps — real font small-caps
// support is inconsistent, this always reads right), a dotted leader to the
// price, and tabular figures so the prices line up down the column.
function BakeryMenu() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className={wrap}>
      <Rise>
        <Eyebrow>What we bake</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Step up" b="to the counter." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
        {/* the menu */}
        <Rise>
          <div style={{ borderTop: "1px solid var(--d-line)" }}>
            {MENU.map((m) => (
              <div key={m.name} className="py-6" style={{ borderBottom: "1px solid var(--d-line)" }}>
                <div className="flex items-baseline gap-3">
                  <h3
                    className="shrink-0 text-[16px] font-semibold uppercase leading-none"
                    style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)", letterSpacing: "0.09em" }}
                  >
                    {m.name}
                  </h3>
                  <span aria-hidden className="mb-[3px] flex-1" style={{ borderBottom: "1px dotted var(--d-line)" }} />
                  <span
                    className="shrink-0 text-[14px] font-semibold uppercase tabular-nums tracking-[0.04em]"
                    style={{ color: "var(--d-accent)" }}
                  >
                    {m.price}
                  </span>
                </div>
                <p className="mt-2 max-w-sm text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </Rise>
        {/* the case — scales gently in as you scroll past it (view-timeline
            CSS below); the sticky wrapper is a full grid-row-height box, so
            it has a real scroll range to drive from. Static everywhere the
            technique isn't supported and under reduced motion. */}
        <Rise delay={0.1} className="bakery-case-scene">
          <div className="md:sticky md:top-10">
            <Media
              label="The case"
              img="/demos/bakery/the-case.webp"
              file="the-case.jpg"
              ratio="4/3"
              className="bakery-case-media"
            />
            <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
              The case at 7am. When it&apos;s empty, that&apos;s the day.
            </p>
          </div>
        </Rise>
      </div>
      </div>
    </section>
  );
}

// ── Whole-cake orders — a centered ask + a bench shot, not a corporate grid.
function CakeOrders() {
  return (
    <section className="w-full py-20 md:py-[176px]" style={{ background: "var(--d-surface)" }}>
      <div className={wrap}>
      <div className="mx-auto max-w-xl text-center">
        <Rise>
          <div className="flex justify-center">
            <Eyebrow>Custom orders</Eyebrow>
          </div>
          <div className="mt-5">
            <TwoLine a="Need a cake?" b="Give us two days." />
          </div>
          <p className="mt-6 text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Vanilla or chocolate, sized for the table, from $45. Order two days ahead and
            we&apos;ll have it ready when you walk in.
          </p>
          <a
            href="#contact"
            className="press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold no-underline"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            Order a cake
          </a>
        </Rise>
      </div>
      <Rise delay={0.12}>
        <div className="mx-auto mt-14 max-w-sm">
          <Media
            label="The bakehouse bench"
            img="/demos/bakery/bakehouse-bench.webp"
            file="bakehouse-bench.jpg"
            ratio="4/5"
          />
        </div>
      </Rise>
      </div>
    </section>
  );
}

export function BakeryDemo({ tier = "basic" }: { tier?: Tier }) {
  const status = useBakeryStatus();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);

  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      {/* Scoped to this file only. The view-timeline block mirrors
          StickyScene's own native scroll-driven technique (system.tsx +
          globals.css .d-scene-scale-native) but targets just the case photo;
          unsupported browsers and reduced motion get a static image, no JS
          scroll listener either way. The status-dot pulse is opacity-only. */}
      <style>{`
        @supports (view-timeline-name: --x) {
          .bakery-case-scene { view-timeline-name: --bakery-case; view-timeline-axis: block; }
          @keyframes bakery-case-scale { from { transform: scale(1.04); } to { transform: scale(1); } }
          .bakery-case-media {
            animation: bakery-case-scale linear both;
            animation-timeline: --bakery-case;
            animation-range: cover 0% cover 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bakery-case-media { animation: none; transform: none; }
        }
        .bakery-status-dot { animation: bakery-status-pulse 2s ease-in-out infinite; }
        @keyframes bakery-status-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (prefers-reduced-motion: reduce) {
          .bakery-status-dot { animation: none; opacity: 1; }
        }
      `}</style>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order ahead" />
      <StickyScene image={firstBakeryImage} priority>
        <div className="relative">
          <DemoHero
            pinned
            heroImage={firstBakeryImage}
            eyebrow="Bakery · Sayville"
            line1="Baked at 4am."
            line2="Gone by noon."
            sub="Sourdough, morning buns, and one very good cookie, baked in small batches every morning. When the case is empty, that's the day."
            primaryCta="Order ahead"
            phone={PHONE}
            mediaLabel="The bakery, from the sidewalk"
            premium={tier === "premium" ? PREMIUM_HERO : undefined}
          />
          {/* overlaid on the hero's own empty top corner (content sits bottom-
              aligned) — a live open/closed read the instant the page loads. */}
          <div className="absolute right-6 top-8 z-10 md:right-16 md:top-10">
            <StatusChip status={status} />
          </div>
        </div>
        <SceneBlock>
          <StickyReveal>
            <div id="about" className={ANCHOR_SCROLL_CLASS}>
              <Intro
                eyebrow="Who we are"
                line1="Small batches."
                line2="Every morning."
                paragraphs={[
                  "We're a small bakehouse that does a few things and does them every day, instead of a long menu we phone in.",
                  "Sourdough on a long ferment, pastry out before the morning rush, and cakes to order. When the case is empty, we're proud of it.",
                ]}
                badges={[
                  ["Bread, pastry & cakes", "Daily"],
                  ["36-hour ferment", "No shortcuts"],
                  ["Order ahead", "Reserved by name"],
                  ["Open from 7am", "Until sold out"],
                ]}
              />
            </div>
          </StickyReveal>
        </SceneBlock>
      </StickyScene>
      {/* moved out of the pinned scene — it was riding over the hero photo and
          going unreadable there. Now a plain band on the page's own bg. */}
      <div
        style={{ background: "var(--d-bg)", borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
        className="py-6"
      >
        <DemoMarquee terms={["Sourdough", "Pastry", "Cakes", "Focaccia", "Cookies"]} />
      </div>
      <div id="services" className={ANCHOR_SCROLL_CLASS}>
        <BakeryMenu />
      </div>
      <div id="work" className={ANCHOR_SCROLL_CLASS}>
        <FullBleedBreak
          eyebrow="Behind the counter"
          line1="In by 4am,"
          line2="out the door by noon."
          paragraph="Every loaf gets mixed, shaped, and baked in this room before the shop opens. Nothing is trucked in — if it's in the case, it came out of these ovens a few hours earlier."
          checklist={[
            "Dough mixed by hand",
            "Shaped on a floured bench",
            "Baked in small batches",
            "Case restocked all morning",
          ]}
          cta="See today's menu"
          mediaLabel="The bakehouse, early morning"
        />
      </div>
      <CakeOrders />
      <Faq
        eyebrow="Questions"
        line1="Before you"
        line2="place an order."
        items={FAQ}
      />
      <div id="contact" className={ANCHOR_SCROLL_CLASS}>
        <Contact
          eyebrow="Visit or order"
          line1="Come smell"
          line2="the bakehouse."
          copy="22 Main St, Sayville · Wed–Sun from 7am · or order ahead and we'll have your bag with your name on it. Cakes need two days."
          phone={PHONE}
          email="hello@goldenhour.demo"
          location="22 Main St, Sayville, NY"
          serviceLabel="What you're after"
          serviceOptions={["Daily bread", "Morning pastry", "Cake to order", "Wholesale", "Not sure yet"]}
        />
        <div className={wrap}>
          <Rise>
            <div className="mx-auto max-w-md py-12 md:py-16" style={{ borderTop: "1px solid var(--d-line)" }}>
              <div className="flex items-center justify-between gap-4">
                <Eyebrow>Hours</Eyebrow>
                <StatusChip status={status} />
              </div>
              <div className="mt-6">
                <HoursTable today={today} />
              </div>
            </div>
          </Rise>
        </div>
      </div>
      <CtaBand
        line1="Hungry yet?"
        line2="Order for the morning."
        cta="Order ahead"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A small bakehouse: sourdough, pastry, and cakes baked fresh every morning."
        area="22 Main St, Sayville, Long Island"
        services={["Daily bread", "Morning pastry", "Cakes to order", "Wholesale"]}
        phone={PHONE}
        email="hello@goldenhour.demo"
        location="22 Main St, Sayville, NY"
        hours="Wed–Sun, 7am until sold out"
        strip="Baked Fresh Daily · Order Ahead · Small Batches"
      />
      <MobileStickyCta phone={PHONE} bookLabel="Order ahead" contactId="contact" />
    </DemoShell>
  );
}
