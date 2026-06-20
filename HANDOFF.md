# HANDOFF — updated 2026-06-20 (v27)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v27.
- Page order (Stage 1, intact): Hero → Marquee → Services → Gallery → FullBleed → HowItWorks → ValueProps → AllSites → About → Faq → ClosingCta → Contact → Footer.
- 7 inline demos in `components/demos/`, registered by slug in `index.ts`, shown in the gallery (`lib/projects.ts`). Shared primitives in `system.tsx`.

## Recent work (v21 → v27, this run)
- **v21 — demos re-mooded per SKILL §13.** `DemoShell` is theme-driven: pass a `theme: DemoTheme` (palette + onAccent + hero/break scrims + base/display font + radius) and it sets the `--d-*` vars every primitive reads. Dark demos (renovation, landscaping) pass NO theme → dark default. Florist (rose, Fraunces, paper-white), Bakery (amber, Fraunces, cream, 8px radius), Barber (chair-red, Oswald, warm espresso-black), Power-washing (water-blue, cool white), Lawn-care (grass-green, fresh white). **To re-mood, edit a demo's `theme` const only — never the primitives.**
- **v21 — main site:** display face Instrument Serif → **Syne** (`--font-display`). Bone palette was already exact. AllSites "Every site" index is now live: each demo is a "Step inside →" button firing a `vilas:open-demo` window event the Gallery listens for (centers + opens that demo). No more "In the works" anywhere.
- **v22–v24 — demo hero photos.** Each demo has a named hero variable near its top (`firstBakeryImage`, `firstFloristImage`, …) passed as `DemoHero heroImage={…}`; empty string = labeled placeholder. Noah's 7 uploads live in `public/previews/<name>.webp` (compressed from 21 MB of JPGs → **1.9 MB total**, 1920px/q82). The hero renders it full-bleed as the first background; scrim + headline sit on top.
- **v25–v26 — opening reveal end rebuilt** (`VilasReveal.tsx`). The old A/I orbit swap didn't read and its end frame was off (transform-swap can't match because A and I have different glyph widths). Now: at the final beat **V flies out left, S out right, L shrinks to a dot, A & I revolve around center** (A over top, I under bottom) into each other's slots, then V/S/L **spring back with a `backOut` overshoot**. At LAST we render the real VILAS order (`RESOLVED`) with all transforms settling to **zero**, so the **ending frame is pixel-identical to the opening frame.** Added a **Replay button** (mono label + spinning circular-arrow icon) under the CTA that re-runs the reveal from frame 0 via a `runKey`-keyed effect. Dials: `OUT = dist*1.4`, `FINAL_DUR = 1.5s`, the `backOut` eases.
- **v27 — gallery first-load flash fixed** (`Gallery.tsx`). All 7 demo cards render their full markup in SSR; before hydration the motion-value transforms that position them into the coverflow (and `display:none` the off-screen ones) aren't applied, so they briefly piled up visibly then snapped away. Fix: the coverflow row wrapper now ships `opacity:0` whenever `containerW === 0` (true through SSR + first client render → no hydration mismatch), fading in once measured. Verified the SSR HTML carries `opacity:0` on the `role="group"` row.

## In progress
- Nothing half-finished. v27 is complete and pushed.

## Next up (ordered)
1. **Noah: eyes on the live URL** — judge (a) the five new demo moods + Syne, (b) the hero photos in each demo, (c) the rebuilt reveal feel: overshoot punch, how far V/S travel, the Replay button + icon spin, and that the end frame == start frame, (d) that the gallery no longer flashes stacked demos on load.
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (form is mailto fallback until then).
3. Still TBD before launch: tagline, email, instagram, founder → `lib/site.ts`; real OG image + favicon; attach vilas.studio domain in Vercel.
4. When more real photos land: drop them into the demos' `<Media>` slots (work grid / services / break) — same pattern as the hero variables; layout is at final ratios so nothing shifts.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping (no theme). LIGHT = florist/bakery/powerwash/lawncare. WARM-DARK = barber. Main site = bone/cream + Syne — a separate system; demos NEVER use the bone palette or Syne, the studio NEVER uses a demo palette/serif/demo-serif (Fraunces/Oswald are demo-only).
- **Re-mooding a demo = a `theme` swap, not a structural one.** Every primitive reads `--d-*` vars set by `DemoShell`. Don't fork primitives per niche.
- **Demo hero images** live in `public/previews/first<Niche>Image.webp`; the per-demo `first<Niche>Image` const points at them. Keep new demo photos compressed (≤~0.5 MB each, WebP) — the gallery renders all demos at once.
- **Gallery first-load:** the coverflow row is hidden (`opacity:0`) until `containerW > 0`. Don't remove that or the stacked-demo flash returns.
- **Reveal:** ending frame MUST equal the opening frame — achieved by rendering `RESOLVED` order at LAST with transforms settling to 0. Don't switch back to a transform-only swap (glyph widths differ → spacing off).
- **No decorative shapes anywhere in demos** (SKILL §11). **Honesty:** no fake reviews/stats; media is labeled placeholders / real photos only.
- Motion (not GSAP) does all the work; GSAP installed but unused. New fonts: Syne (studio), Fraunces + Oswald (demos), in `app/layout.tsx`.

## Supabase (unchanged — RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier. `leads` table + RLS deny-all; `/api/lead` plain fetch → PostgREST. `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder.
- Eyes on the live URL: demo moods, hero photos, reveal feel, gallery load.
- More real photos for the demo `<Media>` slots (work grid / services / break); ambient hero video clip (slot still ready).
