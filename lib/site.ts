// Brand resolved 2026-06-17: "Vilas" (VEE-las), from "visual". Domain
// vilas.studio. BRAND is the one source of the brand word; the "Studio"
// descriptor and the ".studio" line both derive from here / the domain —
// never write "Studio" anywhere else (it would double up).
const BRAND = "Vilas";

export const SITE = {
  brand: BRAND, // the bare word the wordmark reveal is built from
  name: `${BRAND} Studio`, // full wordmark + SEO name — the ONLY place "Studio" is written
  domain: "vilas.studio",
  tagline: "TAGLINE_TBD",
  // TODO: hello@vilas.studio bounces until the domain is registered and the
  // mailbox actually exists. Don't point anything real at it before then.
  email: "hello@vilas.studio",
  instagram: "INSTAGRAM_URL_TBD",
  region: "United States", // studio is fully remote — works with businesses anywhere in the US
} as const;

// True while a SITE value is still a placeholder — components use this to
// avoid rendering broken links/strings before the brand exists.
export const isTBD = (value: string) => value.endsWith("_TBD");

// The one place the deployed base URL lives. Every actual link on the page
// is already relative (`/start`, `#work`, …), so this only feeds canonical /
// og:url / metadataBase — but centralizing it here means flipping domains
// later (this site is live at www.anotherseason.org today; vilas.studio is
// being purchased) is a one-line change instead of a hunt through the repo.
// Deliberately left pointed at vilas.studio for now (Noah, 2026-08-25) — the
// canonical tag and OG image should already claim the real future domain,
// not the temporary one.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE.domain}`;

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
    // was "A small studio. Wherever you are." — dropped "small" per the house
    // rule against referencing studio size (found while rewriting About).
    about: { a: "How we build.", b: "And what you get." },
    faq: { a: "Fair questions.", b: "Straight answers." },
    contact: { a: "Start a project.", b: "It takes two minutes." },
    clientSites: { a: "Out in the world.", b: "Real, and live right now." },
    pricing: { a: "Pricing.", b: "No surprises later." },
  },
  hero: {
    positioning: "Websites for local businesses. Live in about a week.",
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
  // "Do the math" ROI beat (the section before #why). The interactive
  // calculator runs on the visitor's OWN numbers — opportunity cost, never a
  // promise of returns, and never weighed against what the site costs (that
  // would require an annual figure, which the site never states — see the
  // no-yearly-cost rule). It just shows what missed customers cost, full
  // stop. Default state (300 × 1 × 12 = 3,600) renders server-side so even
  // with JS off a real sentence shows.
  math: {
    eyebrow: "The math",
    heading: { a: "Do the math.", b: "See what it's costing you." },
    intro:
      "Someone searches for what you do before they call. A site that's slow, missing, or looks off is how that search ends without you.",
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
    honest: "Your numbers, not ours. We're just doing the multiplication.",
    cta: "Start a project",
    jsOff: "Miss one $300 customer a month and that's $3,600 a year.",
  },
  // Small note near the work section — sets expectations before anyone
  // starts dragging through the gallery.
  workNote:
    "Live in about a week. You fill out a short intake, we build, you review, it ships.",
  // "Out in the world" — real client sites, replacing the old before/after
  // section. Data comes from the client_sites table (lib/clientSites.ts);
  // this is just the section's fixed copy.
  clientSites: {
    sub: "Real businesses, live right now. Click one to open it.",
  },
  // Three tiers, flat and public. No feature lists, no "most popular" badge —
  // Premium gets more visual weight (center position, bigger card) because
  // it's the one we think fits most businesses, not because of a fabricated
  // popularity claim. Each tier gets one sentence on why it exists: buyers
  // justify a purchase to themselves, and a tier with no obvious reason loses
  // to the extremes either side of it.
  pricing: {
    tiers: [
      {
        key: "basic",
        title: "Basic",
        build: "$300 build",
        monthly: "$50/month",
        why: "A still hero image, done well. For a business that wants a clean, fast site without paying for motion.",
      },
      {
        key: "premium",
        title: "Premium",
        build: "$500 build",
        monthly: "$80/month",
        why: "A moving hero — video, or a scene that builds as people scroll. The one people remember.",
      },
      {
        key: "custom",
        title: "Custom",
        build: "let's talk",
        monthly: "",
        why: "Built from nothing, to spec, for a business the other two tiers don't fit.",
      },
    ] as const,
    note: "Your monthly covers hosting, the domain, and updates when you need them. If a payment lapses, the site pauses until it's caught up, but nothing gets deleted. Your content and domain are safe.",
    // Cost explainer, directly under the tier cards — splits the two line
    // items (upfront vs. monthly) apart from the "why" copy above.
    costExplainer: {
      heading: "What you're paying for",
      upfront:
        "The upfront cost is the site itself — design, build, copy, photos, launch. One time, done.",
      monthly:
        "The monthly keeps your domain and hosting running, and covers the SEO work below. Sites that get left alone stop showing up on Google. This keeps yours from doing that.",
      annual: "Pay for the year up front and get two months free.",
    },
  },
  // "Getting found on Google" — sits right after pricing, since the monthly
  // fee is what funds this work. Two equal-weight groups: what's set up at
  // launch, and what's ongoing every month.
  seo: {
    heading: "Getting found on Google",
    intro:
      "A website nobody finds is a business card in a drawer. Building the site is half the job. The other half is making sure Google knows it exists.",
    launch: {
      heading: "Set up when we launch",
      items: [
        "Google Search Console and your sitemap submitted, so Google indexes every page",
        "Google Analytics, so you can see who's actually visiting",
        "Page titles and descriptions built around what people search — your service plus your town",
        "LocalBusiness schema, so Google reads your hours, address and services correctly",
        "Compressed images and a fast build, because slow sites get buried",
        "Internal links, so Google can crawl the whole site",
      ],
    },
    ongoing: {
      heading: "What we keep doing every month",
      items: [
        "Google Business Profile — posts, photos, review replies, hours kept current. For local search this moves more than the website does.",
        "Keeping your name, address and phone identical everywhere online",
        "New pages when you add a service or want to show up in a neighbouring town",
        "Watching what's ranking and adjusting",
      ],
    },
    closing:
      "Local SEO isn't instant. Most of this takes three to six months to show up in rankings. Anyone promising you page one next week is lying.",
    cta: "Get started",
  },
  // The attribute-first choice on /start (before any price is shown). The
  // visitor picks based on what they want, not what it costs — price follows
  // as a confirmation line once they've answered. Custom sits outside this
  // two-way choice, reachable as a plain link rather than a third option.
  startChoice: {
    heading: "What matters more for your site?",
    premium: {
      title: "The stronger first impression",
      body: "A moving hero. Video, or a scene that builds as people scroll. This is the one people remember.",
    },
    basic: {
      title: "The lower starting cost",
      body: "A still hero, done well. Same build everywhere else.",
    },
    customPrompt: "Want something fully custom instead?",
    customLink: "Tell us what you need →",
    change: "Change",
    confirm: {
      basic: "Basic: $300 build, $50/month.",
      premium: "Premium: $500 build, $80/month.",
      custom: "Custom: let's talk pricing.",
    },
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
      basic:
        "A still hero image, done well. Pick a style from the work below and we fit it to your business.",
      premium:
        "A moving hero — video, or a scene that builds as people scroll. The one people remember.",
      custom:
        "Built from nothing, to spec, around how your business actually works.",
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
        a: "Usually less than a week. If you're picking one of our styles and you have your photos and hours ready, it's often faster. A custom build takes longer, and so does any round of changes you want after seeing the first version. Once we know what you're asking for we'll give you a real date instead of a range.",
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
