# Reel: "Drawn in one line" (stickman-inspired idea #21, before/after transformation · SAVE)

Queue position 21 in `instagram_posts` (one of the 10 stickman-inspired ideas added 2026-10-02). Built with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 16.5s, 1080×1920.

## Where the stickman skill came in (ideas only)
From `directing-stickman-videos`: one consistent line-art figure (fixed proportions and line weight, "on twos" line boil), a flat
pure-white canvas, at most three accents (ink, the bakery's amber, Vilas bronze for labels), a visual change every 2–3s, and a closing callback. Everything ends where it started, on a single pen dot.

## Angle
Idea vs. built thing. A pen dot draws a stick figure. It pulls out a napkin and sketches a website: a header bar, a photo box with an X,
two squiggle headline lines, and an amber button. Each sketched box then flies to the matching element of the **real bakery demo**
(Golden Hour Bakehouse, a demo brand) as the napkin becomes a phone screen and the capture fades in under the landing lines. The
page scrolls, the figure gives a thumbs up, "You bring the napkin. / We build the real thing." appears, and the line un-draws back to the dot.

## How
- `cap.mjs`: bakery hero at 360×640 @3x (clock fixed so the open/closed chip reads "Open now"), the rects of the header and h1 (the button rect was measured off the capture), and a 90-frame scroll.
- Sketch → real: each box lerps from napkin space to its target element rect. The phone body fades in over the last half of the morph.

## Storyboard
| Time | Beat |
|---|---|
| 0–2.5 | A pen dot draws the figure in one pass |
| 2.6–3.7 | The napkin pops out of the raised hand; the figure walks left and turns |
| 3.75–6.25 | The sketch: header, photo box + X, squiggles, button; "the napkin" label |
| 6.5–8.2 | The sketch flies into the real bakery demo; the napkin becomes a phone |
| 8.3–11.6 | "the website"; the real page scrolls; thumbs up |
| 11.9–15.7 | The phone fades; "You bring the napkin. / We build the real thing." |
| 14.6–16.5 | The figure un-draws to the pen dot (frame 0) |

## Sound
Pencil-scratch foley on every line, a plucky marimba bed in C (104 BPM), one bright e-piano chord + bell as the sketch becomes real, and soft steps. -15 LUFS.
Poster = frame 300 (the real page in the phone, thumbs up), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8906`, `PORT=8906 node render.mjs events`, `python3 sound.py`, `PORT=8906 node render.mjs video video.mp4`, `bash finish.sh 300`.
