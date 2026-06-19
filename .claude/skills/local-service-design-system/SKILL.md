---
name: local-service-design-system
description: >
  The visual design system for Vilas demo sites for local trade/service businesses
  (renovation/remodeling, landscaping, power washing, lawn care, florist, bakery, barber).
  Reverse-engineered from two real, high-quality sites built on the same template family:
  axelslandscapingdesign.com (landscaping) and sallemllc.pages.dev (general contractor).
  Use this whenever building or restyling a Vilas DEMO site. It makes the demos look like
  real, hired-contractor websites — photographic and editorial — NOT like abstract,
  shape-decorated AI pages. Demos vary by niche: renovation + landscaping are DARK, florist + bakery + power
  washing + lawn care are LIGHT, barber is warm-dark — see section 13. The main Vilas studio site uses its
  own separate bone palette + the Syne display face, never used on demos.
---

# Local-Service Demo Design System ("the Axel's / Sallem look")

## 0. Read this first

**What it is.** Axel's and Sallem are the *same underlying template*, re-skinned for two trades (same Cloudflare Stream video host, identical section skeleton, identical near-black theme color `#0b0b0c`). That is exactly Vilas's model — one strong system, re-flavored per niche. So this isn't loose inspiration; it's a working blueprint.

**The one-line essence:** *A near-black, full-bleed, photographic, editorial site. Real photos and video carry all the color. Big two-line headers, small uppercase eyebrows, numbered sections, hairline rules. Disarming, plain, local copy. One accent color per business, used about twice a screen. Zero decorative geometric shapes.*

**Sourcing note (important for the builder).** The *structure, section order, and copy patterns* below are observed directly from the two live sites and are accurate. The *specific color hexes, type sizes, spacing, radii, and motion timings* are NOT readable from HTML — they are prescribed build specs in this file. Treat the prescribed values as the spec and follow them exactly; do not invent your own.

---

## 1. The non-negotiable design DNA

1. **NO decorative geometric shapes. This is the rule that matters most.** No floating circles, blobs, rings, half-circles, "cut" diagonal shapes, abstract SVG decoration, gradient orbs, or shape-based section dividers. If a shape isn't a photo, a video, a line of text, a hairline rule, or a button, it does not belong. *(This is the single thing wrong with the current demos — strip all of it.)*
2. **Real photography is the design.** Every section's visual interest comes from full-bleed photos/video of the actual work, not from graphics. Where Noah hasn't supplied photos yet, use clearly-labeled image placeholders at the correct aspect ratio (see §10) so the layout reads correctly and photos drop in later.
3. **Quiet chrome lets the photos pop.** The UI (backgrounds, text, lines) stays quiet so the photography is the only loud thing — near-black for the heavy build niches (renovation, landscaping), and light/warm for florist, bakery, power washing, and lawn care. The chrome never competes with the photos. (Per-niche moods: §13.)
4. **Editorial, not flashy.** Big confident headers, generous whitespace, hairline rules, numbered markers, eyebrows. It should feel like a well-set magazine spread, not a web "design."
5. **Restraint with motion and color.** Subtle reveals and one marquee. One accent color, ~2 uses per screen. Nothing blinks, bounces, or floats.
6. **Local trust is the voice.** Plain, specific, slightly blunt. "We answer our phone." "No subs." "Free estimate, no pressure." (See §8.)

---

## 2. Color system — DARK niches (renovation, landscaping)

This near-black base is for the heavy build / contractor trades — renovation and landscaping. **Florist, bakery, power washing, and lawn care use LIGHT palettes, and barber uses a warm-dark one — see §13**, which overrides this section for those niches. Only `--accent` changes between the two dark niches:

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

**Scrim:** over every full-bleed photo/video that has text on it, lay a dark gradient (e.g. `linear-gradient(180deg, rgba(11,11,12,.35), rgba(11,11,12,.85))`) so headlines stay readable. Text on media is always `--fg`.

---

## 3. Typography (DEMO sites)

Use a clean modern **grotesque sans** for everything — the demos must read like a normal, real contractor site, **not** like the Vilas brand. (Do NOT use Syne here; Syne is reserved for the main Vilas site.)

- **Display/headers:** a tight neutral grotesque — `Geist`, `Inter Tight`, or `Satoshi`. Weight 600–700.
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

**Two-line header pattern (signature move).** Section headers are almost always two short lines with a hard break, e.g. Axel's *"Hired for the work. / Remembered for the care."* and *"Five specialties. / One crew."*; Sallem's *"A single crew / for every trade."* and *"Built right. / Finished on time."* Write every section header this way: punchy, two lines, often a period after each.

**Number markers.** Two acceptable styles — (a) a small uppercase `01` label sitting just above/beside the title (Axel's service cards), or (b) a large faint ghost numeral behind/beside the title (`--line` color, very low contrast). Pick one and use it consistently within a site.

---

## 4. Layout & spacing (DEMO sites)

- **Container:** max-width ~1200–1280px, centered. Side padding 24px mobile / 64–96px desktop.
- **Section vertical rhythm:** ~120–160px top/bottom desktop, ~72–96px mobile. Lots of air between sections — this is most of what makes it feel premium.
- **Full-bleed sections** (hero, photo/transformation break, CTA band) break out to 100vw and ignore the container.
- **Radii:** sharp. 4–6px max on cards/buttons; 0 on full-bleed media. No big pill/bubble rounding.
- **Dividers:** 1px `--line` hairlines between major bands where a visual break is needed. No shape dividers.
- **Grids:** service cards 2–3 col desktop / 1 col mobile; work grid 3–4 col desktop / 2 col mobile; value props 2–3 col / 1 col. Consistent gaps (~20–28px).
- **Image aspect ratios:** hero/break 16:9 cover; work-grid tiles 4:3 or 3:2; service-card thumbnails 4:3.

---

## 5. Motion (DEMO sites — subtle)

- **Scroll reveals:** fade + 16–24px translate-up as a section enters view, ~0.6s ease-out, children staggered ~0.08s. Once only, not on every re-scroll.
- **Marquee:** one continuous horizontal scroll band of service words, ~40–60s loop. (See §7.)
- **Hero video:** `autoplay muted loop playsinline`, poster image for instant paint, dark scrim on top. **Mobile:** show the poster still instead of autoplaying. **Reduced-motion:** poster still, no autoplay.
- **Hover:** cards lift `translateY(-4px)` + border brightens to a lighter line / soft shadow; links nudge their "→" ~4px and/or underline.
- **Sticky header:** transparent over the hero, then gains a `--bg` background + bottom hairline after ~80px of scroll; may shrink height slightly.
- **prefers-reduced-motion:** disable marquee auto-scroll, disable reveals (show final state), no video autoplay.

---

## 6. Homepage section sequence (the blueprint)

Build every demo homepage in this order. Sections marked ⟨skip on demos⟩ are real on Axel's but require real clients/data Vilas doesn't have.

1. **Sticky header** — logo/name (left or centered) · primary nav (Home/About/Services/Work/Contact) · phone number · one accent "Get a Quote / Free Estimate" button. Mobile collapses nav; keep a visible CALL/phone affordance.
2. **Hero** — full-bleed background **video** (or photo placeholder) + scrim. Small eyebrow or logo, **two-line H1**, one line of sub-copy, **two CTAs** (primary accent "Get a free estimate/quote" + secondary "Call (xxx) xxx-xxxx"), and a small **"Scroll"** cue at the bottom.
3. **Service marquee** — one horizontal looping band of the niche's service words, separated by `●` (Sallem) or wide spaces (Axel's), repeated 2–3×. Muted color, large-ish type.
4. **Intro / "Who we are"** — eyebrow ("What we build" / "Who We Are") + two-line H2 + 1–2 short paragraphs. **Then a row of stat/badge PAIRS** (label + value), e.g. Sallem's *"Concrete to Roofing — Full Scope," "Commercial & Residential — Both Markets," "Licensed & Insured — Fully Covered," "Free Estimates."* (Pairs are honest descriptors, NOT invented numbers — see §11.)
5. **Numbered service cards (01–0N)** — eyebrow + two-line H2, then a grid of cards. Each card: number marker, H3 title, 1–2 sentence plain description, and a "Explore →" / "View service" link. Optional small 4:3 thumbnail per card. Axel's = 5 cards, Sallem = 6.
6. **Full-bleed media break (the "transformation" moment)** — a 100vw photo or video with scrim and a single **two-line statement** + a short paragraph + optional ✓ checklist + one CTA. *On Axel's this is the "Featured · Driveway Transformation" video — this is exactly where Noah's future before/after content lives. For now use a full-bleed placeholder labeled "before/after / transformation."*
7. **Work grid** — eyebrow ("Recent work") + two-line H2 + "See All Work →". Grid of work images, each with a small **category tag** (e.g. "Patios," "Roofing") + a one-line **caption** ("Paver patio with stone accents"). Axel's = 8 tiles, Sallem = 6.
8. **Value props / "Why hire us" (numbered 01–0N)** — eyebrow + two-line H2, then numbered items: big number, H3 title, 1–2 sentence body. Axel's = 5 (Built By Hand / Built To Last / Straight Talk Pricing / Local & Responsive / Full Service), Sallem = 6 (One Contractor Every Trade / Commercial & Residential / Local-Based / Clean & On Schedule / Licensed & Insured / Free Estimates).
9. ⟨skip on demos⟩ **About + 3 stat badges** — optional; only if it doesn't imply fake history. A short "who we are" is fine; invented founding stats are not.
10. ⟨skip on demos⟩ **Reviews wall** — Axel's shows real, named Google reviews. **Do NOT fabricate reviews.** Omit this section entirely on demos. (For a real future client, pull their genuine Google reviews here.)
11. **Contact / "Free quote"** — eyebrow + two-line H2 + plain copy ("Call, text, email, or fill out the form. We usually reply same day. No pressure."). Contact methods row (call/text, email, location). **Form:** Name\*, Email\*, Phone, a **Service/Project-type dropdown** (the niche's services + "Not sure yet"), optional **Property-type dropdown** (Residential/Commercial) + **City** field (Sallem pattern), a "Tell us about your project" textarea, and a Send button. Include a **success message** and an **error message + Try Again** (real states, in the site's voice).
12. **Final CTA band** — full-bleed, short. A two-line line ("Ready to start? / Call us direct." or "Start your project. / One crew, start to finish.") + primary CTA + phone.
13. **Structured footer** — logo/name + one-line descriptor + service-area line, then 3 columns: **Navigate** (Home/About/Services/Work/Contact) · **Services** (the service list) · **Contact** (location, phone, email, **hours** e.g. "Mon–Sat, 7am–6pm"). Copyright row "© 2026 [Name]. All rights reserved." + a small tagline strip ("Built by hand," "Licensed & Insured · Free Estimates," etc.).

---

## 7. Component micro-specs

- **Header:** height ~72px. Transparent over hero → `--bg` + 1px `--line` bottom border after scroll. Phone always tappable (`tel:`). Quote button uses `--accent`.
- **Hero:** `min-height: 100svh`. Video layer (cover) → scrim → content bottom-left or centered. H1 two lines. Primary CTA = `--accent` background, `--bg` text; secondary CTA = ghost (1px `--line` border, `--fg` text). "Scroll" cue = small `--muted` label, optional tiny down-chevron line (not a shape blob).
- **Marquee:** flex row duplicated for seamless loop; words in `--muted` (or `--fg` at low opacity), separators in `--accent` or `--muted`; `will-change: transform`; pause on reduced-motion.
- **Numbered service card:** `--surface` background, 1px `--line` border, 4–6px radius, ~28px padding. Number marker top, title, description, "Explore →" pinned bottom. Hover: lift + border lightens, arrow nudges.
- **Full-bleed break:** 100vw media + scrim; content constrained to container; checklist items use a `--accent` ✓ then `--body` text.
- **Work tile:** image (4:3/3:2 cover) with a small category tag (uppercase `--muted`, optionally over the image bottom-left) + a one-line caption below or overlaid. Subtle zoom on hover (`scale(1.03)`, overflow hidden).
- **Value-prop item:** big number (ghost or label), H3, body. No card needed — can sit on `--bg` separated by hairlines or grid gaps.
- **FAQ accordion:** each row = `Q0N` + question (left) and a +/− or chevron (right), on a hairline-separated list. Expanding reveals the answer (`--body`) with a ~0.3s height+opacity transition. Numbered Q01–Q0N. Questions are hyper-local.
- **Contact form:** dark fields (`--surface` bg, 1px `--line`, `--fg` text, `--muted` placeholders), labels above. Dropdowns styled to match (no default browser chrome look). Submit = `--accent`. Below: success and error blocks (hidden until triggered).
- **CTA band & footer:** see §6.12–13.

---

## 8. Copy voice + phrase bank

**Voice:** plain, specific, confident, a little blunt. Short sentences. Contractions. No corporate filler, no hype, **no "X, not Y" constructions** (reads AI-generated). It should sound like a tradesperson who's good at their job and tired of slick competitors.

**Patterns that work (reword, don't copy verbatim):**
- Disarming trust: *we answer our phone* · *you deal directly with [owner]* · *no subs, no shortcuts* · *free estimate, no pressure* · *we show up when we say we will* · *no disappearing in the middle of a job.*
- Plain value: *built by hand* · *built to last* · *straight, written pricing* · *one crew for the whole project* · *clean site, on schedule.*
- Local: name the metro and nearby towns explicitly (it's a trust + SEO signal).
- Two-line headers: *"Hired for the work. / Remembered for the care."* energy — punchy, halved, often period-terminated.
- CTAs: *Get a free quote* · *Call [name] direct* · *Tell us about your project* · *Request a free estimate.*

**Honesty:** never imply paying clients, awards, years in business, or review counts the demo doesn't have. Plain descriptors ("licensed & insured," "one crew") are fine; invented numbers are not (see §11).

---

## 9. Per-niche adaptation

One accent per site, drawn from the trade. Marquee terms + the 01–0N services + a two-line H1 starter are given so cards and copy slot in with no guesswork. **The renovation/remodeling demo is built FIRST** (it maps directly onto Sallem).

| Niche (demo) | `--accent` | Marquee terms | Services 01–0N | Hero H1 starter (two lines) |
|---|---|---|---|---|
| **Renovation / remodeling** *(BUILD FIRST)* | `#C8893F` warm finished-wood caramel | Kitchens ● Bathrooms ● Additions ● Basements ● Whole-Home ● Trim & Carpentry | 01 Kitchens · 02 Bathrooms · 03 Additions & extensions · 04 Basements · 05 Whole-home renovations · 06 Trim & finish carpentry | "Old house. / New everything." |
| **Landscaping** (Stone & Sage) | `#5E7F52` moss/sage green | Patios ● Retaining Walls ● Gardens ● Lighting ● Fire Pits | 01 Design · 02 Patios & walkways · 03 Retaining walls · 04 Garden & planting · 05 Maintenance · 06 Custom (fire pits, pergolas) | "Built to be lived in. / Built to stay." |
| **Power washing** (Tide Line) | `#2F9BD4` clean water blue | Houses ● Driveways ● Decks ● Patios ● Fences | 01 House soft wash · 02 Driveways & walkways · 03 Decks, fences & patios · 04 Roof/gutter wash | "Like the day / it was built." |
| **Lawn care** (Fresh Cut) | `#4E9A4A` fresh grass green | Mowing ● Cleanups ● Edging ● Mulch ● Fertilizing | 01 Weekly mowing · 02 Spring & fall cleanups · 03 Mulch & edging · 04 Fertilizing & weed control | "Your lawn, / handled." |
| **Florist** (Wildstem) | `#B14A63` deep bloom rose | Weddings ● Events ● Daily ● Weekly ● Sympathy | 01 Daily arrangements · 02 Weddings & events · 03 Weekly flowers · 04 Sympathy | "Picked, / not produced." |
| **Bakery** (Golden Hour) | `#C9802F` warm crust amber | Sourdough ● Pastry ● Cakes ● Focaccia ● Cookies | 01 Daily bread · 02 Morning pastry · 03 Cakes to order · 04 Wholesale | "Baked at 4am. / Gone by noon." |
| **Barber** (Standard) | `#B23A3A` classic chair red | Cuts ● Fades ● Beards ● Shaves ● Kids | 01 Haircut · 02 Skin fade · 03 Beard & line-up · 04 Hot-towel shave | "A good cut. / Every time." |

**Renovation demo full spec (zero guesswork, built first):**
- **Sample name (swappable, demo-labeled):** "Maple & Main Renovation Co.", North Shore, Long Island. Accent `#C8893F`.
- **Hero:** H1 *"Old house. / New everything."* · sub *"Kitchens, baths, additions, and whole-home renovations across the North Shore. One crew, start to finish."* · CTAs *Get a free estimate* + *Call (516) 555-0000* · Scroll cue. Full-bleed video placeholder (renovation b-roll).
- **Marquee:** Kitchens ● Bathrooms ● Additions ● Basements ● Whole-Home ● Trim & Carpentry.
- **Intro:** two-line H2 *"Every trade. / One crew."* + 1–2 plain paragraphs. Stat/badge pairs: *Small remodels to whole-home — Full Scope · Licensed & Insured — Fully Covered · One Crew, No Subs · Free Estimates.*
- **Service cards 01–06:** the six above, each with a plain 1–2 sentence description + "Explore →" + 4:3 placeholder.
- **Full-bleed break:** eyebrow *"See the transformation"* + H2 *"We protect what's good. / We rebuild the rest."* + paragraph + checklist (✓ Free in-home estimate · ✓ One crew, no subs · ✓ Clean site, on schedule · ✓ Licensed & insured) + CTA *Meet the crew*. (Future before/after video slot.)
- **Work grid:** tags Kitchen / Bath / Addition / Whole-home / Exterior; captions like "Kitchen — full gut renovation," "Primary bath — walk-in tile shower," "Rear addition — framed & finished." 6 placeholders.
- **Value props 01–05:** One crew, every trade · Built to last · Straight, written pricing · Local & responsive · Clean and on schedule.
- **FAQ Q01–Q06 (local):** What areas do you serve? (Long Island towns) · Do you handle small remodels and whole-home? · Are you licensed and insured? · Do you give free estimates? · How long does a renovation take? · Do you use your own crew?
- **Contact:** form with Project-type dropdown (Kitchen / Bath / Addition / Basement / Whole-home / Multiple / Not sure), optional Property type, City, details; "we reply same day" line; call/email; success + error states.
- **CTA band:** *"Ready to start? / Let's walk the house."* + phone.
- **Footer:** Navigate / Services / Contact columns + hours ("Mon–Sat, 7am–6pm").
- **No reviews wall. No invented stats.**

---

## 10. Image placeholder convention (Noah swaps real photos in later)

Until real photography exists, use neutral, **clearly-labeled** placeholders so the layout is correct and the page never looks broken:
- Solid `--surface` (or a dark neutral) fill with a thin `--line` border, a small centered `--muted` label naming the slot and aspect, e.g. `HERO VIDEO — 16:9`, `WORK — Kitchen reno (4:3)`, `SERVICE — Roofing (4:3)`, `TRANSFORMATION — before/after (16:9)`.
- Keep the exact final aspect ratios (§4) so nothing shifts when photos land.
- No stock photos, **no AI-generated images**, no generic Unsplash filler in the committed build — placeholders only, so Noah controls the imagery.

---

## 11. Anti-patterns — do NOT do these

- ❌ Any decorative geometric shapes (circles, blobs, rings, cut/diagonal shapes, abstract SVG, gradient orbs, shape dividers). *This is the main thing to remove from the current demos.*
- ❌ Fabricated reviews, testimonials, client names, star counts, "trusted by," or logo walls.
- ❌ Invented statistics or history ("500+ projects," "since 1998," "98% satisfaction"). Plain descriptors only.
- ❌ AI-generated or stock images committed into the build.
- ❌ "X, not Y" copy constructions; corporate filler; hype.
- ❌ Heavy rounding / bubbly cards; rainbow of colors; accent used as decoration.
- ❌ Washed-out, low-contrast light demos. Light is *correct* for florist/bakery (§13) — but keep AA text contrast and editorial discipline. Bright and airy, never pale mush. (The main Vilas site's bone palette is still its own thing; don't copy it onto demos.)
- ❌ Using the Syne display face on demos (Syne = Vilas brand only; demos use a neutral grotesque).

---

## 12. Honesty rules (demos specifically)

- Demos are **Vilas's own self-initiated builds**, shown as style examples — never presented as paying clients.
- Sample business names, phones, and addresses are fine as long as nothing claims real results, reviews, or history.
- Skip every section that would require fabricating proof (reviews wall, client counts). The work itself is the proof.

## 13. Niche mood & palette variants (not every demo is dark)

**The principle.** The *skeleton* is identical on every demo — same section order (§6), two-line headers, numbered blocks, photo-led layout, full-bleed media break, work grid with tags, plain copy. That shared structure is what makes them read as one studio's system. But the *mood* — palette, type personality, how the photography is lit — must match what that kind of business actually looks like online. **The demos should look different from each other on purpose.** A florist that looks like a roofing company is a failed demo even if it's built perfectly. Matching a business to its own visual language is the entire thing these demos exist to prove.

**Who gets which mood:**

| Niche | Mood | Why |
|---|---|---|
| Renovation, Landscaping | **DARK** (the §2 base) | Heavy design-build / hardscape work reads premium on near-black; the photos carry the color. |
| Florist, Bakery, Power washing, Lawn care | **LIGHT** (airy / warm / clean, below) | Bright, fresh, approachable businesses. Power washing and lawn care sell *clean and fresh* — a bright site proves it; dark makes them feel heavier and pricier than they are. |
| Barber | **WARM-DARK** (below) | Dark fits the old-school chair — but warm and vintage, not the cool blue-black of the contractor demos. |

§13 overrides §2 (palette) and §3 (type) for the named niches. Every other rule in this skill still holds.

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
- **Type:** an elegant display **serif** for headers — Fraunces or Playfair Display, used with restraint (not every line) — paired with a clean sans body (Inter / Geist). The serif is what reads "florist / editorial" instead of "contractor." (Still never Syne — that is Vilas-brand only.)
- **Photography:** bright natural daylight, lots of negative space, close-up stems, the shop, soft real shadows. Airy — never moody or dark.
- **Shifts vs. the dark base:** more whitespace; lighter, thinner hairlines; soft shadows instead of hard borders on cards; the hero is a bright image with dark text in a clear zone (a light scrim or none, not a heavy dark gradient); marquee in muted rose or sage. Buttons: rose fill + white text, or a thin outline.
- **Keep all structure:** numbered 01–04, two-line headers, work grid with tags + plain captions, the full contact form.

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
- **Photography:** warm morning light, golden tones, crumb and crust close-ups, the case, steam. Cozy and appetizing.
- **Shifts:** warm cream throughout; amber accent on CTAs; soft shadows; cream marquee. Lean slightly more rounded than the sharp dark demos (radius up to ~8px) since warm/handmade suits it — but don't go bubbly.
- **Keep all structure.**

### 13c. Barber — warm vintage dark (Standard)

```
--bg       #14110E   /* warm espresso-black (NOT the cool #0B0B0C) */
--surface  #1E1915
--fg       #F1EADD   /* warm bone */
--body     #C3B8A6
--muted    #8A7E6C
--line     #2C261F
--accent   #B23A3A   /* classic chair red — or brass #B08D57 */
```
- **Type:** a vintage **condensed** display or a slab — barbershop-signage energy (a bold condensed grotesque, or Oswald / Anton used sparingly) — with a clean sans body. Uppercase, tracked headers work well.
- **Photography:** warm interior light, leather, chrome, the chair, brass, vintage tones. Moody but *warm* — the opposite of the cold industrial feel of the contractor demos.
- **Shifts:** warm espresso-black instead of blue-black is the main tell; red or brass accent; a little grain/texture is welcome. This is what makes it read as a *barber* and not as another contractor.
- **Keep all structure.**

### 13d. Power washing — clean & crisp (Tide Line)

```
--bg       #F4F7F9   /* clean cool off-white (water-white) */
--surface  #FFFFFF
--fg       #14202A   /* deep cool ink */
--body     #4D5A64   /* cool slate */
--muted    #8A98A2   /* cool gray */
--line     #E2E9ED   /* cool light hairline */
--accent   #1E86C4   /* clean water blue (a touch deeper than §9 for contrast on white) */
```
- **Type:** a clean modern grotesque (Inter / Geist), crisp and no-nonsense — power washing is utility, not editorial, so no serif.
- **Photography:** bright daylight, sparkling-clean surfaces, water spray, vivid before/after with the "after" gleaming. High-key and crisp.
- **Why light:** the whole pitch is *spotless / like-new*. A bright, almost clinically clean white site proves the service before a word is read — lots of white space literally reads "clean." Blue accent ties it to water.
- **Shifts vs. the dark base:** white surfaces, cool light hairlines, soft shadows; the before/after transformation block is the hero moment — keep it prominent. Buttons: blue fill + white text.
- **Keep all structure.**

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
- **Why light:** it's a friendly, low-stakes weekly service — it should feel easy, sunny, and approachable, not premium-dark. Lots of sky and green.
- **Shifts vs. the dark base:** white surfaces, light green hairlines, soft shadows, green accent on CTAs.
- **Keep all structure.**

### 13f. Don't let "light" become "weak"

- Keep **AA contrast** on all text (the `--fg` / `--body` values above are chosen for this).
- Bright and airy is not pale and washed out. Keep real contrast, confident headers, and the same editorial discipline as the dark demos.
- Every §11 / §12 rule still applies: no decorative geometric shapes, no stock or AI images, no fake reviews or stats.
- Scrims: on light heroes use a *light* scrim or a clear text zone, never a heavy dark gradient.