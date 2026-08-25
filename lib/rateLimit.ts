// Minimal in-memory rate limit for /updates' lookup and submit actions.
// Module-scoped Map, so it only limits within one running server instance —
// on Vercel that means it isn't a hard global cap across instances, but it's
// enough to stop someone walking the ref-code sequence from a single IP,
// which is the actual threat here (codes are sequential after the first —
// see lib/updates.ts).
import "server-only";

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 6;

const hits = new Map<string, { count: number; resetAt: number }>();

// True once `key` has been used more than MAX_ATTEMPTS times in the current
// window. Called once per attempt; the caller should stop before doing any
// real work when this returns true.
export function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}
