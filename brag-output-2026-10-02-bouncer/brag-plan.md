# Reel: "The bouncer" (batch 3 · line art · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
Your website is the bouncer at the door. A stick-figure customer holds up an old, generic site (drawn, made up) and the clipboard fails all three checks (hours, phone number, real photos): 'Not tonight.' A second customer holds up the real barber demo, passes all three, and the door swings open.
Honesty: the failing site is drawn and made up; the passing one is the real barber demo (Standard Barber Co., a demo brand), labelled in the footer. The three checks are things that demo actually has.
Sound: footsteps, buzzer on each fail, tick bells on each pass, a door creak, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
