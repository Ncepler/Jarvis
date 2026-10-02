# Reel: "The same five questions" (stickman-inspired idea #25, repetition gag · SEND)

Queue position 25 in `instagram_posts`. Built with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 18s, 1080×1920.

## Where the stickman skill came in (ideas only)
An escalating repetition gag, line jitter as emotion (the boil amplitude rises with every call), icon-only bubbles, two accents (signal blue, ring red), and an ending that dissolves back into the opening frame.

## Angle
A stick-figure power-washer keeps putting the wand down to answer the phone. Each ring brings an icon bubble, and the five icons map to the
power-wash demo's **five real FAQ questions**: a map pin (areas), a house + drop (siding), a camera + $ (text a photo for a price), a shield
(licensed & insured), a clock (how long). The rings come faster ("ring. ring. ring. ring. ring.") and the figure ends up holding its head.
"or…" Then the phone pushes to full frame on the real FAQ, and the accordion opens Q01 → Q05 one at a time. That's the component's own
grid-template-rows transition, seeked frame by frame. Back outside: the phone is quiet, the washer cuts a clean stripe across the driveway, "Answer it once. / On your site."

## Honesty
- No "fewer calls" stat. It's a gag.
- The answers on screen are the demo's own FAQ copy. "Power washing style shown is a demo" stays on screen.

## Storyboard
| Time | Beat |
|---|---|
| 0–4.4 | Washing; five calls, faster each time, five icon bubbles |
| 4.4–7.5 | The pile-up: hands on head, jittering line; "or…" |
| 7.5–13.4 | Push into the real FAQ; Q01–Q05 open one by one |
| 13.4–17.3 | Pull back; a clean stripe across the driveway; "Answer it once. / On your site." |
| 17.4–18 | Dissolve to the opening frame (loop) |

## Sound
The washer's hiss, a generic two-tone ring, a rising marimba pop per bubble, a frantic tremolo bed that cuts to a calm pad on the FAQ, a soft click per answer, and a warm resolve under the closing line. -15 LUFS.
Poster = frame 400 (the real FAQ with Q05 open), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8910`, `PORT=8910 node render.mjs events`, `python3 sound.py`, `PORT=8910 node render.mjs video video.mp4`, `bash finish.sh 400`.
