# hype-ending template
A laser-drop ending for a Vilas ad: falling object hits the wordmark, two impacts on the spoken name, a 150 bpm laser show,
word slams, end card. Edit `cfg.json`; picture (`comp/index.html`, rendered by `render.mjs`) and sound (`audio.py`) both read it.
Full instructions, the timeline and the design rules are in `../../references/hype-ending.md`. Section A of `renderFrame`
(the fall) is specific to "a round falls into the name"; the drop, slams, laser show and end card are generic.
Needs: node + playwright + Chromium + ffmpeg (picture); python3 + numpy + scipy + pyloudnorm (sound).
