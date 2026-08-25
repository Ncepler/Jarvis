// Server-only helpers for /updates: looking a submission up by ref_code +
// personal_email, and recording a change request against it. Same REST-fetch
// pattern as lib/d48.ts — no supabase-js, service role key never leaves the
// server.
import "server-only";
import { templateByKey } from "./templates";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasBackend = () => Boolean(URL && KEY);

async function sb(path: string, init: RequestInit = {}) {
  return fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY as string,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

export type LookupResult = {
  submissionId: string;
  businessName: string;
  contactName: string;
  buildType: string; // "Custom", or "Built from the Barbershop style"
  maskedEmail: string;
};

// "noah@vilas.studio" -> "no***@vilas.studio". Just enough to recognize the
// address as yours without showing it whole.
function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  const hidden = "*".repeat(Math.max(1, user.length - visible.length));
  return `${visible}${hidden}@${domain}`;
}

type Row = {
  id: string;
  business_name: string | null;
  your_name: string | null;
  is_custom_build: boolean | null;
  template_choice: string | null;
  personal_email: string | null;
};

// Both the ref code and the email have to match the same row — a code alone
// isn't a secret (codes are sequential after the first one issued), so the
// email is what actually gates this. `ilike` without wildcards is an exact,
// case-insensitive match, so "Noah@Vilas.Studio" still finds "noah@vilas.studio".
export async function findSubmission(
  refCode: string,
  email: string,
): Promise<LookupResult | null> {
  if (!hasBackend() || !refCode || !email) return null;
  const res = await sb(
    `intake_submissions?ref_code=eq.${encodeURIComponent(refCode)}` +
      `&personal_email=ilike.${encodeURIComponent(email)}` +
      `&select=id,business_name,your_name,is_custom_build,template_choice,personal_email`,
  );
  if (!res.ok) return null;
  const [row] = (await res.json()) as Row[];
  if (!row) return null;

  const buildType = row.is_custom_build
    ? "Custom"
    : `Built from the ${templateByKey(row.template_choice ?? "")?.name ?? row.template_choice} style`;

  return {
    submissionId: row.id,
    businessName: row.business_name ?? "",
    contactName: row.your_name ?? "",
    buildType,
    maskedEmail: maskEmail(row.personal_email ?? email),
  };
}

export async function insertUpdateRequest(
  refCode: string,
  submissionId: string,
  body: string,
) {
  if (!hasBackend()) throw new Error("This form isn't wired up on this deploy.");
  const res = await sb("update_requests", {
    method: "POST",
    body: JSON.stringify({ ref_code: refCode, submission_id: submissionId, body }),
  });
  if (!res.ok) throw new Error("Couldn't send that just now. Try again in a minute.");
}
