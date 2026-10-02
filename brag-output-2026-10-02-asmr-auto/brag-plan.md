# Reel: "Scroll ASMR: the body shop demo" (batch 3 · ASMR · SAVE)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
One slow, real scroll through the auto body demo (Apex Collision, a demo brand): 330 real frames, eased, with synthesized foley: an engine idle, ratchet clicks, an impact-wrench burst, a ratchet click per section.
Honesty: every frame is a real capture; the sound is synthesized here.
Sound: engine idle, dark pad, ratchets, wrench bursts. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
