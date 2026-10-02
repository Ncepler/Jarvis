# Reel: "If websites had dating profiles" (queue idea #13, dating-app parody · SEND)

Queue idea #13 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 18s, 1080×1920.

## Angle
A generic swipe app (no real app's branding). Four fictional, generic sites get swiped left with a NOPE stamp, faster each time:
"My love language: Pop-ups." · "My phone number? It's a picture." · "Looking for: someone who can wait 9 seconds." · "Last updated: 2016. Still looking."
Then the power-wash demo's profile (Tide Line, new; a real capture of the hero): "Two truths and a lie: I load fast. My number's tappable. I have a guestbook."
The lie gets struck through. Swipe right → a restrained heart burst → "It's a match." → the profile opens into a real scroll of the demo →
"Worst website red flag you've seen? ↓" → the stack resets.

## Honesty
- Only made-up sites get swiped left (drawn in canvas). An on-screen line says "Tide Line Power Washing is a demo brand · the other sites are made up".
- "My number's tappable" is true: demo phone numbers render as `tel:` links (system.tsx). The demo has no guestbook, so that's the lie.
- Tide Line was reel #4's hero, so post this one well after that one.

Sound: pizzicato pop at 118 BPM with claps, a swipe whoosh + thud per NOPE, a pop per "truth", a chime + chord on the match. -15 LUFS. Poster = frame 330, baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8916`, `PORT=8916 node render.mjs events`, `python3 sound.py`, `PORT=8916 node render.mjs video video.mp4`, `bash finish.sh 330`.
