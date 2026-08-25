# HANDOFF — updated 2026-08-25 (v53)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app (also anotherseason.org) — footer
  stamp v53 once pushed. `npx tsc --noEmit`, `next lint`, and `next build` all clean
  locally this session (build ran fine — devcontainer had memory this time).
- **12-job ticket completed this session** (see below). Live-tested against the real
  "Vilas" Supabase project (ref `epynfvskwaxejdibvgbr`) via the Supabase MCP connector —
  not just typechecked. A temporary debug route was used to exercise `/updates`'
  server actions end-to-end, then deleted; the one test intake row + update request it
  created were deleted from the live table afterward. Nothing test-related was left
  behind.

## This session's work (v53)
1. **"Template" → "style" everywhere visible.** Fixed the `/start` style question, the
   `/demos/[slug]` browser-tab title (`"X template"` → `"X style"`), and a `lib/templates.ts`
   hint string. Internal identifiers (`templateChoice`, `TEMPLATES`, `/d48`'s "Copy
   template code") stay as-is on purpose — `/d48` is password-gated, not visitor-facing.
2. **`SITE_URL`** (`lib/site.ts`) — one constant, `NEXT_PUBLIC_SITE_URL` env var with a
   `vilas.studio` fallback, feeding `metadataBase`. Internal links were already relative
   (`/start`, `#work`), so there was nothing else to rewire. TODO comment added next to
   `SITE.email` about the mailbox not existing yet.
3. **Deleted the VAL section and the "Every site" index** (`FullBleed.tsx`,
   `AllSites.tsx`, both removed). Dropped the dead `vilas:open-demo` CustomEvent listener
   from `Gallery.tsx` that only AllSites ever dispatched. Removed the `#sites` footer nav
   link; added a `/updates` one in its place.
4. **New "Out in the world" section** (`components/sections/ClientSites.tsx`) replaces
   the deleted before/after section. Two-row CSS grid (`grid-auto-flow: column`),
   live-window tiles: desktop mounts a real `<iframe>` (1440×900, scaled via transform,
   `pointer-events:none`, IntersectionObserver-gated, 4s load timeout → falls back to
   `screenshot_url` → falls back to a plain name+link card) once it's near the viewport;
   mobile skips iframes entirely and goes straight to the screenshot/card. Data comes
   from the new `client_sites` table, read server-side in `app/page.tsx` (now `async`)
   via `lib/clientSites.ts`, revalidated every 5 minutes (`next: { revalidate: 300 }`) so
   the homepage stays statically served rather than going fully dynamic. Seeded with the
   3 real sites (Jonah Shapiro Magic, PackPerfect, Val's Elegant Barbershop).
5. **Price tags removed from all 9 gallery cards** (`lib/projects.ts`'s `priceLabel`
   field deleted entirely — nothing read it anymore). Services cards now show
   `$300 + $50/month` / `$500 + $80/month` instead of the old one-time numbers. Pricing
   section's "Template" tier renamed "Style".
6. **Do-the-math section fixed**: year-one cost is a real `$900` (`$300` build + 12 ×
   `$50`), not the old `~$300, once`. The multiplier is computed live from the calculator
   inputs (`annual / 900`), never hardcoded, and an honest message shows when it's under
   1× instead of hiding the line. Replaced the vague "difference between getting the call
   and watching it go next door" line with something concrete about search.
7. **Turnaround standardized to "about a week"** everywhere (was split between "under"
   and "about"). FAQ's "How long does it take?" rewritten to the longer, more specific
   answer from the ticket.
8. **FAQ check**: all 5 answers exist in `COPY.faq.items` — it's genuinely just accordion
   collapse (`openIdx` defaults to `0`), not missing content. Nothing to fix.
9. **`/start` changes**: new required "Your email" field (`personalEmail`) at the top of
   step 1, stored in a new `personal_email` column. Style question reworded per the
   ticket's exact copy. Every submission now gets a `ref_code` (`VS-4817`, `VS-4818`, …)
   generated **server-side by a column default** (`'VS-' || nextval('vilas_ref_seq')`) —
   no app code computes it, so `POST /api/intake` just asks for it back via
   `select=id,ref_code`. Confirmation screen shows the code with a copy button. If
   `RESEND_API_KEY` is set, `/api/intake` also emails the code to `personalEmail` (best
   effort, reuses the Resend pattern `/api/notify-intake` already established) — this
   won't actually deliver yet since `vilas.studio`'s Resend sending domain is still
   unverified, same standing issue as `/api/notify-intake`.
10. **New `/updates` page** (4 steps: look up by ref code + email → confirm → free-text
    request → done). `app/updates/actions.ts` (server actions) + `lib/updates.ts` (the
    Supabase REST reads/writes, same pattern as `lib/d48.ts`) + `lib/rateLimit.ts` (an
    in-memory per-IP cap, 6/min — module-scoped, so it's per-instance not global, noted
    as a real limitation, not a hard guarantee). Lookup requires **both** `ref_code` and
    `personal_email` to match (case-insensitive via PostgREST `ilike`), one generic error
    either way. `noindex, nofollow`, linked from the footer.
11. **`/d48` admin**: `ref_code` + `personal_email` now show in the submission detail
    panel and `ref_code` got its own table column. New "Update requests" tab (same page,
    no new route — `/d48` had no multi-page nav to extend, so this follows its existing
    filter/tab pattern) lists `update_requests` newest-first with the business name
    joined in via a PostgREST embed (`select=*,intake_submissions(business_name)`),
    verified working against real data. Single "Mark as handled" button flips
    `status` → `'done'`.
12. **Version bumped to v53.**

## SQL run this session (all via the Supabase MCP connector against ref
`epynfvskwaxejdibvgbr` — nothing had to be appended for Noah to run by hand)
- `0009_create_client_sites.sql` — `client_sites` table + RLS + the 3 seed rows.
- `0010_ref_codes_and_update_requests.sql` — `vilas_ref_seq`, `intake_submissions.ref_code`
  / `.personal_email`, backfill of `ref_code` on the 7 pre-existing rows (their
  `personal_email` stayed null — they predate the field, so they can't use `/updates`
  until resubmitted), and the `update_requests` table + RLS.
Both migration files are also committed to `supabase/migrations/` so the schema is
reproducible from the repo, matching the existing convention.

## Gotchas & decisions (this session)
- **`app/api/<name>` folders starting with `_` are Next.js "private folders" and are
  excluded from routing** — cost some time debugging a 404 on a temp test route. Not
  relevant to any real route in this repo, just a note for next time.
- **PostgREST FK embedding works as expected**: `update_requests?select=*,intake_submissions(business_name)`
  resolves via the `submission_id` foreign key with no extra config, confirmed against
  live data, not just assumed.
- `app/page.tsx` is now `async` (fetches `client_sites` server-side). Still statically
  served — see `next: { revalidate: 300 }` above — so this didn't cost the performance
  budget (CLAUDE.md §9).
- `lib/rateLimit.ts`'s cap is per-server-instance, not a true global limit on Vercel's
  multi-instance serverless model. Fine for "stop someone walking the sequence from one
  IP" (the actual threat — codes are sequential after the first), not a hard guarantee
  against a distributed attempt. Documented in the file itself.

## Next up (ordered)
1. Eyes on the live deploy: the new "Out in the world" gallery (embed vs. screenshot
   fallback on a few different networks/browsers), `/start`'s new email field, `/updates`
   end to end with a real submission, `/d48`'s new tab.
2. Noah to pick a replacement heading for the 9-style carousel above "Out in the world" —
   "Sites we built. Step inside one." reads oddly once real client sites sit right below
   it. Suggested in this session's chat: something like "Styles to start from." / "Step
   inside one." — Noah's call, not changed without asking.
3. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
4. Resend sending domain for `vilas.studio` is still unverified, so both
   `/api/notify-intake` and the new ref-code confirmation email swallow their errors
   silently until that's fixed.
5. `hello@vilas.studio` still isn't a real inbox — TODO comment now sits next to it in
   `lib/site.ts`.

## Gotchas & decisions (standing, from earlier sessions)
- **Version stamp (standing rule):** bump `lib/version.ts` every push; the session's last
  message states the new version.
- **`outputFileTracingIncludes` in `next.config.ts` covers `/start` and `/d48`.** Both
  read demo source off disk at request time. Delete it and both 404 on Vercel while
  working fine locally.
- List answers are stored as one string per question — see `lib/intake.ts` if touching
  `templateCustomizations`/`templateLists`.
- **Demos live in `components/demos/`, not `app/demos/`.**
- There is no `frontend-design` skill in this repo; `.claude/skills/impeccable` is its
  equivalent.
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT =
  florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body.
  THEATRICAL = the Magician (§16). Main site = bone/cream + Syne; demos never use either.
- **Known pre-existing bug, still not fixed:** with `prefers-reduced-motion: reduce`
  active at first paint, `Marquee.tsx` throws a React hydration mismatch in the console.
  React self-heals, nothing visibly breaks.
- **Known pre-existing dead reference, still not fixed:** `app/api/notify-intake/route.ts`
  reads `row.template`, a column dropped in migration 0007. Silently prints nothing for
  that line rather than erroring — low priority, but worth a real fix sometime.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or
  generated imagery.
- **This devcontainer can run out of memory under concurrent sessions.** If `next build`
  gets `SIGTERM`'d with no other error, check `free -h` before assuming the code broke.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.intake_submissions`, `public.client_sites`, `public.update_requests`. RLS
  deny-all on `intake_submissions`/`update_requests` (service role bypasses); `client_sites`
  has one public-read policy for `published = true` (unused by the app today — it reads
  server-side with the service role like everything else — but there if a client-side
  read is ever wired up).
- Buckets `intake-logos`, `intake-photos`, `intake-videos` all exist and are public.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox.
- `RESEND_API_KEY` / `NOTIFY_EMAIL` in Vercel, and verify `vilas.studio` with Resend —
  this now also blocks the new ref-code confirmation email, not just the intake alert.
- tagline / instagram / founder still `*_TBD`.
- Real photos/video across the demos, and a `screenshot_url` for the 3 client sites
  (currently null on all 3 — they fall back to the plain name+link card).
- Pick a replacement heading for the 9-style carousel (see "Next up" #2).
