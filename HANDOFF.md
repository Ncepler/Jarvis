# HANDOFF — updated 2026-06-17 (v13)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v13.
- **Palette moved off pure black/white → warm colour (Noah, 2026-06-17, v13).** `globals.css` `@theme`: bg `#17120D` (espresso), surface `#241C15`, ink `#F2ECE0` (cream), muted `#998C7E` (taupe), line `#34291F`, accent `#E89A3C` (amber-gold, primary), **NEW** accent-2 `#6F8FB3` (slate blue, secondary). Two accents max; accent = primary action/emphasis, accent-2 = links + active states; never big fills. CLAUDE.md §5 tokens + discipline note updated to match. Demos (`components/demos/*`) keep their OWN hardcoded colours — untouched by design. Applied accent-2 to genuine link hovers: Footer, PinnedLogo socials, About inline link. Everything else's accent usage unchanged.
- **Reveal motion (v12):** travel/slide between slots is now `TRAVEL = 1.1s` (slower VAL slide-in + every rearrange). Final VALIS→VILAS is a real position swap — `swapI`/`swapS` are persistent nodes across both phases so A & I FLIP-travel instead of crossfading, and A (+360°) / I (−360°) spin a full turn past each other (`spinFor`), landing upright. Resolved copy (.studio/tagline/CTA) now waits 1200ms so the spin finishes first. JUDGMENT CALL: full 360° (not 180°) so the final wordmark lands upright — a literal 180° would leave A & I upside-down at rest. Change the two numbers in `spinFor` if you actually want them inverted.
- **Accent RESOLVED → warm amber-gold `#E8A24A`** (Noah, 2026-06-17). `--color-accent` in `globals.css` set; `--color-muted` is `#6F6F69`. CLAUDE.md §5 tokens updated to match. Still exactly one accent, used sparingly (CTA / hover / focus ring).
- **Reveal retuned (v11):** every letter now uniform — same size, weight 500, ink colour, opacity 1 (dropped the 700/300 bright-vs-dim split). V·A·L persist by motion alone. Paced slower: each tour word holds ~1.3s, pivots ~1s, transitions 0.7s (`HOLDS` const), mobile trim eased to `k=0.85`.
- **Brand RESOLVED → Vilas** (VEE-las, from "visual"), domain `vilas.studio`, wordmark "Vilas Studio". `lib/site.ts` now has `BRAND = "Vilas"`, `name = "${BRAND} Studio"` (the only place "Studio" is written), `brand`/`domain` filled. `tagline`/`email`/`instagram`/`founder` still `*_TBD`.
- **Stage 0 shipped — opening reveal + minimal hero:**
  - `components/hero/VilasReveal.tsx`: V·A·L are 3 persistent Motion nodes
    (ids cV/cA/cL) that FLIP-travel via `layout`; dim/light helpers fade
    in/out via `AnimatePresence mode="popLayout"`. Sequence VILAS→VAL→VALid→
    inVALuable→approVAL→VAL→VALIS→VILAS→.studio. Tour words config-driven
    (`TOUR` const). Scale-to-fit wrapper (measured per phase) → no overflow at
    360px, transform-only so no layout shift.
  - Skippable (click/tap/scroll/keydown → resolved), plays once, in-flow so it
    never gates the page. Shortened on mobile (k=0.6). SSR/no-JS/reduced-motion
    render the resolved VILAS + .studio + tagline statically (verified in the
    prerendered HTML), no flash.
  - Hero shell stripped to the single bold thing: wordmark + one line
    (`COPY.hero.positioning`) + one CTA ("See the work" → #work) + scroll cue.
    Removed the old top header (Logo + "Start a project") and the second
    outcome line.
- **Tokens → monochrome (brief):** bg `#0B0B0C`, ink `#EDEBE3`, `--color-accent`
  NEUTRAL == ink (one-line swap when Noah picks a colour). This changed the
  whole site's field/accent, not just the hero — review other sections on the
  live URL.
- **Fonts:** added Space Grotesk (wordmark, variable 300/700) + Space Mono
  (.studio/mono). Inter (body) + Instrument Serif (section titles) kept → 4
  faces total (perf tradeoff; consolidate in Stage 2).
- GSAP installed (^3.15) per the stack — NOT used by the Stage-0 reveal
  (Motion `layout` does the FLIP); reserved for Stage 1.

## Next up (ordered)
1. Noah: real-browser pass on the live URL — reveal feel (VAL travel, long-word
   scaling, .studio fade), the skip-on-interaction, mobile width, reduced
   motion. Codespace has no browser; logic verified but not visually.
2. Noah: SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (form is mailto
   fallback until then — unchanged from before).
3. Still TBD before launch: tagline, email, instagram, founder → lib/site.ts;
   real OG image + favicon (name exists now, so unblocked); attach vilas.studio
   domain in Vercel.
5. Stage 1 (NOT now): R3F signature object + inertial Lenis + the accent.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last
  message of session states "version: vN".
- Reveal tech is **Motion `layout`, not GSAP** (brief suggested GSAP). Reason:
  Motion keeps the SAME DOM nodes (acceptance test 1). Don't "fix" it to GSAP.
- Scale-to-fit reads `row.scrollWidth` (untransformed) and applies a CSS
  `scale()` to a wrapper that is NOT the Motion layout element — keep them
  separate or the two transforms fight.
- ".studio" is derived from `SITE.domain`; "Studio" only ever written in
  `SITE.name`. Never hardcode it.
- Hero is a server component; `VilasReveal` is the only client piece and owns
  all timing + the resolved-state fade of .studio/tagline/CTA.

## Supabase (unchanged from v8 — still RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier.
  `leads` table + RLS deny-all; `/api/lead` uses plain fetch → PostgREST.
- `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key
  into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder
- Phone + real-browser pass on the live URL (reveal, reduced motion)
- Pressure-washing hero clip for the power-wash demo (slot still ready)
