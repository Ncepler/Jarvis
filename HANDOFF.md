# HANDOFF — updated 2026-09-27 (second photo folder, round 2 of 3)

## Current state
- Deployed: production (`vilas.studio`) is `READY` as of commit `556f023`
  (verified via Vercel MCP). Everything below is pushed to
  `claude/sleepy-newton-uaamxu` but **not yet merged to `main`** — Noah
  said he has 3 upload rounds total from this "higgsfield-9-27" folder;
  main is held until all 3 land rather than fast-forwarding after each one.
  Builds clean locally: `npx tsc --noEmit`, `next lint`, `next build` all
  pass; all 9 `/demos/demo-*` routes prerender.
- **Second photo folder, round 1 of 3** (commits `82372cc`/`34b9740`) —
  `autobody/hero.webp` replaced a hero that visibly showed real
  **Mercedes-Benz** branding; `landscaping/hero-patio.webp` replaced a
  mismatched fall-cleanup labor photo; `renovation/kitchen-traditional.webp`
  added as a 10th `WORK` item (had to be sepia-toned with `sharp` to match
  the existing sepia set); `florist/long-table.webp` gave the Events
  occasion its own photo. Also fixed a pre-existing bug: `FloristDemo`'s
  cursor-preview box cast a shadow at rest before any hover. Full detail in
  that commit range if needed — not repeated here.
- **Second photo folder, round 2 of 3** (commits `91c34e4`/`7cbe0ff`) —
  landed and wired:
  - `florist/hand-tie.webp` (mixed roses) → "Seasonal hand-tie" bouquet row.
  - `florist/market-bunch.webp` (kraft-wrapped wildflowers) → "Market
    bunch, wrapped" bouquet row AND the Everyday occasion tile.
  - `florist/sympathy-spray.webp` (white lily standing spray on an easel)
    → "Soft white standing spray" bouquet row AND the Sympathy occasion
    tile. **All 4 florist occasion tiles now have their own dedicated real
    photo** (previously Sympathy/Everyday shared cooler-photo crops).
    `BOUQUET_IMAGE_OVERRIDE` re-keyed from occasion to bouquet `name`,
    since "Everyday" alone covers 2 rows needing different photos — 5 of 6
    bouquet rows are real now, only "Weekly café arrangement" still falls
    back to the cooler photo.
  - `bakery/cake.webp` (finished piped-buttercream cake) → `CakeOrders`'s
    "Need a cake?" section. **Swapped places** with `bakehouse-bench.webp`
    (proofing baskets/oven), which moved to the "Behind the counter — In by
    4am" `FullBleedBreak` instead — a much better match for both slots than
    round 1's original placement (a bench photo under "need a cake?" never
    quite fit).
  - **One image from this round was unusable**: a "power-washed white
    garage door" photo came back almost entirely blown-out/overexposed —
    confirmed by boosting contrast in `sharp`, which recovered almost no
    detail. Regenerated 2 replacement candidates via `generate_image`
    (`gpt_image_2_5`, job ids `1d67034b-bab1-4410-b545-bd6965908c8b` and
    `4a5508a3-4d2a-4e58-8c35-d0e94ec72243`) but hit the same download block
    as the magician remakes below — unclaimed in Higgsfield history. No
    confirmed destination for this one yet either (`PowerWashDemo`'s
    before/after slider already has real photos from round 1; this would
    need a "before" companion to pair with, which didn't come in this
    batch) — ask Noah what it was meant to show before wiring it anywhere.
  - **Round 1's magician "cards flying" replacement is still unclaimed
    too** (job ids `3f981fd4-dba8-48fa-885a-e6d3107905dd` and
    `4f2e6b03-7725-45b7-8e28-7021b0102b39`). **4 of the 5 remake credits
    are now spent** (magician + powerwash); 1 remains.
- **First photo folder (the original 11-image batch) and the Emil
  Kowalski/Apple craft pass** are both fully shipped to production already
  — see git log around `45216ce` and `141f22c`. Nothing outstanding from
  either; not repeated here to keep this file short.

## Blocked on Noah
- **1 more upload round still coming** from the same `~/Downloads/
  higgsfield-9-27` folder (this HANDOFF covers round 2 of 3). Same flow:
  he attaches ~5 images in chat (can't hand over a local folder path
  directly, see Gotchas), Claude identifies each by content, `sharp`-
  converts to webp q82, finds the best real destination by reading the
  target component fresh (no manifest exists for this folder), wires it,
  verifies with `tsc`/lint/build + a local Playwright pass, commits images
  and code separately.
- **4 generated replacement candidates are stuck unclaimed** in Higgsfield
  history, same CDN download block as always — 2 for the magician "cards
  flying" photo (round 1), 2 for a blown-out power-wash photo (round 2, and
  this one still needs a decision on where it'd even go — see round 2
  notes above). Noah needs to pull one of each pair down and upload it like
  any other image. Only 1 of the 5 offered remake credits is left.
- No pull request opened. `main` is intentionally NOT fast-forwarded yet —
  wait for round 3, then fast-forward and confirm the Vercel deploy like
  the last few rounds.

## Next up (ordered)
1. Receive and wire upload round 3 from the higgsfield-9-27 folder.
2. Get clean replacements in for the magician "cards" photo and (if it gets
   a real destination) the power-wash photo — 4 candidates already
   generated, just need downloading — see Blocked on Noah.
3. Fast-forward `main`, confirm Vercel green, once round 3 is in.
4. TRFox screenshot capture (pending from before this session).
5. Real Higgsfield hero clips for Premium tier.

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
