// Server-only read for the "Out in the world" gallery (components/sections/
// ClientSites.tsx). Same pattern as lib/d48.ts: a thin fetch against
// Supabase's REST API with the service role key, which bypasses the
// deny-by-default RLS on client_sites (0009_create_client_sites.sql) same as
// every other table in this app. Unlike /d48 (always fresh, behind a
// password) this backs the public homepage, so it's revalidated on a timer
// rather than fetched on every request — Noah adding a row by hand shows up
// within a few minutes, and the homepage keeps its performance budget
// (CLAUDE.md §9) instead of going fully dynamic.
import "server-only";

import { capturedImageUrl } from "./screenshot";

// What the client component actually needs to render a tile. `image` is
// resolved server-side (below) rather than in the component: a manual
// `screenshot_url` always wins over a generated capture (round 2, job 4),
// and building that URL needs lib/screenshot.ts, which is itself
// server-only — computing it here keeps that boundary out of the "use
// client" component, which just reads the plain string it's handed. `null`
// means genuinely no image; ClientSites.tsx hides that tile rather than
// rendering an empty one.
export type ClientSite = {
  id: string;
  name: string;
  url: string;
  build_type: "custom" | "style";
  style_name: string | null;
  description: string | null;
  image: { url: string; manual: boolean } | null;
};

type Row = {
  id: string;
  name: string;
  url: string;
  build_type: "custom" | "style";
  style_name: string | null;
  description: string | null;
  screenshot_url: string | null;
  captured_at: string | null;
};

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function toClientSite(row: Row): ClientSite {
  const { screenshot_url, captured_at, ...rest } = row;
  const image = screenshot_url
    ? { url: screenshot_url, manual: true }
    : (() => {
        const generated = capturedImageUrl(URL, row.id, captured_at);
        return generated ? { url: generated, manual: false } : null;
      })();
  return { ...rest, image };
}

export async function listClientSites(): Promise<ClientSite[]> {
  if (!URL || !KEY) return [];
  try {
    const res = await fetch(
      `${URL}/rest/v1/client_sites?select=id,name,url,build_type,style_name,description,screenshot_url,captured_at` +
        `&published=eq.true&order=sort_order.asc,created_at.asc`,
      {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Row[];
    return rows.map(toClientSite);
  } catch {
    // Supabase unreachable — the section just doesn't render (see
    // ClientSites.tsx), same "shippable without the backend" rule as /start.
    return [];
  }
}
