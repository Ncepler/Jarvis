# HANDOFF — updated 2026-06-11 (second session of the day)

## Latest: demo upgrade pass (commit 6a954cd)
Noah: demos "too blocky, need more, I'm selling these." All six rebuilt per the skills:
- `components/demos/shared.tsx` — demo-only motion kit: `Rise` (Motion whileInView scroll reveal) + `Marquee` (pure-CSS seamless ticker, two copies translating -50%, linear). Both reduced-motion aware. Demos stay self-contained otherwise.
- Each demo now has: scroll-staggered section reveals, a ticker, hover lifts/row slides (Tailwind v4 hover: is already hover-capable-only), organic/asymmetric layout instead of identical card grids (impeccable ban), and a signature piece — lawncare drifting clouds + rotated scene + "Mowing since sunrise" badge; powerwash self-wiping before/after (animated clip-path) + angled section edges + numbered service rows; florist falling petals + three different offering shapes; bakery rotating "BAKED FRESH DAILY" stamp (SVG textPath); barber ghost "Sharp." outline behind hero + spinning pole; landscaping three arched garden panels + serif materials ticker + pull quote explicitly labeled "sample quote for this demo" (integrity rule: no fake testimonials presented as real).
- Perf watch: every demo mounts 2-3× (card thumb, backdrop, panel) and now carries reveals + tickers. Build is clean; REAL phone check still pending.

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — push to main auto-deploys
- Builds clean: yes (build + tsc + lint pass)
- **Design skills are HERE**: `.claude/skills/` now has `design` (Emil Kowalski animation philosophy), `impeccable` (design laws + sub-commands), `ui ux pro max` (UX checklists + search CLI). All three READ and APPLIED this session. Follow them for any future design work.

## Done this session (committed + pushed, commit 78daaa1)
- **Warm palette lift** (Noah: "a little too black and colorless, don't want really colorful"): neutrals tinted toward a warm hue in OKLCH (bg/surface same lightness as before, hue ~75), new `--color-accent` = muted brass `oklch(78% 0.07 75)`. Used restrained (≤10%): price tags, hero "See the work" + scroll cue, panel bar labels, selected form chip, focus rings, link hovers. NOT the generic AI acid-green/purple. CLAUDE.md §5 still says "no accent until brand" — Noah overrode 2026-06-11; accent may shift when the name lands.
- **Gallery: no-click browsing** (Noah): the homepage panel below the row now ALWAYS shows whichever card is centered — click only snaps cards or scrolls the panel into view (Enter does too). Panel content settles 160ms after centering (so flings don't mount every demo), then unfolds from the row (origin-top scale+rise 0.55s, exit 0.16s). Esc/close-button machinery removed. Reduced motion: tap a card to pick, fade swap. Backdrop already followed center.
- **Demo motion** (all CSS keyframes inside each demo file, transform/opacity only, `prefers-reduced-motion` gated): barber pole actually spins (striped strip translating, the explicit ask), lawn-care sun drifts, florist stems sway, bakery steam rises staggered, powerwash wand sweeps, landscaping plan circles breathe.
- **Founder business card**: `SITE.founder` added ("FOUNDER_NAME_TBD"). PinnedLogo is now a button (pointer-events on, cursor-pointer) that morphs via Motion `layoutId` into a ~300×180 dark card: founder name (display face), "Designer · SITE.name", region, email + Instagram (hidden while `_TBD`). Close: ×, Esc, outside click; reduced motion = fade not morph; auto-closes when the gallery leaves the viewport; still hidden <640px (logo always was — note: that means no card on phones; revisit if Noah wants it there). CLAUDE.md §6.4 still says "not a button" — Noah overrode, said NOT to update CLAUDE.md.
- **Hero flattened**: just the name on the one flat warm-dark color (ambient radial glow removed, `ambient` keyframes deleted). Video slot still wired for later.
- **Copy pass**: "we reply within a day" gone (Noah: "too AI") → "Got it. We'll be in touch." / "Tell us about the business. A couple sentences is plenty." The word "template" no longer appears anywhere user-facing (priceLabels now "~$300" / "from $500" / "let's talk"; `tier: "template"` stays as internal enum only). Em dashes swept from all user-facing copy incl. demos (impeccable ban).
- `.press` utility in globals.css = Emil's active-scale press feedback; applied to contact submit + card close. Do NOT put CSS transform transitions on motion.* elements (fights Motion's per-frame transforms).

## In progress
- Nothing half-finished.

## Next up (ordered)
1. Verify on live + phone + reduced-motion in a real browser: panel-follows-center while dragging (feel of the 160ms settle), the unfold transition, barber pole spin (renders 3×: card/backdrop/panel), founder card morph, new accent (is brass enough color for Noah?).
2. Perf: 6 inline demos in the row + 1 full-size in the always-open panel + animations. Check main-thread on a phone against §9 budget.
3. Form backend when Noah decides; brand name still blocks lib/site.ts (incl. new `founder`).

## Gotchas & decisions
- Design skills (above) now govern styling work; read them at session start when doing design.
- Demo conventions: self-contained colors, sample brands + 555 numbers, laid out for DEMO_DESIGN_W=1280, per-demo anchor prefixes, keyframes + class names prefixed per demo (barber-, lawn-, florist-, bake-, land-, pw-).
- Vercel: `vercel.json` pins framework=nextjs (don't delete); deployment protection was disabled 2026-06-10.
- Display font Instrument Serif / body Inter. Mirror-preview mechanism (scripts/mirror.mjs + AutoFrame) kept but unused.
- Gallery ↔ Contact: `preselect-style` CustomEvent.
- Ask Noah before installs outside CLAUDE.md §3; don't update CLAUDE.md without him asking.

## Blocked on Noah
- Brand name (+ domain, tagline, email, Instagram, founder display name → `lib/site.ts`)
- Form backend decision
- Look over the accent color + demo picks (bakery/barbershop were my choice for the "1-2 more")

## Noah's prompt this session (pasted verbatim so we can resume if cut off — ALL of it is DONE except live-browser verification)
> ok - i added 3 skills. using fable, read them, and adjust the website to madhere to them. i wasnt more motion. the website is a little too black and colorless. i dont watn really colorful, but its a little slightly bland right now. also lets add some motion. for example - ont eh barbebrshop we could make that spinny thing acutally spin. teh custom websites inside need to be a bit more. also i ebleive its int eh claude.md file but anyway ill explain. add this: Add a click interaction to the corner Logo component in the gallery section. When clicked (tapped on mobile), the logo morphs into a small business card overlay — a personal card about me, not the studio. First: add a `founder` field to SITE in lib/site.ts with placeholder "FOUNDER_NAME_TBD" so the name isn't hardcoded. Card content, all pulled from SITE: {SITE.founder} (largest, top) / Designer · {SITE.name} / {SITE.region} / {SITE.email} / {SITE.instagram}. Behavior: Use Motion's layoutId — the same element morphs from logo into card, not a swap / ~300×180px, dark to match the site, hairline border, subtle shadow / Logo pointer-events auto + cursor-pointer / Close on outside click, Esc, or × / Mobile: tap to open / Reduced motion: fade / Cannot be open same time as expanded gallery card / Logo only appears in gallery section. Don't update CLAUDE.md. Update HANDOFF.md when done. also - right now when scrolling thourgh the demo websites i could be on the barbershop one up top but sincei came formt eh lawncare and dint click ti yet, its still lawn care. tehre should be a cool transition where it appears like the website morphs out from the card. if you think aboutt hat and you dont think you can get that to work perfectly seamlessly, then skip it, but the necesary part is to hace it so you dont need to click each card int eh catalog to view it, just depending on the card youre actually on is the website so no necesarry clicking. also the very frist thing that people see is just my company name and a 1 color (yes ig with a little white in it) background - dont do anythign crazy - maybe int eh future ill add a video in teh back but for now thats not an issue. also the words are too ai - like "we reply within a day" like no. also the template should not appear anywhere - although technically these yes are templates - it sounds wird for teh client to pick from a template. so yeah edit that - everything i said - if you get to 90% toeksn used then tell teh handoff everything thats been done - paste this prompt into there just so if you get stopped we can cotinue wehne teh limit resets and we know whats going on
