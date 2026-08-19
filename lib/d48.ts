// Server-only helpers for the /d48 dashboard: the password gate and the
// thin Supabase REST reads it needs. Nothing here may be imported from a
// client component.
import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { SubmissionRow } from "./intake";

export const COOKIE = "d48_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

// The cookie holds a hash of the password, never the password itself, so a
// leaked cookie doesn't hand over the password.
const expectedToken = () => {
  const pw = process.env.DASHBOARD_PASSWORD;
  return pw ? sha(`d48:${pw}`) : null;
};

const sameHash = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export async function isAuthed() {
  const want = expectedToken();
  if (!want) return false;
  const got = (await cookies()).get(COOKIE)?.value;
  return Boolean(got && sameHash(got, want));
}

// Returns false on a wrong password; sets the session cookie on a right one.
export async function signIn(password: string) {
  const want = expectedToken();
  if (!want) return false;
  if (!sameHash(sha(`d48:${password}`), want)) return false;
  (await cookies()).set(COOKIE, want, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}

// ── Supabase ─────────────────────────────────────────────────────────────
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

export async function listSubmissions(): Promise<SubmissionRow[]> {
  if (!hasBackend()) return [];
  const res = await sb("intake_submissions?select=*&order=created_at.desc");
  if (!res.ok) throw new Error(`Supabase read failed (${res.status})`);
  return res.json();
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  if (!hasBackend()) return null;
  const res = await sb(`intake_submissions?id=eq.${encodeURIComponent(id)}&select=*`);
  if (!res.ok) throw new Error(`Supabase read failed (${res.status})`);
  const [row] = (await res.json()) as SubmissionRow[];
  return row ?? null;
}

export async function updateStatus(id: string, status: string) {
  if (!hasBackend()) throw new Error("Supabase isn't configured on this deploy.");
  const res = await sb(`intake_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Couldn't save that status (${res.status}).`);
}
