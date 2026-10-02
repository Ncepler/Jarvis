# Reel: "Where are your hours?" (stickman-inspired idea #22, relatable struggle · SEND)

Queue position 22 in `instagram_posts`. Built with /brag (brag-slim path) + canvas. **Not** a Gemini Omni clip. 18s, 1080×1920.

## Where the stickman skill came in (ideas only)
Icon-only obstacle cards (no interface copy beyond a "PDF" / "404" glyph), three timed beats per section, three accents (vivid
red, electric blue, warm gold, which are also the barber pole's colours), one consistent line figure, and an ending that dissolves back into the opening frame.

## Angle
A line-drawn customer rattles a barbershop's door. A "?" bubble. They pull out their phone, and icon cards fly out one at a time:
an old social post (cobwebs), a map pin with a "?", a PDF menu, a broken link (404). Each gets a red X and is flung away while
the figure recoils. Then the phone pushes in to full frame on the **real barber demo** (Standard Barber Co., a demo brand) and flicks
down to its hours board. A gold ring lands on today's row and on the live "Walk-ins open · until 7pm" chip. "right there." The door swings open, the figure walks in and sits in the chair, and "Put your hours / where people look." It dissolves back to frame 0.

## Honesty
- The chip is the real `useWalkInStatus()`, captured with Playwright's clock at Wed 2026-09-30 10:00 UTC (an open day). The hours are the demo's own HOURS table.
- The obstacle cards are generic icons, not any real business's pages.
- "Standard Barber Co. is a demo brand" is on screen the whole time.

## Storyboard
| Time | Beat |
|---|---|
| 0–2.4 | At the door, rattling the handle; "?" bubble |
| 2.4–9.0 | "where are your hours?"; four icon dead ends, each with a red X |
| 9.1–11.8 | The phone pushes to full frame; a flick down the real barber demo |
| 11.9–14.0 | Gold rings on Wednesday + the walk-in chip; "right there." |
| 14.0–17.4 | Pull back; the door opens; walk in, sit; "Put your hours / where people look." |
| 17.4–18 | Dissolve to the opening frame (loop) |

## Sound
A walking bass at 104 BPM (notes flatten during the dead ends), a door rattle, a trombone-ish dip + squeak per dead end, whooshes into and out of the phone, a warm e-piano resolve on the hours, a door creak + shop bell, steps and a chair squeak. -15 LUFS.
Poster = frame 380 (the real hours board with both gold rings), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8907`, `PORT=8907 node render.mjs events`, `python3 sound.py`, `PORT=8907 node render.mjs video video.mp4`, `bash finish.sh 380`.
