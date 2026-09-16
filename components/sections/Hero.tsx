import { SITE } from "@/lib/site";
import { FracturedHero } from "./FracturedHero";

// The hero is a fractured 3D tile grid (12x7 thin slab boxes) baked with a
// single cream wordmark + tagline texture, sliced per-tile via
// texture.offset/.repeat — see FracturedHero for the mechanism. Replaces
// the earlier scroll-scrubbed video hero entirely
// (components/sections/HeroVideo.tsx is gone). The sticky top-right "Start"
// button (components/StickyStartButton.tsx) is a separate, pre-existing
// persistent CTA keyed off this section's `id="top"` and is untouched.
// "VILAS.studio" + the tagline still exist as real, visually-hidden DOM text
// so screen readers and search indexing see them — the canvas texture only
// bakes them in as pixels.
export function Hero() {
  const dotted = SITE.domain.slice(SITE.domain.indexOf("."));

  return (
    <section id="top" className="relative">
      <h1 className="sr-only">{`${SITE.brand.toUpperCase()}${dotted}`}</h1>
      <p className="sr-only">{SITE.tagline}</p>
      <FracturedHero />
    </section>
  );
}
