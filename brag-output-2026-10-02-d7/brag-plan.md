# Reel: "Details nobody notices 7/9, the paint ring" (batch 3 · series · FOLLOW)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

Series episode 7 (ep 6's next card promised it). The auto body demo's (Apex Collision, a demo brand) `PaintMatch` in `AutoBodyDemo.tsx`: the blue selection ring is ONE shared element (`layoutId="paint-ring"`) that travels between swatches on a spring (stiffness 500, damping 32, mass .6), and the colour swap is masked by a 240ms blur(2px)+opacity .7 that clears.

Real captures (360px mobile @3x) of four states: Apex Blue (default) → British Green → Storm Gray → Sunset Orange. The ring is hidden in the plates and redrawn travelling on the component's own spring values (Motion's spring can't be stepped frame by frame from Playwright); the swap mask is redrawn with the component's own values. 3.0× zoom keeps the whole swatch grid and the car in frame; the control pill sits at y=1790 so it doesn't cover the car.

Beat sheet (13s): 0–1 band + lens ring · 1–2.4 zoom · 3.0 / 4.6 / 6.2 taps (the ring travels) · 6.9 annotation · 8.5 pull back; "One ring, moving / to wherever you tap." · 11 "8/9 next: the progress line" · exact loop. Poster = frame 160.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
