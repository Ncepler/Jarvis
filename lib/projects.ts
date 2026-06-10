export type Project = {
  slug: string; // also used as the contact form's style reference (style_slug)
  name: string; // business or style name shown on the card
  url: string; // live site — empty until the demo is deployed
  screenshot: string; // /public/work/<slug>.webp — 16:10, supplied by Noah
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

// ── PLACEHOLDERS (Noah, 2026-06-10) ─────────────────────────────────────
// These are NOT our builds — well-known sites standing in so the gallery
// can be designed and demoed before our own style demos are deployed.
// Replace every entry before this site is shown to a single prospect.
// `embeddable` values verified by header check 2026-06-10 (X-Frame-Options
// / CSP frame-ancestors): nike, adidas, apple block framing; patagonia,
// terminal-industries, relats allow it.
export const projects: Project[] = [
  {
    slug: "ph-nike",
    name: "Nike",
    url: "https://www.nike.com",
    screenshot: shot("https://www.nike.com"),
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
    tier: "template",
    priceLabel: "~$300 · template",
    order: 4,
    embeddable: true,
    isStyleDemo: false,
  },
  {
    slug: "ph-adidas",
    name: "Adidas",
    url: "https://www.adidas.com",
    screenshot: shot("https://www.adidas.com"),
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
    tier: "flagship",
    priceLabel: "let's talk",
    order: 6,
    embeddable: false,
    isStyleDemo: false,
  },
];

export const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

export const styleDemos = orderedProjects.filter((p) => p.isStyleDemo);
