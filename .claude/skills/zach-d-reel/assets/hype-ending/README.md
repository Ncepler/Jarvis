# hype-ending template
A laser-drop ending for a Vilas ad: falling object hits the wordmark, two impacts on the spoken name, a 150 bpm laser show,
word slams, end card. Edit `cfg.json`; picture (`comp/index.html`, rendered by `render.mjs`) and sound (`audio.py`) both read it.
Full instructions, the timeline and the design rules are in `../../references/hype-ending.md`. `cfg.opening` picks the first 0.66 s: `"orb"` (generic: hard cut to a new screen, hit on frame 0, an orb falls into the name; the default for every video) or `"round"` (the railgun's round). The drop, slams, laser show and end card are generic. `voice` and `caption` are optional: with neither, the template renders a voiceless ending. A second look, purple/blue/red with laser stick-figure dancers, is in `presets/locate-dancers/` (`opening` `"orb"` or `"pin"`). Gate any result with `../../scripts/qa.py`.
Needs: node + playwright + Chromium + ffmpeg (picture); python3 + numpy + scipy + pyloudnorm (sound).
