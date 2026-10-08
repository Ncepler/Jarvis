# vehicle — zach-d-reel (part 1: Zack D Films-style "if you forgot where you parked" video, part 2: Vilas laser drop)

Noah's brief (2026-10-08): the last ~2s say "locate your vehicle"; make it locate VILAS STUDIO. Lasers again, more lasers,
dancing stick figures made of lasers, purple/blue/red lasers on a blacker background. Voice recordings as needed. Cover
everything that says Zack D Films. Hype on the last few seconds.

## The ending read
- Story: if you forgot where you parked, your car key would fire an LED beam from the roof, a siren, a drone from the trunk,
  hydraulics, roof flares... "letting you and the police locate your vehicle."
- Last line: "…letting you and the police **locate** | your vehicle." Ending type: **word swap** (the last noun is the thing being located).
- Narrator: young male, fast explainer pace. Captions: white bold sans, dark edge + soft shadow, 1–3 words per chunk,
  baseline at y≈1017 of 1280, "your vehicle" = 302 px wide.
- Hinge candidates: word swap "locate Vilas Studio" (5/5/4/5/5, chosen, and it's what Noah asked for) · arrival (the drone
  escorts you to vilas.studio, 3/3/3/4/5).

## Edits to the original (all asked for by Noah)
| What | Where | How |
|---|---|---|
| Cut before "your vehicle" | video: frames 0–915 kept (caption flips to "your vehicle" at frame 916 = 30.564s); audio: to 30.565s, 30 ms fade | `assemble.py --cut-frame 916 --audio-cut 30.565`. The kept audio ends on "…and the police locate" ("locate" 30.06–30.51s, "your" from 30.60s). |
| "ZACK D FILMS" licence plate + the same print on the opening tailgate | ≈10.8–12.6s (frames 324–377) | hand-tracked rotated box (25 keys, `work/plate_keys.json`), letters removed by grey opening/closing + blur of the letter area; the burned-in caption is protected. Plate reads as a blank plate. |
| The Zack D "D◀" logo on the key fob button | ≈1.9–3.0s (frames 58–91) | same tool, dark glyph on the grey button (14 keys, `work/fob_keys.json`). Button reads as blank. |
Re-encoded: GOP 0–108 (0–3.6s), GOP 274–523 (9.1–17.5s), and the last partial GOP 782–915 (unedited, because the cut isn't on a
keyframe). Everything else (423 frames) is stream-copied and verified bit-identical. Every re-encoded frame matches its source at
≥ 42 dB (RGB, per frame). Original audio re-encoded once (HE-AACv2 upload), SNR 37.4 dB vs the upload.
Full-video rescan: no other creator name/logo. (Toyota/HYBRID badges and the police livery are not creator marks.)

## Part 2 (6.6s, rendered 1080x1920 @ 29.97, scaled to 720x1280)
| t (from cut) | picture | sound |
|---|---|---|
| 0–0.30 | hard cut to near-black; red/blue police-light wash (the original's last shot has police cars); four lock-on lasers converge; a laser map pin drops onto the dim VILAS / STUDIO wordmark; caption "locate" continues in the original's style | siren yelp, lock-on beeps, falling sweep |
| 0.30 | IMPACT 1: pin lands on VILAS, flash, rings, sparks, radial burst; VILAS ignites (purple); caption "Vilas Studio" | boom + zaps; the cloned narrator: "Vee-las Studio!" |
| 0.3–1.5 | the pin pings radar rings ("located") | pings |
| 0.95 | IMPACT 2 on "Studio": STUDIO ignites (blue) | second hit |
| 1.0–1.75 | laser fans build from the bottom corners; three laser stick figures flicker on, crouched; strobe | riser + accelerating snare roll |
| 1.75 | THE DROP: 150 bpm laser show (purple/blue/red, 6 emitters, pattern changes every beat), perspective laser floor, three big laser dancers hit a new pose on every beat (motion trails, beams out of their hands) | kick, claps, hats, supersaw stabs, sub |
| 1.75 / 2.15 / 2.55 / 2.95 / 3.75 | slams: WEBSITES / THAT LOOK / EXPENSIVE. / IT WASN'T. (glitch) / FROM $300 ($300 in red) | a laser zap per slam |
| 4.55–6.6 | end card "Vilas" + ".studio", red/blue laser underline, tagline "websites that look expensive. / they weren't."; four laser dancers keep dancing under it | the beat keeps going |
| 6.15 | FINAL HIT: all dancers snap to arms-up V, hand lasers fire, flash | boom, kick, chord tail to the end |
Voice: Higgsfield `seed_audio` cloned from the first 20s of narration; take "Veelas Studio!" (spelled so it's said VEE-las),
speech_rate 10, 3 takes generated (0.6 credits, 3.26 → 2.66), atempo 1.08. Clone pitch p10/50/90 95/124/291 Hz vs narrator 105/158/296 Hz.
Voice over everything else (300–4000 Hz): 11.2 / 10.7 / 10.9 dB. Master −10.6 LUFS (original tail −12.1 integrated).
Claims: tagline + "from $300" (message bank). No other claims.

## Rebuild
`work/ending/` = the hype template with this reel's `cfg.json`, `comp/index.html` (pin + laser dancers + purple/blue/red palette)
and `audio.py`. `node render.mjs video part2_1080.mp4`, `python3 audio.py -10.6`, then
`python3 ../../.claude/skills/zach-d-reel/scripts/assemble.py --orig in/upload.mp4 --part2 ending/part2_1080.mp4 --audio2 ending/audio.wav --cut-frame 916 --audio-cut 30.565 --replace 0:108:seg1c --replace 274:523:seg2c --crf 10 --out final.mp4`
(seg1c/seg2c from `scripts/examples/erase_letters.py` with the two keys files).

## Not verified (nobody here can hear)
- That the clone says "VEE-las" (spelled "Veelas" to push it) and sounds like the narrator.
- The mix by ear. Numbers above are measured only.
