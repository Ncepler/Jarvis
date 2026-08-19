# HANDOFF — updated 2026-08-19 (v47)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app (also anotherseason.org) — footer stamp v47.
  `npm run build` + `npx tsc --noEmit` + `next lint` all clean.
- **9 demos**, all registered in `components/demos/index.ts`, `lib/projects.ts`, and now `lib/templates.ts`.
- **The homepage no longer has its own contact form.** `/start` is the single intake. `components/sections/Contact.tsx` was deleted and `ClosingCta` absorbed its job (heading + one Start button + `hello@vilas.studio`).

## ⚠️ Run this first
`supabase/migrations/0004_expand_intake_submissions.sql` **has not been run.** Until it is, `/start` submissions fail with "Couldn't save that just now" — the insert writes columns that don't exist yet. Paste it into the Supabase SQL editor for the **Vilas** project (ref `epynfvskwaxejdibvgbr`). It's idempotent.

Second thing: the gitignored `.env` at the repo root got blanked during the v47 session. `SUPABASE_URL` is restored; **`SUPABASE_SERVICE_ROLE_KEY` needs pasting back out of Vercel** for local dev. Vercel itself was never touched.

## v47 — /d48 dashboard + intake overhaul (this run)
- **`/d48`** (`app/d48/page.tsx`, `app/d48/actions.ts`, `components/d48/*`): password-gated internal dashboard. One env var, `DASHBOARD_PASSWORD`. The `d48_session` cookie is httpOnly, 30 days, and holds a **hash** of the password, not the password. Rows list newest first and **expand inline** (chosen over a `/d48/[id]` route — less navigation, faster to scan; that route was never built). Each open row: every field grouped by intake page, asset previews with download links, a status dropdown that PATCHes Supabase, and two copy buttons.
  - **Copy template code** reads the demo's `.tsx` off disk on every click, so it's always what's live. This needs `outputFileTracingIncludes` in `next.config.ts` — without it the source isn't in the serverless bundle on Vercel and the read 404s. Don't delete that config.
  - **Copy build prompt** → `lib/generatePrompt.ts`, a pure function over one row. Edit the prompt wording there; the dashboard never needs touching.
- **`lib/templates.ts` is the new registry.** A template's display name, its source path, its sample business, and the per-template questions the intake form asks all live in one entry. The form's page-1 dropdown, its per-template page, the prompt's `{templateSpecificSection}`, and the dashboard's labels all read it. **Adding a demo means adding an entry here**, or it won't appear anywhere in the intake flow.
- **`/start` is now up to 5 pages**: Contact → Brand → Content → Customize (only when a template was picked) → Brain dump. Step count is computed per draft (`stepsFor`), not a constant.
  - Validation lives in `validateStep` in `lib/intake.ts` and returns a map of field name → message. The form shows a message once its field is blurred, or once Next is pressed on a page with problems (then all of them show and the view jumps to the first). **Next is never disabled** — that silent dead button was the thing being fixed.
  - Email regex rejects `g@g.g`. Phone strips non-phone characters on input. Domain strips scheme/`www.`/path as typed.
  - Dual logo: main upload plus a profile logo with a circular `react-easy-crop` modal that uploads **both** the cropped square and the original.
  - Hero video: optional, 25MB cap enforced client-side *and* in the route.
  - localStorage key bumped to `vilas-intake-draft-v2` (the v1 shape is gone).
- **`/api/check-domain`** (edge): Vercel `v4/domains/status`. Availability lookups are free; you only pay to register. Reads `VERCEL_API_TOKEN`, plus `VERCEL_TEAM_ID` if the token is a team token. Any failure returns the yellow "couldn't check, we'll verify at build time" state and never blocks the form.
- **Filename badges on demo images** (`FileBadge` in `components/demos/system.tsx`): hovering any image slot in a demo shows the filename a client should give their own photo (`hero.jpg`, `service-1.jpg`, `work-3.jpg`, `before-1.jpg`…). Hover-only, `md:` and up, so it never shows on a phone. The /start photo instructions tell clients to go find these.

## Next up (ordered)
1. Run migration 0004, then submit `/start` once for real and confirm the row lands in `/d48`.
2. Restore `SUPABASE_SERVICE_ROLE_KEY` in the local `.env`.
3. Verify `/api/check-domain` against a real token on the deploy — it could only be exercised as far as the "no token" branch locally.
4. Resend sending domain for `vilas.studio` is still unverified, so `/api/notify-intake` still silently swallows a Resend error.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of the session states the new version.
- **Demos live in `components/demos/`, not `app/demos/`.** Every path in `lib/templates.ts` and in the generated build prompt reflects the real location.
- **`template_choice` vs `template`:** the old `template` column is NOT NULL, so the route writes both. `template_choice` is the one to read.
- `SITE.email` resolved from `CONTACT_EMAIL_TBD` to `hello@vilas.studio`. **If that inbox doesn't exist, change it back** — it's now live in the footer and the closing CTA, not just one spot.
- The generated build prompt points at `.claude/skills/humanizer` and `.claude/skills/impeccable`. There is no `frontend-design` skill in this repo; `impeccable` is its equivalent.
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT = florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body. THEATRICAL = the Magician (§16, its own system entirely). Main site = bone/cream + Syne; demos never use either.
- **Re-mooding a local-service demo is a `theme` swap, not a structural one.** Every primitive reads the `--d-*` vars `DemoShell` sets.
- **Known pre-existing bug, still not fixed:** with `prefers-reduced-motion: reduce` active at first paint, `Marquee.tsx` throws a React hydration mismatch in the console (it branches to different DOM for the reduced case). React self-heals, nothing visibly breaks. Needs a consistent `mounted`-gate across many files.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or generated imagery.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2. `public.leads` and `public.intake_submissions`, both RLS deny-all (service role bypasses).
- Buckets `intake-logos`, `intake-photos` exist and are public; **`intake-videos` is created by migration 0004** and is public for the same reason. Public means anyone holding a URL can view that one file; nothing is listable and paths carry a timestamp.
- The project has unrelated leftover tables from a prior app (`web_clients`, `school_subjects`, migrations mentioning "goalmaxx"). Not studio data, ignore them.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.
- `/api/lead` and `public.leads` are now **orphaned** — nothing in the UI posts to them since the homepage form was removed. Left in place; safe to delete later.

## Blocked on Noah
- Migration 0004 + the local `SUPABASE_SERVICE_ROLE_KEY` (top of this file).
- Confirm `hello@vilas.studio` is a real inbox.
- `RESEND_API_KEY` / `NOTIFY_EMAIL` in Vercel, and verify `vilas.studio` as a Resend sending domain.
- tagline / instagram / founder still `*_TBD`.
- Eyes on the live deploy: the reworked `/start`, `/d48`, the toned-down sticky button, and whether the demos' hover filename badges are subtle enough.
- Real photos/video still pending across the demos.
