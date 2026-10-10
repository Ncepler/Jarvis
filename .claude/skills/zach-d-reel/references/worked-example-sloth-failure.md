# Worked example (negative): the sloth reel, 2026-10-10

Noah's unattended overnight run ("/goal Finish with 5 fully edited videos…", source: @zackdfilms92 via Snaptik) produced this one and he
called it awful. It is kept here as the example of **what the default path used to produce**, with measurements, so nobody
re-derives it. Part 1: a Zack D Films 3D video, "a sloth's fur is infested with algae and moths…", 31.2 s of original, 42.8 s total, 720x1276 @ 30 fps.

## What shipped (measured)
| Time | What | Why it's wrong |
|---|---|---|
| 0-31.2 s | the original | **"ZACK D FILMS" still printed on the dung pile at ~16.0-18.1 s**, although the run's prompt said to cover creator marks |
| 31.2 s | splice (digital silence 31.20-31.27 s); the picture doesn't change | nothing marks it |
| 31.25-33.9 s | the original's last wide shot lingers (frame diff vs 31.2 s: 4/255) under a smudgy dark-green caption band: "Vilas Studio doesn't protect sloths." | **no cut at all**: part 2 starts by continuing part 1's footage. The joke is a non-sequitur, not a hinge (no connector, no brand move) |
| 33.9 s | hard cut to a flat bone card with a hollow rectangle "VILAS.studio" and captions "We build websites / for local businesses / that look ten / times more expensive. / From $300." | a **placeholder box** where a website should be: reads as a wireframe. The cut is silent: 30-80 Hz energy in the next second is 7 dB *below* the audio before it (railgun +12 dB, vehicle +6 dB) |
| 34-41 s | a voice reads those captions | **flat TTS**: pitch median 127 Hz, spread 14 Hz vs the narrator's 178 Hz / spread 69 Hz. Noah: "sounds exactly like Stephen Hawking" |
| 36-42.8 s | end card "VILAS.studio / A website that looks expensive. It wasn't." | **1.66 s of digital silence** at the end (41.16 s on): no sting, no tail |

## Why the old skill produced it
1. **The good parts were opt-in.** The laser drop needed the words "hype / lasers / ~5 s"; the clone needed "keep the voice"; covering
   marks needed Noah's yes in the conversation. A bare "make videos" prompt triggered none of them and fell to the *default* part 2
   (hinge → turn → offer → sign-off, built from "cheapest" motion graphics). That default was never the part that made railgun/vehicle good.
2. **Every fallback said "ask Noah"**, and Noah was asleep. "Ask for screen recordings" became a hollow rectangle; "clone needs approval/credits"
   became a stock TTS voice; "offer to cover the mark" became nothing.
3. **"Match before you switch"** was applied to the picture: part 2 began on part 1's footage and only then changed. The good reels switch on
   frame 0 and let only the *captions* and the narrator's voice carry over.
4. **No gate.** The skill can't hear and its QA was a checklist of things to read. Nothing measured the cut, the hit, the voice or the tail.

## What now prevents each failure
| Failure | Rule now | Enforced by |
|---|---|---|
| Mark left in | Autopilot covers every creator mark on every video; scan the whole video at 4 fps in 20 s chunks | `autopilot.md` §4, re-scan of the final |
| Silent / soft cut | Frame 0 of part 2 is a hit (white frame + 30-80 Hz thump) | `opening: "orb"`, `qa.py audio_hit` |
| No real cut, part 2 on part 1's footage | Frame 0 is a whole new screen, never overlay part 1 | `qa.py hard_cut` |
| Hollow website box / cream-card ad | The default part 2 is the laser drop; no placeholders, no wireframes | SKILL.md "Defaults", `autopilot.md` §5 |
| Robot voice | Clone the narrator or use no voice at all; never TTS | `autopilot.md` §6, `qa.py voice` |
| Dead air at the end | The end card keeps the beat/chord tail to the last frame | `qa.py dead_air` |
| Non-sequitur "joke" | The hype ending has no spoken joke: impact + slams from the message bank | `autopilot.md` §5c |
| Batch of five identical endings | Style rotates by video number; copy sets rotate | `autopilot.md` §5a, §5c |

## How to check a video against this
`python3 -I scripts/qa.py sloth.mp4 --cut 33.9 --voice 34 41 --narrator 1 28` FAILs `audio_hit`, `dead_air` and `voice`; with
`--cut 31.25` it also FAILs `hard_cut` (4/255). The two good reels pass: railgun (`--cut 33.1667`) and vehicle (`--cut 30.564`).
