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
import { depsFor, templateByKey } from "@/lib/templates";

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
// whatever is live in the repo right now. Includes every shared file the demo
// needs to compile/render on its own (nav, footer, the Vilas credit line,
// premium hero media, hero-video concepts, and — for the magician — its
// cursor effect), not just the one entry file, so nothing needs a second
// copy. One clipboard-writeable string, each file marked off by a path
// header, rather than restructuring the button into a multi-file export.
export async function copyTemplateCode(templateKey: string) {
  return run(async () => {
    const tpl = templateByKey(templateKey);
    if (!tpl) throw new Error(`No template registered under "${templateKey}".`);
    const files = [tpl.file, ...depsFor(templateKey)];
    const sections = await Promise.all(
      files.map(async (file) => {
        const src = await readFile(path.join(process.cwd(), file), "utf8");
        return `// ---- FILE: ${file} ----\n\n${src}`;
      }),
    );
    const stamp = new Date().toISOString();
    return `// Original template: ${tpl.name} (${tpl.file}) — copied from live repo at ${stamp}\n// Includes every shared file this style needs to render on its own.\n\n${sections.join("\n\n")}`;
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

// Client email copy buttons (Detail's "Copy build prompt" row). Every
// template below is verbatim except {{firstName}}/{{businessName}}, which
// get filled from the submission — first word of the contact name, and the
// business name as given. {{previewLink}}/{{amount}}/{{paymentLink}}/{{domain}}
// stay as curly-brace placeholders for Noah to fill by hand.
const EMAIL_TEMPLATES = {
  firstPayment: {
    subject: "Got your first payment",
    body: (first: string, business: string) =>
      `Hi ${first},\n\nThank you for the first half. We're starting on ${business} now.\n\nWe'll email you when the first draft is ready. Then you can tell us what you'd change.\n\nVilas Studio`,
  },
  firstDraft: {
    subject: "Your first draft is ready",
    body: (first: string, business: string) =>
      `Hi ${first},\n\nThe first draft of ${business} is ready: {{previewLink}}\n\nLook through it on your phone and on a computer. Then send us everything you'd change in one reply, and we'll take care of it.\n\nVilas Studio`,
  },
  changesReceived: {
    subject: "Got your changes",
    body: (first: string) =>
      `Hi ${first},\n\nGot it. We're working through your changes and we'll send the updated version when it's ready.\n\nIf you think of anything else, send it before then so it goes in the same round.\n\nVilas Studio`,
  },
  finalPayment: {
    subject: "Ready to go live",
    body: (first: string) =>
      `Hi ${first},\n\nGlad you're happy with it. The second half is {{amount}}: {{paymentLink}}\n\nOnce that's in, we'll set up {{domain}} and take the site live. Your monthly plan starts once it's live.\n\nVilas Studio`,
  },
} as const;

async function clientEmail(id: string, key: keyof typeof EMAIL_TEMPLATES) {
  return run(async () => {
    const row = await getSubmission(id);
    if (!row) throw new Error("That submission isn't there any more.");
    const first = (row.your_name ?? "").trim().split(/\s+/)[0] || "{{firstName}}";
    const business = (row.business_name ?? "").trim() || "{{businessName}}";
    const tpl = EMAIL_TEMPLATES[key];
    return `Subject: ${tpl.subject}\n\n${tpl.body(first, business)}`;
  });
}

export async function copyFirstPaymentEmail(id: string) {
  return clientEmail(id, "firstPayment");
}
export async function copyFirstDraftEmail(id: string) {
  return clientEmail(id, "firstDraft");
}
export async function copyChangesReceivedEmail(id: string) {
  return clientEmail(id, "changesReceived");
}
export async function copyFinalPaymentEmail(id: string) {
  return clientEmail(id, "finalPayment");
}
