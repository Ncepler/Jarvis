# Reel: "It's 2:14am. Someone has a question." (queue idea #8, hook 7 · SEND · DM)

Queue idea #8 from `instagram_posts` (id `76b48dd5-84e1-4504-88c8-fd713586f446`). Built with /brag (brag-slim path, Opus 5.5).
It's the first add-on reel: the AI chat assistant, $30/mo (`lib/pricing.ts` ADDONS `ai-chat`, price checked at render time).

## Angle
Questions come in when the owner can't answer. Over one night, three visitors ask the Stone & Sage landscaping demo's
chat a question and get an answer in under a second. The clock rolls forward, the sky goes from navy to sunrise, and
the status reads "owner: asleep" the whole time. It flips to "awake" at 7:00.

## Honesty
- The chat panel copies the real `ChatAssistant.tsx` look (surface panel, accent-2 dot header, bronze user bubble, bone bot bubble, ink send button). It's redrawn in canvas because the live API can't run in a capture.
- Every answer comes from facts the landscaping demo's own FAQ states: lighting (FAQ 3), the North Shore incl. Northport (FAQ 1), free estimate with a written number (FAQ 5). No invented features. There's no "morning summary".
- A caption on screen the whole time says "Example conversation · Stone & Sage is a demo brand".
- The phone screen is a real Playwright capture of `/demos/demo-landscaping` (360×640 @3x).

## Storyboard (23.6s, 709 frames)
| Time | Beat |
|---|---|
| 0–6.3 | 2:14am. "do you guys do landscape lighting?" is typed and sent; dots for 0.5s; the answer lands |
| 6.3–7.0 | Clock rolls to 4:40 and the sky shifts indigo |
| 7.2–13.3 | "do you come out to northport?" and its answer |
| 13.3–14.1 | Rolls to 5:52, first light |
| 14.2–20.7 | "is the estimate free?" and its answer |
| 20.7–21.5 | Rolls to 7:00. Sunrise, "owner: awake", the phone drops away |
| 21.4–23.6 | "Three answers. Nobody woke up." then "AI chat assistant · $30/mo add-on" |
| 23.6 | The clock rolls on through the day to 2:14 the next night (exact loop) |

## Sound
Original numpy synth. A music-box lullaby in Eb at 70 BPM plays through the night, with soft UI ticks for typing, send and receive, and a rolling clock tick on each fast-forward. At sunrise a warm string pad and synthesized birdsong come in, with one e-piano chord under the add-on line. The music box comes back over the loop. -16 LUFS.

Poster (brag.jpg) = frame 150 (2:14am with the first answer showing), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8901`, `PORT=8901 node render.mjs events`,
`python3 sound.py`, `PORT=8901 node render.mjs video video.mp4`, `bash finish.sh 150`.
