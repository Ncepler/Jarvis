import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <HeroVideo />

      {/* single ambient layer — slow drifting glow, nothing else */}
      <div
        aria-hidden="true"
        className="ambient pointer-events-none absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(closest-side at 50% 45%, rgba(244, 242, 237, 0.05), transparent 70%)",
        }}
      />

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
          Websites for local businesses that look like they cost 10x more.
        </p>
        <a
          href="#work"
          className="rise-in mt-10 text-sm text-muted transition-colors duration-200 hover:text-ink"
          style={{ animationDelay: "360ms" }}
        >
          See the work
        </a>
      </div>

      <div className="relative flex justify-center pb-10">
        <span
          aria-hidden="true"
          className="scroll-cue block h-14 w-px bg-line"
        />
      </div>
    </section>
  );
}
