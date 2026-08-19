// The one place a template is described. Read by:
//   • the /start form's page 1 dropdown and its "Customize your template" page
//   • lib/generatePrompt.ts (the {templateSpecificSection} block)
//   • the /d48 dashboard's "Copy template code" button (via `file`)
// Add a demo to components/demos/index.ts, add it here, and every one of
// those picks it up. `key` is the same slug lib/projects.ts uses.

export type TplQuestion = {
  key: string;
  label: string;
  hint?: string;
  type?: "text" | "textarea" | "number";
  current?: string; // what the template ships with today, shown to the client
  placeholder?: string;
};

export type Template = {
  key: string;
  name: string;
  file: string; // repo-relative path to the demo source
  sample: string; // the demo's made-up business, so the client knows what they picked
  questions: TplQuestion[];
};

const marquee = (current: string): TplQuestion => ({
  key: "marqueeWords",
  label: "The scrolling word strip",
  hint: "The band of words that drifts across the page under the header. Change them or leave them.",
  current,
});

const faq: TplQuestion = {
  key: "faq",
  label: "Your questions and answers",
  hint: "The questions customers actually ask you, one per line, answer after a pipe: Do you give free estimates? | Always, and it's a real number.",
  type: "textarea",
};

const workCaptions: TplQuestion = {
  key: "workCaptions",
  label: "Captions for your work photos",
  hint: "One per line, matched to the photos you uploaded. Filename, a pipe, then the caption: work-1.jpg | what the job was and where.",
  type: "textarea",
};

const beforeAfter: TplQuestion = {
  key: "beforeAfter",
  label: "Before and after pairs",
  hint: "Name each pair in your photo uploads (before-1.jpg / after-1.jpg), then describe them here, one per line.",
  type: "textarea",
};

const processSteps: TplQuestion = {
  key: "processSteps",
  label: "Your process, step by step",
  hint: "How a job actually runs from first call to finished. One step per line.",
  type: "textarea",
};

const valueProps: TplQuestion = {
  key: "valueProps",
  label: "Why people hire you",
  hint: "Three or four real reasons, one per line. Skip anything you can't back up.",
  type: "textarea",
};

// Appended to every template. The catch-all that stops the form from being
// the limit of what a client can ask for.
export const CATCH_ALL: TplQuestion = {
  key: "anythingElse",
  label: "Anything on this template you want changed that we didn't ask about?",
  hint: "Copy changes, sections you'd rather drop, layout tweaks. Anything.",
  type: "textarea",
};

export const TEMPLATES: Template[] = [
  {
    key: "demo-renovation",
    name: "Renovation",
    file: "components/demos/RenovationDemo.tsx",
    sample: "Maple & Main Renovation Co.",
    questions: [
      marquee("Kitchens, Bathrooms, Additions, Basements, Whole-Home, Trim & Carpentry"),
      processSteps,
      {
        key: "roomTransforms",
        label: "Room transformations",
        hint: "The before/after rooms you want to show. One per line: Kitchen gut, Bayport | 1970s galley opened to the dining room.",
        type: "textarea",
      },
      {
        key: "workFilters",
        label: "Work grid filters",
        hint: "The categories people can filter your photos by. Currently: Kitchens, Baths, Additions, Basements.",
      },
      valueProps,
      faq,
    ],
  },
  {
    key: "demo-landscaping",
    name: "Landscaping",
    file: "components/demos/LandscapingDemo.tsx",
    sample: "Stone & Sage Landscape",
    questions: [
      marquee("Patios, Retaining Walls, Gardens, Lighting, Fire Pits"),
      processSteps,
      {
        key: "lighting",
        label: "The day/night lighting section",
        hint: "This template has a slider that flips a yard from daylight to landscape lighting. Do you do lighting work? If not we'll swap the section for something you do.",
        type: "textarea",
      },
      {
        key: "workFilters",
        label: "Work grid filters",
        hint: "The categories people can filter your photos by. Currently: Patios, Walls, Plantings, Lighting.",
      },
      valueProps,
      faq,
    ],
  },
  {
    key: "demo-powerwash",
    name: "Power washing",
    file: "components/demos/PowerWashDemo.tsx",
    sample: "Tide Line Exterior Cleaning",
    questions: [
      marquee("Houses, Driveways, Decks, Patios, Fences"),
      beforeAfter,
      {
        key: "proofStrip",
        label: "The numbers strip",
        hint: "Four short facts about how you work. Real ones only, and nothing you'd have to invent. Currently things like same-day quotes and soft-wash on siding.",
        type: "textarea",
      },
      workCaptions,
      faq,
    ],
  },
  {
    key: "demo-florist",
    name: "Flower shop",
    file: "components/demos/FloristDemo.tsx",
    sample: "Wildstem",
    questions: [
      marquee("Weddings, Events, Daily, Weekly, Sympathy"),
      {
        key: "occasions",
        label: "Occasions you arrange for",
        hint: "The tiles people browse by. One per line: Weddings, Sympathy, Birthdays, Just because.",
        type: "textarea",
      },
      {
        key: "bouquets",
        label: "The bouquet gallery",
        hint: "One per line: name, then a pipe, then the price or price range. Wild Meadow | from $65.",
        type: "textarea",
      },
      {
        key: "subscription",
        label: "Weekly flower subscription",
        hint: "Do you offer one? Tiers and prices if so, or say skip it and we'll pull the section.",
        type: "textarea",
      },
      faq,
    ],
  },
  {
    key: "demo-lawncare",
    name: "Lawn care",
    file: "components/demos/LawnCareDemo.tsx",
    sample: "Fresh Cut Lawn Care",
    questions: [
      marquee("Mowing, Cleanups, Edging, Mulch, Fertilizing"),
      {
        key: "plans",
        label: "Your service plans",
        hint: "One plan per line: name, price, then what's included. Basic Mow | from $40 / visit | mow, trim, edge, blown clean.",
        type: "textarea",
      },
      {
        key: "estSmall",
        label: "Instant estimate: price for a small lot (up to ¼ acre)",
        type: "number",
        current: "$40",
      },
      {
        key: "estMedium",
        label: "Instant estimate: price for a medium lot (¼ to ½ acre)",
        type: "number",
        current: "$55",
      },
      {
        key: "estLarge",
        label: "Instant estimate: price for a large lot (½ acre and up)",
        type: "number",
        current: "$75",
      },
      {
        key: "estBiweekly",
        label: "Biweekly surcharge",
        hint: "How much more a biweekly visit costs than a weekly one, as a percent. More growth between cuts.",
        type: "number",
        current: "25%",
      },
      workCaptions,
      faq,
    ],
  },
  {
    key: "demo-bakery",
    name: "Bakery",
    file: "components/demos/BakeryDemo.tsx",
    sample: "Golden Hour Bakery",
    questions: [
      marquee("Sourdough, Pastry, Cakes, Focaccia, Cookies"),
      {
        key: "menu",
        label: "What's in the case",
        hint: "One per line: item, price, short description. Country sourdough | $9 | 24-hour cold ferment, dark crust.",
        type: "textarea",
      },
      {
        key: "story",
        label: "The story section",
        hint: "A few sentences on how the bakery started and how you work. Yours, in your words.",
        type: "textarea",
      },
      workCaptions,
      faq,
    ],
  },
  {
    key: "demo-barber",
    name: "Barbershop",
    file: "components/demos/BarberDemo.tsx",
    sample: "Standard Barber Co.",
    questions: [
      marquee("Cuts, Fades, Beards, Shaves, Kids"),
      {
        key: "priceBoard",
        label: "The price board",
        hint: "One per line: service, price, how long it takes. Skin fade | $40 | 45 min.",
        type: "textarea",
      },
      {
        key: "theChair",
        label: "The chair section",
        hint: "The slow paragraph about what sitting in your chair is actually like. Your words beat ours here.",
        type: "textarea",
      },
      {
        key: "booking",
        label: "Booking",
        hint: "Walk-ins, appointments, or both? If you use a booking service (Booksy, Square), give us the link.",
      },
      workCaptions,
      faq,
    ],
  },
  {
    key: "demo-autobody",
    name: "Auto body",
    file: "components/demos/AutoBodyDemo.tsx",
    sample: "Apex Collision",
    questions: [
      marquee("Collision, Paint, Dents, Frame, Glass, Detailing"),
      {
        key: "estBumper",
        label: "Estimate calculator: base price for a bumper",
        type: "number",
        current: "$600",
      },
      {
        key: "estDoor",
        label: "Estimate calculator: base price for a door or fender",
        type: "number",
        current: "$950",
      },
      {
        key: "estQuarter",
        label: "Estimate calculator: base price for a quarter panel",
        type: "number",
        current: "$1,350",
      },
      {
        key: "estMulti",
        label: "Estimate calculator: base price for multiple panels",
        type: "number",
        current: "$2,400",
      },
      {
        key: "estVehicle",
        label: "Estimate calculator: how much more an SUV and a truck cost than a sedan",
        hint: "As percentages. Currently an SUV is 25% more and a truck is 40% more.",
      },
      {
        key: "paints",
        label: "Paint colors in the color-match strip",
        hint: "One per line: name, then the closest hex code if you know it. Midnight Black | #15171A. We'll match them if you don't.",
        type: "textarea",
      },
      {
        key: "specStrip",
        label: "The four facts strip",
        hint: "Currently: written estimates, we handle the claim, lifetime paint warranty, OEM parts. Change any that aren't true for you.",
        type: "textarea",
      },
      beforeAfter,
      faq,
    ],
  },
  {
    key: "demo-magician",
    name: "Magician",
    file: "components/demos/MagicianDemo.tsx",
    sample: "Elias Vane",
    questions: [
      {
        key: "marqueeWords",
        label: "The scrolling phrase band",
        hint: "The line of phrases that drifts across the dark section. Currently short atmospheric lines, not services.",
        type: "textarea",
      },
      {
        key: "shows",
        label: "Your shows",
        hint: "The five cards people flip. One per line: name, length, room size, price or 'ask'. Parlour Set | 45 min | up to 40 people | from $600.",
        type: "textarea",
      },
      {
        key: "testimonials",
        label: "Reactions",
        hint: "Real things real people said, or leave it blank and we'll keep the section unattributed and labelled as illustrative. We won't invent quotes.",
        type: "textarea",
      },
      {
        key: "venues",
        label: "Where you work",
        hint: "Room types and how far you travel. Private parties, corporate rooms, theaters, and so on.",
        type: "textarea",
      },
      faq,
    ],
  },
];

export const templateByKey = (key: string) =>
  TEMPLATES.find((t) => t.key === key);

// Questions the client actually sees for a template, catch-all last.
export const questionsFor = (key: string) => {
  const t = templateByKey(key);
  return t ? [...t.questions, CATCH_ALL] : [];
};
