# Reel #9: "Every word worth anything has VAL in it" (LOOP + comment game)

Queue idea #5 from `instagram_posts` (id `1eeddc77-b704-46af-8ee8-d8948b0cfbfa`).

## Pick
- **Hook:** VAL alone, huge, with "ue" fading in to make VALUE almost at once. "the three letters that matter" sits underneath.
- **Duh test:** passes because the letters actually travel. The same three nodes move through every word. It's never a cut.
- **Comment bait:** "we ran out. give us one." Post it between two stronger SEND reels (per the idea row).

## Words (each checked: V-A-L in order, all real words)
value, valid, invaluable, approval, evaluate, festival, arrival, survival, carnival, interval → VAL → VALIS → VILAS (.studio) → VAL.

## Build: a re-creation of the site's VilasReveal
The idea said to drive the real `components/hero/VilasReveal.tsx` with a longer TOUR. That component was removed from the site (commit `8123421`, "Replace VILAS reveal hero with scroll-scrubbed coffee video"), and Motion's real-time layout animation can't be rendered frame-exact headless anyway. So the comp re-creates it from the component's source in git history (`git show 8123421^:components/hero/VilasReveal.tsx`):
- Every letter is identical: Space Grotesk 500, ink `#1f1a14` on bone `#efe9dd`, tracking -0.04em.
- V·A·L are three persistent nodes that FLIP-travel between slots on `cubic-bezier(0.16, 1, 0.3, 1)`. Helper letters fade out in place and fade in at their slots.
- The whole word scales to fit (max width 930px), so INVALUABLE shrinks and VAL is huge.
- The **finale is the original choreography:** V flies out left and S out right, L shrinks to a dot, A revolves over the top and I under the bottom, then everything snaps back as VILAS with ".studio" beneath in Space Mono.
- The loop's collapse: I and S fade out, and A hops back over L to make VAL.

## Timing
The loop is exactly 52 eighth notes (14.17s, 425 frames, ~110 BPM). Words land on the grid, starting at eighths 1, 6, 9, 12, 15, 17, 19, 21, 23, 26: slow → fast → slow. Then VAL at 30, VALIS at 34, the revolve 38–43, the tonic landing at 43, "we ran out" at 45, and the collapse 48–51.

## Sound
Minimal marimba + soft kick. Each tour word lands with a marimba note one step up C-pentatonic (C5 → A6). The kick drops out for the revolve, a rising 16th arpeggio carries it, and VILAS lands on a C-major chord with a bell and a held pad. A descending figure goes back to VAL. -14 LUFS, and the reverb tail wraps into frame 0.

## Rebuild
From `work/`: `python3 -m http.server 8901`, `PORT=8901 node render.mjs events`, `python3 sound.py`, `PORT=8901 node render.mjs video video.mp4`, then mux. No site capture needed.
