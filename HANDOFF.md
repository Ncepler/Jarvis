# HANDOFF — updated 2026-06-11

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
  - **Gallery rework (2026-06-11, Noah request):** click a card → the site's REAL homepage opens in an inline panel below the row, interactive, on desktop AND mobile. Homepage code is mirrored into `public/previews/<slug>.html` (capture: `node scripts/mirror.mjs <slug> <url>`, or paste view-source HTML + `<base href>`). Served from our origin → X-Frame-Options can't block it; iframe sandboxed without allow-top-navigation. Fallbacks: live iframe (desktop, embeddable:true) → screenshotFull. Add-a-site steps documented at top of `lib/projects.ts`. CLAUDE.md §6.3/§7 updated to match.

## In progress
- Nothing half-finished. v1 UI per CLAUDE.md §6 is code-complete: reduced-motion gating audited, a11y audited (gallery arrows/Enter/Esc, focus in + back on close, :focus-visible, aria labels), SEO stubbed with TODO(name), scroll-reveal motion pass done (`components/Reveal.tsx` on all section headings, services stagger, all-sites rows).

## Next up (ordered) — everything here needs Noah or the live deploy
1. Verify ALL features on live + phone-width + reduced-motion in a real browser — nothing is verified beyond builds + curl. Especially the mirrored previews: confirm nike/apple/allbirds/terminal/relats actually render inside the panel (their JS runs against our origin — some may degrade)
2. Perf pass against §9 budget (needs deployed URL; note: 6 placeholder cards now load remote thum.io screenshots)
3. Form backend once Noah decides (mailto fallback in place meanwhile)
4. **Replace placeholder portfolio entries** in `lib/projects.ts` (Nike/Adidas/Apple/Patagonia/Terminal/Relats — Noah requested 2026-06-10 as stand-ins; MUST be swapped for real style demos before any prospect sees the site). Real entries need: url, own 16:10 webp screenshot in /public/work/, embeddable verified by header check, isStyleDemo flags (placeholders are all false, so the contact form's style select is currently hidden — it returns when real demos with isStyleDemo:true land)

## Gotchas & decisions
- **Noah will upload design skills later** — when new design-related skills appear in the environment, READ AND FOLLOW THEM before any styling/design work. Until then his standing feedback (2026-06-10): the site was too dark.
- **Palette lifted 2026-06-10** (Noah: "so dark, hard to look at"): bg #0b0b0c → #161618, muted → #a6a29b, line opacity 0.12 → 0.18, new `--color-surface` #1f1f22 for cards. Still dark + monochrome — NOT light mode, still no accent until the brand name lands.
- **Gallery backdrop** (Noah request): active card's homepage screenshot fills the section behind the row, crossfades while dragging — tracked via `useMotionValueEvent` on the row's x (`centerIdx` state), not just on snap. Cards bumped to min(78vw, 860px). Off under reduced motion.
- **Iframe embed test DONE (2026-06-10)** — header check (`x-frame-options` / CSP `frame-ancestors`): nike, adidas, apple, stripe, linear, igloo.inc, lusion, area17 all BLOCK framing; patagonia, terminal-industries, relats ALLOW. Mostly moot now that previews are mirrored from our own origin, but `embeddable` still gates the live-iframe fallback.
- **Patagonia bot-walls scripted fetches** (Akamai "botfailover" page) — no usable mirror; its `preview` is empty so the panel uses the live-iframe fallback (it allows framing). Retry capture from a residential connection if it matters.
- **Mirrored previews are placeholder-only territory** — they're copies of Nike/Apple/etc. code served from our domain. Fine for demoing the gallery to ourselves; must be replaced with Noah's own builds before any prospect sees the site (already tracked in Next up #4).
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
