---
name: local-service-design-system
description: >
  The visual design system for Vilas demo sites for local trade/service businesses
  (renovation/remodeling, landscaping, power washing, lawn care, florist, bakery, barber, auto body).
  Reverse-engineered from two real, high-quality sites built on the same template family:
  axelslandscapingdesign.com (landscaping) and sallemllc.pages.dev (general contractor),
  then extended per niche with patterns observed from real barber, bakery, power-washing, and
  automotive sites (see §0). Use this whenever building or restyling a Vilas DEMO site. It makes the demos
  look like real, hired-contractor websites — photographic and editorial — NOT like abstract,
  shape-decorated AI pages. The niches no longer differ by PALETTE alone: the services and
  "why us" sections, the palette, and the type all adapt to what each business actually is, so
  a barber reads as a barber and a bakery as a bakery — not one template recolored. Demos vary:
  renovation is DARK, landscaping is FOREST-DARK, florist + bakery + power washing + lawn care
  are LIGHT, barber is a WARM LEATHER-LOUNGE dark, auto body is GRAPHITE-DARK & motion-heavy —
  see §13 and §14. The main Vilas studio site
  uses its own separate bone palette + the Syne display face, never used on demos.
---

# Local-Service Demo Design System ("the Axel's / Sallem look")

## 0. Read this first

**What it is.** Axel's and Sallem are the *same underlying template*, re-skinned for two trades (same Cloudflare Stream video host, identical section skeleton, identical near-black theme color `#0b0b0c`). That is exactly Vilas's model — one strong system, re-flavored per niche. So this isn't loose inspiration; it's a working blueprint.

**The one-line essence:** *A full-bleed, photographic, editorial site. Real photos and video carry all the color. Big two-line headers, small uppercase eyebrows, numbered sections, hairline rules. Disarming, plain, local copy. One accent color per business, used about twice a screen. Zero decorative geometric shapes. The **spine** is shared across every niche, but the **services and "why us" sections, the palette, and the type adapt to what the business actually is** (a barber shows a price board, a bakery a menu, a power washer before/afters) — so the demos look like different real businesses, not one template recolored.*

**Sourcing note (important for the builder).** The *structure, section order, and copy patterns* of the base system are observed directly from the two live sites and are accurate. The *specific color hexes, type sizes, spacing, radii, and motion timings* are NOT readable from HTML — they are prescribed build specs in this file. Treat the prescribed values as the spec and follow them exactly; do not invent your own.

**Reference sites by niche (observed for PATTERNS, never copied):**
- **Renovation / landscaping (the base system):** axelslandscapingdesign.com, sallemllc.pages.dev.
- **Barber:** Fellow Barber, Abel's on Queen, Hagi's, Huckle the Barber, Mann Grooming. Patterns: vintage/retro, warm browns + cream OR black/gold/deep-red, serif or condensed-signage type, the cut list shown as a **price menu/board**, real warm shop photography (leather, chrome, the chair).
- **Bakery:** Debaere (moody-dark with golden food photography), Creswell (huge bold close-ups), Firebrand Artisan Breads, Eclair, Cobs Bread. Patterns: warm browns/golds/creams, **big appetizing photography**, content organized like a **menu** by category (bread / pastry / cakes / seasonal).
- **Power washing:** broad pattern across the category — the site is built around **dramatic before/after galleries**, blue + white, and a one-tap quote. The transformation is the whole pitch.
- **Auto body / collision:** premium shops run **dark and atmospheric** with a gold or red accent — Mike's Auto Body North ("The Art of Repair, Driven By Passion"), Burnsed Body Shop ("The Quality of Yesterday With the Knowledge of Today"), Drive Auto Repair. The slick, motion-heavy end of the automotive world (detailing / ceramic / restoration studios — Chicago Auto Pros, Kustom Wizards in deep-gray + neon, Ride & Shine) shows the moving-parts vocabulary: scroll-driven WebGL/Three.js + GSAP **car reveals**, **cinematic car transitions**, **before/after sliders**, and **dynamic estimate widgets that update by vehicle type**. Patterns: dark graphite base, glossy high-res car photography, before→after as proof, certification/insurance trust signals, motion that demonstrates precision and paint. *(This is the niche where motion is the pitch — see §14d.)*

---

## 1. The non-negotiable design DNA

1. **NO decorative geometric shapes. This is the rule that matters most.** No floating circles, blobs, rings, half-circles, "cut" diagonal shapes, abstract SVG decoration, gradient orbs, or shape-based section dividers. If a shape isn't a photo, a video, a line of text, a hairline rule, or a button, it does not belong. *(This is the single thing wrong with the current demos — strip all of it.)*
2. **Real photography is the design.** Every section's visual interest comes from full-bleed photos/video of the actual work, not from graphics. Where Noah hasn't supplied photos yet, use clearly-labeled image placeholders at the correct aspect ratio (see §10) so the layout reads correctly and photos drop in later.
3. **Quiet chrome lets the photos pop.** The UI (backgrounds, text, lines) stays quiet so the photography is the only loud thing — near-black for renovation, forest-dark for landscaping, warm leather-dark for barber, light/warm for florist, bakery, power washing, and lawn care. The chrome never competes with the photos. (Per-niche moods: §13.)
4. **Editorial, not flashy.** Big confident headers, generous whitespace, hairline rules, numbered markers, eyebrows. It should feel like a well-set magazine spread, not a web "design."
5. **Restraint with motion and color.** Subtle reveals and one marquee. One accent color, ~2 uses per screen. Nothing blinks, bounces, or floats.
6. **Local trust is the voice.** Plain, specific, slightly blunt. "We answer our phone." "No subs." "Free estimate, no pressure." (See §8.)
7. **Shared spine, niche-specific guts.** The spine (header, hero, marquee, full-bleed media break, work grid, FAQ, contact, CTA band, footer) is structurally the same on every demo — that's what makes them one studio's system. But the **services section and the "why us" section** are NOT the same grid everywhere; they adapt per business (§14). Identical-grid-everywhere is the failure these demos exist to avoid.

---

## 2. Color system — near-black base (renovation)

This cool near-black base is the original heavy-contractor look; on demos it's now used as-is for **renovation only**. **Landscaping uses a forest-dark green-tinted variant (§13g); barber uses a warm leather-lounge dark (§13c); florist, bakery, power washing, and lawn care use LIGHT palettes (§13a/b/d/e).** §13 overrides this section for every niche except renovation. Only `--accent` changes per niche where the base applies:

```
--bg       #0B0B0C   /* page background, near-black */
--surface  #141416   /* raised cards / panels, barely lighter */
--fg       #F2EFE9   /* headlines, warm off-white */
--body     #C9C8C0   /* body copy on dark */
--muted    #8A8A82   /* eyebrows, labels, captions, secondary */
--line     #232327   /* 1px hairline dividers & card borders */
--accent   <per niche, see §9>
```

**Accent discipline:** the accent appears on roughly **1–2 elements per screen** — a primary button, an active/hover state, the eyebrow tick, or a "→". It never fills large areas and is never used as decoration. One accent per site; pick from §9.

**Scrim:** over every full-bleed photo/video that has text on it, lay a dark gradient (e.g. `linear-gradient(180deg, rgba(11,11,12,.35), rgba(11,11,12,.85))`) so headlines stay readable. Text on media is always `--fg`. (Light niches use a *light* scrim or a clear text zone — see §13f.)

---

## 3. Typography (DEMO sites)

Use a clean modern **grotesque sans** as the default for everything — the demos must read like a normal, real local business site, **not** like the Vilas brand. (Do NOT use Syne here; Syne is reserved for the main Vilas site.) **Florist and bakery swap in a display serif, and barber swaps in a condensed/slab signage face — see §13.**

- **Display/headers (default):** a tight neutral grotesque — `Geist`, `Inter Tight`, or `Satoshi`. Weight 600–700.
- **Body:** the same family at 400 (e.g. `Geist`/`Inter`).
- **Eyebrows / labels / numbers:** same family, UPPERCASE, letter-spaced.

**Type scale (desktop → mobile):**

| Role | Size | Weight | Tracking | Line-height | Color |
|---|---|---|---|---|---|
| H1 hero | 72px → 40px | 700 | -0.02em | 1.04 | `--fg` |
| H2 section header (two lines) | 52px → 32px | 600 | -0.01em | 1.08 | `--fg` |
| H3 card / item title | 22px → 19px | 600 | normal | 1.2 | `--fg` |
| Body | 17px → 16px | 400 | normal | 1.6 | `--body` |
| Eyebrow / label | 13px | 600 | 0.14em | 1 | `--muted` (tick mark in `--accent`) |
| Number marker (01, 02) | 13px label OR 56px ghost | 500 / 600 | 0.1em / -0.01em | 1 | `--muted` / `--line` if ghosted |

> **Eyebrow size note (Noah's fix):** the eyebrow labels on the current builds read as too small and hidden. Bump eyebrows to ~14–15px, weight 600–700, and raise contrast off `--muted` toward a clearly-readable tone (still not full `--fg`) so they read as intentional section markers, not afterthoughts. Apply consistently across every section and every demo.

**Two-line header pattern (signature move).** Section headers are almost always two short lines with a hard break, e.g. Axel's *"Hired for the work. / Remembered for the care."* and *"Five specialties. / One crew."*; Sallem's *"A single crew / for every trade."* and *"Built right. / Finished on time."* Write every section header this way: punchy, two lines, often a period after each.

**Number markers.** Two acceptable styles — (a) a small uppercase `01` label sitting just above/beside the title (Axel's service cards), or (b) a large faint ghost numeral behind/beside the title (`--line` color, very low contrast). Pick one and use it consistently within a site. *(Niches that replace the card grid — §14 — drop number markers in those sections in favor of the niche layout.)*

---

## 4. Layout & spacing (DEMO sites)

- **Container:** max-width ~1200–1280px, centered. Side padding 24px mobile / 64–96px desktop.
- **Section vertical rhythm:** ~120–160px top/bottom desktop, ~72–96px mobile. Lots of air between sections — this is most of what makes it feel premium.
- **Full-bleed sections** (hero, photo/transformation break, CTA band) break out to 100vw and ignore the container.
- **Radii:** sharp. 4–6px max on cards/buttons; 0 on full-bleed media. No big pill/bubble rounding. *(Bakery may go to ~8px per §13b; barber price-board panels stay sharp.)*
- **Dividers:** 1px `--line` hairlines between major bands where a visual break is needed. No shape dividers.
- **Grids:** service cards 2–3 col desktop / 1 col mobile; work grid 3–4 col desktop / 2 col mobile; value props 2–3 col / 1 col. Consistent gaps (~20–28px). *(Where §14 replaces the grid, follow §14's layout instead.)*
- **Image aspect ratios:** hero/break 16:9 cover; work-grid tiles 4:3 or 3:2; service-card thumbnails 4:3; before/after pairs 4:3.

---

## 5. Motion (DEMO sites — subtle)

- **Scroll reveals:** fade + 16–24px translate-up as a section enters view, ~0.6s ease-out, children staggered ~0.08s. Once only, not on every re-scroll.
- **Marquee:** one continuous horizontal scroll band of service words, **seamless infinite loop** — duplicate the track and run a continuous `translateX` so it NEVER pauses, jumps, or resets (this is the same technique the main Vilas hero marquee uses; the current demo marquees stall after ~3s and must be fixed). ~40–60s loop.
- **Hero video:** `autoplay muted loop playsinline`, poster image for instant paint, scrim on top. **Mobile:** show the poster still instead of autoplaying. **Reduced-motion:** poster still, no autoplay.
- **Before/after slider (power washing):** draggable handle revealing the "after" over the "before" via `clip-path`/`clip`; on touch it's drag, on desktop drag or hover-scrub. Reduced-motion: show the two images side by side instead.
- **Hover:** cards lift `translateY(-4px)` + border brightens / soft shadow; links nudge their "→" ~4px and/or underline.
- **Sticky header:** transparent over the hero, then gains a background + bottom hairline after ~80px of scroll; may shrink height slightly.
- **prefers-reduced-motion:** disable marquee auto-scroll, disable reveals (show final state), no video autoplay, before/after shown side-by-side.

---

## 6. Homepage section sequence (the blueprint)

Build every demo homepage in this order. **Sections marked ⟨spine⟩ are structurally identical on every niche. Sections marked ⟨adapts⟩ change layout per niche — see §14.** Sections marked ⟨skip on demos⟩ are real on Axel's but require real clients/data Vilas doesn't have.

1. ⟨spine⟩ **Sticky header** — logo/name (left or centered) · primary nav (Home/About/Services/Work/Contact) · phone number · one accent "Get a Quote / Free Estimate" button. Mobile collapses nav; keep a visible CALL/phone affordance.
2. ⟨spine⟩ **Hero** — full-bleed background **video** (or photo placeholder) + scrim. Small eyebrow or logo, **two-line H1**, one line of sub-copy, **two CTAs** (primary accent "Get a free estimate/quote" + secondary "Call (xxx) xxx-xxxx"), and a small **"Scroll"** cue at the bottom.
3. ⟨spine⟩ **Service marquee** — one horizontal **seamless infinite** band of the niche's service words, separated by `●` or wide spaces, repeated 2–3×. Muted color, large-ish type.
4. ⟨spine⟩ **Intro / "Who we are"** — eyebrow + two-line H2 + 1–2 short paragraphs. **Then a row of stat/badge PAIRS** (label + value), e.g. Sallem's *"Concrete to Roofing — Full Scope," "Commercial & Residential — Both Markets," "Licensed & Insured — Fully Covered," "Free Estimates."* (Pairs are honest descriptors, NOT invented numbers — see §11.)
5. ⟨adapts⟩ **Services section ("what we do")** — *DEFAULT (renovation, landscaping, lawn care, florist):* eyebrow + two-line H2, then a grid of numbered cards 01–0N (number marker, H3 title, 1–2 sentence plain description, "Explore →", optional 4:3 thumbnail). *REDESIGNED (power washing, bakery, barber):* use the niche layout in §14 instead of the grid.
6. ⟨spine⟩ **Full-bleed media break (the "transformation" moment)** — a 100vw photo or video with scrim and a single **two-line statement** + a short paragraph + optional ✓ checklist + one CTA. *On Axel's this is the "Featured · Driveway Transformation" video — exactly where Noah's future before/after content lives. For now use a full-bleed placeholder labeled "before/after / transformation."* (For power washing this break is the hero moment — make it the most prominent thing on the page.)
7. ⟨spine⟩ **Work grid** — eyebrow ("Recent work") + two-line H2 + "See All Work →". Grid of work images, each with a small **category tag** + a one-line **caption**.
8. ⟨adapts⟩ **Value props / "Why hire us"** — *DEFAULT:* eyebrow + two-line H2, then numbered items 01–0N (big number, H3 title, 1–2 sentence body). *REDESIGNED (power washing, bakery, barber):* use the niche layout in §14.
9. ⟨skip on demos⟩ **About + 3 stat badges** — optional; only if it doesn't imply fake history. A short "who we are" is fine; invented founding stats are not.
10. ⟨skip on demos⟩ **Reviews wall** — Axel's shows real, named Google reviews. **Do NOT fabricate reviews.** Omit this section entirely on demos.
11. ⟨spine⟩ **Contact / "Free quote"** — eyebrow + two-line H2 + plain copy ("Call, text, email, or fill out the form. We usually reply same day. No pressure."). Contact methods row (call/text, email, location). **Form:** Name\*, Email\*, Phone, a **Service/Project-type dropdown** (the niche's services + "Not sure yet"), optional **Property-type dropdown** (Residential/Commercial) + **City** field, a "Tell us about your project" textarea, and a Send button. Include a **success message** and an **error message + Try Again**.
12. ⟨spine⟩ **Final CTA band** — full-bleed, short. A two-line line + primary CTA + phone.
13. ⟨spine⟩ **Structured footer** — logo/name + one-line descriptor + service-area line, then 3 columns: **Navigate** · **Services** · **Contact** (location, phone, email, **hours**). Copyright row + a small tagline strip.

---

## 7. Component micro-specs

- **Header:** height ~72px. Transparent over hero → solid base + 1px `--line` bottom border after scroll. Phone always tappable (`tel:`). Quote button uses `--accent`.
- **Hero:** `min-height: 100svh`. Video layer (cover) → scrim → content bottom-left or centered. H1 two lines. Primary CTA = `--accent` background, dark text; secondary CTA = ghost (1px `--line` border, `--fg` text). "Scroll" cue = small `--muted` label, optional tiny down-chevron line (not a shape blob).
- **Marquee:** flex row duplicated for seamless infinite loop; words in `--muted` (or `--fg` low opacity), separators in `--accent` or `--muted`; `will-change: transform`; pause on reduced-motion.
- **Numbered service card (default niches):** `--surface` background, 1px `--line` border, 4–6px radius, ~28px padding. Number marker top, title, description, "Explore →" pinned bottom. Hover: lift + border lightens, arrow nudges.
- **Before/after slider (power washing):** two stacked images (before under, after over), draggable divider with a thin `--accent` handle line + grab affordance; 4:3. Caption strip below (`--muted`).
- **Price-board row (barber):** service name left (display face), **brass leader dots** (`........`) filling the middle, price right. Rows separated by `--line`; sits on a `--surface` leather panel. No card chrome.
- **Menu row (bakery):** category name in the display serif (left), short appetizing description, thin warm rule under each row; optional small price/tag right. Photo column (the case) alongside.
- **Full-bleed break:** 100vw media + scrim; content constrained to container; checklist items use a `--accent` ✓ then `--body` text.
- **Work tile:** image (4:3/3:2 cover) with a small category tag (uppercase `--muted`) + a one-line caption. Subtle zoom on hover (`scale(1.03)`, overflow hidden).
- **Value-prop item (default niches):** big number (ghost or label), H3, body. No card needed — hairlines or grid gaps.
- **FAQ accordion:** each row = `Q0N` + question (left) and a +/− or chevron (right), hairline-separated. Expanding reveals the answer (`--body`) with a ~0.3s height+opacity transition. Numbered Q01–Q0N. Hyper-local questions.
- **Contact form:** fields match the niche palette (surface bg, 1px line, fg text, muted placeholders), labels above. Dropdowns styled to match (no default browser chrome). Submit = `--accent`. Success + error blocks (hidden until triggered).
- **CTA band & footer:** see §6.12–13.

---

## 8. Copy voice + phrase bank

**Voice:** plain, specific, confident, a little blunt. Short sentences. Contractions. No corporate filler, no hype, **no "X, not Y" constructions** (reads AI-generated). It should sound like a tradesperson who's good at their job and tired of slick competitors.

**Patterns that work (reword, don't copy verbatim):**
- Disarming trust: *we answer our phone* · *you deal directly with [owner]* · *no subs, no shortcuts* · *free estimate, no pressure* · *we show up when we say we will* · *no disappearing in the middle of a job.*
- Plain value: *built by hand* · *built to last* · *straight, written pricing* · *one crew for the whole project* · *clean site, on schedule.*
- Local: name the metro and nearby towns explicitly (trust + SEO signal).
- Two-line headers: *"Hired for the work. / Remembered for the care."* energy — punchy, halved, often period-terminated.
- CTAs: *Get a free quote* · *Call [name] direct* · *Tell us about your project* · *Request a free estimate.*

**Honesty:** never imply paying clients, awards, years in business, or review counts the demo doesn't have. Plain descriptors ("licensed & insured," "one crew") are fine; invented numbers are not (see §11).

---

## 9. Per-niche adaptation

One accent per site, drawn from the trade. Marquee terms + the 01–0N services + a two-line H1 starter are given so cards and copy slot in with no guesswork. **The renovation/remodeling demo is built FIRST** (it maps directly onto Sallem). Exact palettes/type for non-default-dark niches live in §13; section layouts for redesigned niches live in §14.

| Niche (demo) | `--accent` | Marquee terms | Services 01–0N | Hero H1 starter (two lines) |
|---|---|---|---|---|
| **Renovation / remodeling** *(BUILD FIRST, near-black §2)* | `#C8893F` warm finished-wood caramel | Kitchens ● Bathrooms ● Additions ● Basements ● Whole-Home ● Trim & Carpentry | 01 Kitchens · 02 Bathrooms · 03 Additions & extensions · 04 Basements · 05 Whole-home renovations · 06 Trim & finish carpentry | "Old house. / New everything." |
| **Landscaping** (Stone & Sage, forest-dark §13g) | `#6E9A5C` moss/sage green | Patios ● Retaining Walls ● Gardens ● Lighting ● Fire Pits | 01 Design · 02 Patios & walkways · 03 Retaining walls · 04 Garden & planting · 05 Maintenance · 06 Custom (fire pits, pergolas) | "Built to be lived in. / Built to stay." |
| **Power washing** (Tide Line, light §13d, layout §14a) | `#1E86C4` clean water blue | Houses ● Driveways ● Decks ● Patios ● Fences | 01 House soft wash · 02 Driveways & walkways · 03 Decks, fences & patios · 04 Roof/gutter wash | "Like the day / it was built." |
| **Lawn care** (Fresh Cut, light §13e) | `#4E9A4A` fresh grass green | Mowing ● Cleanups ● Edging ● Mulch ● Fertilizing | 01 Weekly mowing · 02 Spring & fall cleanups · 03 Mulch & edging · 04 Fertilizing & weed control | "Your lawn, / handled." |
| **Florist** (Wildstem, light §13a) | `#B14A63` deep bloom rose | Weddings ● Events ● Daily ● Weekly ● Sympathy | 01 Daily arrangements · 02 Weddings & events · 03 Weekly flowers · 04 Sympathy | "Picked, / not produced." |
| **Bakery** (Golden Hour, light §13b, layout §14b) | `#C9802F` warm crust amber | Sourdough ● Pastry ● Cakes ● Focaccia ● Cookies | 01 Daily bread · 02 Morning pastry · 03 Cakes to order · 04 Wholesale | "Baked at 4am. / Gone by noon." |
| **Barber** (Standard, leather-lounge §13c, layout §14c) | `#B0833F` brass/gold (oxblood `#9A3B33` secondary) | Cuts ● Fades ● Beards ● Shaves ● Kids | 01 Haircut · 02 Skin fade · 03 Beard & line-up · 04 Hot-towel shave | "A good cut. / Every time." |
| **Auto body / collision** (Apex Collision, graphite-dark §13h, layout §14d) | `#2FA8FF` electric blue (hot-orange `#FF5A2C` secondary; gold/red are classic alternates) | Collision ● Paint ● Dents ● Frame ● Glass ● Detailing | 01 Collision repair · 02 Auto painting & refinishing · 03 Dent removal (PDR) · 04 Frame straightening · 05 Glass & calibration · 06 Detailing & paint correction | "Wrecked. / Like it never happened." |

**Renovation demo full spec (zero guesswork, built first):**
- **Sample name (swappable, demo-labeled):** "Maple & Main Renovation Co.", North Shore, Long Island. Accent `#C8893F`.
- **Hero:** H1 *"Old house. / New everything."* · sub *"Kitchens, baths, additions, and whole-home renovations across the North Shore. One crew, start to finish."* · CTAs *Get a free estimate* + *Call (516) 555-0000* · Scroll cue. Full-bleed video placeholder (renovation b-roll).
- **Marquee:** Kitchens ● Bathrooms ● Additions ● Basements ● Whole-Home ● Trim & Carpentry.
- **Intro:** two-line H2 *"Every trade. / One crew."* + 1–2 plain paragraphs. Stat/badge pairs: *Small remodels to whole-home — Full Scope · Licensed & Insured — Fully Covered · One Crew, No Subs · Free Estimates.*
- **Service cards 01–06:** the six above, each with a plain 1–2 sentence description + "Explore →" + 4:3 placeholder. *(Renovation keeps the default grid.)*
- **Full-bleed break:** eyebrow *"See the transformation"* + H2 *"We protect what's good. / We rebuild the rest."* + paragraph + checklist (✓ Free in-home estimate · ✓ One crew, no subs · ✓ Clean site, on schedule · ✓ Licensed & insured) + CTA *Meet the crew*.
- **Work grid:** tags Kitchen / Bath / Addition / Whole-home / Exterior; captions like "Kitchen — full gut renovation," "Primary bath — walk-in tile shower," "Rear addition — framed & finished." 6 placeholders.
- **Value props 01–05:** One crew, every trade · Built to last · Straight, written pricing · Local & responsive · Clean and on schedule. *(Default value-prop layout.)*
- **FAQ Q01–Q06 (local):** What areas do you serve? (Long Island towns) · Do you handle small remodels and whole-home? · Are you licensed and insured? · Do you give free estimates? · How long does a renovation take? · Do you use your own crew?
- **Contact:** form with Project-type dropdown (Kitchen / Bath / Addition / Basement / Whole-home / Multiple / Not sure), optional Property type, City, details; "we reply same day" line; call/email; success + error states.
- **CTA band:** *"Ready to start? / Let's walk the house."* + phone.
- **Footer:** Navigate / Services / Contact columns + hours ("Mon–Sat, 7am–6pm").
- **No reviews wall. No invented stats.**

---

## 10. Image placeholder convention (Noah swaps real photos in later)

Until real photography exists, use neutral, **clearly-labeled** placeholders so the layout is correct and the page never looks broken:
- Solid `--surface` (or a niche-appropriate neutral) fill with a thin `--line` border, a small centered `--muted` label naming the slot and aspect, e.g. `HERO VIDEO — 16:9`, `WORK — Kitchen reno (4:3)`, `BEFORE — driveway (4:3)`, `AFTER — driveway (4:3)`, `THE CASE — morning bake (4:3)`, `BARBER — chair, fireplace light (4:3)`, `TRANSFORMATION — before/after (16:9)`.
- Keep the exact final aspect ratios (§4) so nothing shifts when photos land.
- No stock photos, **no AI-generated images**, no generic Unsplash filler in the committed build — placeholders only, so Noah controls the imagery.

---

## 11. Anti-patterns — do NOT do these

- ❌ Any decorative geometric shapes (circles, blobs, rings, cut/diagonal shapes, abstract SVG, gradient orbs, shape dividers). *This is the main thing to remove from the current demos.*
- ❌ **Forcing the contractor numbered-card service grid (and numbered "why us" list) onto every niche.** The services + "why us" sections adapt to the business — price board for barber, menu for bakery, before/after rows for power washing (§14). Identical-grid-everywhere is the failure these demos exist to avoid.
- ❌ Fabricated reviews, testimonials, client names, star counts, "trusted by," or logo walls.
- ❌ Invented statistics or history ("500+ projects," "since 1998," "98% satisfaction"). Plain descriptors only.
- ❌ AI-generated or stock images committed into the build.
- ❌ "X, not Y" copy constructions; corporate filler; hype.
- ❌ Heavy rounding / bubbly cards; rainbow of colors; accent used as decoration.
- ❌ Marquees that stall/reset after a few seconds. They loop seamlessly and infinitely (§5).
- ❌ Treating the auto-body motion budget (§14d) as a license for decorative motion. The moving parts there are all *content* — cars, paint, damage, before/after — and every one ships a reduced-motion/static fallback. Motion that doesn't demonstrate the work doesn't belong, on any niche.
- ❌ Eyebrow labels so small/low-contrast they read as hidden. Size them to read as intentional (§3 note).
- ❌ Washed-out, low-contrast light demos. Light is *correct* for florist/bakery/power washing/lawn care (§13) — but keep AA text contrast and editorial discipline. Bright and airy, never pale mush.
- ❌ Using the Syne display face on demos (Syne = Vilas brand only; demos use a neutral grotesque, or the per-niche serif/condensed face in §13).

---

## 12. Honesty rules (demos specifically)

- Demos are **Vilas's own self-initiated builds**, shown as style examples — never presented as paying clients.
- Sample business names, phones, and addresses are fine as long as nothing claims real results, reviews, or history. **Add a small, tasteful "demo build / sample site" label** on each demo so a prospect clicking through can't mistake the placeholder 555 numbers and `.demo` emails for a real business Vilas is fronting — the anti-scam pitch depends on the work reading as genuine.
- Skip every section that would require fabricating proof (reviews wall, client counts). The work itself is the proof.

---

## 13. Niche mood & palette variants (not every demo is dark, and the dark ones aren't all the same dark)

**The principle.** The *spine* is identical on every demo — same section order (§6), two-line headers, photo-led layout, full-bleed media break, work grid with tags, plain copy. That shared structure is what makes them read as one studio's system. But the *mood* — palette, type personality, how the photography is lit — must match what that kind of business actually looks like online, and (per §14) the services + "why us" sections take a niche-specific layout. **The demos should look different from each other on purpose.** A florist that looks like a roofing company is a failed demo even if it's built perfectly. Matching a business to its own visual language is the entire thing these demos exist to prove.

**Who gets which mood:**

| Niche | Mood | Why |
|---|---|---|
| Renovation | **NEAR-BLACK** (the §2 base) | Heavy design-build reads premium on cool near-black; the photos carry the color. |
| Landscaping | **FOREST-DARK** (§13g) | Keep the premium dark look, but warm the cold pure-black toward a dark forest green so it ties to the land. |
| Florist, Bakery, Power washing, Lawn care | **LIGHT** (airy / warm / clean, below) | Bright, fresh, approachable businesses. Power washing and lawn care sell *clean and fresh* — a bright site proves it. |
| Barber | **WARM LEATHER-LOUNGE DARK** (§13c) | Dark fits the old-school chair — but warm, leathery, fireplace-lit, not the cool blue-black of the contractor demos. |
| Auto body / collision | **GRAPHITE-DARK, motion-heavy** (§13h) | Cars look incredible on a cool graphite black with glossy reflections; an electric accent reads precision/automotive. This is the niche that leans into motion (§14d). |

§13 overrides §2 (palette) and §3 (type) for the named niches. §14 governs the services + "why us" layout. Every other rule in this skill still holds.

### 13a. Florist — bright & airy (Wildstem)

```
--bg       #FBF8F3   /* warm paper white */
--surface  #FFFFFF
--fg       #2A2622   /* soft warm near-black */
--body     #5A534B
--muted    #9A9289
--line     #ECE6DC   /* very light hairline */
--accent   #B14A63   /* deep bloom rose, used sparingly */
--accent-2 #7C8F6F   /* optional soft sage for secondary touches */
```
- **Type:** an elegant display **serif** for headers — Fraunces or Playfair Display, used with restraint (not every line) — paired with a clean sans body (Inter / Geist). The serif is what reads "florist / editorial" instead of "contractor." (Still never Syne.)
- **Photography:** bright natural daylight, lots of negative space, close-up stems, the shop, soft real shadows. Airy — never moody or dark.
- **Shifts:** more whitespace; lighter, thinner hairlines; soft shadows instead of hard borders on cards; the hero is a bright image with dark text in a clear zone (light scrim or none); marquee in muted rose or sage. Buttons: rose fill + white text, or a thin outline.
- **Keep the default services grid + value list** (florist reads fine on the grid). Two-line headers, work grid with tags + plain captions, full contact form.

### 13b. Bakery — warm & inviting (Golden Hour)

```
--bg       #F6EFE2   /* warm cream / paper bag */
--surface  #FCF8F0
--fg       #2B2018   /* warm espresso brown */
--body     #5E5142
--muted    #9C8B76
--line     #E7DCC8
--accent   #C9802F   /* crust amber */
--accent-2 #8A4B2A   /* deep crust, optional */
```
- **Type:** a warm, slightly characterful display — Fraunces (its softer optical sizes) or a friendly grotesque — with a clean sans body. Should feel handmade and morning-lit, not clinical.
- **Photography:** warm morning light, golden tones, crumb and crust close-ups, the case, steam. Cozy and appetizing — go big with these (the photo is the appetite).
- **Shifts:** warm cream throughout; amber accent on CTAs; soft shadows; cream marquee. Radius up to ~8px (warm/handmade suits it) — but don't go bubbly.
- **Services + "why us" use the menu/case + warm-narrative layouts in §14b** (not the grid).
- **Alternative the research surfaced:** a **moody-dark** bakery — warm dark background with golden food photography reads indulgent and craft (like Debaere). If Noah ever wants the bakery to feel premium/indulgent instead of bright/cheerful, that's the swap. Default stays the light warm cream.

### 13c. Barber — warm leather lounge (Standard)

The vibe Noah wants: **a comfy, leathery, fireplace-lit lounge** — old-world, warm, dim, masculine. Not the cool blue-black of the contractor demos, and cozier than a plain "dark" site. This is the barber's whole identity — push it.

```
--bg       #16110C   /* warm espresso-black, leather-dark (NOT the cool #0B0B0C) */
--surface  #20180F   /* worn-leather panel, a touch warmer/lighter */
--fg       #F0E7D6   /* warm bone / candlelit cream */
--body     #C2B49C   /* aged paper */
--muted    #8A7B65   /* dim brass-gray */
--line     #2E2419   /* dark leather seam */
--accent   #B0833F   /* brass / gold — warm lamplight (primary) */
--accent-2 #9A3B33   /* deep oxblood red (secondary, optional) */
```
- **Type:** vintage signage energy — a bold **condensed** display or a **slab serif** (Oswald / Anton condensed, or a slab used sparingly), uppercase + tracked for headers, clean sans body. Think hand-painted barber lettering.
- **Texture (this sells the vibe):** a subtle leather/grain texture on the dark panels — a faint noise/texture overlay at low opacity, *never* a literal photo of leather as wallpaper. Brass leader dots on the price board. Warm soft shadows like lamplight.
- **Photography:** warm interior light, leather chairs, chrome + brass, the chair, a fireplace/lamp glow, vintage tones. Moody but *warm* — lamplit, not industrial.
- **Lighting feel:** dim and warm. Use the espresso-black generously; let brass/lamp accents and the photos be the only bright points — like a room lit by a fireplace.
- **Services + "why us" use the price-board + "the chair" lounge layouts in §14c** (not the grid). This is the most important differentiator for the barber.

### 13d. Power washing — clean & crisp (Tide Line)

```
--bg       #F4F7F9   /* clean cool off-white (water-white) */
--surface  #FFFFFF
--fg       #14202A   /* deep cool ink */
--body     #4D5A64   /* cool slate */
--muted    #8A98A2   /* cool gray */
--line     #E2E9ED   /* cool light hairline */
--accent   #1E86C4   /* clean water blue (deeper than §9 for contrast on white) */
```
- **Type:** a clean modern grotesque (Inter / Geist), crisp and no-nonsense — power washing is utility, not editorial, so no serif.
- **Photography:** bright daylight, sparkling-clean surfaces, water spray, vivid before/after with the "after" gleaming. High-key and crisp.
- **Why light:** the whole pitch is *spotless / like-new*. A bright, almost clinically clean white site proves the service before a word is read — lots of white space literally reads "clean." Blue accent ties it to water.
- **Shifts:** white surfaces, cool light hairlines, soft shadows; buttons blue fill + white text.
- **Services + "why us" use the proof-rows + proof-strip layouts in §14a** (not the grid). The before/after transformation block is the hero moment — keep it prominent.

### 13e. Lawn care — fresh daylight (Fresh Cut)

```
--bg       #F6F8F1   /* soft fresh off-white, faint green */
--surface  #FFFFFF
--fg       #1C2417   /* deep grass near-black */
--body     #515B47   /* muted olive-gray */
--muted    #8E9882   /* sage gray */
--line     #E5EBDB   /* light green hairline */
--accent   #4E9A4A   /* fresh grass green */
```
- **Type:** a clean, friendly grotesque (Inter / Geist), approachable — no serif.
- **Photography:** bright sunny daylight, fresh-cut striped lawns, blue sky, green. High-key and cheerful.
- **Why light:** a friendly, low-stakes weekly service — should feel easy, sunny, approachable, not premium-dark. Lots of sky and green.
- **Shifts:** white surfaces, light green hairlines, soft shadows, green accent on CTAs.
- **Keep the default services grid + value list** (lawn care reads fine on the grid).

### 13f. Don't let "light" become "weak"

- Keep **AA contrast** on all text (the `--fg` / `--body` values above are chosen for this).
- Bright and airy is not pale and washed out. Keep real contrast, confident headers, and the same editorial discipline as the dark demos.
- Every §11 / §12 rule still applies: no decorative geometric shapes, no stock or AI images, no fake reviews or stats.
- Scrims: on light heroes use a *light* scrim or a clear text zone, never a heavy dark gradient.

### 13g. Landscaping — forest-dark (Stone & Sage)

Noah found the pure near-black too cold for landscaping and wants it greener, while keeping everything else about the site (he likes the rest). So warm the base toward a **dark forest green** — still dark and premium, just not cold pure-black. This is NOT a literal grass-green page; it's a near-black with a clear green undertone that ties it to the work.

```
--bg       #0C110B   /* near-black with a forest-green undertone */
--surface  #141A11   /* raised panel, green-tinted dark */
--fg       #F0F2E9   /* warm off-white */
--body     #C7CCBE   /* soft sage-gray body */
--muted    #828B79   /* muted sage */
--line     #202820   /* green-tinted hairline */
--accent   #6E9A5C   /* moss/sage green, nudged a touch brighter to pop on the green-black */
```
- **Only the background family shifts** from cool pure-black to this forest-dark. Type, layout, the default services grid + value list, photography approach — everything else stays exactly as the landscaping demo is now.
- **Scrim** on full-bleed media: green-tinted dark gradient, e.g. `linear-gradient(180deg, rgba(12,17,11,.35), rgba(12,17,11,.85))`.
- **If Noah wants it greener:** push the bg green channel further (e.g. `#0D140B` → `#0F180C`); if it muddies the photos or drops text contrast, ease back. Don't go to a mid/light green — that breaks the premium dark look he likes.

### 13h. Auto body / collision — graphite-dark, motion-heavy (Apex Collision)

The look of a modern collision center / premium automotive studio: a cool **graphite black** with glossy car photography and a sharp electric accent. Cars read best on this — reflections and paint pop against the dark. This is the niche where **motion is the pitch** (§14d), so the palette stays clean and lets the moving parts and the cars be the loud thing.

```
--bg       #0A0C0F   /* asphalt black, faint cool blue */
--surface  #12161B   /* graphite panel */
--fg       #F4F6F8   /* cool white */
--body     #AFB7C0   /* cool steel gray */
--muted    #6E7782   /* gunmetal gray */
--line     #20262E   /* steel hairline */
--accent   #2FA8FF   /* electric blue — precision / automotive (primary) */
--accent-2 #FF5A2C   /* hot safety orange — energy, used sparingly on CTAs/alerts */
```
- **Type:** a clean, slightly technical grotesque (Geist / Inter Tight), tight and confident, uppercase + tracked eyebrows. **Optional automotive detail:** set numbers/specs/estimates in a **monospace** (e.g. Geist Mono) so they read like an instrument readout — VINs, estimate ranges, "48 HR turnaround," etc. Use the mono only for figures, not body copy.
- **Photography:** glossy high-res cars on dark, paint reflections, the booth, sparks/grinding, before/after collision shots, clear-coat shine. Cinematic, cool-lit, premium.
- **Accent discipline:** electric blue on the active state, the slider handle, the live color-picker chip, the "→". Hot orange only on the primary CTA / urgent ("Get a free estimate," "Start a claim"). Never both loud at once.
- **Classic alternates:** if Noah prefers the traditional body-shop feel over the tech-studio feel, swap `--accent` to **gold `#C8A24A`** (premium, "The Art of Repair") or **deep red `#C5302B`** (collision energy). Keep the graphite base either way.
- **Services + "why us" use the motion-heavy layouts in §14d** — this is the differentiator for auto body.

---

## 14. Per-niche SECTION LAYOUTS — the real differentiator

The §6 sequence defines the **spine** every demo shares — header, hero, marquee, full-bleed break, work grid, FAQ, contact, CTA band, footer. Those stay structurally the same everywhere; that shared spine is what makes the demos read as one studio.

But two sections — **the services section ("what we do") and the value-props section ("why hire us")** — must NOT be the same numbered-card grid on every site. That sameness is the thing that makes the demos feel like one template recolored. These two sections **adapt to what the business actually is.** Match the section to the business.

**Default (keep the §6 grid + numbered value list):** renovation, landscaping, lawn care, florist. The numbered 01–0N card grid fits trades and these service businesses well.

**Redesigned niches — use these layouts instead of the grid:**

### 14a. Power washing — proof-led (Tide Line)
The whole pitch is *before → after*. Don't describe the service in text cards; **show the transformation.**
- **Services section** ("What we wash") — replace the 4-card grid with **alternating full-width proof rows**, one per service (House soft wash · Driveways & walkways · Decks, fences & patios · Roof/gutter). Each row: a **before/after image pair or an interactive before/after slider** on one side, and on the other the service name (H3), a one-line plain description, and a short "what's included" line. Alternate the media left/right down the section. The visual for every service is the result, not an icon.
  - *Simpler fallback:* one large interactive before/after slider as the section centerpiece, with the 4 services as a clean labeled list beneath it.
- **Value-props** ("Why hire us") — replace the numbered 01–05 list with a compact **proof strip**: 4 short claims (Flat written quote · Soft wash that won't strip paint · Same crew, one visit · Licensed & insured) in a single hairline-separated row, each as a ✓ + label. No card grid.
- Keep the full-bleed "the difference is not subtle" before/after break — make it the most prominent thing on the page.
- *Build note:* the before/after slider is a draggable `clip-path` reveal of two stacked images. Until real photos exist, stack two labeled placeholders (`BEFORE — driveway (4:3)` / `AFTER — driveway (4:3)`) so it works now. (This same slider is reusable later for the planned Higgsfield power-wash hero.)

### 14b. Bakery — the menu / the case (Golden Hour)
A bakery sells off a **menu and a case**, not a service grid. Make "what we bake" feel like stepping up to the counter.
- **Services section** ("What we bake") — replace the 4-card grid with a **menu layout**: a two-column setup with the **menu on one side** (Daily bread · Morning pastry · Cakes to order · Wholesale as menu rows — category name in the display serif, a short appetizing one-line description, thin warm rules between rows, like a printed menu or chalkboard) and a **large appetizing photo (the case)** on the other (4:3/3:2; sticky as the menu scrolls if you want polish). No numbered cards.
- **Value-props** ("Why people come back") — replace the numbered 01–05 list with a **warm narrative band**: the "baked at 4am, gone by noon" story told in 2–3 short reasons woven with a single warm photo, not a corporate grid. Cozy, hand-made, morning-lit.
- Lean slightly warmer/softer than the sharp demos (radius up to ~8px per §13b), but keep editorial discipline.

### 14c. Barber — the price board / leather lounge (Standard)
The one Noah most wants to feel different: **a comfy, leathery, fireplace-lit old-world lounge.** Push the §13c mood and change the services layout.
- **Services section** ("The list") — replace the 4-card grid with a **vintage barber price board**: the cut menu as a classic painted price list / leather-bound menu —
  `Haircut ........ $35` · `Skin Fade ........ $40` · `Beard & Line-up ........ $20` · `Hot-towel Shave ........ $45` · `The Works ........ $70` —
  service name left (in the condensed/slab display face), **brass/gold leader dots** filling the middle, price right, set on a dark warm leather panel (`--surface` + faint texture). This price-board IS the section. (Barber services have real prices — lean in; it doubles as the pricing.)
- **Value-props** ("Why this chair") — replace the numbered 01–05 list with **"the chair"**: a warm lounge statement — no rush, no upsell, same barbers — in 2–3 larger lines beside a **fireplace-lit interior photo** (leather, brass, warm lamplight). Comfortable establishment, not a corporate list.
- Mood, palette, type, and texture per §13c — the leather/fireplace warmth is the point.

### 14d. Auto body / collision — the motion showpiece (Apex Collision)
This is the niche Noah wants loaded with **cool moving parts.** Auto body is the one place where heavy motion is *on-brand*, because every interaction can demonstrate the actual work — damage, repair, paint, and the finished car. **The motion must always be content (cars, paint, damage, before/after) — never decorative blobs (§11 still holds).** Build the pieces below; the first three are the centerpieces, the rest are polish. Every one needs a static/reduced-motion fallback and a tap (not hover) path on mobile.

- **Hero — scroll/enter car reveal.** The hero car arrives with motion: a **clear-coat shine sweep** (a glossy highlight band travels across the car on load/enter, like light over fresh paint — CSS/JS gradient mask) and, if you want the showpiece, a **scroll-driven car reveal** — the car rotates or comes into focus as you scroll the first viewport.
  - *Build approaches (pick by ambition):* (a) **image-sequence scrub** — 24–48 frames of a car rotating, drawn to a `<canvas>` and advanced by scroll progress (reliable, no WebGL); (b) **Three.js GLB** of a car rotating on scroll (the true Awwwards "car reveal," heavier); (c) simplest — a single hero shot with the shine-sweep only. Until real assets exist, use a labeled placeholder (`HERO — car reveal sequence (16:9)`).

- **Services section ("What we fix") — interactive damage map.** Replace the card grid with an **interactive car the visitor explores.** A side-profile car (photo or clean outline) with **hotspots** over the panels — front bumper, fender, door, quarter panel, frame, glass. Hover/tap a hotspot → it highlights (electric-blue pulse ring on the spot, not a floating shape) and the panel beside it swaps to that service's name + one-line plain description (Collision repair · Auto painting & refinishing · Dent removal/PDR · Frame straightening · Glass & calibration · Detailing). The car IS the menu.
  - *Fallback / mobile:* a horizontal scrubber or a simple tap-list of the 6 services with the car image updating; reduced-motion shows all six as a plain labeled list.

- **The transformation — collision before/after.** The proof moment: a **draggable before/after slider**, wrecked → restored (reuse the §14a slider; `clip-path` reveal of two stacked images, electric-blue handle). Make it the full-bleed media break and the most prominent thing on the page. Placeholders `BEFORE — collision (16:9)` / `AFTER — restored (16:9)`.

- **Paint & color match — live color picker.** A "custom paint & color match" block with a **row of automotive paint swatches**; clicking a swatch **changes the car's color live** (swap the panel image, or tint an SVG car / `mix-blend` over a grayscale base). Ties directly to the refinishing service and is a genuine "whoa" moment. Reduced-motion: show a static set of color options.

- **Estimate widget — "get a ballpark."** A small interactive estimate: pick **vehicle type/size** + **damage area/severity** → a **rough estimate range updates live** (set the figure in the mono face). Label it clearly *"rough estimate, not a quote"* (honesty, §12). The "see your estimate" CTA pre-fills/links the contact form — doubles as a lead magnet. (This mirrors the dynamic-pricing-by-vehicle pattern real detailing sites use.)

- **Value-props ("Why bring it here") — spec strip.** Replace the numbered list with a tight **spec-readout strip** (mono figures): Free written estimate · We handle the insurance claim · Lifetime warranty on our paint · OEM-quality parts. **Honesty (§12):** do NOT invent manufacturer/I-CAR certifications or specific stats on a demo — use these honest, generic trust items or leave cert badges as clearly-labeled placeholders (`CERT — I-CAR (placeholder)`), never fake credentials.

- **Marquee + spine:** standard seamless marquee (Collision ● Paint ● Dents ● Frame ● Glass ● Detailing) and all spine sections per §6.

- **Performance discipline (matters here most):** lazy-load the heavy hero sequence and any video; ship a poster/static first paint; keep the canvas/Three scene off the main thread where possible; honor `prefers-reduced-motion` on *every* interaction above (static image, side-by-side, plain list). A slow, janky showpiece is worse than a clean static one — if a piece can't hit 60fps on a mid phone, ship its fallback.

---

## 15. What stays shared (so the demos are still one studio)

Even with §13/§14 pulling each niche toward its own identity, these hold everywhere so the set reads as one studio's work:
- The **spine** sections (§6 ⟨spine⟩) — same structure, same order, same two-line header pattern, same eyebrow + numbered-section discipline.
- The **editorial restraint** — generous whitespace, hairline rules, ~2 accent uses per screen, no decorative shapes, one seamless marquee. Motion stays subtle and purposeful everywhere; auto body (§14d) is the one niche that turns the motion *up*, but even there every moving part is content (cars/paint/damage), never decoration.
- The **voice** (§8) — plain, specific, local, confident, no hype, no "X, not Y."
- The **honesty rules** (§12) — no fabricated proof; demo-labeled; the work is the pitch.
- The **placeholder convention** (§10) — labeled, correct aspect ratios, no stock/AI imagery committed.

The differentiation lives in palette, type, photography mood, and the two adaptive sections — *on top of* a shared spine. That balance (same bones, different skin and two different rooms) is the whole point: it proves Vilas can match a business to its own visual language without rebuilding from scratch each time.