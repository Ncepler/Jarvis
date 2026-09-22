// Single source of truth for tier + add-on pricing. Tier cards (Services.tsx)
// and the /start estimate both read from here so the numbers can't drift.

export type TierKey = "basic" | "premium";

export const TIERS: Record<TierKey, { build: number; monthly: number }> = {
  basic: { build: 300, monthly: 50 },
  premium: { build: 500, monthly: 80 },
};

export type AddonDemo = "chat" | "model" | "scroll" | "admin";

export type Addon = {
  id: string;
  name: string;
  blurb: string;
  build: number;
  monthly: number;
  buildIsFrom: boolean;
  freePickEligible: boolean;
  demo: AddonDemo;
  live?: { label: string; href: string };
  bundledWith?: TierKey;
};

export const ADDONS: Addon[] = [
  {
    id: "ai-chat",
    name: "AI chat assistant",
    blurb:
      "Answers customer questions on your site around the clock. Optional, and separate from your monthly.",
    build: 0,
    monthly: 30,
    buildIsFrom: false,
    freePickEligible: false,
    demo: "chat",
  },
  {
    id: "3d-object",
    name: "3D object",
    blurb:
      "A 3D model of your product that visitors can spin and open. Built from your photos and measurements.",
    build: 200,
    monthly: 0,
    buildIsFrom: true,
    freePickEligible: false,
    demo: "model",
  },
  {
    id: "scroll-video",
    name: "Scroll video",
    blurb:
      "A video that plays as visitors scroll down the page, as its own section.",
    build: 0,
    monthly: 0,
    buildIsFrom: false,
    freePickEligible: false,
    demo: "scroll",
    bundledWith: "premium",
  },
  {
    id: "admin",
    name: "Admin page",
    blurb:
      "A private page where you update your own content — projects, hours, text — without emailing us.",
    build: 100,
    monthly: 10,
    buildIsFrom: false,
    freePickEligible: true,
    demo: "admin",
  },
];

export function priceLabel(addon: Addon): string {
  const buildAmount = `${addon.buildIsFrom ? "from " : ""}$${addon.build}`;
  if (addon.build > 0 && addon.monthly > 0) {
    return `${buildAmount} one-time + $${addon.monthly}/month`;
  }
  if (addon.build > 0) {
    return `${buildAmount} one-time`;
  }
  return `$${addon.monthly}/month`;
}

export const WAIVER_NAMES = ADDONS.filter(
  (a) => a.freePickEligible && a.build > 0
)
  .map((a) => a.name)
  .join(" or ");

export function estimate(tier: TierKey, ids: string[]) {
  const picks = ADDONS.filter((a) => ids.includes(a.id) && !a.bundledWith);

  const waived =
    tier === "premium"
      ? picks
          .filter((a) => a.freePickEligible && a.build > 0)
          .reduce<Addon | null>(
            (best, a) => (!best || a.build > best.build ? a : best),
            null
          )
      : null;

  const build =
    TIERS[tier].build +
    picks.reduce((sum, a) => sum + a.build, 0) -
    (waived ? waived.build : 0);
  const monthly =
    TIERS[tier].monthly + picks.reduce((sum, a) => sum + a.monthly, 0);

  return {
    build,
    monthly,
    dueToStart: build / 2,
    waivedId: waived ? waived.id : null,
    hasFrom: picks.some((a) => a.buildIsFrom),
  };
}
