import { NextResponse } from "next/server";
import {
  isValidDomain,
  isValidEmail,
  scrubDomain,
  HEX_RE,
  type Upload,
} from "@/lib/intake";
import { questionsFor, templateByKey } from "@/lib/templates";

// Talks to Supabase's REST API directly with fetch — no client lib, and the
// service role key never leaves the server (CLAUDE.md §14). Files are
// already in Storage by the time this runs — /api/intake/upload puts them
// there as they're picked — so this handler only records where they landed.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Only a URL we uploaded ourselves goes in the row, so a crafted payload can't
// point the dashboard at someone else's host.
const ownUrl = (v: unknown): string | null => {
  const url = typeof v === "string" ? v.trim() : "";
  return url.startsWith(`${SUPABASE_URL}/storage/v1/object/public/intake-`) ? url : null;
};

const asUpload = (v: unknown): string | null =>
  v && typeof v === "object" ? ownUrl((v as Upload).url) : null;

const asPhotos = (v: unknown): Upload[] =>
  (Array.isArray(v) ? v : [])
    .slice(0, 40)
    .map((p) => ({ name: clip((p as Upload)?.name, 200), url: asUpload(p) ?? "" }))
    .filter((p) => p.url);

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return bad("The form isn't wired up on this deploy.", 503);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Bad request.");
  }

  const f = (key: string, max: number) => clip(raw[key], max);

  const personalEmail = f("personalEmail", 320);
  const businessName = f("businessName", 200);
  const businessType = f("businessType", 200);
  const yourName = f("yourName", 200);
  const businessEmail = f("businessEmail", 320);
  const address = f("address", 300);
  const desiredDomain = scrubDomain(f("desiredDomain", 253));
  const tier = f("tier", 10);
  const usingTemplate = f("usingTemplate", 10);
  const templateChoice = f("templateChoice", 100);
  const paletteChoice = f("paletteChoice", 20);
  const mainColor = f("mainColor", 10);
  const accentColor = f("accentColor", 10);
  const services = f("services", 5000);

  const isCustomBuild = usingTemplate === "no";

  // Mirrors lib/intake.ts's validateStep. The client already checked all of
  // this; re-checking here is what actually protects the table.
  if (!["basic", "premium", "custom"].includes(tier)) {
    return bad("Pick what matters more for your site before continuing.");
  }
  // usingTemplate is derived from tier client-side, but re-derived here too
  // rather than trusted, since it's what the rest of this handler branches
  // on (§ style vs. custom fields, below).
  if ((tier === "custom") !== isCustomBuild) {
    return bad("That choice didn't come through right. Try again.");
  }
  if (!isValidEmail(personalEmail)) {
    return bad("That personal email address doesn't look right.");
  }
  if (!businessName || !yourName || !address) {
    return bad("We need the business name, your name, and where you work out of.");
  }
  // On a template build the template already says what kind of business this
  // is, so the field is optional there and required on a custom build.
  if (isCustomBuild && !businessType) {
    return bad("Tell us what kind of business this is.");
  }
  if (!isValidEmail(businessEmail)) return bad("That email address doesn't look right.");
  if (!desiredDomain || !isValidDomain(desiredDomain)) {
    return bad("That domain doesn't look right. Something like yourshop.com.");
  }
  if (!isCustomBuild && !templateByKey(templateChoice)) {
    return bad("Pick a template, or switch to a custom build.");
  }
  if (paletteChoice === "own" && !(HEX_RE.test(mainColor) && HEX_RE.test(accentColor))) {
    return bad("Those color codes don't look right.");
  }
  if (!services) return bad("We need at least a rough list of what you do.");

  const hours = Array.isArray(raw.hours) ? raw.hours.slice(0, 14) : null;
  const custom =
    raw.templateCustomizations && typeof raw.templateCustomizations === "object"
      ? (raw.templateCustomizations as Record<string, unknown>)
      : null;

  // Only keys this template actually asks about, so the column can't be used
  // as free storage.
  const known = new Set(questionsFor(templateChoice).map((q) => q.key));
  const dropped = (Array.isArray(raw.droppedSections) ? raw.droppedSections : [])
    .filter((k): k is string => typeof k === "string" && known.has(k))
    .slice(0, 40);

  // A section that's going doesn't also get content. The form already strips
  // these, but a stale draft or a retry shouldn't be able to hand the build
  // prompt an answer and a "remove it" for the same section.
  if (custom) for (const key of dropped) delete custom[key];

  const uploads = (raw.uploads ?? {}) as Record<string, unknown>;
  const photoUrls = asPhotos(uploads.photos);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/intake_submissions?select=id,ref_code`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    cache: "no-store",
    body: JSON.stringify({
      personal_email: personalEmail,
      business_name: businessName,
      business_type: businessType || null,
      your_name: yourName,
      business_email: businessEmail,
      phone: f("phone", 50) || null,
      address,
      desired_domain: desiredDomain,
      tier,
      template_choice: isCustomBuild ? null : templateChoice,
      is_custom_build: isCustomBuild,
      palette_choice: paletteChoice || "template",
      main_color: paletteChoice === "own" ? mainColor : null,
      accent_color: paletteChoice === "own" ? accentColor : null,
      has_logo: f("hasLogo", 10) || "no",
      main_logo_url: asUpload(uploads.mainLogo),
      profile_logo_url: asUpload(uploads.profileLogo),
      profile_logo_original_url: asUpload(uploads.profileLogoOriginal),
      hero_video_url: asUpload(uploads.heroVideo),
      services,
      hours,
      instagram: f("instagram", 300) || null,
      facebook: f("facebook", 300) || null,
      google_business: f("googleBusiness", 300) || null,
      photo_urls: photoUrls.length ? photoUrls : null,
      template_customizations: custom,
      copy_changes: f("copyChanges", 5000) || null,
      dropped_sections: dropped.length ? dropped : null,
      brain_dump: f("brainDump", 5000) || null,
      status: "new",
    }),
  });

  if (!res.ok) return bad("Couldn't save that just now.", 502);
  const [row] = (await res.json()) as { id: string; ref_code: string | null }[];

  // Best effort, same as /api/notify-intake: the row is already saved, so a
  // mail outage never blocks the person who just submitted. Reuses the
  // Resend path notify-intake already established rather than building a
  // second one.
  if (row.ref_code && RESEND_API_KEY) {
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "hello@vilas.studio",
        to: personalEmail,
        subject: `Your reference code: ${row.ref_code}`,
        text: [
          `Got it — we're on it.`,
          "",
          `Your reference code is ${row.ref_code}.`,
          "",
          "Write it down somewhere you'll actually find it again. You'll need this code and this email address any time you want to send us changes to your site, at /updates.",
        ].join("\n"),
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ id: row.id, refCode: row.ref_code });
}
