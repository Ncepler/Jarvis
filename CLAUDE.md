# CLAUDE.md — Studio Website

Read this whole file before touching anything. Then read `HANDOFF.md` (see Session Continuity). Assume every session is a cold start — nothing from previous chats exists unless it's written down in this repo.

---

## 1. What this project is

The public website for a small web-design studio run by Noah (Long Island, NY). It sells websites to local small businesses (flower shops, lawn care, pressure washing, etc.).

The site has two jobs:
1. **Proof of legitimacy.** Prospects arrive from a cold email and need to think "okay, these people are real and good" within 5 seconds.
2. **Be its own demo.** The site's interactions ARE the portfolio's first exhibit. If the gallery feels expensive, the pitch is already made.

**How prospects actually arrive:** they get the cold email, then Google the studio name to check it's real. That means (a) the search snippet is the first trust impression — meta title/description should read like a real local business: `{SITE.name} — web design studio, Long Island, NY` pattern, plain-language description, and (b) the page they land on has to win them in the first screenful.

**Not in this repo:** client sites, any agent/automation system, admin dashboards, blogs, CMS, auth. If you're tempted to add any of those, don't.

---

## 2. Brand name — placeholder rules (important)

The business name is **not decided yet**. Never hardcode a name anywhere.

- All brand strings live in **one file**: `lib/site.ts`

```ts
export const SITE = {
  name: "STUDIO_NAME_TBD",        // the FULL brand, e.g. "Word Studio" — swapped once, later
  domain: "DOMAIN_TBD",           // may be a .studio or a compound .com — don't assume
  tagline: "TAGLINE_TBD",
  email: "CONTACT_EMAIL_TBD",
  instagram: "INSTAGRAM_URL_TBD",
  region: "Long Island, NY",
} as const;
```

- The final name will most likely take the shape **"[real word] + Studio"** (e.g. how "Apple Computer" worked — word remembers, descriptor explains). So `SITE.name` holds the complete brand including the descriptor. **Never hardcode the word "Studio" anywhere else in copy or components** — if the final name already ends in Studio, hardcoded ones would double it ("Trellis Studio studio").
- Every component that shows the name imports from `SITE`. Renaming should be a one-line change.
- Logo: build `components/Logo.tsx` as a simple geometric placeholder mark (a circle, a square, initials-free). One file to swap later.
- SEO titles/descriptions/OG images that depend on the name: stub them using `SITE.name` and mark with `// TODO(name)`. Don't generate a final OG image until the name exists. Domain purchase + Vercel domain attach also wait for the name — the site lives on the default `.vercel.app` URL until then.
- Do not invent a name yourself, even temporarily in copy.

---

## 3. Stack (firm — don't substitute)

- **Next.js 15**, App Router, TypeScript `strict: true`
- **Tailwind CSS v4** — design tokens as CSS variables via `@theme` in `globals.css`
- **Motion** (the library formerly Framer Motion) — layout morphs, micro-interactions
- **GSAP ScrollTrigger + Lenis** — scroll choreography. Gotcha: wire Lenis into ScrollTrigger correctly (`lenis.on('scroll', ScrollTrigger.update)` + RAF loop) or pinning will jitter.
- **Supabase** — ONLY for the lead/intake form (one table). Nothing else.
- **Vercel** for deploys, **GitHub** as source of truth.
- No CMS. No component libraries (no shadcn, no MUI). No auth. Portfolio data is a typed array in `lib/projects.ts`.

Commands: `npm run dev` / `npm run build` / `npm run lint` / `npx tsc --noEmit`. Run build + typecheck before calling anything done.

Git: commit per working feature, imperative messages ("add gallery coverflow"), push to main → Vercel auto-deploys. The live deploy is the test bed — check it, don't trust localhost alone.

---

## 4. Session continuity protocol (do not skip)

Claude has no memory between sessions. The repo is the memory.

**`HANDOFF.md` lives at the repo root and is committed**, never gitignored.

**At the start of EVERY session, in order:**
1. Read `CLAUDE.md` (this file)
2. Read `HANDOFF.md`
3. `git log --oneline -10` and `git status`
4. Run `npm run build` to confirm the baseline isn't broken before changing anything

**Update `HANDOFF.md` when:**
- You notice context running low or the session has gotten long — **stop and update it immediately, before doing more work.** Don't wait until you're out of room; by then it's too late to write a good handoff.
- A feature reaches done
- A session is ending
- Right before any risky refactor

**`HANDOFF.md` format** (overwrite to reflect NOW — it's a state file, not a diary; keep under ~150 lines):

```md
# HANDOFF — updated YYYY-MM-DD

## Current state
- Deployed: <vercel url>, builds clean: yes/no
- Done: <sections/features that work, verified on mobile>

## In progress
- <exact file> — <what's half-finished> — next concrete step: <one action>

## Next up (ordered)
1. ...
2. ...

## Gotchas & decisions
- <things learned the hard way, e.g. "site X blocks iframes — set embeddable:false">

## Blocked on Noah
- <assets/decisions needed: name, screenshots, video clips, real URLs>
```

Rules: commit working code **before** updating the handoff, so "done" means "pushed." Never end a session with uncommitted work. If forced to stop abruptly, three bullets in `HANDOFF.md` beat nothing.

---

## 5. Design direction

References: **terminal-industries.com, igloo.inc, relats.com**. Study the restraint — few colors, huge type, motion as the luxury. This site should feel like a small studio that charges 10x what it actually does.

**Deliberate contrast:** the final brand name will likely be warm/friendly while the site stays dark and cinematic. That mismatch is intentional — warm name kills the cold-email scam vibe, expensive-looking site carries the premium signal. Do not soften the visual direction to "match" a friendly name.

**Tokens** (define in `@theme`, use everywhere, no one-off hex values):

```
--color-bg:    #0B0B0C   /* near-black, hair of warmth */
--color-ink:   #F4F2ED   /* warm off-white */
--color-muted: #8A8782
--color-line:  rgba(244, 242, 237, 0.12)
--color-accent: → undecided until the brand exists. Until then the site is monochrome (ink on bg). Do NOT add a placeholder acid-green/purple accent — that's the generic AI-site look. When the name lands, the accent gets chosen with it.
```

**Typography:** two faces max via `next/font`, zero layout shift.
- Body/UI: Inter or Geist.
- Display: one characterful face used with restraint — pick from Space Grotesk or a sharp serif like Instrument Serif, commit early, log the choice in HANDOFF. Display scale is big: hero `clamp(3.5rem, 9vw, 9rem)`, section titles `clamp(2rem, 5vw, 4rem)`, tight tracking on display sizes.

**Motion principles:**
- Transform + opacity only. Nothing bounces. Ease: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Micro-interactions 150–250ms, reveals 500–700ms, the gallery morph ~600ms, staggers 60–90ms.
- Fewer, bigger, smoother. One orchestrated moment beats ten scattered effects.
- **Spend the boldness in one place: the gallery.** Everything else stays quiet and disciplined.
- `prefers-reduced-motion` is respected everywhere — see §11.

**Layout:** generous air. Desktop section rhythm ~160px+ vertical. Hairlines (`--color-line`) over boxes and shadows.

**Avoid:** emoji in UI, gradient-text headlines, three-feature-card filler rows, stock illustration, fake glassmorphism. If a choice would look the same on any agency template, it's wrong.

---

## 6. Pages & sections (single page + a couple of routes)

One long landing page, in this order: Hero → Services → Gallery → All Sites → About → Contact. Plus `/api/lead` route handler.

### 6.1 Hero
- Full viewport, dark, type-led. `SITE.name` placeholder huge, one-line positioning under it.
- One subtle ambient layer max (slow gradient drift, grain, or canvas noise — pick one). No 3D, no particles in v1.
- Build an **optional background-video slot**: muted, looped, `playsinline`, poster frame, `preload="none"`, lazy. Noah will supply an ambient clip later — build the slot, don't block on the asset.
- Scroll cue at the bottom (subtle, animated once).

### 6.2 Services — the three paths (Animated Product Card pattern)
Three tiles matching the intake choice:
1. **Pick a style** — "~$300"
2. **Custom build** — "from $500"
3. **Flagship** — "let's talk"

Behavior (this is a signature pattern, get it right):
- Resting state: a compact card / glowing badge.
- On hover, the card expands; the text content (title, line of copy, price tag) fades in **with a ~0.75s delay** after the card opens — the delay is the trick.
- One visual element (image or abstract shape) overflows the card bounds on expand — breaking the frame is what makes it feel premium. Any product-style imagery must be a transparent PNG cut-out.
- **Mobile: no hover.** Trigger the expanded state on tap or scroll-into-view instead.

### 6.3 Gallery — "Previous Websites Built" (the centerpiece)
A horizontal, draggable card row; clicking the active card opens the site's actual homepage in a panel directly below the row. (Noah 2026-06-11: this replaced the original morph-expand-with-live-iframe spec.)

- **Row:** drag/swipe with momentum (Lenis-feel easing). Coverflow depth: center card forward, full opacity, crisp; neighbors scaled ~0.88, dimmed ~0.45, pushed back. Snap to center.
- **Homepage panel:** clicking the active card opens an inline panel under the row (`~min(96vw, 1400px)`) and scrolls it into view. Inside is the project's REAL homepage — interactive, served from a mirrored copy of its code.
- **Mirrored previews:** each project's homepage HTML lives in `public/previews/<slug>.html` (`preview` field), captured via `node scripts/mirror.mjs <slug> <url>` or pasted in by hand with a `<base href>` tag. Because we serve it from our own origin, X-Frame-Options can't block it. The iframe is sandboxed without `allow-top-navigation` so the copied site's scripts can't frame-bust. Lazy-mount only on open; never preload.
- **Fallbacks:** if `preview` is empty → live iframe of `url` (desktop only, requires `embeddable: true`, verified per-site by header check) → `screenshotFull` capture.
- **Mobile:** the mirrored preview iframe shows on mobile too (Noah's call, 2026-06-11). The live-URL iframe fallback stays desktop-only.
- **Staggered text:** business name, tier tag, and "view live →" slide in a beat after the panel settles.
- **Price tag:** the active card shows its tier as a small clear element ON the card ("~$300 · template" / "custom from $500" / "let's talk"). Ranges and tiers only — never an exact past price.
- One panel open at a time. Esc / close button collapses it; focus returns to the card.
- **The gallery doubles as the "pick a style" intake step.** On cards where `isStyleDemo: true`, the expanded state includes a "start with this style →" button that scrolls to the contact form and pre-selects that style (pass the project `slug`). This is how a browsing prospect becomes a lead without retyping anything.
- Lazy-load off-screen card images. Card order comes from the data file's `order` field — Noah controls the anchoring strategy (most impressive-but-affordable first, flagship at #1–2, include one cheap-looking-great one).

### 6.4 Scroll-pinned logo (gallery section only)
- `Logo` fixed bottom-left of the viewport, visible ONLY while the gallery section is on screen.
- IntersectionObserver on the gallery section, `threshold: 0.2`, toggles a class; opacity fade 0.3s; `pointer-events: none`; small, watermark-weight; margin so it never overlaps cards; hide entirely below ~640px if it crowds.
- It's a brand mark, not a button. Don't attach behavior to it.

### 6.5 All Sites — the plain list
- A separate simple section: clean rows or tidy grid, business name → opens the live site in a new tab. **No animation, no iframes.** This is the utility view; don't let the fancy gallery absorb its job.

### 6.6 About
- 2–4 sentences, human: small web studio, Long Island, here's the work, here's the Instagram.
- Do not mention age in either direction. Do not invent years in business, team size, or credentials. Studio "we" is fine; "our team of 12" is not.

### 6.7 Contact / intake
- Fields: name, business name, email, path (radio: "pick a style" / "something custom" / "you figure it out"), optional style (a select of `isStyleDemo` projects, auto-filled when they arrive via a gallery card's "start with this style" button), message. Plus a hidden honeypot field for spam.
- Submits to `POST /api/lead` (route handler, server-side): validate, insert into Supabase `leads` table using `SUPABASE_SERVICE_ROLE_KEY` (server-only env — never expose it client-side). Table: `id, created_at, name, business, email, path, style_slug, message`. RLS enabled, deny-all (service role bypasses).
- **If Supabase env vars are missing, the form renders as a styled mailto fallback** — the site must be shippable without the backend.
- Success state: plain confirmation in the interface's voice ("Got it — we'll reply within a day."). Errors say what went wrong and what to do, never just "something went wrong."

### Footer
`SITE.name`, email, Instagram, "Long Island, NY". That's it.

---

## 7. Portfolio data model

`lib/projects.ts` — the only source of portfolio truth:

```ts
export type Project = {
  slug: string;            // also used as the contact form's style reference (style_slug)
  name: string;            // business or style name shown on the card
  url: string;             // live site
  screenshot: string;      // /public/work/<slug>.webp — 16:10, supplied by Noah
  screenshotFull: string;  // full-length homepage capture, last-resort fallback
  preview: string;         // /previews/<slug>.html — mirrored homepage code (see §6.3)
  tier: "template" | "custom" | "flagship";
  priceLabel: string;      // "~$300 · template" | "custom from $500" | "let's talk"
  order: number;           // card position; lower = earlier
  embeddable: boolean;     // verified manually — default false until tested
  isStyleDemo: boolean;    // true = Noah's own template demo, not a client site
};
```

**Integrity rules (hard):**
- Only real builds go in. Before client work exists, the cards are Noah's own template demos — label those honestly as styles/demos (`isStyleDemo: true`, shown as "Styles" not fake client names).
- Never fabricate client names, testimonials, logos, review counts, or stats ("trusted by 100+ businesses"). Earn it, then add it.
- Screenshots are **real captures of real deployed sites** — never AI-generate or mock up a website screenshot. Ambient/atmospheric video is the only generated media on the site, it's supplied by Noah, and it never depicts UI.

---

## 8. Copy voice

Copy is design material. Same bar as spacing and type.

- Casual, plain, confident. Short sentences. Contractions. Sentence case.
- Specific beats clever. "Websites for local businesses that look like they cost 10x more" beats "Elevating digital experiences."
- Banned: synergy, elevate, solutions, unleash, empower, cutting-edge, 🚀, exclamation-point stacking.
- Buttons say what happens: "See the work", "Start a project", "View live". The same action keeps the same name everywhere.
- Prices on the site are ranges/tiers only, flagship is always "let's talk". (Cold emails handle pricing differently — not this repo's problem.)

---

## 9. Performance budget

- Lighthouse mobile ≥ 90 performance; LCP < 2.5s on the deployed URL.
- `next/image` for every image, explicit `sizes`, WebP/AVIF.
- Video: poster frames, `preload="none"`, compressed (≤1080p, short loops, no audio track).
- Iframes mount only on gallery expand. Off-screen cards lazy-load.
- Heavy libs (GSAP, anything else chunky) dynamically imported where they're used. No Three.js in v1 at all.
- Fonts: variable, subset, `display: swap`.

---

## 10. Accessibility

- Gallery is keyboard-operable: arrow keys move the active card, Enter expands, Esc closes; focus moves into the expanded view and returns on close.
- Drag region has an aria label; cards are buttons/links, not bare divs.
- Visible focus states (not the browser default blue, but visible).
- Contrast AA against `--color-bg` for all text including `--color-muted`.

---

## 11. Reduced motion (non-negotiable)

When `prefers-reduced-motion: reduce`:
- Lenis smoothing off (native scroll), ScrollTrigger pinning/parallax off.
- Gallery morph becomes a simple crossfade; coverflow becomes a flat scroll row.
- Product-card expand becomes instant show/hide with a short fade.
- Ambient hero video doesn't autoplay; poster shows instead.
Gate the GSAP/Lenis init behind the media query — don't initialize and then disable.

---

## 12. Scope

**v1 (this build):** everything in §6.

**Phase 2 (do NOT build now, but don't paint into a corner):**
- The "museum walkthrough" 3D POV scroll hero (Three.js). Keep the hero component swappable so it can replace the v1 hero later.
- Real OG image + favicon set once the name exists.
- Per-project case-study pages.

**Never (wrong repo / wrong product):** CMS, auth, dashboards, client-site code, automation agents, light mode.

---

## 13. Build order

1. Scaffold: Next 15 + Tailwind v4 + tokens + fonts + `lib/site.ts` + `Logo` placeholder + `HANDOFF.md` created. Deploy pipeline proven (push → live) before anything else.
2. Page shell: all sections stubbed with real copy in the right voice.
3. Hero (with empty video slot).
4. Services product-card tiles (desktop hover + mobile tap states).
5. Gallery static row → drag + coverflow → morph expand → **iframe embed test with real URLs (early!)** → staggered text + price tags.
6. All Sites list, About, Contact (form + `/api/lead` + Supabase, mailto fallback).
7. Pinned logo, reduced-motion pass, a11y pass, perf pass against the budget.
8. SEO/meta stubs with `// TODO(name)`.

Definition of done, per feature: builds clean, typechecks, lints, verified on the live deploy, verified on a phone-width viewport, reduced-motion checked, committed and pushed, `HANDOFF.md` current.

---

## 14. Env vars

`.env.local` (never committed):
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, used in /api/lead exclusively
```
Mirror them in Vercel project settings. If absent, the contact form falls back to mailto (see 6.7) — the build must never fail because env is missing.
