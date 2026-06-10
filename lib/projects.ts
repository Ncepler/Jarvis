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

// Honest placeholders until the first style demos are deployed — these render
// as "in the works" cards, never as fake clients. Fill url/screenshot per
// entry as real demos go live, and verify embeddable manually before
// flipping it to true.
export const projects: Project[] = [
  {
    slug: "style-01",
    name: "Style 01",
    url: "",
    screenshot: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 1,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "style-02",
    name: "Style 02",
    url: "",
    screenshot: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 2,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "style-03",
    name: "Style 03",
    url: "",
    screenshot: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 3,
    embeddable: false,
    isStyleDemo: true,
  },
  {
    slug: "style-04",
    name: "Style 04",
    url: "",
    screenshot: "",
    tier: "template",
    priceLabel: "~$300 · template",
    order: 4,
    embeddable: false,
    isStyleDemo: true,
  },
];

export const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

export const styleDemos = orderedProjects.filter((p) => p.isStyleDemo);
