"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import {
  deleteSubmission,
  getSubmission,
  isAuthed,
  signIn,
  signOut,
  updateRequestStatus,
  updateStatus,
} from "@/lib/d48";
import { generatePrompt } from "@/lib/generatePrompt";
import { templateByKey } from "@/lib/templates";

// Actions report failure as a value, never by throwing: Next redacts a thrown
// server-action error in production, and "an error occurred" is exactly the
// message §8 says not to ship.
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): Result<never> => ({ ok: false, error });

// Every action re-checks the cookie. The page already gates rendering, but
// an action is a public endpoint, so it can't rely on that.
async function run<T>(work: () => Promise<T>): Promise<Result<T>> {
  if (!(await isAuthed())) return fail("You're signed out. Reload the page and sign back in.");
  try {
    return { ok: true, value: await work() };
  } catch (e) {
    return fail(e instanceof Error ? e.message : "That didn't work. Try it again.");
  }
}

export async function login(_prev: string | null, form: FormData) {
  const password = String(form.get("password") ?? "");
  if (!process.env.DASHBOARD_PASSWORD) {
    return "No password is set on this deploy.";
  }
  if (!(await signIn(password))) return "Wrong password.";
  revalidatePath("/d48");
  return null;
}

export async function logout() {
  await signOut();
  revalidatePath("/d48");
}

export async function setStatus(id: string, status: string) {
  return run(async () => {
    await updateStatus(id, status);
    revalidatePath("/d48");
  });
}

// Soft delete: the row drops out of every view but the Archived one.
export async function archive(id: string) {
  return setStatus(id, "archived");
}

// Hard delete, offered on archived rows only. Takes the uploaded files with
// it, and leaves the row alone if they won't go.
export async function destroy(id: string) {
  return run(async () => {
    await deleteSubmission(id);
    revalidatePath("/d48");
  });
}

// Reads the template's source off disk on every call, so what gets copied is
// whatever is live in the repo right now.
export async function copyTemplateCode(templateKey: string) {
  return run(async () => {
    const tpl = templateByKey(templateKey);
    if (!tpl) throw new Error(`No template registered under "${templateKey}".`);
    const src = await readFile(path.join(process.cwd(), tpl.file), "utf8");
    const stamp = new Date().toISOString();
    return `// Original template: ${tpl.name} (${tpl.file}) — copied from live repo at ${stamp}\n\n${src}`;
  });
}

// The only status change update_requests needs — new to done. If a richer
// workflow shows up later, follow updateStatus's select-dropdown pattern
// instead of adding more one-off actions here.
export async function markRequestHandled(id: string) {
  return run(async () => {
    await updateRequestStatus(id, "done");
    revalidatePath("/d48");
  });
}

export async function copyBuildPrompt(id: string) {
  return run(async () => {
    const row = await getSubmission(id);
    if (!row) throw new Error("That submission isn't there any more.");
    return generatePrompt(row);
  });
}
