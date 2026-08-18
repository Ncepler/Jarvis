import type { Metadata } from "next";
import Link from "next/link";
import { IntakeForm } from "@/components/intake/IntakeForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Start a project — ${SITE.name}`,
  description: "Tell us about your business. Takes about five minutes.",
  robots: { index: false, follow: false },
};

// Standalone intake — a longer, more detailed form than the homepage's
// quick contact form (§6.7). Reached from a project that's already moving
// (a client who said yes), not a cold visitor, so it asks for more up front
// in exchange for skipping a round of back-and-forth email.
export default function StartPage() {
  const hasBackend = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          ← {SITE.name}
        </Link>

        <h1 className="mt-8 text-title font-display text-ink">
          Let&rsquo;s get your site built.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          A few questions about your business so we can start building. Takes
          about five minutes — nothing here locks you in.
        </p>

        {!hasBackend && (
          <p className="mt-6 max-w-md text-sm text-accent">
            Heads up: this form isn&rsquo;t wired up to save submissions on
            this deploy yet.
          </p>
        )}

        <div className="mt-16">
          <IntakeForm hasBackend={hasBackend} />
        </div>
      </div>
    </main>
  );
}
