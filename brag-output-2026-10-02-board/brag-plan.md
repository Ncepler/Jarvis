# Reel: "Questions we get, on a departures board" (queue idea #15, mechanical ASMR · SAVE)

Queue idea #15 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 18s, 1080×1920.

## Angle
A split-flap departures board answers the four questions people ask before hiring us. Each question clacks in, then the answer row flaps in beneath it.
"QUESTIONS WE GET" → IS THIS LEGIT? / PAY THE 2ND HALF WHEN YOU'RE HAPPY → DO I OWN IT? / YES. THE SITE AND THE DOMAIN. →
WHAT IF I DON'T LIKE IT? / WE KEEP TWEAKING UNTIL YOU DO. → HOW LONG DOES IT TAKE? / USUALLY DAYS, NOT MONTHS. → NOW BOARDING: YOUR SITE / VILAS.STUDIO → flaps to blank (loop).

## Honesty
Every answer is `COPY.faq` in `lib/site.ts`, shortened to board length without changing what it says. No price, date or promise the site doesn't state.
"What do you need from me" was left out on purpose (reel #3 covered it).

## How
A 17×8 board. Each cell steps forward through a real drum order (" A–Z 0–9 .,?!'+:-&/"), one flap per frame for the last 8 flaps, with a random start delay per cell. The sound uses one synthesized click per flap, so the clatter's density follows how many letters are changing.

Sound: no score. Flap clatter, station room tone, a two-tone chime before each question. -16 LUFS. Poster = frame 150, baked in as frame 0.

## Rebuild
From `work/`: `python3 -m http.server 8914`, `PORT=8914 node render.mjs events`, `python3 sound.py`, `PORT=8914 node render.mjs video video.mp4`, `bash finish.sh 150`.
