# HANDOFF — updated 2026-06-19 (v17)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v17. First Load JS 184 kB. Page also smoke-tested via `next dev` + curl: HTTP 200, zero runtime/hydration error markers, all new sections present in SSR HTML.
- **Stage 1 shipped (2026-06-19): editorial + Lusion-motion pass.** Goal = read a clear tier above the templates we sell (Axel's / Sallem's structure × Lusion craft). New page order: Hero → Marquee → Services → Gallery → FullBleed → HowItWorks → ValueProps → AllSites → About → Faq → ClosingCta → Contact → Footer. All new work is token-driven (bg/surface/ink/muted/line/accent), so it survives any palette swap untouched. Full detail in CLAUDE.md §6.8.
  - `components/SectionHeading.tsx` — two-line oversized headers w/ per-line mask reveal, used in every section. Copy in `COPY.headings`.
  - `components/Marquee.tsx` — niche marquee, scroll-velocity nudged, reduced-motion → static wrap.
  - `components/sections/FullBleed.tsx` — the dark full-bleed break (reveal motif `VAL`, parallax). No fabricated screenshot.
  - `components/sections/ValueProps.tsx` — numbered 01–04 honest differentiators.
  - `components/sections/ClosingCta.tsx` — final oversized CTA band → `#contact`.
  - `components/sections/Faq.tsx` — now a numbered Q01– accordion.
  - `Gallery.tsx` — `category` + `caption` on cards (live mini-previews), hover lift+sharpen, trailing "step inside →" cursor (hover-only). **Open = `layoutId` morph (brief #1):** click the centered card → its media box FLIP-morphs into the full live demo panel below; Close ✕ / Esc / drag closes it. Stays in-page (no floating window). Replaced the 2026-06-11 always-on panel.
  - `Footer.tsx` — Navigate / What we do / Contact columns.
  - `Services.tsx` / `HowItWorks.tsx` — big 0N numerals; Services keeps the hover-expand product-card pattern.
  - `lib/projects.ts` — `Project` gained `category` + `caption`.
- **PALETTE RESOLVED → iced/light (Noah, 2026-06-19).** `globals.css` stays as-is; CLAUDE.md §5 token block reconciled to match (was stale warm-espresso). The page reads light; the single dark cinematic beat is the FullBleed band (`bg-ink`). Everything is token-driven, so a future swap is still one file.

## In progress
- Nothing half-finished. Stage 1 is complete and pushed.

## Next up (ordered)
1. **Noah: real-browser pass on the live URL.** Codespace has no browser — motion is verified by build/types + a dev-server SSR smoke test, but not visually/interactively. Specifically eyeball: the gallery **card→demo `layoutId` morph** (tall-box FLIP feel + the scroll-into-view on open), the "step inside →" cursor, marquee drift + scroll nudge, mask-reveal headers, FullBleed parallax, FAQ accordion, mobile tap-to-open, and reduced-motion (everything degrades to static/flat).
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (form is mailto fallback until then).
3. Still TBD before launch: tagline, email, instagram, founder → `lib/site.ts`; real OG image + favicon; attach vilas.studio domain in Vercel.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Gallery open is now the `layoutId` morph (brief #1), not the always-on panel.** Card media + open-panel demo share `layoutId={`demo-<slug>`}`; the hover lift rides an INNER element so its transform doesn't fight the layout FLIP; the panel mounts WITHOUT AnimatePresence `mode="wait"` so it's measured on the same commit as the click (required for the FLIP). Open scroll uses `block:"nearest"` + 90ms delay so smooth-scroll doesn't disrupt the measure. Watch item: panel = full homepage height, so the FLIP animates a tall box — confirm feel in-browser.
- **No fabricated media:** FullBleed uses the brand reveal motif, not a fake site screenshot (§7 honesty rule). Only generated media allowed is Noah's ambient video.
- Motion, not GSAP, still does all the work (consistent with Stage 0). GSAP remains installed but unused.
- Marquee uses two stacked copies + `wrap(-50,0)` for the seamless loop; reduced-motion branch renders individual wrapping spans (the nowrap track would overflow on mobile).

## Supabase (unchanged — RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier. `leads` table + RLS deny-all; `/api/lead` plain fetch → PostgREST. `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder.
- Real-browser + phone pass on the live URL (motion, reduced-motion).
- Ambient hero/power-wash video clips (slots still ready).
