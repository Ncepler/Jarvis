import { NextResponse } from "next/server";

// Talks to Supabase's PostgREST API directly with fetch — no client lib to
// install. The service role key bypasses the table's deny-all RLS and must
// never leave the server (CLAUDE.md §6.7 / §14).
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const VALID_PATHS = new Set(["style", "custom", "flagship"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

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

async function parse(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
}

// Step 1: the lead itself. A row written here is complete on its own —
// step 2 only ever adds to it.
export async function POST(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json(
      { error: "The form isn't wired up on this deploy." },
      { status: 503 },
    );
  }
  const body = await parse(req);
  if (!body) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // honeypot — bots fill it; answer like a success and write nothing
  if (clip(body.website, 50)) {
    return NextResponse.json({ id: null });
  }

  const name = clip(body.name, 200);
  const business = clip(body.business, 200);
  const email = clip(body.email, 320);
  const path = clip(body.path, 20);
  const styleSlug = clip(body.style_slug, 100);

  if (!name || !business || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "We need your name, the business name, and a working email." },
      { status: 400 },
    );
  }

  const res = await rest("leads?select=id", {
    method: "POST",
    prefer: "return=representation",
    body: JSON.stringify({
      name,
      business,
      email,
      path: VALID_PATHS.has(path) ? path : null,
      style_slug: styleSlug || null,
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

// Step 2: optional extras added onto the row POST created. Only these three
// columns (plus the completed flag) can be touched through this route.
export async function PATCH(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json(
      { error: "The form isn't wired up on this deploy." },
      { status: 503 },
    );
  }
  const body = await parse(req);
  const id = clip(body?.id, 40);
  if (!body || !UUID.test(id)) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const res = await rest(`leads?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      colors: clip(body.colors, 500) || null,
      links: clip(body.links, 1000) || null,
      details: clip(body.details, 5000) || null,
      step2_completed: true,
    }),
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Couldn't save that just now." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
