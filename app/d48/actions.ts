"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { getSubmission, isAuthed, signIn, signOut, updateStatus } from "@/lib/d48";
import { generatePrompt } from "@/lib/generatePrompt";
import { templateByKey } from "@/lib/templates";

// Every action re-checks the cookie. The page already gates rendering, but
// an action is a public endpoint, so it can't rely on that.
async function gate() {
  if (!(await isAuthed())) throw new Error("Not signed in.");
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
  await gate();
  await updateStatus(id, status);
  revalidatePath("/d48");
}

// Reads the template's source off disk on every call, so what gets copied is
// whatever is live in the repo right now.
export async function copyTemplateCode(templateKey: string) {
  await gate();
  const tpl = templateByKey(templateKey);
  if (!tpl) throw new Error(`No template registered under "${templateKey}".`);
  const src = await readFile(path.join(process.cwd(), tpl.file), "utf8");
  const stamp = new Date().toISOString();
  return `// Original template: ${tpl.name} (${tpl.file}) — copied from live repo at ${stamp}\n\n${src}`;
}

export async function copyBuildPrompt(id: string) {
  await gate();
  const row = await getSubmission(id);
  if (!row) throw new Error("That submission isn't there any more.");
  return generatePrompt(row);
}
