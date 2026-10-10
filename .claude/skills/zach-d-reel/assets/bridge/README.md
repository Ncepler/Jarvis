# bridge template: a real transition out of part 1, then real Vilas site footage

The opposite of the laser template. Part 1's last frame is drawn first, then **transforms** into the Vilas site (zoom-through, iris, whip, shatter, doors, glitch),
so there is no "clip slapped on top". Part 2 is real footage of the Vilas demo sites (`../vilas-site/*.mp4`), captions in part 1's caption style, a seeded music bed,
real recorded SFX matched to the transition, and a bone end card. Full method: `../../references/transitions.md`; sound: `../../references/sound.md`.

Prepare + build (from the skill folder):
```
bash scripts/prep_bridge.sh <orig.mp4> <cut frame N> assets/vilas-site/<demo>.mp4 <workdir>      # last frame = N-1, site frames, sfx, template copy
python3 -I scripts/measure_circle.py <workdir>/in/last.png                                       # iris only; LOOK at DEBUG.png
cd <workdir> && $EDITOR cfg.json && python3 audio.py <LUFS of the original's tail> && node render.mjs stills 0,6,12,20,40,150 && node render.mjs video part2_1080.mp4
python3 -I scripts/assemble.py --orig <orig.mp4> --part2 <workdir>/part2_1080.mp4 --audio2 <workdir>/audio.wav --cut-frame N --audio-cut <SEC in the narrator's silence> --crf 12 --out final.mp4
python3 -I scripts/qa.py final.mp4 --cut <seam sec> --mode bridge --transition-dur <cfg dur> --max-part2 7 --voice-file voice.wav   (or --no-voice-reason "...")
```
cfg.json: `fps` = the original's fps; `duration` = tEnd + ~1.6 s; `transition.type` zoom|iris|whip|shatter|doors|glitch, `dur` 0.8-1.0 (shatter 1.2);
`focus` (zoom dive point), `circle` (iris, normalised; r relative to width), `dir` (whip), `impact` (shatter); `site.count` = frames in in/site;
`siteLabel` = the honest "demo" chip; `lines` = captions (times from the voice's word starts via scripts/envelope.py, else a ~0.5 s/word cadence), brand FIRST;
`captionStyle` = part 1's caption font size and weight; `y` 1085 puts it centred in the ink caption panel (bottom 25% of the frame, slides up at landing; the demo chip is drawn in it too, so nothing fights the site's own text); `sound` = mood + seed (+ optional bpm/root); `voice` = {file, at, trimStart, onsetInClip}.
Frame 0 of part 2 IS part 1's last frame (no pop); the sound lands at `transition.dur`. Everything in `in/`, `sfx/` and `cfg.json` is per video; the template files are not edited.
