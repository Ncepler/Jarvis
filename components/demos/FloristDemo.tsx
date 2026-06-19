// Style demo — a flower-shop homepage in the dark, photographic, editorial
// "Axel's / Sallem" system (see
// .claude/skills/local-service-design-system/SKILL.md). "Wildstem Florals" is
// a sample brand for the demo, not a client.

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

const ACCENT = "#B14A63"; // deep bloom rose
const PHONE = "(516) 555-0167";
const NAME = "Wildstem Florals";

const SERVICES = [
  { title: "Daily arrangements", copy: "Whatever came in beautiful that morning, arranged loose and seasonal. No two alike." },
  { title: "Weddings & events", copy: "From two table arrangements to the whole room, designed around your venue and your month." },
  { title: "Weekly flowers", copy: "A standing order for your home, restaurant, or office. Fresh every week, no reordering." },
  { title: "Sympathy", copy: "Quiet, handled arrangements sent same-day when it matters. We'll take care of the details." },
];

const WORK = [
  { tag: "Wedding", caption: "Garden-style ceremony arch" },
  { tag: "Daily", caption: "Loose seasonal hand-tie" },
  { tag: "Event", caption: "Long-table dinner runner" },
  { tag: "Weekly", caption: "Standing arrangement for a café" },
  { tag: "Sympathy", caption: "Soft white standing spray" },
  { tag: "Shop", caption: "The cooler, mid-morning" },
];

const PROPS = [
  { title: "Arranged the day you order", copy: "Nothing sits in a cooler for a week. We build it the morning it goes out." },
  { title: "Seasonal & local where we can", copy: "We buy what's actually good that week, so the flowers look picked, not produced." },
  { title: "Real conversations", copy: "Tell us the person and the moment. We'd rather design for that than read you a catalog." },
  { title: "Same-day until 2pm", copy: "Order by early afternoon and it can go out the same day across the area." },
  { title: "Family-run shop", copy: "You're talking to the people holding the shears, not a 1-800 order desk." },
];

const FAQ = [
  { q: "Do you deliver?", a: "Yes — same-day across Rockville Centre and nearby towns for orders placed by 2pm, and scheduled delivery beyond that." },
  { q: "How far ahead should I book a wedding?", a: "The best dates book a season out. Reach out early with the venue and the month and we'll bring ideas to a first call." },
  { q: "Can I just say a budget and let you design?", a: "Absolutely — that's most of what we do. Give us a number and a vibe and we'll run with it." },
  { q: "Do you do sympathy arrangements on short notice?", a: "We do, same-day when we can. Call the shop and we'll handle it gently." },
  { q: "Can I set up weekly flowers?", a: "Yes. A standing weekly order for the house or a business, billed simply, skip any week by text." },
];

export function FloristDemo() {
  return (
    <DemoShell accent={ACCENT}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Order flowers" />
      <DemoHero
        eyebrow="Flower shop · Rockville Centre"
        line1="Picked,"
        line2="not produced."
        sub="Seasonal stems, arranged the morning you order them. Walk in, call ahead, or set up weekly flowers for the house."
        primaryCta="Order for pickup"
        phone={PHONE}
        mediaLabel="HERO VIDEO — shop & blooms (16:9)"
      />
      <DemoMarquee terms={["Weddings", "Events", "Daily", "Weekly", "Sympathy"]} />
      <Intro
        eyebrow="Who we are"
        line1="A small shop."
        line2="Real flowers."
        paragraphs={[
          "We're a working flower shop, not a website that ships boxes. What's in the cooler is what came in good that week.",
          "Tell us the person and the occasion and we'll design around it — loose, seasonal, and arranged the day it goes out.",
        ]}
        badges={[
          ["Daily to weddings", "Full range"],
          ["Arranged same morning", "Never pre-made"],
          ["Same-day until 2pm", "Local delivery"],
          ["Family-run", "Talk to the maker"],
        ]}
      />
      <ServiceCards
        eyebrow="What we make"
        line1="Four ways"
        line2="to send flowers."
        services={SERVICES}
        thumbPrefix="ARRANGEMENT"
      />
      <FullBleedBreak
        eyebrow="Weddings & events"
        line1="Getting married?"
        line2="Let's talk early."
        paragraph="The best dates book a season out. Tell us the venue and the month, and we'll bring ideas to a first call. The call costs nothing."
        checklist={[
          "Free first consultation",
          "Designed around your venue",
          "Seasonal, sourced that week",
          "From two tables to the whole room",
        ]}
        cta="Start a wedding inquiry"
        mediaLabel="GALLERY — wedding & event florals (16:9)"
      />
      <WorkGrid
        eyebrow="Recent work"
        line1="A look"
        line2="in the cooler."
        items={WORK}
      />
      <ValueProps
        eyebrow="Why order from us"
        line1="The difference"
        line2="is the morning of."
        props={PROPS}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <Contact
        eyebrow="Get in touch"
        line1="Come smell"
        line2="the shop."
        copy="14 Maple Ave, Rockville Centre · Tue–Sat 9–6, Sun 10–2 · or call and we'll have it wrapped when you arrive."
        phone={PHONE}
        email="hello@wildstem.demo"
        location="14 Maple Ave, Rockville Centre, NY"
        serviceLabel="What it's for"
        serviceOptions={["Daily arrangement", "Wedding / event", "Weekly flowers", "Sympathy", "Not sure yet"]}
      />
      <CtaBand
        line1="Need flowers?"
        line2="We're here for it."
        cta="Order for pickup"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A working flower shop — daily arrangements, weddings, and weekly flowers."
        area="Rockville Centre & nearby Long Island towns"
        services={["Daily arrangements", "Weddings & events", "Weekly flowers", "Sympathy"]}
        phone={PHONE}
        email="hello@wildstem.demo"
        location="14 Maple Ave, Rockville Centre, NY"
        hours="Tue–Sat 9–6 · Sun 10–2"
        strip="Same-day until 2pm · Local delivery · Family-run"
      />
    </DemoShell>
  );
}
