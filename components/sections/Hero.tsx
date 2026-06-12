import { Logo } from "@/components/Logo";
import { COPY, SITE } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      {/* one flat color behind the name, nothing else (Noah 2026-06-11) —
          the video slot stays wired for whenever a clip exists */}
      <HeroVideo />

      <header className="rise-in relative flex items-center justify-between px-6 py-6 md:px-10">
        <Logo size={28} />
        <a
          href="#contact"
          className="text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          Start a project
        </a>
      </header>

      <div className="relative flex flex-1 flex-col items-start justify-center px-6 md:px-10">
        <h1
          className="rise-in font-display text-display"
          style={{ animationDelay: "120ms" }}
        >
          {SITE.name}
        </h1>
        <p
          className="rise-in mt-6 max-w-md text-lg text-muted"
          style={{ animationDelay: "240ms" }}
        >
          {COPY.hero.positioning}
        </p>
        <p
          className="rise-in mt-3 max-w-md text-sm text-muted"
          style={{ animationDelay: "320ms" }}
        >
          {COPY.hero.outcome}
        </p>
        <a
          href="#work"
          className="rise-in mt-10 text-sm text-accent transition-colors duration-200 hover:text-ink"
          style={{ animationDelay: "420ms" }}
        >
          See the work
        </a>
      </div>

      <div className="relative flex justify-center pb-10">
        <span
          aria-hidden="true"
          className="scroll-cue block h-14 w-px bg-accent/50"
        />
      </div>
    </section>
  );
}
