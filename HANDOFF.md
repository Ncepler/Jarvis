# HANDOFF — updated 2026-09-27 (second photo folder, round 3 of 3 — done)

## Current state
- Deployed: production (`vilas.studio`) is `READY` as of commit `556f023`
  (verified via Vercel MCP). All 3 rounds below are pushed to
  `claude/sleepy-newton-uaamxu` but **not yet merged to `main`** — this was
  the last of Noah's 3 planned upload rounds from the "higgsfield-9-27"
  folder, so main is ready to fast-forward whenever he confirms. Builds
  clean locally: `npx tsc --noEmit`, `next lint`, `next build` all pass;
  all 9 `/demos/demo-*` routes prerender.
- **Second photo folder, all 3 rounds landed** (commits `82372cc` through
  `d954d97`). Highlights: `autobody/hero.webp` replaced a hero that
  visibly showed real **Mercedes-Benz** branding; `landscaping/
  hero-patio.webp` and `renovation/kitchen-traditional.webp` (sepia-toned
  with `sharp` to match its grid) upgraded weak/mismatched photos; every
  florist occasion tile and 5 of 6 bouquet rows now have a dedicated real
  photo (`OCCASION_IMAGES`/`BOUQUET_IMAGE_OVERRIDE` in `FloristDemo.tsx`);
  bakery's cake and bakehouse-bench photos got swapped into the sections
  they actually match; `magician/cards.webp` fills the "REEL: live
  performance" placeholder, replacing round 1's version that had a subtle
  hand-anatomy flaw (verified clean at full zoom this time). Also fixed a
  pre-existing bug: `FloristDemo`'s cursor-preview box cast a shadow at
  rest before any hover. Full itemized detail is in the commit messages
  across `82372cc..d954d97` if needed — not repeated here.
- **3 images from this batch were judged not good enough to use, and not
  forced into any slot just to use them:**
  - A "power-washed white garage door" photo (round 2) came back almost
    entirely blown-out/overexposed. 2 regenerated replacements exist but
    are stuck unclaimed in Higgsfield history (see below) — and even a
    clean version has no confirmed destination: `PowerWashDemo`'s
    before/after slider already has real photos, and this one has no
    "before" companion to pair with. Round 3 included what looks like
    Noah's own manual fix for this exact shot (`26.webp`, well-exposed,
    same composition) — still unwired for the same reason: no "before."
  - A bakery night-case photo (round 3, moody but noticeably softer focus
    than the crisp `the-case.webp` already in use) and a barber
    mirror-reflection scene (round 3, good quality, shows 2 people
    cutting hair) both had no unfilled slot to go in — `BakeryDemo` and
    `BarberDemo` were already fully photographed. Neither was forced in;
    both are good enough to use later if a new section ever needs one.
  - **4 of the 5 remake credits Noah offered were spent** (2 on the
    magician fix, which worked; 2 on the power-wash fix, which is still
    unclaimed). 1 remains, unspent.
- **First photo folder (the original 11-image batch) and the Emil
  Kowalski/Apple craft pass** are both fully shipped to production already
  — see git log around `45216ce` and `141f22c`. Nothing outstanding from
  either; not repeated here to keep this file short.

## Blocked on Noah
- **Ready to fast-forward `main` and confirm the Vercel deploy** — ask
  before doing it (per this repo's branch-only-unless-asked convention),
  since a prior fast-forward this session was on his explicit request, not
  a standing instruction.
- **2 generated power-wash replacement candidates are stuck unclaimed** in
  Higgsfield history (job ids `1d67034b-bab1-4410-b545-bd6965908c8b` and
  `4a5508a3-4d2a-4e58-8c35-d0e94ec72243`), same CDN download block as
  always. Not urgent — there's no confirmed destination for this photo
  yet anyway (see above); ask Noah what it was meant to show, or whether
  `26.webp` (his own apparent fix, already on disk in the chat images
  folder but not committed anywhere) was meant to replace it.
- No pull request opened.

## Next up (ordered)
1. Fast-forward `main`, confirm Vercel green — ask Noah first.
2. If a "before" shot for the power-wash garage-door photo ever comes in,
   decide whether it becomes a second before/after slider or something
   else, then wire `26.webp` or a fresh regeneration.
3. TRFox screenshot capture (pending from before this session).
4. Real Higgsfield hero clips for Premium tier.

## Gotchas & decisions (standing, trimmed)
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
