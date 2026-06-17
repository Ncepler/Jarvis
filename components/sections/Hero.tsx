import { VilasReveal } from "@/components/hero/VilasReveal";
import { COPY } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6">
      {/* one flat field behind the wordmark; the video slot stays wired */}
      <HeroVideo />

      <VilasReveal
        tagline={COPY.hero.positioning}
        ctaHref="#work"
        ctaLabel="See the work"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
        <span aria-hidden className="scroll-cue block h-12 w-px bg-accent/40" />
      </div>
    </section>
  );
}
