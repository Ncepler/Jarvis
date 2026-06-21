# HANDOFF — updated 2026-06-21 (v31)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v31.
- Page order (Stage 1, intact): Hero → Marquee → Services → Gallery → FullBleed → HowItWorks → ValueProps → AllSites → About → Faq → ClosingCta → Contact → Footer.
- **8** inline demos in `components/demos/`, registered by slug in `index.ts`, shown in the gallery (`lib/projects.ts`). Shared primitives in `system.tsx`.

## v31 — Apex Collision (8th demo: auto body / collision) — this run
- New `components/demos/AutoBodyDemo.tsx`, slug `demo-autobody`, "Apex Collision," Hicksville/Nassau, (516) 555-0143, hello@apexcollision.demo. Graphite-dark §13h theme (bg #0A0C0F, accent #2FA8FF electric blue, ACCENT2 #FF5A2C hot orange used ONLY on urgent CTAs — hero estimate, estimate widget, CTA band). Figures/specs set in `font-mono` for the instrument-readout feel. Tier **custom / "from $500"**, order 7.
- **Motion-heavy §14d, but every moving part is content (§11):** (1) Hero clear-coat shine-sweep over a labeled placeholder; (2) **damage map** — inline side-profile car-outline SVG (`CarOutline`) with 6 hotspots, hover/tap → blue pulse ring + side panel swaps service; tap-chip list below = mobile/reduced path; (3) full-bleed **before/after slider** (`clip-path` drag, blue handle, range input for a11y) → side-by-side on reduced-motion; (4) **paint match** — swatches live-tint the same `CarOutline`; (5) **estimate widget** — vehicle×area×severity → live mono range, "rough estimate, not a quote," CTA → `#apex-contact`; (6) **spec strip** value props (mono figures) + honest `CERT — (placeholder)` chips (no faked certs).
- Spine reused from `system.tsx` (auto-graphite via `--d-*`): header, marquee, Intro, WorkGrid, Faq, CtaBand, footer. **One additive shared change:** `Contact` gained optional `vehicleFields` (Year/Make/Model) + `claimToggle` ("insurance claim") — default-off, other 7 demos untouched.
- `screenshot: ""` (no photo yet) → gallery card shows the graceful "Preview" box; hero shows the labeled placeholder. Verified in-browser: all sections render, spine matches the others, gallery open + "Every site" row + "Start with this style →" all work.

## Recent work (v21 → v27, this run)
- **v21 — demos re-mooded per SKILL §13.** `DemoShell` is theme-driven: pass a `theme: DemoTheme` (palette + onAccent + hero/break scrims + base/display font + radius) and it sets the `--d-*` vars every primitive reads. Dark demos (renovation, landscaping) pass NO theme → dark default. Florist (rose, Fraunces, paper-white), Bakery (amber, Fraunces, cream, 8px radius), Barber (chair-red, Oswald, warm espresso-black), Power-washing (water-blue, cool white), Lawn-care (grass-green, fresh white). **To re-mood, edit a demo's `theme` const only — never the primitives.**
- **v21 — main site:** display face Instrument Serif → **Syne** (`--font-display`). Bone palette was already exact. AllSites "Every site" index is now live: each demo is a "Step inside →" button firing a `vilas:open-demo` window event the Gallery listens for (centers + opens that demo). No more "In the works" anywhere.
- **v22–v24 — demo hero photos.** Each demo has a named hero variable near its top (`firstBakeryImage`, `firstFloristImage`, …) passed as `DemoHero heroImage={…}`; empty string = labeled placeholder. Noah's 7 uploads live in `public/previews/<name>.webp` (compressed from 21 MB of JPGs → **1.9 MB total**, 1920px/q82). The hero renders it full-bleed as the first background; scrim + headline sit on top.
- **v25–v26 — opening reveal end rebuilt** (`VilasReveal.tsx`). The old A/I orbit swap didn't read and its end frame was off (transform-swap can't match because A and I have different glyph widths). Now: at the final beat **V flies out left, S out right, L shrinks to a dot, A & I revolve around center** (A over top, I under bottom) into each other's slots, then V/S/L **spring back with a `backOut` overshoot**. At LAST we render the real VILAS order (`RESOLVED`) with all transforms settling to **zero**, so the **ending frame is pixel-identical to the opening frame.** Added a **Replay button** (mono label + spinning circular-arrow icon) under the CTA that re-runs the reveal from frame 0 via a `runKey`-keyed effect. Dials: `OUT = dist*1.4`, `FINAL_DUR = 1.5s`, the `backOut` eases.
- **v27 — gallery first-load flash fixed** (`Gallery.tsx`). All 7 demo cards render their full markup in SSR; before hydration the motion-value transforms that position them into the coverflow (and `display:none` the off-screen ones) aren't applied, so they briefly piled up visibly then snapped away. Fix: the coverflow row wrapper now ships `opacity:0` whenever `containerW === 0` (true through SSR + first client render → no hydration mismatch), fading in once measured. Verified the SSR HTML carries `opacity:0` on the `role="group"` row.

## v28 — real logo everywhere + gallery load fix + slide-in open (this run, Noah's 3 asks)
- **Logo is now Noah's real mark, used site-wide.** Source `public/vilasLogo.jpg` is a 1254² PNG (dark disc + cream V, solid white bg). Generated `public/vilas-mark.webp` from it via sharp (trim white → square → circle alpha-mask → transparent corners). `Logo.tsx` now renders that webp (was a placeholder SVG circle). New `components/SiteHeader.tsx` = fixed top-left mark, present on the WHOLE page (`app/page.tsx`), `href="#top"` (added `id="top"` to Hero). **Mark-only on purpose:** the cream V still reads over the dark FullBleed band / dark demo panels; a wordmark in `text-ink` would vanish there. Footer brand now leads with the mark. PinnedLogo (gallery watermark/founder card) repointed to opacity dimming (the old `text-ink/35` did nothing to an `<img>`).
- **Gallery load lag fixed (root cause).** The row was mounting all 7 FULL demo components at once (live thumbnails + live backdrop) — that was the "takes a second to load." Now cards show a **static hero image** (`screenshot` on each project → `/previews/first<Niche>Image.webp`); the live `<Demo/>` mounts **only in the open panel**. Removed `DemoScaled` + `DEMO_DESIGN_W`. Backdrop now always uses the static image.
- **Open interaction is now a slide-in, not the tall layoutId FLIP.** Removed the shared `layoutId` from the card media box AND the panel box (the FLIP was animating a full-homepage-height box — the thing flagged for Noah's eyes). The `HomepagePanel` now slides up into place (`y:56→0` + fade, 0.55s) like a drawer. Reduced motion = plain fade. Staggered header text unchanged.

## v29 — one persistent logo + seamless marquees (Noah's 2 asks)
- **Dropped the top-left SiteHeader** (deleted the file + removed from `app/page.tsx`). The brand mark is now ONLY the **bottom-left PinnedLogo**, and it shows **the entire time** (removed the gallery IntersectionObserver gating + the close-on-scroll-away). Still `sm:block` (hidden on phones so it can't crowd the gallery cards) and still click-to-open the founder card. NB this overrides CLAUDE.md §6.4 "gallery-only" — Noah's call.
- **Marquees now loop seamlessly at ANY width.** Both the hero `Marquee` and every demo `DemoMarquee` measured one copy of the row vs the container and rendered exactly enough copies to overfill it, sliding by one copy width. Short term lists (barber/lawncare/etc = 5 words ≈ 1460px for 2 copies) used to run out and gap/reset on a wide monitor before looping — that was the "carousels not infinite." Hero marquee: rAF + `wrap(-rowW,0)` in px, `copies = ceil(viewport/rowW)+1`. DemoMarquee: CSS keyframe to `translateX(calc(-1*var(--mq-w)))` with measured `--mq-w`/`--mq-dur`, same copy count.
- **Gallery coverflow was already infinite** (per-card wrapped-offset drag) — left as-is. If Noah meant that one specifically, re-check, but mechanically it loops.

## v30 — gallery carousel is now FINITE (Noah 2026-06-20)
- Noah wanted the **gallery card row finite/list-based, NOT infinite** (the infinite one to keep is the demo SERVICE MARQUEE — "kids · cuts · fades · beards" — those stay looping, fixed in v29). Reversed the gallery wrap: each card's `d = index - center` (no modulo), `x` is bounded to `[minX, 0]` where `minX = -(count-1)*step`, drag past either end soft rubber-bands (×0.35) and snaps back, `snapTo`/arrows/`centerIdx`/`onSelect` all clamp to `[0, count-1]`, and the AllSites `vilas:open-demo` handler just `snapTo(idx)`. Removed the now-unused `count` prop from `GalleryCard`. So: first card has empty space to its left, last card empties to the right — it clearly starts and ends.

## In progress
- Nothing half-finished. v30 is complete and pushed.

## Next up (ordered)
1. **Noah: eyes on the live URL** — judge (a) the five new demo moods + Syne, (b) the hero photos in each demo, (c) the rebuilt reveal feel: overshoot punch, how far V/S travel, the Replay button + icon spin, and that the end frame == start frame, (d) that the gallery no longer flashes stacked demos on load.
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (form is mailto fallback until then).
3. Still TBD before launch: tagline, email, instagram, founder → `lib/site.ts`; real OG image + favicon; attach vilas.studio domain in Vercel.
4. When more real photos land: drop them into the demos' `<Media>` slots (work grid / services / break) — same pattern as the hero variables; layout is at final ratios so nothing shifts.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping (no theme). LIGHT = florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK + motion = auto body (Apex Collision). Main site = bone/cream + Syne — a separate system; demos NEVER use the bone palette or Syne, the studio NEVER uses a demo palette/serif/demo-serif (Fraunces/Oswald are demo-only).
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
