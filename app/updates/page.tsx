import type { Metadata } from "next";
import Link from "next/link";
import { UpdatesForm } from "@/components/updates/UpdatesForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Send us changes — ${SITE.name}`,
  description: "Look up your project and send us what you want changed.",
  robots: { index: false, follow: false },
};

// Same shape as /start: a standalone form, same visual language, reached by
// a client who already has a reference code rather than a cold visitor.
export default function UpdatesPage() {
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
          <UpdatesForm />
        </div>
      </div>
    </main>
  );
}
