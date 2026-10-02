# Reel: "The owner who hid from the internet" (stickman-inspired idea #30 · SHARE)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. One of the 10 stickman-inspired ideas (position 30, local copy; no Supabase this batch, write-back in `supabase/pending/2026-10-02-reels-batch-2.sql`). 20s.

## Where the stickman skill came in (ideas only)
A small motivational arc, emotion carried by line jitter (nervous boil → calm), a giant-prop scale gag, the figure walking *into* the real capture, and an ending that mirrors the opening.

## Angle
A line-drawn bakery. A shy baker behind the counter. A giant phone peeks in from the right; the baker ducks. It peeks again; duck again. The baker
creeps up, unsure: "not a computer person?" The phone slides in and turns around to show the **real bakery demo** (Golden Hour Bakehouse, a demo brand)
scrolling. Arms up. The baker climbs into the phone, waves from inside the site, and rides it out of frame, then pops back up behind the counter with a thumbs up:
"that's what we're for."

Honesty: the bakery is labelled a demo brand on screen the whole time. No claim about the owner's results.
Sound: nervous pizzicato that warms into a full chord at the turn, two "peek" swishes, duck thumps, a wow chime, footsteps on the climb, a pop on the return. -15 LUFS. Poster = frame 380 (arms up, phone showing the bakery hero).

## Rebuild
From `work/`: `python3 -m http.server 8925`, `PORT=8925 node render.mjs events`, `python3 sound.py`, `PORT=8925 node render.mjs video video.mp4`, `bash finish.sh 380`.
