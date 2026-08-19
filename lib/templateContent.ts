// Reads a demo's own source and hands back the content that's actually on the
// page today, so the /start form can show a client the real thing and let them
// edit it, instead of asking them to picture a section they've never seen.
//
// Dynamic on purpose: nothing here restates what a template says. lib/
// templates.ts names the const (`list.from`), components/demos/*.tsx is the
// truth, and editing a demo updates the intake form with no second edit.
import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { questionsFor, templateByKey, type ListSpec } from "./templates";
import { readConstArray, readMarqueeTerms, type Literal } from "./parseLiteral";

// question key → one flat row per item, holding only the fields the form shows
export type TemplateContent = Record<string, Record<string, string>[]>;

const text = (v: Literal | undefined): string =>
  Array.isArray(v)
    ? v.map(text).filter(Boolean).join(" · ")
    : typeof v === "string"
      ? v
      : typeof v === "number" || typeof v === "boolean"
        ? String(v)
        : "";

const toRows = (raw: Literal[], list: ListSpec) =>
  raw.map((item) => {
    const obj = item && typeof item === "object" && !Array.isArray(item) ? item : null;
    return Object.fromEntries(
      list.fields.map((f, i) => [
        f.key,
        // A plain string array (the scrolling words, the work filters) has no
        // keys to read, so the whole item is the first field.
        obj ? text(obj[f.key]) : i === 0 ? text(item) : "",
      ]),
    );
  });

export async function loadTemplateContent(key: string): Promise<TemplateContent> {
  const tpl = templateByKey(key);
  if (!tpl) return {};

  let src: string;
  try {
    src = await readFile(path.join(process.cwd(), tpl.file), "utf8");
  } catch {
    // Source not traced into the bundle (see outputFileTracingIncludes in
    // next.config.ts). The form falls back to empty rows rather than breaking.
    return {};
  }

  const out: TemplateContent = {};
  for (const q of questionsFor(key)) {
    if (!q.list) continue;
    const raw =
      q.list.from === "@marquee" ? readMarqueeTerms(src) : readConstArray(src, q.list.from);
    if (raw) out[q.key] = toRows(raw, q.list);
  }
  return out;
}
