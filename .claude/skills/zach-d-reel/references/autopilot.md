# Autopilot: "make N videos" is a complete order

Noah types "make 5 videos" (or "make 3 zach d reels", "run the zach d pipeline", "do 5 while I sleep") and nothing else.
That sentence carries everything below. **Do not ask a question. Do not wait for approval.** He is asleep, at school or on
a plane. Make the call, write the call into `plan.md`, keep going. The only stop conditions are in section 9.

Anything in SKILL.md that says "ask Noah", "only when Noah asks" or "offer" is **pre-answered here**: the answer is yes, unless
this file says otherwise. If a step cannot be done, use the fallback written next to it. **Never fall back to something cheap and
ship it silently**: the sloth reel (`worked-example-sloth-failure.md`) is what that looks like.

## Knobs (the only things Noah may want to flip; everything else is a rule)
```
VOICE_REF_VIA_REPO = true     # cloud session: may push the 20 s narrator reference to a throwaway branch of the public repo so Higgsfield can import it.
                              # false = clone only if a direct media_upload works, else voiceless.
CREDIT_BUDGET      = min(balance - 1.0, 0.7 * N)     # Higgsfield credits for the whole run
PART2_SECONDS      = 5.5 .. 7
STYLE_ROTATION     = amber, purple+dancers, amber, purple+dancers, ...
```

## 0. The standing orders (what "make N videos" means)
| Question | Standing answer |
|---|---|
| Where do the videos come from? | 1. Videos attached in the chat. 2. TikTok links in the message. 3. Else the account `https://www.tiktok.com/@zackdfilms92` (section 2). |
| What ending? | **The hype laser drop** (section 5): hard cut to a whole new screen, a hit on frame 0, lasers, slams, end card. Never the cream card + captions ad. |
| Voice? | The narrator's own voice via a Higgsfield clone saying only "Vilas Studio" (section 6). If the clone can't be done: **no voice at all**. Never a stock TTS voice. |
| Cut the original at a word? | Yes, when the last word is a place/thing and the clone works (word swap). Otherwise append: the original plays whole and untouched. |
| Cover the creator's marks? | **Yes, all of them**, on every video, found by scanning the whole video (section 4). |
| Remove the TikTok watermark? | Yes (section 3). |
| Spend Higgsfield credits? | Yes, up to the budget in section 6. |
| Change anything else in the original? | **No.** No trim, speed, crop, grade, caption cover, or overlay. Rule zero otherwise stands. |
| Rights / endorsement warning | Say it **once**, in the final message. Don't stop for it. |
| Part 2 length | 5.5 to 7 s. |
| Caption (post text) | Write `caption.txt` per SKILL.md section 8. |

## 1. Preflight (10 min, then never again)
1. `TaskCreate` one task per video plus "preflight", "deliver". Update them as you go: Noah reads this list when he wakes up.
2. Tools: `ffmpeg`, `ffprobe`, `node` (+ `playwright` and a Chromium: `ls /opt/pw-browsers`, never `playwright install`), `python3` with
   `numpy scipy pyloudnorm`. Anything missing: install it (`pip install`, `npm i playwright` in the work folder). Don't ask.
3. Higgsfield: `balance`. Note the number. Try a direct `media_upload` of a tiny file to see if uploads work from here (section 6).
4. Browser tools if you must source from TikTok: read the `chrome-browser` skill first. Don't touch his logged-in tabs: open a new tab.
5. Work folders (create them now):
   - On Noah's own computer (the folder `~/Desktop` exists): `~/Desktop/tiktok-raw/` for downloads and watermark-cleaned files,
     `~/Desktop/tiktok-edited/` for finals. Name files `NN-slug.mp4` (`01-sloth.mp4`).
   - In the Jarvis repo / cloud session: `brag-output-YYYY-MM-DD-<slug>/` per video (final = `brag.mp4`, `brag.jpg` = a frame of part 1,
     `work/` gitignored), plus the same names copied to the scratchpad for `SendUserFile`. Commit and push each finished video's folder.
6. Read `references/vilas.md` (claims) once. Skip the worked examples unless something goes wrong; this file has what they teach.

## 2. Pick the N videos (TikTok profile, no login)
Open the profile. If a login wall appears: **do not log in, do not create an account**: work with what is visible. If the profile
won't load at all: stop and report exactly what happened (section 9).

Open candidates and **score each 0-5** on: (a) spoken narration all the way through; (b) burned-in captions (they are the only
transcript you have: no speech-to-text here); (c) a **clear last spoken line**; (d) a **strong final image**; (e) the last word is a
**place or thing** the brand can replace ("until it hit **Earth**", "…the **ocean floor**"): word-swap bonus; (f) length 25-75 s;
(g) the story isn't about real injury, death or tragedy (cartoon slapstick is fine).
**Skip:** no narration, no clear ending, trend/sound posts, real people on camera, anything already picked, anything in `tiktok-raw/`
or a `brag-output-*` folder already (check by TikTok video id in the `*plan.md` files: `grep -rl <id> brag-output-*/*plan.md`).
Take the top N by score; break ties toward **different ending types** (hinge table in SKILL.md) so the batch isn't five of the same.
If fewer than N good ones are visible, scroll further. If a video is unavailable or private, skip it and take the next.
Write the N links + one line each (why it was picked) into `~/Desktop/tiktok-raw/links.txt` (or `brag-output-*/plan.md`).

## 3. Download, then verify clean
1. `https://snaptik.app` → paste the link → take the **no-watermark** button. Close popups and ads, ignore redirects, click only the
   download button. Don't download anything except the video.
2. CAPTCHA / Cloudflare check / error: **don't try to solve it.** Refresh, wait 30 s, retry, up to 3 times. Then use another
   download method for that video (another Snaptik button, another downloader, `yt-dlp` if installed). Never give up on a video
   after only the first method.
3. Verify the file: `ffprobe` (h264? `assemble.py` needs H.264; if it's HEVC, transcode ONCE to H.264 crf 12 and call that the
   upload), then `bash scripts/strip.sh f.mp4 0 <dur> 1 sheet.png 10` and **look at it** for the TikTok watermark (a floating "TikTok @name"
   tag that hops between corners every few seconds).
4. **Watermarked?** Remove it before anything else, and write the method used into `plan.md`:
   - **HyperFrames first** (read its skills: `hyperframes-cli`, `hyperframes-core`). Time-box: 15 minutes.
   - Fallback **ffmpeg `delogo`** per position, switched by time: `delogo=x=..:y=..:w=..:h=..:enable='between(t,a,b)'` chained once per
     hop. Find each hop's box and time from a 4 fps crop strip of the corners. Never crop or zoom the frame (that reframes the story).
   - Look at 4× zoomed frames of every hop. A smear that's visible at phone size counts as not removed: try an overlay patch that
     samples the neighbouring pixels, or a second downloader.
   Save the cleaned file next to the raw one (`01-sloth.clean.mp4`). **From here on, the cleaned file IS the upload**: Rule zero
   and `assemble.py` treat it as the original.

## 4. The creator's marks (cover them all, every video)
Every Zack D video prints **"ZACK D FILMS"** (and a "D◀" logo) inside the 3D world: a title drifting over the background, letters on
a rock or poop pile, a licence plate, a button, a prop. The sloth reel shipped with it visible on a dung pile at ~16-18 s. Don't repeat that.
1. **Scan the whole video**, not the sheets from `watch.sh` (2 fps, tiny): `bash scripts/strip.sh upload.mp4 <t> 20 4 scan_<t>.png 8` in 20 s
   chunks. Look for any letters that are not a burned-in caption: the creator's name or logo, a handle, a title card, anything
   printed on an object. Write each as `start-end s, where in frame, what it's printed on`.
2. Cover **each** with the method in `editing-the-original.md` ("Covering the creator's marks"): keyed fill for titles over flat
   backgrounds, `fill_logo_on_surface.py` for logos on shaded surfaces, `erase_letters.py` for text on plates/rocks/buttons. Hand-track
   the boxes (a box every 2-4 frames), process in parallel, **re-encode only the GOPs that contain a mark** (`gop.py extract`,
   `assemble.py --replace`).
3. **Time-box 40 minutes per mark.** Past that: ffmpeg `delogo` with the tracked box. Still visible after delogo at 4× zoom: patch
   with a feathered fill sampled from the surface around it. Last resort only: a feathered dark patch. Record which tier each mark got
   in `plan.md` and name it in the delivery line (honesty beats a silent smear).
4. Verify with `scripts/compare_cover.py` on every changed frame and **re-scan the final video** with the same 20 s strips.
   A mark counts as covered only when you've looked at the frames and the letters are gone.
5. The marks from the first scan are the *whole* list: do not invent more, and do not cover anything that isn't the creator's name
   or logo (the TikTok tag is section 3; a burned-in caption is never covered).

## 5. Build part 2: the hype laser drop (the default for every video)
Use `assets/hype-ending/` (see `hype-ending.md`). It needs **no screen recordings, no captures, no voice**: nothing from outside
the box. Never build a placeholder rectangle, a wireframe, or a flat card as a stand-in for a website.

**The seam is the event.** Frame 0 of part 2 is a whole new screen (not the original's footage, not a caption band, not a dissolve,
not a freeze), the cut lands as a hit (white flash frame + 30-80 Hz thump on the same frame), then the orb falls into the dim
wordmark, impact 1 at 0.66 s, impact 2 at 1.17 s, the drop at 1.8 s. `opening: "orb"` does all of that.

### 5a. Pick the style by video number (variety across the batch)
| Video # in the batch | Template | Look |
|---|---|---|
| 1, 3, 5 | `assets/hype-ending/` (amber/orange on ink) | the railgun look; `"opening": "orb"` replaces its railgun-round fall |
| 2, 4, 6 | `presets/locate-dancers/` (purple/blue/red + laser floor + **laser stick-figure dancers**) | `cp presets/locate-dancers/index.html comp/index.html && cp presets/locate-dancers/{cfg.json,audio.py} .` |
Two videos in a row never share a template. Copy sets rotate A, B, C, D (below) so no two videos in a batch say the same slams.
If Noah's message names a look ("more lasers", "purple", "dancers"), that look wins for every video.

### 5b. The cfg recipes (tested; edit only `fps`, `duration`, copy, `voice`)
Amber (`assets/hype-ending/cfg.json`): keep the file's times; set `"opening": "orb"`, `"fps"` = the original's fps, delete `caption`
(or keep it only with a voice, section 6). Drop `voice` unless the clone exists.
Purple + dancers (`presets/locate-dancers/cfg.json`), set exactly:
```
"fps": <original fps>, "duration": 6.6, "opening": "orb",
"tImp1": 0.66, "tImp2": 1.17, "tDrop": 1.8, "beat": 0.4, "tEnd": 4.6, "tFinal": 6.15,
"slams": [t = 1.8, 2.2, 2.6, 3.0 (glitch), 3.8 (accent "$300")]       # 4-5 slams, one per 0.4 s beat; the last one is the price
delete "caption" and "captionStyle" and "voice" unless the clone exists
```
Both templates read `wordmark` ["VILAS","STUDIO"] and `endCard` {word "Vilas", sub ".studio", tagline}. Never change those.

### 5c. Slam copy sets (message bank only, no invented claims)
Each set has 4-5 slams; the last is always the price in the accent. Test each by length: `fit()` shrinks a long line, but keep lines <= 16 chars.
| Set | Slams (t = 1.8, 2.2, 2.6, 3.0 glitch, 3.6-3.8) | End-card tagline |
|---|---|---|
| A | WEBSITES / THAT LOOK / EXPENSIVE. / IT WASN'T. / FROM $300 | websites that look expensive. / they weren't. |
| B | LOCAL BUSINESS? / NEW WEBSITE. / LOOKS EXPENSIVE. / IT WASN'T. / FROM $300 | websites for local businesses / that look ten times more expensive. |
| C | BARBERS. / BAKERIES. / FLORISTS. / LANDSCAPERS. / FROM $300 | websites for local businesses / that look expensive. |
| D | LOOK EXPENSIVE. / ANYWHERE / IN THE US. / IT WASN'T. / FROM $300 | websites that look expensive. / they weren't. |
Niche words only for niches that have a demo (barber, bakery, florist, landscaping, lawn care, power washing, renovation, auto body).
If you want to nod at the story (e.g. one slam in the story's own noun), it must still be true, short, and not a claim about Vilas.

### 5d. The build, in order
```
mkdir -p work/ending && cp -r assets/hype-ending/. work/ending/ && cd work/ending && ln -s <a node_modules with playwright> node_modules
(preset: copy it over comp/index.html, cfg.json, audio.py as in the table)
$EDITOR cfg.json                                   # section 5b, 5c
python3 audio.py <tail LUFS of the original>       # `watch/loudness_tail.txt`; it prints the voice margin if a voice exists
node render.mjs stills 0,3,8,14,30,60,100,140      # LOOK at these (strip them into one image) before the full render
node render.mjs video part2_1080.mp4
python3 -I scripts/assemble.py --orig upload.mp4 --part2 work/ending/part2_1080.mp4 --audio2 work/ending/audio.wav \
   [--cut-frame N --audio-cut SEC]  [--replace S:E:DIR ...]  --crf 10  --out final.mp4
python3 -I scripts/qa.py final.mp4 --cut <SEC> --max-part2 7 [--voice-file work/ending/voice.wav | --no-voice]   # section 8
```
`--cut` for the QA is the seam second: the original's duration (append) or the audio-cut (word swap). Render at the original's fps.
`--crf 10` for the dancers preset (thin laser lines lose detail at crf 14), `--crf 12` for amber.

## 6. The voice: clone it or say nothing
**Never use a stock/TTS voice.** The sloth reel's TTS was measured: pitch spread 14 Hz against the narrator's 69 Hz; Noah heard
"Stephen Hawking". With no clone, part 2 has **no voice**: the hit, the slams and the end card carry it, and the narrator's last
line plays out untouched before the hit.

The clone says **only** "Veelas Studio!" (spelled so it comes out VEE-las), landing on impact 1 (`voice.landsOn: "tImp1"`).
1. Can we clone? Budget: `balance` ≥ 1.0 and total spend ≤ min(balance − 1.0, 0.7 × N) credits (3 takes × 0.2 per video).
2. Reference clip: `ffmpeg -i upload.mp4 -t 20 -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 192k ref.mp3`, from a stretch of narration with no music.
3. Get it to Higgsfield: **try a direct `media_upload` first.** If the upload host is blocked (cloud session) and you're in the Jarvis repo with
   push access (`VOICE_REF_VIA_REPO = true`): push `ref.mp3` to a **throwaway branch** `tmp-voice-ref-<date>`, `media_import_url` its
   `raw.githubusercontent.com` URL pinned to the commit SHA, then delete the branch. Say so in the delivery. If neither works → no voice.
4. Generate and fetch exactly as `voice-clone.md`. Check the take: **`scripts/qa.py --voice-file`** is the gate. Median pitch within 30% of the
   narrator's, and for a >= 2 s voice the spread >= 50% of the narrator's. Fail → regenerate once with the other spelling, then no voice.
5. With a voice: `cfg.caption = {"text": "Vilas Studio", "until": 1.0}` in the original's caption style (measure it: `captionStyle` in the
   preset, the `caption()` function in the template) and `cfg.voice = {file: voice.wav, trimStart, onsetInClip, landsOn: "tImp1"}`.
   `audio.py` prints the voice margin: it must be ≥ 7 dB in every third. You can't hear it; say so in the delivery.

## 7. Word swap vs append
**Word swap** (edits the original: the standing yes covers it): only when ALL are true: the last spoken word names a place or thing;
the clone passed section 6; you found a clean audio gap (`envelope.py`) after the last kept word and before the dropped one; and the
cut frame is a caption flip you can see (`strip.sh`). Cut with `assemble.py --cut-frame N --audio-cut SEC`, never repeat a kept word,
`cfg.caption` first chunk may repeat the kept word ("hit Vilas Studio"). Details: `editing-the-original.md`.
**Append** (everything else, and the safe default): the original plays to its last frame untouched; part 2 starts at its duration.
`--cut` = duration. No `--cut-frame`.
Read the seam as text and write it in `plan.md`: kept words + part 2's words = one clean sentence, or (append) a finished sentence
followed by a hit.

## 8. QA gate (every video, no exceptions)
`python3 -I scripts/qa.py final.mp4 --cut SEC --max-part2 7 ...` must print `ALL QA CHECKS PASSED`:
`hard_cut` (a whole new screen), `audio_hit` (a 30-80 Hz thump on the cut), `dead_air` (no silence in part 2, the end card keeps its
tail), `loudness` (part 2 within 3 LU of the original), `length`, `voice`. Plus `assemble.py` says `ALL CHECKS PASSED`, plus the creator-mark
re-scan (section 4.4), plus SKILL.md section 7's seam strip. A FAIL is fixed, not explained away. Two fix attempts per video; if it still
fails, deliver the best build **labelled as failing check X**, never silently.

## 9. When blocked
- TikTok login wall: don't log in. Use the videos you can see. Profile won't load at all: stop, write down exactly what happened.
- Fewer than N usable videos: deliver what you have and say how many and why.
- Snaptik CAPTCHA/Cloudflare/error: section 3.2. All methods failed for a video: skip it, pick a replacement.
- Nothing works for every video: stop and write down what happened and which links you collected, so Noah can finish in the morning.
- A step takes more than 3x its time-box: use the fallback, record it, keep going.

## 10. Deliver
1. Finals to `~/Desktop/tiktok-edited/NN-slug.mp4` (or `brag-output-*/brag.mp4`). Open each with `ffprobe` + a frame check: plays, 9:16,
   no TikTok watermark, no ZACK D FILMS mark, the seam as designed.
2. `SendUserFile` every final **in this chat** (≤ 30 MiB each; bigger → a crf-21 preview from the scratchpad, say the full file's path).
3. One short line per video: the story in 5 words, which style (amber / purple+dancers), word swap or append, and **what you edited**
   (marks covered, with the tier used, and the TikTok-watermark method). Example: `03 sloth: append, purple+dancers, voiceless; covered ZACK D FILMS on the dung pile 16.0-18.1 s (surface fill); watermark: Snaptik clean.`
4. Then four lines, once: (a) **what I couldn't hear** (the clone's "VEE-las", the mix; the numbers that passed); (b) the **endorsement
   risk** if a clone was used; (c) the **rights note** (an ad added to someone else's video can draw a takedown on @vilaswebdesign);
   (d) anything that fell back and why. No questions.
5. Per video: `plan.md` (ending read, edit list, cfg used, QA output pasted) and `caption.txt` (SKILL.md section 8). Update `HANDOFF.md`
   (one paragraph: what was built, where, anything unfinished) and commit + push the repo outputs.
