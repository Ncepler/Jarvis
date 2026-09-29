# design.md — Vilas "why-first" reel

Source of truth: `lib/site.ts` (SITE) and `CLAUDE.md` §5/§8 of the main repo. This is Vilas's own promotional content, not a client demo — the studio bone/cream palette and Syne/Space Grotesk faces apply.

## Palette (exact hex, no substitutes)
- `--bg`      #efe9dd  (bone — base)
- `--surface` #f6f1e8  (raised panel behind final card)
- `--ink`     #1f1a14  (primary text, never pure black)
- `--muted`   #5f574a  (secondary line)
- `--line`    #d9d0c1  (hairline)
- `--accent`  #8a5a2b  (bronze — the one accent, used sparingly: underline sweep + final CTA word)

## Type
- Display / belief lines: **Syne** (variable), weight 700 — the studio's own display face. (Not bundled by the renderer; auto-fetches from Google Fonts at build time — acceptable for a local, non-cloud render. Flagged in HF's own guidance as generically overused, but here it's the real, brand-mandated face, not an arbitrary pick.)
- Wordmark reveal ("VILAS"): **Space Grotesk**, weight 500, uniform tracking — matches the site's `VilasReveal` component (every letter same size/weight/opacity, no bold-vs-dim contrast).
- Utility line (".studio" / URL): **Space Mono** (bundled, renders offline).

## Motion law (Apple-restraint, per CLAUDE.md §5)
- Transform + opacity only. Nothing bounces, nothing shakes, nothing glitches.
- Eases: `power4.out` for entrances, `power2.out` for holds, `power2.in` for exits — the closest bundled-ease approximation of the site's `cubic-bezier(0.16,1,0.3,1)`.
- One motif per scene. Generous holds. No stacked effects.
- Never pure black background, never a bounce/spring easing family.

## Copy — honest, no fabricated claims
Real, sourced stat (Lindgaard et al. 2006 — ~50ms first-impression research; not a Vilas-specific claim), the site's actual approved tagline, and the real domain. No invented client counts, testimonials, or years-in-business (banned per CLAUDE.md §7/§8).
