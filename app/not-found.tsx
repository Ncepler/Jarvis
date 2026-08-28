import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

// App Router's catch-all for unmatched routes. Reuses the same Logo (the
// mark used as the header everywhere else — footer, pinned corner mark) and
// the real Footer, so a mistyped URL still lands on a page that looks like
// the rest of the site, not a bare error screen.
export const metadata: Metadata = {
  title: `Page not found — ${SITE.name}`,
};

export default function NotFound() {
  return (
    <>
      <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-display text-2xl text-ink">{SITE.name}</span>
        </Link>

        <h1 className="mt-10 text-title font-display text-ink">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-4 max-w-md text-muted leading-relaxed">
          Bad link, or a typo. Either way, it&rsquo;s not here.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Go home
          </Link>
          <Link
            href="/start"
            className="press inline-block cursor-pointer border border-accent bg-accent px-8 py-4 text-white transition-colors duration-200 hover:bg-accent/90"
          >
            Start a project →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
