# Reel: "Website speedrun, any%" (queue idea #11, process as a game · SEND · PROFILE)

Queue idea #11 from `instagram_posts`. Built with /brag (brag-slim path). 18.8s, 1080×1920.

## Angle
The real /start intake form run as a speedrun, with a LiveSplit-style overlay: a run timer, splits for the form's **real**
step names (Contact, Brand, Content, Customize, Submit), green deltas, and a gold PB. The ending card reads "Your part: done." / "Our part: live in days, not months." (the site's own `COPY.headings.process`).

## Honesty (the idea's hard rule)
- The note required either Noah's real fill time or a visible speed tag. We had no human run, so the footage is labelled what it is: **TAS** (tool-assisted). A badge in the top bar and a line under the timer say "a bot filled this in", and the PB card says "the bot's time. yours: about five minutes."
- The timer is the actual on-screen time of the footage. The deltas compare against the form's own copy, "Takes about five minutes", spread evenly over the five splits. No invented times.
- Nothing was submitted. This deploy has no Supabase env, so `IntakeForm` can't send. The capture stops on the Submit press, and no `intake_submissions` row exists.
- The local-only "Heads up: this form isn't wired up…" notice is hidden in the capture, because production visitors never see it.

## How it was captured
`cap.mjs` drives the real form at 360×640 @3x with Playwright and takes one screenshot per micro-action: a few characters typed, a click, a scroll step. Along the way it picks the Basic tier, the Lawn care style, the template palette and no logo, fills services and hours (Sunday closed), skims the prefilled Customize page, writes a brain dump and ticks the terms. Each screenshot records the cursor target. The comp glides a pointer between targets and plays every screenshot for `hold × 1.55` frames.

## Storyboard
| Time | Beat |
|---|---|
| 0–1.5 | "WEBSITE SPEEDRUN any%" title over the dimmed form, 3-2-1-GO, timer at 0:00.000 |
| 1.55–11.9 | The run. A split chime and a green delta on each step |
| 11.9–14.1 | Submit pressed, the timer stops, gold PB!, "the bot's time. yours: about five minutes." |
| 14.1–18.1 | Bone card: "Your part: done. / Our part: live in days, not months." vilas.studio/start |
| 18.1–18.8 | Reset to the title card at 0:00.000 (loop) |

## Sound
An original numpy chiptune (square lead, triangle bass, noise drums) at 150 BPM, beeps, key ticks, a split chime, a PB fanfare and a calm outro chord. -15 LUFS.
Poster = frame 375 (the PB card with all five splits green), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8904`, `PORT=8904 node render.mjs events`, `python3 sound.py`, `PORT=8904 node render.mjs video video.mp4`, `bash finish.sh 375`.
