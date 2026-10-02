# Reel: "Things that take longer than getting a website" (queue idea #18, race/broadcast · COMMENT)

Queue idea #18 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 16s, 1080×1920.

## Angle
A sports-broadcast race of progress bars: the sign permit, the landlord fixing the heat, your nephew "finishing" your website, a back-ordered
truck part, and a Vilas site. Starter pistol, broadcast graphics. The Vilas lane pulls ahead steadily. The nephew lane gets a buffering
spinner and then goes backwards. A photo finish freezes the board with a scan line, and the lower third reads "WINNER · A VILAS SITE / Live in days, not months."

## Honesty
Every rival lane genuinely takes weeks or months. The Vilas lane claims only the site's own wording (`COPY.headings.process`), with no day count.
The nephew is the gentle universal joke ("No shade to your nephew." on screen).

## Storyboard
0–1.4 "ON YOUR MARKS" · 1.45 pistol, GO · 1.5–10 the race · 10–12 photo finish + winner lower third · 12–14.1 the rivals keep crawling, the nephew rewinds · 14.2–16 the bars reset (loop).

## Sound
An original broadcast sting at 128 BPM (brass stabs, snare roll, a driving kick), a starter pistol, a crowd swell built from filtered noise, buffering bloops, a finish bell, a camera shutter, a lower-third whoosh. -15 LUFS. Poster = frame 345 (the photo finish + winner card), baked in as frame 0.

## Rebuild
From `work/`: `python3 -m http.server 8915`, `PORT=8915 node render.mjs events`, `python3 sound.py`, `PORT=8915 node render.mjs video video.mp4`, `bash finish.sh 345`.
