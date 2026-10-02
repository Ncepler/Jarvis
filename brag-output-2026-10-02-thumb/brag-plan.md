# Reel: "The thumb test" (batch 3 · design · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
A reach heat-map (easy / stretch / hard) over the real barber demo on a phone, with a hand sweeping the arc, then tapping the demo's own sticky bottom bar (Call | Book a chair). The same tap on the lawn care (Get a quote) and bakery (Order ahead) demos. Closes 'Put the button where the thumb is.'
Honesty: the heat-map is a drawn illustration of general thumb ergonomics, no stats; the sticky bars are real (captured with the demos' own .d-sticky-cta showing). All three sites are labelled demo brands.
Sound: whooshes, a thump and bell on each tap, a steady pulse. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
