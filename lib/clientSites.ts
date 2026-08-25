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

export type ClientSite = {
  id: string;
  name: string;
  url: string;
  build_type: "custom" | "style";
  style_name: string | null;
  description: string | null;
  screenshot_url: string | null;
};

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function listClientSites(): Promise<ClientSite[]> {
  if (!URL || !KEY) return [];
  try {
    const res = await fetch(
      `${URL}/rest/v1/client_sites?select=id,name,url,build_type,style_name,description,screenshot_url` +
        `&published=eq.true&order=sort_order.asc,created_at.asc`,
      {
        headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return [];
    return (await res.json()) as ClientSite[];
  } catch {
    // Supabase unreachable — the section just doesn't render (see
    // ClientSites.tsx), same "shippable without the backend" rule as /start.
    return [];
  }
}
