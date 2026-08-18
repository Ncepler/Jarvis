import { NextResponse } from "next/server";

export const runtime = "edge";

// Fired (fire-and-forget, from the client) after /api/intake has already
// saved the row. Re-fetches the row by id — rather than trusting whatever
// the client posts — and emails Noah a plain-text summary via Resend. Never
// blocks or fails the user's submission: the row is already safe in
// Supabase by the time this runs, so any error here just gets swallowed.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = Record<string, unknown>;

function line(label: string, value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return `${label}: ${value}`;
}

function formatHours(hours: unknown) {
  if (!Array.isArray(hours)) return null;
  return hours
    .map((h) => {
      if (!h || typeof h !== "object") return null;
      const day = (h as Row).day;
      const closed = (h as Row).closed;
      if (closed) return `  ${day}: closed`;
      return `  ${day}: ${(h as Row).open}–${(h as Row).close}`;
    })
    .filter(Boolean)
    .join("\n");
}

function formatPhotos(photos: unknown) {
  if (!Array.isArray(photos) || photos.length === 0) return null;
  return photos
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      return `  ${(p as Row).name}: ${(p as Row).url}`;
    })
    .filter(Boolean)
    .join("\n");
}

// A precise deep link to one row isn't reliably constructible from the URL
// alone — this links to the project's table editor and the row id is in
// the body text to search for. (Flagged as a guess in the build report.)
function dashboardLink() {
  if (!SUPABASE_URL) return null;
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  return `https://supabase.com/dashboard/project/${ref}/editor`;
}

export async function POST(req: Request) {
  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Everything past this point is best-effort — the submission is already
  // saved, so any failure here just gets swallowed and we still say ok.
  try {
    if (!SUPABASE_URL || !SERVICE_KEY || !RESEND_API_KEY || !NOTIFY_EMAIL) {
      return NextResponse.json({ ok: true });
    }

    const rowRes = await fetch(
      `${SUPABASE_URL}/rest/v1/intake_submissions?id=eq.${id}&select=*`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        cache: "no-store",
      },
    );
    if (!rowRes.ok) return NextResponse.json({ ok: true });
    const [row] = (await rowRes.json()) as Row[];
    if (!row) return NextResponse.json({ ok: true });

    const link = dashboardLink();

    const text = [
      `New intake: ${row.business_name}`,
      "",
      "— Contact —",
      line("Business", row.business_name),
      line("Your name", row.your_name),
      line("Business email", row.business_email),
      line("Phone", row.phone),
      line("Address", row.address),
      "",
      "— Brand —",
      line("Palette", row.palette_choice),
      line("Main color", row.main_color),
      line("Accent color", row.accent_color),
      line("Has logo", row.has_logo),
      line("Logo", row.logo_url),
      "",
      "— Content —",
      line("Template", row.template),
      line("Services", row.services),
      formatHours(row.hours) ? `Hours:\n${formatHours(row.hours)}` : null,
      line("Instagram", row.instagram),
      line("Facebook", row.facebook),
      line("Google Business", row.google_business),
      formatPhotos(row.photo_urls)
        ? `Photos:\n${formatPhotos(row.photo_urls)}`
        : null,
      "",
      "— Anything else —",
      row.brain_dump || "(nothing)",
      "",
      link
        ? `Row (id ${id}) — open the table and search that id:\n${link}`
        : `Row id: ${id}`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "intake@vilas.studio",
        to: NOTIFY_EMAIL,
        subject: `New Vilas intake: ${row.business_name}`,
        text,
      }),
    });
  } catch {
    // Resend/network hiccup — the row's already saved, nothing to do here
  }

  return NextResponse.json({ ok: true });
}
