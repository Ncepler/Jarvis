---
name: zach-d-reel
description: Turn any viral "story" video Noah uploads (Zack D Films-style 3D what-ifs, weird facts, physics hypotheticals, true-story animations, anything) into a Vilas Studio ad. Part 2 picks up the video's last line and last image and lands on vilas.studio so the ad is the punchline. When Noah asks, it can also swap the narrator's last word for "Vilas Studio" in a cloned voice, end on a hype laser drop, and cover the creator's watermarks. The upload is never edited unless Noah explicitly asks; edits he asks for are done with a minimal re-encode that is verified. Use for "zach-d-reel", "zach d this", "make this a Vilas ad", "add the Vilas ending", "swap the last word", "cover the watermark", "hype ending", "genius marketing", or a bare story-video upload with no other instructions.
---

# zach-d-reel

Noah uploads **part 1**, a video that already works on its own: a 3D "what if", a weird fact, a disaster story, a satisfying process, whatever. You make **part 2**. It continues straight out of part 1's ending and lands on Vilas, so the viewer feels outplayed, laughs, and saves it. That's the "world's most genius marketing strategy" format.

Read first (once per session): `references/vilas.md` (facts, allowed claims, assets) and `references/teardowns.md` (three real ads taken apart). Then, as needed:
- `references/worked-example-railgun.md`: a whole job from brief to delivery, including the mistakes. Read it before your first job.
- `references/editing-the-original.md`: cutting at a word, covering the creator's marks, the verified re-encode.
- `references/voice-clone.md`: same narrator voice in part 2 (Higgsfield).
- `references/hype-ending.md`: the laser-drop ending and its template in `assets/hype-ending/`.
- `references/environment.md`: what is blocked in the cloud session and the workarounds.

## Rule zero: the original is untouched unless Noah asks

Part 1 goes out exactly as uploaded. Unless Noah explicitly asks for it in this conversation, **never**:
- trim, cut, speed up, slow down, crop, reframe, zoom, flip, upscale or downscale it
- recolour, grade, sharpen, denoise or stabilise it
- mute it, duck it, re-voice it, add music under it, or change its volume
- cover, blur or remove its captions, watermark, logo or end frame
- add anything on top of it (no captions, stickers or "part 2" teasers over part 1)

**What Noah has asked for so far**, and so what to offer: cut at a word and put "Vilas Studio" in the narrator's own voice; cover the creator's title/logo so it looks like the background; remove a doubled word at the seam. His standing line is "change nothing else about the original". Do exactly the edits listed, with the protocol in `references/editing-the-original.md`: only the GOPs containing an edit are re-encoded, everything else is stream-copied, and `scripts/assemble.py` proves it.

**Offer, don't assume.** If you see the creator's name, logo or watermark anywhere in the video, or another brand's ad at the end, list each with its timestamps and offer to cover or cut it. Do it only on his yes. Scan the **whole** video first: on railgun the second mark (printed on an object) was missed until Noah pointed it out.

Default (append-only): the original's frames are stream-copied whole, and its soundtrack is re-encoded once at 320k because TikTok/IG downloads use HE-AACv2, which can't be joined losslessly. The sound itself is unchanged and the script checks that. Say this in one line when you deliver.

**Rights:** check with Noah once that he can use the clip. It's fine if it's licensed, his own, or from a creator who allows reuse. If it's a straight repost of someone else's video, say plainly that adding an ad to it risks a takedown or strike on @vilaswebdesign. Mention it once, briefly, then go with his call.

## The workflow

### 1. Watch it (you can't play video, so do this)
`bash scripts/watch.sh <upload> <workdir>/watch` gives contact sheets (2 fps), `ending.png` (the last 3s at 6 fps), `last_frame.png`, the hard cuts, and loudness. Look at **every** sheet. Read the burned-in captions to get the script. For exact timing use `bash scripts/strip.sh <video> <start> <dur> <fps> <out.png>` (timestamped frames) and `python3 scripts/envelope.py <video> <t0> <t1>` (10 ms audio levels: where words and gaps are). There is no speech-to-text in the cloud session (`references/environment.md`): if there are no captions, ask Noah for the last two lines. Never guess dialogue.

### 2. Read the ending (write this down in the plan)
The whole ad is built off the **last ~2 seconds**. Fill in:
- **Story in one line:** what happens, to whom.
- **Last line, exact words**, including whether it ends mid-sentence, and its **last word** (is it a place or thing the brand could replace?).
- **Last picture:** the subject, the dominant object or **shape** and where it sits in frame (e.g. "globe, centred, 60% width"), the **motion** (direction and speed: falling, flying, spinning, still), the setting, the light and palette.
- **Ending type:** word swap, arrival, momentum, shape, big number, lesson, unresolved need, zoom-out, or question/reveal (see the hinge table).
- **Narrator:** voice type, pace (words/sec from the captions), and tone (deadpan explainer, dramatic, hype).
- **Captions:** font look, weight, case, size as a % of frame width, vertical position %, stroke/shadow, and words per chunk. Measure these on `last_frame.png`.
- **Audio tail:** does music keep playing to the last frame or end hard? What's the tail loudness?
- **Creator marks:** every watermark/title/logo with its time range (whole video).
- **If a word swap is on the table:** the frame where the caption flips to the word you'd drop, the keyframes (`python3 scripts/gop.py keyframes <v>`), and the audio gap before that word.

### 3. Pick the hinge (this is where the ad lives)
The hinge is the first ~2 seconds of part 2, which pick up the ending's **words** and **picture** and point them at Vilas. List 2–3 candidates from this table and score each 1–5 on **picture continuity**, **word continuity**, **surprise**, **fit** (does a website naturally belong there?) and **honesty** (does it need a fact you can't back up?). Take the top score, and note the runner-up in the plan.

| Ending type | You'll recognise it by | Vilas move | Opening words of part 2 | First picture of part 2 |
|---|---|---|---|---|
| **Word swap** (edits the original: needs Noah's yes) | The last word is a place or thing the narrator names: "until it hit **Earth**", "landed in **Paris**", "…the **ocean floor**" | The narrator himself names Vilas: cut that word and say "Vilas Studio" in the same sentence and voice | Only the replacement words ("Vilas Studio"), landing on a hit | What the dropped word would have shown, now the brand: the falling round hits the wordmark. Funniest option: Noah chose it on railgun, so offer it whenever the last word can become the brand |
| **Arrival** | "came out on the other side", "ended up in", "landed", "woke up in" | They arrive *at* Vilas | "…right onto vilas.studio." / "…at the one place with a decent website." | The arrival point *is* a screen: a phone or laptop showing vilas.studio, at the same angle as the last shot |
| **Momentum** | Ends mid-flight, fall, launch, slide, explosion, throw | Momentum carries on into a screen | "…and kept going. Straight into…" | The same motion direction and speed continues, then the camera pushes into a phone screen. Best done as an image-to-video bridge from `last_frame.png` |
| **Shape match** | A strong shape fills the last frame: globe, circle, hole, pipe, window, door, eye, coin, screen | Match-cut to the same shape, same size and same spot, in the Vilas world | Can be wordless for 1s, then the line | Globe → a Maps globe that dives to a main street; hole or pipe → phone camera cutout; window → browser window |
| **Big number** | Ends on a huge quantity, time, distance or cost ("30 times around the planet") | Contrast the big number with a small honest one | "That's a lot of [thing]. You know what isn't? …" | Hold the number style from part 1, then swap in the Vilas price from the message bank, set the same way |
| **Lesson / warning** | "so never…", "that's why…", "which is why you should…" | Push the lesson one step further | "…and never let your business's website look like it's from 2009." | Same framing, cut to a dated-looking site (a mock-up labelled "example", never a real business) → a Vilas demo |
| **Unresolved need** | Someone's lost, stuck, can't find something, nobody helps | Vilas mirrors the need | "He never found the exit. Kind of like customers on most small-business websites." | Cut on the character's look or gesture into a phone in someone's hand |
| **Zoom-out** | Ends wide: space, aerial, map, crowd | Zoom back in | "Now zoom in. Way in." | A Maps-style dive from the same wide view down to a street → a storefront → the phone on its counter showing a Vilas demo |
| **Question / reveal** | "nobody knows why…", "the answer is…", a cliffhanger | Answer a better question | "We don't know either. We do know websites." | Hard cut on the beat to the vilas.studio hero |

**Fallback, when nothing fits:** a deadpan non-sequitur. "Anyway." (beat) "Your business needs a better website." It's the weakest option, so only use it with a strong visual match, and tell Noah it's the fallback.

**Hinge laws** (all four references obey them):
- Part 2's **first words are a connector**, or, for a word swap, only the replacement words: "…to", "…and", "…or", "…right into", "…which", "…unless". The sentence feels like it never stopped.
- **Say the brand name in the first 2 seconds of part 2** (in the first second for a word swap). "Vilas" or "vilas.studio" lands on the hinge, not after it.
- **No wink.** No "but seriously", no record scratch, no "this video is sponsored". Deliver it deadpan, as if this was always where the story was going.
- **Match before you switch.** The first second of part 2 copies part 1's caption style, voice energy, and (where possible) framing and motion. Only after that does it become the Vilas world.
- **Never say a word twice across the seam.** Write down the exact words the kept audio ends on; part 2 adds only what's new.

### 4. Write what part 2 says
**Length: Noah's number wins** ("about 5 seconds" → 5–6s). With no instruction: 6–15s, never more than ~40% of the final runtime; if part 1 is under 20s, part 2 is 8s at most. Anatomy (stretch or squeeze to fit):

| Beat | Length | Job |
|---|---|---|
| Hinge | 1–2s | Connector + brand name (from the table above) |
| Turn | 1.5–3s | The second laugh: tie the absurd story to the offer in one line ("Getting dragged 100 feet through a pipe is optional. Looking legit online isn't.") |
| Offer | 3–7s | 2–3 short, plain claims from the message bank in `references/vilas.md`, each on its own real visual |
| Sign-off | 2–3s | "vilas.studio" spoken and shown. End card held ≥ 1.5s |

How to write it:
- **Use the story's own nouns.** If the video is about gas, the turn line is about gas. That reuse is what makes it feel written for this video and not stapled on.
- **Talk like the narrator.** Same pace (±10% words/sec), same register. Short sentences, contractions, sentence case. No hype words (elevate, solutions, unleash, empower, cutting-edge), no emoji, no stacked exclamation marks.
- **Every claim has to be true.** Only use claims from the message bank. Do the arithmetic for any number and show it in the plan. No fake clients, reviews, stats, "#1", or guaranteed rankings or leads. Demos are always labelled "demo" on screen.
- **Write 3 versions of the hinge + turn** and pick one. The first idea is rarely the funny one.
- **Hype mode.** When Noah says "hype", "lasers", "~5 seconds": the story's last object smashes into the brand name, the name explodes into a laser show, 3-5 message-bank words slam in on the beat, end card. Everything is in `references/hype-ending.md` and the template `assets/hype-ending/`.

### 5. Build part 2
- **Format:** render any size with the original's aspect ratio (1080×1920 for 9:16) at the original's **fps**; `assemble.py` scales it to the original's exact size and pix_fmt. Never upscale the original to match yours.
- **Captions:** copy part 1's caption style exactly (position, chunk size, weight, shadow) for the whole of part 2. Copying the caption style was the main reason the Local Area Burger ad felt seamless. In a word swap, the first caption can repeat the kept word ("hit Vilas Studio"): the viewer is reading the original's last word too.
- **Voice:** if part 1 has narration, part 2 has narration too. Same voice → `references/voice-clone.md` (clone the narrator; you can't hear it, so tell Noah what to listen for). Otherwise TTS via HyperFrames `/media-use`. Mix part 2 within ±1 LU of `loudness_tail.txt`; voice ≥ 7 dB above everything else in 300–4000 Hz; never a silent gap at the seam.
- **Visuals, best to cheapest:**
  1. **A bridge shot from the last frame** (momentum and shape hinges): image-to-video with `last_frame.png` as the start frame (Higgsfield). Get Noah's OK before spending credits, and keep it to 3–5s.
  2. **Real captures** of vilas.studio and its demos: screen recordings Noah uploads, or Playwright captures if you have the repo or network. See `references/vilas.md`.
  3. **Motion graphics:** the hype template, or HyperFrames / ffmpeg + Python for counters, a Maps-style zoom, the price swap, the end card.
- **Never fabricate** a screenshot of a real business's website, a review, or a Vilas client. Mock-ups of a "bad old website" are labelled "example".
- End card: Vilas wordmark + "vilas.studio" (spec in `references/vilas.md`; the hype template has its own ink/amber version), held ≥ 1.5s.

### 6. Assemble
```
python3 scripts/assemble.py --orig upload.mp4 --part2 part2.mp4 [--audio2 part2.wav] --out final.mp4
        [--cut-frame N --audio-cut SEC]            # word swap: keep frames 0..N-1 and the audio up to SEC
        [--replace S:E:DIR ...]                    # covered-watermark GOPs (frames from `scripts/gop.py extract`)
```
It stream-copies every untouched original frame and verifies them bit-identical, re-encodes only the edited GOPs (and the last partial GOP of a non-keyframe cut), proves every re-encoded range decodes to its source (PSNR), checks part 2 as joined, and checks the original audio's SNR. It prints `ALL CHECKS PASSED` or `FAIL` with the reason: **don't ship on FAIL**. It stops if the original isn't H.264 (ask Noah before re-encoding all of it). Covering marks and cutting: `references/editing-the-original.md`.

### 7. QA (all must pass)
- [ ] `assemble.py` says ALL CHECKS PASSED (and for edits: the list of changed frame ranges equals the edit list, nothing else).
- [ ] **The seam:** `strip.sh` ±2s around it at 6 fps (no black frame, frozen frame or caption-style jump) and `envelope.py` ±0.3s at 10 ms (the sound never drops to silence). **Read the sentence across the seam as text:** the original's last kept words + part 2's first words must be one clean sentence with no doubled word.
- [ ] The brand name lands within the first 2s of part 2 (first second for a word swap).
- [ ] Part 2 is within Noah's length, or ≤ 40% of the runtime and 6–15s by default.
- [ ] Every claim is in the message bank. Every number has its working in the plan. Demos are labelled.
- [ ] **Every covered mark:** contact-sheet the changed ranges zoomed 4× (letters, glow, aberration copies, slivers at the frame edge, protected elements intact), then **re-scan the final video** for any creator name left anywhere.
- [ ] Hype audio: `audio.py` prints a voice margin ≥ 7 dB in every third of the line.
- [ ] **The cold-watch test:** read the whole thing as a stranger: contact sheet, the script with timings, the seam strip. Does the hinge get at least an exhale-laugh? If it's "huh?" or "ugh, an ad", rewrite the hinge before polishing anything else.

### 8. Deliver
- `final.mp4`, `plan.md` (the ending read, hinge candidates and scores, the edit list, the part 2 script with timings, sources for any number, the asset list) and `caption.txt`.
- **The caption is about Vilas** (Noah's call on railgun: "almost entirely Vilas related"). House style, like the other reel captions: one hook line that nods at the video, then 2-3 plain sentences using only message-bank claims (what Vilas builds, the niches that have a demo, "from $300", anywhere in the US), a "See the work and start a project at vilas.studio." line, a "Send this to…" line, and 4 hashtags (#webdesign #smallbusiness #localbusiness #websitedesign). No emoji, no #longisland. Suggest a pinned comment ("the railgun was a bit. the websites are real → vilas.studio"). Credit the creator only if Noah asks.
- In the Jarvis repo, outputs go in `brag-output-YYYY-MM-DD-<slug>/` (final as `brag.mp4`, poster `brag.jpg` = a frame from part 1, never the end card; `work/` is gitignored). Anywhere else, put them in the outputs folder.
- Tell Noah in a few lines: which hinge you used and why; **exactly which ranges of the original were edited** (or that it is verified untouched); that you can't hear audio and what to listen for (the brand's pronunciation, "VEE-las"); and, if you cloned the narrator, the endorsement risk, once.

## When the upload is unusual
- **No narration, music only:** part 2 is music-only too. The hinge is purely visual (shape or momentum) plus captions in part 1's style.
- **Not in English:** ask Noah which language part 2 should be in.
- **Real people on camera, or tragedy/death as the subject:** stop and ask. Don't land a sales punchline on real injuries, deaths or disasters. Fictional cartoon slapstick is fine.
- **Very long (60s+):** part 2 still stays at 15s or under unless Noah says otherwise.
- **Horizontal or square:** keep the original's aspect ratio and build part 2 to match (the hype template is 9:16; change its design units).
- **It already ends on a brand or logo:** see Rule zero. Ask before cutting.
- **A mark you can't cover cleanly** (busy background, huge logo): show Noah the frame and ask; don't ship a smear.
