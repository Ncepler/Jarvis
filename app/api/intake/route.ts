import { NextResponse } from "next/server";

// Talks to Supabase's REST + Storage APIs directly with fetch, same pattern
// as /api/lead — no client lib, service role key never leaves the server
// (CLAUDE.md §14). Handles both the DB write and the file uploads for the
// /start intake form (lib/intake.ts defines the shared shape).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const HEX_RE = /^#(?:[0-9a-f]{3}){1,2}$/i;

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function slugifyBusiness(name: string) {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "business";
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 200) || "file";
}

function rest(path: string, init: RequestInit & { prefer?: string }) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: init.method,
    body: init.body,
    headers: {
      apikey: SERVICE_KEY as string,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    cache: "no-store",
  });
}

// Uploads to Supabase Storage's raw REST endpoint (POST .../storage/v1/object/<bucket>/<path>)
// and returns the public URL. Both buckets need `public: true` set in
// Supabase (see the build report) so that URL resolves without a signed token.
async function uploadFile(bucket: string, path: string, file: File) {
  const buf = await file.arrayBuffer();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY as string,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: buf,
    },
  );
  if (!res.ok) {
    throw new Error(`upload failed: ${bucket}/${path} (${res.status})`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json(
      { error: "The form isn't wired up on this deploy." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const businessName = clip(raw.businessName, 200);
  const yourName = clip(raw.yourName, 200);
  const businessEmail = clip(raw.businessEmail, 320);
  const phone = clip(raw.phone, 50);
  const address = clip(raw.address, 300);
  const paletteChoice = clip(raw.paletteChoice, 20);
  const mainColor = clip(raw.mainColor, 10);
  const accentColor = clip(raw.accentColor, 10);
  const hasLogo = clip(raw.hasLogo, 10);
  const template = clip(raw.template, 100);
  const services = clip(raw.services, 5000);
  const instagram = clip(raw.instagram, 300);
  const facebook = clip(raw.facebook, 300);
  const googleBusiness = clip(raw.googleBusiness, 300);
  const brainDump = clip(raw.brainDump, 5000);

  if (!businessName || !yourName || !isValidEmail(businessEmail) || !address) {
    return NextResponse.json(
      {
        error:
          "We need the business name, your name, a working business email, and an address (or “not local”).",
      },
      { status: 400 },
    );
  }
  if (
    paletteChoice === "own" &&
    !(HEX_RE.test(mainColor) && HEX_RE.test(accentColor))
  ) {
    return NextResponse.json(
      { error: "Those color codes don't look right." },
      { status: 400 },
    );
  }
  if (!template || !services) {
    return NextResponse.json(
      { error: "We need the template and a list of your services." },
      { status: 400 },
    );
  }

  // hours — pass through if it looks like the right shape (array of day
  // objects), otherwise just drop it rather than fail the whole submission
  const hours = Array.isArray(raw.hours) ? raw.hours.slice(0, 14) : null;

  const prefix = `${slugifyBusiness(businessName)}-${Date.now()}`;

  let logoUrl: string | null = null;
  const logo = form.get("logo");
  if (logo instanceof File && logo.size > 0) {
    try {
      logoUrl = await uploadFile(
        "intake-logos",
        `${prefix}/${sanitizeFilename(logo.name)}`,
        logo,
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "The logo upload failed. Try again, or skip it for now and email it to us instead.",
        },
        { status: 502 },
      );
    }
  }

  const photoUrls: { name: string; url: string }[] = [];
  const photoFiles = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of photoFiles.slice(0, 30)) {
    try {
      const url = await uploadFile(
        "intake-photos",
        `${prefix}/${sanitizeFilename(file.name)}`,
        file,
      );
      photoUrls.push({ name: file.name, url });
    } catch {
      // one bad photo upload shouldn't sink the whole submission
    }
  }

  const res = await rest("intake_submissions?select=id", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      business_name: businessName,
      your_name: yourName,
      business_email: businessEmail,
      phone: phone || null,
      address,
      palette_choice: paletteChoice || null,
      main_color: paletteChoice === "own" ? mainColor : null,
      accent_color: paletteChoice === "own" ? accentColor : null,
      has_logo: hasLogo || null,
      logo_url: logoUrl,
      template,
      services,
      hours,
      instagram: instagram || null,
      facebook: facebook || null,
      google_business: googleBusiness || null,
      photo_urls: photoUrls.length ? photoUrls : null,
      brain_dump: brainDump || null,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Couldn't save that just now." },
      { status: 502 },
    );
  }
  const [row] = (await res.json()) as { id: string }[];
  return NextResponse.json({ id: row.id });
}
