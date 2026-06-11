// ── ADDING A SITE TO THE GALLERY ────────────────────────────────────────
// Best way — physically integrated (our own builds):
//   1. Drop the homepage as a React component in components/demos/
//      (see LawnCareDemo.tsx — self-contained, all colors local).
//   2. Register it under the project's slug in components/demos/index.ts.
//   3. Add an entry to `projects` below. The gallery renders the real
//      component inline — card thumbnail, backdrop, and open panel.
// Fallback — mirrored HTML (third-party / not-yet-ported sites):
//   1. Run  node scripts/mirror.mjs <slug> <url>  (or create
//      public/previews/<slug>.html, paste the page's view-source HTML,
//      add <base href="https://the-site.com/"> right after <head>).
//   2. Set `preview: "/previews/<slug>.html"` on the entry. The panel
//      shows it seamlessly (auto-height, page-scroll, no inner tab).
// If both are absent: live iframe of `url` (desktop, embeddable:true),
// then `screenshotFull`.

export type Project = {
  slug: string; // also used as the contact form's style reference (style_slug)
  name: string; // business or style name shown on the card
  url: string; // live site — empty until the demo is deployed
  screenshot: string; // /public/work/<slug>.webp — 16:10, supplied by Noah
  screenshotFull: string; // full-length homepage capture, last-resort fallback
  preview: string; // /previews/<slug>.html — mirrored homepage served from our origin
  tier: "template" | "custom" | "flagship";
  priceLabel: string;
  order: number; // card position; lower = earlier
  embeddable: boolean; // verified manually — default false until tested
  isStyleDemo: boolean; // true = our own template demo, not a client site
};

// All entries are our own style demos rendered inline from components/demos
// (sample brands, clearly fictional — see each demo file). `url` stays empty
// until a demo is deployed somewhere on its own.
export const projects: Project[] = [
  {
    slug: "demo-landscaping",
    name: "Landscaping",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "flagship",
    priceLabel: "let's talk",
    order: 0,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "demo-powerwash",
    name: "Power washing",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 1,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "demo-florist",
    name: "Flower shop",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "custom",
    priceLabel: "custom from $500",
    order: 2,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "demo-lawncare",
    name: "Lawn care",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 3,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "demo-bakery",
    name: "Bakery",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 4,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "demo-barber",
    name: "Barbershop",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "custom",
    priceLabel: "custom from $500",
    order: 5,
    embeddable: false,
    isStyleDemo: true,
  },
];

export const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

export const styleDemos = orderedProjects.filter((p) => p.isStyleDemo);
