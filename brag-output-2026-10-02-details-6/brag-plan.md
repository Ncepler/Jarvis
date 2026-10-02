# Reel: "Details nobody notices 6/9", the occasion preview (series · FOLLOW)

New series episode (ep 5's next card promised it). Built 2026-10-02, second batch, /brag (brag-slim path). Series template from `brag-output-2026-09-30-details-1/brag-plan.md`.

## It's the real component (mostly)
The florist demo's (Wildstem Florals, a demo brand) `OccasionCursorPreview` in `FloristDemo.tsx`: on a desktop with a real mouse, a 240×300 crop of the
flower photo trails the cursor over the occasion tiles on a spring (stiffness 150, damping 20) and crossfades between tiles (opacity + scale .96→1, 200ms).
It never shows on touch or under reduced motion.
- Real captures (1280-wide desktop @2x): the grid at rest, each tile hovered (the real -4px lift), and each **real preview element** screenshotted once settled.
- The follow motion is **simulated with the component's own spring values**, because Motion's real-time spring can't be stepped frame by frame from Playwright. Playwright's fake clock stalled the page render, so that route was dropped.
- The spring starts at the grid's corner, like the real motion value does before the first mousemove. A drawn cursor shows where the mouse is.

## Deviations
- It's a desktop plate (0.84 px/css at rest, 1.7 zoomed), not the series' 3 px/css mobile frame, because the feature doesn't exist on phones.
- The camera trails the preview horizontally. The annotation ("follows on a spring") sits above the preview so it clears the pill.

## Beat sheet (13s)
0–1 band + ring on the first tile · 1–2.4 zoom · 2.6–7.3 the cursor glides across all four tiles and the preview follows and swaps · 4.6–6 annotation ·
7.9–10.8 pull back; "A taste of the real flowers / before anyone clicks." · 10.8–13 "7/9 next: the colour ring", exact loop.
Sound: the series palette, plus a desk glide under the mouse and a paper-soft swish per photo swap. Poster = frame 128.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8913`, `PORT=8913 node render.mjs events`, `python3 sound.py`, `PORT=8913 node render.mjs video video.mp4`, `bash finish.sh 128`.
