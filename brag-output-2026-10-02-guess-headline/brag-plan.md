# Reel: "Guess the trade from the headline" (batch 3 · quiz · COMMENT)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Five demo headlines set in each demo's real font and colours (Oswald for the barber, Fraunces for the bakery and florist, Inter Tight for the body shop and power washer). 2.4s to guess, then the real demo hero and the answer. Ends 'We write the words too.'
Honesty: all five are demo brands, named on screen; the headlines are the demos' own.
Sound: ticking clock, reveal chime, soft pad bed. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
