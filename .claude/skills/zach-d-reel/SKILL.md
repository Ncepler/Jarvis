---
name: zach-d-reel
description: Turn Zack D Films-style viral story videos (3D what-ifs, weird facts, physics hypotheticals, true-story animations) into Vilas Studio ads. Noah only has to say "make N videos" (or "make 5 zach d reels", "zach d this", "run the zach d pipeline", or attach a story video): this skill then runs the WHOLE workflow unattended and without asking anything: picks N videos from tiktok.com/@zackdfilms92, downloads them through Snaptik, removes the TikTok watermark, covers every "ZACK D FILMS" creator mark, cuts at the last word or appends, clones the narrator (or uses no voice, never a robot voice), builds a hype laser-drop ending (hard cut to a whole new screen, hit on frame 0, lasers, slams, end card), proves each one with a QA gate, and sends all N back in chat. Also handles "swap the last word", "cover the watermark", "hype ending", "more lasers", "genius marketing", and bare story-video uploads.
---

# zach-d-reel

Noah uploads (or the skill fetches) **part 1**, a video that already works on its own: a 3D "what if", a weird fact, a disaster story. You make
**part 2**: a hard cut to a laser-drop ending that lands on Vilas, so the viewer feels outplayed, laughs and saves it. That's the
"world's most genius marketing strategy" format.

## 0. "make N videos" is the whole order. Read `references/autopilot.md` first.
When the message is a count ("make 5 videos"), a bare request, or just a story-video upload, run **autopilot**: the complete pipeline
(source → download → clean watermark → cover creator marks → build → QA → deliver) with every decision already made in
`references/autopilot.md`. **Don't ask questions; Noah is asleep.** Anything below that says "ask Noah" or "only when Noah asks" is
pre-answered there. When Noah *does* give specific instructions ("until it hit Earth → Vilas Studio", "purple lasers", "~5 s"), his words win over the
defaults, and the rest is still autopilot.

**The defaults, in one table** (details and exact configs in `autopilot.md`):
| | Default |
|---|---|
| Ending | **Hype laser drop**, 5.5-7 s. Never a cream card with captions. Never a placeholder website box. |
| The seam | **Frame 0 of part 2 is a whole new screen** and the cut lands as a **hit** (white flash + thump on the same frame). Never overlay or continue part 1's footage. |
| Voice | Higgsfield clone of the narrator saying only "Veelas Studio!" on impact 1, **or no voice at all**. **Never a stock/TTS voice.** |
| Cut the original? | Word swap (cut at the last word, clone says the brand) when the last word is a place/thing and the clone works; else **append** (original untouched). |
| Creator marks | **Cover every "ZACK D FILMS" mark**, found by scanning the whole video. |
| TikTok watermark | Remove it (HyperFrames, else ffmpeg), before anything else. |
| Style | Alternates by video number: amber template / purple-blue-red + laser stick-figure dancers; copy sets rotate. |
| Gate | `scripts/qa.py` must print `ALL QA CHECKS PASSED` on every video. |
| Delivery | All N sent in chat with `SendUserFile`, one line each, then what couldn't be heard. |

Read first (once per session): `references/autopilot.md`, `references/vilas.md` (facts, allowed claims), `references/hype-ending.md` (the template).
Then as needed: `references/worked-example-sloth-failure.md` (**what bad looks like, with numbers**), `worked-example-railgun.md` and
`worked-example-vehicle.md` (the two good jobs), `editing-the-original.md` (cuts, covering marks, verified re-encode),
`voice-clone.md`, `teardowns.md` (three real ads taken apart), `environment.md` (cloud-session limits).

## Rule zero: the original is untouched except for the standing edits
Part 1 goes out as uploaded. **Standing edits** (Noah approved them for every job): (1) remove the TikTok watermark; (2) cover the creator's
marks; (3) cut at a word and put "Vilas Studio" in the narrator's voice (word swap); (4) remove a doubled word at the seam. Each is done with the
protocol in `editing-the-original.md`: only the GOPs containing an edit are re-encoded, everything else is stream-copied, and
`scripts/assemble.py` proves it. **Never**, unless Noah explicitly asks in this conversation:
- trim (other than the word-swap cut), speed up, slow down, crop, reframe, zoom, flip, upscale or downscale it
- recolour, grade, sharpen, denoise or stabilise it
- mute it, duck it, re-voice it, add music under it, or change its volume
- cover, blur or remove its **burned-in captions**
- add anything on top of it (no captions, stickers, bands or "part 2" teasers over part 1)
- **extend, freeze or dissolve out of it**: part 2 begins on a hard cut, not on part 1's footage

Default is append-only: the original's frames are stream-copied whole; its soundtrack is re-encoded once at 320k because TikTok/IG
downloads use HE-AACv2, which can't be joined losslessly (the sound is unchanged; the script checks). Say it in one line when delivering.
Scan the **whole** video for marks (railgun: the second mark, on an object, was missed; vehicle: every mark was on a prop; sloth: the mark was on a dung pile and
shipped uncovered). Look at plates, screens, buttons, badges, labels, rocks, not just overlays.
**Rights:** say once, in the delivery, that adding an ad to someone else's video risks a takedown or strike on @vilaswebdesign. Don't stop for it.

## The workflow (per video)
### 1. Watch it (you can't play video, so do this)
`bash scripts/watch.sh <upload> <workdir>/watch` gives contact sheets (2 fps), `ending.png` (last 3 s at 6 fps), `last_frame.png`, the hard
cuts, and loudness. Look at **every** sheet. Read the burned-in captions to get the script. For exact timing use
`bash scripts/strip.sh <video> <start> <dur> <fps> <out.png>` and `python3 scripts/envelope.py <video> <t0> <t1>` (10 ms audio levels: where words and gaps are).
There is no speech-to-text in the cloud session: if there are no captions, you have the story from the picture only and the video is **append-only** (no word swap). Never guess dialogue.

### 2. Read the ending (write this down in `plan.md`)
- **Story in one line**; **last line, exact words** and its **last word** (a place/thing the brand could replace?); **last picture** and its motion.
- **Ending type** (hinge table in the appendix) → decides word swap vs append (`autopilot.md` §7).
- **Narrator:** voice type, pace, tone. **Captions:** look, weight, case, size as % of width, vertical position, stroke, words per chunk (measure on `last_frame.png`).
- **Audio tail:** does music keep playing to the last frame? Tail loudness (`loudness_tail.txt`).
- **Creator marks:** every one, with start-end seconds, whole video (`autopilot.md` §4).
- **If word swap:** the caption-flip frame, the keyframes (`python3 scripts/gop.py keyframes <v>`), the audio gap before the dropped word.

### 3. Build part 2: the hype laser drop
Use `assets/hype-ending/` per `references/hype-ending.md` and `autopilot.md` §5. **The cut is the event.** Hinge laws (all of them obeyed by railgun and vehicle, all broken by sloth):
1. **Frame 0 of part 2 is a whole new screen**, never the original's footage, a caption band over it, a freeze or a dissolve. (`opening: "orb"` or a rewritten section A that ends on a match to part 1's last frame.)
2. **The cut is heard**: a 30-80 Hz thump lands on the frame of the cut (or the first impact within 0.7 s for a word swap). A silent cut is a bug.
3. **Brand in the first second.** The wordmark ignites on impact 1 (0.66 s); with a clone the voice lands on it.
4. **No wink, no sales-speak, no invented claims.** Slams come from the message bank (`autopilot.md` §5c). No spoken joke, no "but seriously".
5. **Never say a word twice across the seam**; write down the exact words the kept audio ends on.
6. **Match only the surface:** captions in part 1's style (when a voice exists), loudness within 3 LU. The picture is new.
7. **No dead air:** the end card keeps the beat/chord tail to the last frame (held ≥ 1.5 s).
**Voice:** the narrator's clone or none. Never TTS (`voice-clone.md`, `autopilot.md` §6).
**Never fabricate** a screenshot of a real business's site, a review, or a Vilas client. No placeholder boxes or wireframes standing in for a website.
**Format:** render at the original's aspect ratio and **fps**; `assemble.py` scales to the original's exact size and pix_fmt. Never upscale the original.

### 4. Assemble
```
python3 -I scripts/assemble.py --orig upload.mp4 --part2 part2.mp4 --audio2 part2.wav --out final.mp4 --crf 10
        [--cut-frame N --audio-cut SEC]            # word swap: keep frames 0..N-1 and the audio up to SEC
        [--replace S:E:DIR ...]                    # GOPs with covered marks (frames from `scripts/gop.py extract`)
```
Stream-copies every untouched original frame and verifies them bit-identical, re-encodes only the edited GOPs, proves each decodes to its source (PSNR),
checks part 2 as joined, checks the original audio's SNR. Prints `ALL CHECKS PASSED` or `FAIL` with the reason: don't ship on FAIL (verify by hand
before "fixing" a FAIL that looks wrong). It stops if the original isn't H.264.

### 5. QA (all must pass; two fix attempts, then label the failure)
- [ ] `python3 -I scripts/qa.py final.mp4 --cut SEC --max-part2 7 [--voice-file voice.wav | --no-voice]` prints **ALL QA CHECKS PASSED**
      (`hard_cut`, `audio_hit`, `dead_air`, `loudness`, `length`, `voice`). Calibrated: railgun and vehicle pass, sloth fails.
- [ ] `assemble.py` says ALL CHECKS PASSED, and the changed frame ranges equal the edit list.
- [ ] **The seam:** `strip.sh` ±2 s at 6 fps (no black frame, no caption-style jump) and `envelope.py` ±0.3 s. Read the sentence across the seam as text.
- [ ] **Every covered mark:** `compare_cover.py` before/after of EVERY changed frame, then 4× zoom contact sheets, then **re-scan the final video** in 20 s strips for any creator name left anywhere.
- [ ] Every slam/claim is in the message bank; demos are labelled if shown.
- [ ] Hype audio: `audio.py` voice margin ≥ 7 dB in every third (if a voice exists).
- [ ] **The cold-watch test:** read it as a stranger: contact sheet of part 2, the slams with timings, the seam strip. Does the hit land? If it reads as "ugh, an ad" or "huh?", fix the picture before polishing.

### 6. Deliver
- `final.mp4`, `plan.md` (ending read, edit list, cfg used, QA output pasted, sources for any number) and `caption.txt`.
- **The caption is about Vilas** (house style): one hook line that nods at the video, then 2-3 plain sentences using only message-bank claims, a "See the work and start a project at vilas.studio." line, a "Send this to…" line, and 4 hashtags (#webdesign #smallbusiness #localbusiness #websitedesign). No emoji, no #longisland. Suggest a pinned comment. Credit the creator only if Noah asks.
- Repo outputs: `brag-output-YYYY-MM-DD-<slug>/` (final as `brag.mp4`, poster `brag.jpg` = a frame from part 1, `work/` gitignored). On Noah's Desktop: `tiktok-raw/` and `tiktok-edited/`.
- `SendUserFile` caps at 30 MiB: bigger → send a crf-21 preview from the scratchpad and say where the full file is.
- Tell Noah, in a few lines: the style and word-swap/append per video; **exactly which ranges of the original were edited** (marks covered, with the tier; the TikTok-watermark method); that you can't hear audio and what to listen for ("VEE-las"); the endorsement risk if you cloned the narrator; any fallback you took.

## When the upload is unusual (autopilot never asks: decide)
- **No narration, music only:** part 2 is music-only too (the hype template has no voice anyway). Append only.
- **Not in English:** the hype ending has no spoken words except the brand: proceed, append only.
- **Real people on camera, or tragedy/death as the subject:** skip that video and pick a replacement (never land a sales punchline on real harm). Cartoon slapstick is fine.
- **Very long (60 s+):** part 2 stays ≤ 7 s.
- **Horizontal or square:** keep the original's aspect ratio; the template is 9:16 (change `W`, `H`, `CX`, canvas size in `comp/index.html`).
- **It already ends on a brand or logo:** append after it; don't cut it.
- **A mark you can't cover cleanly:** use the tiers in `autopilot.md` §4.3 and say which tier it got. Never ship a visible smear unlabelled.

---

## Appendix: long-form part 2 (ONLY when Noah explicitly asks for a longer, spoken ad, or hands you real captures)
The default is the hype ending above. The long-form ad is a different product: it needs real vilas.studio captures and a voice that is the narrator's.
Never use it as an autopilot fallback (that is how the sloth reel got its hollow box).

### Hinge table
| Ending type | You'll recognise it by | Vilas move | Opening words of part 2 | First picture of part 2 |
|---|---|---|---|---|
| **Word swap** (default when it fits) | The last word is a place or thing the narrator names: "until it hit **Earth**" | The narrator names Vilas: cut that word, say "Vilas Studio" in his voice | Only the replacement words | The falling round hits the wordmark. Funniest option |
| **Arrival** | "came out on the other side", "landed" | They arrive *at* Vilas | "…right onto vilas.studio." | A phone/laptop showing vilas.studio at the last shot's angle |
| **Momentum** | Ends mid-flight/fall/slide | Momentum carries into a screen | "…and kept going. Straight into…" | Same motion, push into a phone screen (image-to-video bridge from `last_frame.png`) |
| **Shape match** | A strong shape fills the last frame (globe, hole, window) | Match-cut to the same shape in the Vilas world | Wordless 1 s, then the line | Globe → Maps globe; window → browser window |
| **Big number** | A huge quantity | Contrast with a small honest one | "That's a lot of [thing]. You know what isn't? …" | Swap in the Vilas price in the same style |
| **Lesson / warning** | "so never…", "that's why…" | Push the lesson one step | "…and never let your business's website look like it's from 2009." | A mock-up labelled "example" → a Vilas demo |
| **Unresolved need** | Someone's lost or stuck | Vilas mirrors the need | "He never found the exit. Kind of like customers on most small-business websites." | Cut on the character's look into a phone |
| **Zoom-out** | Ends wide: space, aerial, map | Zoom back in | "Now zoom in. Way in." | A Maps dive to a storefront → a phone showing a Vilas demo |
| **Question / reveal** | "nobody knows why…" | Answer a better question | "We don't know either. We do know websites." | Hard cut on the beat to the vilas.studio hero |
Long-form hinge laws: first words are a connector (or only the replacement words); brand in the first 2 s; no wink; match before you switch (captions and voice energy, not footage);
never say a word twice across the seam. Score 2-3 candidates 1-5 on picture continuity, word continuity, surprise, fit, honesty; take the top.

### Length and anatomy (Noah's number wins; default 6-15 s, ≤ 40% of the runtime)
| Beat | Length | Job |
|---|---|---|
| Hinge | 1-2 s | Connector + brand name |
| Turn | 1.5-3 s | The second laugh: tie the absurd story to the offer in one line, using the story's own nouns |
| Offer | 3-7 s | 2-3 short plain claims from the message bank, each on its own **real** visual |
| Sign-off | 2-3 s | "vilas.studio" spoken and shown, end card held ≥ 1.5 s |
Write 3 versions of the hinge + turn and pick one. Talk like the narrator (same pace ±10%, short sentences, contractions). Every claim true; every number's arithmetic shown in the plan.
Visuals, best to cheapest: (1) an image-to-video bridge from the last frame (Higgsfield; credits); (2) real captures of vilas.studio and its demos (Playwright in the Jarvis repo,
or screen recordings Noah uploads); (3) motion graphics. **If you don't have real captures, do not build this version: build the hype ending.**
Copy part 1's caption style exactly (measure one chunk's pixel width and baseline, size the font to match: `captionStyle`). Mix part 2 within ±1 LU of the original's tail; voice ≥ 7 dB above everything else in 300-4000 Hz.
Fallback hinge when nothing fits: a deadpan non-sequitur ("Anyway." / "Your business needs a better website.") only with a strong visual match, and tell Noah. (The sloth reel's "Vilas Studio doesn't protect sloths." is what a bad one looks like.)
