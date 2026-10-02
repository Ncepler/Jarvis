# Reel: "Waiting for the old site" (stickman-inspired idea #29, exaggeration gag · SEND)

One of the 10 stickman-inspired ideas (position 29, local copy, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 14s.

## Where the stickman skill came in (ideas only)
A time-passing gag in line art, particles that only move and fade (falling leaves, then snow), a hard cut for contrast, two accents (autumn orange, lawn green), and a loop that restarts on the same tap.

## Angle
A figure taps a link. A huge line-drawn phone shows a spinner: "loading…" → "still loading…" → "any second now…". A beard grows to the floor, the leaves fall,
it snows, the figure sits and falls asleep (zzz). Hard cut: the **real lawn care demo** (Fresh Cut Lawn Co., a demo brand) is simply there and scrolling. "meanwhile, a site
that just loads". Back to line art: the figure jolts awake, the beard poofs off, "Nobody waits that long.", and they tap again (loop).

Honesty: no load-time numbers or comparisons to named sites. The wait is the joke. Overlap: same family as "Meanwhile, while your site loads". Don't post them back to back.
Sound: an elevator loop that slows and detunes as the beard grows, leaf rustle, wind, a snore, a hard cut to one clean chord, a boing on the jolt. -15 LUFS. Poster = frame 200 (full beard, snow).

## Rebuild
From `work/`: `python3 -m http.server 8924`, `PORT=8924 node render.mjs events`, `python3 sound.py`, `PORT=8924 node render.mjs video video.mp4`, `bash finish.sh 200`.
