# HANDOFF — updated 2026-08-26 (v54)

## Current state
- Builds clean locally this session: `npx tsc --noEmit`, `next lint`, `next build` all
  pass with no errors. Not yet pushed/deployed by this session — Noah pushes when ready.
- **Round 2 ticket (9 jobs) completed this session.** Screenshot capture (job 4) was
  verified for real: ran `/api/capture-sites` against a local dev server, captured real
  screenshots of all 3 live `client_sites` rows, confirmed the PNGs in Supabase Storage,
  and confirmed the homepage renders them via `next/image`. That data is now live in the
  "Vilas" Supabase project (ref `epynfvskwaxejdibvgbr`) — not test data, the real feature
  working. See "Gotchas" below for the one thing that's still unverified (Vercel itself).

## This session's work (v54)
1. **Rule 0 (no yearly cost) audited site-wide** — nothing was multiplying the monthly
   fee out to an annual site cost anywhere. The one place that logic used to live
   (`DoTheMath.tsx`'s `YEAR_ONE_COST`/multiplier) is gone — see #3.
2. **Pricing restructured to 3 tiers**: Basic ($300 + $50/mo, still hero) / Premium
   ($500 + $80/mo, moving hero, **center + heavier visual weight**, no "most popular"
   badge) / Custom (let's talk, built from scratch). `lib/site.ts`'s `COPY.pricing`,
   `Pricing.tsx`, and `Services.tsx`'s 3 cards all rewritten. "Flagship" removed
   everywhere, including `lib/projects.ts`'s now-dead `tier` field and the landscaping
   card's "shown at full flagship scale" caption.
3. **`/start`'s first real question is now attribute-first**: "What matters more for
   your site?" → stronger first impression (Premium) vs. lower starting cost (Basic),
   with Custom reached as a plain link, not a third button. Price shows only *after* the
   pick, as a confirmation line. New `tier` field end to end: `lib/intake.ts` →
   `PageContact.tsx`'s new `TierChoice` component → `/api/intake` (validates + persists)
   → `intake_submissions.tier` column → shown in `/d48`'s detail panel.
4. **`DoTheMath.tsx` rewritten**: the cost-comparison kicker/multiplier is gone entirely
   (that's what Rule 0 actually required removing). The calculator still shows the
   missed-customer annual figure — that's the visitor's own lost-revenue estimate, not a
   site-price comparison, so it stays. Section now ends with a "Start a project" CTA
   into `/start` instead of a price line.
5. **"Out in the world" (`ClientSites.tsx`) rebuilt without iframes.** The old approach
   couldn't reliably detect a blocked cross-origin embed and was rendering a plain
   name+link card on every tile. Replaced with real screenshots: `app/api/capture-sites`
   (puppeteer-core + `@sparticuz/chromium`) captures each site's viewport at 1440×900 and
   writes the PNG to a new `client-site-captures` Storage bucket, keyed by site id + date.
   A manual `screenshot_url` (existing column) always wins over a generated capture.
   Tiles show a skeleton while loading and hide entirely if no image exists at all —
   never an empty box. Triggered on a schedule (`vercel.json` cron, daily 8am UTC), never
   on page load. **Verified working end to end this session** (see above) — but that was
   this devcontainer, not Vercel's actual function environment; see Gotchas.
6. **Premium hero mechanism built**: `lib/heroConcepts.ts` documents a concrete
   scroll/loop concept for all 9 styles (dented panel straightens, gutted room finishes
   out, etc.). `components/demos/PremiumHeroMedia.tsx` plays it — looping video or
   scroll-scrubbed (IntersectionObserver + rAF driving `currentTime`, never a raw scroll
   listener), with a 3-tier fallback (video → poster → labeled text placeholder) and
   skips straight to still on reduced-motion/mobile/slow-connection. Wired into
   `DemoHero` via a new optional `premium` prop; **only `RenovationDemo.tsx` actually
   passes one**, as a reference wiring — the other 8 demos still render their plain
   still hero. No video/poster assets exist yet (`lib/heroConcepts.ts` points at
   `/public/premium/<slug>.mp4`/`.jpg`, which 404 gracefully to the text placeholder
   today).
7. **Favicon + the site's one logo mark are now the same file.** `app/icon.png` +
   `app/apple-icon.png` (180×180) and `public/vilas-mark.webp` (header/footer/sticky
   corner mark, via `Logo.tsx`) all derive from the real logo Noah dropped in mid-session
   (`public/favicon.PNG` — a bone-circle "VS" monogram; now an unused duplicate, safe to
   delete). Replaced the old dark-disc "V" everywhere. **Verified live and flagged one
   real issue**: the mark's circle color is nearly identical to `--color-bg` (bone), so
   on the page itself (not browser chrome) the circle disappears and only the bare "VS"
   glyph shows — most noticeable on the sticky corner mark, which also sits at 35%
   opacity by default. Screenshotted via a local prod build to confirm this isn't a
   rendering bug. Left as-is since it's Noah's actual asset and not mine to recolor —
   worth a look before calling it done (a stroke, a filled/darker circle, or a bump in
   the pinned mark's opacity would all fix it).
8. **Sticky corner mark**: `PinnedLogo.tsx`'s card now shows "Vilas Studio" + "A small
   web design studio." — no founder name. `SITE.founder` deleted from `lib/site.ts`
   (nothing else referenced it).
9. **Job-8 verification**: everything from the previous ticket had already landed
   (checked each item against the actual code, not just HANDOFF's word for it) except
   the "flagship"/tier cleanup this session's job 1 required anyway. See chat for the
   full checklist.

## SQL run this session (via the Supabase MCP connector against ref
`epynfvskwaxejdibvgbr` — both also committed to `supabase/migrations/`)
- `0011_pricing_tier.sql` — `intake_submissions.tier` (basic/premium/custom check
  constraint). Confirmed first that no pricing tier was ever persisted before this — the
  7 pre-existing rows just get `tier = null`, nothing to migrate.
- `0012_client_site_captures.sql` — `client_sites.captured_at` / `.capture_error`
  columns + the `client-site-captures` public Storage bucket.

## Gotchas & decisions (this session)
- **Screenshot capture is verified working in this devcontainer, NOT on Vercel.**
  `@sparticuz/chromium`'s bundled binary is ~65MB uncompressed (`bin/chromium.br` alone
  is 62MB) — a real risk of exceeding Vercel's function size limit depending on the plan.
  Added an `outputFileTracingIncludes` entry for `/api/capture-sites` so the binary
  actually ships (Next's tracer can't see it via static analysis otherwise — it's read
  by a computed path at runtime), but that doesn't guarantee it fits. **First thing to
  check after deploying: hit `/api/capture-sites` once by hand and read the JSON
  response** (`{captured, total, errors}`) — if it 500s or times out, the manual
  `screenshot_url` column is the fallback and always wins anyway, no code changes needed
  to use it.
- The 3 real `client_sites` rows now have real captures as of this session (see
  `captured_at`). Jonah Shapiro Magic's capture genuinely shows an "Under Construction"
  page — that's the site's real current state, not a bug in the capture.
- `next dev` got confused once this session after a `next build` ran in the same `.next`
  directory — a stale prerendered `/` kept serving with an empty client-site list even
  after real data existed. `rm -rf .next` before `next dev` fixed it. Not a code bug,
  just a mixed-artifacts trap worth remembering.
- `PremiumHeroMedia` only proves itself on the Renovation demo. Pointing another style at
  it is a one-line change (pass `heroConceptFor("demo-<slug>")` to that demo's
  `DemoHero`) but wasn't done for all 9 to keep this session's blast radius sane on a
  mechanism that's still asset-less.

## Gotchas & decisions (standing, from earlier sessions)
- **Version stamp (standing rule):** bump `lib/version.ts` every push; the session's last
  message states the new version.
- **`outputFileTracingIncludes` in `next.config.ts`** now covers `/start`, `/d48` (demo
  source read off disk) and `/api/capture-sites` (the chromium binary) — delete any of
  these and that route breaks on Vercel while working fine locally.
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
  reads `row.template`, a column dropped in migration 0007.
- Honesty rules hold: no fake reviews or stats, labeled placeholders instead of stock or
  generated imagery.
- **This devcontainer can run out of memory under concurrent sessions.** If `next build`
  gets `SIGTERM`'d with no other error, check `free -h` before assuming the code broke.

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  `public.intake_submissions`, `public.client_sites`, `public.update_requests`. RLS
  deny-all on `intake_submissions`/`update_requests` (service role bypasses); `client_sites`
  has one public-read policy for `published = true` (unused by the app — reads
  server-side with the service role).
- Buckets: `intake-logos`, `intake-photos`, `intake-videos`, `client-site-captures` (new
  this session) — all public.
- Free tier pauses after ~1wk idle; a cold request just needs a retry.

## Next up (ordered)
1. Deploy, then hit `/api/capture-sites` by hand once and read the response — see the
   Gotchas item above. If it fails, upload the 3 real sites' screenshots to
   `client_sites.screenshot_url` by hand; the section otherwise renders nothing until one
   of those two happens (currently true on the yet-undeployed build).
2. Done this session (was open, Noah answered): the sticky corner/header/footer mark now
   matches the favicon. See the low-contrast note in Gotchas above — probably wants a
   fix before this ships.
3. Real Higgsfield hero clips for Premium, at `/public/premium/<slug>.mp4` +
   `<slug>.jpg` per `lib/heroConcepts.ts` — start with `demo-renovation` since it's
   already wired.
4. Wire `premium` into the other 8 demos' `DemoHero` calls once assets exist for them.
5. `/api/check-domain` still hasn't been exercised against a real token on the deploy.
6. Resend sending domain for `vilas.studio` is still unverified.
7. `hello@vilas.studio` still isn't a real inbox.

## Blocked on Noah
- Confirm `hello@vilas.studio` is a real inbox; `RESEND_API_KEY`/`NOTIFY_EMAIL` in Vercel.
- tagline / instagram still `*_TBD`.
- Real photos/video across the demos, and real Premium hero clips (job 5 above).
- The logo mark's contrast against the bone page background (see Gotchas) — Noah's call
  on whether/how to fix it.
