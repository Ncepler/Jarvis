# hype-ending template (the Vilas spectacle: every reel's part 2)
Part 1's last frame physically moves into a dark world with a metal VILAS / STUDIO wordmark (`"opening": "bridge"`, the moves are in `comp/bridge.js`), the narrator's clone says "Vilas Studio"
and each word ignites on an impact, then a laser drop with word slams and the end card. Edit `cfg.json`; picture (`comp/index.html`, rendered by `render.mjs`) and sound (`audio.py`) both read it.
Start a work copy with `../../scripts/prep_spectacle.sh <orig> <cut frame> <workdir> amber|dancers`. Full instructions and a filled cfg: `../../references/hype-ending.md`.
`voice` is REQUIRED (qa.py fails a voiceless build). Never put a website or demo site in this template. `"look": "photoreal"` is the default; `"round"`, `"pin"`, `"orb"` openings are legacy.
A second style, purple/blue/red with laser stick-figure dancers, is in `presets/locate-dancers/`. Gate any result with `../../scripts/qa.py`.
Needs: node + playwright + Chromium + ffmpeg (picture); python3 + numpy + scipy + pyloudnorm (sound).
