import type { Metadata } from "next";
import Link from "next/link";
import { IntakeForm } from "@/components/intake/IntakeForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Start a project — ${SITE.name}`,
  description: "Tell us about your business. Takes about five minutes.",
  robots: { index: false, follow: false },
};

// Standalone intake — a longer, more detailed form than a homepage contact
// form (§6.7). Reached from a project that's already moving (a client who said
// yes), not a cold visitor, so it asks for more up front in exchange for
// skipping a round of back-and-forth email.
//
// The heading lives inside IntakeForm on purpose: on a successful submit the
// whole thing is replaced by the confirmation, so there's no "let's get your
// site built" sitting above a "we got it".
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

        <div className="mt-8">
          <IntakeForm hasBackend={hasBackend} />
        </div>
      </div>
    </main>
  );
}
