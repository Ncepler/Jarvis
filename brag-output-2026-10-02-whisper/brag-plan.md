# Reel: "Word of mouth is step one" (batch 3 · line art · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Four stick figures pass a recommendation down the line and it degrades ('Standard Barber Co. is great' -> 'Go to Standard Barber' -> 'That barber on Main?' -> 'What was it called again?'). The last one searches it, finds the real barber demo, and the site is what they actually see.
Honesty: Standard Barber Co. is a demo brand (labelled); the search field is generic (no real search brand); no stats about referrals.
Sound: a pop on each whispered hop, typing clicks, a result chime, a whoosh for the phone, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
