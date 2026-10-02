# Reel: "5 things every barbershop website needs" (batch 3 · checklist · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
One persistent phone shows real captures of the barber demo (Standard Barber Co., a demo brand) section by section: first screen, cuts and prices, hours and walk-in, FAQ, ways to reach you. A check stamps each. Colours are the demo's own tokens.
Honesty: every item is a section that really exists on the demo; footer says it's a demo brand.
Sound: electric piano lead rising per item, marker squeaks, felt clicks, light boom-bap pulse. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
