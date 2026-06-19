# HANDOFF — updated 2026-06-19 (v19)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v19. First Load JS 188 kB.
- **This session (v19): demo redesign + main-site palette swap.** Two big changes, both verified via headless Chromium (Playwright, one-off — NOT added to deps):
  1. **All 7 gallery demos restyled to the dark "Axel's / Sallem" system** (new skill `.claude/skills/local-service-design-system/SKILL.md`). They were shape-decorated light pages; now they're near-black, full-bleed, photographic, editorial — zero decorative shapes. Confirmed in-browser: renovation demo opens inline showing eyebrow+accent-tick, two-line headers, numbered service cards (01–06) with labeled 4:3 placeholders, work grid (category tag + caption), numbered value props, FAQ accordion, contact form w/ dropdown, structured footer. Looks like a real hired contractor site.
  2. **Main Vilas site palette: iced/teal → bone/cream** (warm paper, deep-bronze accent). Confirmed: homepage reads warm, wordmark espresso/bronze, gallery thumbnails now show the dark demos. (The little red "3 Issues" pill in screenshots is Next's dev-tools overlay, not the site.)
- **NEW 7th demo: Renovation** (`components/demos/RenovationDemo.tsx`, "Maple & Main Renovation Co.", accent `#C8893F`) — built first per SKILL §9, the reference build the other six match. Added to the gallery as the lead card (`demo-renovation`, order 0, flagship).
- **Shared demo primitives:** `components/demos/system.tsx` — `DemoShell`/`DemoHeader`/`DemoHero`/`DemoMarquee`/`Intro`/`ServiceCards`/`FullBleedBreak`/`WorkGrid`/`ValueProps`/`Faq`/`Contact`/`CtaBand`/`DemoFooter`. Every demo composes these + its niche copy/accent. `DemoShell` sets the dark CSS vars + per-niche `--accent`.
- **New font:** Inter Tight (`--font-tight`) added in `app/layout.tsx`, demo-only. `components/demos/shared.tsx` (old light-page Rise/Marquee) is now unused by the demos but left in place (harmless; remove later if nothing else imports it).
- **Stage 1 (v18) still intact:** Hero → Marquee → Services → Gallery → FullBleed → HowItWorks → ValueProps → AllSites → About → Faq → ClosingCta → Contact → Footer. The main-site sections are token-driven so the palette swap touched them for free.

## In progress
- Nothing half-finished. v19 is complete and pushed.

## Next up (ordered)
1. **Noah: eyes on the live URL.** Judge (a) the bone palette warmth + bronze accent on the real page, (b) the dark demos in the gallery (open a card → it morphs into the full dark demo inline), (c) whether the deep-bronze accent reads premium vs. generic-cream. Motion *feel* (morph smoothness, marquee drift, cursor) still only judgeable live.
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (main-site form is mailto fallback until then).
3. Still TBD before launch: tagline, email, instagram, founder → `lib/site.ts`; real OG image + favicon; attach vilas.studio domain in Vercel.
4. When real photos land: drop them into the demos' `<Media>` slots (labeled with slot + aspect, e.g. `SERVICE — Kitchens (4:3)`); the layout is already at the final ratios so nothing shifts.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Demos = dark editorial, main site = bone/cream — deliberately different systems.** Demos NEVER use the bone palette or the studio serif; the main site NEVER uses the demo dark palette. Read the SKILL before editing any demo and follow its prescribed hexes/sizes/timings — don't improvise demo visuals. (CLAUDE.md §6.9.)
- **No decorative shapes anywhere in demos** (SKILL §11) — grep `<svg|<circle|rounded-full|clip-path` in `components/demos/` should stay empty.
- **Honesty:** demos skip the reviews wall and invent no stats/clients (SKILL §12). Media is labeled placeholders only — no stock, no AI images committed.
- **Demo contact form** is a styled demo (buttons toggle success/error states locally; it does not submit anywhere). That's intentional — it's a style sample, not a working backend.
- **accent-2 is now muted forest `#4a5d43`** (was blue `#2456c9`) so it harmonizes with bone; it's only used on a couple of hover states (About link, PinnedLogo).
- **Gallery open is the `layoutId` morph (brief #1)** — unchanged from v17/v18; the card media FLIP-morphs into the full live demo panel below. Still works post-restyle (verified).
- Motion (not GSAP) does all the work. GSAP still installed but unused.

## Supabase (unchanged — RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier. `leads` table + RLS deny-all; `/api/lead` plain fetch → PostgREST. `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder.
- Eyes on the live URL: bone palette + dark demos + motion feel.
- Real photos for the demo `<Media>` slots; ambient hero video clip (slot still ready).
