import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Mirrors the site's tokens in app/globals.css (@theme) and lib/site.ts.
// The video project can't import from the Next app (separate package, see
// HANDOFF.md), so keep these in sync by hand when the brand changes.
export const BRAND = "Vilas";
export const DOMAIN = "vilas.studio";
export const TAGLINE = "A website that looks expensive. It wasn't.";

export const C = {
  bg: "#efe9dd", // bone
  ink: "#1f1a14", // deep warm espresso
  muted: "#4d4638", // warm taupe
  line: "#d9d0c1", // hairline
  accent: "#8a5a2b", // deep bronze — strikes + one emphasized word only
} as const;

// Space Grotesk 500 = the wordmark face; Space Mono = small labels and
// ".studio". Two faces max. Loaded from public/fonts so renders never need
// the network (OFL licenses sit next to the files).
export const GROTESK = "Space Grotesk";
export const MONO = "Space Mono";

export const fontsLoaded = Promise.all([
  loadFont({
    family: GROTESK,
    url: staticFile("fonts/SpaceGrotesk-500.woff2"),
    weight: "500",
  }),
  loadFont({
    family: MONO,
    url: staticFile("fonts/SpaceMono-400.woff2"),
    weight: "400",
  }),
]);

// The site's motion curve (CLAUDE.md §5). Exits accelerate away instead.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT = Easing.bezier(0.76, 0, 0.24, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
