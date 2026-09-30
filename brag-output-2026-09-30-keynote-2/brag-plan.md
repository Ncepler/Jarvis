# Reel #10: "Introducing: the before & after" (keynote vol. 2, reel-lab hook 19)

Queue idea #4 from `instagram_posts` (id `6b9c3cac-b127-4e63-8aeb-909002124c4c`). Volume 2 of the keynote format from reel #6 (`brag-output-2026-09-30-keynote/`), which Noah asked for more of.

## Pick
- **Hook family:** reel-lab 19, defamiliarization played as a deadpan product keynote (SEND · COMMENT).
- **Frame one:** the stage from vol. 1 (mirror floor, volumetric beam, "Introducing."), so the two read as a series.
- **Send test:** contractors send it to the one who still posts "before" photos with no "after".

## What changed from the idea row
- **Renovation demo, not power wash.** The power wash slider only has labeled placeholders right now, so a macro on it would show two grey boxes. The renovation demo ("Maple & Main Renovation Co.", DEMO BUILD) has real before/after kitchen photos in its compare slider.
- **Feature 2 is the sticky estimate bar** ("Call | Get a quote"), lifted out of the screen as its own card, leaving a dashed gap. The idea's "text a photo" block lives on the power wash demo.
- **Spec slide:** "2 photos | 2,000 words (roughly)" (a picture's worth a thousand words, twice).
- **One more thing = "You own it. The site and the domain."** That's the main site's own FAQ answer (`lib/site.ts`: "The site and the domain are yours."), not a new claim.

## Build
Same three.js stage as vol. 1 (Reflector floor, cone beam shader, RoundedBox phone, CanvasTexture screen). Screen segments are composited per frame from 3× captures of `/demos/demo-renovation`:
1. slider: the real slider captured at 50 / 0 / 100 (keyboard-driven), composited so the handle drags 50 → 86 → 12 → 50 with a touch circle
2. a tall strip the sticky bar rides over, plus the bar captured on its own (1080×162) for the lift-out card
3. the hero (after the hit)
4. a 1.35× full-page capture for the final flick to the footer

## Beat sheet (21.5s, 645 frames @30)
| Time | Beat | Sound |
|---|---|---|
| 0–2.0 | Beam sweeps in, phone rises. "Introducing." | whoosh + sub, D-major strings |
| 2.0–5.0 | Macro onto the slider; a finger drags it across and back. "The before & after." / "(You can drag it.)" | piano D5, felt touch, two swishes, release tick |
| 5.0–9.1 | Spec slide: "2" photos, "2,000" words (roughly) | piano F♯5, A5 |
| 9.2–13.6 | Pull back; the estimate bar lifts off the screen. "The estimate button." / "It follows you." | piano B5, lift whoosh, shimmer |
| 13.6–15.35 | Black. "One more thing." | total silence, tails killed |
| 15.35–18 | Hit. The hero. "You own it." / "The site and the domain." | strings + brass + thud |
| 18–20.5 | Pull back, flick through the page to the footer. "All of it. Standard." + vilas.studio | resolve up an octave |
| 20.5–21.5 | Phone sinks, "Introducing." returns (exact loop) | pad settles to frame-0 level |

Poster (brag.jpg) = frame 120 (macro on the slider with the title), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8899`, `PORT=8899 node render.mjs events`, `python3 sound.py`, `PORT=8899 node render.mjs video video.mp4` (~1.1 s/frame), then mux with poster frame 120 as frame 0.
