// The one place a template is described. Read by:
//   • the /start form's page 1 dropdown and its "Customize your template" page
//   • lib/generatePrompt.ts (the {templateSpecificSection} block)
//   • the /d48 dashboard's "Copy template code" button (via `file`)
// Add a demo to components/demos/index.ts, add it here, and every one of
// those picks it up. `key` is the same slug lib/projects.ts uses.
//
// A question with a `list` is the interesting case: instead of asking the
// client to imagine a section, lib/templateContent.ts reads `from` out of the
// demo's own source and the form renders one editable row per item, pre-filled
// with what the template actually says today. Nothing about the current
// content is written down twice — this file names the const, the demo file is
// the truth.

export type ListField = {
  key: string;
  label: string;
  area?: boolean; // render as a textarea, for anything sentence-length
};

export type ListSpec = {
  // A top-level `const NAME = [...]` in the demo file, or "@marquee" for the
  // terms array written inline in the JSX.
  from: string;
  fields: ListField[];
  min?: number; // the × buttons stop here, default 0
  add: string; // label on the add-a-row button
  noun: string; // what one row is, for row headings and screen readers
  // One-field lists read better as a sentence ("Right now they are: a, b, c")
  // than as a stack of labelled rows.
  inline?: boolean;
};

export type TplQuestion = {
  key: string;
  label: string;
  hint?: string;
  type?: "text" | "textarea" | "number";
  current?: string; // what the template ships with today, shown to the client
  placeholder?: string;
  list?: ListSpec;
};

export type Template = {
  key: string;
  name: string;
  file: string; // repo-relative path to the demo source
  sample: string; // the demo's made-up business, so the client knows what they picked
  questions: TplQuestion[];
};

// ── Reusable questions ───────────────────────────────────────────────────
const marquee: TplQuestion = {
  key: "marqueeWords",
  label: "Scrolling words strip",
  hint: "On your site there's a strip of words that scrolls sideways, forever, just under the header. You can keep these, replace them, or add your own. One word per box, and you need at least three.",
  list: {
    from: "@marquee",
    fields: [{ key: "word", label: "Word" }],
    min: 3,
    add: "Add another word",
    noun: "word",
    inline: true,
  },
};

const faq: TplQuestion = {
  key: "faq",
  label: "Questions and answers",
  hint: "Your site has a section of questions customers ask, with the answers. These are the ones this style ships with. Edit any of them, delete the ones that don't apply to you, and add the questions you actually get asked. Leave one as-is and we'll rewrite it in your voice.",
  list: {
    from: "FAQ",
    fields: [
      { key: "q", label: "Question" },
      { key: "a", label: "Answer", area: true },
    ],
    add: "Add a question",
    noun: "question",
  },
};

const work = (from = "WORK"): TplQuestion => ({
  key: "workCaptions",
  label: "Captions under your work photos",
  hint: "Every photo in the work grid has a short caption under it. These are what's there now. Rewrite them to describe the photos you uploaded — the job and the town beats anything clever.",
  list: {
    from,
    fields: [
      { key: "tag", label: "Category" },
      { key: "caption", label: "Caption" },
    ],
    add: "Add a photo caption",
    noun: "caption",
  },
});

const chips: TplQuestion = {
  key: "workFilters",
  label: "Work grid filters",
  hint: "The buttons people click to filter your photos by type of job. Keep the ones that match what you do.",
  list: {
    from: "WORK_CHIPS",
    fields: [{ key: "chip", label: "Filter" }],
    min: 1,
    add: "Add a filter",
    noun: "filter",
    inline: true,
  },
};

const services = (from: string, extra?: ListField[]): TplQuestion => ({
  key: "services",
  label: "What you do",
  hint: "The services listed on your site, in the order they appear. Edit the wording, drop anything you don't offer, and add what's missing.",
  list: {
    from,
    fields: [
      { key: "title", label: "Service" },
      { key: "copy", label: "Description", area: true },
      ...(extra ?? []),
    ],
    min: 1,
    add: "Add a service",
    noun: "service",
  },
});

const process: TplQuestion = {
  key: "processSteps",
  label: "How a job runs, step by step",
  hint: "The numbered walk-through of what happens from the first call to the finished job. Change the steps and the timings to match how you actually work.",
  list: {
    from: "PROCESS",
    fields: [
      { key: "title", label: "Step" },
      { key: "what", label: "What happens", area: true },
      { key: "duration", label: "How long" },
    ],
    min: 1,
    add: "Add a step",
    noun: "step",
  },
};

const why = (from: string, f: ListField[]): TplQuestion => ({
  key: "valueProps",
  label: "Why people hire you",
  hint: "The reasons your site gives for choosing you. Only keep the ones that are true for your business — we'd rather run three real ones than five that sound like everyone else.",
  list: { from, fields: f, min: 1, add: "Add a reason", noun: "reason" },
});

const beforeAfter: TplQuestion = {
  key: "beforeAfter",
  label: "Before and after pairs",
  hint: "Name each pair in your photo uploads (before-1.jpg / after-1.jpg), then describe them here, one per line.",
  type: "textarea",
};

// Appended to every template. The catch-all that stops the form from being
// the limit of what a client can ask for.
export const CATCH_ALL: TplQuestion = {
  key: "anythingElse",
  label: "Anything on this style you want changed that we didn't ask about?",
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
      marquee,
      services("SERVICES"),
      process,
      {
        key: "roomTransforms",
        label: "Room transformations",
        hint: "The before/after rooms you want to show. One per line: Kitchen gut, Bayport | 1970s galley opened to the dining room.",
        type: "textarea",
      },
      chips,
      work(),
      why("PROPS", [
        { key: "title", label: "Reason" },
        { key: "copy", label: "Why it matters", area: true },
      ]),
      faq,
    ],
  },
  {
    key: "demo-landscaping",
    name: "Landscaping",
    file: "components/demos/LandscapingDemo.tsx",
    sample: "Stone & Sage Landscape",
    questions: [
      marquee,
      services("SERVICES"),
      process,
      {
        key: "lighting",
        label: "The day/night lighting section",
        hint: "This style has a slider that flips a yard from daylight to landscape lighting. Do you do lighting work? If not we'll swap the section for something you do.",
        type: "textarea",
      },
      chips,
      work(),
      why("PROPS", [
        { key: "title", label: "Reason" },
        { key: "copy", label: "Why it matters", area: true },
      ]),
      faq,
    ],
  },
  {
    key: "demo-powerwash",
    name: "Power washing",
    file: "components/demos/PowerWashDemo.tsx",
    sample: "Tide Line Exterior Cleaning",
    questions: [
      marquee,
      services("WASH", [{ key: "includes", label: "What's covered" }]),
      beforeAfter,
      {
        key: "proofStrip",
        label: "The numbers strip",
        hint: "Four short facts about how you work. Real ones only, and nothing you'd have to invent. Currently things like same-day quotes and soft-wash on siding.",
        type: "textarea",
      },
      work(),
      faq,
    ],
  },
  {
    key: "demo-florist",
    name: "Flower shop",
    file: "components/demos/FloristDemo.tsx",
    sample: "Wildstem",
    questions: [
      marquee,
      {
        key: "occasions",
        label: "Occasions you arrange for",
        hint: "The tiles people browse by, near the top of the page. Change them to the occasions you actually take orders for.",
        list: {
          from: "OCCASIONS",
          fields: [
            { key: "name", label: "Occasion" },
            { key: "note", label: "One line about it" },
          ],
          min: 1,
          add: "Add an occasion",
          noun: "occasion",
        },
      },
      {
        key: "bouquets",
        label: "The bouquet gallery",
        hint: "The arrangements shown in the gallery, with what each one costs. A range or 'ask' is fine where a flat price isn't.",
        list: {
          from: "BOUQUETS",
          fields: [
            { key: "name", label: "Arrangement" },
            { key: "price", label: "Price" },
          ],
          min: 1,
          add: "Add an arrangement",
          noun: "arrangement",
        },
      },
      why("VALUES", [
        { key: "h", label: "Reason" },
        { key: "p", label: "Why it matters", area: true },
      ]),
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
      marquee,
      {
        key: "plans",
        label: "Your service plans",
        hint: "The three plans people pick between. Change the names, the prices, and what each one includes. Separate the included items with a · if you're adding a new plan.",
        list: {
          from: "PLANS",
          fields: [
            { key: "name", label: "Plan" },
            { key: "price", label: "Price" },
            { key: "unit", label: "Per" },
            { key: "blurb", label: "One line about it" },
            { key: "includes", label: "What's included", area: true },
          ],
          min: 1,
          add: "Add a plan",
          noun: "plan",
        },
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
      work(),
      faq,
    ],
  },
  {
    key: "demo-bakery",
    name: "Bakery",
    file: "components/demos/BakeryDemo.tsx",
    sample: "Golden Hour Bakery",
    questions: [
      marquee,
      {
        key: "menu",
        label: "What's in the case",
        hint: "The menu section. Swap in what you actually bake, with prices, and drop anything you don't sell.",
        list: {
          from: "MENU",
          fields: [
            { key: "name", label: "Item" },
            { key: "desc", label: "Description", area: true },
            { key: "price", label: "Price" },
          ],
          min: 1,
          add: "Add an item",
          noun: "item",
        },
      },
      {
        key: "story",
        label: "The story section",
        hint: "A few sentences on how the bakery started and how you work. Yours, in your words.",
        type: "textarea",
      },
      work(),
      faq,
    ],
  },
  {
    key: "demo-barber",
    name: "Barbershop",
    file: "components/demos/BarberDemo.tsx",
    sample: "Standard Barber Co.",
    questions: [
      marquee,
      {
        key: "priceBoard",
        label: "The price board",
        hint: "The list of cuts and what each costs. Change the prices, rename anything you call something else, and add what's missing.",
        list: {
          from: "BOARD",
          fields: [
            { key: "name", label: "Service" },
            { key: "price", label: "Price" },
            { key: "note", label: "One line about it" },
          ],
          min: 1,
          add: "Add a service",
          noun: "service",
        },
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
      work(),
      faq,
    ],
  },
  {
    key: "demo-autobody",
    name: "Auto body",
    file: "components/demos/AutoBodyDemo.tsx",
    sample: "Apex Collision",
    questions: [
      marquee,
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
        hint: "The swatches people click through. Change them to colors you actually shoot. If you don't know a hex code, leave ours and we'll match it.",
        list: {
          from: "PAINTS",
          fields: [
            { key: "name", label: "Color" },
            { key: "hex", label: "Hex code" },
          ],
          min: 1,
          add: "Add a color",
          noun: "color",
        },
      },
      {
        key: "specStrip",
        label: "The four facts strip",
        hint: "The band of four claims across the middle of the page. Change any that aren't true for your shop, and delete rather than stretch.",
        list: {
          from: "SPECS",
          fields: [
            { key: "fig", label: "The big bit" },
            { key: "label", label: "Label" },
            { key: "desc", label: "One line about it", area: true },
          ],
          min: 1,
          add: "Add a fact",
          noun: "fact",
        },
      },
      beforeAfter,
      work(),
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
        ...marquee,
        hint: "The line of phrases that drifts across the dark section. On this template they're short atmospheric lines rather than a service list. One per box, at least three.",
        list: { ...marquee.list!, from: "PHRASES" },
      },
      {
        key: "shows",
        label: "Your shows",
        hint: "The cards people flip through. Change them to the sets you actually perform.",
        list: {
          from: "SHOWS",
          fields: [
            { key: "label", label: "Show" },
            { key: "desc", label: "What it is", area: true },
          ],
          min: 1,
          add: "Add a show",
          noun: "show",
        },
      },
      {
        key: "testimonials",
        label: "Reactions",
        hint: "Real things real people said. Wipe ours out and put yours in, or leave the section empty and we'll drop it. We won't invent quotes.",
        list: {
          from: "REACTIONS",
          fields: [
            { key: "line", label: "What they said", area: true },
            { key: "who", label: "Who said it" },
          ],
          add: "Add a reaction",
          noun: "reaction",
        },
      },
      {
        key: "venues",
        label: "Where you work",
        hint: "The room types you perform in. Add or remove to match the work you take.",
        list: {
          from: "VENUES",
          fields: [{ key: "venue", label: "Room type" }],
          min: 1,
          add: "Add a room type",
          noun: "room type",
          inline: true,
        },
      },
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
