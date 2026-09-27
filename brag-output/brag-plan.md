# /brag plan: Vilas Studio (Instagram reel)

## Answers
- **What is it?** Vilas Studio is a web studio that builds sites for local service businesses: florists, barbers, bakeries, contractors, auto body shops.
- **Who's it for / what does it do for them?** Owners whose customers Google them before calling. They get a site that looks like it cost 10x more.
- **What sets it apart?** Public, flat pricing ($300 build + $50/mo on Basic) for sites that look high-end. Nine niche styles, each fit by hand.
- **Most impressive / funniest claim:** the brand's own tagline, "A website that looks expensive. It wasn't." The funny part is the ninth style: a magician.
- **Visual hook:** a dark, photographic renovation site ("Old house. New everything.") playing its real entrance animation, full-bleed, with the question on top.
- **Real UI shown:** all nine live demo sites (captured at phone width from `/demos/*`) and the site's own fractured-tile hero, rebuilt for vertical as the outro.
- **Tone:** polished and cinematic with one punchline. Bone, ink and bronze, Syne display type, restrained motion.
- **Share line:** "Guess what this website cost."

## Angle
The tagline is the script. Set up "expensive", pay it off with "It wasn't." and a real price.

## Format
Vertical 1080×1920, 30fps, 20.0s. Music at 90 BPM (1 beat = 20 frames, 1 bar = 80 frames), and every cut lands on the grid.

## Storyboard
| Frames | Time | Scene | On screen | Sound |
|---|---|---|---|---|
| 0–80 | 0–2.7s | **Hook** | Full-bleed renovation demo replays its real hero entrance while the camera eases in from 1.06. A bone caption card over the photo pops in word by word: "Guess what / this website cost." | Filtered EP chords, shaker, and a reverse swell into the drop |
| 80–120 | 2.7–4.0s | **Pull-back** | The full-bleed site shrinks into a card on the bone canvas and coverflow neighbours slide in. Eyebrow: "WEBSITES FOR LOCAL BUSINESSES". Label: "Style 01/09 · Renovation" | Drop (kick, sub, chords), with a whoosh on the pull |
| 120–320 | 4.0–10.7s | **Montage** | Coverflow advances one card per beat: Florist, Barbershop, Bakery, Landscaping, Power washing, Auto body, Lawn care, then "Even a magician." (3-beat hold). The centre site scrolls. | Groove, with a soft swish on each card that follows the direction of travel |
| 320–400 | 10.7–13.3s | **Setup** | Cards drop away. Huge Syne on bone: "Looks / expensive." (mask reveal, slow push) | Breakdown: pad plus a riser |
| 400–480 | 13.3–16.0s | **Payoff** | Hard cut to ink: "It wasn't." slams in, then moves up. An odometer rolls "$300" in, with "TO BUILD. THEN $50/MO." underneath. | Hit (sub boom and chord stab), odometer ticks, a bell on the last digit |
| 480–600 | 16.0–20.0s | **Outro** | The site's fractured hero, rebuilt: 264 cream slabs spring in from the viewer (the site's own spring model) to form "VILAS / .studio" and the tagline. Then a bronze "Start a project →" pill. | Marimba cascade in key as the tiles land, then a final A♭maj9 chord that rings out |

Durations: 2.7 + 1.3 + 6.7 + 2.7 + 2.7 + 4.0 = **20.0s**.

## Honesty checks
- The price matches `lib/site.ts`: Basic $300 build + $50/month. No invented stats, clients or testimonials.
- Every site shown is a labelled Vilas style demo (the "DEMO BUILD" pill stays visible in each capture).

## Music
Original piece built in numpy. F minor, then a lift to A♭ major for the payoff.
Progression: Fm9 (intro/bar 2), D♭maj9, E♭6, D♭maj7 (breakdown), A♭maj9 (hit), D♭maj9, E♭, A♭maj9 (end).
Effects are pitched to the key and mixed under the music. The kick sidechains the pads.
