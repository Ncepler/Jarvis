# HANDOFF — updated 2026-08-28

## Current state
- Builds clean locally this session: `npx tsc --noEmit`, `next lint`, `next build` all
  pass with no errors. Committed and **pushed straight to `main`** (standing instruction
  from Noah: push + sync to main whenever work is build-clean and ready, don't wait to be
  asked). Not yet checked on the actual Vercel deploy this round.
- This session ran three tickets back to back: a **legal-patch + copy-fixes pass** (19
  tasks, run twice — the second run replaced task 19's /terms + /privacy spec with a more
  detailed one), an **SEO/UX checklist pass** (9 tasks: robots.txt, Organization JSON-LD,
  Vercel Analytics, favicon/manifest icons, a placeholder OG image, gallery + client-site
  alt text, a response-time line, a /start thank-you state, a custom 404), and a **third
  legal-patch re-run** that walked back the brand-name FAQ item and scrubbed "villa" +
  the old "Live in about a week" tagline site-wide. See git log for exact commits — this
  file only covers what's still relevant to pick up work, not a full diary.

## This session's work — brand-copy scrub (most recent)
1. **Removed the "Why 'Vilas'?" FAQ item** (`lib/site.ts`) added in an earlier pass —
   Noah's call: no villa/name pun anywhere on the site.
2. **`COPY.hero.positioning`** ("Websites for local businesses. Live in about a week.")
   → "A website that looks expensive. It wasn't." One shared source, three render sites
   that all picked it up automatically: `Hero.tsx`, `Footer.tsx`, and
   `opengraph-image.tsx` (which uses this line as its tagline stand-in — the generated
   OG image's subline changed along with this).
3. **Caught a miss from an earlier pass**: `COPY.services.bridge` still had the old
   "Live in about a week." prefix — task 3 back in the first legal-patch run should have
   dropped it and apparently didn't land. Fixed now: reads "All we need from you is a
   logo, a few photos, and your hours."
4. **`app/layout.tsx`'s `META_DESCRIPTION`** — dropped the "cost as much as a villa"
   line for "look expensive — and aren't." Single shared const, feeds
   `metadata.description` + `openGraph.description` + `twitter.description` all at once
   — confirmed via grep there was no second copy anywhere else.
5. Verified zero remaining hits for "villa" (any case) and "Live in about a week"
   repo-wide, per the ticket's own verify step.

## This session's work — SEO/UX pass
1. `app/robots.ts` — allow all, no sitemap line (none exists yet). `/start`, `/updates`,
   and `/demos/[slug]` already had per-page `robots: { index: false, follow: false }` in
   their own metadata before this session — nothing new needed there.
2. `app/layout.tsx` — added `Organization` JSON-LD (not LocalBusiness — no physical
   location) as a plain `<script>` in `<body>`, and wired `<Analytics />` from
   `@vercel/analytics/next` (newly installed — it wasn't in package.json before).
3. `app/manifest.ts` (new) + `public/icon-192.png` / `icon-512.png` (new, generated via a
   one-off `sharp` script from `public/vilas-mark.webp`, flattened onto the site's bone
   background `#efe9dd` — same treatment `app/apple-icon.png` already used). `sharp`
   itself was **not** added to package.json — it's already present transitively (Next
   pulls it in), used here only as an ad-hoc generation script, not an app import.
   `app/icon.png` + `app/apple-icon.png` already existed from an earlier session and were
   left as-is.
4. `app/opengraph-image.tsx` (new) — dynamic `next/og` `ImageResponse`, cream/espresso
   placeholder wordmark card. Uses `COPY.hero.positioning` as a stand-in tagline line
   since `SITE.tagline` is still `TAGLINE_TBD` — never render a raw `_TBD` string into a
   public image. **Flagged: replace with a real designed OG image once the brand has
   one.**
5. Alt text: `Gallery.tsx`'s card thumbnail + full-homepage-fallback images now read
   `"{category} website style — {name}"` (category = business type, e.g. "Renovation &
   remodeling"). Left the one `alt=""` that's on a genuinely decorative, `aria-hidden`
   backdrop image untouched — emptying it further would be wrong, not a gap.
   `ClientSites.tsx`'s screenshot (`<img>` + `<Image>`, both previously `alt=""`) now
   reads `"{client name} — built from the {style name} style"` or `"{client name} —
   custom build"` for non-template builds.
6. `lib/site.ts` `COPY.closing.responseTime` = "We reply within one business day." +
   rendered in `ClosingCta.tsx` right under the Start-a-project button.
7. `IntakeForm.tsx`'s `/start` thank-you state (`stage === "done"`) already existed in
   full (thank-you line + reference code for `/updates`) from an earlier session — only
   change: its old "We'll reach out within 48 hours" line contradicted the new canonical
   promise, so it now says "We reply within one business day" to match.
8. `app/not-found.tsx` — already existed, already matched this ticket's spec exactly
   (Logo + Footer reuse, same heading/line/links). No change needed.
9. Sticky mobile CTA: **already in place** — `components/StickyStartButton.tsx`, fixed
   top-right, fades in once you scroll past the hero, visible at all breakpoints
   (no mobile-specific hiding). Left alone per the ticket.

## Flagged — placeholders / not done (SEO pass)
- **OG image is a placeholder** (`app/opengraph-image.tsx`) — plain generated wordmark
  card, not a designed asset. Swap once real brand art exists.
- **`public/icon-512.png` is upscaled** from the 331×331 `vilas-mark.webp` source (192 is
  a clean downscale). Fine as a stopgap; regenerate both from a real high-res export
  later.
- **Task 16 from the legal-patch ticket (optional "Website" field on /start)** — still
  skipped, unrelated to this pass. See prior note: no such field exists anywhere in the
  intake data model; adding one touches the submit flow + database, out of scope.
  `/privacy` still claims we collect "your current website if you have one," which is
  false until that field exists.

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
1. Deploy, confirm `/robots.txt`, favicon, and OG image resolve on the actual Vercel URL
   (verified locally only this session).
2. Replace the placeholder OG image + upscaled 512 icon with real designed assets.
3. Decide on Task 16 (optional Website field) — drop the `/privacy` claim or spec the
   field addition as its own ticket.
4. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts` — start with `demo-renovation` since it's
   already wired.
5. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
6. Resend sending domain for `vilas.studio` is still unverified.
7. `hello@vilas.studio` still isn't a real inbox.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox; `RESEND_API_KEY`/`NOTIFY_EMAIL` in Vercel.
- tagline / instagram still `*_TBD` (the OG image placeholder is waiting on the tagline).
- Real photos/video across the demos, real Premium hero clips, a real high-res logo
  export for the icon set, and a designed OG image.
- Task 16 decision (optional Website field on /start).
