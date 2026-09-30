# Reel #5: "Spot the difference" (reel-lab hook 13, guess game, no price)

Queue idea #1 from `instagram_posts` (id `1f4622fc-2dca-4bed-b6fe-b5afe9848f37`).

## Pick
- **Hook family:** reel-lab 13, the guess game (COMMENT · LOOP), with no price this time.
- **Frame one:** two phones showing what looks like the same lawn care site, a countdown ring at 10, and "5 differences. / One of these loses customers."
- **Duh test:** passes. At first glance the two look identical, and that's the game.
- **Send test:** people send it to a friend to compete ("how many did you get"). Lawn guys send it to each other.

## What changed from the idea row
- **Side by side instead of stacked.** Stacked 16:9 windows only showed about 280 css px of page each, which can't show "below the fold". Two full phone screens (860 css px tall) can, and side by side is the classic spot-the-difference layout.
- **120 BPM instead of 128.** That way the countdown seconds land on beats, so the clock tick sits in the groove.
- **Answers scroll with the page.** Instead of popping all five circles on one screen, the circles are pinned to the page and the reveal scrolls through them: footer → CTA band → whip to the top → hero.

## The five breaks (DOM edits in the capture script, same real page)
1. Footer hours hidden (`visibility:hidden`, so nothing else moves)
2. The CTA band's "(516) 555-0148" button replaced by plain grey text, at the same height
3. Hero photo `scale(1.6, 1)`, stretched
4. Hero sub-copy set to 11px (box height held so the headline doesn't move)
5. The hero's CTA group moved out of the hero into a strip below it (a placeholder holds its space)

Nothing else differs. The broken page is exactly 150 css px longer below the hero, and the comp compensates so both phones scroll in sync.

## Beat sheet (18.5s, 555 frames @30)
| Time | Beat | Sound |
|---|---|---|
| 0–0.5 | Hook frame: both phones on the hero, ring at 10 | Pizz pickup |
| 0.5–6.0 | Slow drift on the hero, ring ticking down | 120 BPM pizz bed in F, clock tick on every second |
| 6.0–6.75 | Whip down the page (real motion blur) | Whoosh |
| 6.75–10.3 | Drift through the CTA band and the footer | Bed builds: C7 bar, doubled octave, shaker |
| 10.5 | Ring hits 0, red wash | Buzzer, bed cuts dead |
| 10.85–15.1 | 5 marker circles + labels. The ring becomes a 1/5…5/5 tally | Marker squeak + a ding one pentatonic step higher each time, soft pad |
| 15.4 | Red X stamped over the broken phone | Thud |
| 15.75 | Check badge + "This one's ours." on the real one, vilas.studio under the phones | Win chime |
| 16.5–18.5 | Circles wipe, ring refills to 10, bed back in | One bar of F that runs into the frame-0 pickup |

## Honesty
- Both phones show the real Fresh Cut Lawn Co. demo, a Vilas style. The "DEMO BUILD" pill is visible in both headers, and the caption says it's a demo.
- The broken copy is the same real page with five DOM edits. It isn't a fake competitor site and doesn't mock any real business.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8897`, `node render.mjs events`, `python3 sound.py`, `node render.mjs video video.mp4`, then mux video.mp4 + audio.wav into brag.mp4 (aac 192k).
