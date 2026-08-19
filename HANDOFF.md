# HANDOFF — updated 2026-08-19 (v50)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app (also anotherseason.org) — footer stamp v50.
  `npm run build` + `npx tsc --noEmit` + `next lint` all clean.
- **9 demos**, all registered in `components/demos/index.ts`, `lib/projects.ts`, `lib/templates.ts`.
- `/start` is the single intake. `/d48` is the internal dashboard.

## Two stale warnings from v47, now cleared
- **Migration 0004 has been run.** Every expanded column is on the live table — checked
  against `information_schema` this session, not assumed.
- **`SUPABASE_SERVICE_ROLE_KEY` is back in the local `.env`**, along with `SUPABASE_URL`
  and `DASHBOARD_PASSWORD`. Local dev talks to the real project.

## v50 — intake + dashboard refinements (this run)
### /start
- **The customize page shows the template's real content and lets a client edit it.**
  `lib/templateContent.ts` reads the chosen demo's `.tsx` at request time and pulls out
  the scrolling words, services, process, work captions, value props, FAQ, and each
  niche's own list (menu, price board, plans, paints, shows, bouquets, occasions). The
  rows arrive pre-filled; × removes one, "+ add" adds one.
  - **The read is dynamic, not a hardcoded map.** All 9 demos parse.
  - `lib/parseLiteral.ts` is a hand-rolled scanner, deliberately not `new Function`: it
    cannot execute anything a future demo edit introduces, and an unparseable section
    degrades to an empty list instead of breaking the page.
  - **To add a list to a template, name its const in `lib/templates.ts` (`list.from`).**
    The demo file stays the only place the content is written down. `"@marquee"` means
    the `terms={[...]}` array written inline in the JSX.
  - **Adding a `const` to a demo can change the intake form.** Keep the shape:
    `const NAME = [{ key: "value" }, ...]` at the top level, plain string values.
- **Uploads go to Storage as files are picked** (`/api/intake/upload`), not at submit.
  The draft carries URLs, so uploads survive a refresh and a failed submit. `/api/intake`
  now takes JSON and only records where files landed. It ignores any URL that isn't on
  our own storage origin.
  - Tradeoff: a file uploaded by someone who then abandons the form is an orphan in the
    bucket. Nothing cleans those up yet.
- Validation: every required field has a message under it on blur, each format check has
  its own wording, Next stays clickable and reveals everything at once with a summary
  line above the page. Business type is optional on a template build, required on a
  custom one — client *and* server.
- Phone rejects a letter at the keystroke, so there's no "numbers only" helper any more.
- A successful submit replaces the whole block, heading included. A failed one keeps
  every answer and offers the button again.
- **localStorage key is now `vilas-intake-draft-v3`.** v2 drafts are ignored.

### /d48
- The list is a table: business, template, submitted, status, actions. Sortable by
  submitted (newest first) and status, filterable across All / New / In progress / Done /
  Archived, with a count strip. Rows still expand inline.
- **Archive** sets `status = 'archived'`; the row leaves every view but Archived, and the
  status dropdown in the expanded panel moves it back.
- **Permanent delete** is offered on archived rows only. It removes the uploaded files
  first and leaves the row alone if a bucket won't give them up — an orphaned file with
  no record of whose it is beats a row that outlived its use.
- **Server actions report failure as a return value, never by throwing.** Next redacts a
  thrown server-action error in production, which turned every real message into "an
  error occurred". Keep new actions on `Result<T>`.

## Next up (ordered)
1. Eyes on the live deploy: the reworked customize page (does the pre-filled content read
   as helpful or as a wall?), the /d48 table, and the archive/delete dialogs.
2. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
3. Resend sending domain for `vilas.studio` is unverified, so `/api/notify-intake` still
   swallows its error silently.
4. Orphaned-upload cleanup, if abandoned drafts turn out to fill the buckets.

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
- **`template_choice` vs `template`:** the old `template` column is NOT NULL, so the route
  writes both. `template_choice` is the one to read.
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

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.leads` and `public.intake_submissions`, both RLS deny-all (service role bypasses).
- `status` is plain `text` with **no CHECK constraint**, which is why 'archived' needed no
  DDL. Migration 0005 records the vocabulary as a column comment; if a CHECK is ever added
  it has to list all four values.
- Buckets `intake-logos`, `intake-photos`, `intake-videos` all exist and are public.
  Public means anyone holding a URL can view that one file; nothing is listable.
- Service-role deletes against Storage work — verified by uploading to all three buckets
  and hard-deleting the row, files included.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.
- `/api/lead` and `public.leads` are **orphaned** — nothing posts to them since the
  homepage form was removed. Safe to delete later.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox (it's live in the footer, the closing CTA,
  and now the /start confirmation).
- `RESEND_API_KEY` / `NOTIFY_EMAIL` in Vercel, and verify `vilas.studio` with Resend.
- tagline / instagram / founder still `*_TBD`.
- Real photos/video across the demos.
