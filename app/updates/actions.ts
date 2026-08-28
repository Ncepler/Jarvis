"use server";

import { headers } from "next/headers";
import { rateLimited } from "@/lib/rateLimit";
import { findSubmission, insertUpdateRequest, type LookupResult } from "@/lib/updates";
import { SITE } from "@/lib/site";

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const fail = (error: string): Result<never> => ({ ok: false, error });

async function callerIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// One generic message either way — it doesn't say which field was wrong, so
// walking the ref-code sequence doesn't tell you anything either.
const NO_MATCH =
  `That code and email don't match anything on our end. Check both and try again, or email us at ${SITE.email}.`;

export async function lookupSubmission(
  refCodeRaw: string,
  emailRaw: string,
): Promise<Result<LookupResult>> {
  if (rateLimited(`updates:lookup:${await callerIp()}`)) {
    return fail("Too many attempts. Wait a minute and try again.");
  }

  const refCode = refCodeRaw.trim().toUpperCase();
  const email = emailRaw.trim();
  if (!refCode || !email) return fail(NO_MATCH);

  try {
    const found = await findSubmission(refCode, email);
    if (!found) return fail(NO_MATCH);
    return { ok: true, value: found };
  } catch {
    return fail("Couldn't reach the server just now. Try again in a minute.");
  }
}

export async function sendUpdateRequest(
  refCode: string,
  submissionId: string,
  body: string,
): Promise<Result<true>> {
  if (rateLimited(`updates:submit:${await callerIp()}`)) {
    return fail("Too many attempts. Wait a minute and try again.");
  }

  const text = body.trim().slice(0, 8000);
  if (!text) return fail("Write out what you want changed first.");

  try {
    await insertUpdateRequest(refCode.trim().toUpperCase(), submissionId, text);
    return { ok: true, value: true };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "That didn't send. Try again in a minute.");
  }
}
