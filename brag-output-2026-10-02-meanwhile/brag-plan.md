# Reel: "Meanwhile, while your site loads" (queue idea #16, split-screen pictograms · SEND)

Queue idea #16 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 16s, 1080×1920.

## Angle
Top half: a fictional slow page (`a-local-business-site.example`) with a spinner, a crawling progress bar and a stopwatch. Bottom half: flat Aicher-style
pictograms live a customer's whole afternoon while it loads. They tap a foot, give up, tap the next result (it loads instantly, the phone goes green),
call (a calendar-check bubble), drive to the barber, get a haircut (scissors), pay, drive home, sit on the couch and fall asleep. The stopwatch crawls to 8.0s.
The page finally resolves to "Book now… anyone?". End card: "Speed is / a feature." vilas.studio.

## Honesty
The time dilation is the obvious joke. A line on screen says "The site is made up. So is the 8 seconds = one afternoon math." No load-time stats.
Overlap: same "losing customers" family as Spot the difference, the group chat, noir and "Waiting for the old site", so space them out.

Sound: elevator-muzak bossa (e-piano + bass + shaker) that slows and detunes as it loops, cartoon foley (taps, ding, ring, car, scissors, register, snore), a clean chord on the end card. -15 LUFS. Poster = frame 180, baked in as frame 0.

## Rebuild
From `work/`: `python3 -m http.server 8917`, `PORT=8917 node render.mjs events`, `python3 sound.py`, `PORT=8917 node render.mjs video video.mp4`, `bash finish.sh 180`.
