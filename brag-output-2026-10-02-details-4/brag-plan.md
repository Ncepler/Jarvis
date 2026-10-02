# Reel: "Details nobody notices 4/9", the before & after handle (series · FOLLOW)

The episode-4 idea written into `supabase/pending/2026-10-02-reels-batch.sql` (not yet in Supabase). Built 2026-10-02, second batch, with /brag (brag-slim path). Series template from `brag-output-2026-09-30-details-1/brag-plan.md`: band, ring, zoom + DOF, control pill, annotation, why panel, next card, 13s exact loop.

## It's the real component
The power-wash demo's (Tide Line Power Washing, a demo brand) `BeforeAfterSlider` in `components/demos/system.tsx`. `cap.mjs` drives it with real
pointer events: press at the centre, drag to 12%, across to 92%, back to 50%, release. It takes one screenshot per video frame at 5 px/css, so
the clip-path reveal, the label fades by position and the handle's spring scale-up on press are all the component's own rendering.

## Deviations (same reasoning as ep 3)
- Zoom 3.7 px/css, so the handle's full 12–92% travel stays in frame. The camera holds on the slider's centre and the handle moves.
- There's no separate macro capture: one 5× plate gives both the blurred page and the sharp, feathered slider band.
- Control pill: "hands off" → "▸ drag" → "let go". Annotation: "springs when you grab it".

## Beat sheet (13s, 390 frames)
| Time | Beat |
|---|---|
| 0–1.0 | Band "Details nobody notices 4/9", lens ring on the handle |
| 1.0–2.4 | Zoom in with depth of field |
| 2.5 | Grab (the handle springs to 1.08×); "springs when you grab it" |
| 2.8–7.4 | Drag to the dirty side, across to the clean side, back to centre; release |
| 7.9–10.8 | Pull back; why panel: "So the clean half / feels like a reveal." |
| 10.8–13 | "5/9 next: the estimate slider", ring returns, exact loop |

Sound: the series palette, plus a soft water hiss that follows each drag. -16 LUFS. Poster = frame 125, baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8911`, `PORT=8911 node render.mjs events`, `python3 sound.py`, `PORT=8911 node render.mjs video video.mp4`, `bash finish.sh 125`.
