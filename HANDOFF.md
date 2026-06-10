# HANDOFF — updated 2026-06-10

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — LIVE and public (200, verified 2026-06-10). Pipeline proven: push to main → Vercel auto-deploys. Repo: github.com/Ncepler/Jarvis, Vercel project: nceplers-projects/jarvis
- Builds clean: yes (build + tsc + lint all pass, locally and on Vercel)
- Done (committed, NOT verified on live deploy or phone yet):
  - Scaffold (Next 15.5 / React 19 / Tailwind v4 / TS strict, tokens, fonts, `lib/site.ts`, Logo placeholder)
  - Page shell, all sections real copy (Hero → Services → Gallery → All Sites → About → Contact)
  - Hero with empty video slot (`HeroVideo.tsx`)
  - Services product cards (delayed-text hover expand)
  - Gallery coverflow: drag, morph expand, live iframe previews, "start with this style" → dispatches `preselect-style` CustomEvent → Contact form pre-selects
  - Contact form: client-side, mailto fallback (no backend — decision pending), honeypot, error/success states
  - PinnedLogo (IntersectionObserver on `#work`, watermark-weight, hidden <640px)

## In progress
- Nothing half-finished. v1 UI per CLAUDE.md §6 is code-complete: reduced-motion gating audited, a11y audited (gallery arrows/Enter/Esc, focus in + back on close, :focus-visible, aria labels), SEO stubbed with TODO(name), scroll-reveal motion pass done (`components/Reveal.tsx` on all section headings, services stagger, all-sites rows).

## Next up (ordered) — everything here needs Noah or the live deploy
1. Verify ALL features on live + phone-width + reduced-motion in a real browser — nothing is verified beyond builds + curl
2. Perf pass against §9 budget (needs deployed URL; note: 6 placeholder cards now load remote thum.io screenshots)
3. Form backend once Noah decides (mailto fallback in place meanwhile)
4. **Replace placeholder portfolio entries** in `lib/projects.ts` (Nike/Adidas/Apple/Patagonia/Terminal/Relats — Noah requested 2026-06-10 as stand-ins; MUST be swapped for real style demos before any prospect sees the site). Real entries need: url, own 16:10 webp screenshot in /public/work/, embeddable verified by header check, isStyleDemo flags (placeholders are all false, so the contact form's style select is currently hidden — it returns when real demos with isStyleDemo:true land)

## Gotchas & decisions
- **Iframe embed test DONE (2026-06-10)** — the riskiest assumption is retired. Header check (`x-frame-options` / CSP `frame-ancestors`): nike, adidas, apple, stripe, linear, igloo.inc, lusion, area17 all BLOCK framing; patagonia, terminal-industries, relats ALLOW. Default `embeddable:false` confirmed correct; always verify per-site before flipping.
- **Placeholder screenshots come from thum.io** (`image.thum.io` in next.config remotePatterns). WordPress mshots was tried first but 403s datacenter IPs (incl. Vercel's image optimizer). Both the remotePattern and the `shot()` helper in lib/projects.ts go away with the placeholders.
- **Vercel 404 root cause (fixed 2026-06-10):** project was imported while main only had CLAUDE.md, so Vercel locked framework preset to "Other" → builds failed with `No Output Directory named "public"`. Fixed by `vercel.json` pinning `"framework": "nextjs"` — don't delete that file.
- **Vercel Deployment Protection was ON by default** (401/SSO wall for anonymous visitors) — disabled 2026-06-10 via API (`ssoProtection: null`). If a new Vercel project is ever created, check this setting again.
- Push gate is CLEARED — first deploy proven end-to-end; normal push-per-feature from now on.
- **Display font: Instrument Serif** (body: Inter). Committed 2026-06-10.
- **Form backend is UNDECIDED** — CLAUDE.md §6.7 says Supabase but Noah overrode: ask him before wiring any backend. Contact form ships with mailto fallback (honest error if `SITE.email` is still TBD).
- Gallery ↔ Contact coupling is a `preselect-style` CustomEvent on `window` (Gallery.tsx ~L215, Contact.tsx ~L29).
- Ask Noah before installing anything outside CLAUDE.md §3 stack.
- `next lint` is deprecated (gone in Next 16) — fine for now.
- Tailwind v4: font tokens bridge next/font CSS vars via `@theme inline` in globals.css.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram → `lib/site.ts`; accent color chosen with the name)
- Form backend decision
- Portfolio: real URLs (also needed for iframe embed test), screenshots (16:10 webp), card order strategy
- Ambient hero video clip (optional — slot exists without it)
