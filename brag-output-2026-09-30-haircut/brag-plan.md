# Reel #8: "Booking a haircut online (it gets worse every time)" (reel-lab hook 20, escalation loop)

Queue idea #4 from `instagram_posts` (id `9329cef1-b916-4bc3-ae81-e0452eeeea00`).

## Pick
- **Hook family:** reel-lab 20, "it gets worse every time" (LOOP · SEND).
- **Frame one:** a touch point already pressing "Book now", with "booking a haircut online / attempt 1".
- **Duh test:** passes. Each pass adds one annoyance you can read at a glance, and the sixth pass flips the joke.
- **Send test:** anyone who's rage-quit a booking page. Barbers send it to each other.

## Build
- Attempts 1–5 are a **fictional, generic booking site** built in HTML/CSS inside the comp page (no business name, no real booking platform, no logos). The overlays are DOM layers animated per frame: a cookie sheet ("842 partners"), "Create an account to continue", a "Select all squares with barber poles" captcha (CSS barber poles, "Please try again."), and a full-screen "Get our app" interstitial whose X really is 4px. The phone number in the footer is a tiny canvas-rendered blurry picture of text.
- Attempt 5: everything stacks, you give up and scroll to the number, long-press (progress ring), the screen shakes, and cracks spread from the press point.
- **The shatter** uses a baked snapshot of that exact cracked frame (`cap/snap.png`), cut into radial shards that fall away with gravity and spin.
- Attempt 6 is **the real barber demo** at the Hours section, captured with Playwright's clock on a Wednesday at 2:30pm. So "Walk-ins open · until 7pm" is `BarberDemo.tsx`'s own `useWalkInStatus()` reading the posted hours. The dot's 2s pulse is redrawn over the capture, and the touch taps the page's own sticky **Call** button (`tel:6315550185`).

## Beat sheet (15s, 450 frames)
| Time | Attempt | New annoyance | Music |
|---|---|---|---|
| 0.0–2.0 | 1 | cookie banner | Jingle, clean, 120 BPM |
| 2.0–4.5 | 2 | + create an account | 132 BPM, ±12 cents, 11-bit |
| 4.5–7.0 | 3 | + barber-pole captcha, wrong tiles, "Please try again." | 146 BPM, ±28c, 8-bit, decimated |
| 7.0–9.5 | 4 | + full-screen app interstitial, two misses at the 4px X | 160 BPM, ±48c, 6-bit, tape wow |
| 9.5–11.5 | 5 | all at once, give up, scroll, the number is a blurry picture, long-press does nothing, shake, cracks | 176 BPM, 5-bit, tape-stops on "give up"; glitch stutter, crack |
| 11.5–15.0 | 6 | shatter into the real barber site, the walk-ins chip, one tap on Call, "one tap. calling…" | Shatter, then clean warm e-piano + pad, generic phone ring on the downbeat |
| 15.0 → 0 | | hard cut back to attempt 1 | the jingle restarts clean |

Every retry hard-cuts the music too, restarting from the top. That's the joke in audio form.

## Honesty
- The annoying site is made up and generic. The caption says so.
- Attempt 6 is a Vilas demo style (the caption says demo). The "DEMO BUILD" pill isn't in frame at the Hours section, so the caption carries it.
- The ring is a generic 440/480 Hz telephone ring, not any phone maker's ringtone.

## Changes from the idea row
- Attempt 6 lands on the Hours section instead of the hero. That's where the walk-ins chip actually lives, and the page's sticky Call bar is right there.
- The screen-shake + crack + shatter is a canvas effect, not a shader.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8900`, render still 344 and crop it to `cap/snap.png` (see the command in session notes: crop x198 y300 684×1482), `PORT=8900 node render.mjs events`, `python3 sound.py`, `PORT=8900 node render.mjs video video.mp4`, then mux.
