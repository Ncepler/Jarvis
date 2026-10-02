# Reel: "Details nobody notices 3/9", the day-to-night patio (series · FOLLOW)

Queue idea #9 from `instagram_posts` (id `2e6f3045-2c73-4c87-b091-6c514db2e0d8`). Episode 3 of 9. The series template is in
`brag-output-2026-09-30-details-1/brag-plan.md` and is copied here: band, ring, zoom + DOF, control pill, annotation, why panel, next card, sound palette, 13s exact loop.

## It's the real component
`LandscapingDemo.tsx` `DayNightSignature`: the patio photo wipes day → night (clip-path, 900ms) the first time the section
scrolls into view. After that it's a single `role="switch"` toggle. `cap.mjs` jumps the page to the framing scroll and catches the
component's own CSS transitions (clip-path 900 / switch highlight 240 / label colours 200) at t=0 with `document.getAnimations()`.
It then seeks them frame by frame at 3 px/css (page plates) and 12 px/css (switch macro). The tap-back is the same capture after a real `click()`. Both photos are now real (they landed on main 2026-09-27).

## Where it deviates from the template (and why)
- **Zoom is 3.7 px/css instead of 4.6.** The switch is 280 css wide and would run off the frame at 4.6.
- **The ring hugs the switch thumb**, not the whole switch. A ring around the full 280-css switch would run off the bottom of the frame at rest.
- **The control pill shows what drives the switch**, not a clock: "first view" → "▸ scrolled into view" (the auto-play) → "tap".
- **There's a third tap under the next card**, which wipes back to day so the loop to frame 0 is exact.
- Found while capturing: the component triggers on IntersectionObserver `isIntersecting`, so it auto-plays as soon as any part of the section enters, not at the 60% its comment says. That's harmless, and noted in HANDOFF.

## Beat sheet (13s, 390 frames)
| Time | Beat |
|---|---|
| 0–1.0 | Band "Details nobody notices 3/9", lens ring on the switch thumb (day) |
| 1.0–2.4 | Zoom in with depth of field |
| 2.6–3.5 | The auto-play wipe day → night (real transition frames) |
| 3.75–5.0 | Annotation: "plays itself once" |
| 5.35 / 6.65 | Tap → back to day, tap → night again (ripple on the half that's pressed) |
| 7.9–8.9 | Pull back; why panel: "So they see it at night / without asking." |
| 10.8–12.8 | "4/9 next: the before & after handle"; a third tap wipes the whole patio back to day; the ring returns; exact loop |

Poster (brag.jpg) = frame 135 (night, macro, "plays itself once"), baked in as frame 0. Audio -16.5 LUFS. No music, series palette, plus a soft dusk swell under each wipe.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8902`, `PORT=8902 node render.mjs events`, `python3 sound.py`, `PORT=8902 node render.mjs video video.mp4`, `bash finish.sh 135`.
