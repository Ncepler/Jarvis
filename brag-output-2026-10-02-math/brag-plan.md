# Reel: "Do the math" (batch 3 · real UI · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
The site's own 'Do the math' calculator, recorded in real time on a 360px phone: a new customer is worth $500, then miss two a month, then three. The readout counts up on its own (,600 -> ,000 -> 2,000 -> 8,000 a year). Closes with the site's own line: 'Your numbers, not ours. We're just doing the multiplication.'
Honesty: it is opportunity cost on the visitor's own inputs, not a promise or a claim about results, exactly as lib/site.ts says. Frames are real screenshots with timestamps played back at real timing.
Sound: key clicks while typing, a rising marimba tick per count frame, a bell when a value settles. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
