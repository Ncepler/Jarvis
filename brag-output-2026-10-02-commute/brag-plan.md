# Reel: "A lead's commute" (stickman-inspired idea #23, follow the journey · SAVE)

Queue position 23 in `instagram_posts`. Built with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 16s, 1080×1920.

## Where the stickman skill came in (ideas only)
One consistent figure on one continuous journey, a 9:16 vertical reveal (stations stacked bottom → top with the camera
climbing), matched figure positions across the pans, a dotted journey path, two accents (lawn green, warm gold/brown), and an ending that returns to the opening pose.

## Angle
The whole trip a stranger takes before they call you. Sofa (a dead-lawn thought bubble) → **search** (a giant search pill, typed
dots) → **look** (a result card made from the real landscaping demo hero; the figure walks into it) → **trust** (the figure pops out beside
a phone scrolling the real demo) → **call** (the demo's real "Free consult" button, cropped from the capture and blown up; the press makes it glow and the lawn bubble goes green). Then a fast trip back down to the same sofa pose.

## Honesty
Stone & Sage Landscapes is a demo brand, and it says so on screen. The card's subtitle is the demo's real eyebrow copy. No stars, reviews or numbers.

## Storyboard
| Time | Beat |
|---|---|
| 0–2.4 | Sofa, phone, dead-lawn bubble |
| 2.4–5.2 | Climb to "search"; typing dots |
| 5.2–8.0 | Climb to "look"; walk into the real result card |
| 8.0–11.8 | "trust"; pop out beside the phone scrolling the real demo |
| 11.8–14.6 | "call"; press Free consult; glow; the lawn turns green |
| 14.6–16 | A whoosh back down to the sofa (loop) |

## Sound
A 100 BPM footstep kick, a plucked-guitar melody in G, steps on every climb, whooshes, key ticks, a swallow-pop into the card, a button thud, a warm chord when the lawn goes green. -15 LUFS.
Poster = frame 300 ("trust": the figure next to the real demo), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8908`, `PORT=8908 node render.mjs events`, `python3 sound.py`, `PORT=8908 node render.mjs video video.mp4`, `bash finish.sh 300`.
