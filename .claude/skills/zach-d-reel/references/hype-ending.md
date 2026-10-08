# Hype ending (when Noah says "hype as hell", "lasers", "~5 seconds")

Noah's length wins over the default 6-15s: for railgun he asked for about 5 seconds of promo and got 5.85s. A hype ending is
**one idea, big and fast**: the story's last object smashes into the brand name, the name explodes into a laser show, three or four words slam in on the
beat, end card. Everything it says comes from the message bank in `vilas.md` ("websites that look expensive. they weren't." /
"from $300"), nothing invented, no stats.

## The timeline that worked (railgun, 5.85s at 24 fps, t = 0 at the cut)
| t | Picture | Sound |
|---|---|---|
| 0-0.66 | The story's last object falls onto a dim wordmark; red lock-on lasers converge; caption in the ORIGINAL's style | falling whistle + whoosh |
| 0.66 | **Impact 1** on the voice's first syllable ("Vi-"): flash, shock rings, sparks, radial laser burst, VILAS ignites, screen shake | boom + kick + zaps; the clone says "Vilas" |
| 1.17 | **Impact 2** on "Studio": STUDIO ignites | second hit |
| 1.2-1.8 | laser fans build from the bottom corners, strobe | riser, snare roll that accelerates |
| 1.80 | **The drop**: laser show locked to a 150 bpm beat (0.4 s) | kick, claps, hats, supersaw stabs, sub |
| 1.8, 2.2, 2.6, 3.0, 3.6 | one slam word per beat: WEBSITES / THAT LOOK / EXPENSIVE. / IT WASN'T. (glitch) / FROM $300 (price in amber) | a laser zap on every slam |
| 4.2-5.85 | end card: "Vilas" + ".studio", laser underline, the honest tagline; held 1.6 s | end hit, chord tail |

What makes it feel hype, in order of importance:
1. **Picture and sound are one timeline.** Every impact, slam and beat comes from `cfg.json`, which both the renderer and `audio.py`
   read. Never retime one without the other.
2. **Sync the brand word to the visual hit.** The first syllable lands on the frame of the impact (`voice.onsetInClip`).
3. **Escalate, then drop.** Whistle → hit → riser → silence-free snare roll → downbeat. One slam per beat; a flash + shake on every one.
4. **Lasers are additive light.** `globalCompositeOperation: 'lighter'`, four stacked line widths per beam plus a thin hot core, emitters
   off-frame, patterns that change every bar. No solid fills.
5. **Loudness matches the original.** The Zack D uploads sit at about -10 LUFS; `audio.py` masters to -10.5 by default. Use the original's
   `loudness_tail.txt` from `watch.sh`. No gap at the seam.
6. **Voice stays intelligible, and you measure it** (you can't hear it). `audio.py` prints the voice's margin over *everything else* in the
   300-4000 Hz band, in thirds of the line, and flags anything under 7 dB. Duck the effects and the drums under the word, but only until
   just before the drop: the drop's first hit stays full-size even if the last syllable is still ringing.
   Railgun lesson: the delivered mix ducked only the effects, and this check later showed the last syllable of "Studio" sitting just
   0.8 dB above the snare roll. With effects at 0.25 and drums at 0.15 until 30 ms before the drop it reads 9.0 / 22.1 / 10.5 dB.

## Using the template: `assets/hype-ending/`
```
cp -r assets/hype-ending work/ending && cd work/ending && npm i playwright     # or symlink a node_modules that has it
$EDITOR cfg.json                  # times, words, caption, voice (see below)
cp <conditioned clone>.wav voice.wav
python3 audio.py [target_lufs]    # needs numpy scipy pyloudnorm -> audio.wav
node render.mjs stills 2,30,60,90,130   # LOOK at these first (contact sheet them)
node render.mjs video part2_1080.mp4    # 1080x1920; assemble.py scales it to the original's size and fps
```
`cfg.json`: `fps` / `duration` (match the original's fps), `tImp1/tImp2/tDrop/beat/tEnd`, `wordmark` (two lines), `slams` (`text`, `t`,
optional `glitch`, `accent` = the substring coloured amber), `endCard`, `caption` (the original's caption style; null for none), `voice`
(`file`, `trimStart`, `onsetInClip`, `landsOn`).
Fonts are bundled (Space Grotesk, Inter, Space Mono); palette is ink/amber with bone lettering, tying to the Vilas wordmark.

**What is generic and what is not:** the drop, slams, laser show and end card (section B of `renderFrame` and the audio after `tDrop`) work
for any story. Section A (the fall onto the wordmark, `projectile()`, the whistle) is specific to "a round falls into the name". For
another ending, rewrite A so its last frame matches the ORIGINAL's last frame (its object, its motion), then keep B as is. If you
cannot match the last frame, say so and use a plain cut into the drop.
Design units are 720x1280 (9:16). For another aspect ratio, change `W`, `H`, `CX` and the canvas size in `comp/index.html`.

Verified 2026-10-07: rendering the template from a clean copy reproduces the delivered railgun stills byte for byte. The template's audio is the delivered mix plus the improved ducking above (the delivered reel itself still has the weaker last syllable).

## Variant: "locate" + laser dancers (vehicle reel, 2026-10-08)
`brag-output-2026-10-08-vehicle/work/ending/` (gitignored, so the notes are here): Section A replaced by a police-light wash + lock-on
lasers + a laser map pin dropping onto the wordmark (the narrator's last kept word was "locate"); purple/blue/red palette on #020104;
a perspective laser floor; laser stick-figure dancers (pose table + per-beat snap with eo(bp/0.16), knee dip on the downbeat, two
motion-trail ghosts, hand beams) - three big ones in the drop, four on the end card, all snapping to arms-up on a final hit `tFinal`;
the beat runs under the end card. Captions can be a list of chunks (`[{text, until}]`) and their size is calibrated from a measured
width of an original caption (`captionStyle.widthRef/widthPx`). If Noah wants this again, copy that comp into the template as a second preset.
