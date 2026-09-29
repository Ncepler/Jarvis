# HANDOFF — updated 2026-09-29 (chrome fixes + client sites)

## Current state
- Deployed: `main` fast-forwarded to `e7eeb3a` (the full 3-round second
  photo folder) and confirmed `READY` on production (`vilas.studio`) via
  Vercel MCP. Commit `aa49a13` (chrome fixes below) is on
  `claude/sleepy-newton-uaamxu`, pushed but not yet fast-forwarded to main
  as of this writing — do that next unless told otherwise, this round of
  fixes doesn't need a review step. Builds clean locally: `npx tsc
  --noEmit`, `next lint`, `next build` all pass.
- **Fixed a real, site-wide sticky-positioning bug** (`aa49a13`): `app/
  globals.css` had `overflow-x: hidden` on BOTH `html` and `body`. That
  combination makes both elements compute to `overflow: hidden auto` and
  register as scroll containers simultaneously, which silently breaks
  `position: sticky` everywhere on the page — `VilasDemoBar` and
  `DemoHeader` were scrolling away instead of staying pinned on every demo.
  Confirmed with a Playwright test before/after (sticky bar's `rect.top`
  went from drifting to -2988px after a 3000px scroll, to holding at
  12px). Fix: keep the rule on `body` only, drop it from `html`.
- **Exit link** (`VilasDemoBar.tsx`) now goes to `/#work` (the homepage
  gallery section) instead of `/` — a visitor leaving a demo lands back
  among the style cards, not at the top of the homepage.
- **Gallery thumbnails were stale** (`lib/projects.ts`'s `screenshot`
  field — a separate static image per project used only by the homepage
  `AccordionGallery`, NOT a live render of the demo). 3 of 9 still pointed
  at old images: autobody's showed the photo with visible Mercedes-Benz
  branding that was replaced in the demo itself weeks ago, landscaping and
  lawncare showed their old mismatched heroes, and magician had no image
  at all. All 9 now match each demo's real current hero
  (`magician` uses `portrait.webp`, the others use whatever `heroImage`
  constant that demo file currently sets — checked each one directly
  rather than assumed).
- **"Out in the world" client-sites sphere (`InfiniteMenu.tsx`/`.css`)**:
  `.face-title` had no `max-width`, so a long name like "Val's Elegant
  Barbershop" or "Jonah Shapiro Magic" ran wide enough at its fixed
  3rem/900-weight size to overlap the centered sphere face. Capped to
  `8ch` so it wraps to a second line instead.
- **Added 2 new client sites** to Supabase (`client_sites` table, not a
  file — see Gotchas): NextGenRest (`nextgenrest.vercel.app`) and
  SporesRUs (`sporesrus.vercel.app`), `published: true`, no
  `screenshot_url` set (so the existing daily auto-capture cron picks them
  up — see Blocked on Noah). Real business details unknown, so
  `description` was left `null` rather than invented — Noah should fill
  it in via the `client_sites` table if he wants one shown.
- **First+second photo folders and the craft pass** are all fully shipped
  to production — see git log around `45216ce`, `141f22c`, `e7eeb3a` for
  the itemized breakdowns. Nothing outstanding from any of them.

## Blocked on Noah
- **The two new client-site screenshots aren't live yet.** This sandbox
  can't reach `nextgenrest.vercel.app`/`sporesrus.vercel.app` (network
  policy) to capture them directly, and `mcp__Vercel__web_fetch_vercel_url`
  refused both projects with an authorization-scope error (same for the
  `jarvis` project itself, so it's not project-specific — that whole tool
  path looks unauthorized for this session regardless of target). The
  site's own `/api/capture-sites` cron (`vercel.json`, daily 8am UTC,
  Puppeteer on Vercel's infra — not this sandbox) already ran successfully
  as recently as Sep 28 for the existing rows, so the two new ones should
  get auto-captured at the next run. To force it sooner: visit
  `https://vilas.studio/api/capture-sites` once (plain GET, no auth
  needed — `CRON_SECRET` isn't set on this project).
- **2 generated power-wash replacement candidates are still unclaimed** in
  Higgsfield history (job ids `1d67034b-bab1-4410-b545-bd6965908c8b` and
  `4a5508a3-4d2a-4e58-8c35-d0e94ec72243`) — no confirmed destination for
  this photo either way (`PowerWashDemo`'s slider already has real photos
  from round 1, this one has no "before" companion). 1 of the 5 remake
  credits Noah offered is still unspent.
- No pull request opened.

## Next up (ordered)
1. Fast-forward `main` to `aa49a13` (this round's chrome fixes), confirm
   Vercel green.
2. Confirm the NextGenRest/SporesRUs screenshots landed after the next
   `/api/capture-sites` run; add a real `description` for each if wanted.
3. If a "before" shot for the power-wash garage-door photo ever comes in,
   decide whether it becomes a second before/after slider or something
   else.
4. TRFox screenshot capture (pending from before this session).
5. Real Higgsfield hero clips for Premium tier.

## Gotchas & decisions (standing, trimmed)
- **"Out in the world" client sites (Val's Barbershop, Jonah Shapiro Magic,
  PackPerfect, TRFox, now NextGenRest/SporesRUs) are Supabase rows
  (`client_sites` table, Vilas project), not a file in this repo.** There's
  no `lib/clientSites.ts` data array to edit — `lib/clientSites.ts` only
  has the *fetch* code (`listClientSites()`). Add/edit a site with
  `mcp__Supabase__execute_sql` against `epynfvskwaxejdibvgbr`. A row's
  image comes from `screenshot_url` if set (manual override), else an
  auto-captured PNG keyed by `captured_at`'s date — see `lib/screenshot.ts`
  and `app/api/capture-sites/route.ts` (a Vercel Cron, `vercel.json`, daily
  8am UTC, runs real Puppeteer on Vercel's infra so it can reach sites this
  sandbox can't).
- **This session cannot read Noah's local computer at all** — no mounted
  drive, no path access, nothing. A folder path like `~/Downloads/
  higgsfield-9-27` is meaningless here; the only way media reaches this
  session is a chat attachment. (A `claude remote-control` session on his
  own machine could read it directly, but that's a different session.)
  Also still true: this sandbox's egress is blocked to both the Higgsfield
  CDN (`d8j0ntlcm91z4.cloudfront.net`) and `vilas.studio` itself — a fresh
  `generate_image` job's result URL and the live production site are
  equally unreachable from here. Verification runs against a local
  `next start` + Playwright instead of the real deployed URL.
- **Don't assume a new image folder maps 1:1 onto the original 11-slot
  manifest.** This round's images had no prior job-ID table — matching them
  to a destination meant reading each target demo file fresh. Two of five
  replaced an existing (flawed) photo instead of filling an empty slot;
  read the component before assuming "new photo = new placeholder."
- **Check a new photo against its destination's existing palette/grade**,
  not just its own quality — a fine photo can still be wrong for a spot
  (renovation's WORK grid is uniformly sepia-toned; a full-color drop-in
  needs `sharp` toning to match, see round 1 above).
- **Concurrent subagents sharing one working tree is genuinely risky**:
  this session hit a `git stash` collision (again) mid-Phase-3, and two
  subagents were cut off mid-task by a session-wide API rate limit. Every
  case was recoverable (`git checkout stash@{0} -- <path>`, or just
  verifying the interrupted agent's last edit was actually already
  complete before treating it as done) — but budget time for this kind of
  recovery when running 9 parallel file-editing agents in one checkout.
- **This devcontainer flakes on `next build` under concurrent sessions**
  (SIGKILL/stale-cache errors) — `tsc`/`eslint` stay reliable throughout;
  re-run build once contention clears.
- `.review/` (gitignored) holds per-style gate reports and screenshots —
  **`git add` on an explicitly-named gitignored path exits non-zero and
  silently kills the rest of an `&&` chain**, including a `git commit` after
  it. Add real files and ignored files in separate commands, not one `git
  add realfile ignoredfile && git commit`.
- `public/vilasherovideo.mp4` still does not decode (falls back to the
  static poster) — unrelated to demos.
- **Demos live in `components/demos/`, not `app/demos/`.**
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping.
  FOREST-DARK = landscaping specifically. LIGHT = florist/bakery/powerwash/
  lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body. THEATRICAL = the
  Magician (§16).
- Renovation and florist's *existing* hero photos read a bit hazy/soft
  compared to barber's crisp one — asset quality, not a code/scrim bug.
- `Faq`/`Contact` in `system.tsx` both render a fixed two-column layout and
  sit adjacent in every demo — the one unavoidable back-to-back layout
  repeat without a `system.tsx` structural change.
- **Known pre-existing bug, still not fixed:** `Marquee.tsx` (main site, not
  the demo one) hydration mismatch under `prefers-reduced-motion: reduce`
  at first paint (React self-heals, nothing visibly breaks).

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  RLS deny-all on `intake_submissions`/`update_requests` (service role
  bypasses). Free tier pauses after ~1wk idle; a cold request just needs a
  retry.
