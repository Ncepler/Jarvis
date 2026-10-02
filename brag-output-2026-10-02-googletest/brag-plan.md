# Reel: "When they Google you" (batch 3 · mockup · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

The same search ('bakery near me') three times on a generic, unbranded search page: (1) no website, so the listings are other bakeries and a directory and a dashed empty slot says 'you're not here'; (2) a site whose result just says 'Home' ('Nobody clicks Home'); (3) a site that says what it does (Golden Hour Bakehouse, a demo brand: 'Baked at 4am. Gone by noon.', the demo's real headline) and its real mobile hero rises in a phone. End card is the site's own hero line: 'People Google you before they hire you. What they find decides who gets the call.'
Honesty: no real search-engine branding; other business names are placeholders on .example domains; the bakery is a demo and labelled '(demo)'; no stats. Sound: typing clicks, a pop per result, a buzz on the bad ones, a chime on the good one, end chord. -15 LUFS. Poster = frame 440.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
