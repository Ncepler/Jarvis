import { Logo } from "@/components/Logo";
import { COPY, SITE, isTBD } from "@/lib/site";
import { VERSION } from "@/lib/version";

const NAV = [
  { href: "#work", label: "The work" },
  { href: "#services", label: "What you get" },
  { href: "#process", label: "How it works" },
  { href: "/start", label: "Start a project" },
  { href: "/updates", label: "Send us changes" },
] as const;

// Small monoline marks for the "what we do" row — no boxes, no fills, just a
// quiet stroke icon above each label (Noah's restyle: icon + 2-word label +
// one-line description, editorial, no borders/shadows).
const WHAT_WE_DO_ICONS = [
  // custom builds — layered panes
  <path
    key="builds"
    d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5"
  />,
  // hosted & maintained — signal / uptime
  <path
    key="hosted"
    d="M4 15a8 8 0 0 1 16 0M7.5 17.5a4.5 4.5 0 0 1 9 0M12 20v.01"
  />,
  // fast turnaround — forward arrow
  <path key="fast" d="M4 12h15M13 6l6 6-6 6" />,
];

// Structured footer: brand, then Navigate / What we do / Contact. Links that
// depend on TBD brand fields (email, Instagram) only render once they exist.
export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 text-sm md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-display text-2xl text-ink">{SITE.name}</span>
          </span>
          <p className="mt-3 max-w-xs text-muted leading-relaxed">
            {COPY.hero.positioning}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="grid content-start gap-3">
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">
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
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">
            Contact
          </span>
          {/* real email pending (SITE.email TBD) — hello@vilas.studio is a
              working placeholder that steps aside automatically once the
              real address is set */}
          {isTBD(SITE.email) ? (
            <a
              href="mailto:hello@vilas.studio"
              className="text-ink/80 transition-colors duration-200 hover:text-accent"
            >
              hello@vilas.studio
            </a>
          ) : (
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

      {/* "what we do" — quiet editorial row, no boxes/borders/shadows: a
          small stroke mark, a 2-word label, one line each */}
      <div className="mx-auto mt-14 max-w-6xl border-t border-line pt-10">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">
          What we do
        </span>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {COPY.footerWhatWeDo.map((item, i) => (
            <div key={item.label} className="flex flex-col gap-2.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 text-accent"
              >
                {WHAT_WE_DO_ICONS[i]}
              </svg>
              <span className="font-medium text-ink">{item.label}</span>
              <p className="text-muted leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6 text-muted">
        <span>
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span className="tabular-nums">{VERSION}</span>
      </div>
    </footer>
  );
}
