# Reel: "What can a website add on?" (batch 3 · real prices · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

Stands in for idea #50 (hover), see the note in reels-batch-3-ideas.md. The site's own four add-ons, one per beat, with the real prices from lib/pricing.ts and the Services section copy: AI chat assistant ($30/month, optional, separate from your monthly), 3D object (from $200 one-time, built from your photos and measurements), Scroll video (comes with Premium, not sold as a separate add-on), Admin page ($100 one-time + $10/month; Premium waives the $100, since it's the add-on with a build fee that Premium waives). End line: 'Add-ons are priced on top of Basic or Premium.' (the site: 'priced on top of either tier').
Honesty: every number and description is from the site's own data; no stats, no clients. Line-art icons are generic. Pairs with the 'menu' reel (which leaves add-ons out).
Sound: bell lead, marker squeaks, soft pulse. -15 LUFS. Poster = frame 230.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
