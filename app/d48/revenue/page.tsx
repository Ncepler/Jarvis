import type { Metadata } from "next";
import { Gate } from "@/components/d48/Gate";
import { Revenue } from "@/components/d48/Revenue";
import { hasBackend, isAuthed, listRevenueEntries, listRevenuePlans } from "@/lib/d48";
import type { RevenueEntry, RevenuePlan } from "@/lib/d48";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Revenue",
  robots: { index: false, follow: false },
};

export default async function RevenuePage() {
  const authed = await isAuthed();

  let entries: RevenueEntry[] = [];
  let plans: RevenuePlan[] = [];
  let error: string | undefined;
  if (authed) {
    if (!hasBackend()) {
      error = "Supabase isn't configured on this deploy, so there's nothing to read.";
    } else {
      try {
        [entries, plans] = await Promise.all([listRevenueEntries(), listRevenuePlans()]);
      } catch {
        error = "Couldn't reach Supabase just now. Reload in a minute.";
      }
    }
  }

  return (
    <main className="min-h-screen px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        {authed ? <Revenue entries={entries} plans={plans} error={error} /> : <Gate />}
      </div>
    </main>
  );
}
