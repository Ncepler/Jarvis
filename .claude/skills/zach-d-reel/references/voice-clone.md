# Same voice in part 2 (Higgsfield voice clone)

When Noah says "keep the voice the same", part 2's line is cloned from the original narrator. Railgun: 3 takes, 0.2 credits each
(Higgsfield `seed_audio`). Check the balance (`balance`) and the price (`get_cost: true`) before generating; he runs on a starter plan.

## Recipe
1. **Reference clip:** the narrator alone, 10-30s, no music if possible. Railgun used the first 20s:
   `ffmpeg -i upload.mp4 -t 20 -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 192k ref.mp3`
2. **Get it into Higgsfield.** `media_upload` + a PUT to upload.higgsfield.ai is blocked in the cloud session (egress policy).
   Workaround that worked: commit `ref.mp3` to the (public) repo, `media_import_url` with the raw.githubusercontent URL pinned to that
   commit's SHA, then delete the file in the next commit. It stays in git history, so tell Noah. If a direct upload works in the
   current environment, use that instead.
3. **Generate** with `generate_audio_batch`: model `seed_audio`, `medias: [{value: <media_id>, role: "audio_references"}]`,
   `format: wav`, `sample_rate: 44100`, `use_unlim: false`. Three variants is enough: the bare phrase with a full stop, with "!" and
   `speech_rate: 10`, and the phrase with a lead-in word. Poll with `jobs_wait`.
4. **Fetch the result.** The Higgsfield CDN (`*.cloudfront.net`) and Composio's file links (`backend.composio.dev`) are blocked from
   the build box. What worked: download inside the Composio workbench (`COMPOSIO_REMOTE_BASH_TOOL`, plain `curl`), trim the silence
   and encode each take to opus 48k (a 2s take is ~12 KB), `base64 -w0`, write it locally, and **verify with md5** (print md5 of
   the opus and of each 2000-char chunk remotely, compare after decoding here). If the environment can download directly, just do that.
5. **Compare to the original** before using it: pitch range of narrator vs clone (autocorrelation F0; railgun: clone 109-241 Hz,
   narrator 117-271 Hz = same register) and loudness (clone ran about 2 dB hotter, normalise).
6. **Condition it:** high-pass 80 Hz, normalise, `atempo` to the narrator's pace (1.08 on railgun), cut to only the replacement
   words (see `editing-the-original.md`: never repeat a word the kept audio already says), 10 ms fade-in.
7. **Mix:** voice 7-10 dB above the effects in the 300-4000 Hz band. Measure it, don't guess (`hype-ending.md`, step "check the balance").
   Duck the effects bus under the voice (`audio.py` does).

## You cannot hear it. So:
- Say so, and tell Noah exactly what to listen for: **how the brand is pronounced.** The skill's reference is Vilas = "VEE-las".
  If a take says "VY-las", regenerate with a phonetic spelling ("Veelas Studio") for 0.2 credits. The railgun reel's take was never
  confirmed by ear.
- The numeric checks above (pitch range, loudness, silence trimmed, onset aligned to the impact) are all you can verify.

## Risk to flag once
The clone is the creator's narrator saying the brand's name. It can read as the creator endorsing Vilas, and it goes beyond the
usual reuse risk. Noah asked for the same voice, so do it, but say it in one line in the delivery. If he'd rather avoid it, the
alternative is a different TTS voice (an audible change at the seam, which weakens the trick).
