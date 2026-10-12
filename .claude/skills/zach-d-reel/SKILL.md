---
name: zach-d-reel
description: Turn Zack D Films-style viral story videos (3D what-ifs, weird facts) into Vilas Studio ads. Noah only says "make N videos" (or "make 5 zach d reels", "zach d this", or attaches a story video) and the skill runs the whole workflow unattended, asking nothing. v4: downloads TikToks with snaptik.app; picks videos for a SENTENCE SLOT (a line the narrator's own sentence can finish with "Vilas Studio", like "until it hit Earth" -> "until it hit Vilas Studio"); cuts right before that word; the narrator's Higgsfield voice clone says "Veelahs Studio"; part 1's last frame physically moves (zoom, iris, whip, shatter, doors, glitch) into a photoreal Vilas Studio spectacle (extruded metal wordmark, lasers, then the over-the-top laser drop), NEVER a website or demo site; covers every ZACK D FILMS mark; QA-gates every video (voice must be in the mix) and sends all N in chat. Also: "swap the last word", "cover the watermark", "hype ending", "more lasers".
---

# zach-d-reel   (v4, 2026-10-12: the seam is a sentence)

Part 1 is a Zack D Films-style story video. You make part 2: the narrator's own sentence keeps going and ends in **"Vilas Studio"**, the picture physically moves out of
part 1 into a **Vilas Studio spectacle**, and a few seconds of over-the-top hype follow. The viewer feels outplayed, laughs, and sends it.

**The model to copy (Noah: "that's the type of transition that's good"):** the railgun reel. The narrator says "...it could actually make it all the way from the Moon until it hit"
and, in his own cloned voice, "**Vilas Studio**". The round smashes into a metal VILAS STUDIO wordmark on that word, lasers explode, WEBSITES / THAT LOOK / EXPENSIVE. / IT WASN'T. / FROM $300
slam in on the beat, end card. Same shape: the pole-vault line "...until you land at **Vilas Studio**". Read `references/worked-example-railgun.md` once.

**What failed on 2026-10-12 (never repeat; `references/worked-example-2026-10-12-failures.md`):** three reels (sea lion, car/brain, brain) cut wherever a shape or a pause was,
not where a sentence could continue; part 2 started a NEW sentence ("Vilas Studio. Websites that look expensive. They weren't.") that had nothing to do with the last line;
the move landed on a scrolling **demo website**; and there was **no voice at all**. Noah: the moves looked well edited, but "it doesn't make sense where the transition is", "it doesn't flow", "boring".

## The six laws (each has a test; a video that can't pass one is skipped or fixed, never shipped)
1. **The seam is a sentence.** Cut INSIDE a narrator sentence, immediately before the word(s) that name where something goes, what it hits, or what is found.
   The clone says the replacement: 0-2 small words + "Vilas Studio" (e.g. "Vilas Studio", "at Vilas Studio", "into Vilas Studio"; in the voice prompt it is spelled `Veelahs Studio`, see below). *Test:* write `<last kept words> + <clone words>` as one line of text in `plan.md`
   ("all the way from the Moon until it hit Vilas Studio"). It must read as ONE grammatical English sentence a person would say, with "Vilas Studio" as the place/target/thing. If it reads as two sentences, or "Vilas Studio." stands alone, it fails.
   The slot rules, verbs and scorecard are in `references/transitions.md` §1-2. **No slot = skip the video**, however good it is.
2. **The move happens on that word.** Part 2's frame 0 IS part 1's last kept frame; the physical move (zoom / iris / whip / shatter / doors / glitch, chosen by what is moving on screen at the slot: `transitions.md` §3)
   runs 0.7-1.0 s and **lands exactly on the first syllable of "Vilas"** (impact 1 = `tImp1`), "Studio" lands on impact 2. *Test:* the stills at 0 / mid / landing read as one continuous motion; `qa.py` `transition` and `audio_hit` pass.
3. **It lands in a Vilas Studio thing. NEVER a website.** The destination is the Vilas spectacle: the extruded metal VILAS / STUDIO wordmark in a dark laser world that ignites on the voice.
   **Banned anywhere in part 2:** a website, a demo site, a site screen recording, a browser, a phone or laptop showing a site, a UI mockup, a "A VILAS.STUDIO DEMO" chip, any real or fictional business's page.
   (The demo footage and the demo-site template were deleted from this skill on 2026-10-12 so this cannot happen by accident. Don't re-capture them for a reel.)
4. **Then the funny part.** After the landing: 3.5-5 s of absurd, over-the-top hype for a tiny web studio: the laser drop (`amber`) or the laser dancers (`dancers`), the slams from the message bank, the end card.
   The joke is the self-importance; it is never a sales pitch. *Test:* `plan.md` names what the viewer laughs at in one line.
5. **The narrator's voice says the brand. Always.** Higgsfield clone of the narrator (`references/voice-clone.md`), with the brand spelled **"Veelahs Studio"** in the text sent to the voice model (section below).
   Higgsfield is used **only for audio** (voice clone / preset voice). Never Higgsfield images or video. No voice = not done: `qa.py` fails it (`voice` + `voice_in_mix`), there is no voiceless pass.
6. **Slightly photoreal, matched to part 1.** The Vilas part is rendered with `"look": "photoreal"` (the default: extruded metal letters, glossy floor reflections, dust, bloom, film grain, lens streaks) so it sits next to a 3D-rendered story instead of looking like flat web graphics. Never `"flat"` for a reel.

## How to say and spell "Vilas" (exact, for every voice generation)
- **Spoken:** VEE-lahs. Stress on the first syllable. "VEE" as in "see". "lahs" short and soft, as in "Las Vegas". Never "VY-las", never "VILL-us", never "vee-LAHS".
- **Spelling in the TEXT you send to Higgsfield (`generate_audio_batch` text) or to Kokoro:** `Veelahs Studio`. One word, no hyphen. Examples: `Veelahs Studio.` / `at Veelahs Studio.` / `Veelahs Studio!`
  Why this spelling (tested 2026-10-12 with the espeak-ng phonemizer that Kokoro uses): "Veelahs Studio" -> /ˈviːləz ˈstuːdioʊ/, one stress on VEE. Hyphenated forms ("Vee-lahs", "Vee-las") add a second stress on the last syllable (VEE-LAHS, sounds foreign/robotic): don't use them.
  Plain "Vilas" is read VY-las or VILL-us by some neural voices (railgun notes): don't send it to a voice model.
- **Everywhere a viewer READS it** (captions, slams, wordmark, end card, `caption.txt`): `Vilas Studio` / `Vilas` / `vilas.studio`. The phonetic spelling never appears on screen or in post text.
- If a take still says it wrong (Noah's ear is the only judge: nothing here can hear), regenerate once with `Veelahs, Studio.` (the comma gives a short pause before "Studio", which keeps the weight on VEE) and tell Noah which take you used.

## 0. "make N videos" is the whole order. Read `references/autopilot.md` first.
Run everything unattended: source -> download (snaptik) -> **find the sentence slot** -> watermark -> cover marks -> cut at the slot -> voice -> build -> QA -> deliver. Don't ask questions; Noah is asleep.
Anything below that says "ask Noah" is pre-answered in `autopilot.md`. When Noah *does* give specific instructions, his words win over the defaults.

| | Default |
|---|---|
| Sources | 1. videos attached in chat; 2. TikTok links in the message; 3. else `https://www.tiktok.com/@zackdfilms92`. |
| Download | **snaptik.app is approved and is the default downloader** (paste the TikTok link, take the "without watermark" button). Fallbacks: another snaptik button, then `yt-dlp`, then another downloader (`autopilot.md` §3). |
| Picking | **For the sentence slot** (`transitions.md` §2 scorecard). Slot score < 2 or total < 10/15: skip the video. |
| Cut | Right before the slot word (`editing-the-original.md`, "Cutting at a word"). Video cut on the caption flip, audio cut in the gap before the dropped word. |
| Hook time | The slot decides. Target <= 25 s, hard limit 35 s (`qa.py --max-hook 35` default). A perfect slot at 33 s (railgun) beats a weak one at 15 s. |
| Ending | `assets/hype-ending` with `"opening": "bridge"` (`scripts/prep_spectacle.sh`): the move into the spectacle, then the drop. Styles: `amber` lasers / `dancers` (purple-blue-red laser dancers). |
| Voice | **Required.** Higgsfield clone of the narrator saying the completion words with "Veelahs". Ladder if the clone fails: Higgsfield preset voice -> Kokoro (`scripts/tts_kokoro.py`). Never voiceless, never a robot voice. |
| Sound | The template's synthesized hits + drop, varied per video by `cfg.music` (`riff` 0-3, `root` semitones, `beat`); the narrator's voice on top (>= 7 dB margin). Nothing commercial baked in; a music cue sheet for the Instagram editor (`references/sound.md`). |
| Creator marks | Cover every "ZACK D FILMS" mark before the cut, found by scanning. |
| TikTok watermark | Remove it with ffmpeg (not HyperFrames), only if the download still has one. |
| Gate | `scripts/qa.py` prints `ALL QA CHECKS PASSED` (incl. `voice` and `voice_in_mix`) AND the seam sentence passes law 1 AND your stills read as one move. |
| Delivery | All N via `SendUserFile`, one line each (the seam sentence, the move, hook time, voice rung), then the honest block. |

Read first (once per session): `references/autopilot.md`, `references/transitions.md` (slot, move, scorecard), `references/voice-clone.md`, `references/hype-ending.md` (the template), `references/vilas.md` (claims).
As needed: `editing-the-original.md` (cuts, covering marks), `sound.md`, `reel-lab-notes.md` (hook/send/duh laws, posting, **the originality risk**), `worked-example-railgun.md` (the model), `worked-example-2026-10-12-failures.md`,
`worked-example-vehicle.md`, `worked-example-sloth-failure.md`, `teardowns.md`, `environment.md`.

## Rule zero: the original is untouched except for the standing edits
Part 1 goes out as uploaded. **Standing edits** (approved for every job): (1) remove the TikTok watermark; (2) cover the creator's marks; (3) cut at the slot (keep frames 0..N-1 and the audio up to the gap before the dropped word);
(4) remove a doubled word at the seam. Each is done with the protocol in `editing-the-original.md`: only the GOPs containing an edit are re-encoded, everything else is stream-copied, and `scripts/assemble.py` proves it.
**Never**, unless Noah explicitly asks in this conversation: speed up/slow down, crop, reframe, zoom, flip, upscale/downscale; recolour/grade/sharpen/denoise/stabilise; mute/duck/re-voice/add music under it/change its volume;
cover its **burned-in captions**; add anything on top of it; extend or freeze it (the move starts from its last frame but is part 2).
Scan for creator marks over the whole *kept* video (railgun: a mark on an object was missed; sloth: a mark on a dung pile shipped). **Rights/originality:** say once, in the delivery, what `reel-lab-notes.md` §4 says. Don't stop for it.

## The workflow (per video)
### 1. Watch and read it
`bash scripts/watch.sh <upload> <work>/watch` (contact sheets, last frames, cuts, loudness). Look at **every** sheet and **write out the narration from the burned-in captions**, chunk by chunk with times
(`bash scripts/strip.sh <video> <start> <dur> <fps> <out.png>`). If speech-to-text works in your environment (faster-whisper can download its model), use it to check the caption transcript; it is blocked in the cloud session. Never guess words.

### 2. Find the slot (this decides whether the video is used)
In the transcript, mark every place where a narrator sentence names a destination/target/found thing (`transitions.md` §1 has the verb list and examples). For each: the seam sentence as text, the score (§2), the time.
Take the best one with slot >= 2 and total >= 10. `python3 -I scripts/find_transitions.py <video> --out <work>/ft` and `scripts/measure_circle.py` help pick the move's parameters at that time; they never choose the cut.
Write in `plan.md`: story in one line; the seam sentence; the scorecard; last kept frame; the move and why (what is moving at the slot); caption style (px height, baseline); tail loudness; creator marks.

### 3. Cut, voice, build
1. Find the cut: video frame N = the first frame of the caption chunk that contains the dropped word (if that chunk also holds the last kept word, as "hit Earth" did, the overlay caption after the landing repeats it: "hit Vilas Studio");
   audio cut SEC = in the gap after the last kept word and before the dropped one (`envelope.py`; the audio usually runs a little after the picture cut). Write down the exact last kept words (never repeat one in the clone line).
2. Voice: the clone line = the replacement words only (e.g. `Veelahs Studio.`), recipe in `voice-clone.md`. Find its syllable onsets with `python3 scripts/envelope.py voice.wav 0 2`.
3. `bash scripts/prep_spectacle.sh upload.mp4 N <work>/ending amber|dancers` -> edit `cfg.json` per `hype-ending.md` (opening bridge, bridge type/params, tImp1 = move length, tImp2 = the "Studio" onset, caption = the
   completed caption chunk, voice, music, look) -> `python3 audio.py <tail LUFS>` (must print a VOICE margin line >= 7 dB) -> `node render.mjs stills 0,6,12,18,24,30,45,90,150` -> **look** -> `node render.mjs video part2_1080.mp4`.

### 4. Assemble
```
python3 -I scripts/assemble.py --orig upload.mp4 --part2 <work>/ending/part2_1080.mp4 --audio2 <work>/ending/audio.wav --out final.mp4 --crf 10 \
        --cut-frame N --audio-cut SEC  [--replace S:E:DIR ...]       # GOPs with covered marks (frames from `scripts/gop.py extract`)
```
Prints `ALL CHECKS PASSED` or `FAIL`; don't ship on FAIL.

### 5. QA (all must pass; two fix attempts, then deliver labelled "FAILED: <check>")
- [ ] `python3 -I scripts/qa.py final.mp4 --cut <the seam time assemble.py prints> --mode bridge --transition-dur <tImp1> --max-part2 7 --voice-file <work>/ending/voice.wav --ledger <work>/ending/sound_ledger.json --others <other videos' ledgers>` -> **ALL QA CHECKS PASSED**
  (`transition`, `hook_time`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`, `voice_in_mix`, `sound_variety`).
- [ ] `assemble.py` ALL CHECKS PASSED; changed ranges equal the edit list.
- [ ] **Law 1, as text:** the seam sentence in `plan.md` is one grammatical sentence ending in "Vilas Studio".
- [ ] **Law 3:** no frame of part 2 shows a website, browser, phone screen, UI or demo chip (look at the stills).
- [ ] **The seam** (`strip.sh` +-2 s at 8-10 fps): frame 0 == part 1's last frame, one continuous move, the brand lands on the impact, the caption appears with the voice.
- [ ] **Every covered mark:** `compare_cover.py` before/after, then re-scan the kept video for any creator name.
- [ ] Every slam/claim is in the message bank (`vilas.md`); the duh test and the send test (`reel-lab-notes.md`) are written in `plan.md`.

### 6. Deliver
- `final.mp4`, `plan.md` (seam sentence, scorecard, edit list, cfg, QA output), `caption.txt`, `music_cue.md`, `sound_ledger.json`, `results.md` stub.
- **Post caption** (`caption.txt`, about Vilas): a first line that extends the hook, 1-3 plain sentences using only message-bank claims, one send/comment CTA ("Send this to the friend who still has a 2009 website"),
  the line "See the work and start a project at vilas.studio.", <= 5 hashtags (#webdesign #smallbusiness #localbusiness #websitedesign). No emoji. Credit the creator only if Noah asks. Suggest a pinned comment.
- `SendUserFile` caps at 30 MiB: bigger -> a crf-21 preview from the scratchpad, and say where the full file is.
- Per video, one line: the seam sentence ("...until it hit | Vilas Studio"), the move, hook time, voice rung, what was edited. Then once: what you couldn't hear (the "VEE-lahs", the mix), any voice rung below the clone and why, the originality risk, any fallback.

## When the upload is unusual (autopilot never asks: decide)
- **No narration, music only:** no sentence, no slot: skip it.
- **No burned-in captions and no working speech-to-text:** you can't read the sentence: skip it (never guess words).
- **Not in English:** skip it (the seam must be one English sentence).
- **Real people on camera, or real tragedy/death as the subject:** skip and replace. Cartoon slapstick is fine.
- **Horizontal or square:** keep the original's aspect ratio (change `W`, `H`, `CX` and the canvas in the template's `comp/index.html` and `comp/bridge.js`).
- **It already ends on a brand or logo:** cut before it.
- **A mark you can't cover cleanly:** the tiers in `autopilot.md` §4; name the tier. Or a slot earlier than the mark.
- **Noah asks for a website/demo in part 2:** only then, and only as he describes it. Autopilot never does.
