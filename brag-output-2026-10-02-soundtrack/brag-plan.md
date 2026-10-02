# Reel: "If these sites had a soundtrack" (batch-2 idea · vibe edit · SEND)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase row yet (no Supabase this batch; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 19.2s.

## Angle
"If these sites had a soundtrack." (sound on). Then seven hard cuts on the downbeat, 2.2s each: a real demo in a phone (settled hero, then a real scroll)
over a "now playing" card with a made-up track title, its genre, a progress bar, and EQ bars:
Florist "Same-Day Stems" (soft piano + strings) · Barber "Skin Fade" (boom bap) · Bakery "Gone by Noon" (lo-fi) · Body shop "Paint-Matched" (dark synth) ·
Lawn care "Saturday Edging" (summer pop) · Landscaper "Day into Night" (acoustic) · Magician "Now You See It" (a suspicious waltz).
Outro: "Every site gets its own vibe." + all seven thumbnails + vilas.studio.

The EQ bars are the actual audio: `sound.py` writes `cap/env.json` (9 band levels per frame of the final mix) and the comp reads it.
Each genre is rendered on its own bus and levelled to the same RMS, then hard-cut so nothing rings into the next.
Honesty: track titles are invented for the bit (said on screen), no real songs are used, all music is synthesized here. Footer: "Demo builds, not client sites".
Demo captures are reused from the FW26 reel. Poster = frame 175 (bakery, "Gone by Noon").

## Rebuild
From `work/`: (captures copied from `brag-output-2026-10-02-fw26/work/cap`), `python3 sound.py` (also writes cap/env.json), `python3 -m http.server 8930`, `PORT=8930 node render.mjs events`, `PORT=8930 node render.mjs video video.mp4`, `bash finish.sh 175`.
