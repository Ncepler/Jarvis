# HANDOFF — updated 2026-06-10

## Current state
- Deployed: NOT YET — main is ahead of origin/main (unpushed). Gate: Noah watches first push → Vercel deploy end-to-end before pushing becomes routine. Repo: github.com/Ncepler/Jarvis
- Builds clean: yes (build + tsc + lint all pass)
- Done (committed, NOT verified on live deploy or phone yet):
  - Scaffold (Next 15.5 / React 19 / Tailwind v4 / TS strict, tokens, fonts, `lib/site.ts`, Logo placeholder)
  - Page shell, all sections real copy (Hero → Services → Gallery → All Sites → About → Contact)
  - Hero with empty video slot (`HeroVideo.tsx`)
  - Services product cards (delayed-text hover expand)
  - Gallery coverflow: drag, morph expand, live iframe previews, "start with this style" → dispatches `preselect-style` CustomEvent → Contact form pre-selects
  - Contact form: client-side, mailto fallback (no backend — decision pending), honeypot, error/success states
  - PinnedLogo (IntersectionObserver on `#work`, watermark-weight, hidden <640px)

## In progress
- Nothing half-finished. v1 UI per CLAUDE.md §6 is code-complete in static review: reduced-motion gating audited (Lenis init gated, gallery flat row + crossfade, services instant expand, hero CSS animations off, video no-autoplay), a11y audited (gallery arrows/Enter/Esc, focus into expanded view AND back to trigger on close, global :focus-visible, aria labels), SEO title/description stubbed with TODO(name).

## Next up (ordered) — everything here needs Noah or the live deploy
1. Prove deploy pipeline with Noah (push → Vercel live), then verify ALL features on live + phone-width + reduced-motion in a real browser — nothing is verified outside `npm run build` yet
2. Iframe embed test with 2–3 REAL urls (riskiest assumption; current projects data is empty placeholders that render "In the works")
3. Perf pass against §9 budget (needs deployed URL)
4. Form backend once Noah decides (mailto fallback in place meanwhile)
5. Fill `lib/projects.ts` as real style demos deploy (url, screenshot, embeddable verified manually)

## Gotchas & decisions
- **Display font: Instrument Serif** (body: Inter). Committed 2026-06-10.
- **Form backend is UNDECIDED** — CLAUDE.md §6.7 says Supabase but Noah overrode: ask him before wiring any backend. Contact form ships with mailto fallback (honest error if `SITE.email` is still TBD).
- Gallery ↔ Contact coupling is a `preselect-style` CustomEvent on `window` (Gallery.tsx ~L215, Contact.tsx ~L29).
- Ask Noah before installing anything outside CLAUDE.md §3 stack.
- Ask Noah before pushing to main until he's watched the first deploy go live (main currently ahead 5).
- `next lint` is deprecated (gone in Next 16) — fine for now.
- Tailwind v4: font tokens bridge next/font CSS vars via `@theme inline` in globals.css.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram → `lib/site.ts`; accent color chosen with the name)
- Vercel project connection (his account) + watching first deploy → unblocks pushing
- Form backend decision
- Portfolio: real URLs (also needed for iframe embed test), screenshots (16:10 webp), card order strategy
- Ambient hero video clip (optional — slot exists without it)
