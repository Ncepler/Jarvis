# Reel: "Scroll ASMR: the florist demo" (batch 3 · ASMR · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
One slow, real scroll through the florist demo (Wildstem Florals, a demo brand): 330 real frames of the page at 360px, eased, with synthesized foley: wind chimes, soft piano, a petal rustle, a light tick as each section passes. A small 'ASMR · florist demo' label, then 'Scroll slowly.'
Honesty: every frame is a real capture of the demo; the sound is synthesized here.
Sound: strings pad, sparse piano, wind chimes, rustle, scroll ticks. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
