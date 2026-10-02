# Reel: "Airport security for your website" (batch 3 · metaphor · SHARE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
An x-ray belt with a scanner arch. Four drawn items ride through and get stamped PROHIBITED and dropped in the bin (pop-up, autoplay music, PDF menu, stock handshake). The real barber demo (Standard Barber Co., a demo brand) rides through, the beam goes green and it's stamped CLEARED. Counters tick REJECTED 4 / CLEARED 1. Closes 'Clear the first check.'
Honesty: the prohibited items are drawn gags and opinions about web design, no stats or named sites.
Sound: a scan whirr per item, a buzzer on each rejection, a thud into the bin, a bright ding for the cleared site, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
