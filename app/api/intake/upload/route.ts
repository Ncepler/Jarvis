import { NextResponse } from "next/server";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "@/lib/intake";

// One file, uploaded the moment someone picks it on /start rather than at
// submit. Two reasons: a slow phone upload happens while they keep filling the
// form instead of stalling the Submit button, and a failed submit no longer
// costs them the files. The service role key stays server-side (CLAUDE.md §14).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// What each slot is allowed to be. Keeps this public endpoint from being a
// free file host.
const KINDS = {
  mainLogo: { bucket: "intake-logos", type: /^image\//, max: MAX_IMAGE_BYTES },
  profileLogo: { bucket: "intake-logos", type: /^image\//, max: MAX_IMAGE_BYTES },
  profileLogoOriginal: { bucket: "intake-logos", type: /^image\//, max: MAX_IMAGE_BYTES },
  photo: { bucket: "intake-photos", type: /^image\//, max: MAX_IMAGE_BYTES },
  heroVideo: { bucket: "intake-videos", type: /^video\//, max: MAX_VIDEO_BYTES },
} as const;

const PREFIX_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

const safeName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 200) || "file";

const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)}MB`;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) return bad("Uploads aren't wired up on this deploy.", 503);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Bad request.");
  }

  const kind = KINDS[String(form.get("kind")) as keyof typeof KINDS];
  const prefix = String(form.get("prefix") ?? "");
  const file = form.get("file");

  if (!kind) return bad("Bad request.");
  if (!PREFIX_RE.test(prefix)) return bad("Bad request.");
  if (!(file instanceof File) || file.size === 0) return bad("That file came through empty.");
  if (!kind.type.test(file.type)) return bad("That file type isn't one we can use here.");
  if (file.size > kind.max) {
    return bad(`That file is ${mb(file.size)}. The limit is ${mb(kind.max)}, so export it smaller.`);
  }

  const name = safeName(file.name);
  const path = `${prefix}/${name}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${kind.bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: await file.arrayBuffer(),
  });
  if (!res.ok) return bad("That upload didn't go through. Try it again.", 502);

  return NextResponse.json({
    name,
    url: `${SUPABASE_URL}/storage/v1/object/public/${kind.bucket}/${path}`,
  });
}
