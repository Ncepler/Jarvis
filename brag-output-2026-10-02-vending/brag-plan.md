# Reel: "Pick a style" (batch 3 · metaphor · SHARE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
A vending machine stocked with six real demo screens (barber, florist, landscaper, lawn care, bakery, power washing). Punch in B2, the coil turns, the bakery drops into the tray and zooms out into a phone: 'The bakery.' Then A2 and the florist. Closes 'Pick one. We fit it to you.' (the site's own 'pick a style from the work').
Honesty: all six are demo styles, labelled on screen; no stock, no stats.
Sound: keypad clicks, a whirring coil, a thud into the tray, a whoosh and bell as the phone comes out, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
