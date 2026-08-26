// Shared helpers for the "Out in the world" screenshot pipeline (round 2,
// job 4): app/api/capture-sites/route.ts writes captures here, ClientSites.tsx
// (via lib/clientSites.ts) reads the same deterministic URL back out. No
// column stores the image URL itself — it's built from the site's id plus
// the date its capture was taken, so there's nothing to keep in sync besides
// the `captured_at` timestamp.
import "server-only";

export const CAPTURE_BUCKET = "client-site-captures";

// yyyy-mm-dd out of an ISO timestamp. Stable for one capture run (every site
// captured in the same run gets the same key) and stable for one calendar
// day of reads.
export function captureDateKey(iso: string): string {
  return iso.slice(0, 10);
}

// The public URL for a site's generated capture, or null if it's never been
// captured. A manual `screenshot_url` on the row always wins over this —
// callers should check that column first (see lib/clientSites.ts).
export function capturedImageUrl(
  supabaseUrl: string | undefined,
  id: string,
  capturedAt: string | null,
): string | null {
  if (!supabaseUrl || !capturedAt) return null;
  return `${supabaseUrl}/storage/v1/object/public/${CAPTURE_BUCKET}/${id}/${captureDateKey(capturedAt)}.png`;
}
