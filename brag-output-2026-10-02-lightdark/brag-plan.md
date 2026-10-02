# Reel: "Light or dark? Pick your shop's mood" (batch 3 · poll · COMMENT)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Three pairs of real demo heroes side by side (bakery vs barber, florist vs landscaper, lawn care vs body shop), each pair one light and one dark. Final card asks for L or D in the comments.
Honesty: every site is a demo, labelled on screen.
Sound: ticking clock, reveal chime, soft pad bed. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
