# Reel: "The accent colour of every trade" (batch 3 · design · COMMENT)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Eight hard cuts, one per demo: the real accent token as a full-bleed colour with its hex, the trade, a colour word, and the real demo hero in a phone. Colours were read from each demo's own CSS variables.
Honesty: hex values are the demos' real tokens; every site is a labelled demo.
Sound: soft bell on every cut over a slow pulse. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
