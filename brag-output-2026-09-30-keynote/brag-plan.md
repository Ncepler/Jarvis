# Reel #6: "Introducing: the phone number" (reel-lab hook 19, defamiliarization as a parody launch)

Queue idea #2 from `instagram_posts` (id `ab34ed79-4c37-4023-a59f-3bc6aa946185`).

## Pick
- **Hook family:** reel-lab 19, defamiliarization played as a deadpan product keynote (SEND · COMMENT).
- **Frame one:** a black stage, a light shaft, and "Introducing." A phone is already rising through the floor.
- **Duh test:** passes only because it's fully produced. Everything here is built to look expensive: a real 3D stage, a mirror floor, a volumetric beam, and dead air.
- **Send test:** owners send it to the one friend whose phone number is a picture. Comment bait: "you forgot ___".

## Build
- The whole stage is **three.js 0.186** (vendored from node_modules), rendered frame by frame through SwiftShader:
  - a `Reflector` mirror floor under a radial darkening veil
  - an open-cone volumetric beam (additive shader, faded near the floor so there's no horizon line) that sweeps in, plus a matching SpotLight
  - `RoundedBoxGeometry` phone (physical metal + clearcoat) with a black glass front
  - the screen is a live `CanvasTexture` composited per frame from real captures of `/demos/demo-autobody` at 3× DPR
- **Type:** a 2D canvas over the WebGL canvas. Inter 600 titles, Inter 500 grey subtitles, and Inter 100 at 560px for the spec numerals.
- Real page elements used: the hero's "Call (516) 555-0143" button (macro + tap ripple), the footer's "Mon–Fri 8am–6pm · Sat 9am–1pm" line (cropped from the capture and lifted out of the screen as its own card, leaving a dashed gap behind), the hero for the load beat, and a 1.4× full-page capture for the final flick-through that ends on the "Site created by vilas.studio" footer.

## Beat sheet (24s, 720 frames @30)
| Time | Beat | Sound |
|---|---|---|
| 0–2.0 | Beam sweeps in, the phone rises through the floor and turns. "Introducing." | Low whoosh + sub swell, D-major strings already sounding |
| 2.0–5.0 | Macro push onto the call button, tap ripple. "The phone number." / "(You can tap it.)" | Piano D5, tap click |
| 5.0–9.0 | Spec slide: thin 1 \| 0. "tap to call" / "times you copy-paste it" | Piano F♯5, A5 (Bm) |
| 9.0–13.0 | The hours line lifts out of the footer and floats over the reflection. "Hours." / "Where you can see them." | Piano B5 (G), shimmer |
| 13.0–17.0 | Blank screen, orange load bar fills in 0.7s, page appears. "It opens." / "Before you leave." | Piano C♯6 (A), rising tone, click |
| 17.0–18.6 | Cut to black. "One more thing." Dead air. | **Total silence** (tails killed too) |
| 18.6–21.0 | Warm orchestral hit. The hero with a labeled "PHOTO OF YOUR ACTUAL SHOP" frame where the photo goes. "A photo of your actual shop." | Strings + brass + thud + kick |
| 21.0–23.0 | Pull back to wide while the screen flicks through the whole page to the credit footer. "All of it. Standard." + vilas.studio | Resolve up an octave, piano D6 |
| 23.0–24.0 | Phone sinks back through the floor, beam resets, "Introducing." returns (exact loop) | Pad settles to the frame-0 level |

## Honesty / changes from the idea row
- The "photo of your actual shop" beat does **not** show the demo's own hero photo. Captioning a stand-in image "your actual shop" would mislead. It shows the real hero with a labeled placeholder frame where the shop's photo goes (the demo system's own placeholder convention). The "DEMO BUILD" pill is visible in the header throughout.
- Generic keynote look: Inter, no logos, no real company products or type. "One more thing" is used as a phrase only.
- The status bar is generic (time, bars, battery), with no brand UI.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8898`, `PORT=8898 node render.mjs events`, `python3 sound.py`, `PORT=8898 node render.mjs video video.mp4` (about 1.8s/frame), then mux. `render.mjs` accepts `F0`/`F1` env vars to re-render a span and splice it.
