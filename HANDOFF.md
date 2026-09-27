# HANDOFF — updated 2026-09-27 (second photo folder, round 1 of 3)

## Current state
- Deployed: production (`vilas.studio`) is `READY` as of commit `556f023`
  (verified via Vercel MCP). The round below (commits `82372cc`/`34b9740`)
  is pushed to `claude/sleepy-newton-uaamxu` but **not yet merged to
  `main`** — Noah said he has 2 more upload rounds coming from this same
  "higgsfield-9-27" folder, so main is being held until all 3 land rather
  than fast-forwarding after each one. Builds clean locally: `npx tsc
  --noEmit`, `next lint`, `next build` all pass; all 9 `/demos/demo-*`
  routes prerender.
- **Second photo folder, round 1 of 3** — a fresh, separate batch from
  Noah's own computer (`~/Downloads/higgsfield-9-27`), delivered the same
  way as before (chat attachments, 5 at a time — this session cannot reach
  a local folder path directly, only chat uploads; see Gotchas). Verified
  by eye plus a Playwright pass against a local `next start` build (no
  direct network to `vilas.studio` or Higgsfield's CDN from this sandbox,
  so verification runs locally, not against the live URL). Landed and wired:
  - `autobody/hero.webp` — low-angle front-end shot, dark teal-lit garage.
    **Replaced** `AutoBodyDemo.tsx`'s hero outright — the old photo (a
    mechanic pouring oil) visibly showed real **Mercedes-Benz** branding
    (tristar on the jacket AND the oil bottle), a real-brand exposure this
    demo shouldn't carry, on top of being a bright mood mismatch for
    GRAPHITE-DARK. One photo fixed both problems.
  - `landscaping/hero-patio.webp` — golden-hour patio/seat-wall framed
    through two porch columns. **Replaced** `LandscapingDemo.tsx`'s hero
    outright — the old photo was a worker pushing a wheelbarrow through
    autumn leaf litter, an unrelated fall-cleanup labor shot, not the
    finished-hardscape aspirational image this niche's hero needs.
  - `renovation/kitchen-traditional.webp` — traditional wood-tone kitchen
    island. Added as a 10th `WORK` item in `RenovationDemo.tsx` (tag
    "Kitchen"). **Had to be sepia/warm-toned with `sharp` (`modulate`
    saturation .35 + `tint` 214/196/168)** before use — the source was full
    color and clashed hard against the existing `renovation3.*` set, which
    all share a warm-sepia grade. Caught by eye during the Playwright pass,
    not obvious from the source photo alone.
  - `florist/long-table.webp` — a formal candlelit long table. Given its
    own dedicated slot on the **Events** occasion specifically (tile,
    cursor-preview crop, and the "Long-table dinner runner" bouquet row) —
    Events' own copy says "the long table," a literal match. `FloristDemo`
    now has `OCCASION_IMAGES`/`BOUQUET_IMAGE_OVERRIDE` picking per-occasion
    instead of only Weddings having a dedicated photo.
  - **Bonus fix, found during Playwright verification, unrelated to any new
    photo**: `FloristDemo.tsx`'s `OccasionCursorPreview` box always cast its
    drop-shadow, even before the first hover (when nothing is showing) —
    visible as an empty shadowed square sitting near the section heading on
    page load. Fixed by gating `boxShadow` on `activeIndex !== null`.
  - **One image from this round was NOT used as-is**: a magician "cards
    flying in the dark" photo had a subtle hand-anatomy flaw on close
    inspection (crop saved for reference: ask Claude or check the session
    transcript). Generated 2 replacement candidates via
    `mcp__Higgsfield__generate_image` (`gpt_image_2_5`, job ids
    `3f981fd4-dba8-48fa-885a-e6d3107905dd` and
    `4f2e6b03-7725-45b7-8e28-7021b0102b39`, ~2.75 credits each) but **could
    not download either** — same CDN network block as always. Sitting
    unused in Higgsfield history until Noah pulls one down and uploads it;
    `MagicianDemo.tsx`'s "REEL: live performance" `Placeholder` is the
    intended slot (already has an `img` prop, just needs the path). 4 of
    the 5 remake credits Noah offered are still unspent.
- **First photo folder (the original 11-image Higgsfield batch) is fully in
  and wired**, shipped to `main`/production earlier — see git log around
  commit `45216ce` for the itemized breakdown (florist cooler + wedding
  table, magician portrait, powerwash before/after, landscaping day/night,
  bakery case + bakehouse bench, barber shop, lawncare hero replacement).
  Not repeated here to keep this file short; nothing from that batch needs
  further action.
- **The Emil Kowalski/Apple-interface craft pass** (shared motion tokens in
  `system.tsx`/`globals.css`, per-style signature details, 2 review-animation
  fixes) shipped to production earlier this session too — see git log around
  commit `141f22c` for the full breakdown. Nothing outstanding from it.

## Blocked on Noah
- **2 more upload rounds still coming** from the same `~/Downloads/
  higgsfield-9-27` folder — Noah said "I'll do 3 rounds" and this HANDOFF
  covers round 1 of 3. Keep using the same flow: he attaches ~5 images in
  chat (can't hand over a local folder path directly, see Gotchas), Claude
  identifies each by content, `sharp`-converts to webp q82, finds the best
  real destination in the relevant demo file (don't assume a manifest
  exists for this folder the way the original 11-image batch had one —
  read the target component to find the actual empty/weak slot), wires it,
  verifies with `tsc`/lint/build + a local Playwright pass, commits images
  and code separately.
- **The magician "cards flying" replacement is stuck on the same download
  block** — see the bullet above for the 2 unclaimed job IDs. Noah needs to
  pull one of those 2 candidates from his Higgsfield history and upload it
  like any other image; only then can `MagicianDemo.tsx`'s REEL placeholder
  get its `img`.
- No pull request opened. `main` is intentionally NOT fast-forwarded yet —
  wait for all 3 upload rounds, then fast-forward and confirm the Vercel
  deploy like the last few rounds.

## Next up (ordered)
1. Receive and wire upload rounds 2 and 3 from the higgsfield-9-27 folder.
2. Get a clean magician "cards" replacement in (2 candidates already
   generated, just need downloading — see Blocked on Noah).
3. Fast-forward `main`, confirm Vercel green, once all 3 rounds are in.
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
