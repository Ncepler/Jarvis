# HANDOFF — updated 2026-09-27

## Current state
- Builds clean: `npx tsc --noEmit`, `next lint`, `next build` all pass (all 9
  `/demos/demo-*` routes prerender as static pages).
- **All 9 demo styles rebuilt this session** (renovation, landscaping,
  powerwash, florist, lawncare, bakery, barber, autobody, magician) per
  `.claude/skills/local-service-design-system/SKILL.md`. Per style: unique
  FAQ heading (retired the shared "The stuff people ask." across all 9),
  no leftover `(w:h)` ratio-suffix text in any placeholder label, varied
  section padding, no two adjacent sections sharing a layout, no "template"
  wording anywhere (grepped, 0 hits).
- **Two real, verified bugs fixed system-wide** (in `components/demos/system.tsx`):
  1. `VilasDemoBar` was `sticky` (already in normal flow, 64px) but
     `DemoRoute` also added a redundant `pt-16` on top of it — a doubled,
     wrongly-colored (cream, from the main site's body bg) dead strip
     between the bar and every demo's own header. Bar is now a 44px
     floating translucent pill; the redundant offset is gone.
  2. `DemoHero` was a fixed 640px and painted `heroImage` as an
     unprioritized CSS background (no `next/image`, no priority hint) —
     late LCP paint on real photos. Now `100svh` min-height with a real
     `next/image priority fetchPriority="high"`.
  3. `StickyReveal`'s IntersectionObserver used `threshold: 0.2` with no
     `rootMargin` — on the ~900px marquee+intro block several demos wrap in
     it, that doesn't fire until a large fraction has scrolled past, reading
     as a dead blank stretch riding over the pinned hero (this was the
     "~780px pure-black screen" and "headings at ~30% opacity" bugs
     reported against autobody/florist). Fixed to `threshold: 0,
     rootMargin: "0px 0px -8% 0px"` — fires on first intersection,
     independent of the wrapped block's height.
  4. Magician's premium-tier hero was **100% invisible** — its velvet
     overlay used opaque hex gradient stops instead of rgba, fully
     painting over `PremiumHeroMedia` underneath. Fixed.
- Every demo file still exports the same `{tier?: "basic"|"premium"}`
  shape `components/demos/index.ts` expects — none of that wiring changed.

## Blocked on Noah — read this before the next demo-image session
- **11 real photos were generated on Higgsfield for this rebuild but could
  NOT be downloaded/committed** — this sandbox's network egress policy
  denies Higgsfield's CDN host (`d8j0ntlcm91z4.cloudfront.net`) as an
  org-policy decision (403 on CONNECT), not a bug. **Fix: widen this
  environment's Network access setting (or allow that host) before the next
  session touches demo images**, then re-fetch by job id below (Higgsfield
  `show_generation_by_ids`/history) and drop each into
  `public/demos/<slug>/<file>.webp` (sharp, q82, keep full 4K — several
  layouts crop one file several ways):

  | Slot | File | Job ID | Used by |
  |---|---|---|---|
  | F1 cooler | `florist/cooler.webp` | `301bd173-8cfb-4b2c-96e9-a984cd8dcb4a` | Florist bouquet/collage section |
  | F2 wedding table | `florist/wedding-table.webp` | `295be81c-4809-47bb-9fe6-698b417c0d07` | Florist FullBleedBreak |
  | B1 the case | `bakery/the-case.webp` | `7b48b33e-0cce-4bdb-a1cb-a6c88bb75ef1` | Bakery menu section |
  | B2 bakehouse | `bakery/bakehouse.webp` | `4ba8e4cd-0ea4-4512-9596-9f8fbeb3f6bf` | Bakery FullBleedBreak |
  | L1 patio day | `landscaping/patio-day.webp` | `5b26530f-a978-4c38-affe-9fc9345da20a` | Landscaping day/night toggle |
  | L2 patio night | `landscaping/patio-night.webp` | `074f9b61-f212-4bf4-b973-28518928a401` | Landscaping day/night toggle |
  | P1 driveway before | `powerwash/driveway-before.webp` | `732daa80-35f6-4c96-a788-bc852a8eee22` | PowerWash compare slider |
  | P2 driveway after | `powerwash/driveway-after.webp` | `83626692-bbda-4ab0-a819-f603c8abb393` | PowerWash compare slider |
  | LC1 hero lawn | `lawncare/hero-lawn.webp` | `57d42bf8-732b-4be6-a04a-18c47d4b34b0` | Replaces `/previews/firstLawnCareImage.webp` |
  | BR1 shop | `barber/shop.webp` | `b48c34bc-fa9c-4efd-9091-62446d0e0bf5` | Barber FullBleedBreak "the shop" |
  | MG1 portrait | `magician/portrait.webp` | `3ba3e958-c87c-4ebf-831e-95b3231f49f0` | Magician About section |

  1 of the 12-credit budget is unspent (reserve reroll, never used). Every
  demo's interactive mechanism that needs one of these (day/night toggle,
  compare slider, collage) is already fully built and wired to a labeled
  placeholder — dropping the real file in is a one-line `img`/`beforeImg`/
  `afterImg` prop change per site, not a rebuild.
- The demo skill's old "no AI images" rule (§1.2/§10/§11/§13f/§14a/§16f) has
  a dated addendum at the top of the file superseding it for this one
  curated batch — read that note before adding any *more* AI imagery there.
- Real photography still missing (no Higgsfield job, no existing asset):
  florist's 6 bouquet items, bakery's whole-cake section, barber's cut
  captions, magician's REEL video (no performance/shuffle clip exists in
  `public/` at all — checked). These stayed on the pre-existing
  labeled-placeholder convention.
- No pull request opened this session — everything is pushed to
  `claude/sleepy-newton-uaamxu` only, per this session's branch assignment.

## Next up (ordered)
1. Widen network access, pull the 11 images above into `public/demos/`.
2. TRFox screenshot capture (still pending from before this session — see
   git history for `/api/capture-sites` details).
3. Real Higgsfield hero clips for Premium tier, `/public/premium/<slug>.mp4`.
4. Replace the placeholder OG image + upscaled 512 icon with real assets.

## Gotchas & decisions (standing, trimmed)
- **This devcontainer runs out of memory / flakes on `next build` under
  concurrent sessions** — confirmed again this session (9 parallel
  subagents each editing a different demo file hit SIGKILL/stale-cache
  JSON errors on `npm run build`; `tsc`/`eslint` stayed reliable
  throughout). Re-run build once contention clears before trusting a
  build failure.
- **Working in the same checkout from multiple concurrent agents is risky**:
  one subagent ran `git stash` mid-session to test something and swept up
  every other agent's uncommitted files. Everyone recovered via
  `git show stash@{0}:<path>` / `git checkout stash@{0} -- <path>` without
  data loss, but avoid running `git stash` in a shared working tree with
  other sessions active — use `git diff`/targeted `git add` instead.
- `public/vilasherovideo.mp4` still does not decode (falls back to the
  static poster image as designed) — unrelated to this session.
- **Demos live in `components/demos/`, not `app/demos/`.**
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT
  = florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK =
  auto body. THEATRICAL = the Magician (§16).
- Renovation and florist's *existing* hero photos (`firstRenovationImage.webp`,
  `firstFloristImage.webp`, both pre-dating this session) read a bit hazy/
  soft compared to barber's crisp one — asset quality, not a scrim/code bug
  (the scrim mechanism is unchanged and correct); worth a reshoot, not a fix.
- `Faq`/`Contact` in `system.tsx` both render a fixed two-column layout and
  sit adjacent in every demo's section plan — several subagents flagged this
  as the one unavoidable back-to-back layout repeat; would need a
  `system.tsx` change to fully resolve.
- **Known pre-existing bug, still not fixed:** `Marquee.tsx` hydration
  mismatch under `prefers-reduced-motion: reduce` at first paint (React
  self-heals, nothing visibly breaks).

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  RLS deny-all on `intake_submissions`/`update_requests` (service role
  bypasses). Free tier pauses after ~1wk idle; a cold request just needs a
  retry.
