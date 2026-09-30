# Reel #14: "One of these feels expensive" (guess-and-argue, motion only · COMMENT · LOOP)

Queue idea #9 from `instagram_posts` (id `55568290-ba21-4cfe-b1ce-9b747311bcd6`).

## The test
Two panels, A and B, render the same element in the bone palette, start on the same frame and run for the same duration. The only difference is the easing curve:
- **Expensive:** `cubic-bezier(0.16, 1, 0.3, 1)` (the studio site's own `--ease-out-expo`; the demos use the close sibling `(0.23, 1, 0.32, 1)`)
- **Cheap:** `cubic-bezier(0.42, 0, 0.58, 1)` (CSS `ease-in-out`, the default everyone reaches for)

Durations are equal per round, so nobody can say "it's just faster": hover 300ms, menu 500ms (+60ms link stagger), reveal 700ms (+90ms line stagger), image 550ms.

| Round | Element | Expensive side |
|---|---|---|
| 1 | hover lift on a service card ("Kitchens", from the renovation demo's copy) | **B** |
| 2 | menu opening (Maple & Main header) | **A** |
| 3 | two-line heading mask reveal + paragraph | **A** |
| 4 | a real renovation-demo kitchen photo opening from its thumbnail | **B** |

Answer: **B A A B**. It's only in the pinned comment (share-copy.txt), never in the reel.

## Build
2D canvas, every frame a pure function of the frame number, with a real cubic-bezier solver. The same cursor path drives both sides. Round 4 crossfades back into round 1 at rest, so the loop is exact. Poster = frame 100 (both hover cards mid-lift), baked in as frame 0.

## Sound
No music. One identical felt tick at every animation start (both sides share it, so the sound gives nothing away), a woodblock on each round change. -18 LUFS, quiet on purpose.

## Rebuild
From `work/`: `python3 -m http.server 8894`, `PORT=8894 node render.mjs events`, `python3 sound.py`, `PORT=8894 node render.mjs video video.mp4`, then mux with frame 100 as frame 0.
