# Reel: "What does a website cost? The real numbers" (batch 3 · real prices · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
The site's own pricing, as a menu: Basic $300 + $50/month, Premium $500 + $80/month, Custom (let's talk), and how you pay: half up front, half when you're happy, invoiced through Stripe, paid by card.
Honesty: numbers and wording are from lib/pricing.ts / COPY.pricing / COPY.startChoice. Add-ons are not shown (priced separately on the site).
Sound: bell lead, marker squeaks, soft pulse. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
