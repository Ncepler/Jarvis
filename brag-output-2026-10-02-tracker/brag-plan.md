# Reel: "Track your website like a pizza" (batch 3 · metaphor · SHARE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
An order-tracker card (a drawn pizza icon, 'Order VS-4817 · example') steps through the site's own five How it works steps: Reach out (the form takes two minutes), Pick a style, Pay half (we build it), We tweak it with you until it's right, Pay the rest (it goes live). A LIVE badge pops and the real bakery demo arrives: 'Delivered.' Closes 'Five steps. Live in days.'
Honesty: steps and the 'live in days, not months' line are verbatim from COPY.howItWorks / COPY.headings.process; the order number is an example; no real brand logos.
Sound: a rising bell per completed step, a chime on LIVE, the phone whoosh, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
