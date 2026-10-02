# Reel: "Your name here" (batch-2 idea · COMMENT)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase row yet (no Supabase this batch; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 18s.

## Angle
"A bakery?" The camera is pushed in on a real demo header (Golden Hour Bakehouse). The sample name is backspaced out and "Your Bakery Here" is
typed in its place. Pull back to the whole site. Swipe: "A barbershop?" → "Your Shop Here", "A flower shop?" → "Your Flowers Here",
"Power washing?" → "Your Crew Here". Outro: all four side by side, "Your name goes / right up there." "What would yours say? Tell us in the comments." + vilas.studio/start.

Every frame is a real screenshot: the text is swapped in the page's DOM (every occurrence, so the footer etc. change too) one keystroke at a time.
Honesty: the DEMO BUILD badge stays visible next to the name the whole time, and the footer reads "Mockup: demo styles with placeholder names". The CTA asks for comments only; it makes no promise of free mockups.
Sound: warm light groove, soft key clicks (backspace lower and quicker), a bell as each name lands, whooshes on push-ins and slides, an end chord. -15 LUFS. Poster = frame 85.

## Rebuild
From `work/`: `node cap.mjs` (needs `next start -p 3456`), `python3 -m http.server 8927`, `PORT=8927 node render.mjs events`, `python3 sound.py`, `PORT=8927 node render.mjs video video.mp4`, `bash finish.sh 85`.
