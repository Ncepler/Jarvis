# HANDOFF — updated 2026-09-17

## Current state
- Builds clean: `npx tsc --noEmit`, `next lint`, `next build` all pass.
- **TRFox added to client_sites** (custom build, sort_order 40). Deployment verified on Vercel.
  Entry exists in Supabase but screenshot not yet captured — the tile won't render until
  it has an image (see Next up below).

## Next up (ordered)
1. **TRFox screenshot capture** — run `/api/capture-sites` on Vercel to capture and store
   the screenshot, OR manually upload the captured PNG to Supabase storage at
   `client-site-captures/58fc840a-2f91-4586-9473-d494ecd77cee/2026-09-17.png` and set
   `screenshot_url` in the database. (A full-page screenshot at /tmp/trfox-screenshot.png
   was already captured locally; 1280×10733px, 2.9MB).
2. More client sites to the gallery once available.
3. Replace the placeholder OG image + upscaled 512 icon with real designed assets.
4. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts`.

## Gotchas & decisions (standing, trimmed)
- **`public/vilasherovideo.mp4` does not decode** — confirmed independently by
  both Chromium (`DEMUXER_ERROR_NO_SUPPORTED_STREAMS`) and ffmpeg (`Invalid
  data found when processing input`), despite a structurally intact outer MP4
  box layout (ftyp/uuid/free/mdat/moov walk cleanly to exactly the file's
  byte size — so it's not truncated, the encoded track data inside is just
  bad). It was added in the "Add files via upload" commit. The hero's code
  handles this exactly as designed — it falls back to the static
  `vilasheroimage.png` — so the site isn't broken, it just can't show the
  video until a valid file replaces it. No code change needed once that
  happens.
- **`outputFileTracingIncludes` in `next.config.ts`** covers `/start`, `/d48`, and
  `/api/capture-sites` (chromium binary) — don't delete these, routes break on Vercel
  while still working locally.
- List answers in intake are stored as one string per question — see `lib/intake.ts`
  before touching `templateCustomizations`/`templateLists`.
- **Demos live in `components/demos/`, not `app/demos/`.**
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT =
  florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body.
  THEATRICAL = the Magician (§16). Main site = bone/cream + Syne; demos never use either.
- **Known pre-existing bug, still not fixed:** with `prefers-reduced-motion: reduce`
  active at first paint, `Marquee.tsx` throws a React hydration mismatch in the console.
  React self-heals, nothing visibly breaks.
- **Known pre-existing dead reference, still not fixed:** `app/api/notify-intake/route.ts`
  reads `row.template`, a column dropped in migration 0007. Also `COPY.contact` in
  `lib/site.ts` (sub/reassurance/nearSubmit/step2Intro/success/errorSave) is dead —
  nothing imports it anymore now that `/start` is the only intake flow.
- **`isTBD()` in `lib/site.ts`** treats `""` as a placeholder too, not just a
  trailing `_TBD` suffix — keep that in mind before adding a new gated `SITE` field.
- **Space Grotesk (`--font-wordmark` in `app/globals.css`, loaded in
  `app/layout.tsx`) is now unused** — it existed only for the deleted
  VilasReveal wordmark. Left in place since removing a font import touches
  shared root layout, outside this session's scope — worth pruning in a
  follow-up (real, measurable font-weight savings).
- This devcontainer can run out of memory under concurrent sessions. If `next build`
  gets `SIGTERM`'d with no other error, check `free -h` before assuming the code broke.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or
  generated imagery.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.intake_submissions`, `public.client_sites`, `public.update_requests`. RLS
  deny-all on `intake_submissions`/`update_requests` (service role bypasses);
  `client_sites` has one public-read policy for `published = true` (unused by the app —
  reads server-side with the service role).
- Buckets: `intake-logos`, `intake-photos`, `intake-videos`, `client-site-captures` — all
  public.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.

## Blocked on Noah
- **TRFox screenshot capture** — either run `/api/capture-sites` cron manually on Vercel,
  or upload the pre-captured screenshot (see Next up #1 above) and set the database field.
- More client sites to add to the gallery.
- Real Higgsfield hero clips for Premium.
- A designed OG image + favicon set.
