---
name: zach-d-reel
description: Turn any viral "story" video Noah uploads (Zack D Films-style 3D what-ifs, weird facts, physics hypotheticals, true-story animations, anything) into a Vilas Studio ad by APPENDING a part 2 that grabs the video's last line and last image and lands it on vilas.studio, so the ad reads as the punchline. The uploaded original is never edited (no trim, crop, mute, recolour or re-time) unless Noah explicitly asks. Use when Noah uploads a video and says "zach-d-reel", "zach d this", "make this a Vilas ad", "add the Vilas ending", "do the genius marketing thing", "connect this to Vilas", or uploads a short story-style video with no other instructions. Covers watching the video, reading its ending, picking the hinge, writing what part 2 says, building it in the original's style, joining it losslessly, and QA.
---

# zach-d-reel

Noah uploads **part 1**, a video that already works on its own: a 3D "what if", a weird fact, a disaster story, a satisfying process, whatever. You make **part 2**. It continues straight out of part 1's ending and lands on Vilas, so the viewer feels outplayed, laughs, and saves it. That's the "world's most genius marketing strategy" format. Three real examples are broken down in `references/teardowns.md`. Vilas facts, claims you're allowed to make, and assets are in `references/vilas.md`. Read both the first time you use this skill in a session.

## Rule zero: the original is untouched

Part 1 goes out exactly as uploaded. Unless Noah explicitly asks for it in this conversation, **never**:
- trim, cut, speed up, slow down, crop, reframe, zoom, flip, upscale or downscale it
- recolour, grade, sharpen, denoise or stabilise it
- mute it, duck it, re-voice it, add music under it, or change its volume
- cover, blur or remove its captions, watermark, logo or end frame
- add anything on top of it (no captions, stickers or "part 2" teasers over part 1)

Everything you make goes **after** the original's last frame. `scripts/join.sh` does the join: the original's video frames are stream-copied (it verifies all of them are bit-identical), and its soundtrack is re-encoded once at 320k because TikTok/IG downloads use HE-AACv2, which can't be joined losslessly. The sound itself isn't changed, and the script checks that too. Say this in one line when you deliver.

**If the upload already has someone else's ending** (another brand's ad, like all three reference videos), don't strip it on your own. Tell Noah where the original story ends (timestamp, last line) and ask whether you should cut there. Cutting it is an edit, so it needs his yes.

**Rights:** check with Noah once that he can use the clip. It's fine if it's licensed, his own, or from a creator who allows reuse. If it's a straight repost of someone else's video, say plainly that adding an ad to it risks a takedown or strike on @vilaswebdesign. Mention it once, briefly, then go with his call.

## The workflow

### 1. Watch it (you can't play video, so do this)
`bash scripts/watch.sh <upload> <workdir>/watch`. This gives you contact sheets (2 fps), `ending.png` (the last 3s at 6 fps), `last_frame.png`, the hard cuts, and loudness. Look at **every** sheet. Read the burned-in captions to get the script. If there are no captions, run speech-to-text if the environment has it (`hyperframes transcribe`, whisper). If it doesn't, ask Noah for the last two lines. Never guess dialogue.

### 2. Read the ending (write this down in the plan)
The whole ad is built off the **last ~2 seconds**. Fill in:
- **Story in one line:** what happens, to whom.
- **Last line, exact words**, including whether it ends mid-sentence.
- **Last picture:** the subject, the dominant object or **shape** and where it sits in frame (e.g. "globe, centred, 60% width"), the **motion** (direction and speed: falling, flying, spinning, still), the setting, the light and palette.
- **Ending type:** arrival, momentum, shape, big number, lesson, unresolved need, zoom-out, or question/reveal (see the hinge table).
- **Narrator:** voice type, pace (words/sec from the captions), and tone (deadpan explainer, dramatic, hype).
- **Captions:** font look, weight, case, size as a % of frame width, vertical position %, stroke/shadow, and words per chunk. Measure these on `last_frame.png`.
- **Audio tail:** does music keep playing to the last frame or end hard? What's the tail loudness?

### 3. Pick the hinge (this is where the ad lives)
The hinge is the first ~2 seconds of part 2, which pick up the ending's **words** and **picture** and point them at Vilas. List 2–3 candidates from this table and score each 1–5 on **picture continuity**, **word continuity**, **surprise**, **fit** (does a website naturally belong there?) and **honesty** (does it need a fact you can't back up?). Take the top score, and note the runner-up in the plan.

| Ending type | You'll recognise it by | Vilas move | Opening words of part 2 | First picture of part 2 |
|---|---|---|---|---|
| **Arrival** | "came out on the other side", "ended up in", "landed", "woke up in" | They arrive *at* Vilas | "…right onto vilas.studio." / "…at the one place with a decent website." | The arrival point *is* a screen: a phone or laptop showing vilas.studio, at the same angle as the last shot |
| **Momentum** | Ends mid-flight, fall, launch, slide, explosion, throw | Momentum carries on into a screen | "…and kept going. Straight into…" | The same motion direction and speed continues, then the camera pushes into a phone screen. Best done as an image-to-video bridge from `last_frame.png` |
| **Shape match** | A strong shape fills the last frame: globe, circle, hole, pipe, window, door, eye, coin, screen | Match-cut to the same shape, same size and same spot, in the Vilas world | Can be wordless for 1s, then the line | Globe → a Maps globe that dives to a main street; hole or pipe → phone camera cutout; window → browser window |
| **Big number** | Ends on a huge quantity, time, distance or cost ("30 times around the planet") | Contrast the big number with a small honest one | "That's a lot of [thing]. You know what isn't? …" | Hold the number style from part 1, then swap in the Vilas price from the message bank, set the same way |
| **Lesson / warning** | "so never…", "that's why…", "which is why you should…" | Push the lesson one step further | "…and never let your business's website look like it's from 2009." | Same framing, cut to a dated-looking site (a mock-up labelled "example", never a real business) → a Vilas demo |
| **Unresolved need** | Someone's lost, stuck, can't find something, nobody helps | Vilas mirrors the need | "He never found the exit. Kind of like customers on most small-business websites." | Cut on the character's look or gesture into a phone in someone's hand |
| **Zoom-out** | Ends wide: space, aerial, map, crowd | Zoom back in | "Now zoom in. Way in." | A Maps-style dive from the same wide view down to a street → a storefront → the phone on its counter showing a Vilas demo |
| **Question / reveal** | "nobody knows why…", "the answer is…", a cliffhanger | Answer a better question | "We don't know either. We do know websites." | Hard cut on the beat to the vilas.studio hero |

**Fallback, when nothing fits:** a deadpan non-sequitur. "Anyway." (beat) "Your business needs a better website." It's the weakest option, so only use it with a strong visual match, and tell Noah it's the fallback.

**Hinge laws** (all three references obey them):
- Part 2's **first words are a connector**: "…to", "…and", "…or", "…right into", "…which", "…unless". The sentence feels like it never stopped, even though part 1 is untouched.
- **Say the brand name in the first 2 seconds of part 2.** "Vilas" or "vilas.studio" lands on the hinge, not after it.
- **No wink.** No "but seriously", no record scratch, no "this video is sponsored". Deliver it deadpan, as if this was always where the story was going.
- **Match before you switch.** The first second of part 2 copies part 1's caption style, voice energy, and (where possible) framing and motion. Only after that does it become the Vilas world.

### 4. Write what part 2 says
Anatomy and timing (part 2 is 6–15s, and never more than ~40% of the final runtime; if part 1 is under 20s, part 2 is 8s at most):

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

### 5. Build part 2
- **Exact format match:** the original's width × height, fps and pix_fmt (read `watch/probe.txt`). TikTok downloads are often 576×1024 at 30fps, and part 2 is rendered at that, not at 1080×1920. Don't upscale the original to match yours.
- **Captions:** copy part 1's caption style exactly (position, chunk size, weight, shadow) for the whole of part 2. Copying the caption style was the main reason the Local Area Burger ad felt seamless.
- **Voice:** if part 1 has narration, part 2 has narration too, in the closest matching voice (TTS via HyperFrames `/media-use` or whatever TTS is available). Mix part 2 so its integrated loudness is within ±1 LU of `loudness_tail.txt`. If part 1's music runs to the end, start part 2 with its own bed at the same level. Never leave a silent gap at the seam.
- **Visuals, best to cheapest:**
  1. **A bridge shot from the last frame** (for the momentum and shape hinges): image-to-video with `last_frame.png` as the start frame (Higgsfield). The camera continues the last motion and pushes into a phone or laptop screen. Get Noah's OK before spending credits, and keep it to 3–5s.
  2. **Real captures** of vilas.studio and its demos: screen recordings Noah uploads, or Playwright captures if you have the repo or network. See the asset list in `references/vilas.md`.
  3. **Motion graphics** (HyperFrames if available, otherwise ffmpeg + Python/PIL): counters, a Maps-style zoom, the price swap, the end card.
- **Never fabricate** a screenshot of a real business's website, a review, or a Vilas client. Mock-ups of a "bad old website" are labelled "example".
- End card: Vilas wordmark + "vilas.studio" on bone `#efe9dd` with ink `#1f1a14` (spec in `references/vilas.md`), held ≥ 1.5s.

### 6. Join
`bash scripts/join.sh <upload> <part2.mp4> <final.mp4>`. It refuses to run if part 2's size doesn't match, and it prints `VIDEO VERIFIED: all N original frames bit-identical` plus an audio SNR. If it prints `FAIL`, or the SNR is below 20 dB, don't ship it. Find out why.

### 7. QA (all must pass)
- [ ] `join.sh` reports VIDEO VERIFIED and the audio check is transparent.
- [ ] **The seam:** make a 6 fps strip of 2s either side of the seam. No black frame, no frozen frame, no caption-style jump, no audio gap or pop.
- [ ] The brand name lands within the first 2s of part 2.
- [ ] Part 2 is ≤ 40% of the runtime and between 6 and 15s.
- [ ] Every claim is in the message bank. Every number has its working in the plan. Demos are labelled.
- [ ] **The cold-watch test:** read the whole thing as a stranger: contact sheet, the script with timings, the seam strip. Does the hinge get at least an exhale-laugh? If it's "huh?" or "ugh, an ad", rewrite the hinge before polishing anything else.

### 8. Deliver
- `final.mp4`, `plan.md` (the ending read, hinge candidates and scores, the part 2 script with timings, sources for any number, the asset list) and `caption.txt`.
- The caption is about **part 1's topic**, not Vilas ("What happens to the gas you spill at the pump?"), so it doesn't give away the turn. Add 3–5 hashtags, two about the topic and #smallbusiness #webdesign. Suggest a pinned comment that rewards the people who laughed ("the website part is real too → vilas.studio").
- In the Jarvis repo, outputs go in `brag-output-YYYY-MM-DD-<slug>/` (final as `brag.mp4`, poster `brag.jpg` = a frame from part 1, never the end card). Anywhere else, put them in the outputs folder.
- Tell Noah in 3 lines: which hinge you used and why, the part 2 script, and that the original is verified untouched.

## When the upload is unusual
- **No narration, music only:** part 2 is music-only too. The hinge is purely visual (shape or momentum) plus captions in part 1's style.
- **Not in English:** ask Noah which language part 2 should be in.
- **Real people on camera, or tragedy/death as the subject:** stop and ask. Don't land a sales punchline on real injuries, deaths or disasters. Fictional cartoon slapstick is fine.
- **Very long (60s+):** part 2 still stays at 15s or under.
- **Horizontal or square:** keep the original's aspect ratio and build part 2 to match.
- **It already ends on a brand or logo:** see Rule zero. Ask before cutting.
