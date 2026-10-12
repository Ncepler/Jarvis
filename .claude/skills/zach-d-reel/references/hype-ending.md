# The Vilas spectacle template (`assets/hype-ending`): the move in, the brand on the voice, the funny drop

Every reel's part 2 is built with this template (v4). It is **one idea, big and fast**: part 1's last frame physically moves into a dark world where a metal VILAS / STUDIO wordmark waits;
the narrator's clone says "Vilas Studio" and each word ignites on an impact; the drop hits: lasers on the beat, three to five slam words, the end card. Length 5.5-7 s.
Everything it says comes from the message bank in `vilas.md` ("websites that look expensive. they weren't." / "from $300"), nothing invented, no stats. **Never a website.**

## Two styles
| Style | Files | Look |
|---|---|---|
| `amber` | `comp/index.html`, `cfg.json`, `audio.py` | gold/orange/red lasers on ink, metal-bronze wordmark, glossy reflective floor, the railgun's look |
| `dancers` | `presets/locate-dancers/` (`prep_spectacle.sh ... dancers` copies it in) | purple/blue/red lasers, chrome wordmark, a perspective laser floor, laser stick-figure dancers snapping on the beat |
Both share `comp/bridge.js` (the six moves). Alternate them inside a batch.

## The opening: `cfg.opening`
| `opening` | What frame 0 is | Use |
|---|---|---|
| **`"bridge"` (the v4 default, always for new reels)** | **exactly part 1's last kept frame** (`in/last.png`); the move (`cfg.bridge.type`) carries it into the live scene over `tImp1` seconds; impact 1 lands on the voice's "Vee-" | every reel |
| `"round"` | the railgun's tungsten round falls into the name (hard cut) | only to re-render the railgun reel |
| `"pin"` (dancers) | a police-light wash + a laser map pin ("locate") (hard cut) | only to re-render the vehicle reel |
| `"orb"` | legacy hard cut to a new screen with an orb falling in | don't use for new reels (it is the "clip slapped on top" v2 look) |

## cfg for the bridge opening (fill every field; values below are a working example at 30 fps)
```json
{
 "fps": 29.97,                       // = the original's fps (prep_spectacle.sh prints it)
 "duration": 6.2,                    // = tEnd + 1.6..1.8
 "opening": "bridge",
 "bridge": {"type": "zoom", "focus": [0.55, 0.6]},        // or iris {circle:{cx,cy,r}} | whip {dir:left|right|up|down} | shatter {impact:[x,y]} | doors | glitch  (transitions.md §3)
 "tImp1": 0.9,                       // the move's length = the landing = the frame "Vee-" starts (0.7-1.0)
 "tImp2": 1.46,                      // the "Stu-" onset in the voice: tImp1 + (Stu onset - Vee onset)
 "tDrop": 2.0, "beat": 0.4,          // drop >= 0.4 s after tImp2; beat 0.375-0.45 (160-133 bpm)
 "tEnd": 4.4,                        // end card in; slams fit between tDrop and tEnd, one per beat
 "wordmark": ["VILAS", "STUDIO"],
 "slams": [{"t": 2.0, "text": "WEBSITES"}, {"t": 2.4, "text": "THAT LOOK"}, {"t": 2.8, "text": "EXPENSIVE."},
           {"t": 3.2, "text": "IT WASN'T.", "glitch": true}, {"t": 3.8, "text": "FROM $300", "accent": "$300"}],
 "endCard": {"word": "Vilas", "sub": ".studio", "tagline": ["websites that look expensive.", "they weren't."]},
 "caption": {"text": "hit Vilas Studio", "until": 2.0},    // the last kept caption word(s) + the replacement. amber: one chunk; dancers: a list [{text, until}]. Shown from the landing (optional "from")
 "captionStyle": {"px": 46, "y": 1015, "weight": 700, "font": "Inter"},   // amber: MEASURE part 1's caption on in/last.png (font size, baseline y in 720x1280 units). dancers: {widthRef, widthPx, baseline}
 "voice": {"file": "voice.wav", "trimStart": 0.0, "onsetInClip": 0.03, "landsOn": "tImp1"},   // REQUIRED; onsetInClip = where "Vee-" starts in voice.wav
 "music": {"riff": 1, "root": -2},   // riff 0-3, root -5..+6 semitones: different on every video of a batch
 "look": "photoreal"                 // default; never "flat" for a reel
}
```
(JSON has no comments: they are here for explanation only.) The dancers preset also has `tFinal` (the troupe's last hit, ~1.6 s after `tEnd`) and `captionStyle` ({widthRef, widthPx, baseline}: measure an original caption's width); shift every time in its shipped cfg by the same amount when you lengthen `tImp1`.

## Build
```
bash scripts/prep_spectacle.sh upload.mp4 N work/ending amber|dancers
cd work/ending && $EDITOR cfg.json && cp <voice> voice.wav
python3 audio.py <tail LUFS>             # prints "VOICE over everything else (300-4000 Hz, thirds): a / b / c dB": all >= 7, else raise the voice or move tDrop later
node render.mjs stills 0,6,12,18,24,30,45,90,150     # LOOK before rendering the video
node render.mjs video part2_1080.mp4                 # 1080x1920; assemble.py scales it to the original's size
```
What to check on the stills: frame 0 identical to `in/last.png` (no caption drawn on top of it); the move is readable at phone size and continuous; the wordmark is visible inside the scene before the landing;
VILAS ignites exactly at `tImp1`; the caption appears at the landing, not before; no website/UI anywhere; the end card holds >= 1.4 s.

## What makes it work (in order of importance)
1. **The words.** The voice finishes the narrator's sentence (`transitions.md` §1). Without that, the best picture is "a clip slapped on top".
2. **Picture and sound are one timeline.** Every impact, slam and beat comes from `cfg.json`, which both the renderer and `audio.py` read. Never retime one without the other.
3. **The brand word lands on the visual hit.** "Vee-" on `tImp1` (`voice.onsetInClip`), "Stu-" on `tImp2`.
4. **Escalate, then drop.** Move -> hit -> riser -> snare roll -> downbeat. One slam per beat; a flash + shake on every one.
5. **Lasers are additive light** (`lighter`, stacked line widths, a hot core, emitters off-frame, patterns that change every bar).
6. **Photoreal finish** (`look`): the wordmark is an extruded metal object whose reflections drift, a glossy floor mirrors the lasers (amber), dust hangs in the beams, bloom, film grain, anamorphic streaks on impacts.
   It is applied to the Vilas scene only, never to part 1's frame.
7. **Loudness matches the original** (`audio.py <the original's tail LUFS>`), no gap at the seam.
8. **The voice stays intelligible and you measure it** (you can't hear it): >= 7 dB over everything else in 300-4000 Hz in each third of the line; effects and drums duck under it until just before the drop.

## Audio notes
- `audio.py` decodes `voice.wav` with ffmpeg to the 48 kHz mix rate (any format/rate). Before 2026-10-12 it read the wav raw: the vehicle reel's 44.1 kHz clone played 9% fast and ~1.5 semitones high.
- Bridge opening: no hit on frame 0 (the picture is still part 1's); a rising whoosh + riser across the move, a texture per move (shatter: glass crackle; glitch: zaps; iris: pop; doors: ding); the big boom on `tImp1`.
- `cfg.music` picks one of four riffs and transposes it; `audio.py` writes `sound_ledger.json` (transition + riff/root/beat) for `qa.py sound_variety`.

## Building a new spectacle (only when Noah names one: `transitions.md` §4)
Keep section A (the scene the move lands in: dark world + dim metal wordmark + lock-on lasers), the impacts on the voice and the end card. Replace section B (after `tDrop`) with the new show.
Keep `look: "photoreal"`, the message-bank slams and `audio.py`'s timeline (add the new show's sounds at the same cfg times). Render stills and look before the video. Save it as `presets/<name>/` (index.html, cfg.json, audio.py).

Design units are 720x1280 (9:16). For another aspect ratio, change `W`, `H`, `CX` and the canvas size in `comp/index.html` and in `comp/bridge.js`.
Verified 2026-10-12: a test build (zoom bridge, amber, Kokoro voice "Veelahs Studio.") passed every `qa.py` check including `voice_in_mix` (correlation 0.85, voice at the landing +0.01 s).
