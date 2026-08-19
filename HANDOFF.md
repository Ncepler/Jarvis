# HANDOFF — updated 2026-08-19 (v52)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app (also anotherseason.org) — footer
  stamp v52, confirmed live (curl'd the deploy after push, not assumed).
  `npx tsc --noEmit` and `next lint` both clean. **`next build` could not be run locally
  this session** — the devcontainer was memory-starved (~700MB free of 7.8GB, other
  sessions/extension hosts eating the rest) and the build worker kept getting SIGTERM'd
  regardless of `--max-old-space-size`. Not a code issue: the baseline build was clean at
  the very start of this session, before any edits. Vercel's own build (dedicated
  resources) is the real confirmation, and the live site is verified working.
- **9 demos**, all registered in `components/demos/index.ts`, `lib/projects.ts`, `lib/templates.ts`.
- `/start` is the single intake. `/d48` is the internal dashboard.
- **`leads` table and `/api/lead` are gone** (migration 0008). Confirmed via grep first —
  nothing in the app called it since the homepage form was removed; only old test rows
  were in it.
- **`intake_submissions.template` column is gone** (migration 0007). It only ever
  duplicated `template_choice` + `is_custom_build`; backfilled any stray value into
  `template_choice` before dropping. Read it via `template_choice` everywhere now —
  `SubmissionRow.template` no longer exists on the type.

## v52 — intake fixes from a real-data pass (this run)
All six items below were confirmed against the live site and a direct Supabase query
before touching anything, per the ticket's own instruction not to guess.
- **"Template" reworded to "style" everywhere a client sees it** — step 1's "How do you
  want your site built?" / "Pick a style from our work" / "Fully custom, built from
  scratch", the palette-choice label, the customize page's copy, and every per-template
  hint in `lib/templates.ts` (FAQ, work captions, catch-all question, landscaping's
  lighting hint). Internal names (`templateChoice`, `TEMPLATES`, `usingTemplate`, the
  `/d48` "Copy template code" button — that's Noah-only) untouched on purpose.
- **Domain field: already validated.** Checked `lib/intake.ts` — `isValidDomain` +
  `scrubDomain` already require a dot, reject spaces, and silently strip an `http(s)://`
  prefix, client and server side. `test.com` / `67.com` got through because they're
  syntactically valid domains, not because the check was missing — no format rule catches
  a real-looking placeholder. Nothing changed here; noted so it isn't "fixed" twice.
- **Hours no longer pre-fill.** `defaultHours()` used to ship Mon–Sat 9–5, Sun closed, and
  every real submission had it untouched. Now every day starts blank and the content step
  won't advance until each one is either given a real open/close time or explicitly
  ticked closed — inline error per day, "Hours *" marked required.
- **Double-submit blocked with a ref, not just state.** The submit button was already
  `disabled={busy}`, but two real rows landed 0.4s apart — plausibly a second click
  landing before React's re-render flips the disabled attribute. `sendingRef` in
  `IntakeForm.tsx` blocks synchronously the instant the handler runs; reset only on error,
  same as the button.
- **The "Website" field the ticket described doesn't exist.** Grepped every intake
  component, the Supabase columns, and the live HTML — the only "Website" string on
  `/start` is the hidden honeypot label. Asked Noah; he confirmed he meant the existing
  domain field (`desiredDomain`, "What domain do you want for your site?"), which already
  has hint text and is correctly required — a domain build needs one. Left as-is.

## Next up (ordered)
1. Eyes on the live deploy for this session's changes: the reworded step-1 copy, the
   blank-by-default hours table (mobile especially — the per-day error layout is new).
2. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
3. Resend sending domain for `vilas.studio` is unverified, so `/api/notify-intake` still
   swallows its error silently.
4. Orphaned-upload cleanup, if abandoned drafts turn out to fill the buckets.
5. Re-run a local `npm run build` once the devcontainer isn't memory-starved, just to have
   a clean local confirmation on record — not blocking, Vercel's build already passed.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; the session's last
  message states the new version.
- **`outputFileTracingIncludes` in `next.config.ts` now covers `/start` as well as
  `/d48`.** Both read demo source off disk at request time. Delete it and both 404 on
  Vercel while working fine locally.
- List answers are stored as one string per question — one row per line, fields separated
  by " | " — so `template_customizations` stays a flat map and the dashboard and build
  prompt print it without knowing about rows. A pipe typed inside an answer becomes a
  slash so a row can't split itself in two.
- While editing, lists live in `draft.templateLists` as rows, not as that string: a row
  someone added but hasn't typed in yet has to survive a render, and an all-blank row has
  nothing to serialize. `templateListsFor` records which template they were seeded from,
  so switching template doesn't carry the old answers across a same-named question.
- **Demos live in `components/demos/`, not `app/demos/`.**
- There is no `frontend-design` skill in this repo; `.claude/skills/impeccable` is its
  equivalent, and the generated build prompt points at it.
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT =
  florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body.
  THEATRICAL = the Magician (§16). Main site = bone/cream + Syne; demos never use either.
- **Known pre-existing bug, still not fixed:** with `prefers-reduced-motion: reduce`
  active at first paint, `Marquee.tsx` throws a React hydration mismatch in the console.
  React self-heals, nothing visibly breaks. Needs a consistent `mounted` gate.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or
  generated imagery.
- **This devcontainer can run out of memory under concurrent sessions.** If `next build`
  gets `SIGTERM`'d with no other error, check `free -h` before assuming the code broke —
  `tsc --noEmit` + `next lint` are lighter and still catch most real problems; Vercel's
  build is the final word either way.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.intake_submissions` only now — `public.leads` is dropped (migration 0008).
  RLS deny-all on the remaining table (service role bypasses).
- `status` is plain `text` with **no CHECK constraint**. Migration 0005 records the
  vocabulary as a column comment; if a CHECK is ever added it has to list all four values.
- Buckets `intake-logos`, `intake-photos`, `intake-videos` all exist and are public.
  Public means anyone holding a URL can view that one file; nothing is listable.
- Service-role deletes against Storage work — verified by uploading to all three buckets
  and hard-deleting the row, files included.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox (it's live in the footer, the closing CTA,
  and the /start confirmation).
- `RESEND_API_KEY` / `NOTIFY_EMAIL` in Vercel, and verify `vilas.studio` with Resend.
- tagline / instagram / founder still `*_TBD`.
- Real photos/video across the demos.
