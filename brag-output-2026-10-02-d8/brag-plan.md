# Reel: "Details nobody notices 8/9, the progress line" (batch 3 · series · FOLLOW)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

Series episode 8 (ep 7's next card promised it). The renovation demo's (Maple & Main Renovation Co., a demo brand) `ProcessTimeline` in `RenovationDemo.tsx`: the accent line down the 'Here's the order' steps is `transform: scaleY()` (origin top) driven natively by a CSS scroll timeline (`animation-timeline` on a named view-timeline, range cover 10%–85%); each step number turns accent as it crosses the middle (IntersectionObserver). With reduced motion the line just sits full.

**Nothing is redrawn.** 180 real screenshots of one scroll through the section (360×560 @3x, headless Chromium with native scroll-driven animations), with the fill's progress, tip position and each step number's computed colour read from the live page each frame. The pill shows the live `scaleY` as a percent; the annotation follows the fill tip. No zoom: the whole 360px width is the subject, and the pill sits at y=1790 so the line stays clear.

Beat sheet (13s): 0–1 band + lens ring on the line tip · 1.5–7.3 the scroll, the line fills and the step numbers light in turn · 4.4 'one scaleY. scroll-driven.' · 8.3 'A progress bar / made of one scroll.' · 10.5 '9/9 next: the card flip' · 10.8–12.0 scroll back up · exact loop. Poster = frame 158.
Sound: scroll swell, a felt tick per step lit.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
