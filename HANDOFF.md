# HANDOFF — updated 2026-10-06 (chat add-on finished + mobile toggle fix)

## Current state
- **Fixed a real mobile bug in `VilasDemoBar`'s tier toggle**
  (`components/SquishSwitch.jsx`): tapping it on a touch device flipped it
  then immediately flipped back. Cause: `pointerup` set a `skipClick` guard
  (to swallow the browser's trailing synthetic `click` after a tap) and
  reset it on a `setTimeout(…, 0)`. On touch, that synthetic click can land
  a full task later than the timeout, so the timeout cleared the guard
  first, `click()` ran a second `commit()`, and it reverted. Fix: only
  `click()` clears the flag now (no timer); `pointerdown` also clears it
  defensively so a `pointercancel` (which never gets a trailing click)
  can't leave it stuck. Verified with a real Playwright touch `tap()`
  against a built+served page — flips once, holds. `tsc`/`build` clean.
- **Chat assistant add-on (the 3-session brief) is now fully done** —
  sessions 1 and 2 had already landed (different implementation than this
  session's first pass, done by a parallel session; same outcome: inline
  chat under the FAQ on vilas.studio, `/api/chat`, `chat_usage`/
  `chat_site_usage` tables, the `$30/month` pricing line, the `/start`
  checkbox, the admin build-prompt section — all verified present).
  **This session did session 3**: every demo now mounts `ChatAssistant` in
  `floating` mode, wired once in `components/demos/DemoRoute.tsx` (not
  per-demo file) alongside `VilasDemoBar`. Added
  `content/chat/demo-{renovation,landscaping,powerwash,florist,lawncare,
  bakery,barber,autobody,magician}.json`, each `isDemo: true` and filled
  only from copy already in that demo file (business name, services,
  hours, phone, service area, FAQs — nothing invented). `tsc`/`lint`/
  `build` all clean; `.next/static` grepped for `OPENAI` — zero hits.
- Not yet pushed to `main` — stays on this branch until asked. Not yet
  verified live on a real phone (sandbox has no device, see Gotchas).
- Demo header is `relative` (not sticky) in `components/demos/system.tsx`;
  only `VilasDemoBar`'s pill stays pinned on all 8 `DemoHeader` demos
  (Magician has its own chrome). Auto body Premium hero is a
  scroll-scrubbed video (`AutoBodyScrollHero.tsx`) — unverified in a real
  H.264 browser/iOS Safari (sandbox Chromium has no H.264).
- `main` was last fast-forwarded to `e7eeb3a`; commits since then
  (chrome fixes, power-wash hero, chat add-on, demo chat mounts, this
  toggle fix) are on this branch, pushed but not yet merged.

## Blocked on Noah
- Real `OPENAI_API_KEY`/`CHAT_MODEL`/`IP_HASH_SALT`/`CHAT_ALLOWED_ORIGINS`
  env vars — `.env.example` has the keys, blank. Chat returns a clean 503
  until they're set; nothing breaks without them.
- A real mobile device to confirm the toggle fix feels right (sandbox only
  has emulated touch via Playwright).
- The two new client-site screenshots (NextGenRest/SporesRUs) — same
  network-reachability blocker as before, should auto-capture on the next
  `/api/capture-sites` cron run.
- No pull request opened.

## Next up (ordered)
1. Fast-forward `main` once this session's work is reviewed and approved.
2. Set the chat env vars in Vercel and confirm a real round-trip on a demo
   and on vilas.studio itself.
3. Confirm NextGenRest/SporesRUs screenshots landed; add descriptions.
4. Real Higgsfield hero clips for the remaining Premium tiers.

## Gotchas & decisions (standing, trimmed)
- **This sandbox's `next start`/`next build` test loop is unreliable for
  verifying client-side bugs**: stale/mismatched chunk hashes showed up
  between a `rm -rf .next && npm run build` and the next `next start` more
  than once this session, independent of any code change. If a Playwright
  check against a locally-served build gives a confusing 400/404 on a
  `_next/static/chunks/...js`, don't chase it — kill all `next` processes,
  `rm -rf .next`, rebuild, and restart once; if it still doesn't line up,
  trust `tsc`/`lint`/the build's own success and move on rather than
  burning time on the harness.
- **Remotion lives in `video/`, its own project, NOT part of the site.**
  `cd video && npm i && npm run dev`. The root `tsconfig.json` excludes
  `video/`; never add `remotion` to the root `package.json`.
- **"Out in the world" client sites are Supabase rows** (`client_sites`
  table, Vilas project), not a file in this repo — edit via
  `mcp__Supabase__execute_sql` against `epynfvskwaxejdibvgbr`.
- **This session cannot read Noah's local computer** — no mounted drive.
  Also still true: this sandbox's egress is blocked to the Higgsfield CDN
  and to `vilas.studio` itself — verify against a local build, not prod.
- **Concurrent subagents sharing one working tree is risky** — budget time
  for `git stash` collisions if running several file-editing agents at once.
- `.review/` (gitignored) holds per-style gate reports — `git add` on an
  explicitly-named gitignored path exits non-zero and silently kills the
  rest of an `&&` chain. Add real and ignored files in separate commands.
- `public/vilasherovideo.mp4` still does not decode (falls back to poster).
- **Demos live in `components/demos/`, not `app/demos/`.**
- Demos vary by mood (SKILL §13): DARK = renovation; FOREST-DARK =
  landscaping; LIGHT = florist/bakery/powerwash/lawncare; WARM-DARK =
  barber; GRAPHITE-DARK = auto body; THEATRICAL = Magician.
- **Known pre-existing bug, still not fixed:** `Marquee.tsx` (main site)
  hydration mismatch under `prefers-reduced-motion: reduce` at first paint.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  RLS deny-all on every table (service role bypasses). Free tier pauses
  after ~1wk idle; a cold request just needs a retry.
