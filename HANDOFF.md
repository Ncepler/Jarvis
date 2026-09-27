# HANDOFF — updated 2026-09-27 (real photos, first batch)

## Current state
- Deployed: last confirmed production deploy (`vilas.studio`) was built from
  commit `7918f63` and is `READY` — that was BEFORE this session's craft
  pass and the real-photo wiring below, both pushed to
  `claude/sleepy-newton-uaamxu` but not yet merged to `main`/redeployed.
  Builds clean locally: `npx tsc --noEmit`, `next lint`, `next build` all
  pass; all 9 `/demos/demo-*` routes prerender.
- **First 5 of the 11 Higgsfield photos are in and wired** (Noah worked
  around the sandbox's network block by downloading them himself and
  uploading them as chat attachments 5 at a time — that's the actual
  resolution path now, not widening network access). Landed in
  `public/demos/<slug>/*.webp` and wired into their components:
  - `florist/cooler.webp` — walk-in cooler still life. Replaces the reused
    hero-photo crops in `FloristDemo.tsx`'s occasion cursor-preview, bouquet
    row thumbnails, and the occasion tiles grid (previously a bare `<Media>`
    placeholder with no image at all).
  - `magician/portrait.webp` — dark theatrical portrait, fanned cards, gold
    rim light. Fills `MagicianDemo.tsx`'s `About` section PORTRAIT slot;
    `Placeholder` gained an optional `img` prop (mirrors `system.tsx`'s
    `Media`) to carry it, existing gold shimmer sweep plays over it.
  - `powerwash/driveway-before.webp` + `driveway-after.webp` — same framing,
    stained/mossy vs. clean. Wired into `PowerWashDemo.tsx`'s
    `WashTransformation` slider via `BeforeAfterSlider`'s existing
    `beforeImg`/`afterImg` props (no component change needed there).
  - `landscaping/patio-night.webp` — blue-hour patio, fire pit + path lights
    on. Fills the night side of `LandscapingDemo.tsx`'s day/night toggle via
    `Media`'s existing `img` prop; the day side is still a placeholder (its
    photo, patio-day, hasn't arrived yet).
  - All 4 touched demo files verified clean: `tsc --noEmit`, `next lint`,
    `next build` (all 9 demo routes still prerender).
- **A full Emil Kowalski / Apple-interface craft pass landed on top of last
  session's rebuild**, across shared system + all 9 styles. Shared
  (`components/demos/system.tsx` + `app/globals.css`, all `.demo-shell`
  scoped, main site untouched):
  - New motion tokens (`--d-ease-out/-in-out/-drawer`, `--d-dur-press/hover/
    ui/reveal/media`) extending the existing `--ease-out-expo` pattern.
  - Reveal (`Rise`/`StickyReveal`) retuned to 8px/420ms/-4% margin.
  - Hero entrance choreography is now pure CSS keyframes (image settles
    1.06→1 over 1400ms, headline lines mask in, then kicker/paragraph/
    buttons rise staggered) — runs off the main thread, both hero tiers
    share one timing.
  - `StickyScene`'s scroll-linked image scale now prefers a
    `view-timeline-name` CSS path (no JS scroll listener) where supported,
    falling back to the existing rAF mechanism.
  - `Faq` rebuilt on `grid-template-rows` (was a Motion height animation);
    `BeforeAfterSlider` got a spring-scaled handle, a first-reveal hint,
    shift+arrow keyboard step, position-based label fade; `DemoMarquee` gets
    an edge-fade mask and pauses on hover/offscreen at ~40px/s.
  - New `MobileStickyCta` component (each style wires one in); `DemoFooter`
    got the oversized cropped-wordmark treatment; `TwoLine`/`CtaBand`
    headlines are now full-contrast on both lines (no more greyed second
    line — that was never an actual design-spec requirement, just an
    earlier implementation choice).
  - New CSS utilities, all `.demo-shell`-scoped: `.d-press`, `.d-link`,
    `.d-img-hover`, `.d-crisp-edge`, `.d-float`, `.d-grain`,
    `.d-feature-reveal`, `.d-material` (w/ reduced-transparency/contrast
    fallbacks), `.d-sticky-cta`, plus a mobile-native baseline.
  - `DemoHero.line1`/`.line2` widened from `string` to `ReactNode` (safe
    superset) so a caller can style part of a headline without a cast.
  - `DemoTheme` gained optional `radiusLg`/`radiusSm` tiers.
- **Per-style signature details**, one subagent per file — see each style's
  `.review/<slug>/motion.md` (gitignored, local only) for the itemized gate
  report. Highlights: florist (cursor-follow occasion preview, italic hero
  word), bakery (open/closed status chip, scroll-scaled case photo),
  landscaping (day/night now auto-plays once), power wash (full-bleed 88svh
  slider + text-a-photo thread), lawn care (custom estimate slider, no
  counting animation), barber (walk-ins status chip, brass price-board
  frame), magician (interruptible card flip, canvas pause on
  offscreen/hidden-tab), autobody (layoutId color-ring, found & fixed a
  real dead-zone bug last session), renovation (scroll-driven progress
  line).
- Two review-animations violations found and fixed repo-wide: `HeroReveal`
  (system.tsx) and `RiseFromDark` (MagicianDemo.tsx) were animating Motion's
  `y` shorthand (not hardware-accelerated) — both now animate a full
  `transform` string.
- **One commit-history wrinkle** (functionally harmless): the AutoBodyDemo
  and BakeryDemo craft-pass commits collided during a batch commit (a `git
  add` with an already-gitignored `.review/` path silently failed the whole
  `&&` chain, but had already staged both files from two separate earlier
  attempts) — both files' changes are correctly committed and pushed, just
  both landed under the "Autobody craft pass" commit message instead of two
  separate ones. Not rewritten/force-pushed to fix since the branch was
  already pushed; purely cosmetic.

## Blocked on Noah
- **6 of the 11 Higgsfield photos still outstanding** — this sandbox's
  network policy still can't reach the Higgsfield CDN directly, so Noah is
  downloading each batch himself and re-uploading as chat attachments
  (5-at-a-time upload limit is why this is happening in batches). Still
  waiting on: florist wedding-table, bakery the-case, bakery bakehouse,
  landscaping patio-day (the day half of the toggle whose night half just
  landed), lawn care hero-lawn, barber shop. Same process as this batch:
  identify by content against the original prompts, `sharp`-convert to
  webp q82 into `public/demos/<slug>/`, wire into the component, verify,
  commit, push.
- Every mechanism that needs one of the remaining images (landscaping's day
  side, the barber/lawncare/bakery slots) is fully built and interactive on
  a placeholder — dropping the real file in is a small, localized change per
  site, same shape as this batch's edits.
- No pull request opened. Everything is on `claude/sleepy-newton-uaamxu`;
  `main` has been fast-forwarded to match it before (once, on explicit
  request) but is currently one round behind — see git log before assuming
  main is current.

## Next up (ordered)
1. Receive and wire the remaining 6 Higgsfield photos (see Blocked on Noah).
2. Merge/deploy the craft pass + this photo batch (fast-forward `main`,
   confirm Vercel green) — both are on `claude/sleepy-newton-uaamxu` only.
3. TRFox screenshot capture (pending from before this session).
4. Real Higgsfield hero clips for Premium tier.

## Gotchas & decisions (standing, trimmed)
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
