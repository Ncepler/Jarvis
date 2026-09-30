# Reel #12: "How a referral dies in the group chat" (relatable narrative · SEND)

Queue idea #6 from `instagram_posts` (id `01364e8b-a1d5-48f5-bdfc-ee7039563fa9`).

## Pick
- **Hook:** frame one is a chat with the keyboard up; the ask types itself in: "anyone know a florist?? need something by saturday".
- **Send test:** people send it to the friend who always asks for recs; owners send it to each other.
- **Duh test:** the broken preview is specific (spinner, then an empty-image glyph and a bare URL), not a vague "bad website".

## Build
- The chat is a generic UI drawn on a 2D canvas (no real app's look or name), every frame a pure function of the frame number: status bar, "brunch crew" header, bubbles that spring from their tail corner and push the thread up, typing dots, keyboard with per-character key presses, a heart reaction.
- **The broken link** is `rosies-flowers.example`, a reserved `.example` domain that can't belong to anyone.
- **The good link** is built from the florist demo's own page: the card image is the hero photo from the first entrance frame, the title is the demo's name (Wildstem Florals), the description is its hero line, and the domain row says "vilas.studio · demo site".
- **The site is real:** `cap.mjs` opens `/demos/demo-florist` at 360×640 @3x (= the reel frame), seeks every time-based animation frame by frame for the hero entrance (48 frames), then records a real ease-in-out scroll to the bouquet price list, one screenshot per video frame (72 frames), so sticky scenes and the mobile Call/Order bar behave exactly as they do on a phone. The "DEMO BUILD" pill is in the header.
- The tap morphs the card's image box into the full screen (the source crop grows with it), and the swipe back slides the site off with the chat parallaxing in.

## Beat sheet (16s, 480 frames)
| Time | Beat | Sound |
|---|---|---|
| 0–1.4 | The ask types in; send | key clicks, send blip |
| 1.9–3.6 | Dana types, sends a link: grey card, spinner, then an empty-image glyph and `rosies-flowers.example` | receive blip + haptic |
| 3.5–4.2 | "it's not loading lol" / "is that place still open?" | send blips |
| 4.8–5.85 | Priya: "try this one" + the Wildstem Florals card | receive + haptic |
| 6.9–7.75 | Tap, the card grows into the site | felt tap, whoosh |
| 7.75–12.3 | Hero entrance, then a real scroll to the price list | a soft plucked tune (only while the site is open) |
| 12.3–12.8 | Swipe back | the tune stops mid-note |
| 12.95–13.4 | "ordering from them" + a heart on the card | send blip, pop |
| 13.95–15.3 | "Your link is your first impression." + vilas.studio | one quiet e-piano chord |
| 15.3–16 | Thread clears, keyboard comes back up (exact loop) | keyboard whoosh |

Poster (brag.jpg) = frame 200 (both cards on screen), baked in as frame 0. Audio -16 LUFS (sparse foley; -14 made the ticks harsh).

## Honesty
Names and messages are fictional. The florist is a demo (caption says so). No real app branding.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8896`, `PORT=8896 node render.mjs events`, `python3 sound.py`, `PORT=8896 node render.mjs video video.mp4`, then mux with frame 200 as frame 0.
