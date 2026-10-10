# Worked example: "locate your vehicle" (2026-10-08)

Source: a Zack D Films-style "if you forgot where you parked" video (31.6s, 720x1280, **29.97 fps**, HE-AACv2, narrated, burned-in
captions, **BT.709-tagged**). Output: `brag-output-2026-10-08-vehicle/` (`brag.mp4`, 37.2s). Second job after railgun; read
`worked-example-railgun.md` first, this one only adds what was new.

## Brief
"The last ~2 seconds say 'locate your vehicle'. I want this to locate VILAS STUDIO. Lasers again, more lasers, stick figures dancing
but made out of lasers, purple blue red-ish lasers on a blacker background. Get the voice recordings as needed. Make sure everything
that says Zach D Films is covered. Hype as fuck on the last few seconds."

## What worked
- **Word swap on a verb's object:** "…letting you and the police locate | your vehicle" → "…locate Vilas Studio!". Cut frame = the first
  frame whose caption reads "your vehicle" (916). Audio cut in the gap after "locate" (30.565s). Clone says only "Veelas Studio!".
- **Hinge picture from the story's own props:** the last shot has police cars, so part 2 opens on a red/blue police-light wash, lock-on
  lasers, and a laser **map pin** (= "locate") that lands on the wordmark on "Vee-". The pin then pings radar rings.
- **Laser dancers:** stick figures drawn as additive laser tubes, a pose table, one snap per beat, trails and hand beams; three big in
  the drop, four under the end card, all hitting arms-up on a final hit. The beat keeps running under the end card (the "hype last
  seconds"). Saved as a preset: `assets/hype-ending/presets/locate-dancers/` (see `hype-ending.md`).
- **Caption match by measurement:** measured "your vehicle" = 302 px wide, baseline y 1017 on `last_frame.png`, then sized part 2's
  caption font so the same words render 302 px. The "locate" chunk continues across the cut, then "Vilas Studio": no visible seam.

## Creator marks (all on props, none floating)
| Mark | Time | Cover |
|---|---|---|
| "ZACK D FILMS" licence plate, then the same print on the tailgate as it opens, then motion-blurred as the camera whips | 10.8-12.6s (frames 324-377) | `scripts/examples/erase_letters.py`, 25 rotated-box keys (`example_plate_keys.json`) |
| The Zack D "D◀" logo on a key-fob button | 1.9-3.0s (frames 58-91) | same tool, 14 keys (`example_fob_keys.json`) |
A Toyota badge, a HYBRID badge and police livery are not creator marks; leave them.

## Mistakes to not repeat
1. **Brightness-threshold detection of the plate was useless** across blur and lighting changes. Hand-key rotated boxes from gridded
   crops (`scripts/grid.py`), every 2-4 frames, more often where the camera whips (the plate jumped 90 px in 2 frames at 350→352).
2. **First boxes were placed by eye from small crops and sat left of the letters.** Always check with before/after sheets
   (`scripts/compare_cover.py`) at ≥1x; widen or re-angle where letters survive. 3 rounds were needed.
3. **The plate's letters flip polarity when blurred** (light-on-dark, then dark smears on light). One filter (`min()` / opening only)
   missed half the range. The tool now does opening then closing.
4. **The cover box overlapped the video's own caption** at 374 and ate "from your". The tool now protects pure-white caption pixels.
5. **Colour shift on re-encoded GOPs** (BT.709 upload, BT.601 re-encode): ~5 levels, would flicker at GOP edges. Fixed in `assemble.py`.
6. **`assemble.py`'s PSNR check falsely FAILED** (23 dB on correct frames: the ffmpeg psnr filter pairs by timestamp). Verified frame by
   frame in Python instead; the script now does that.
7. **Moving voice takes as base64 is expensive**: three full takes would have been ~85 KB of text to retype. Pick the take remotely
   (envelope in the workbench), trim it there, bring back only that (~11 KB at opus 40k).
8. **SendUserFile has a 30 MiB limit**: the 42 MB master bounced. Send a crf-21 preview (~19 MB) and point to the full file in the repo.

## Numbers
Edited: GOP 0-108 and 274-523; recut 782-915 (non-keyframe cut). 423 frames bit-identical. Re-encoded frames ≥ 42 dB RGB vs source.
Part 2 6.6s, joined at ≥ 34 dB (laser lines are hard to compress; use `--crf 10`). Voice margin 11.2/10.7/10.9 dB. Master −10.6 LUFS.
Higgsfield: 0.6 credits (3 takes), 3.26 → 2.66.
