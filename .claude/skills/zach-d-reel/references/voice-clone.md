# The narrator's voice in part 2 (Higgsfield voice clone)

**A voice is REQUIRED on every reel** (Noah, 2026-10-12: "these new edited clips don't use any voice audio, which is a problem"). The narrator's own (cloned) voice finishes his sentence:
he says "...until it hit" in the original, and the clone says "Vilas Studio". Higgsfield is used **only for audio** in this skill (voice clone, preset voice). Never Higgsfield images or video.
Ladder when the clone fails: Higgsfield preset voice -> Kokoro (`scripts/tts_kokoro.py`). There is no voiceless option: `qa.py` fails it (`voice`, `voice_in_mix`).

## The line and the spelling (exact)
- The clone says ONLY the replacement words (`transitions.md` §1): 0-2 small words + the brand. Never a word the kept audio already says ("hit hit" happened once).
- In the TEXT sent to the voice model, spell the brand **`Veelahs Studio`**: one word, no hyphen. Examples: `Veelahs Studio.` / `at Veelahs Studio.` / `into Veelahs Studio.` / `Veelahs Studio!`
- Target pronunciation: **VEE-lahs**, stress on VEE ("VEE" as in "see", "lahs" short and soft as in "Las Vegas"). Not "VY-las", not "VILL-us", not "vee-LAHS".
- Why: the espeak-ng phonemizer (what Kokoro uses) reads "Veelahs Studio" as /ˈviːləz ˈstuːdioʊ/ (one stress, on VEE). "Vee-lahs" / "Vee-las" get a second stress (VEE-LAHS). Plain "Vilas" comes out VY-las in some neural voices.
- On screen and in post text it is always `Vilas Studio`. The phonetic spelling never appears anywhere a viewer reads.
- If Noah reports a take said it wrong: regenerate with `Veelahs, Studio.` (the comma adds a tiny pause after the stressed syllable).

## Recipe (Higgsfield `seed_audio`)
1. **Reference clip:** the narrator alone, 10-30 s, no music if possible: `ffmpeg -i upload.mp4 -t 20 -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 192k ref.mp3`
2. **Get it into Higgsfield:** `media_upload` (+ the PUT it returns, then `media_confirm`). If the upload host is blocked (Claude Code cloud session: `upload.higgsfield.ai` is), push `ref.mp3` to a throwaway branch
   `tmp-voice-ref-<date>` of the public repo, `media_import_url` the raw.githubusercontent URL pinned to that commit SHA, then delete the branch, and tell Noah it was public for a minute.
3. **Generate** with `generate_audio_batch`: model `seed_audio`, `medias: [{value: <media_id>, role: "audio_references"}]`, `format: wav`, `sample_rate: 44100`, `use_unlim: false`, text = the line above.
   Three variants: `Veelahs Studio.`, `Veelahs Studio!` with `speech_rate: 10`, and the line with its small lead word if the slot needs one ("at Veelahs Studio."). `get_cost: true` first (~0.2 credits per take); check `balance`. Poll with `jobs_wait`.
4. **Fetch the result.** Download it directly if you can. In the cloud session the Higgsfield CDN is blocked: download inside the Composio workbench (`COMPOSIO_REMOTE_BASH_TOOL`, `curl`), trim silence and pick the take there
   (20 ms RMS envelope with numpy), encode the winner to opus ~40k, `base64 -w0`, write it locally, verify md5 (`environment.md`).
5. **Check it** (you can't hear it): `python3 scripts/pitch.py upload.mp4 voice.wav` (same register as the narrator), `qa.py`'s `voice` check, and the onsets (`python3 scripts/envelope.py voice.wav 0 2`).
6. **Condition:** high-pass 80 Hz and normalise happen in `audio.py`; trim leading junk with `voice.trimStart`; `atempo` only if the narrator is clearly faster (railgun 1.08). Keep the file at any sample rate: `audio.py` resamples it with ffmpeg
   (before 2026-10-12 the laser template mixed a 44.1 kHz clone raw at 48 kHz: the vehicle reel's voice was 9% fast and ~1.5 semitones high).
7. **Mix:** `cfg.voice` in the template (`landsOn: "tImp1"`, `onsetInClip` = where "Vee-" starts). `audio.py` ducks everything under it and prints the margin: >= 7 dB on all thirds.
8. **Prove it is in the final:** `qa.py --voice-file voice.wav` runs `voice_in_mix` (the same waveform must be found in `final.mp4` at the landing, correlation >= 0.35).

## Fallback rungs
- **Preset voice:** `list_voices`, `seed_audio` with `voice_type: preset`, the male voice nearest the narrator's register, same text with "Veelahs".
- **Kokoro (offline):** `python3 -I scripts/tts_kokoro.py "Veelahs Studio." --voice bm_george --out voice.wav` (then `am_michael` / `am_adam`). An audible voice change at the seam weakens the trick: say it in the delivery.

## You cannot hear it. So:
- Say so, and tell Noah exactly what to listen for: **"VEE-lahs"** with the stress on VEE, and whether the clone's tone matches the narrator at the seam.
- Report the numbers that passed: pitch register, voice margin, `voice_in_mix` correlation.

## Risk to flag once
The clone is the creator's narrator saying the brand's name. It can read as the creator endorsing Vilas, and it goes beyond the usual reuse risk. Noah asked for the same voice, so do it, but say it in one line in the delivery.
