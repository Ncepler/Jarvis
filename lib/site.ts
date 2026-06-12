export const SITE = {
  name: "STUDIO_NAME_TBD", // the FULL brand, e.g. "Word Studio" — swapped once, later
  founder: "FOUNDER_NAME_TBD", // Noah's display name on the business card
  domain: "DOMAIN_TBD", // may be a .studio or a compound .com — don't assume
  tagline: "TAGLINE_TBD",
  email: "CONTACT_EMAIL_TBD",
  instagram: "INSTAGRAM_URL_TBD",
  region: "Long Island, NY",
} as const;

// True while a SITE value is still a placeholder — components use this to
// avoid rendering broken links/strings before the brand exists.
export const isTBD = (value: string) => value.endsWith("_TBD");

// All persuasion copy lives here so the voice is editable in one file
// (Noah 2026-06-12). §8 voice: casual, plain, specific, confident. The job:
// a wary visitor from a cold email needs "is this safe", "what do I do",
// and "what does this get me" answered, with no fabricated proof.
export const COPY = {
  hero: {
    positioning:
      "Websites for local businesses that look like they cost 10x more.",
    outcome:
      "People Google you before they hire you. What they find decides who gets the call.",
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
  about: {
    p1: `We're a small web studio on ${SITE.region.replace(", NY", "")}, building sites for the businesses around us: flower shops, landscapers, barbershops, contractors.`,
    p2: "Agencies charge thousands for this, and most of it pays for meetings. We charge a few hundred and spend it on the part you can actually see.",
    // the component appends the Instagram link (or a period) after this
    closer:
      "You don't pay in full until you're happy with your site. We care way too much about how these look; the work above is the pitch",
  },
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
    sub: "Tell us about the business. A couple sentences is plenty.",
    reassurance: "No obligation, and you'll hear back within a day.",
    nearSubmit: "Nothing to pay today.",
    success: "Got it. We'll be in touch.",
  },
} as const;
