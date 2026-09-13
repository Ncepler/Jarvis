# HANDOFF — updated 2026-09-13

## Current state
- Builds clean this session: `npx tsc --noEmit`, `next lint`, `next build` all pass
  with no errors. Not yet checked on the actual Vercel deploy — only verified
  locally (`npm run dev` + a headless-Chromium harness), see below.
- Done: the hero is now a fully scroll-scrubbed video-to-image piece
  (`components/sections/Hero.tsx` + `HeroVideo.tsx`), replacing the old
  VILAS→VAL text reveal entirely (`components/hero/VilasReveal.tsx` +
  `NameDefinition.tsx` are deleted, along with their now-dead CSS in
  `app/globals.css`). Mechanism: a 400vh pinned region maps scroll 0→1 to
  5s of virtual video time via a lerped rAF loop (gated seeks on
  `video.seeking`, blob-fetched source so Range-request quirks can't break
  seeking in prod); video/image crossfade over virtual-time 1.75s–4.75s,
  image opacity always `1 - video opacity` so they can't ever both show or
  both hide. Verified by hand: the exact crossfade math (24 sample points,
  zero error) via an isolated harness, plus real-browser checks that
  reduced-motion fires zero video requests and the no-JS/broken-video path
  shows the static image correctly. **Not yet verified: real video
  playback** — see the blocker below.

## In progress
- Nothing mid-flight. This session's hero work is code-complete and pushed.

## Next up (ordered)
1. **Fix the hero video asset (see Blocked on Noah below) — this is the only
   thing standing between the new hero and actually working.**
2. Deploy, confirm the hero on the actual Vercel URL, especially the blob-fetch
   path against real production Range-request behavior (verified locally
   only so far).
3. Decide on the deferred "current website" intake field, or leave `/privacy`
   as-is now that it no longer claims to collect it.
4. Replace the placeholder OG image + upscaled 512 icon with real designed assets.
5. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts` — start with `demo-renovation` since
   it's already wired.
6. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
7. Resend sending domain for `vilas.studio` is still unverified.

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
- **The hero needs a working `public/vilasherovideo.mp4`.** The current file
  is not a valid video (see Gotchas above) — please re-export/re-upload it.
  Once a valid file lands at the same path, the scroll-scrub hero should
  work with zero code changes (the math and pipeline are verified).
- Confirm `hello.vilasstudio@gmail.com` stays the working inbox; `RESEND_API_KEY`/`NOTIFY_EMAIL` in Vercel.
- A real Instagram account, when one exists — `SITE.instagram` is `""` until then.
- Real photos/video across the demos, real Premium hero clips, a real high-res logo
  export for the icon set, and a designed OG image.
- Whether the deferred "current website" intake field is worth building.
