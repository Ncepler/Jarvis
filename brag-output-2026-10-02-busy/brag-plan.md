# Reel: "The best ones are too busy" (queue idea #14, why → how → what · SEND)

Queue idea #14 (from the local copy of the queue, no Supabase this batch). Built 2026-10-02, second batch, /brag (brag-slim path). 22s, 1080×1920.

## Angle
The belief, which some people would disagree with: the best business in town usually has the worst website, because they're busy doing the work.
"The best barber in town probably has the worst website." → "Same with the best baker. The best landscaper. The best mechanic." → a montage
of the work (demo photography with slow push-ins, illustrative start times 4:00am baker / 6:15am landscaper / 7:00am mechanic / 8:00am barber) → "They're not bad at
websites. They're busy being good at the thing." → the montage freezes and desaturates: "But people who haven't met them yet only see the website." →
plain: the bakery demo's real hero entrance in a phone, no effects, "We build that part." → "For the ones who are busy being good." vilas.studio

## Honesty
- No real people, only archetypes, using photos the demos actually use (`public/previews/firstBarberImage.webp`, `public/demos/bakery/bakehouse-bench.webp`, `public/demos/lawncare/hero-lawn.webp`, `public/previews/car1.1.webp`). `firstAutoBodyImage` was avoided because it shows a car-brand emblem.
- "Demo photography. Start times are illustrative." is on screen during the montage. The baker's 4:00am echoes the bakery demo's own "Baked at 4am."

Sound: felt piano + strings in Bb at 76 BPM, building for 13s. The peak lands on THE GAP (13s) with a swell and a low octave, the reveal sits on one held chord, and the tribe line resolves softly. -16 LUFS.
Poster = frame 50 (the opening line on ink), baked in as frame 0.

## Rebuild
`next start -p 3456`, then from `work/`: `node cap.mjs`, `python3 -m http.server 8919`, `PORT=8919 node render.mjs events`, `python3 sound.py`, `PORT=8919 node render.mjs video video.mp4`, `bash finish.sh 50`.
