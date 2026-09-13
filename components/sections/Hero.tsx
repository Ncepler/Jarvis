import { SITE } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

// The hero is one 5-second overhead coffee-spill shot, scroll-scrubbed — see
// HeroVideo for the mechanism. No reveal text, no pronunciation note, no CTA
// of its own (components/hero/VilasReveal.tsx + NameDefinition.tsx are gone
// — full replacement, not a modification). The sticky top-right "Start"
// button (components/StickyStartButton.tsx) is a separate, pre-existing
// persistent CTA keyed off this section's `id="top"` and is untouched.
// "VILAS.studio" + the tagline still exist as real, visually-hidden DOM text
// so screen readers and search indexing see them — the hero image only
// bakes them in as pixels (coffee-spill lettering).
export function Hero() {
  const dotted = SITE.domain.slice(SITE.domain.indexOf("."));

  return (
    <section id="top" className="relative">
      <h1 className="sr-only">{`${SITE.brand.toUpperCase()}${dotted}`}</h1>
      <p className="sr-only">{SITE.tagline}</p>
      <HeroVideo />
    </section>
  );
}
