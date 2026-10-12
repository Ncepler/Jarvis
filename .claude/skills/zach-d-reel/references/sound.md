# Sound: the narrator's voice, the hits on the words, a drop that differs per video, clean licences  (v4)

## 1. Layers (all made by the template's `audio.py`, all on one timeline with the picture: `cfg.json`)
| Layer | What | Notes |
|---|---|---|
| **The move** (0 .. `tImp1`) | a rising whoosh + riser, plus a texture for the move (shatter: glass crackle; glitch: zaps; iris: pop; doors: ding) | no hit on frame 0: the picture is still part 1's |
| **The landing** (`tImp1`, `tImp2`) | a boom + kick + laser zaps on each brand word | this is the `qa.py audio_hit` (30-80 Hz) |
| **The voice** | the narrator's clone saying the completion words ("Veelahs Studio") | REQUIRED; >= 7 dB over everything else in 300-4000 Hz; effects and drums duck under it until just before the drop |
| **The drop** (`tDrop` .. `tEnd`) | kick/clap/hats, supersaw stabs and sub bass on `beat`, a zap on every slam, a glitch stutter on IT WASN'T | `cfg.music`: `riff` 0-3 and `root` -5..+6 semitones pick and transpose the riff; `beat` 0.375-0.45 s |
| **End card** | a big hit, a chord swell, a laser chord tail to the last frame | `qa.py dead_air` wants no silence at the end |
Everything is synthesized (numpy): nothing sampled, nothing licensed, nothing commercial. Optional extra SFX: `scripts/fetch_sound.py` copies 19 Pixabay-licensed recordings (from the `hyperframes` npm tarball; HyperFrames itself is not used); write any file you add into `sound_ledger.json` with its licence.

## 2. Variety (Noah, 2026-10-10: "the sound on the Vilas part is exactly the same every time")
Every video in a batch gets a different `cfg.music` (riff/root) and, where possible, a different move and style. `audio.py` writes `sound_ledger.json`; `qa.py --ledger mine.json --others theirs.json ...` fails a repeat.

## 3. Music in the Instagram editor (reel-lab's rule)
@vilaswebdesign is a **Business** account: only the Meta Sound Collection may be added in the app, and nothing commercial is ever baked into the MP4. Write a cue sheet per video (`music_cue.md`):
```
MUSIC CUE  <video>   account: Business -> Meta Sound Collection
  optional: the file already has its own drop; add a Sound Collection track only under the original part, at low volume, or not at all
  if added: search "electronic hype" / "cinematic hit"; the track's downbeat must land on <cut> + <tDrop> s; keep our audio on top
```

## 4. Mix rules
- Part 2 within +-3 LU of the original's tail (`watch.sh` writes `loudness_tail.txt`; `python3 audio.py <LUFS>`); true peak under -1 dBFS.
- Voice >= 7 dB over everything else on all thirds of the line (`audio.py` prints it); if not, move `tDrop` later or shorten the line.
- `qa.py voice_in_mix` must find the voice in the final at the landing.
- You can't hear any of it: report the numbers that passed and what Noah should listen for (the clone's "VEE-lahs", whether the landing hit and the drop feel big).
