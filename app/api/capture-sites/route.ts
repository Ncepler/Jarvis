import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { CAPTURE_BUCKET, captureDateKey } from "@/lib/screenshot";

// Server-side screenshot capture for "Out in the world" (round 2, job 4).
// Never runs in a browser and never runs on a page request — it's triggered
// on a schedule (see the `crons` entry in vercel.json) so the homepage stays
// static and fast. A manual `screenshot_url` on a client_sites row always
// wins over whatever this writes (CLAUDE.md-adjacent ticket rule), so this
// skips any site that already has one — capturing it would be wasted work.
//
// UNVERIFIED ON VERCEL: puppeteer-core + @sparticuz/chromium is the standard
// supported way to run headless Chrome in a Vercel serverless function, and
// this is wired to that contract, but nothing in this dev session can
// actually deploy and trigger it. Run it once after deploying and check the
// response body (and each row's `capture_error` column) before trusting it.
// If it doesn't run within the plan's memory/duration limits, nothing else
// breaks — `screenshot_url` (set by hand) and the "hide the tile" fallback
// in ClientSites.tsx both work independently of this route.
export const runtime = "nodejs";
// Only takes effect on a plan that allows a longer function duration
// (Hobby is capped at 60s regardless of this value) — screenshotting several
// sites in one run can take a while if a site is slow to load.
export const maxDuration = 60;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Site = { id: string; url: string; screenshot_url: string | null };

async function fetchTargets(): Promise<Site[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/client_sites?select=id,url,screenshot_url&published=eq.true`,
    {
      headers: { apikey: SERVICE_KEY!, Authorization: `Bearer ${SERVICE_KEY}` },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Couldn't list client_sites: ${res.status}`);
  const rows = (await res.json()) as Site[];
  // Manual override wins — see the file comment.
  return rows.filter((r) => r.url && !r.screenshot_url);
}

async function uploadPng(path: string, bytes: Buffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${CAPTURE_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "image/png",
      "x-upsert": "true",
    },
    // Copied into a plain ArrayBuffer rather than passed as a Buffer/
    // Uint8Array directly — this TS lib version's BlobPart/BodyInit typing
    // wants an ArrayBuffer specifically, not the wider ArrayBufferLike a
    // Node Buffer's `.buffer` carries (which admits SharedArrayBuffer).
    body: new Uint8Array(bytes).buffer as ArrayBuffer,
  });
  if (!res.ok) throw new Error(`Storage upload failed (${res.status}): ${await res.text()}`);
}

async function patchSite(id: string, patch: Record<string, unknown>) {
  await fetch(`${SUPABASE_URL}/rest/v1/client_sites?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(patch),
  });
}

// Vercel signs its own cron requests with `Authorization: Bearer
// $CRON_SECRET` automatically once CRON_SECRET is set as an env var (Vercel
// docs, Cron Jobs → Securing cron jobs) — this just checks that header, so
// the route can't be used to spend someone else's compute by hitting the URL
// directly. If CRON_SECRET isn't set, the check is skipped (local/dev).
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let targets: Site[];
  try {
    targets = await fetchTargets();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
  if (targets.length === 0) return NextResponse.json({ captured: 0, total: 0 });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1440, height: 900 },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Chromium failed to launch at all — likely the memory/bundle-limit
    // case the ticket calls out. Report it plainly rather than pretending
    // any captures happened.
    return NextResponse.json(
      { error: `Chromium failed to launch: ${message}`, captured: 0, total: targets.length },
      { status: 500 },
    );
  }

  let captured = 0;
  const errors: Record<string, string> = {};
  const now = new Date().toISOString();
  const dateKey = captureDateKey(now);

  try {
    for (const site of targets) {
      const page = await browser.newPage();
      try {
        await page.goto(site.url, { waitUntil: "networkidle2", timeout: 20_000 });
        // Viewport screenshot, not full-page — "crop to the hero" per spec.
        const bytes = (await page.screenshot({ type: "png" })) as Buffer;
        await uploadPng(`${site.id}/${dateKey}.png`, bytes);
        await patchSite(site.id, { captured_at: now, capture_error: null });
        captured += 1;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors[site.id] = message;
        await patchSite(site.id, { capture_error: message.slice(0, 500) }).catch(() => {});
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  return NextResponse.json({ captured, total: targets.length, errors });
}
