# HANDOFF — updated 2026-06-11

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — LIVE and public (200, verified 2026-06-10). Pipeline proven: push to main → Vercel auto-deploys. Repo: github.com/Ncepler/Jarvis, Vercel project: nceplers-projects/jarvis
- Builds clean: yes (build + tsc + lint all pass)
- Done (committed, NOT verified on live deploy or phone yet):
  - Scaffold (Next 15.5 / React 19 / Tailwind v4 / TS strict, tokens, fonts, `lib/site.ts`, Logo placeholder)
  - Page shell, all sections real copy (Hero → Services → Gallery → All Sites → About → Contact)
  - Hero with empty video slot (`HeroVideo.tsx`)
  - Services product cards (delayed-text hover expand)
  - Gallery coverflow: drag, snap, click active card → site's REAL homepage opens below the row, physically part of the page
  - Contact form: client-side, mailto fallback (no backend — decision pending), honeypot, error/success states; style select live (all 6 demos are isStyleDemo:true)
  - PinnedLogo, a11y pass, reduced-motion pass, scroll-reveal pass, SEO stubs with TODO(name)
  - **Placeholders GONE (2026-06-11, Noah request):** Nike/Apple/etc. removed entirely — projects.ts is now SIX of our own inline style demos in `components/demos/`: Landscaping "Stone & Sage" (flagship, order 0), Power washing "Tide Line" (template), Flower shop "Wildstem" (custom), Lawn care "Fresh Cut" (template), Bakery "Golden Hour" (template), Barbershop "Standard Barber Co." (custom). All sample brands, 555 phone numbers, distinct self-contained palettes. thum.io helper + remotePattern + ph-*.html mirrors deleted; mirror.mjs + AutoFrame mechanism kept for future third-party needs.
  - **Open panel is framed (2026-06-11, Noah request):** the homepage no longer goes edge-to-edge — slim gutter of our bg + hairline border around it (Gallery.tsx HomepagePanel) so you can tell you're still on the studio site.

## In progress
- Nothing half-finished.

## Next up (ordered)
1. Verify on live + phone-width + reduced-motion in a real browser: all 6 demos as card thumbnails (DemoScaled at card width), as section backdrop, and open in the framed panel. Nothing is verified beyond build + curl grep.
2. Perf pass against §9 budget — 6 inline demos now render scaled in the card row simultaneously; check main-thread cost on mobile. No remote images remain anywhere.
3. Form backend once Noah decides (mailto fallback in place meanwhile)
4. Demo `url` fields are empty → All Sites rows say "In the works" and the panel has no "View live →". Fill in when/if demos get deployed standalone.

## Gotchas & decisions
- **Noah will upload design skills later** — when new design-related skills appear in the environment, READ AND FOLLOW THEM before any styling/design work. Standing feedback (2026-06-10): the site was too dark → palette lifted (bg #161618, muted #a6a29b, line 0.18, surface #1f1f22). Still dark + monochrome, no accent until the name lands.
- **Demo conventions** (set across the 6 demos): self-contained colors via local Tailwind arbitrary values, sample brand + 555 number, laid out for DEMO_DESIGN_W=1280 (Gallery scales them for thumbnails/backdrop), `id`/`href` anchors prefixed per demo (e.g. #wash-quote) so they don't collide on the one-page site. font-display (Instrument Serif) is the only shared token they use.
- **Gallery backdrop** crossfades with the centered card (`useMotionValueEvent` on x → `centerIdx`); with screenshots empty it always uses DemoScaled. Off under reduced motion.
- **Mirrored-preview mechanism kept but unused** — scripts/mirror.mjs + AutoFrame + `preview` field stay for third-party sites; all ph-*.html copies deleted. Patagonia bot-walls scripted fetches if that ever comes back.
- **Vercel 404 root cause (fixed 2026-06-10):** framework preset locked to "Other" on import → `vercel.json` pins `"framework": "nextjs"` — don't delete that file.
- **Vercel Deployment Protection was ON by default** — disabled 2026-06-10. If a new Vercel project is ever created, check this setting again.
- **Display font: Instrument Serif** (body: Inter). Committed 2026-06-10.
- **Form backend is UNDECIDED** — CLAUDE.md §6.7 says Supabase but Noah overrode: ask him before wiring any backend.
- Gallery ↔ Contact coupling is a `preselect-style` CustomEvent on `window` (Gallery.tsx, Contact.tsx).
- Ask Noah before installing anything outside CLAUDE.md §3 stack.
- `next lint` is deprecated (gone in Next 16) — fine for now.
- Tailwind v4: font tokens bridge next/font CSS vars via `@theme inline` in globals.css.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram → `lib/site.ts`; accent color chosen with the name)
- Form backend decision
- Sign-off on the 6 demo designs/sample brands (he asked for powerwash/lawncare/landscaping/florist "and 1-2 more" — bakery + barbershop were my picks)
- Ambient hero video clip (optional — slot exists without it)
