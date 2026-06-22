// Style demo — a neighborhood bakery homepage in the warm & inviting "Golden
// Hour" mood (SKILL §13b + §14b): warm cream, espresso text, crust-amber accent,
// a Fraunces display, softer corners. A bakery sells off a MENU and a CASE, so
// "what we bake" is a printed-menu layout beside the case, and "why people come
// back" is a warm narrative band — not the numbered grid. "Golden Hour
// Bakehouse" is a sample brand for the demo, not a client.

import {
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
  Rise,
  Section,
  TwoLine,
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
const firstBakeryImage = "/previews/firstBakeryImage.webp";

// The menu — category, a short appetizing line, an honest price/note (§14b).
const MENU = [
  { name: "Daily bread", desc: "Levain sourdough and seeded rye, 36-hour ferment, out of the oven at 7am.", price: "from $7" },
  { name: "Morning pastry", desc: "Cardamom morning buns, croissants, and one very good cookie, small batches.", price: "from $4" },
  { name: "Cakes to order", desc: "Vanilla or chocolate, plus seasonal specials. Two days' notice.", price: "from $45" },
  { name: "Wholesale", desc: "Standing morning deliveries of bread and pastry to cafés and restaurants nearby.", price: "ask us" },
];

const WORK = [
  { tag: "Bread", caption: "Sourdough loaf — out of the oven at 7am" },
  { tag: "Pastry", caption: "Cardamom morning buns — gone by 10" },
  { tag: "Bread", caption: "Seeded rye — dense, dark, keeps all week" },
  { tag: "Sweet", caption: "Brown-butter chocolate chip cookie" },
  { tag: "Savory", caption: "Rosemary focaccia, baked in sheets" },
  { tag: "Cake", caption: "Whole birthday cake — order two days ahead" },
];

const FAQ = [
  { q: "What days are you open?", a: "Wed–Sun, 7am until sold out. We post the morning's bake so you know what's in the case before you come." },
  { q: "Can I order ahead?", a: "Yes — order by 8pm and your bag is on the shelf with your name on it the next morning." },
  { q: "How much notice for a cake?", a: "Two days for whole cakes. Tell us vanilla or chocolate and the size and we'll have it ready." },
  { q: "Do you sell wholesale to cafés?", a: "We do — standing morning deliveries of bread and pastry. Reach out and we'll talk about a route." },
  { q: "Do you do gluten-free?", a: "Not yet — we're a small flour-and-water shop and can't promise a clean kitchen for it. We'd rather be honest than careless." },
];

// ── What we bake — the menu beside the case, like stepping to the counter (§14b).
function BakeryMenu() {
  return (
    <Section>
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
              <div
                key={m.name}
                className="flex items-baseline justify-between gap-6 py-6"
                style={{ borderBottom: "1px solid var(--d-line)" }}
              >
                <div>
                  <h3
                    className="text-[26px] font-semibold leading-[1.1]"
                    style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                  >
                    {m.name}
                  </h3>
                  <p className="mt-2 max-w-sm text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                    {m.desc}
                  </p>
                </div>
                <span className="shrink-0 text-[14px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--d-accent)" }}>
                  {m.price}
                </span>
              </div>
            ))}
          </div>
        </Rise>
        {/* the case */}
        <Rise delay={0.1}>
          <div className="md:sticky md:top-10">
            <Media label="THE CASE — morning bake (3:2)" ratio="3/2" />
            <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
              The case at 7am. When it&apos;s empty, that&apos;s the day.
            </p>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// ── Why people come back — a warm narrative band, not a corporate grid (§14b).
function WarmNarrative() {
  return (
    <Section dark>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Rise>
          <Eyebrow>Why people come back</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Baked at 4am." b="Gone by noon." />
          </div>
          <div className="mt-7 space-y-6">
            {[
              ["Everything's from this morning.", "Nothing in the case carried over from yesterday — we bake it, you eat it the same day, and the empty shelf at noon is the point."],
              ["We bake a short list, well.", "Sourdough on a 36-hour rise, pastry out before the rush, cakes to order. A few things every day instead of a long menu we phone in."],
              ["Reserve a bag the night before.", "Order by 8pm and it's on the shelf with your name on it. The regulars never gamble on the morning."],
            ].map(([h, p]) => (
              <div key={h}>
                <h3 className="text-[19px] font-semibold" style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}>
                  {h}
                </h3>
                <p className="mt-1.5 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {p}
                </p>
              </div>
            ))}
          </div>
        </Rise>
        <Rise delay={0.1}>
          <Media label="THE BAKEHOUSE — morning light (4:5)" ratio="4/5" />
        </Rise>
      </div>
    </Section>
  );
}

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
      <BakeryMenu />
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
      <WarmNarrative />
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
