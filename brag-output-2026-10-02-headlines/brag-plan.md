# Reel: "Headlines we wrote" (batch 3 · real copy · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

Five real demo headlines typed out one after another, each in its demo's own typeface and colours (Oswald 600 for the barber; Fraunces 600 for the bakery and florist; Inter Tight 700 for power washing and the body shop), a blinking caret, a quick backspace run, then the next. A small chip names the font; the brand name sits under it. Headlines are verbatim from the demo pages (captured text). Brands: Standard Barber Co., Golden Hour Bakehouse, Wildstem Florals, Tide Line Power Washing, Apex Collision, all demos.
Honesty: footer says every brand is a demo, not a client. No stats. Sound: soft keyboard clicks, backspace run, tick between headlines, chime at the end, quiet bed. -15 LUFS. About 21s. Poster = frame 300.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
