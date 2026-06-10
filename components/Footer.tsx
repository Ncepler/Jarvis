import { SITE, isTBD } from "@/lib/site";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line px-6 py-10 text-sm text-muted md:px-10">
      <span className="text-ink">{SITE.name}</span>
      <span className="flex flex-wrap gap-6">
        {!isTBD(SITE.email) && (
          <a
            href={`mailto:${SITE.email}`}
            className="transition-colors duration-200 hover:text-ink"
          >
            {SITE.email}
          </a>
        )}
        {!isTBD(SITE.instagram) && (
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-ink"
          >
            Instagram
          </a>
        )}
        <span>{SITE.region}</span>
      </span>
    </footer>
  );
}
