# HANDOFF — updated 2026-08-12 (v41)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — footer stamp v41. `npm run build` + `tsc --noEmit` + `next lint` all clean.
- **9 demos now** (added the Magician, see below). All 9 registered in `components/demos/index.ts` + `lib/projects.ts`, all show in the gallery and the "Every site" index. Verified end-to-end in-browser (open from gallery card, open from "Every site" row, reduced-motion, 390px mobile) — 0 console errors from anything touched this session.
- This session ran a full design-system compliance pass against `.claude/skills/local-service-design-system/SKILL.md`. Headline finding: **most of the brief was already done** in earlier sessions (marquees were already seamless, the timeline copy was already fixed, the logo was already a real transparent mark) — see "Gotchas" below for what was actually a gap vs. already-compliant.

## v41 — Elias Vane, the Magician demo (this run, SKILL §16)
- New `components/demos/MagicianDemo.tsx` (~950 lines), slug `demo-magician`, flagship tier, order 8. **Fully self-contained — does NOT import `./system`** (the local-service spine); §16 is a deliberate departure from the rest of the demo system (no hairline/eyebrow spine, no "zero decorative shapes," spectacle is the point).
- Velvet-black + stage-gold + ember palette, new **Playfair Display** playbill serif (`--font-playfair`, added to `app/layout.tsx`, demo-only, never Syne).
- Built all of §16d's moving parts: hero spotlight-glow + capped ember canvas (`Embers`, off on reduced-motion, half-density mobile) + huge playbill wordmark; 6 decorative `DriftingCards` with **bounded per-card scroll parallax** (each card gets its own `useScroll({target})`, not raw `scrollY`, so they never runaway on a long page) + cursor tilt on hover-capable devices, 3 of 6 stay visible on phones; seamless `PhraseBand` marquee (same measure-and-overfill technique as the rest of the site); 5-card 3D flip-to-reveal "pick a card" section (`ShowCard`) with a **fully static, always-readable fallback** (`StaticShowList`) under reduced motion instead of hiding the interaction; Reel/Witnessed/About/Where-it-works/Booking sections per the §16e sequence.
- Honesty held: "Demo build — sample act" tag in the hero, "demo build / sample site" repeated in the footer copyright, Witnessed reactions are unattributed with an explicit "illustrative — not real client quotes" caption, no invented awards/credits/venues, no fake certs.
- `HERO_VIDEO_SRC` is wired but empty — drop a real card-shuffle clip path in and the placeholder disappears automatically (same pattern as every other demo's `firstXImage` const).

## v40 — system-wide compliance fixes (this run)
- **Eyebrows bumped** site-wide to 15px/bold with better contrast: `SectionHeading.tsx` (main site) and the shared `Eyebrow` in `components/demos/system.tsx` (all demos) — was 12–13px and read as hidden. Demo eyebrows moved off `--d-muted` onto `--d-body` for real contrast. Added Space Mono weight 700 for the bump.
- **"Demo build" honesty label** added to every demo's header (`DemoHeader` in `system.tsx`) — SKILL §12 requires it and it didn't exist anywhere before. Header row also widened to `flex-wrap`/`min-h` instead of a fixed 72px so long business names + the new badge don't clip on mobile (pre-existing overflow on names like "Maple & Main Renovation Co.", worsened by the badge until fixed).
- **`(demo: preview error state)` button** (in every demo's `Contact`) now gated behind `NODE_ENV !== "production"` — it was rendering on the actual opened demo a prospect would see, not just in dev.
- **Pinned logo** got the missing hover-scale (~1.06). Its click-to-open-founder-card behavior was kept as-is rather than replaced with "scroll to bottom" as the brief literally asked — that's a deliberate, documented Noah decision from 2026-06-11, flagged in chat rather than silently overridden.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last message of session states "version: vN".
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping. LIGHT = florist/bakery/powerwash/lawncare. WARM-DARK = barber. GRAPHITE-DARK + motion = auto body. **THEATRICAL = the Magician (§16, its own system, ignore this whole section for it).** Main site = bone/cream + Syne — demos never use the bone palette or Syne; the studio never uses a demo palette/serif.
- **Re-mooding a local-service demo = a `theme` swap, not a structural one** — every primitive reads `--d-*` vars `DemoShell` sets. Don't fork primitives per niche. The Magician doesn't participate in this system at all.
- **Known pre-existing bug, NOT fixed this session (out of scope, flagging for priority call):** if a browser already has `prefers-reduced-motion: reduce` active at first paint (confirmed via Playwright's `reducedMotion: 'reduce'` context), the main site's hero `Marquee.tsx` throws a React hydration-mismatch error in the console on load (it branches to completely different DOM for the reduced case, and `useReducedMotion()` appears to resolve synchronously before the first client render in that scenario, so it disagrees with the server's non-reduced HTML). React self-heals by regenerating the subtree client-side, so nothing visibly breaks — but it logs an error and likely affects every demo that branches the same way, not just this one instance. Proper fix needs a `mounted`-gate pattern applied consistently, which touches many files — deliberately not attempted blind under this session's scope.
- **Gallery first-load / coverflow / reveal-ending-frame gotchas from earlier sessions still hold** — see git log for `VilasReveal.tsx`, `Gallery.tsx` if touching those.
- No decorative shapes anywhere in the **local-service** demos (SKILL §11) — the Magician is the one documented exception (§16). Honesty: no fake reviews/stats; media is labeled placeholders / real photos only, except the Magician's pure-decoration cards/embers which are explicitly allowed.

## Supabase (unchanged — RESOLVED: Supabase)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier. `leads` table + RLS deny-all; `/api/lead` plain fetch → PostgREST. `.env.local` has SUPABASE_URL, SERVICE_ROLE_KEY blank — Noah pastes the key into .env.local AND Vercel, then redeploy. Free tier pauses ~1wk idle.

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY; tagline/email/instagram/founder.
- Eyes on the live URL: the Magician demo (does it read as "genuinely cool" per SKILL §16g, or does anything feel cheesy instead of theatrical), the bumped eyebrows, the new "Demo build" tags.
- A decision on the pre-existing reduced-motion hydration warning above — worth a dedicated pass, or leave it (it's cosmetic-only in the console, not user-visible)?
- Real photos/video still pending for: the Magician's hero shuffle clip, reel clip, portrait; the renovation FullBleed break image; more work-grid photos across other demos.
