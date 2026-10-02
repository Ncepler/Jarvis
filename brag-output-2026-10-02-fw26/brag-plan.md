# Reel: "The FW26 collection" (queue idea #17, fashion-week parody · SEND)

Queue idea #17 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 20s, 1080×1920.

## Angle
The styles as a fashion house's runway show. A dark perspective runway lined with audience silhouettes and flashbulbs. Seven demos
walk it as phones: each glides in from the back, pauses, does "the turn" (a short **real** scroll of that demo) under a burst of flashes,
and walks off. Lookbook captions in thin wide type. The finale has all seven walking out in a line, then "The full collection is on the site." vilas.studio.

## Honesty
- Every lookbook line describes something the demo really has: florist same-day until 2pm; barber leather/brass/walk-ins chip; bakery "until sold out" (its FAQ);
  landscaping day/night toggle; auto body graphite + paint-match swatches (the idea's "chrome" was swapped for "paint-matched", which is verifiable); lawn care mowing/edging + estimate; magician.
- "collection"/"looks" = styles, never "templates". "Every look is a demo style, not a client site" is on screen.
- Overlap: a many-demos showcase like reel #1's coverflow, played as a full runway parody with no prices and no carousel.

Captures: each demo's settled hero + a 24-frame micro-scroll (Playwright, 360×640 @3x; barber/bakery clocks fixed to open hours).
Sound: original runway house at 124 BPM (four-on-the-floor, filtered minor stabs, a sub line) and a camera shutter synced to every flashbulb burst. -14.5 LUFS.
Poster = frame 100 (Look 01, The Florist), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8918`, `PORT=8918 node render.mjs events`, `python3 sound.py`, `PORT=8918 node render.mjs video video.mp4`, `bash finish.sh 100`.
