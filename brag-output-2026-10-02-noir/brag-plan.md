# Reel: "Who killed the lead?" (queue idea #10, narrative genre parody · SEND · LOOP)

Queue idea #10 from `instagram_posts`. Built with /brag (brag-slim path). 26s, 1080×1920, B&W film noir with one colour element.

## Angle
A murder mystery. The victim is a customer who was about to call, and the culprit is a bad website. Rain on glass, then
a typewriter: "11:42pm. A customer was about to call." Then a chalk outline of a phone on the floor and "11:43. Gone."
Four polaroids get pinned to an evidence board, each a close-up of a flaw on a **fictional, generic** site ("Lawn & Garden Co.", drawn in canvas, not a real business):
- Exhibit A: the number was a picture (pixelated JPEG phone number, a cursor that can't copy it)
- Exhibit B: 9 seconds to load (an in-story detail, not a stat)
- Exhibit C: © 2016 ("Best viewed in Internet Explorer", hit counter)
- Exhibit D: the form went nowhere (404)
String runs from all four to a polaroid of the whole site (tagged "the website (fictional)"), and it gets stamped CULPRIT. Then
case file #2 slides in. It's the only colour in the reel: a real Playwright scroll of the magician demo (Elias Vane, demo
brand), typed "Case file #2: no suspects." It dips to black and back to the rain, which is frame 0.

## Decisions
- The string is pale grey, not red, so the magician demo stays the only colour (the idea's "selective colour" rule beat its "red string").
- No voice narration. brag-slim doesn't do voice, and the typewriter carries the lines.
- Film look: grain, gate weave, flicker, venetian-blind light, vignette. Encoded at CRF 24 because grain is expensive (8.7MB).

## Storyboard
| Time | Beat |
|---|---|
| 0–3.7 | Rain on the window; typewriter: "11:42pm. / A customer was about to call." |
| 3.7–6.5 | Hard cut to the floor: a chalk phone outline draws itself, evidence tent "1"; "11:43. Gone." |
| 6.5–14.8 | Evidence board: the camera pushes in on each polaroid as it's pinned and its tag gets written |
| 14.8–19.2 | Pull back; the culprit polaroid; four strings pull taut; the CULPRIT stamp |
| 19.2–24.2 | Case file #2 (colour): the magician demo scrolls; "Case file #2: no suspects." |
| 24.2–26 | Dip to black, back to the rain (loop) |

## Sound
Original numpy synth. Noir in C minor at 72 BPM: a walking upright bass (Karplus-Strong), brushes, and two muted-trumpet phrases, with a Cm(b9) stab on the stamp. Case file #2 gets the only warm chord (Eb maj7 strings + vibes). Foley: rain the whole way (seamless loop), typewriter + ding, a distant siren, pin thunks, marker scratches, string creaks, the stamp, the folder slide. -15 LUFS.

Poster = frame 560 (the full board with CULPRIT), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8903`, `PORT=8903 node render.mjs events`, `python3 sound.py`, `PORT=8903 node render.mjs video video.mp4`, `CRF=24 bash finish.sh 560`.
