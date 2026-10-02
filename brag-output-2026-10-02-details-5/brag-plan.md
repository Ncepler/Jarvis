# Reel: "Details nobody notices 5/9", the estimate that doesn't count up (series · FOLLOW)

New series episode (ep 4's next card promised it). Built 2026-10-02, second batch, /brag (brag-slim path). Series template from
`brag-output-2026-09-30-details-1/brag-plan.md`.

## It's the real component
The lawn care demo's (Fresh Cut Lawn Co., a demo brand) `EstimateWidget` in `LawnCareDemo.tsx`: size × frequency → a rough price. When the
price changes, it never counts up. The number swaps instantly and a 150ms blur(2px) + opacity .7 "masks the cut", then clears over 150ms.
`cap.mjs` sets the real controls to four states and screenshots each one (page @3x, price macro @12x): Medium·Weekly $55 → Small $40 → Large $75 →
Large·Biweekly $95. The prices are the component's own math (`round5(base × mult)`).

## Deviation
The blur/fade itself is redrawn on the captured price line with the component's exact values. It runs on a real-time `setTimeout`, so it can't
be seeked frame by frame like a CSS transition. Zoom 4.0, so the full "$95 / visit" line fits. The control pill shows the input state.

## Beat sheet (13s)
| Time | Beat |
|---|---|
| 0–1.0 | Band "5/9", ring on the price |
| 1.0–2.4 | Zoom in |
| 2.8 / 4.0 / 5.2 | Small → $40, Large → $75, Biweekly → $95, each with the 150ms blur mask |
| 6.0–7.4 | Annotation: "no count-up. a 150ms blur." |
| 7.9–10.8 | Pull back; "So it reads like a price, / not a slot machine." |
| 10.8–13 | "6/9 next: the occasion preview"; resets to Medium·Weekly $55 under the card; exact loop |

Sound: the series palette, a range-thumb tick run per slide, a soft swish on each price mask. Poster = frame 165 ($95, macro), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8912`, `PORT=8912 node render.mjs events`, `python3 sound.py`, `PORT=8912 node render.mjs video video.mp4`, `bash finish.sh 165`.
