# Reel: "Same site. Every screen." (batch-2 idea · SAVE)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase row yet (no Supabase this batch; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 15s.

## Angle
A desktop browser window showing the real florist demo (Wildstem Florals, a demo brand). A cursor grabs the window's right edge and drags it narrower:
the readout ticks 1280px → 360px and the label flips desktop → tablet → phone as the real layout reflows (nav collapses, hero restacks).
Hold on the phone layout. Drag back out to 1280. "Built for the phone / in your customer's hand."

Every frame is a real screenshot of the page rendered at that exact width (225 captures, 1280→360 then 360→1280, at 2× DPR). Nothing is faked or tweened between layouts.
Honesty: demo brand labelled in the footer. No speed or conversion claims.
Sound: calm pad + soft pulse, a stretch sweep that follows the drag, a marimba tick each time the layout crosses a breakpoint, a felt snap at the narrowest point, a warm chord on the close. -15 LUFS. Poster = frame 150 (phone width, 397px).

## Rebuild
From `work/`: `node cap.mjs` (needs `next start -p 3456`), `python3 -m http.server 8926`, `PORT=8926 node render.mjs events`, `python3 sound.py`, `PORT=8926 node render.mjs video video.mp4`, `bash finish.sh 150`.
