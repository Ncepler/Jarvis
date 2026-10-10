# Transitions: pick the video FOR its transition, then build the transition

2026-10-10, Noah on two autopilot reels: "there's no transition, it's kind of just like a clip slapped on top. The most important thing is a transition."
Cause: the pipeline took any video, ran the story to its last frame, then pasted a generic ending (flash + lasers) on top. Nothing in part 1 was *used*.
Fix: a video is chosen because it contains a place where the story can turn INTO Vilas, the cut goes at that place (often well before the end, which also brings the hook
forward), and part 2 starts as a transformation of part 1's own last frame.

## 1. The seven rules
1. **Pick for the transition.** A video with no usable transition point (score < 8 below) is skipped, however good the story is.
2. **The Vilas hook must be on screen by 20 s** (hard limit 24 s; `qa.py hook_time`). Scrolling viewers leave early; the old reels put the hook at 31 s and 27.7 s. Prefer sources <= 40 s; for longer ones the transition point must be <= 22 s.
3. **Cut on a finished sentence, after the payoff.** The narrator is silent at the cut (`envelope.py` gap, 30 ms fade). The viewer has already got the thing they stayed for; part 2 interrupts the epilogue, not the point.
4. **The transition starts ON part 1's last kept frame** (frame 0 of part 2 is that exact picture) and ends on REAL Vilas footage. No hard slap, no overlay on part 1's footage, no frozen-frame-plus-caption-band, no placeholder.
5. **One move, 0.8-1.2 s,** with sound on the same frames (the cut is heard: `qa.py audio_hit`).
6. **Brand on screen at landing** (the demo chip + first caption line say "Vilas Studio"), spoken by the narrator's clone in the first 1.5 s after landing.
7. **Variety:** no two videos in a batch share a transition; the laser drop at most once in three videos (Noah still wants lasers for some, those where the video itself is about impact/energy).

## 2. Does this video have a transition? (the scorecard)
Run `python3 -I scripts/find_transitions.py video.mp4 --out work/ft --max-t 24` on every candidate. It lists cut points with a suggested transition and writes `candidates.png`. It only *generates*
candidates (measured weakness: classical circle detection can't tell a hole from a nose): **LOOK at the sheet**, then score the best candidate 0-3 on each line:

| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **Affordance** (a real thing to transition through, section 3) | nothing | weak/only universal (doors, glitch) | clear shape/motion/focal point | the story's own signature image is the transition (a perfectly round bite hole; a tunnel; a lens) |
| **Boundary** (narrator finished a sentence there) | mid-sentence | pause < 0.12 s | clean gap >= 0.12 s | gap >= 0.25 s and the caption flips right after |
| **Payoff** (the story has delivered) | setup only | half | fact delivered | fact delivered and a beat to land on |
| **Hook time** | > 24 s | 21-24 s | 15-20 s | <= 14 s |
| **Fit** (mood/colour continuity with a demo, section 6) | clashes | neutral | matches | the demo's content echoes the story |

**>= 11/15: build it. 8-10: only with a universal transition and only if the batch has nothing better. < 8: skip the video.** Put the scorecard in `plan.md`.
Worked scoring, shark/whale video (2026-10-10): the bite hole is a perfect circle with a clean rim, stable 17.7-18.15 s; the narrator finishes "in its skin" and is silent until 18.2 s; the fact (a perfectly round bite)
has been delivered; hook at 18.0 s; the blue water meets the power-washing demo => 3+3+3+2+3 = 14. The old autopilot used this video's *end* (27.7 s, a flash). Sloth video: no clean closed shape, no strong focal point:
best is `doors` at 19 s => 1+2+2+2+1 = 8: borderline, a different video would have been the better pick.

## 3. What to look for (affordances) and what each supports
| In part 1 | Example | Transition | Notes |
|---|---|---|---|
| A **round shape** with a clear rim: hole, eye/pupil, coin, wheel, lens, porthole, planet, pizza/plate, manhole, bite, ring, bubble, crater | the whale's bite hole | **iris** | the circle becomes the window onto the site; measure with `measure_circle.py` |
| A **dark or bright focal point** the camera is heading into: tunnel, pipe, throat, cave, black hole, sun, deep water, a light | falling into a pit | **zoom** | dive at the focal point, arrive inside the site |
| **Fast sideways blur** or a throw/pass/race/swoosh | sprint, projectile, bird fly-by | **whip** left/right | the site whips in right behind |
| **Vertical motion**: a fall, launch, climb, elevator ride | rocket, skydive | **whip** up/down | the site continues the same direction and speed |
| An **impact or break**: smash, crack, collision, ice, glass, explosion, stone | meteor strike | **shatter** (or laser drop if the spectacle is the point) | part 1's last frame cracks, shards fly at the camera |
| A **calm held frame** with nothing special (a room, a door, a box, a lid, a building) | any quiet ending | **doors** (elevator) | universal; weakest story fit, strongest sonic identity (the ding) |
| **Digital / electric / hacking / AI / signal / TV** subject | circuit, screen, drone feed | **glitch** | tear, black flicker, site snaps in |
| A **big spectacle** (space, energy, disaster, a weapon) | railgun, asteroid | **laser drop** (hype template) | still the right call for those |

Also usable as the ending frame: a **caption word** that can pivot ("...and the whole system helps protect the sloth" -> nothing; "...in its skin" -> a hole -> a window). The best transitions reuse a noun from the last line.

## 4. Where to cut (the cut-point rules)
- After the core fact, before the epilogue/moral ("so next time you..."). If the video has a "so that's why" outro, the cut goes before it.
- The kept audio ends in a silent gap after the last word (never clip a word; never repeat one). Keep the caption that matches the last kept words on the last frame.
- Don't cut while the story is mid-tension (a viewer who wanted the payoff feels cheated) unless the transition IS the punchline (shatter on an impact, with the impact already shown).
- The first dropped frame is a caption flip; the last kept frame (index N-1) still shows the old caption. `strip.sh` at 10 fps around the gap, pick N, then `prep_bridge.sh orig N site.mp4 workdir`.
- Cutting earlier is a **standing edit** (SKILL.md, Rule zero 5): `assemble.py --cut-frame N --audio-cut SEC`; only the last partial GOP is re-encoded, the rest stays bit-identical.

## 5. The catalog of endings
Status: **BUILT** = renders today (`assets/bridge` unless noted); **SPEC** = designed, not built (build when a video calls for it). Idea grade: A build soon / B fine / C skip.

| # | Ending | Needs from part 1 | The move | Sound (real SFX + bed) | Voice line (clone), brand first | Status |
|---|---|---|---|---|---|---|
| 1 | **Iris match-cut** | a round shape with a rim | push into the circle; it opens like an iris onto a real demo site | pop + short whoosh + riser, soft impact + chime at landing | "Vilas Studio. Websites that look expensive. They weren't." | BUILT (A) |
| 2 | **Zoom-through** | a dark/bright focal point | dive with radial blur, flash, arrive inside the site | riser + cinematic whoosh, bass impact at landing, sparkle | same | BUILT (A) |
| 3 | **Whip** (sideways or vertical) | lateral/vertical motion | part 1 is flung away under motion blur, site whips in | whoosh x2, soft impact | same | BUILT (A) |
| 4 | **Shatter** | an impact/break | crack, shards fly at the camera, site behind | glass crack + shatter (synth) + bass impact | same | BUILT (A) |
| 5 | **Doors (elevator)** | any calm frame | frame splits down the middle and slides apart; light spills; site inside | **ding** (chime) then door slide | "Going up? Vilas Studio." only if it fits the story, else the standard line | BUILT (B+) |
| 6 | **Glitch** | digital/electric/tech | RGB split, slice tears, black flicker, site snaps in | 3 real glitch sounds + riser | same | BUILT (B) |
| 7 | **Laser drop** (`assets/hype-ending`) | impact/energy/spectacle | smash into the wordmark, laser show, slams, end card | synthesised drop | none or the clone's name | BUILT (B: Noah wants it for SOME videos, not all) |
| 8 | **Blackout -> neon sign** | night/cave/space/"lights out" | picture dims to black, 0.3 s of silence, a neon "Vilas" buzzes on, flicker, then zoom into the site | power-down, click, electric buzz, hit | same | SPEC (A) |
| 9 | **Camera snap** | a "moment": discovery, catch, record | shutter flash, frame freezes into a photo that slides down to reveal the site | shutter click + flash pop | "Got it. Vilas Studio." | SPEC (B) |
| 10 | **Phone-in-world** | any | the last frame shrinks into a phone screen held in a hand; the site plays on it; push in | whoosh in, tap | same | SPEC (A: strongest "it's a real website" proof; needs a phone mock-up asset) |
| 11 | **Slot machine** | money/odds/records | reels spin and land on "$300" | reel ticks, jackpot bell | "From $300." (price first) | SPEC (C: the price can't carry the first second) |
| 12 | **Plate/bowl iris + order-up bell** | FOOD stories | the plate (a circle) is the iris; a dinner bell ding lands it | **bell**, sizzle bed | "Order up. Vilas Studio." | uses #1 (A for food only) |
| 13 | **Cloche lift** | FOOD stories | a silver lid lifts off the last frame, the site is under it | clink, steam | same | SPEC (B) |
| 14 | **Rack focus** | out-of-focus moments | part 1 blurs to nothing, the site sharpens in | soft whoosh | same | SPEC (B) |
| 15 | **TV channel flip** | tech/retro | static burst, a channel change lands on the site | static, tuner blip | same | SPEC (C: reads as an ad parody) |

**Honest verdict on the ideas Noah floated.** *Food:* only works when the story is about food (rare for this account) and is mostly just the iris on a round plate plus a bell sound: use it then, don't build a separate food engine.
*Someone walking out of an elevator:* as a person walking out it needs footage we don't have, but the **doors-opening-onto-the-site** version (#5) captures the idea: the ding is memorable, it works on any calm
frame, and it's the right fallback when nothing better exists. It is the weakest on story fit, so it is a fallback, not a default. Best new ideas by impact: #10 phone-in-world, #8 blackout/neon, and (food) the plate iris.

## 6. Pick the demo footage to fit the cut frame
`assets/vilas-site/index.json` has each demo's mean colour. Colour/mood continuity makes the landing feel intended:
| Cut frame is mostly | Use | Why |
|---|---|---|
| blue / water / sky | `demo-powerwash` (blue, clean water), `demo-autobody` (cool dark) | the iris lands in a matching blue world |
| green / foliage / animals in nature | `demo-landscaping`, `demo-lawncare` | same palette; the cut feels like the picture "growing" into a site |
| warm brown / gold / food / wood | `demo-bakery`, `demo-barber`, `demo-renovation` | warm continuity |
| pink / red / flowers / gifts | `demo-florist` | |
| black / night / space / tension | `demo-barber`, `demo-autobody`, `demo-magician` | dark demos land without a harsh brightness jump |
| anything bright on a dark cut | any bright demo | a brightness jump IS a surprise: fine for zoom/shatter, avoid for doors |
Rules: a demo's chip always says it is a demo ("A VILAS.STUDIO DEMO · POWER WASHING"); never show a real business; recapture with `scripts/capture_site.mjs` when the demos change.

## 7. The landing: voice, captions, brand
- Part 2 timeline (6-6.5 s): transition 0-0.9 s -> site footage with the brand line -> end card (bone, "Vilas / .studio", tagline) held >= 1.4 s with the sting.
- **Voice** = the narrator's clone (else the fallback ladder in `voice-clone.md`), starting at the landing: "**Veelas Studio.** Websites that look expensive. They weren't." Captions repeat the words in part 1's caption style (the file must work on mute).
- Optional **echo** of <= 3 words reusing a noun from the video's last line, with no claim in it ("Clean cut." / "Perfectly round."). It's the pun that makes the ad feel written for this video. It must still pass the duh test (not a restatement) and make no claim about Vilas.
- Claims only from the message bank (`vilas.md`). No "best", no stats, no invented clients.
- Law: no wink, no record scratch, no "this video is sponsored".

## 8. Build and check
`prep_bridge.sh` -> cfg (`transition.type`, circle/focus/dir/impact, `lines`, `sound.mood`, `siteLabel`) -> `audio.py` -> stills -> **look at 6 stills across the transition** -> video -> `assemble.py` -> `qa.py --mode bridge`.
The checks that matter on the stills: frame 0 identical to part 1's last frame (no pop); the move is readable at phone size; the captions beat the site's own text (scrim); the demo chip is visible; the end card holds.
`qa.py` gates: `transition` (continuous at the cut, fully changed 0.15 s after it ends), `hook_time`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`, `sound_variety`.

## 9. Seen failures (do not repeat)
- A flat flash then lasers on every video: reads as "a clip slapped on top" (2026-10-10).
- Cutting at the video's end: the hook landed at 31 s and 27.7 s.
- Circle detection that scores a nose like a hole: always look at the sheet.
- A whip with the site's edge not glued to part 1's trailing edge: a black gap flashes mid-whip (fixed: `tPos`).
- Captions over the demo's own text (the first sample wrote "Vilas Studio." across the site's headline; a 0.8-alpha scrim didn't fix it): captions go on the **ink panel** (bottom 25%) that slides up at landing, and the demo chip lives there too (`captionStyle.y` 1085).
