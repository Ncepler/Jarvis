import { NextResponse } from "next/server";
import {
  MAX_VIDEO_BYTES,
  isValidDomain,
  isValidEmail,
  scrubDomain,
  HEX_RE,
} from "@/lib/intake";
import { templateByKey } from "@/lib/templates";

// Talks to Supabase's REST + Storage APIs with plain fetch, same pattern as
// /api/lead: no client lib, and the service role key never leaves the server
// (CLAUDE.md §14). Handles the DB write and every upload for /start.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "business";

const safeName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 200) || "file";

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

async function uploadFile(bucket: string, path: string, file: File) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY as string,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });
  if (!res.ok) throw new Error(`upload failed: ${bucket}/${path} (${res.status})`);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return bad("The form isn't wired up on this deploy.", 503);
  }

  let form: FormData;
  let raw: Record<string, unknown>;
  try {
    form = await req.formData();
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return bad("Bad request.");
  }

  const f = (key: string, max: number) => clip(raw[key], max);

  const businessName = f("businessName", 200);
  const businessType = f("businessType", 200);
  const yourName = f("yourName", 200);
  const businessEmail = f("businessEmail", 320);
  const address = f("address", 300);
  const desiredDomain = scrubDomain(f("desiredDomain", 253));
  const usingTemplate = f("usingTemplate", 10);
  const templateChoice = f("templateChoice", 100);
  const paletteChoice = f("paletteChoice", 20);
  const mainColor = f("mainColor", 10);
  const accentColor = f("accentColor", 10);
  const services = f("services", 5000);

  const isCustomBuild = usingTemplate === "no";

  // Mirrors lib/intake.ts's validateStep. The client already checked all of
  // this; re-checking here is what actually protects the table.
  if (!businessName || !businessType || !yourName || !address) {
    return bad("We need the business name, what kind of business it is, your name, and where you work out of.");
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

  const prefix = `${slugify(businessName)}-${Date.now()}`;

  // One upload slot. A failed logo or video is worth telling someone about;
  // a failed photo out of thirty isn't worth sinking the submission over.
  const put = async (key: string, bucket: string, as?: string) => {
    const file = form.get(key);
    if (!(file instanceof File) || file.size === 0) return null;
    if (key === "heroVideo" && file.size > MAX_VIDEO_BYTES) {
      throw new Error("video-too-big");
    }
    return uploadFile(bucket, `${prefix}/${as ?? safeName(file.name)}`, file);
  };

  let mainLogoUrl: string | null = null;
  let profileLogoUrl: string | null = null;
  let profileLogoOriginalUrl: string | null = null;
  let heroVideoUrl: string | null = null;
  try {
    mainLogoUrl = await put("mainLogo", "intake-logos");
    profileLogoUrl = await put("profileLogo", "intake-logos");
    profileLogoOriginalUrl = await put("profileLogoOriginal", "intake-logos", "profile-original");
    heroVideoUrl = await put("heroVideo", "intake-videos");
  } catch (e) {
    return e instanceof Error && e.message === "video-too-big"
      ? bad("That video is over 25MB. Trim it or export it smaller.")
      : bad("An upload failed. Try again, or email us the files instead.", 502);
  }

  const photoUrls: { name: string; url: string }[] = [];
  const photos = form.getAll("photos").filter((p): p is File => p instanceof File && p.size > 0);
  for (const file of photos.slice(0, 30)) {
    try {
      photoUrls.push({
        name: file.name,
        url: await uploadFile("intake-photos", `${prefix}/${safeName(file.name)}`, file),
      });
    } catch {
      // one bad photo shouldn't sink the whole submission
    }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/intake_submissions?select=id`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    cache: "no-store",
    body: JSON.stringify({
      business_name: businessName,
      business_type: businessType,
      your_name: yourName,
      business_email: businessEmail,
      phone: f("phone", 50) || null,
      address,
      desired_domain: desiredDomain,
      template_choice: isCustomBuild ? null : templateChoice,
      is_custom_build: isCustomBuild,
      // `template` predates template_choice and is NOT NULL on the table,
      // so it keeps getting the same value.
      template: isCustomBuild ? "custom" : templateChoice,
      palette_choice: paletteChoice || "template",
      main_color: paletteChoice === "own" ? mainColor : null,
      accent_color: paletteChoice === "own" ? accentColor : null,
      has_logo: f("hasLogo", 10) || "no",
      main_logo_url: mainLogoUrl,
      profile_logo_url: profileLogoUrl,
      profile_logo_original_url: profileLogoOriginalUrl,
      hero_video_url: heroVideoUrl,
      services,
      hours,
      instagram: f("instagram", 300) || null,
      facebook: f("facebook", 300) || null,
      google_business: f("googleBusiness", 300) || null,
      photo_urls: photoUrls.length ? photoUrls : null,
      template_customizations: custom,
      copy_changes: f("copyChanges", 5000) || null,
      brain_dump: f("brainDump", 5000) || null,
      status: "new",
    }),
  });

  if (!res.ok) return bad("Couldn't save that just now.", 502);
  const [row] = (await res.json()) as { id: string }[];
  return NextResponse.json({ id: row.id });
}
