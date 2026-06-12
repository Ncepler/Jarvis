# HANDOFF — updated 2026-06-12

## Fix-up (commit d8f90c4)
Noah reported the wash reveal "didn't get pushed" — it HAD deployed, but the
blur→clean played on MOUNT, so it always finished before anyone scrolled to
the gallery and looked like no change. Now `WashReveal` (useInView, once,
amount 0.35) holds the dirty state until the hero is on screen, then a CSS
transition (0.9s hold, 2.8s clean) washes it in. Keyframes → transition so
it's interruptible. Same reduced-motion gate.

## Audit-and-fix pass (commits 81f0eaa, c25e543)
Noah asked for a §6 compliance audit, two fixes, and the quality passes. All done, pushed, verified live (curl-level; real-browser checks below still pending).

- **Power-wash demo got its signature hero**: the whole hero starts dirty
  (blur 13px + desaturated + dim), holds ~1s, then "cleans" into focus over
  ~2.8s. One-shot CSS keyframes (`pw-clean`, off main thread), scale(1.04)
  start hides edge fringe, reduced-motion shows it sharp. Full-bleed video
  slot wired (`HERO_VIDEO` const in PowerWashDemo.tsx, null until Noah's
  clip; placeholder scene = radial sheen + HouseWash svg). TODO(asset): when
  the clip lands, move the `<video>` into a client component to gate
  autoplay on reduced motion (HeroVideo.tsx is the pattern).
- **Gallery "duplicate render" fixed**: the full-screen backdrop was
  `absolute inset-0` over the WHOLE section, so a dimmed copy of the same
  homepage bled behind the open panel ("Stone & Sage mounted twice"). Now
  clipped to `h-svh overflow-hidden` and it follows the settled panel index
  instead of the live drag index (a fling no longer mounts every demo it
  passes). Card thumb + panel mounts stay — those are intentional.
- **Esc in the gallery**: panel has no closed state anymore, so Esc scrolls
  the row back into view (block: center). Arrows/Enter unchanged.

## Audit verdict (2026-06-12, against §6 as amended 2026-06-11)
Everything else checked out as really implemented, not stubbed: drag +
velocity snap + continuous coverflow, panel staggers + price tags,
services 0.75s-delay reveal + frame-breaking circle + mobile tap/in-view,
pinned logo IO fade + founder card morph, hero video slot, reduced-motion
branches everywhere (Lenis init-gated, GSAP never installed). Quality
passes re-verified in code: AA contrast (muted ≈7:1 on bg), focus-visible
accent outline, iframes only mount in panel, next/image lazy, 173kB first
load. The layoutId morph-expand from the ORIGINAL §6.3 is intentionally
absent (superseded by panel-follows-center).

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), new hero confirmed live in deploy HTML
- Design skills in `.claude/skills/` (design / impeccable / ui ux pro max) — read + follow for any design work

## In progress
- Nothing half-finished.

## Next up (ordered)
1. REAL-browser verification still owed: blur→clean hero feel (timing of the
   1s hold), backdrop clip on tall panels, Esc scroll-back, phone-width +
   reduced-motion by hand. Codespace has no browser; Lighthouse mobile
   number also pending (PSI anonymous quota was exhausted — run
   pagespeed.web.dev against the deploy, target ≥90 / LCP <2.5s).
2. Form backend when Noah decides (NOT built — /api/lead intentionally
   absent, blocked on Supabase-vs-Resend decision; mailto fallback shows an
   honest "not wired up yet" error while SITE.email is TBD).
3. Brand name still blocks lib/site.ts, OG image, domain.

## Gotchas & decisions
- **Version stamp (Noah 2026-06-12, standing rule):** `lib/version.ts` shows
  small in the footer. Bump it by 1 in EVERY pushed change, and the session's
  last message to Noah must state the new version ("version: vN") so he can
  check the live footer to confirm the deploy landed.
- §6.3 morph-expand + Esc-close spec superseded 2026-06-11 (panel always
  open, follows center). §6.4 "not a button" overridden (founder card).
  Don't update CLAUDE.md without Noah asking.
- Demo conventions: self-contained colors, sample brands + 555 numbers,
  DEMO_DESIGN_W=1280, per-demo keyframe prefixes (pw-, barber-, …).
- Each demo mounts 2-3× (card thumb, clipped backdrop, panel) — perf watch.
- Vercel: vercel.json pins framework=nextjs; deployment protection off.
- Display font Instrument Serif / body Inter. Mirror-preview path
  (scripts/mirror.mjs + AutoFrame) kept but unused.
- Gallery ↔ Contact: `preselect-style` CustomEvent.
- Ask Noah before installs outside CLAUDE.md §3.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram, founder name → lib/site.ts)
- Form backend decision (Supabase vs Resend vs other)
- Pressure-washing hero clip for the power-wash demo (slot is ready)
- A phone + real browser pass on the live URL
