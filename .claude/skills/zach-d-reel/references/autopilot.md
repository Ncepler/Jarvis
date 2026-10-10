# Autopilot: "make N videos" is a complete order  (v3, 2026-10-10)

Noah types "make 5 videos" (or "make 3 zach d reels", "run the zach d pipeline", "do 5 while I sleep") and nothing else.
That sentence carries everything below. **Do not ask a question. Do not wait for approval.** He is asleep, at school or on a plane. Make the call, write it into `plan.md`, keep going.
The only stop conditions are in section 10.

Anything in SKILL.md that says "ask Noah", "only when Noah asks" or "offer" is **pre-answered here**: the answer is yes, unless this file says otherwise. If a step can't be done, use the fallback written next to it.
**Never fall back to something cheap and ship it silently.** v1 shipped a hollow website box and a robot voice; v2 shipped "a clip slapped on top": a flash and lasers after the video's last frame, no voice, the same sound every time,
the hook at 31 s. (`worked-example-sloth-failure.md`, `transitions.md` section 9.)

## Knobs (the only things Noah may want to flip; everything else is a rule)
```
VOICE_REF_VIA_REPO = true     # cloud session: may push the 20 s narrator reference to a throwaway branch of the public repo so Higgsfield can import it. false = clone only if a direct media_upload works.
CREDIT_BUDGET      = min(balance - 1.0, 0.7 * N)     # Higgsfield credits for the whole run (a take costs ~0.2; balance on 2026-10-10: 2.76)
HOOK_TARGET_S      = 20      # the Vilas hook is on screen by here; HOOK_LIMIT_S = 24 (qa fails above)
PART2_SECONDS      = 6 .. 7
LASER_SHARE        = at most 1 video in 3 uses the laser drop; the rest use a bridge transition
EDITOR             = ffmpeg + Chromium canvas templates + Python. NOT HyperFrames (Noah, 2026-10-10: its results weren't good). Ignore any prompt line that says "use HyperFrames".
```

## 0. The standing orders (what "make N videos" means)
| Question | Standing answer |
|---|---|
| Where do the videos come from? | 1. Videos attached in the chat. 2. TikTok links in the message. 3. Else `https://www.tiktok.com/@zackdfilms92` (section 2). |
| How do I choose? | **For the transition.** Run `find_transitions.py`, score the scorecard (`transitions.md` section 2). A video with no good transition point is skipped. Prefer <= 40 s sources. |
| Where do I cut? | **At the best transition point**, on a finished sentence, after the payoff, so the hook lands by 20 s. Trimming the original's tail is a standing edit. |
| What ending? | A **bridge transition** (iris / zoom / whip / shatter / doors / glitch) chosen by what the video offers, landing on real Vilas demo footage. Laser drop for at most 1 video in 3 (energy/impact stories). |
| Voice? | **Required.** The narrator's own voice via a Higgsfield clone; else the fallback ladder (section 6). Never a robot voice, never silence without a written reason. |
| Sound? | Real recorded SFX (licensed) matched to the transition + a generated bed whose mood/seed differ per video (`sound.md`). Nothing from a commercial track baked in. |
| Cover the creator's marks? | **Yes, all of them**, every video (section 4). |
| Remove the TikTok watermark? | Yes (section 3), with ffmpeg. |
| Change anything else in the original? | **No.** No speed, crop, grade, caption cover or overlay. Rule zero otherwise stands. |
| Account / music rules | Treat @vilaswebdesign as a **Business** account: write a music cue sheet per video; the file contains only cleared/generated sound (`reel-lab-notes.md` section 2). |
| Originality / rights warning | Say it **once**, in the final message (`reel-lab-notes.md` section 4). Don't stop for it. |
| Part 2 length | 6-7 s. Total video ideally <= 30 s. |
| Caption (post text) | Write `caption.txt` (SKILL.md section 6) and a `music_cue.md`. |

## 1. Preflight (10 min, then never again)
1. `TaskCreate` one task per video plus "preflight", "deliver". Update them as you go: Noah reads this list when he wakes up.
2. Tools: `ffmpeg`, `ffprobe`, `node` (+ `playwright` and a Chromium: `ls /opt/pw-browsers`, never `playwright install`), `python3` with `numpy scipy pyloudnorm opencv-python-headless`. Missing: install it. Don't ask.
3. Higgsfield: `balance`. Try a direct `media_upload` of a tiny file to see if uploads work from here (section 6). `list_voices` once if you may need the preset ladder.
4. Browser tools if sourcing from TikTok: read the `chrome-browser` skill first. Open a new tab, don't touch his signed-in tabs.
5. Folders: on Noah's computer `~/Desktop/tiktok-raw/` and `~/Desktop/tiktok-edited/`; in the Jarvis repo `brag-output-YYYY-MM-DD-<slug>/` per video (`brag.mp4`, `brag.jpg`, `plan.md`, `caption.txt`, `music_cue.md`, `sound_ledger.json`, `work/` gitignored). Name files `NN-slug.mp4`.
6. Sound library once per run: `python3 -I scripts/fetch_sound.py --dest <run>/sfx` (copied into each work folder by `prep_bridge.sh`).
7. Site footage: `assets/vilas-site/*.mp4` exist (9 demos, 720x1280, 4 s). If the Jarvis repo is present and the demos changed: `npx next start -p 3100 &` then `node scripts/capture_site.mjs --out assets/vilas-site`.
8. Read `references/vilas.md` (claims), `transitions.md`, `sound.md` once. Skip the worked examples unless something goes wrong.

## 2. Pick the N videos (TikTok profile, no login)
Open the profile. Login wall: **do not log in, do not create an account**: work with what is visible. Profile won't load at all: stop and report exactly what happened (section 10).
1. **Shortlist by hard filters.** Spoken narration all the way through; burned-in captions (the only transcript: no speech-to-text here); a clear payoff; length **25-45 s preferred** (60 s max, and then the transition must be before 22 s);
   not real injury/death/tragedy; not already used (`grep -rl <id> brag-output-*/*plan.md`, `tiktok-raw/`). Skip no-narration, trend/sound posts, real people on camera.
2. **Download the shortlist first** (section 3), because the transition check needs the file.
3. **Run `find_transitions.py` on every shortlisted video and score the scorecard** (`transitions.md` section 2). Keep the top N by score (>= 11/15 first; 8-10 only with a universal transition; < 8 never).
   Break ties toward different transition types so the batch isn't five of the same, and toward earlier hook times.
4. If fewer than N reach 8, shortlist more videos (scroll further). Write the links + scores + chosen cut time into `links.txt`/`plan.md`.

## 3. Download, then verify clean (ffmpeg only)
1. `https://snaptik.app` -> paste the link -> take the **no-watermark** button. Close popups and ads, ignore redirects, click only the download button. Don't download anything except the video.
2. CAPTCHA / Cloudflare / error: **don't try to solve it.** Refresh, wait 30 s, retry up to 3 times. Then another method (another Snaptik button, another downloader, `yt-dlp` if installed).
3. Verify: `ffprobe` (H.264? else transcode ONCE to H.264 crf 12 and treat that as the upload), `bash scripts/strip.sh f.mp4 0 <dur> 1 sheet.png 10` and **look at it** for the TikTok tag (a floating "TikTok @name" that hops between corners).
4. **Watermarked?** Remove it first, with ffmpeg: `delogo=x:y:w:h:enable='between(t,a,b)'` per hop (boxes/times from a 4 fps crop strip of the corners), or an overlay patch sampling the neighbouring pixels. Never crop or zoom the frame. Look at 4x-zoomed frames of every hop; a smear visible at phone size counts as not removed:
   try a second downloader. Record the method in `plan.md`. The cleaned file IS the upload from here on.

## 4. The creator's marks (cover them all, every video)
Every Zack D video prints **"ZACK D FILMS"** (and a "D◀" logo) inside the 3D world: a title drifting over the background, letters on a rock or dung pile, a licence plate, a button, a prop.
1. **Scan the whole video** (the cut will drop the tail, but a mark before the cut must still be covered; marks after the cut can be ignored): `bash scripts/strip.sh upload.mp4 <t> 20 4 scan_<t>.png 8` in 20 s chunks up to the cut. Write each as `start-end s, where in frame, what it's printed on`.
2. Cover **each** with the method in `editing-the-original.md`: keyed fill for titles over flat backgrounds, `fill_logo_on_surface.py` for logos on shaded surfaces, `erase_letters.py` for text on plates/rocks/buttons. Hand-track boxes (a box every 2-4 frames), process in parallel,
   **re-encode only the GOPs that contain a mark** (`gop.py extract`, `assemble.py --replace`).
3. **Time-box 40 minutes per mark.** Past that: ffmpeg `delogo` with the tracked box; then a feathered fill sampled from the surface; last resort a feathered dark patch. Record the tier in `plan.md` and name it in the delivery line.
4. Verify with `scripts/compare_cover.py` on every changed frame and **re-scan the final video** (up to the cut) with the same 20 s strips. Covered only when you've looked at the frames and the letters are gone.
5. Don't cover anything that isn't the creator's name/logo. A burned-in caption is never covered.
   (Tip: choosing a cut that drops a marked stretch is a legitimate shortcut: a mark after the cut costs nothing.)

## 5. Build part 2
**Step A: choose the cut and the transition.** From the finder's sheet and the scorecard: cut time T (a narrator silence), transition type, mood. Find the exact frame: `strip.sh` at 10 fps around T; the first dropped frame is the first one whose caption shows the *next* words;
last kept frame = N-1. Audio cut in the silent gap (`envelope.py`), 30 ms fade. Write the seam as text in `plan.md`.
**Step B (bridge, the default).**
```
bash scripts/prep_bridge.sh upload.mp4 N assets/vilas-site/<demo>.mp4 work/bridge     # demo by colour/mood: transitions.md section 6
python3 -I scripts/measure_circle.py work/bridge/in/last.png                          # iris only; LOOK at DEBUG.png and nudge if needed
cd work/bridge && $EDITOR cfg.json     # fps = original fps; transition; lines (brand FIRST); sound {mood, seed}; siteLabel; captionStyle measured from part 1's captions
python3 audio.py <tail LUFS>           # voice mixed if cfg.voice is set; writes sound_ledger.json
node render.mjs stills 0,4,8,12,16,20,30,150   # LOOK: frame 0 == last.png; the move is readable; captions beat the site's text; chip visible
node render.mjs video part2_1080.mp4
```
**Step B' (laser drop, at most 1 video in 3, for impact/energy videos):** `assets/hype-ending` / `presets/locate-dancers` exactly as in `hype-ending.md` (`opening: "orb"`). Gate with `qa.py --mode hard`.
**Step C: assemble.** `python3 -I scripts/assemble.py --orig upload.mp4 --part2 work/bridge/part2_1080.mp4 --audio2 work/bridge/audio.wav --cut-frame N --audio-cut SEC [--replace S:E:DIR ...] --crf 12 --out final.mp4`.
`--crf 10` for the laser presets (thin lines), `--crf 12` for bridge.

## 6. The voice: clone it; if you can't, climb the ladder; never silence without a written reason
The line (<= 12 words, brand first, `transitions.md` section 7): "Veelas Studio. Websites that look expensive. They weren't." (spell it "Veelas" so it's said VEE-las; add an echo of <= 3 words only if it passes the duh test).
**Ladder (stop at the first rung that passes `qa.py --voice-file`):**
1. **Clone the narrator** (Higgsfield `seed_audio` + `audio_references`, `voice-clone.md`): budget `CREDIT_BUDGET` (3 takes max per video, `get_cost: true` first). Reference = 20 s of narration without music from `upload.mp4`.
   Upload: try a direct `media_upload`; if the cloud proxy blocks it and `VOICE_REF_VIA_REPO` is true, push `ref.mp3` to a **throwaway branch** `tmp-voice-ref-<date>`, `media_import_url` the pinned raw URL, delete the branch. Fetching the result may need the Composio-workbench route (`environment.md`).
2. **Higgsfield preset voice** (`list_voices`, `seed_audio` with `voice_type: preset`): pick the male voice whose register is nearest the narrator's (preview if you can), same line. 0.2 credits per take.
3. **Kokoro neural TTS, offline:** `python3 -I scripts/tts_kokoro.py "<line>" --voice bm_george --out voice.wav` (measured pitch spread 33-40% of the narrator's, vs the old robot's 20%). Closest register: `bm_george`, then `am_michael`/`am_adam`.
4. **No voice**, only after rungs 1-3 genuinely failed: `qa.py --no-voice-reason "<what you tried>"` and say so at the top of the delivery. Noah counts this as a defect to fix, not a feature.
Voice lands at `cfg.voice.at` = the landing (`transition.dur`) + 0.1 s; set `lines[].t` from the voice's word starts (`envelope.py voice.wav`), captions repeat the words. `audio.py` prints the voice margin (>= 7 dB). You can't hear it: say so.

## 7. Word swap vs plain trim
**Word swap** (the narrator's own last word replaced by the brand in his voice) is still allowed when the last kept word names a place/thing, the clone passed, and there's a clean audio gap: `cfg.caption`/`voice` per `editing-the-original.md`.
Otherwise **plain trim at the transition point** (the new default): everything before frame N untouched, the transition takes over from N-1's picture. Never repeat a word across the seam.

## 8. QA gate (every video, no exceptions)
```
python3 -I scripts/qa.py final.mp4 --cut <seam sec> --mode bridge --transition-dur <cfg dur> --max-part2 7 \
    --voice-file work/bridge/voice.wav   (or --no-voice-reason "...")   --ledger work/bridge/sound_ledger.json --others <other videos' sound_ledger.json ...>
```
Must print `ALL QA CHECKS PASSED`: `transition`, `hook_time`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`, `sound_variety`. Plus `assemble.py` ALL CHECKS PASSED, the creator-mark re-scan, the seam strip (`strip.sh` +-2 s at 6 fps), and **a look at your own stills as a stranger** ("does this read as one move, or a clip slapped on top?").
Two fix attempts per video; if it still fails, deliver the best build **labelled as failing check X**, never silently. Passing the gate does not mean it's good (v2 passed the old gate): the stills are the judge.

## 9. Batch rules
- Transition type differs across the batch; laser <= 1 in 3; `sound.mood`/`seed` differ; demo footage differs; hook times all <= 24 s (target 20).
- Do the finder + scorecard for ALL shortlisted videos before building any (the batch should be the N best, not the first N).
- Build in the order of highest score first, so if time runs out the best ones exist.

## 10. When blocked
- TikTok login wall: don't log in; use the visible videos. Profile won't load: stop, write exactly what happened.
- Fewer than N videos reach score 8: deliver what you have, say how many and why, list the near-misses with the transition each lacked.
- Snaptik CAPTCHA/Cloudflare/error: section 3.2. All methods failed for a video: skip it, pick a replacement.
- Nothing works for every video: stop and write down what happened and which links you collected, so Noah can finish in the morning.
- A step takes more than 3x its time-box: use the fallback, record it, keep going.

## 11. Deliver
1. Finals to `~/Desktop/tiktok-edited/NN-slug.mp4` (or `brag-output-*/brag.mp4`). Check each: plays, 9:16, no TikTok watermark, no ZACK D FILMS mark before the cut, the transition as designed.
2. `SendUserFile` every final **in this chat** (<= 30 MiB each; bigger -> a crf-21 preview, say where the full file is).
3. One short line per video: story in 5 words, **transition + why this cut point** ("iris through the bite hole at 18.0 s; hook 18 s"), mood + demo used, voice rung used, and **what you edited** (trim point, marks covered with tier, TikTok-watermark method).
4. Then the honest block, once: (a) **what I couldn't hear** (the clone's "VEE-las", the mix, the mood fit; the numbers that passed); (b) any **voice rung below 1** or **voiceless** and why; (c) the **originality/rights risk** in two lines (`reel-lab-notes.md` section 4);
   (d) anything that fell back and why. No questions.
5. Per video: `plan.md` (ending read, scorecard, edit list, cfg, QA output pasted), `caption.txt`, `music_cue.md`, `sound_ledger.json`, and a `results.md` stub for Noah's numbers. Update `HANDOFF.md` (one paragraph), commit + push repo outputs.
