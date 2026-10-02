# Reel: "The 5-second website test" (batch 3 · quiz · COMMENT)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Two rounds: a real demo hero (florist, then auto body) shown with a 5-second countdown ring, three answer pills, then the reveal. Closes: if a stranger can't tell in 5 seconds, they leave.
Honesty: both sites are labelled demo brands; no stats about how long visitors stay.
Sound: ticking clock, reveal whoosh and chime, soft pad bed. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
