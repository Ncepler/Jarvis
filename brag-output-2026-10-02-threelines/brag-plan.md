# Reel: "Three lines to launch" (batch-2 idea, stickman-inspired · SAVE)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. No Supabase row yet (this batch ran with no Supabase; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 15s, exact loop.

## Where the stickman skill came in (ideas only)
Numbered step lines on a floor, a figure that walks between beats, real UI shown between line-art moments, a rewind that makes it loop.

## Angle
Three hand-drawn tick marks on a floor: `1 tell us · 2 pick a look · 3 live`. A crouched figure steps to each one, and a phone rises above them showing the real thing:
1. the real `/start` intake form being filled in,
2. the real homepage style list scrolling,
3. a finished demo (Fresh Cut Lawn Co., the lawn care demo) scrolling.
The figure crosses the finish, "That's the whole process." + `vilas.studio/start`, then the whole thing rewinds to the start (loop).

Honesty: every phone screen is a real capture of this repo's pages. The lawn care site is labelled a demo ("Styles shown are demos" footer). No timelines or prices claimed.
Sound: pencil-tick per step, soft footsteps, a UI blip as each phone rises, one warm chord on the line, a tape-rewind whoosh into the loop. -15 LUFS. Poster = frame 250 (step 2, style list up).

## Rebuild
From `work/`: `python3 -m http.server 8923`, `PORT=8923 node render.mjs events`, `python3 sound.py`, `PORT=8923 node render.mjs video video.mp4`, `bash finish.sh 250`.
