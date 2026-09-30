# Reel #11: "Details nobody notices 2/9", the barber's walk-in sign (series · FOLLOW)

Queue idea #5 from `instagram_posts` (id `03488d81-4256-49a2-aa67-3b18eed0bf83`). Episode 2 of 9. The series template is in `brag-output-2026-09-30-details-1/brag-plan.md` and is copied here (band, ring, zoom + DOF, control pill, annotation, why panel, next card, sound palette, 13s exact loop).

## It's the real component
`cap.mjs` sets Playwright's clock (timezone UTC) to Wednesday 2026-09-30 at 18:58 and 19:00. `BarberDemo.tsx`'s own `useWalkInStatus()` reads the posted HOURS table (Tue–Sat 9am – 7pm) and renders:
- 6:58 PM → "Walk-ins open · until 7pm" (accent dot, pulsing)
- 7:00 PM → "Walk-ins by appointment after 7pm" (muted)
The fast-forward runs to Thursday 9:00 AM, where the chip flips back to open (Thursday is an open day), then on to Thursday 6:58 PM, which reads the same as frame 0.

## Where it deviates from the template (and why)
- **Zoom breathes back.** The closed text is 297 css wide, so at the template's 4.6 px/css it would run off the frame. The lens zooms to 4.6 on the open chip, then eases back to 3.4 right after the flip so the whole new sentence is readable.
- **The next card gets a faint bone outline**, because the barber page behind it is dark and the ink pill would disappear.
- The page plates include 300 css above the viewport so the zoom never runs off the top.
- Next card: "3/9 next: the day-to-night patio". The landscaping feature is a toggle that auto-plays once, not a clock, so "the site that knows it's night" (from the idea row) would be untrue.

## Beat sheet (13s, 390 frames)
| Time | Beat |
|---|---|
| 0–1.0 | Band "Details nobody notices 2/9", lens ring on the walk-in chip, 6:58 PM |
| 1.0–2.4 | Zoom in with depth of field |
| 2.6 / 3.6 | 6:59, then 7:00 PM, and the chip flips; the lens breathes back 3.75–4.35 |
| 5.0–6.3 | ▸▸ to 9:00 AM Thursday, flips back to open |
| 6.5–7.9 | Annotation: "reads the posted hours" |
| 8.0–10.9 | Pull back, why panel: "So nobody walks in at 7:05." |
| 10.9–13 | "3/9 next: the day-to-night patio", ▸▸ to 6:58 PM, ring returns, exact loop |

Poster (brag.jpg) = frame 125 (7:00 PM, the closed chip at macro), baked in as frame 0. Audio ~-17.7 LUFS (series is quiet on purpose), peak -1.4 dBFS.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8897`, `PORT=8897 node render.mjs events`, `python3 sound.py`, `PORT=8897 node render.mjs video video.mp4`, then mux with frame 125 as frame 0.
