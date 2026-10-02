# Reel: "Your storefront shrank" (stickman-inspired idea #24, reframe · SHARE)

Queue position 24 in `instagram_posts`. Built with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 15s, 1080×1920.

## Where the stickman skill came in (ideas only)
9:16 depth and vertical-reveal staging, a figure that stays the same size while the world changes scale around it, three accents (rose, sun yellow, leaf green), line boil on twos, and an infinite-zoom loop.

## Angle
A line-drawn flower shop fills the frame, and a stick figure walks past it: "this is your shop." The building shrinks until it fits inside the
phone the figure is now holding up. The line art turns into the **real florist demo** (Wildstem Florals, a demo brand), and it scrolls:
"this is also your shop." The figure steps into the screen, the phone grows back out into the line-drawn shop, and the figure is walking past it again (frame 0).

## Storyboard
| Time | Beat |
|---|---|
| 0–3 | A full-frame line shop; the figure walks by; "this is your shop." |
| 3–6.2 | The shop shrinks into the phone the figure lifts |
| 6.2–7 | Line art → the real florist demo |
| 7.2–10.9 | The real page scrolls; "this is also / your shop." |
| 11–12.2 | The figure steps into the screen |
| 12.2–15 | The phone grows back into the line shop; the figure walks by again (loop) |

## Sound
A soft felt-piano figure in F (84 BPM), footsteps, a long rising whoosh on the shrink, a chime + warm chord when the real site appears, a pop as the figure steps in, and a reversed whoosh on the zoom back. -15 LUFS.
Poster = frame 270 (the real florist page in the phone, line two on screen), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8909`, `PORT=8909 node render.mjs events`, `python3 sound.py`, `PORT=8909 node render.mjs video video.mp4`, `bash finish.sh 270`.
