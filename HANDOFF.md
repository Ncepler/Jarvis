# HANDOFF — updated 2026-08-28

## Current state
- Builds clean locally this session: `npx tsc --noEmit`, `next lint`, `next build` all
  pass with no errors. Committed and **pushed straight to `main`** (this session's
  standing instruction from Noah: push + sync to main whenever work is build-clean and
  ready, don't wait to be asked). Not deployed/verified on Vercel by this session — Noah
  checks the live deploy.
- This session did a **legal-patch + copy-fixes pass** (19-task ticket, run twice — the
  second pass replaced task 19's /terms + /privacy spec with a more detailed one; the
  terms/privacy sections below reflect the FINAL, second-pass wording): typo fixes,
  wording tightens, a footer-version-indicator removal, a pricing-section rework, /terms
  + /privacy additions, and a new `/not-found` 404 page (separate small ticket, same
  session). See git log for the exact commits.

## This session's work
1. Copy fixes across `lib/site.ts` (gallery heading, marquee niche list, workNote,
   client-sites sub, about/footer "built by hand" → "fit by hand" wording, "neighbouring"
   → "neighboring", tier-picker card bodies get an inline price line, new FAQ item on the
   brand name).
2. Deleted the calculator's per-input disclaimer line (`COPY.math.q2.sub` + its `<p>` in
   `DoTheMath.tsx`). The "Your numbers, not ours" honesty line (`COPY.math.honest`) is
   untouched, still renders below the calculator.
3. Removed the `v54`-style version stamp from the footer's rendered output
   (`components/Footer.tsx`) — `lib/version.ts`'s `VERSION` constant is left in place,
   just unused now, per the ticket's explicit instruction.
4. **`Pricing.tsx` reworked**: the three tier cards + "what you're paying for" explainer
   are gone. Replaced with `COPY.pricing.recap` (one line: Basic/Premium/Custom prices)
   + `COPY.pricing.body` (4 paragraphs: payment split + Stripe, what the build fee
   covers, what the monthly covers, the annual-discount deal). The "Three ways in" tier
   cards near the top of the page (Services section) are untouched — separate copy,
   separate component.
5. `/start` intake helper-text edits in `PageContact.tsx` (personal-email + business-email
   hints reworded, shorter).
6. `/terms` + `/privacy`, final wording (second pass superseded the first):
   - Both "Last updated" dates: Aug 27, 2026.
   - Terms Payment: Stripe/refund language appended (unchanged between passes).
   - Terms "What the monthly covers": now 2 paragraphs — "content updates" reworded to
     "reasonable content updates — text, photos, hours, prices, new services"; the
     lapse/annual-discount language moved into its own closing paragraph with an added
     12-months-unpaid → offline-and-release-domain clause (with an email-first promise).
   - Terms "Who owns what": now 3 paragraphs — original ownership text, + a
     portfolio/social-showcase paragraph, + a licensed-third-party-assets paragraph.
     (The first pass had put these in standalone "Showing the work" / "Licensed assets"
     sections — removed; content now lives inside "Who owns what" instead.)
   - Terms "Your content": closing liability sentence reworded to "If someone comes
     after us over something you supplied, that's on you, and you'll cover what it
     costs us."
   - Terms "Revisions": 14-day-auto-approval line appended (unchanged between passes).
   - Terms "What we don't promise": gained a 3rd paragraph on outages/uptime. (The first
     pass had a standalone "Outages" section before "Liability" — removed, folded in
     here instead.)
   - Terms "Governing law": "...courts of Nassau County, New York." (was "in" Nassau
     County in the first pass — fixed to "of").
   - Privacy: a new unheaded scope paragraph ("This policy covers vilas.studio only...")
     inserted directly before "Who else sees it"; that section gained a closing
     no-third-party-marketing sentence and (both passes) a Stripe bullet after Resend.

## Flagged — not done
- **Task 16 (optional "Website" field on /start)** was skipped. The ticket's locator
  assumes the field already exists ("gets helper text"); it doesn't — there is no
  website/current-site field anywhere in `lib/intake.ts`'s `IntakeDraft` type,
  `PageContact.tsx`, `/api/intake`, or the `intake_submissions` table. Adding one
  end-to-end (type + validation + UI + API + Supabase column) is bigger than a
  copy edit and touches the submit flow and database, both explicitly out of scope
  for this ticket ("The /start submit flow, checkbox, and database (separate
  prompt)"). Needs its own ticket. Note: `/privacy` already claims we collect "your
  current website if you have one" (line was there before this session) — that
  claim is currently false until the field exists; worth flagging to Noah.

## Gotchas & decisions (standing, from earlier sessions — trimmed)
- **Version stamp:** the footer no longer shows it (this session). `lib/version.ts`
  still exists as a constant but nothing renders it — the "bump every push" convention
  in its own comment is now moot unless Noah wants it revived somewhere else.
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
  reads `row.template`, a column dropped in migration 0007.
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
1. Deploy this branch, verify the copy changes on the live site (mobile width too), and
   check the new /terms + /privacy sections render correctly.
2. Decide on Task 16 (see "Flagged" above) — either drop the "current website" line from
   `/privacy`, or spec the field addition as its own ticket.
3. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts` — start with `demo-renovation` since it's
   already wired.
4. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
5. Resend sending domain for `vilas.studio` is still unverified.
6. `hello@vilas.studio` still isn't a real inbox.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox; `RESEND_API_KEY`/`NOTIFY_EMAIL` in Vercel.
- tagline / instagram still `*_TBD`.
- Real photos/video across the demos, and real Premium hero clips.
- Task 16 decision (see Flagged above).
