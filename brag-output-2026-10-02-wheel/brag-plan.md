# Reel: "Spin for a style" (batch-2 idea · SHARE)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase row yet (no Supabase this batch; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 19s.

## Angle
A prize wheel in studio colours with seven slices (Florist, Barber, Bakery, Landscaper, Body shop, Lawn care, Magician) and a "V" hub.
"Spin for a style." It spins, the pointer flap kicks on every peg, it slows and lands: "The barber." It dives into the slice and becomes the **real barber demo**
in a phone (settled hero, then a real scroll), labelled "Standard Barber Co. · demo build". Back out. "Again." Lands on the bakery → the real bakery demo.
Back out, the wheel keeps turning: "Which one's yours?" + "A style for every trade · vilas.studio".

The wheel motion is an ease-out-quart to a precomputed final angle (pure function of t). Ticks are derived from that same angle, so every tick lines up with a peg.
Demo captures are reused from the FW26 reel (`cap.mjs` there).
Honesty: footer "Every style shown is a demo, not a client site"; each demo is named as a demo build.
Sound: wooden peg ticks whose pitch and level follow the wheel's speed, a low riser under each spin, a two-note landed chime, whooshes in and out, a marimba groove under each demo, an end chord. -15 LUFS. Poster = frame 128 (landed on Barber).

## Rebuild
From `work/`: (captures copied from `brag-output-2026-10-02-fw26/work/cap`), `python3 -m http.server 8929`, `PORT=8929 node render.mjs events`, `python3 sound.py`, `PORT=8929 node render.mjs video video.mp4`, `bash finish.sh 128`.
