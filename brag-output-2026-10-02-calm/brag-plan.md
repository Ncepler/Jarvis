# Reel: "The calmest part of your business" (queue idea #12, hook 5 the audio swap · COMMENT · LOOP)

Queue idea #12 from `instagram_posts`. Built with /brag (brag-slim path). 12s, 1080×1920.

## Angle
One unbroken, silky scroll through the renovation demo (Maple & Main Renovation Co., a demo brand), from the hero through services,
the before/after, the process and into the work grid. The picture never changes character. At 3.6s (frame 108) the audio hard-cuts
from birdsong and a warm pad to the owner's real day: table saw, nail gun, a ringing phone, a reverse beeper, a muffled shout.
The caption swaps on the same frame, from "what your customers see" to "what you're actually doing". At 9.0s the audio drops to
silence under "Your website should be the calmest part of your business." The scroll jumps back to the top under that line, and the birds return at 11.0 (loop).

## How
- `cap.mjs` takes 330 real screenshots of `/demos/demo-renovation` (360×640 @3x), one per video frame, scrolling 0 → 5600 css on a gentle in-out ease. It first does a gradual reveal pass so every Rise section is drawn.
- Mute check: the two captions carry both halves on their own.
- Spacing note from the idea: reel #4 was sound-led too, so don't post these two back to back.

## Sound
No score. Calm layer (synth birdsong, a string pad, air) and chaos layer (synthesized saw, pneumatic nail gun, generic two-tone ring, a 1 kHz reverse beeper, a formant "shout", a site rumble that builds), with a hard cut between them (no crossfade). True silence 9.0–11.0. RMS: calm about -23 dB, chaos about -18 dB.

Poster = frame 150 ("what you're actually doing" over the services grid), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8905`, `PORT=8905 node render.mjs events`, `python3 sound.py`, `PORT=8905 node render.mjs video video.mp4`, `bash finish.sh 150`.
