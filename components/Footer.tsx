import { COPY, SITE, isTBD } from "@/lib/site";
import { VERSION } from "@/lib/version";

const NAV = [
  { href: "#work", label: "The work" },
  { href: "#services", label: "What you get" },
  { href: "#process", label: "How it works" },
  { href: "#why", label: "Why us" },
  { href: "#sites", label: "Every site" },
  { href: "#contact", label: "Start a project" },
] as const;

// Structured footer: brand, then Navigate / What we do / Contact. Links that
// depend on TBD brand fields (email, Instagram) only render once they exist.
export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 text-sm md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-2xl text-ink">{SITE.name}</span>
          <p className="mt-3 max-w-xs text-muted leading-relaxed">
            {COPY.hero.positioning}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="grid content-start gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Navigate
          </span>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink/80 transition-colors duration-200 hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="grid content-start gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            What we do
          </span>
          {COPY.marquee.slice(0, 6).map((niche) => (
            <span key={niche} className="text-muted">
              {niche}
            </span>
          ))}
        </div>

        <div className="grid content-start gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Contact
          </span>
          {!isTBD(SITE.email) && (
            <a
              href={`mailto:${SITE.email}`}
              className="text-ink/80 transition-colors duration-200 hover:text-accent"
            >
              {SITE.email}
            </a>
          )}
          {!isTBD(SITE.instagram) && (
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink/80 transition-colors duration-200 hover:text-accent"
            >
              Instagram
            </a>
          )}
          <span className="text-muted">{SITE.region}</span>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6 text-muted">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="tabular-nums">{VERSION}</span>
      </div>
    </footer>
  );
}
