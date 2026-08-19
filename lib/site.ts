// Brand resolved 2026-06-17: "Vilas" (VEE-las), from "visual". Domain
// vilas.studio. BRAND is the one source of the brand word; the "Studio"
// descriptor and the ".studio" line both derive from here / the domain —
// never write "Studio" anywhere else (it would double up).
const BRAND = "Vilas";

export const SITE = {
  brand: BRAND, // the bare word the wordmark reveal is built from
  name: `${BRAND} Studio`, // full wordmark + SEO name — the ONLY place "Studio" is written
  founder: "FOUNDER_NAME_TBD", // Noah's display name on the business card
  domain: "vilas.studio",
  tagline: "TAGLINE_TBD",
  email: "CONTACT_EMAIL_TBD",
  instagram: "INSTAGRAM_URL_TBD",
  region: "United States", // studio is fully remote — works with businesses anywhere in the US
} as const;

// True while a SITE value is still a placeholder — components use this to
// avoid rendering broken links/strings before the brand exists.
export const isTBD = (value: string) => value.endsWith("_TBD");

// All persuasion copy lives here so the voice is editable in one file
// (Noah 2026-06-12). §8 voice: casual, plain, specific, confident. The job:
// a wary visitor from a cold email needs "is this safe", "what do I do",
// and "what does this get me" answered, with no fabricated proof.
export const COPY = {
  // Two-line oversized section headers (Axel-style: "Hired for the work. /
  // Remembered for the care."). `a` is the bright lead line, `b` the muted
  // second line. One reusable SectionHeading renders both with a per-line
  // mask reveal.
  headings: {
    services: { a: "Three ways in.", b: "Pick the one that fits." },
    gallery: { a: "Sites we built.", b: "Step inside one." },
    process: { a: "How it works.", b: "Five steps, about a week." },
    sites: { a: "Every site,", b: "one tap away." },
    // was "A small studio. Wherever you are." — dropped "small" per the house
    // rule against referencing studio size (found while rewriting About).
    about: { a: "How we build.", b: "And what you get." },
    faq: { a: "Fair questions.", b: "Straight answers." },
    contact: { a: "Start a project.", b: "It takes two minutes." },
    templateVsPersonalized: {
      a: "Here's the template.",
      b: "Here's what it becomes.",
    },
    pricing: { a: "Pricing.", b: "No surprises later." },
  },
  hero: {
    positioning: "Websites for local businesses. Live in under a week.",
    outcome:
      "People Google you before they hire you. What they find decides who gets the call.",
  },
  // The niches we build for, fed into the looping service marquee under the
  // hero. Plain nouns, no claims.
  marquee: [
    "Florists",
    "Landscapers",
    "Power washing",
    "Lawn care",
    "Bakeries",
    "Barbershops",
    "Contractors",
    "Pet groomers",
  ],
  // Mid-page full-bleed break: one line over a full-width moment, one CTA.
  fullBleed: {
    line: "People decide in five seconds. Give them something good to look at.",
    cta: "See the work",
  },
  // "Do the math" ROI beat (the section before #why). The interactive
  // calculator runs on the visitor's OWN numbers — opportunity cost, never a
  // promise of returns. Default state (300 × 1 × 12 = 3,600) renders
  // server-side so even with JS off a real sentence shows.
  math: {
    eyebrow: "The math",
    heading: { a: "Do the math.", b: "One customer covers it." },
    intro:
      "A good site is the difference between getting the call and watching it go next door.",
    q1: {
      label: "What's one new customer worth to you?",
      sub: "A typical job, sale, or first visit.",
    },
    q2: {
      pre: "Say a slow or missing site costs you just",
      post: "a month", // component prepends "client"/"clients" based on the count
      sub: "A hypothetical you set, not a number we're claiming about your business.",
    },
    readoutSuffix: "a year",
    readoutCaption: "walking to whoever's easier to find online.",
    kicker: "A site that fixes that is about $300, once.",
    // {n} is replaced with the rounded multiple in the component.
    multiple: "That's roughly {n}× the site's cost, in year one alone.",
    honest: "Your numbers, not ours. We're just doing the multiplication.",
    jsOff:
      "Miss one $300 customer a month and that's $3,600 a year. The site's about $300, once.",
  },
  // Small note near the work section — sets expectations before anyone
  // starts dragging through the gallery.
  workNote:
    "Live in under a week. You fill out a short intake, we build, you review, it ships.",
  // Before/after rows: the shared starting template on the left, the actual
  // finished site on the right — real work, not a description of the
  // process. Slugs reference lib/projects.ts; "Template" stays a labeled
  // placeholder until there's a real generic-template screenshot to show.
  templateVsPersonalized: {
    intro:
      "Every site starts from a foundation. What you get is nothing like the starting point.",
    rows: ["demo-landscaping", "demo-florist", "demo-barber"],
    note: "You upload your own photos at intake. Each just needs to be named to match its slot in the template (we tell you how).",
  },
  // Two tiers, flat and public. No feature lists — the tiers are the same
  // work at a different starting point, not different levels of effort.
  pricing: {
    tiers: [
      { title: "Template", build: "$300 build", monthly: "$50/month" },
      { title: "Custom", build: "$500 build", monthly: "$80/month" },
    ],
    flagship: "Flagship work: let's talk.",
    note: "Your monthly covers hosting, the domain, and updates when you need them. If a payment lapses, the site pauses until it's caught up, but nothing gets deleted. Your content and domain are safe.",
  },
  // Final CTA band before the form.
  closing: {
    a: "Let's build the site",
    b: "that gets you the call.",
    cta: "Start a project",
  },
  services: {
    bridge:
      "Live in about a week. All we need from you is a logo, a few photos, and your hours.",
    riskReversal: "Half up front. The rest when you're happy with it.",
    paths: {
      style:
        "Pick a style from the work below and we fit it to your business. A week later, you're the company with the nice website.",
      custom:
        "Designed from scratch around how your business actually works and what makes customers pick it.",
      flagship: "The full treatment. We scope it together.",
    },
  },
  howItWorks: {
    title: "How it works",
    steps: [
      "Reach out. The form takes two minutes.",
      "Pick a style from the work, or tell us what you're picturing.",
      "Pay half. We build it.",
      "We tweak it with you until it's right.",
      "Pay the rest. It goes live.",
    ],
  },
  // Three short blocks, not a wall of text (Noah's rewrite). Each stays under
  // 3 sentences and says nothing about studio size, location, or who's behind
  // it — Vilas presents as a studio, full stop.
  about: {
    who: {
      heading: "Who we are",
      body: "We're a web studio focused on local service businesses. Every site is built by hand for the business it belongs to.",
    },
    how: {
      heading: "How we work",
      body: "Direct, no middlemen. You tell us what you want, we build it, and it's live in about a week, with no ongoing meetings.",
    },
    what: {
      heading: "What you get",
      body: "A real site you own, hosted and maintained. A contact form that emails you directly. Updates whenever you need them.",
    },
  },
  // Footer "what we do" row — icon + 2-word label + one-line description.
  footerWhatWeDo: [
    {
      label: "Custom builds",
      body: "Every site built by hand for the business it's for.",
    },
    {
      label: "Hosted & maintained",
      body: "We keep it live, secure, and updated for you.",
    },
    {
      label: "Fast turnaround",
      body: "Live in about a week, no long back-and-forth.",
    },
  ],
  faq: {
    title: "Fair questions",
    items: [
      {
        q: "Is this legit?",
        a: "You probably got an email from a stranger, so: fair question. The work above is ours, click through all of it. And you don't pay the second half until you're happy, so the risk sits with us.",
      },
      {
        q: "Do I own the site?",
        a: "Yes. The site and the domain are yours. We build it and keep it running, that's it.",
      },
      {
        q: "What if I don't like it?",
        a: "We keep tweaking until you do. The second half of the payment waits until then.",
      },
      {
        q: "How long does it take?",
        a: "About a week if you pick a style. Custom takes longer, and we'll give you a real date before we start.",
      },
      {
        q: "What do you need from me?",
        a: "Send your logo, photos, and hours. We write everything else.",
      },
    ],
  },
  contact: {
    sub: "Tell us about the business.",
    reassurance: "No obligation, and you'll hear back within a day.",
    nearSubmit: "Nothing to pay today.",
    step2Intro:
      "Two more questions if you've got 30 seconds, or skip and we'll ask later.",
    success:
      "Got it. We'll reply within a day, so have your logo and a few photos handy.",
    errorSave: "That didn't send. Give it another try in a minute.",
  },
} as const;
