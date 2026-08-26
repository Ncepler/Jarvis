// Documented Premium hero concepts, one per style (round 2, job 5). Premium's
// whole value over Basic is the moving hero, so each style needs a concrete
// idea for what moves — not "a video goes here." This is the config every
// demo's Premium hero points at; the mechanism that plays it
// (components/demos/PremiumHeroMedia.tsx) doesn't know or care which style
// it's rendering, so pointing it at a different style is a one-line change:
// pass a different key's config to DemoHero's `premium` prop.
//
// `videoSrc`/`poster` are asset paths, not files that exist yet — Noah drops
// the real Higgsfield-generated clips in at these paths later. Until then
// every entry resolves to `videoSrc: null`, which PremiumHeroMedia treats as
// "no video" and falls back to the still poster/placeholder, same as every
// other not-yet-supplied asset in this repo (CLAUDE.md §7).
export type HeroConcept = {
  slug: string; // matches lib/projects.ts's demo slug
  style: string; // display name, for the placeholder label
  mode: "loop" | "scroll"; // looping background vs. scroll-scrubbed
  concept: string; // the concrete idea — what actually moves
  videoSrc: string | null; // /premium/<slug>.mp4 once Noah supplies it
  poster: string | null; // /premium/<slug>-poster.jpg once Noah supplies it
};

const asset = (slug: string, ext: "mp4" | "jpg") => `/premium/${slug}.${ext}`;

// Every concept defaults to `mode: "scroll"` — a scene that builds as the
// visitor scrolls is the more distinctive of the two mechanics `DemoHero`
// supports, and it's what most of these concepts actually describe (a
// process finishing, not a loop). Any style can flip to `mode: "loop"`
// instead — a short seamless loop needs no per-scroll authoring, which is
// the right trade for a concept that's more "ambient" than "a sequence."
export const HERO_CONCEPTS: Record<string, HeroConcept> = {
  "demo-autobody": {
    slug: "demo-autobody",
    style: "Auto body",
    mode: "scroll",
    concept: "A dented panel straightens and repaints as the visitor scrolls.",
    videoSrc: null,
    poster: null,
  },
  "demo-renovation": {
    slug: "demo-renovation",
    style: "Renovation",
    mode: "scroll",
    concept: "A gutted room finishes out, floor to fixtures.",
    videoSrc: null,
    poster: null,
  },
  "demo-landscaping": {
    slug: "demo-landscaping",
    style: "Landscaping",
    mode: "scroll",
    concept: "A bare yard plants in and fills out.",
    videoSrc: null,
    poster: null,
  },
  "demo-powerwash": {
    slug: "demo-powerwash",
    style: "Power washing",
    mode: "scroll",
    concept: "Grime lifts off a driveway in a band that tracks the scroll.",
    videoSrc: null,
    poster: null,
  },
  "demo-florist": {
    slug: "demo-florist",
    style: "Florist",
    mode: "scroll",
    concept: "An empty vase fills, stems arrange themselves.",
    videoSrc: null,
    poster: null,
  },
  "demo-lawncare": {
    slug: "demo-lawncare",
    style: "Lawn care",
    mode: "loop",
    concept: "A patchy lawn greens and stripes in.",
    videoSrc: null,
    poster: null,
  },
  "demo-bakery": {
    slug: "demo-bakery",
    style: "Bakery",
    mode: "scroll",
    concept: "Dough proofs, bakes, and comes out finished.",
    videoSrc: null,
    poster: null,
  },
  "demo-barber": {
    slug: "demo-barber",
    style: "Barbershop",
    mode: "scroll",
    concept: "A rough cut becomes a finished fade.",
    videoSrc: null,
    poster: null,
  },
  "demo-magician": {
    slug: "demo-magician",
    style: "Magician",
    mode: "loop",
    concept: "An empty stage fills, objects appear one at a time.",
    videoSrc: null,
    poster: null,
  },
};

// Resolves a concept and fills in its asset paths — the one place a demo
// needs to know the naming convention. Returns undefined for a slug with no
// documented concept yet.
export function heroConceptFor(slug: string): HeroConcept | undefined {
  const base = HERO_CONCEPTS[slug];
  if (!base) return undefined;
  return {
    ...base,
    videoSrc: base.videoSrc ?? asset(slug, "mp4"),
    poster: base.poster ?? asset(slug, "jpg"),
  };
}
