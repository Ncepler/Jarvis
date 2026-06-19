// Style demo — a neighborhood bakery homepage in the warm & inviting "Golden
// Hour" mood (SKILL §13b): warm cream, espresso-brown text, crust-amber accent,
// a Fraunces display, morning-light photography, slightly softer corners. Same
// editorial skeleton as the dark demos. "Golden Hour Bakehouse" is a sample
// brand for the demo, not a client.

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
  heroScrim: "linear-gradient(180deg, rgba(246,239,226,.12), rgba(246,239,226,.8))",
  breakScrim: "linear-gradient(180deg, rgba(246,239,226,.42), rgba(246,239,226,.88))",
};
const PHONE = "(631) 555-0173";
const NAME = "Golden Hour Bakehouse";

// ── HERO BACKGROUND IMAGE ────────────────────────────────────────────────
// Put your hero photo in /public (e.g. /public/demos/bakery-hero.jpg), then
// set the path below. Leave "" to show the labeled placeholder instead.
const firstBakeryImage = "";

const SERVICES = [
  { title: "Daily bread", copy: "Levain sourdough and seeded rye, 36-hour ferment, out of the oven at 7am. When it's gone, it's gone." },
  { title: "Morning pastry", copy: "Cardamom morning buns, croissants, and one very good cookie, baked in small batches every morning." },
  { title: "Cakes to order", copy: "Vanilla or chocolate, plus seasonal specials. Two days' notice and it's ready for the table." },
  { title: "Wholesale", copy: "Standing morning deliveries of bread and pastry to cafés and restaurants nearby. Ask about a route." },
];

const WORK = [
  { tag: "Bread", caption: "Sourdough loaf — out of the oven at 7am" },
  { tag: "Pastry", caption: "Cardamom morning buns — gone by 10" },
  { tag: "Bread", caption: "Seeded rye — dense, dark, keeps all week" },
  { tag: "Sweet", caption: "Brown-butter chocolate chip cookie" },
  { tag: "Savory", caption: "Rosemary focaccia, baked in sheets" },
  { tag: "Cake", caption: "Whole birthday cake — order two days ahead" },
];

const PROPS = [
  { title: "Baked this morning", copy: "Everything in the case came out of the oven today. Nothing carried over from yesterday." },
  { title: "Small batches", copy: "We bake what we can do well, then we're done. The empty case means it was good." },
  { title: "Real ferment", copy: "Sourdough on a 36-hour rise — flavor and keeping quality you can't rush." },
  { title: "Order ahead", copy: "Reserve a bag the night before so the buns are still there when you arrive." },
  { title: "Right in town", copy: "Walk to it. We're on Main Street, open from 7am until the case is empty." },
];

const FAQ = [
  { q: "What days are you open?", a: "Wed–Sun, 7am until sold out. We post the morning's bake so you know what's in the case before you come." },
  { q: "Can I order ahead?", a: "Yes — order by 8pm and your bag is on the shelf with your name on it the next morning." },
  { q: "How much notice for a cake?", a: "Two days for whole cakes. Tell us vanilla or chocolate and the size and we'll have it ready." },
  { q: "Do you sell wholesale to cafés?", a: "We do — standing morning deliveries of bread and pastry. Reach out and we'll talk about a route." },
  { q: "Do you do gluten-free?", a: "Not yet — we're a small flour-and-water shop and can't promise a clean kitchen for it. We'd rather be honest than careless." },
];

export function BakeryDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order ahead" />
      <DemoHero
        heroImage={firstBakeryImage}
        eyebrow="Bakery · Sayville"
        line1="Baked at 4am."
        line2="Gone by noon."
        sub="Sourdough, morning buns, and one very good cookie, baked in small batches every morning. When the case is empty, that's the day."
        primaryCta="Order ahead"
        phone={PHONE}
        mediaLabel="HERO VIDEO — the case at 7am (16:9)"
      />
      <DemoMarquee terms={["Sourdough", "Pastry", "Cakes", "Focaccia", "Cookies"]} />
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
      <ServiceCards
        eyebrow="What we bake"
        line1="A short list."
        line2="Done right."
        services={SERVICES}
        thumbPrefix="BAKE"
      />
      <FullBleedBreak
        eyebrow="Order ahead"
        line1="Skip the line,"
        line2="not the bread."
        paragraph="Order by 8pm and your bag is on the shelf with your name on it the next morning. Cakes need two days' notice — tell us vanilla or chocolate."
        checklist={[
          "Reserved with your name",
          "Out of the oven that morning",
          "Cakes with two days' notice",
          "Pickup from 7am",
        ]}
        cta="Place an order"
        mediaLabel="THE CASE — morning bake (16:9)"
      />
      <WorkGrid
        eyebrow="The daily case"
        line1="What's here"
        line2="most days."
        items={WORK}
      />
      <ValueProps
        eyebrow="Why people come back"
        line1="Reasons the"
        line2="case empties."
        props={PROPS}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
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
      <CtaBand
        line1="Hungry yet?"
        line2="Order for the morning."
        cta="Order ahead"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A small bakehouse — sourdough, pastry, and cakes baked fresh every morning."
        area="22 Main St, Sayville, Long Island"
        services={["Daily bread", "Morning pastry", "Cakes to order", "Wholesale"]}
        phone={PHONE}
        email="hello@goldenhour.demo"
        location="22 Main St, Sayville, NY"
        hours="Wed–Sun, 7am until sold out"
        strip="Baked Fresh Daily · Order Ahead · Small Batches"
      />
    </DemoShell>
  );
}
