# HANDOFF — updated 2026-09-27 (craft/motion pass)

## Current state
- Deployed: last confirmed production deploy (`vilas.studio`) was built from
  commit `7918f63` and is `READY` — that was BEFORE this session's craft
  pass below, which is pushed to `claude/sleepy-newton-uaamxu` but not yet
  merged to `main`/redeployed. Builds clean locally: `npx tsc --noEmit`,
  `next lint`, `next build` all pass; all 9 `/demos/demo-*` routes prerender.
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

## Blocked on Noah — unchanged from last session, still true
- **11 real photos generated on Higgsfield still can't be downloaded** —
  this sandbox's network policy still denies the CDN host
  (`d8j0ntlcm91z4.cloudfront.net`), confirmed again this session (retested,
  still 403). Job IDs, destination paths and what each feeds are unchanged
  from before — see git history on this file (or ask, they're still valid)
  rather than duplicating the table here again. **Widen this environment's
  Network access setting before the next image-focused session.**
- Every mechanism that needs one of those images (day/night toggle, compare
  slider, cursor-follow crop, collage) is fully built and interactive on a
  placeholder — dropping the real file in is a one-line prop change per site.
- No pull request opened. Everything is on `claude/sleepy-newton-uaamxu`;
  `main` has been fast-forwarded to match it before (once, on explicit
  request) but is currently one round behind — see git log before assuming
  main is current.

## Next up (ordered)
1. Merge/deploy this craft pass (fast-forward `main`, confirm Vercel green).
2. Widen network access, pull the 11 images into `public/demos/`.
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
