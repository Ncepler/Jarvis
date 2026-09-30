# Reel #13: "The museum of dead website features" (defamiliarization + comment trap · COMMENT · SEND)

Queue idea #7 from `instagram_posts` (id `8c10e555-3bed-41c9-a7fb-f1d0e6098023`). Built on the "Introducing" keynote stage, as Noah asked (same mirror floor, volumetric beam shader, dark void, Reflector floor).

## Pick
- **Frame one:** already inside the gallery. A beige CRT on a plinth under a beam, showing a green seven-segment counter at 000417; wall text "The museum of dead website features"; placard "Visitor counter, c. 1997–2009".
- **Comment bait:** "which one did your first site have". **Send:** millennials send it to the friend with the guestbook; restaurant owners' friends send it for the last plinth.

## Build
- three.js stage, 7 exhibits 3.4 units apart, each with its own cone beam, spotlight and floor pool; the camera dollies laterally with slow drift during each hold.
- Exhibits 1–6: a beige CRT (rounded boxes) whose screen is a per-frame CanvasTexture drawn in code with scanlines and vignette: seven-segment counter that ticks 417 → 418; guestbook table with bevelled Sign button; a generic 88×31-style "best viewed with Internet Explorer 5" button (text only, no logo); a Flash loader that always stalls near 87% with a blinking [ skip intro ]; hazard stripes + traffic cone "UNDER CONSTRUCTION, Last updated: 3/14/2001"; a teal "My Favorite Songs" page with a marquee and a player whose controls are a few pixels wide.
- Exhibit 7: a modern phone on its own plinth, lit brighter, showing `menu_FINAL_v3.pdf` zoomed in off-centre with two fingers mid-pinch. The camera pushes in so the phone and its placard fill the frame.
- Placards: bone cards on each plinth face, Fraunces title/years + one deadpan italic line.
- The whip back to the counter at 21–22s lands on frame 0 (the counter reverts to 417 during the whip).

## Placards
| Exhibit | Years | Line |
|---|---|---|
| Visitor counter | c. 1997–2009 | Mostly counted the owner. |
| Guestbook | c. 1998–2006 | Last entry: "cool site!!" |
| "Best viewed in Internet Explorer" | c. 1999–2008 | At 800 × 600. Or else. |
| Flash intro | c. 2000–2012 | Most-clicked button: skip intro. |
| Under construction | c. 1996–2004 | Never finished. |
| Auto-play MIDI | c. 1997–2005 | Mute button: location unknown. |
| The PDF menu | c. 2008 – still in use | Pinch to zoom. Keep pinching. |

## Sound
No score. Room tone + HVAC hum, footsteps on each walk, a counter click. The only music is the exhibit's own original "general MIDI" tune (square lead, e-piano comp, bass), playing from inside exhibit 6 the whole time: faint and low-passed at the start, centred and loud as the camera passes, panned by the camera's real per-frame position, gone by the PDF menu. The tempo fits exactly 3 phrases into the 22s loop. -16 LUFS.

## Honesty
Generic recreations, no real site, logo or product artwork. Dates are approximate and marked "c.". Guestbook names are made up.

## Rebuild
From `work/`: `python3 -m http.server 8895`, `PORT=8895 node render.mjs events`, `python3 sound.py`, `PORT=8895 node render.mjs video video.mp4` (~1s/frame), then mux with frame 20 as frame 0. No captures needed.
