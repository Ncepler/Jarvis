"use server";

import { revalidatePath } from "next/cache";
import {
  addRevenueEntry,
  addRevenuePlan,
  deleteRevenueEntry,
  deleteRevenuePlan,
  isAuthed,
} from "@/lib/d48";
import type { Result } from "@/app/d48/actions";

const fail = (error: string): Result<never> => ({ ok: false, error });

// Same pattern as app/d48/actions.ts's `run`: every action re-checks the
// cookie, since an action is a public endpoint regardless of what the page
// gates on render.
async function run<T>(work: () => Promise<T>): Promise<Result<T>> {
  if (!(await isAuthed())) return fail("You're signed out. Reload the page and sign back in.");
  try {
    return { ok: true, value: await work() };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "That didn't work. Try it again.");
  }
}

const str = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// Dollars in, integer cents stored — a bad/empty amount fails loudly rather
// than silently logging a $0 payment.
function centsFrom(v: FormDataEntryValue | null): number {
  const n = Math.round(Number(v) * 100);
  if (!Number.isFinite(n) || n <= 0) throw new Error("That amount doesn't look right.");
  return n;
}

export async function addPayment(_prev: unknown, form: FormData) {
  return run(async () => {
    const client_name = str(form.get("client_name"), 200);
    if (!client_name) throw new Error("Who was this payment from?");
    const received_on = str(form.get("received_on"), 10);
    if (!received_on) throw new Error("What date did it land?");
    const kind = str(form.get("kind"), 10);
    if (!["build", "monthly", "other"].includes(kind)) throw new Error("Pick a kind.");
    const amount_cents = centsFrom(form.get("amount"));
    const note = str(form.get("note"), 500);
    await addRevenueEntry({
      client_name,
      received_on,
      kind: kind as "build" | "monthly" | "other",
      amount_cents,
      note,
    });
    revalidatePath("/d48/revenue");
  });
}

export async function addPlan(_prev: unknown, form: FormData) {
  return run(async () => {
    const client_name = str(form.get("client_name"), 200);
    if (!client_name) throw new Error("Whose plan is this?");
    const starts_on = str(form.get("starts_on"), 10);
    if (!starts_on) throw new Error("When does billing start?");
    const monthly_cents = centsFrom(form.get("monthly"));
    const ends_on = str(form.get("ends_on"), 10);
    const note = str(form.get("note"), 500);
    await addRevenuePlan({ client_name, monthly_cents, starts_on, ends_on, note });
    revalidatePath("/d48/revenue");
  });
}

export async function removeEntry(id: string) {
  return run(async () => {
    await deleteRevenueEntry(id);
    revalidatePath("/d48/revenue");
  });
}

export async function removePlan(id: string) {
  return run(async () => {
    await deleteRevenuePlan(id);
    revalidatePath("/d48/revenue");
  });
}
