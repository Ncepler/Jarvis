# Reel: "Details nobody notices 9/9, the card flip" (batch 3 · series finale · FOLLOW)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

Series finale (ep 8's next card promised it). The magician demo's (Elias Vane, a demo brand) `ShowCard` in `MagicianDemo.tsx`: tap a face-down card and it flips on a spring (`transform: rotateY()`, duration .6, bounce .2). Because the transform is a full string and not a shorthand, the spring is **interruptible**: tap again mid-turn and it reverses from wherever it is instead of finishing first.

**Nothing is simulated.** The real rotateY angle of the live component was recorded every animation frame (60 fps rAF sampler, headless Chromium) through four taps: up, down, **up again 0.2s later, mid-turn (it reverses at about 19°)**, down. The real page was then captured with the card forced to every 5° from -10° to 190° (41 plates, 360×560 @4x). The canvas plays the recorded angle against those plates, with a light shutter blur on the fast frames. The pill reads the state. Mobile never hovers, so the hover lift isn't shown.

Beat sheet (13s): 0–1 band + lens ring · 1–2.4 zoom on the third card · 3.0 tap · 4.8 tap · 5.0 tap mid-turn (annotation 5.2) · 6.5 tap · 7.9 pull back; 'Interrupt it mid-turn, / it just turns back.' · 10.8 'next: more at vilas.studio' · exact loop. Poster = frame 120.
Sound: card-stock flick per tap, a soft felt tap on each landing.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
