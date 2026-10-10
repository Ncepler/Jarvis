# Sound: real SFX, a bed that is different every time, the narrator's voice, and clean licences

2026-10-10, Noah: "the sound on the Vilas part is exactly the same every time" (measured: the two reels' Vilas sound beds matched at 0.999 spectral similarity: one fixed synthesised riff,
one fixed set of hits). "See if there's a sound library... it finds, downloads, and uses a sound, an appropriate sound that matches the beats or the mood." This file is that system.

## 1. Three layers
| Layer | Source | Who adds it |
|---|---|---|
| **SFX on the transition and the landing** (whoosh, riser, impact, ding, glitch, pop, shatter) | **real recordings** from the bundled library (section 2), chosen per transition; synth stand-ins when a file is missing | `assets/bridge/audio.py` |
| **Music bed under the site footage** | **generated per video** from `sound.mood` + `sound.seed` (key, tempo, scale, instruments, drum pattern all vary), so no two videos sound alike | `audio.py`, optionally replaced in the Instagram editor (section 4) |
| **Voice** | the narrator's Higgsfield clone, else the fallback ladder in `voice-clone.md` | `audio.py` mixes it, ducks the rest under it, prints the margin |

## 2. The library (what exists, what was tested)
`python3 -I scripts/fetch_sound.py --dest <work>/sfx` copies **19 real recordings** (Pixabay Content License: commercial use, modification, use inside videos, no attribution; not resellable on their own) into the work folder
and writes `LEDGER.json`. They live in the `hyperframes` npm package's media-use bundle; `fetch_sound.py` finds the cached copy or downloads the package tarball from the npm registry (tested in the cloud session). We use only
the audio files, **not HyperFrames itself** (Noah finds its editing poor). `sfx/manifest.json` lists each file's duration, energy and recommended use.
| Files | Used for |
|---|---|
| `whoosh`, `whoosh-short`, `whoosh-cinematic` | whip, iris, zoom, shatter tails |
| `riser` (10 s, build) | zoom, iris (the last 1 s is used: it peaks at the landing) |
| `impact-bass-1`, `impact-bass-2` | the landing hit (`audio_hit` wants 30-80 Hz here), the end sting |
| `chime`, `sparkle`, `ping`, `notification` | the elevator ding (doors), the landing shimmer, the end card |
| `glitch-1/2/3` | glitch transition |
| `pop`, `click`, `click-soft`, `key-press`, `typing`, `error` | iris pop; spare UI sounds for site-type endings |

More sources, in order of preference (a ledger line is mandatory for anything outside the bundle):
| Provider | Status here | Licence handling |
|---|---|---|
| bundled (above) | **tested, works in the cloud session** | Pixabay Content License |
| Openverse API (`--provider openverse`, CC0 + public-domain filter) | untested here: `api.openverse.org` is blocked in the cloud session | only CC0/PDM are accepted by the script |
| Freesound API v2 (`--provider freesound`, needs `FREESOUND_API_KEY`) | untested here: blocked in the cloud session | script filters to CC0 |
| HeyGen audio catalog (10k+ BGM) via `media-use resolve` | needs the `heygen` CLI signed in; its licence terms were **not verified**: check them before baking any of it into a file | n/a |
| lemo-opuscar `core/audio` (procedural foley `sfx.py`; CC0/CC-BY/OFL instrument samples, 1.4 GB) | installed and audited (MIT); heavy, **not needed**: our synth already does foley | its own `CREDITS` |
Never download a commercial track, a "trending sound", a ripped song or anything without a licence line.

## 3. Mood -> bed
Pick `sound.mood` from the **video's** tone (not Vilas's) and the transition; `seed` is any integer, new for every video (the batch gate refuses the same transition + mood twice).
| Video tone | mood | bpm range | Character |
|---|---|---|---|
| danger, predators, creepy, "what if it goes wrong" | `tense` | 90-100 | sub pulse, clock ticks, bell notes in a minor key |
| awe, nature, space, deep sea, scale | `wonder` | 78-90 | lydian bells, pad, soft shaker |
| weird fact, comedy, surprising, light | `playful` | 108-120 | marimba on a major pentatonic, woodblock/shaker offbeat |
| engineering, speed, vehicles, triumph, power | `epic` | 116-126 | dorian strings stabs, kick/clap/hat drive |
| cozy, food, gentle, satisfying | `calm` | 74-84 | electric piano, soft shaker |
| night, horror, heavy, ominous | `dark` | 84-94 | low pulse, bell, thuds |
The bed starts on the landing (downbeat = the site appears) and ducks under the voice and on the end-card sting. Measured on five builds: key content differs strongly (chroma similarity mostly 0.1-0.65),
tempo and rhythm differ by construction. **Nobody has heard these**: say so in the delivery, and ask Noah to tell you which mood felt wrong.

## 4. Music in the Instagram editor (reel-lab's rule, applied)
Reel-lab: a **Business** account may only use cleared audio (the Meta Sound Collection); a baked-in commercial track is fingerprinted by Meta Rights Manager whether or not it was burned into the file; an unlicensed track
can be posted organically but can never be promoted. So: (1) **ask once per run, default Business** (@vilaswebdesign): never bake commercial music into the MP4. (2) The generated bed + real SFX in the file are safe.
(3) If you want a real song: write a **cue sheet** per video and let Noah add it in the Instagram editor (it stays an audio object, stays swappable):
```
MUSIC CUE  <video>   account: Business -> Meta Sound Collection
  mood: wonder   energy: slow -> medium   enter: 1.0 s into part 2 (the landing)   drop: lands at <cut> + <transition dur> s
  search the Sound Collection for: "ambient piano", "cinematic build", filter Calm/Dramatic; audition three, take the one whose build lands nearest the landing
  keep our SFX; mute the generated bed if the song is added
```
Reel-lab's rules still apply: enter late, cut on the beat, hold on the phrase, never pick a variant by feel (the drop must land where the turn lands).

## 5. Per-transition SFX plan (what `audio.py` does)
| Transition | At 0 s | At the landing (transition dur) | End card |
|---|---|---|---|
| zoom | riser (last second of the 10 s file) + cinematic whoosh | impact-bass-1, sparkle | impact-bass-1 + chime + sparkle |
| iris | whoosh-short, pop (0.05 s), riser (9 s in) | impact-bass-2 (soft) + chime | same |
| whip | whoosh, then whoosh-short at 0.28 s | impact-bass-2 (soft) | same |
| shatter | glass crack (synth) + shatter (synth) + impact-bass-1 at 0.06 s | (the shards are the landing) | same |
| doors | **chime = the ding**, then a low door-slide whoosh (synth) at 0.14 s | impact-bass-1 (soft) | same |
| glitch | glitch-1, glitch-2 at 0.28 s, glitch-3 at 0.52 s | impact-bass-2 | same |
Every real file used is written to `sound_ledger.json` with its licence; synthesised parts are listed as `generated`. Keep the ledger with `plan.md`.

## 6. Mix rules
- Part 2 within +-3 LU of the original's tail (`watch.sh` writes `loudness_tail.txt`; `audio.py <LUFS>`); true peak under -1 dBFS.
- Voice >= 7 dB over everything else in 300-4000 Hz (`audio.py` prints it); the bed ducks 65% under the voice, SFX 70%.
- Never silence at the seam or at the end (`qa.py dead_air`); the end sting rings out to the last frame.
- You can't hear any of it: report the numbers that passed and what to listen for (the clone's "VEE-las", the landing hit, whether the bed mood fits).
