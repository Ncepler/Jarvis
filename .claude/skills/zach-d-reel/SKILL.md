---
name: zach-d-reel
description: Turn Zack D Films-style viral story videos (3D what-ifs, weird facts, physics hypotheticals, true-story animations) into Vilas Studio ads. Noah only has to say "make N videos" (or "make 5 zach d reels", "zach d this", "run the zach d pipeline", or attach a story video): this skill then runs the WHOLE workflow unattended and asks nothing. v3: it picks videos FOR their transition (find_transitions.py + a scorecard), cuts the original at the best transition point so the Vilas hook lands by ~20 s, builds a REAL transition out of part 1's last frame (iris / zoom / whip / shatter / doors / glitch, or the laser drop for some) onto real footage of the Vilas demo sites, uses real licensed SFX plus a mood-driven music bed that differs every video, requires the narrator's cloned voice (never a robot voice), covers every "ZACK D FILMS" mark, proves each video with a QA gate, and sends all N back in chat. Also handles "swap the last word", "cover the watermark", "hype ending", "more lasers", "genius marketing", and bare story-video uploads.
---

# zach-d-reel   (v3, 2026-10-10: transition-first)

Noah uploads (or the skill fetches) **part 1**, a video that already works on its own. You make **part 2**: a *real transition* out of part 1's own picture that lands on Vilas, so the viewer feels outplayed, laughs and saves it.
The format is "the world's most genius marketing strategy". v1-v2 failed because part 2 was a generic ending slapped after the last frame (flash + lasers, robot voice, no voice, the same sound, hook at 31 s). v3 picks the video for its transition,
cuts early at the transition point, and turns part 1's last frame into the Vilas world.

## 0. "make N videos" is the whole order. Read `references/autopilot.md` first.
When the message is a count ("make 5 videos"), a bare request, or just a story-video upload, run **autopilot**: source -> shortlist -> download -> **transition check** -> watermark -> cover marks -> **cut at the transition point** -> build -> sound -> voice -> QA -> deliver,
every decision already made in `references/autopilot.md`. **Don't ask questions; Noah is asleep.** Anything below that says "ask Noah" or "only when Noah asks" is pre-answered there. When Noah *does* give specific instructions, his words win over the defaults.

**The defaults, in one table** (details/configs in `autopilot.md`):
| | Default |
|---|---|
| Picking | **For the transition.** Run `scripts/find_transitions.py`, fill the 5-line scorecard (`references/transitions.md` §2). Score < 8: skip the video. Prefer sources <= 40 s. |
| Hook time | The Vilas hook is on screen by **20 s** (hard limit 24, `qa.py hook_time`). So the original is **cut at the best transition point**, often well before its end. |
| Ending | A **bridge transition** chosen by what the video offers: iris (round shape) / zoom (focal point) / whip (motion) / shatter (impact) / doors (any calm frame) / glitch (tech), onto **real Vilas demo footage**. The **laser drop** for at most 1 video in 3. |
| The seam | Frame 0 of part 2 **is part 1's last kept frame**; it transforms into the site over ~0.9 s with sound on the same frames. Never a hard slap, never footage under a caption band. |
| Voice | **Required.** The narrator's Higgsfield clone saying "Veelas Studio. Websites that look expensive. They weren't."; else preset voice -> Kokoro neural TTS -> (only with a written reason) none. **Never a robot voice.** |
| Sound | **Real licensed SFX** matched to the transition (`scripts/fetch_sound.py`) + a **generated bed whose mood/seed differ per video**; nothing commercial baked in; a music cue sheet for the Instagram editor (`references/sound.md`). |
| Creator marks | **Cover every "ZACK D FILMS" mark** before the cut, found by scanning. |
| TikTok watermark | Remove it with **ffmpeg** (not HyperFrames). |
| Gate | `scripts/qa.py` must print `ALL QA CHECKS PASSED`, **and the stills must read as one move** (v2 passed the old gate and was still bad). |
| Delivery | All N sent in chat with `SendUserFile`, one line each (transition + why this cut point), then the honest block: what couldn't be heard, voice rung, originality risk. |

Read first (once per session): `references/autopilot.md`, `references/transitions.md` (criteria + the catalog of endings), `references/sound.md`, `references/vilas.md` (claims). Then as needed:
`references/reel-lab-notes.md` (hook/send/duh/mute laws, account gate, posting, **the originality risk**), `voice-clone.md`, `editing-the-original.md` (cuts, covering marks, verified re-encode), `hype-ending.md` (the laser template),
`worked-example-sloth-failure.md` (v1 failure with numbers), `worked-example-railgun.md`, `worked-example-vehicle.md`, `teardowns.md`, `environment.md`. Templates: `assets/bridge/` (transitions + site footage), `assets/hype-ending/` (lasers), `assets/vilas-site/` (9 demo clips).

## Rule zero: the original is untouched except for the standing edits
Part 1 goes out as uploaded. **Standing edits** (approved for every job): (1) remove the TikTok watermark; (2) cover the creator's marks; (3) **trim the tail at the chosen transition point** (new in v3: keep frames 0..N-1 and the audio up to the cut);
(4) cut at a word and put the brand in the narrator's voice (word swap); (5) remove a doubled word at the seam. Each is done with the protocol in `editing-the-original.md`: only the GOPs containing an edit are re-encoded, everything else is stream-copied, and `scripts/assemble.py` proves it.
**Never**, unless Noah explicitly asks in this conversation: speed up/slow down, crop, reframe, zoom, flip, upscale/downscale; recolour/grade/sharpen/denoise/stabilise; mute/duck/re-voice/add music under it/change its volume;
cover its **burned-in captions**; add anything on top of it (no text, stickers, bands); extend or freeze it (the transition starts from its last frame but is part 2).
Default is stream-copy: its soundtrack is re-encoded once at 320k because TikTok/IG downloads use HE-AACv2 (the sound is unchanged; the script checks). Scan for creator marks over the whole *kept* video (railgun: a mark on an object was missed; sloth: a mark on a dung pile shipped).
**Rights/originality:** say once, in the delivery, what `reel-lab-notes.md` §4 says. Don't stop for it.

## The workflow (per video)
### 1. Watch it (you can't play video, so do this)
`bash scripts/watch.sh <upload> <workdir>/watch` (contact sheets at 2 fps, last frames, hard cuts, loudness). Look at **every** sheet. Read the burned-in captions to get the script. For exact timing use
`bash scripts/strip.sh <video> <start> <dur> <fps> <out.png>` and `python3 scripts/envelope.py <video> <t0> <t1>` (10 ms audio levels). No speech-to-text in the cloud session (Whisper is blocked): with no captions you have the story from the picture only; never guess dialogue.

### 2. Find and score the transition (this decides whether the video is used)
`python3 -I scripts/find_transitions.py <video> --out <work>/ft --max-t 24`, **look at `candidates.png`**, score the scorecard (`transitions.md` §2). Decide: cut time T (narrator silent, story paid off, hook <= 20 s), transition type, mood, demo footage (colour match, `transitions.md` §6).
Write the ending read in `plan.md`: story in one line; last kept words; the last kept frame; narrator pace/tone; caption style (measure px height and baseline on a frame); audio tail loudness; creator marks; the scorecard.

### 3. Build part 2: a real transition onto real footage
`assets/bridge` per `references/transitions.md` and `autopilot.md` §5: `prep_bridge.sh` -> cfg -> `audio.py` -> stills (**look at them**) -> video. The laser drop (`assets/hype-ending`, `hype-ending.md`) for <= 1 in 3.
Laws: (1) frame 0 of part 2 is part 1's last kept frame; (2) one move of 0.8-1.2 s, and it's **heard** (30-80 Hz hit at the landing); (3) real Vilas footage after it, labelled as a demo; (4) brand on screen and spoken within ~1 s of landing; (5) **no wink, no sales-speak, no invented claims**: lines come from the message bank;
(6) never say a word twice across the seam; (7) no dead air, the end card holds >= 1.4 s with its sting; (8) never fabricate a screenshot, review or client; (9) render at the original's aspect ratio and **fps**; never upscale the original.
**Voice:** the ladder in `autopilot.md` §6. **Sound:** `sound.md`.

### 4. Assemble
```
python3 -I scripts/assemble.py --orig upload.mp4 --part2 part2.mp4 --audio2 part2.wav --out final.mp4 --crf 12 \
        --cut-frame N --audio-cut SEC            # keep frames 0..N-1 and the audio up to SEC (the trim/transition point)
        [--replace S:E:DIR ...]                  # GOPs with covered marks (frames from `scripts/gop.py extract`)
```
Stream-copies every untouched frame and verifies them bit-identical, re-encodes only the edited GOPs, proves each decodes to its source, checks part 2 as joined and the original audio's SNR. Prints `ALL CHECKS PASSED` or `FAIL`; don't ship on FAIL.

### 5. QA (all must pass; two fix attempts, then label the failure)
- [ ] `python3 -I scripts/qa.py final.mp4 --cut SEC --mode bridge --transition-dur D --max-part2 7 --voice-file voice.wav [--ledger ... --others ...]` -> **ALL QA CHECKS PASSED** (`transition`, `hook_time`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`, `sound_variety`). Laser template: `--mode hard`. Calibrated 2026-10-10: the railgun and vehicle reels pass every check except `hook_time` (hooks at 33 s and 31 s predate the 20 s rule); the two v2 autopilot reels FAIL `hook_time` and `voice` (the old gate passed them); the v3 shark rebuild passes all.
- [ ] `assemble.py` ALL CHECKS PASSED; changed ranges equal the edit list.
- [ ] **Look at the seam** (`strip.sh` +-2 s at 6-10 fps): one move, no pop at frame 0, no black gap, captions legible over the site, the chip says demo. Read the sentence across the seam as text.
- [ ] **Every covered mark:** `compare_cover.py` before/after, 4x zoom, then re-scan the kept video for any creator name.
- [ ] Every line/claim is in the message bank; the voice margin >= 7 dB; the duh test and the send test (`reel-lab-notes.md`) are written in `plan.md`.
- [ ] **Cold-watch test:** contact-sheet the whole video as a stranger. Does the transition read as the story *turning into* the ad? If it reads as "a clip slapped on top", change the transition or the cut point before polishing anything.

### 6. Deliver
- `final.mp4`, `plan.md` (ending read, scorecard, edit list, cfg, QA output), `caption.txt`, `music_cue.md`, `sound_ledger.json`, `results.md` stub.
- **The caption is about Vilas** (reel-lab shape): a first line that extends the hook (it's the only line before "more"), 1-3 plain sentences using only message-bank claims, **one CTA as a send/comment prompt** ("Send this to the friend who still has a 2009 website"), the link line "See the work and start a project at vilas.studio.", **<= 5 hashtags** (#webdesign #smallbusiness #localbusiness #websitedesign). No emoji, no #longisland. Credit the creator only if Noah asks. Suggest a pinned comment.
- `SendUserFile` caps at 30 MiB: bigger -> a crf-21 preview from the scratchpad and say where the full file is.
- Tell Noah, per video: the transition and why this cut point, the hook time, the voice rung, what was edited (trim point, marks with tier, watermark method). Then once: what you couldn't hear; any rung below the clone or any voiceless build and why; the originality/rights risk; any fallback. Use Trial Reels for a transition type the account hasn't posted.

## When the upload is unusual (autopilot never asks: decide)
- **No narration, music only:** no clone possible: use the ladder from rung 3 (Kokoro) or `--no-voice-reason`; the bed + SFX carry; trim at a visual beat.
- **Not in English:** the voice line is the brand + tagline in English; proceed.
- **Real people on camera, or tragedy/death as the subject:** skip and replace. Cartoon slapstick is fine.
- **Horizontal or square:** keep the original's aspect ratio; the templates are 9:16 (change `W`, `H`, `CX` and the canvas in `comp/index.html`).
- **It already ends on a brand or logo:** cut before it.
- **A mark you can't cover cleanly:** the tiers in `autopilot.md` §4.3; name the tier. Or choose a cut that drops that stretch.

---

## Appendix: the old long-form spoken ad (ONLY when Noah explicitly asks, with real captures)
A longer part 2 (hinge -> turn -> offer -> sign-off, 6-15 s) needs real vilas.studio captures (now `assets/vilas-site/`) and the narrator's voice. Never an autopilot fallback.
Hinge types: **word swap** ("until it hit Earth" -> "until it hit Vilas Studio" in the narrator's voice), **arrival** ("came out on the other side" -> "...at vilas.studio"), **momentum** (a fall/launch continues into a phone screen),
**shape match** (globe -> Maps globe; hole -> lens), **big number** (swap in the Vilas price), **lesson** ("...never let your website look like 2009"), **unresolved need**, **zoom-out** ("now zoom in"), **question/reveal**.
Many of these are now *transitions* with real pictures: shape match = iris, momentum = whip up/down, zoom-out reversed = zoom. Laws: first words are a connector; brand in the first 2 s; no wink; never say a word twice across the seam;
claims only from the message bank; every number's arithmetic in the plan. Fallback hinge when nothing fits: a deadpan non-sequitur only with a strong visual match, and tell Noah (the sloth reel's "Vilas Studio doesn't protect sloths." is what a bad one looks like).
