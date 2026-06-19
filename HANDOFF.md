# HANDOFF — updated 2026-06-19 (v21)

## v21 — Part A fixes + Part B demo re-mood (builds clean: tsc + lint + build, First Load JS 190 kB; NOT yet visually verified — no headless browser in this env, needs Noah's eyes on the live URL)

### Part A — main Vilas site
1. **"Every site" index no longer says "In the works."** `components/sections/AllSites.tsx` is now a client component: each demo is a real clickable entry. No live `url` → a **"Step inside →"** button that dispatches `window` event `vilas:open-demo` (detail = slug); the Gallery listens, centers that card, and opens it into its live panel. If a demo ever gets a real `url`, that row falls back to a "View live →" external link. The two unreachable "In the works" fallback labels in `Gallery.tsx` (only render for a project with no demo AND no screenshot — never true today) were neutralized to "Preview" / "Preview unavailable".
2. **Bone palette confirmed** — `app/globals.css` already had the exact tokens (bg #efe9dd / surface #f6f1e8 / ink #1f1a14 / muted #5f574a / line #d9d0c1 / accent #8a5a2b). No change needed there. **Display face swapped to Syne** (was Instrument Serif): `--font-display: var(--font-syne)`, Syne loaded in `app/layout.tsx`. Section titles + ClosingCta now render in Syne. (CLAUDE.md §5 updated.) Wordmark reveal untouched (still Space Grotesk).

### Part B — five demos re-mooded (SKILL §13)
**The mechanism:** `DemoShell` is now **theme-driven**. It takes an optional `theme: DemoTheme` (palette + `onAccent` + `heroScrim`/`breakScrim` + `font`/`display` + `radius`) and sets every `--d-*` var the primitives read. Dark demos pass no theme → DARK default (unchanged). Light/warm demos pass their §13 theme. **To re-mood a demo, edit only its `theme` const** — structure/section order/copy stay identical.
- **Florist (Wildstem)** → §13a bright & airy: paper-white #FBF8F3, fg #2A2622, rose #B14A63, **Fraunces** serif headers, light scrim.
- **Bakery (Golden Hour)** → §13b warm & inviting: cream #F6EFE2, espresso #2B2018, amber #C9802F, **Fraunces** display, 8px radius (softer), light scrim.
- **Barber (Standard)** → §13c warm vintage dark: espresso-black #14110E (not the cool #0B0B0C), bone #F1EADD, chair-red #B23A3A, **Oswald** condensed display, bone-on-red.
- **Power washing (Tide Line)** → §13d clean & crisp: cool off-white #F4F7F9, ink #14202A, water-blue **#1E86C4** (deepened from #2F9BD4 per §13d for contrast on white), Inter Tight, light cool scrim.
- **Lawn care (Fresh Cut)** → §13e fresh daylight: off-white #F6F8F1, grass-black #1C2417, grass-green #4E9A4A, Inter Tight, light green scrim.
- **Renovation + Landscaping LEFT DARK** — untouched, still `<DemoShell accent={ACCENT}>` with no theme.
- New fonts in `app/layout.tsx`: Syne (studio), Fraunces + Oswald (demo-only). `--d-onaccent` / `--d-hero-scrim` / `--d-break-scrim` / `--d-font` / `--d-display` / `--d-radius` added to the primitives so light moods don't inherit dark scrims/dark-on-accent text.

**Verify on the live URL (needs Noah):** (a) the five re-mooded demos read clearly different from each other and from the dark contractor demos, all still obviously one studio's system; (b) light demos are bright with readable (AA) text, not washed out — check hero text over the light scrim; (c) Syne on the studio section titles reads right; (d) from the "Every site" index, clicking a niche scrolls up and opens that demo's panel (the `vilas:open-demo` wiring).

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v21.
- Page order (Stage 1, intact): Hero → Marquee → Services → Gallery → FullBleed → HowItWorks → ValueProps → AllSites → About → Faq → ClosingCta → Contact → Footer.
- 7 inline demos in `components/demos/`, registered by slug in `index.ts`, shown in the gallery (`lib/projects.ts`). Shared primitives in `system.tsx`.
- Opening reveal (`VilasReveal.tsx`) and the FAQ accordion left untouched this session (both working).

## In progress
- Nothing half-finished. v21 is complete and pushed.

## Next up (ordered)
1. **Noah: eyes on the live URL** — judge the five new demo moods + Syne on the studio site (see "Verify" above). Motion feel (gallery morph, marquee, "step inside" cursor, infinite drag, A/I orbit reveal) still only judgeable live.
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (form is mailto fallback until then).
3. Still TBD before launch: tagline, email, instagram, founder → `lib/site.ts`; real OG image + favicon; attach vilas.studio domain in Vercel.
4. When real photos land: drop them into the demos' `<Media>` slots (labeled with slot + aspect); layout is already at final ratios so nothing shifts.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Demos vary by mood now (SKILL §13).** DARK = renovation + landscaping (no theme). LIGHT = florist/bakery/powerwash/lawncare. WARM-DARK = barber. The main site is bone/cream + Syne — a separate system; demos NEVER use the bone palette or Syne, the studio NEVER uses a demo palette/serif.
- **Re-mooding is a `theme` swap, not a structural one.** Every demo primitive reads `--d-*` vars set by `DemoShell`. Don't fork the primitives per niche.
- **No decorative shapes anywhere in demos** (SKILL §11) — grep `<svg|<circle|rounded-full|clip-path` in `components/demos/` stays empty.
- **Honesty:** demos skip the reviews wall, invent no stats/clients; media is labeled placeholders only (no stock, no AI images).
- **Gallery open** is still the `layoutId` morph; infinite drag carousel; the new `vilas:open-demo` event is the only outside-in entry point. One panel open at a time.
- Motion (not GSAP) does all the work; GSAP installed but unused.

## Supabase (unchanged — RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier. `leads` table + RLS deny-all; `/api/lead` plain fetch → PostgREST. `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder.
- Eyes on the live URL: the five new demo moods + Syne + motion feel.
- Real photos for the demo `<Media>` slots; ambient hero video clip (slot still ready).
