import type { Metadata } from "next";
import { Dashboard } from "@/components/d48/Dashboard";
import { Gate } from "@/components/d48/Gate";
import { hasBackend, isAuthed, listSubmissions } from "@/lib/d48";
import type { SubmissionRow } from "@/lib/intake";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Intake",
  robots: { index: false, follow: false },
};

export default async function D48Page() {
  const authed = await isAuthed();

  let rows: SubmissionRow[] = [];
  let error: string | undefined;
  if (authed) {
    if (!hasBackend()) {
      error = "Supabase isn't configured on this deploy, so there's nothing to read.";
    } else {
      try {
        rows = await listSubmissions();
      } catch {
        error = "Couldn't reach Supabase just now. Reload in a minute.";
      }
    }
  }

  return (
    <main className="min-h-screen px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        {authed ? <Dashboard rows={rows} error={error} /> : <Gate />}
      </div>
    </main>
  );
}
