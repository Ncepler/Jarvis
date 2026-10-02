# Reel: "Lost in the search results" (batch 3 · line art · SHARE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
A stick figure walks down a list of drawn search results; each bad one gets a cross and a one-line reason (last updated 2016, phone number is a picture, still loading, is it still open?, photos of someone else's shop). The list stops on the real barber demo (Standard Barber Co., a demo brand) with a green check: 'Found you.' Then the real hero in a phone: 'Be the one they stop on.'
Honesty: the bad results are drawn and made up (example domains), no real search brand, no stats.
Sound: footsteps while the list scrolls, a buzz on each bad result, a bell on the good one, a whoosh for the phone, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
