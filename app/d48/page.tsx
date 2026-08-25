import type { Metadata } from "next";
import { Dashboard } from "@/components/d48/Dashboard";
import { Gate } from "@/components/d48/Gate";
import { hasBackend, isAuthed, listSubmissions, listUpdateRequests, type UpdateRequestRow } from "@/lib/d48";
import type { SubmissionRow } from "@/lib/intake";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Intake",
  robots: { index: false, follow: false },
};

export default async function D48Page() {
  const authed = await isAuthed();

  let rows: SubmissionRow[] = [];
  let requests: UpdateRequestRow[] = [];
  let error: string | undefined;
  if (authed) {
    if (!hasBackend()) {
      error = "Supabase isn't configured on this deploy, so there's nothing to read.";
    } else {
      try {
        [rows, requests] = await Promise.all([listSubmissions(), listUpdateRequests()]);
      } catch {
        error = "Couldn't reach Supabase just now. Reload in a minute.";
      }
    }
  }

  return (
    <main className="min-h-screen px-5 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        {authed ? <Dashboard rows={rows} requests={requests} error={error} /> : <Gate />}
      </div>
    </main>
  );
}
