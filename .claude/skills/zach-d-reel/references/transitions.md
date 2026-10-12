# The seam: the sentence slot, the move, the landing  (v4, 2026-10-12)

Noah, 2026-10-12, on three v3 reels: "the physical transitions look very nice, well edited, however it doesn't make sense where the transition is. It's just placed in the middle of a sentence or something, it doesn't flow."
"The pole vault one is like 'until you land at VILAS STUDIO', like it's continuing a sentence, which is good." "It doesn't seem to understand that the transition should be into a Vilas Studio thing, not showing a demo website. That's a no-no."
"brag.mp4 [the railgun], that's the type of transition that's good. It makes sense with the word flow, the audience is engaged, it's a mostly seamless transition. Then it cuts to some funny [stuff] of Vilas Studio."

So the order of decisions is: **words first** (where can the narrator's sentence end in "Vilas Studio"?), **then the picture** (what move does the footage offer at that exact moment?), **then the landing** (always the Vilas spectacle).
v3 had it backwards: it picked a shape or a pause, cut there, and started a new sentence on a demo website.

## 1. The sentence slot
A **slot** is a point inside a narrator sentence where the next word(s) name **where something goes, what it hits, or what is found**, so that "Vilas Studio" can take their place and the sentence still makes sense.
The cut goes immediately before those words; the narrator's clone says the replacement (0-2 small words + "Vilas Studio", spelled "Veelahs Studio" for the voice model: SKILL.md).

**Verbs/phrases that open a slot** (the dropped words come right after them):
hit / smash into / crash into / slam into / land (on, at, in) / end up (at, in) / arrive at / reach / make it to / all the way to / straight into / fly into / fall into / get sucked into / get launched to /
wash up at / be delivered to / take you to / lead (straight) to / point to / locate / find / discover / track down / spot / be found at / come out at / pop out at.

**How the swap works** (write all three lines in `plan.md`):
| Original sentence (captions) | Cut before | Clone says | Seam sentence (must read as one sentence) |
|---|---|---|---|
| "...all the way from the Moon until it hit Earth, which would..." | "Earth" | "Veelahs Studio." | "...all the way from the Moon until it hit Vilas Studio." (railgun, the model) |
| "...and the police locate your vehicle." | "your vehicle" | "Veelahs Studio." | "...and the police locate Vilas Studio." (vehicle) |
| (illustrative wording) "...you'd fly over it until you land on the roof." | "on the roof" | "at Veelahs Studio." | "...until you land at Vilas Studio." (the shape of the pole-vault line Noah praised) |
| "...the crew can quickly reel the diver up to the surface." | "the surface" | "Veelahs Studio." | "...quickly reel the diver up to Vilas Studio." (sea lion: the slot v3 MISSED; it cut after "surface" and started a new sentence instead) |
Rules:
- The kept audio ends on the word BEFORE the dropped words (e.g. "...until it hit"). The clone never repeats a word the narrator already said ("hit hit" happened once).
- The dropped words should be the **payoff noun** where possible (the thing the whole story was heading to: Earth, the vehicle, the roof). Replacing the payoff is what makes the viewer feel outplayed.
- The caption after the landing shows the completed chunk in part 1's caption style: e.g. "hit Vilas Studio" / "land at Vilas Studio".
- **Not a slot:** the end of a finished sentence ("...inside your head." -> "Vilas Studio."); an abstract noun with no motion or finding ("filter for what matters to you"); a subject ("Vilas Studio would..."); a list item. These produce the "it doesn't flow" failure.
- One video, one slot. Everything after the slot is dropped (it's never seen, so creator marks there cost nothing).

## 2. The scorecard (score every shortlisted video's best slot; `plan.md`)
| Criterion | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **Slot** (the sentence test, §1) | none | the brand fits grammatically but nothing moves/arrives/is found | a clear destination/target/found thing after a §1 verb | it replaces the story's **payoff noun** (hit Earth, locate your vehicle, land on the roof) |
| **Motion into the slot** (what the picture is doing when the word would be said) | static, nothing to carry | camera drift only | a clear move to continue (fall, launch, throw, dive, a shape to go through) | the object is travelling INTO the camera/target exactly then (the round hitting, the vaulter landing) |
| **Gap** (audio between the last kept word and the dropped word, `envelope.py`) | < 0.05 s (can't cut clean) | 0.05-0.12 s | 0.12-0.2 s | >= 0.2 s |
| **Hook time** (the slot's time) | > 35 s | 25-35 s | 15-25 s | <= 15 s |
| **Payoff before the slot** (has the viewer got the interesting part of the story?) | setup only | half the setup | the setup is complete, the climax is the slot | the climax IS the slot (best) |
**Build when Slot >= 2 AND total >= 10/15. Otherwise skip the video**, however good it is; shortlist more instead (`autopilot.md` §2). Never "rescue" a slotless video with a standalone "Vilas Studio." line.
Worked: railgun "until it hit | Earth" = 3+3+3+1+3 = 13. A pole-vault-style "until you land | on the roof" would score ~ 3+3+2+3+3 = 14. Sea lion "reel the diver up to | the surface" = 2+2+2+3+2 = 11 (usable; v3 cut elsewhere).
Brain "filter for | what matters to you" = 1 (no motion, abstract) -> skip. Brain "supported from every direction inside your head." = 0 -> skip.

## 3. The move: chosen by what is moving at the slot
The move starts on part 1's last kept frame (frame 0 of part 2 is that exact picture) and lands on the first syllable of "Vilas" (`tImp1`, 0.7-1.0 s later). All six are built in
`assets/hype-ending/comp/bridge.js` (`cfg.bridge.type`), ported from the v3 transitions Noah liked; the destination is now the Vilas spectacle, never a website.
| What part 1 shows at the slot | Example | `bridge.type` + params |
|---|---|---|
| Something heading INTO the camera or a target (a projectile, a fall toward the ground, a punch, a car at the lens) | railgun round, meteor | `shatter` (`impact` = where it hits, normalised) or `zoom` (`focus` = the object) |
| A fall or a launch (vertical motion) | vault, skydive, rocket, elevator | `whip` with `dir: "down"` (fall/land) or `"up"` (launch/climb) |
| Fast sideways motion (a throw, a race, a fly-by) | sprint, thrown ball | `whip` with `dir: "left"` or `"right"` = the direction of travel |
| A round shape with a clear rim the camera can go through (hole, pupil, wheel, lens, porthole, planet, plate, crater) | a bite hole, a tunnel mouth | `iris` (`circle` {cx, cy, r}: `python3 -I scripts/measure_circle.py in/last.png`, LOOK at its DEBUG.png) |
| A dark or bright focal point (tunnel, pipe, throat, cave, light, deep water) | falling into a pit | `zoom` (`focus` = the point) |
| A screen, signal, hacking, electricity | a drone feed, a TV | `glitch` |
| A calm held frame with nothing moving (weakest; only if the slot scores 3) | a door, a room | `doors` |
`python3 -I scripts/find_transitions.py video.mp4 --out work/ft` lists shapes/focal points/motion per time and writes `candidates.png`: use it to fill the params at the slot's time, never to choose the cut.
It can't tell a hole from a nose: always look.

## 4. The landing and the funny part (always the Vilas spectacle)
At `tImp1` the clone says "Vilas" and the metal VILAS line ignites with a flash, shock rings, sparks and a lens streak; "Studio" ignites on `tImp2`; then the drop (`tDrop`): lasers on the beat,
the slams (message bank only), the end card "Vilas / .studio" with the honest tagline. Two built styles: `amber` (gold/orange laser show) and `dancers` (purple/blue/red laser stick-figure dancers).
**Never in part 2:** a website, demo site, browser, phone/laptop screen, UI, a "demo" chip, a business name, a real person, a fake review or number.

**More spectacle ideas (the same over-the-top energy, not lasers). SPEC only, not built; build one only when Noah names it** ("do the fireworks one"), by replacing section B of `comp/index.html`
(keep section A, the impacts, the voice timing, the end card), checking stills, and keeping `look: "photoreal"`:
| Idea | Picture | Sound |
|---|---|---|
| Fireworks | the wordmark launches as a shell, bursts into fireworks that spell VILAS over a dark skyline, slams between bursts | launch thumps, crackle, crowd cheer (synth) |
| Stadium jumbotron | a night stadium, VILAS STUDIO on the big screen, flashing crowd phone lights, confetti cannons on the drop | crowd roar, air horn, stadium drum |
| Red carpet | paparazzi flashes on the metal wordmark on a red carpet, velvet ropes, a spotlight sweep | shutter bursts, crowd murmur |
| Neon blackout | everything cuts to black for 0.3 s, a neon VILAS sign buzzes on, flickers, then the whole wall of neon lights up on the drop | power-down, click, electric buzz, hit |
| Drone show | hundreds of light drones assemble VILAS in the night sky, morph into each slam word | soft whoosh swarm, synth pad drop |

## 5. Variety inside a batch
No two videos in a batch share the same `bridge.type` + style; `cfg.music` (`riff` 0-3, `root` -5..+6, `beat` 0.375-0.45) differs on every video (`qa.py sound_variety` checks it).
Alternate `amber` and `dancers`. Two videos with the same move are fine only if the style and music differ and the batch is bigger than the number of usable moves.

## 6. Seen failures (do not repeat)
- 2026-10-12: cut at a shape/pause instead of a sentence slot; a new sentence "Vilas Studio." after a finished line; landed on a scrolling demo website; no voice in the mix (`worked-example-2026-10-12-failures.md`).
- 2026-10-10: a flat flash then lasers after the video's LAST frame ("a clip slapped on top"): the cut must be at the slot, with a move out of part 1's own picture.
- Circle detection scored a nose like a hole: always look at the sheet.
- A whip with the scene's edge not glued to part 1's trailing edge flashes a black gap (fixed in bridge.js).
- An overlay caption drawn on top of part 1's own burned-in caption during the move (two captions on top of each other): the template now shows the overlay caption only from the landing.
