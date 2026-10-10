# Environment gotchas (Claude Code cloud session, 2026-10)

These were true when the railgun reel was built. Re-check; if something works directly, use the direct way.

| Need | What happened | What to do |
|---|---|---|
| Hear / transcribe the video | No audio playback. Speech-to-text models can't be downloaded (Hugging Face is blocked by the egress proxy). | Read the burned-in captions; `envelope.py` for timing; with no captions the video is append-only (no word swap): never guess dialogue. Say plainly what you could not verify by ear. |
| Upload a file to Higgsfield | `upload.higgsfield.ai` is blocked. | `media_import_url` on a raw.githubusercontent URL (pin the commit SHA); delete the file after (see `voice-clone.md`). |
| Download a Higgsfield result | `*.cloudfront.net` blocked; Composio's `backend.composio.dev` file links blocked too. | Fetch inside `COMPOSIO_REMOTE_BASH_TOOL`, compress, bring back as base64, verify md5. |
| Render canvas frames | Playwright + Chromium work (`/opt/pw-browsers`). `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`, do not `playwright install`. | `assets/hype-ending/render.mjs` (set `CHROME=` if the path differs). |
| Audio synthesis | numpy, scipy, pyloudnorm are installed. | `assets/hype-ending/audio.py`. |
| ffmpeg | Present, with libx264 and `drawtext`. `strip.sh` burns timestamps in using DejaVu Sans Mono at `/usr/share/fonts/truetype/dejavu/`. | If that font path doesn't exist, edit the `fontfile=` in `strip.sh` (or drop the overlay and count frames). |
| Python reading files from an untrusted folder | The session guidance says run `python3 -I` and keep scripts in a different directory than the downloads. | The skill's scripts never import from the data folders; keep it that way. |
| Send a file to Noah | `SendUserFile` refuses files over 30 MiB (a 42 MB reel bounced). | Send a crf-21 copy from the scratchpad as a preview; the full file is in the repo. |
| Bring a Higgsfield take back | Base64 through tool output means retyping it with Write. | Trim and pick remotely; only the winning take, opus 40k (~11 KB). md5 before and after. |
| Worker restart mid-job | The session's worker can restart; the scratchpad and repo survive, shell state does not. | Keep work in `brag-output-*/work/`, re-check what exists before redoing a step. |
| Parallel work | 4 cores. | Run frame ranges of the cover scripts in parallel; render at most a few Chromium pages at once. |
| Long commands | A foreground command that runs past 10 min is moved to the background. | Run long jobs per GOP range, or in the background, and poll the files. Don't write wait-loops that `pgrep` their own command line. |
| Run unattended | Noah is asleep; there is nobody to answer. | `autopilot.md` has every answer. Use the written fallbacks; never ask, never ship the cheap thing silently. |
| Gate the result | You can't hear or play it. | `scripts/qa.py` (needs numpy, scipy): cut, thump, dead air, loudness, length, voice pitch. Pass it before delivering. |
| Chrome tools for TikTok/Snaptik | Browser tools are named `mcp__claude-in-chrome__*`. | Read the `chrome-browser` skill first; open a new tab, don't touch his signed-in tabs; never log in to TikTok. |
| Hype template needs `playwright` | `node render.mjs` imports `playwright` from its folder. | `ln -s <path>/node_modules` into the work copy (the repo has one at `/home/user/Jarvis/node_modules`), or `npm i playwright`. Never `playwright install`. |
