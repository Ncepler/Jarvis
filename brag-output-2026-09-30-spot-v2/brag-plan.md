# Reel #5 ALT CUT: "Spot the difference" v2 (hero-only flaws, exact 18s loop)

## Answers
- **What is it?** Vilas Studio builds websites for local service businesses.
- **Who's it for?** Owners who think their site is "fine". The small stuff is what costs them calls.
- **What sets it apart?** The details are done right by default: a tappable number, a clear CTA, readable text, a headline that says what you do, photos that aren't distorted.
- **Hook:** a game. Two near-identical phone screens, a 10-second countdown ring, and "5 differences. One of these loses customers."
- **Real UI:** the lawn care demo ("Fresh Cut Lawn Co."), captured twice at 360×780@2x. The flawed copy is the same capture with five DOM edits made in the capture script. It isn't a fake business.
- **Tone:** bright game show on the bone palette, playful tension.
- **Share line:** "How many did you get before the timer ran out?"

## The five flaws (all in the hero, all layout-preserving, so the two pages stay aligned)
1. **stretched photo**: the hero image is scaled 1.6× horizontally.
2. **says nothing**: the headline "Your lawn, handled." becomes "Welcome to our website."
3. **tiny text**: the body paragraph drops from 17px to 11px.
4. **button blends in**: the "Get a free quote" button is washed out into the photo.
5. **number not tappable**: the "Call (516) 555-0148" button becomes plain grey text.

This departs from the queue row, which listed "no hours" and "button below the fold". Hours only appear in the footer, 7,600px down, and pushing the button down would shift the whole page out of alignment. So those two became "says nothing" and "button blends in". The row is updated to match.

## Format
Vertical 1080×1920, 30fps, 18.0s, built to loop exactly (the last frame returns to the frame-0 layout). 120 BPM, which fits the 30fps grid better than the row's 128.

## Storyboard
| Frames | Time | Scene | Sound |
|---|---|---|---|
| 0–300 | 0–10s | "5 differences. / One of these loses customers." A and B phones side by side and a 10-second countdown ring, with a pulse on every tick. The ring turns red for the last three seconds. Both pages drift 90px together to bring the call button into view. | C-major pizzicato bed, a woodblock tick every second, ticks doubling for the last three seconds, a chromatic walk-up and riser |
| 300 | 10.0s | The ring hits 0 and shakes | Buzzer |
| 310–450 | 10.3–15s | Five hand-drawn red loops draw onto B one per second, each with a label | Groove kicks in, with an ascending kalimba ding per circle |
| 458–506 | 15.3–16.9s | A red ✕ stamp on B with a red tint. A gets a green check and "This one's ours." | Stamp thunk and "wah", then a bright chime |
| 506–540 | 16.9–18s | Marks fade, the pages scroll back, and the ring refills to 10, identical to frame 0 | G7 walk-up that loops back to bar 1 |

## Honesty
- The top phone (A) is a real Vilas style, and its "DEMO BUILD" pill is visible.
- The bottom (B) is the same page, broken on purpose, and the caption says so.
- No prices, stats or clients.

## Music
Original numpy-synth game-show bed in C major at 120 BPM: Karplus-Strong pizzicato bass and chords, kalimba motif, woodblock clock, shaker and riser. The reveal has a light four-on-the-floor, claps, and a C–Am–F–G turnaround back to the loop.
