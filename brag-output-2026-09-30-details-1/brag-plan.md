# Reel #7: "Details nobody notices 1/9", the bakery that knows what time it is (reel-lab hook 15, serial · FOLLOW)

Queue idea #3 from `instagram_posts` (id `896b84d7-df79-4b3b-8276-ebcbfb0069b9`). Episode 1 of a 9-part series. Episode 2's idea row is in `supabase/pending/2026-09-30-reels-5-9.sql`.

## Pick
- **Hook family:** reel-lab 15, the "Day N of ___" serial (FOLLOW). Reels 1–4 were all SEND/LOOP, and the grid needs a reason to follow.
- **Frame one:** the series band ("Details nobody notices", 1/9), a lens ring already sitting on the bakery's status chip, and the clock at 6:58 AM.
- **Duh test:** passes. Nobody consciously notices a status chip, and the reel is about exactly that.

## It's the real component
The chip text is never typed by hand. `cap.mjs` sets Playwright's clock to Wednesday 2026-09-30 (an open day) at 06:58, 07:00 and 12:01. `BakeryDemo.tsx`'s own `computeBakeryStatus()` renders the three states:
- 06:58 → "Opens today at 7am"
- 07:00 → "Open now — until noon" (the dot turns accent and pulses)
- 12:01 → "Opens 7am tomorrow"

The loop's fast-forward runs through midnight into Thursday 6:58, and the chip flips back at the exact frame the clock crosses midnight. That's what the real logic does. Flips are hard cuts, because the real chip re-renders instantly.

The macro plates are shot at 12× DPR so the zoom stays sharp. The page around them gets a depth-of-field blur, and the plate edges are feathered.

## SERIES TEMPLATE (keep identical for episodes 2–9)
- **Band:** 0–240px, bone `#efe9dd`. "Details nobody notices" in Syne 700 50px ink at x=56, baseline 176. `n/9` in Space Mono 40px bronze `#8a5a2b`, right-aligned at x=1024. A 2px `#d9d0c1` hairline at the bottom.
- **Page:** full-bleed under the band at 3 px/css (360-css capture = 1080 wide).
- **Lens ring:** a bone ring (5px) with 36 tick marks, hugging the detail at rest. On zoom it blows out past the frame and fades. It comes back for the loop.
- **Zoom:** to 4.6 px/css over 1.4s (eIO), with page blur up to 9px, a chromatic fringe and a vignette while moving.
- **Control pill:** centred at y=1330. Space Mono 700 58px on `#f6f1e8`, and `▸▸` + bronze text while fast-forwarding.
- **Annotation:** a 4px bone leader line with a dot at the detail, and a mono label pill 150px below it.
- **Why-line:** a bone panel at y 1010–1260, Syne 700 66px, two lines.
- **Next card:** an ink pill at y 1070–1200 with a Space Mono 36px bone line, in the form "n/9 next: …".
- **Sound palette:** no music. Room tone, a clock tick per minute (a rolling tick on fast-forward), a felt click on each state flip, a focus-motor whirr on zooms, and a pen swish on the annotation. Mastered around -17 LUFS (quiet on purpose).
- **Length:** 13s, looping exactly to frame 0.

## What changed from the idea row
- "2/9 tomorrow" became "2/9 next: the barber's walk-in sign". A promise of "tomorrow" breaks the moment a day gets skipped, and naming the next detail is a stronger follow hook.
- The loop goes forward through midnight to the next morning instead of rewinding, so it stays true to the component.
- 13s instead of 12s, so the next card can breathe.

## Episode plan (from the idea row)
2 barber walk-ins chip · 3 landscaping day/night auto-play · 4 power wash compare-slider handle spring · 5 lawn care estimate slider · 6 florist cursor-follow occasion preview · 7 auto body layoutId colour ring · 8 renovation scroll progress line · 9 magician interruptible card flip.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8899`, `PORT=8899 node render.mjs events`, `python3 sound.py`, `PORT=8899 node render.mjs video video.mp4`, then mux into brag.mp4.
