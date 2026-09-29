# Reel #4: "Power washing a website" (reel-lab, hook 18)

## Pick
- **Hook family:** reel-lab hook 18, "No talking. Just ___." (LOOP · SEND). The format is one continuous take of a process with a clear start and finish, where the sound is the point. None of reels #1–3 used this family.
- **Line (frame one):** "power washing / a website"
- **Duh test:** passes. Nobody expects a website under the grime.
- **Send test:** people send it to the power washer they know ("your site needs this"). Power-washing owners send it to each other. Satisfying-video fans send it because it's satisfying. Power washing is also one of Vilas's target niches.
- **Why it's a brag:** the "after" is a real Vilas build (the Tide Line power-washing demo, captured at phone width). Its headline pays off the joke by itself: "Like the day / it was built."

## Checked against `instagram_posts` (reels #1–3), nothing reused
There's no price, tagline payoff, coverflow, odometer, tile outro, card trick, receipt, phone mockup, or address bar. There's also no music. It's the first sound-design-only reel and the first POV/satisfying-genre reel. New devices: procedural grime over the real site, a stripe-by-stripe reveal, a pressure-wand POV with fan spray and flung debris, a wet sheen that dries, a whip pan with real motion blur, and a push-in on the site's own credit line.

## Why not Higgsfield
reel-lab normally generates clips in Higgsfield. This reel doesn't, for two reasons. First, the payoff is real UI, and CLAUDE.md forbids generated video that depicts UI. Second, this sandbox can't download from Higgsfield's CDN anyway. So the whole reel is code-rendered from a real capture of `/demos/demo-powerwash`, and no credits were spent.

## Format
Vertical 1080×1920, 30fps, 17.0s (510 frames), one continuous take with no cuts.

## Beat sheet
| Frames | Time | Beat | On screen | Sound |
|---|---|---|---|---|
| 0–48 | 0–1.6s | **Hook** | The frame is all grime, and the wand is already pulling a stripe down the middle. "power washing / a website" is on screen from frame 0. The first stripe cuts through the headline ("…e day / …built."). | Opens mid-pull: trigger click, pressure burst, jet hiss, grime crackle, a gas engine bogging under load |
| 48–196 | 1.6–6.5s | **Stripes** | Four more serpentine stripes. The headline completes on the last one: "Like the day / it was built." The wet sheen dries behind each pass. | The crackle thins as the jet crosses clean ground. The hiss pans with the wand |
| 196–242 | 6.5–8.1s | **Release** | Trigger off, the wand drops out, the text fades, and the camera pans down with motion blur | Unloader chug, engine revs back up, water drips, a whoosh |
| 242–330 | 8.1–11.0s | **Speed round** | Six fast horizontal sweeps reveal "One visit. / Back to new." | Rhythmic whoosh-whoosh sweeps |
| 330–366 | 11.0–12.2s | **Whip** | A long whip pan down the whole page as a smear of grime | Big whoosh |
| 366–430 | 12.2–14.3s | **Footer** | Three wide stripes reveal the site's cropped "Tide Line Power Washing" wordmark and its credit bar | Jet and crackle |
| 430–510 | 14.3–17.0s | **Credit** | Trigger off, then a slow push-in (1.7×) onto the site's own footer line, "Site created by vilas.studio", then a hold | Engine idles down a bit, drips |
| Loop | | | The idle engine and grimy frame 0 restart as one continuous job. No fade to black. | |

## Honesty
- The site is the real Tide Line demo, a Vilas style build. The CTA is the site's real footer credit ("Site created by vilas.studio"), and the caption says it's a demo.
- The grime is procedural texture, not a fake "before" website, so no business is mocked or misrepresented.
- The `DEMO BUILD` pill sits in the site header, which is out of frame (the camera starts below it). The caption states "demo" instead.

## Sound
No music. That's the format: the washer is the soundtrack. Everything is synthesized in numpy and driven from `events.json`:
- **Engine:** jittered 4-stroke combustion pulses through muffler resonances. It bogs under load and a triplex-pump buzz sits under it.
- **Jet:** a 2–9.5 kHz nozzle hiss with turbulence flutter.
- **Grime:** crackle and grit whose density follows how much grime is under the fan at that moment. It turns smoother and brighter over clean ground.
- **Other:** trigger clicks, pressure bursts, an unloader chug, drips, and camera whooshes.

It's mixed to -14 LUFS. If Noah adds a track in Instagram, keep it under the washer or it stops being this format.

## Rebuild
Run `next start -p 3456`, then:
```
node work/capture.mjs && node work/capture2.mjs
python3 -m http.server 8897   # from work/
node work/render.mjs events
python3 work/sound.py
FFMPEG=... node work/render.mjs video work/video.mp4
```
Then mux `video.mp4` and `audio.wav`.
