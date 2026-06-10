# HANDOFF — updated 2026-06-10

## Current state
- Deployed: NOT YET — pipeline not proven. Repo: github.com/Ncepler/Jarvis, builds clean locally: yes (build + tsc + lint all pass)
- Done: step 1 scaffold — Next 15.5 / React 19 / Tailwind v4 / TS strict, tokens in `@theme` (`app/globals.css`), fonts via next/font, `lib/site.ts` (all values TBD), `components/Logo.tsx` placeholder mark, eslint flat config

## In progress
- Deploy pipeline proof — next concrete step: Noah watches first push → Vercel deploy end-to-end, then one trivial change pushed to prove the loop

## Next up (ordered)
1. Prove deploy pipeline (push → Vercel live, twice)
2. Step 2: page shell — all sections stubbed with real copy (Hero → Services → Gallery → All Sites → About → Contact)
3. Step 3: hero (with empty video slot)
4. Step 4: services product-card tiles
5. Step 5: gallery (iframe embed test with real URLs EARLY)
6. Step 6: All Sites, About, Contact — **ASK NOAH about form backend first (see gotchas)**
7. Step 7: pinned logo, reduced-motion, a11y, perf passes
8. Step 8: SEO/meta stubs

## Gotchas & decisions
- **Display font: Instrument Serif** (body: Inter). Committed 2026-06-10.
- **Form backend is UNDECIDED** — Supabase vs Resend vs other. CLAUDE.md §6.7 says Supabase but Noah overrode: ask him before building step 6. Don't assume.
- Ask Noah before installing anything outside CLAUDE.md §3 stack.
- Ask Noah before pushing to main until he's watched the first deploy go live end-to-end (then normal push-per-feature).
- `next lint` is deprecated (gone in Next 16) — fine for now, migrate to eslint CLI only if it breaks.
- Tailwind v4: font tokens bridge next/font CSS vars via `@theme inline` in globals.css.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram → `lib/site.ts`; accent color chosen with the name)
- Vercel project connection (his account) + watching first deploy
- Form backend decision (before step 6)
- Portfolio: real URLs, screenshots (16:10 webp), card order strategy
- Ambient hero video clip (optional — slot will exist without it)
