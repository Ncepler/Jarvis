// Style demo — a barbershop homepage in the warm-vintage-dark "Standard" mood
// (SKILL §13c): warm espresso-black (NOT the cool contractor #0B0B0C), bone
// text, chair-red accent, an Oswald condensed display, warm interior
// photography. Same editorial skeleton as the dark demos. "Standard Barber Co."
// is a sample brand for the demo, not a client.

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

const ACCENT = "#B23A3A"; // classic chair red

// Warm vintage dark barber mood (SKILL §13c).
const THEME: DemoTheme = {
  bg: "#14110E", // warm espresso-black, NOT the cool #0B0B0C
  surface: "#1E1915",
  fg: "#F1EADD", // warm bone
  body: "#C3B8A6",
  muted: "#8A7E6C",
  line: "#2C261F",
  accent: ACCENT,
  onAccent: "#F1EADD", // bone text on chair-red
  font: "var(--font-tight)",
  display: "var(--font-oswald)", // vintage condensed signage
  heroScrim: "linear-gradient(180deg, rgba(20,17,14,.35), rgba(20,17,14,.85))",
  breakScrim: "linear-gradient(180deg, rgba(20,17,14,.55), rgba(20,17,14,.9))",
};
const PHONE = "(631) 555-0185";
const NAME = "Standard Barber Co.";

const SERVICES = [
  { title: "Haircut — $35", copy: "Scissor or clipper, your call. No rush, no upsell — you leave looking like you, sharper." },
  { title: "Skin fade — $40", copy: "Clean taper down to the skin, blended right and finished by hand." },
  { title: "Beard & line-up — $20", copy: "Trimmed, shaped, and lined up so it actually looks intentional." },
  { title: "Hot-towel shave — $45", copy: "Straight razor, hot towel, the full ritual. Worth booking a few extra minutes for." },
];

const WORK = [
  { tag: "Cut", caption: "Classic scissor cut, side part" },
  { tag: "Fade", caption: "Low skin fade, textured top" },
  { tag: "Beard", caption: "Full beard shape & line-up" },
  { tag: "Shave", caption: "Hot-towel straight-razor shave" },
  { tag: "Kids", caption: "First-cut, kept easy" },
  { tag: "Shop", caption: "Four chairs, mid-afternoon" },
];

const PROPS = [
  { title: "Four chairs, no rush", copy: "We take the time the cut needs. You're not getting hustled out for the next head." },
  { title: "No upsell", copy: "You asked for a haircut, you get a haircut. We're not selling you a shelf of product." },
  { title: "Walk in or book", copy: "Book online in under a minute, or just come by. If the pole's spinning, we're cutting." },
  { title: "Same barbers", copy: "The same hands every time, so your cut comes out the same every time." },
  { title: "Cash or card", copy: "Whatever's easy. Rebook on your way out and the next one's already on the calendar." },
];

const FAQ = [
  { q: "Do I need an appointment?", a: "No — walk-ins are always welcome. But booking online takes under a minute and skips the wait." },
  { q: "What are your hours?", a: "Tue–Sat, 9am to 7pm. If the pole out front is spinning, we're open and cutting." },
  { q: "Do you cut kids' hair?", a: "We do — kids 12 and under are $25, and we keep it quick and easy for the first-timers." },
  { q: "How much is a cut?", a: "Haircut $35, skin fade $40, beard line-up $20, hot-towel shave $45. The works — cut, shave, towel — is $70." },
  { q: "Cash or card?", a: "Either. And if you rebook on the way out, your next chair's already on the calendar." },
];

export function BarberDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Book a chair" />
      <DemoHero
        eyebrow="Barbershop · Patchogue"
        line1="A good cut."
        line2="Every time."
        sub="Four chairs, no rush, no upsell. Book online or walk in; either way you leave sharp."
        primaryCta="Book a chair"
        phone={PHONE}
        mediaLabel="HERO VIDEO — the shop floor (16:9)"
      />
      <DemoMarquee terms={["Cuts", "Fades", "Beards", "Shaves", "Kids"]} />
      <Intro
        eyebrow="Who we are"
        line1="Old-school chair."
        line2="No nonsense."
        paragraphs={[
          "No app trying to upsell you pomade, no rotating stranger who's never seen your hairline. Just a good cut from the same barbers.",
          "Standard runs four chairs in Patchogue. Book online in a minute or walk in — if the pole's spinning, we're cutting.",
        ]}
        badges={[
          ["Cuts to shaves", "Full menu"],
          ["Walk-in or book", "Either works"],
          ["Same barbers", "Consistent"],
          ["Cash or card", "Easy"],
        ]}
      />
      <ServiceCards
        eyebrow="The list"
        line1="Four services."
        line2="Done sharp."
        services={SERVICES}
        thumbPrefix="LOOK"
      />
      <FullBleedBreak
        eyebrow="The chair"
        line1="No rush."
        line2="No upsell."
        paragraph="We take the time the cut needs and send you out looking like you, sharper. Rebook on your way out and the next one's already on the calendar."
        checklist={[
          "Walk-ins always welcome",
          "Book online in under a minute",
          "Same barbers every visit",
          "Cash or card",
        ]}
        cta="Book a chair"
        mediaLabel="THE SHOP — chairs & details (16:9)"
      />
      <WorkGrid
        eyebrow="Recent work"
        line1="The work,"
        line2="on the wall."
        items={WORK}
      />
      <ValueProps
        eyebrow="Why this chair"
        line1="Reasons people"
        line2="keep coming back."
        props={PROPS}
      />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
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
      <CtaBand
        line1="Need a cut?"
        line2="Grab a chair."
        cta="Book a chair"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A four-chair barbershop — cuts, fades, beards, and hot-towel shaves."
        area="311 Main St, Patchogue, Long Island"
        services={["Haircut", "Skin fade", "Beard & line-up", "Hot-towel shave"]}
        phone={PHONE}
        email="hello@standardbarber.demo"
        location="311 Main St, Patchogue, NY"
        hours="Tue–Sat, 9am–7pm"
        strip="Walk-ins Welcome · Cash or Card · Same Barbers"
      />
    </DemoShell>
  );
}
