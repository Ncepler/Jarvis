# Editing the original (only what Noah asks for)

SKILL.md's Rule zero stands: the upload is untouched unless Noah asks. This is how to do the edits he asks for with the smallest
possible footprint. Everything here was done and verified on the railgun reel (see `worked-example-railgun.md`).

Edits Noah has asked for so far (2026-10-07, railgun):
1. **Cut at a word and swap in the brand** ("until it hit Earth" → "until it hit Vilas Studio", same narrator voice).
2. **Cover the creator's title** drifting over space ("black with stars over it … make it look like the background").
3. **Cover the creator's logo printed on an object** ("cover that up neatly").
4. **Fix a doubled word** at the seam ("until it hit hit Vilas Studio": take out one "hit").
His standing wording: "change nothing else about the original video." So: do exactly the listed edits, nothing adjacent.

## Protocol
1. **Write the edit list first** (what, where in time, how) in `plan.md`, and send Noah the one-line version if anything is ambiguous.
2. **Scan the WHOLE video for the creator's marks before the first delivery.** On railgun the title card was found and covered,
   and Noah had to point out a second mark printed on the bullet at 22s. Check every contact sheet (use `strip.sh` at 4-6 fps
   over the full length, cropped to where marks have appeared) for any creator name, logo, handle or watermark, list all of them
   with times, and cover the lot or ask. Don't cover marks nobody asked about: **flag them and offer** (Rule zero).
3. **Re-encode only the GOPs that contain an edit.** `gop.py extract` returns the GOP-aligned range and its frames; `assemble.py`
   re-encodes only those, stream-copies everything else, and proves it (frames outside the edits are bit-identical; re-encoded
   ranges decode to their sources at >= 38 dB PSNR, normally 50+).
4. **Report exactly what changed** in one line when delivering ("0-8.75s and 20.4-25.8s were re-encoded to cover the title;
   everything else is identical to your upload").

## Cutting at a word
- **Find the video cut:** `strip.sh <v> <t0> <dur> 24 out.png` around the word. The cut frame N is the first frame whose caption
  shows the word you are dropping (frames 0..N-1 are kept). Railgun: caption flipped "until it" → "hit Earth" at frame 796 (33.1667s).
- **Is N a keyframe?** `gop.py keyframes`. If yes the cut is a pure stream copy. If not, `assemble.py` re-encodes only the last
  partial GOP, unedited (railgun's test cut at frame 750: 51 frames re-encoded at 51.7 dB). Never cut with `-ss/-t` copy by hand.
- **Find the audio cut separately, in a silence between words:** `envelope.py <v> t0 t1` (10 ms RMS + zero crossings). Words are
  loud (RMS 8-14k), gaps are 1-4k. Cut in the gap *after the last word you keep and before the first word you drop*, 30 ms
  fade-out (assemble.py does it with `--audio-cut`). Captions don't line up with the speech: here the audio cut (33.42s) was
  0.25s after the video cut (33.1667s), because the narrator's "hit" (kept) ended 33.32s and "Earth" began 33.52s.
- **Never repeat a word the kept audio already says.** The first version had the clone say "hit Vilas Studio" after the original's
  "…until it hit", giving "hit hit". Write down, from the envelope, the exact words the kept audio ends on, and generate only the
  *replacement* words ("Vilas Studio"). The on-screen caption can still read "hit Vilas Studio" for the first second, because the
  viewer is reading the original's last word as well.
- **Land the brand on the picture's impact:** the clone's first syllable goes on the hit frame (`voice.onsetInClip` + `voice.landsOn`
  in `cfg.json`), and the second word on the second hit.

## Covering the creator's marks ("make it look like the background", "neatly")
Don't put a black box on it. Rebuild what's behind it. Pick by type:

| Mark | Method | Worked example |
|---|---|---|
| **Title floating over a flat background** (space, sky) | Key the title by its colour, fill with a smooth estimate of the surrounding background, add the scene's own particles/stars, never paint over other bright elements | `scripts/examples/key_title_to_space.py` (blue "ZACK D FILMS" over space, 5.3-8.7s; about 1 s per frame) |
| **Logo printed on a shaded surface** | Track the logo's box by hand (a box every ~3 frames from gridded crops), rebuild the box from a robust polynomial fit of the non-letter pixels so the surface's gradient continues, add a touch of grain | `scripts/examples/fill_logo_on_surface.py` (grey print on a silver rod, 21.4-22.3s) |
| **Letters printed on a plate / button** (light-on-dark or dark-on-light, moving, motion-blurred) | Hand-tracked ROTATED box (cx, cy, w, h, angle, open_px, close_px) every 2-4 frames; grey opening removes bright strokes, closing removes dark strokes, the letter area is blurred, the video's own burned-in caption is protected. Oversized boxes are safe (it only removes thin strokes). | `scripts/examples/erase_letters.py` + `example_plate_keys.json` (vehicle reel 2026-10-08: "ZACK D FILMS" plate 10.8-12.6s; the D◀ logo on a key fob 1.9-3.0s) |
| **Static corner watermark** | Same surface-fill method with one constant box, or ffmpeg `delogo` for a small flat mark. Untested here: look at the result frame by frame | none yet |

Lessons that cost time:
- **Colour tags (vehicle reel, 2026-10-08):** a BT.709-tagged upload re-encoded from PNGs with ffmpeg's default (BT.601, untagged) shifts
  the edited GOPs ~5 levels against the copied ones (a flicker at the GOP edges). `assemble.py` now encodes edited GOPs and part 2 with
  the original's matrix, range and tags. Its checks now compare frames by decode index in Python: ffmpeg's psnr filter pairs frames by
  timestamp and reported 23 dB "mismatches" on correct frames of a phone upload.
- **Look for marks the creator printed on props, not just overlays:** the vehicle reel had none floating; they were on the licence plate,
  the opening tailgate and a key-fob button.
- **Motion blur flips the look of printed text:** the same plate read as light letters on dark, then (blurred) as dark strokes on light.
- **Look at every changed frame, zoomed.** Contact sheets at 4x zoom caught: a dark-olive chromatic-aberration copy offset down-right
  of the letters, motion-blurred edges, thin slivers of letters sliding in at the top edge, and the teal gravity rings (which must survive).
- **Auto-detection of a printed logo failed** on the darker, blurred frames (the mask came back empty). Hand-tracked boxes were reliable and quick. Time-box auto-detect.
- **Fill with a fit of the non-letter pixels, not a blur of everything**: blurring dragged the logo's own darkness back in.
- **Edges:** when the mark runs off the frame, make the replaced box flush to the frame edge and feather with `mode='nearest'`.
- **Process in parallel:** run several frame ranges at once (4 cores); title keying measured about 1 s per frame, so a 210-frame GOP is a few minutes on one core.
- **Output frames must keep the original's numbering** (`f%04d.png` = absolute frame number) so `assemble.py --replace S:E:DIR` works.

## Commands
```
python3 scripts/gop.py keyframes upload.mp4
python3 scripts/gop.py extract upload.mp4 515 530 work/seg2          # prints "489 618": the GOP-aligned range, frames written
python3 scripts/examples/fill_logo_on_surface.py work/seg2 work/seg2c 489 618 keys.json
python3 scripts/assemble.py --orig upload.mp4 --part2 part2.mp4 --audio2 audio.wav --cut-frame 796 --audio-cut 33.42 \
        --replace 0:209:work/seg1c --replace 489:618:work/seg2c --out final.mp4
```
`assemble.py` prints `ORIGINAL FRAMES: n of N stream-copied and bit-identical`, the PSNR of each re-encoded range, the PSNR of
part 2 as joined, the original audio's SNR (30 dB typical; the audio is re-encoded once because TikTok/IG uploads are HE-AACv2),
and `ALL CHECKS PASSED`, else `FAIL` with the reason. Don't ship on FAIL.
