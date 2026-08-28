# HANDOFF — updated 2026-08-28

## Current state
- Builds clean locally this session: `npx tsc --noEmit`, `next lint`, `next build` all
  pass with no errors. Committed and **pushed straight to `main`** (standing instruction
  from Noah: push + sync to main whenever work is build-clean and ready, don't wait to be
  asked). Not yet checked on the actual Vercel deploy this round.
- This session ran four tickets back to back: a legal-patch + copy-fixes pass (19 tasks,
  run twice), an SEO/UX checklist pass (9 tasks), a brand-copy scrub (removed a
  name/villa FAQ pun, fixed a leftover tagline-prefix string a prior pass missed, cleaned
  the meta description), and this round — **a placeholder cleanup pass**: a false
  `/privacy` collection claim removed, the real tagline filled in, the Instagram
  placeholder resolved to "no account yet" instead of a dead link, and a repo-wide
  re-verify of the earlier tagline fix (which did land this time — confirmed by grep, not
  just claimed). See git log for exact commits; this file only covers what's still
  relevant to pick up work, not a full diary.

## This session's work — placeholder cleanup (most recent)
1. `app/privacy/page.tsx` — dropped the "your current website" clause from "What we
   collect": the intake form has no such field, so the policy shouldn't claim to collect
   it. The field itself is still deferred, separate work (see Blocked on Noah).
2. `lib/site.ts` `SITE.tagline` — real value now ("A website that looks expensive. It
   wasn't."), replacing the placeholder. `app/opengraph-image.tsx` switched from its
   `COPY.hero.positioning` stand-in to `SITE.tagline` directly now that it's real, and
   its stale placeholder-referencing comment is gone.
3. `lib/site.ts` `SITE.instagram` — set to `""` instead of a placeholder string, since
   there's no real account to name a placeholder after. `isTBD()` now also treats `""`
   as missing (one-line addition, not a rename) so the two existing gated renders
   (`Footer.tsx`, `PinnedLogo.tsx`) keep hiding it exactly as before — no dead link was
   ever actually shipping (both were already conditionally gated), but the literal
   placeholder text is gone from the source now too.
4. `CLAUDE.md` §2 — its `SITE` code sample and the surrounding paragraph updated to
   match: tagline resolved, Instagram empty rather than a placeholder string. `email` and
   `founder` still carry their own placeholder strings there, untouched — outside this
   ticket's scope.
5. Re-verified the earlier hero-tagline fix from two sessions ago actually holds
   repo-wide this time (see Verify output below) — it does.

## Gotchas & decisions (standing, trimmed)
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
- **`isTBD()` in `lib/site.ts`** now treats `""` as a placeholder too, not just a
  trailing `_TBD` suffix — keep that in mind before adding a new gated `SITE` field.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or
  generated imagery.
- **This devcontainer can run out of memory under concurrent sessions.** If `next build`
  gets `SIGTERM`'d with no other error, check `free -h` before assuming the code broke.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.intake_submissions`, `public.client_sites`, `public.update_requests`. RLS
  deny-all on `intake_submissions`/`update_requests` (service role bypasses);
  `client_sites` has one public-read policy for `published = true` (unused by the app —
  reads server-side with the service role).
- Buckets: `intake-logos`, `intake-photos`, `intake-videos`, `client-site-captures` — all
  public.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.

## Next up (ordered)
1. Deploy, confirm `/robots.txt`, favicon, OG image, and the new tagline resolve on the
   actual Vercel URL (verified locally only so far).
2. Decide on the deferred "current website" intake field — build it as its own ticket,
   or leave `/privacy` as-is now that it no longer claims to collect it.
3. Replace the placeholder OG image + upscaled 512 icon with real designed assets.
4. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts` — start with `demo-renovation` since it's
   already wired.
5. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
6. Resend sending domain for `vilas.studio` is still unverified.
7. `hello@vilas.studio` still isn't a real inbox.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox; `RESEND_API_KEY`/`NOTIFY_EMAIL` in Vercel.
- A real Instagram account, when one exists — `SITE.instagram` is `""` until then.
- Real photos/video across the demos, real Premium hero clips, a real high-res logo
  export for the icon set, and a designed OG image.
- Whether the deferred "current website" intake field is worth building.
