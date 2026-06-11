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

// real capture of a live site via thum.io — placeholder imagery only,
// swapped out with our own 16:10 webp captures per CLAUDE.md §7
// (mshots was tried first but 403s datacenter IPs, incl. Vercel's)
const shot = (url: string) =>
  `https://image.thum.io/get/width/1280/crop/800/${url}`;
const fullShot = (url: string) =>
  `https://image.thum.io/get/fullpage/width/1200/${url}`;

// ── PLACEHOLDERS (Noah, 2026-06-10) ─────────────────────────────────────
// These are NOT our builds — well-known sites standing in so the gallery
// can be designed and demoed before our own style demos are deployed.
// Replace every entry before this site is shown to a single prospect.
// `embeddable` values verified by header check 2026-06-10 (X-Frame-Options
// / CSP frame-ancestors): nike, allbirds, apple block framing; patagonia,
// terminal-industries, relats allow it.
export const projects: Project[] = [
  {
    // our own style demo — rendered inline from components/demos (no iframe)
    slug: "demo-lawncare",
    name: "Lawn care",
    url: "",
    screenshot: "",
    screenshotFull: "",
    preview: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 0,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "ph-nike",
    name: "Nike",
    url: "https://www.nike.com",
    screenshot: shot("https://www.nike.com"),
    screenshotFull: fullShot("https://www.nike.com"),
    preview: "/previews/ph-nike.html",
    tier: "flagship",
    priceLabel: "let's talk",
    order: 1,
    embeddable: false,
    isStyleDemo: false,
  },
  {
    slug: "ph-terminal",
    name: "Terminal Industries",
    url: "https://terminal-industries.com",
    screenshot: shot("https://terminal-industries.com"),
    screenshotFull: fullShot("https://terminal-industries.com"),
    preview: "/previews/ph-terminal.html",
    tier: "custom",
    priceLabel: "custom from $500",
    order: 2,
    embeddable: true,
    isStyleDemo: false,
  },
  {
    slug: "ph-patagonia",
    name: "Patagonia",
    url: "https://www.patagonia.com",
    screenshot: shot("https://www.patagonia.com"),
    screenshotFull: fullShot("https://www.patagonia.com"),
    // patagonia serves a bot wall to scripted fetches — no usable mirror;
    // it allows framing, so the panel falls back to the live iframe
    preview: "",
    tier: "custom",
    priceLabel: "custom from $500",
    order: 3,
    embeddable: true,
    isStyleDemo: false,
  },
  {
    slug: "ph-relats",
    name: "Relats",
    url: "https://relats.com",
    screenshot: shot("https://relats.com"),
    screenshotFull: fullShot("https://relats.com"),
    preview: "/previews/ph-relats.html",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 4,
    embeddable: true,
    isStyleDemo: false,
  },
  {
    slug: "ph-allbirds",
    name: "Allbirds",
    url: "https://www.allbirds.com",
    screenshot: shot("https://www.allbirds.com"),
    screenshotFull: fullShot("https://www.allbirds.com"),
    preview: "/previews/ph-allbirds.html",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 5,
    embeddable: false,
    isStyleDemo: false,
  },
  {
    slug: "ph-apple",
    name: "Apple",
    url: "https://www.apple.com",
    screenshot: shot("https://www.apple.com"),
    screenshotFull: fullShot("https://www.apple.com"),
    preview: "/previews/ph-apple.html",
    tier: "flagship",
    priceLabel: "let's talk",
    order: 6,
    embeddable: false,
    isStyleDemo: false,
  },
];

export const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

export const styleDemos = orderedProjects.filter((p) => p.isStyleDemo);
