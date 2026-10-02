# Reel: "3, 2, 1: making a website" (queue idea #19, reel-lab hook 10 · PROFILE)

Queue idea #19 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 9s, 1080×1920.

## Angle
A countdown, then the unglamorous making of a demo, cut before the result: real code typing in an editor (14 lines from `components/demos/system.tsx`,
the before/after handle), a localhost browser of grey placeholder boxes ("HERO PHOTO 16:9"), a cubic-bezier editor dialled to the house
ease (0.16, 1, 0.3, 1) with a preview square snapping, and the repo's **real** `npm run build` output scrolling to green checks. A two-frame flash of the
finished power-wash demo, then "finished one's on the grid" and back to "3".

## Honesty / rules
- Real code and real build output only. The build log is cut before the route table (it lists an internal admin path), and there are no secrets or env values on screen.
- **Post only once the grid has at least 6 finished posts**, and after the power-wash reel (#4) is already up, so the withheld payoff exists.

Sound: a fast original drum-and-bass loop at 170 BPM, countdown blips, keyboard clacks, cut whooshes, a success beep. -14.5 LUFS. Poster = frame 150 (the easing curve), baked in as frame 0.

## Rebuild
From `work/`: `python3 -m http.server 8920`, `PORT=8920 node render.mjs events`, `python3 sound.py`, `PORT=8920 node render.mjs video video.mp4`, `bash finish.sh 150`.
