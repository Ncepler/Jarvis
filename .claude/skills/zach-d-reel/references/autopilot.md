# Autopilot: "make N videos" is a complete order  (v4, 2026-10-12)

Noah types "make 5 videos" (or "make 3 zach d reels", "run the zach d pipeline", "do 5 while I sleep") and nothing else.
That sentence carries everything below. **Do not ask a question. Do not wait for approval.** Make the call, write it into `plan.md`, keep going. The only stop conditions are in section 10.
Anything in SKILL.md that says "ask Noah" is **pre-answered here**. If a step can't be done, use the fallback written next to it. **Never fall back to something cheap and ship it silently**
(v1: a hollow website box and a robot voice; v2: a flash + lasers slapped after the last frame; v3: a new sentence on a demo website with no voice).

## Knobs (the only things Noah may want to flip; everything else is a rule)
```
DOWNLOADER         = snaptik.app (approved by Noah, the default). Fallbacks in section 3.
VOICE_REF_VIA_REPO = true     # cloud session only: may push the 20 s narrator reference to a throwaway branch so Higgsfield can import it (section 6).
CREDIT_BUDGET      = min(balance - 1.0, 0.7 * N)     # Higgsfield credits for the whole run; AUDIO ONLY (a voice take costs ~0.2)
HOOK_TARGET_S      = 25      # slot time target; HOOK_LIMIT_S = 35 (qa fails above)
PART2_SECONDS      = 5.5 .. 7
STYLES             = amber, dancers (alternate)
EDITOR             = ffmpeg + the Chromium canvas templates + Python. NOT HyperFrames (Noah, 2026-10-10: its editing results weren't good), even if it is installed.
HIGGSFIELD         = audio only (voice clone / preset voice). Never Higgsfield images or video.
```

## 0. The standing orders
| Question | Standing answer |
|---|---|
| Where do the videos come from? | 1. Videos attached in the chat. 2. TikTok links in the message. 3. Else `https://www.tiktok.com/@zackdfilms92` (section 2). |
| How do I download? | **snaptik.app** (section 3). It is approved and expected; use it without asking. |
| How do I choose? | **For the sentence slot** (`transitions.md` §1-2). Slot >= 2 and total >= 10/15, else skip. |
| Where do I cut? | Immediately before the slot's dropped words (the narrator stops mid-sentence; his clone finishes it with "Vilas Studio"). |
| What ending? | `assets/hype-ending` with `"opening": "bridge"`: part 1's last frame moves (zoom/iris/whip/shatter/doors/glitch) into the Vilas spectacle, then the drop. Never a website. |
| Voice? | **Required.** The narrator's Higgsfield clone says the completion words, spelled "Veelahs Studio" (section 6). |
| Sound? | The template's synthesized hits + drop, `cfg.music` different per video, the voice on top. Nothing commercial baked in. |
| Cover the creator's marks? | **Yes, all of them before the cut**, every video (section 4). |
| Remove the TikTok watermark? | Yes if the download has one (section 3), with ffmpeg. |
| Change anything else in the original? | **No.** Rule zero (SKILL.md). |
| Account / music rules | @vilaswebdesign is a **Business** account: a music cue sheet per video; the file contains only generated sound (`reel-lab-notes.md` §2). |
| Originality / rights warning | Say it **once**, in the final message (`reel-lab-notes.md` §4). Don't stop for it. |
| Post caption | `caption.txt` (SKILL.md §6) and `music_cue.md`. |

## 1. Preflight (10 min, then never again)
1. `TaskCreate` one task per video plus "preflight", "deliver". Update them as you go: Noah reads this list when he wakes up.
2. Tools: `ffmpeg`, `ffprobe`, `node` (+ `playwright` and a Chromium: `ls /opt/pw-browsers` or the local install; never `playwright install` in the cloud session), `python3` with `numpy scipy pyloudnorm opencv-python-headless`. Missing: install it. Don't ask.
3. Higgsfield: `balance`. Try a direct `media_upload` of a tiny file to see whether uploads work from here (section 6).
4. Browser tools for TikTok/Snaptik: read the `chrome-browser` (or `built-in-browser`) skill first. Open a new tab, don't touch his signed-in tabs.
5. Folders: on Noah's computer `~/Desktop/tiktok-raw/` (downloads) and `~/Desktop/tiktok-edited/` (finals); in the Jarvis repo `brag-output-YYYY-MM-DD-<slug>/` per video (`brag.mp4`, `brag.jpg`, `plan.md`, `caption.txt`, `music_cue.md`, `sound_ledger.json`, `work/` gitignored). Name files `NN-slug.mp4`.
6. Read `transitions.md`, `voice-clone.md`, `hype-ending.md`, `vilas.md` once.

## 2. Pick the N videos
Open the profile (no login: if a login wall appears, **do not log in, do not create an account**; work with what is visible).
1. **Shortlist 2N-3N by hard filters:** spoken narration all the way through; burned-in captions (you need the words); a clear story; 20-60 s; not real injury/death/tragedy; no real people on camera; not already used
   (`grep -rl <video id> brag-output-*/plan.md ~/Desktop/tiktok-raw/`). Titles that promise motion toward something ("What if you shot...", "What happens if you fell...", "If you threw...", "How police find...") tend to have slots.
2. **Download the shortlist** (section 3): the slot check needs the captions.
3. **Read every shortlisted video's narration** from the captions (`watch.sh` sheets + `strip.sh`), list its slots, score the best one (`transitions.md` §2). Keep the top N with Slot >= 2 and total >= 10.
   Break ties toward a different move than the videos already chosen, then toward an earlier slot.
4. Fewer than N qualify: shortlist more (scroll further). Write the links, the seam sentences and scores into `links.txt` / `plan.md`.

## 3. Download (snaptik.app), then verify clean
1. **`https://snaptik.app`**: paste the TikTok link into the box, press Download, take **"Download without watermark"** (or "Download (HD)" without watermark). Close popups and ads, ignore redirects and "download app" offers,
   click only the video download button. Save to `~/Desktop/tiktok-raw/NN-<id>.mp4`. Don't download anything except the video.
2. CAPTCHA / Cloudflare / error: **don't try to solve it.** Refresh, wait 30 s, retry up to 3 times. Then: snaptik's other download button -> `yt-dlp <link>` if installed -> another downloader (ssstik.io, tikmate). Record which one worked in `plan.md`.
   (In the Claude Code cloud session TikTok and snaptik.app are blocked by the egress policy: there, use only videos attached in chat, and say so.)
3. Verify: `ffprobe` (H.264? else transcode ONCE to H.264 crf 12 and treat that as the upload), `bash scripts/strip.sh f.mp4 0 <dur> 1 sheet.png 10` and **look** for a TikTok tag (a floating "TikTok @name" that hops between corners).
4. **Watermarked?** Remove it with ffmpeg: `delogo=x:y:w:h:enable='between(t,a,b)'` per hop (boxes/times from a 4 fps crop strip of the corners). Never crop or zoom the frame. Look at 4x-zoomed frames of every hop; a smear visible at phone size counts as not removed:
   try another snaptik button or downloader. Record the method in `plan.md`. The cleaned file IS the upload from here on.

## 4. The creator's marks (cover them all, every video)
Every Zack D video prints **"ZACK D FILMS"** (and a "D◀" logo) inside the 3D world: a title drifting over the background, letters on a rock or dung pile, a licence plate, a button, a prop, a shirt.
1. **Scan the kept part** (0 .. the cut): `bash scripts/strip.sh upload.mp4 <t> 20 4 scan_<t>.png 8` in 20 s chunks. Write each as `start-end s, where in frame, what it's printed on`. Marks after the cut are never seen.
2. Cover **each** with the method in `editing-the-original.md`: keyed fill for titles over flat backgrounds, `fill_logo_on_surface.py` for logos on shaded surfaces, `erase_letters.py` for text on plates/rocks/buttons/clothes. Hand-track boxes (a box every 2-4 frames),
   **re-encode only the GOPs that contain a mark** (`gop.py extract`, `assemble.py --replace`).
3. **Time-box 40 minutes per mark.** Past that: ffmpeg `delogo` with the tracked box; then a feathered fill sampled from the surface; last resort a feathered dark patch. Record the tier in `plan.md` and name it in the delivery line.
4. Verify with `scripts/compare_cover.py` on every changed frame and **re-scan the final video** up to the cut. Covered only when you've looked at the frames and the letters are gone.
5. Don't cover anything that isn't the creator's name/logo. A burned-in caption is never covered.

## 5. Build part 2
**Step A: the cut.** From the slot: `strip.sh` at 10 fps around it; N = the first frame of the caption chunk containing the dropped words (frames 0..N-1 kept; if that chunk also shows the last kept word, the overlay caption repeats it). Audio cut SEC = in the gap after the last kept word (`envelope.py`), 30 ms fade.
Write the seam sentence, the last kept words and N/SEC in `plan.md`.
**Step B: the voice** (section 6) -> `voice.wav` with only the replacement words. Onsets: `python3 scripts/envelope.py voice.wav 0 2` (the "Vee" onset = `voice.onsetInClip`; the "Stu" onset - "Vee" onset = tImp2 - tImp1).
**Step C: the spectacle.**
```
bash scripts/prep_spectacle.sh upload.mp4 N work/ending amber        # or dancers; writes in/last.png = frame N-1 and a copy of the template
python3 -I scripts/measure_circle.py work/ending/in/last.png          # iris only; LOOK at DEBUG.png
cd work/ending && $EDITOR cfg.json     # hype-ending.md "cfg for the bridge opening": opening, bridge, fps, times, caption, voice, music, look
cp ../voice.wav voice.wav
python3 audio.py <tail LUFS from watch/loudness_tail.txt>     # must print "VOICE over everything else ... >= 7 dB" on all thirds
node render.mjs stills 0,6,12,18,24,30,45,90,150              # LOOK: frame 0 == in/last.png; one continuous move; brand ignites on tImp1; no website anywhere
node render.mjs video part2_1080.mp4
```
**Step D: assemble.** `python3 -I scripts/assemble.py --orig upload.mp4 --part2 work/ending/part2_1080.mp4 --audio2 work/ending/audio.wav --cut-frame N --audio-cut SEC [--replace S:E:DIR ...] --crf 10 --out final.mp4`
(`--crf 10`: thin laser lines on black lose detail at higher crf).

## 6. The voice: the narrator's clone; never voiceless
The line = only the replacement words, brand spelled **"Veelahs Studio"** (SKILL.md: never "Vilas", never hyphenated): `Veelahs Studio.` / `at Veelahs Studio.` / `into Veelahs Studio.`
**Ladder (stop at the first rung that passes `qa.py`'s `voice` check on the file):**
1. **Clone the narrator** (Higgsfield `seed_audio` + `audio_references`, `voice-clone.md`): 3 takes max per video, `get_cost: true` first. Reference = 20 s of narration from `upload.mp4`.
   Upload: try a direct `media_upload`; if the proxy blocks it (cloud session) and `VOICE_REF_VIA_REPO` is true, push `ref.mp3` to a **throwaway branch** `tmp-voice-ref-<date>`, `media_import_url` the pinned raw URL, delete the branch.
2. **Higgsfield preset voice** (`list_voices`, `seed_audio` with `voice_type: preset`): the male voice nearest the narrator's register, same line. ~0.2 credits per take.
3. **Kokoro neural TTS, offline:** `python3 -I scripts/tts_kokoro.py "Veelahs Studio." --voice bm_george --out voice.wav` (closest register: `bm_george`, then `am_michael`/`am_adam`).
**There is no rung 4.** If all three fail, the video is delivered labelled "FAILED: no voice" with what you tried; it is not done. `qa.py` fails any build without a voice that is audibly in the mix (`voice_in_mix`).
Whatever rung: `audio.py` decodes the file with ffmpeg at the mix rate (a 44.1 kHz clone mixed raw at 48 kHz played 9% fast on the vehicle reel; fixed 2026-10-12).

## 7. QA gate (every video, no exceptions)
```
python3 -I scripts/qa.py final.mp4 --cut <seam time printed by assemble.py> --mode bridge --transition-dur <tImp1> --max-part2 7 --voice-file work/ending/voice.wav \
    --ledger work/ending/sound_ledger.json --others <the other videos' sound_ledger.json ...>
```
Must print `ALL QA CHECKS PASSED`: `transition`, `hook_time`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`, `voice_in_mix`, `sound_variety`. Plus: `assemble.py` ALL CHECKS PASSED, the creator-mark re-scan,
the seam strip (`strip.sh` +-2 s at 8 fps), the seam sentence read as text (one sentence ending in "Vilas Studio"), and no website/UI in any still.
Two fix attempts per video; if it still fails, deliver the best build **labelled as failing check X**, never silently. Passing the gate does not mean it's good: the stills and the seam sentence are the judge.

## 8. Batch rules
- Score ALL shortlisted videos before building any (the batch should be the N best slots, not the first N).
- `bridge.type` + style differ across the batch where the footage allows; `cfg.music` (riff/root/beat) differs on every video; alternate `amber` / `dancers`.
- Build in score order, highest first, so if time runs out the best ones exist.

## 9. Delivery folder per video
`plan.md` (story, seam sentence, scorecard, edit list, cfg, QA output pasted), `caption.txt`, `music_cue.md`, `sound_ledger.json`, `results.md` stub for Noah's numbers.

## 10. When blocked
- TikTok login wall: don't log in; use the visible videos. Profile won't load: stop, write exactly what happened.
- snaptik CAPTCHA/Cloudflare/error: section 3.2. All methods failed for a video: skip it, pick a replacement.
- Fewer than N videos have a slot: deliver what you have, say how many and why, and list the near-misses with the slot each lacked.
- The voice ladder failed (section 6): deliver labelled "FAILED: no voice", say what each rung returned.
- A step takes more than 3x its time-box: use the fallback, record it, keep going.

## 11. Deliver
1. Finals to `~/Desktop/tiktok-edited/NN-slug.mp4` (or `brag-output-*/brag.mp4`). Check each: plays, 9:16, no TikTok watermark, no ZACK D FILMS mark before the cut.
2. `SendUserFile` every final **in this chat** (<= 30 MiB each; bigger -> a crf-21 preview, say where the full file is).
3. One line per video: story in 5 words, **the seam sentence** ("...until it hit | Vilas Studio"), the move + style, hook time, voice rung, what you edited (cut point, marks covered with tier, watermark method).
4. Then the honest block, once: (a) **what I couldn't hear** (the clone's "VEE-lahs", the mix; the numbers that passed); (b) any voice rung below 1 and why; (c) the **originality/rights risk** in two lines (`reel-lab-notes.md` §4); (d) anything that fell back and why. No questions.
5. Update `HANDOFF.md` (one paragraph), commit + push repo outputs if working in the Jarvis repo.
