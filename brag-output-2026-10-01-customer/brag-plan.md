# Reel: "The Customer You Never Met" (stick-figure Vilas promo)

Planned with the `directing-stickman-videos` skill (Phase A director's proposal, approved 2026-10-01) and rendered locally with Hyperframes, because the Higgsfield account had 3.86 credits (six Omni Flash clips need ~60 at 360p, ~180 at 720p). The Phase B Omni Flash prompts are in `omni-flash-prompts.md`, ready for when there are credits. Commercial pattern: pain → consequence → reframe → reveal → mechanism → payoff/CTA. There are no stats, no client names, and nothing fabricated. Prices aren't mentioned, only the two real paths (pick a style / custom).

- **Format:** 9:16, 1080×1920, 30fps, 56.0s. Light theme: black stick figures on a flat, pure-white canvas.
- **Accents (3 max):** warm gold = craft and value (loaf, new site, the sale) · electric blue = the phone search · vivid red = doubt and the lost sale.
- **Voice:** Kokoro `af_heart` at 0.95× (bright American female), 133 words, one WAV per clip. "Vilas" is spelled "Veelas" in the TTS input so it's said VEE-las.

## Voiceover script
1. You lost a customer today. And you will never know it happened. She was standing right outside your door.
2. Before walking in, she did what everyone does now. She pulled out her phone, and looked you up.
3. What she found was a dusty page from years ago. Or nothing at all. So she kept walking. Straight next door.
4. Here's the thing. Your bread, your haircuts, your lawns... your work was never the problem. But online, people judge the storefront before they taste the bread.
5. That's what we fix. Vilas Studio builds websites for local businesses that look like they cost ten times more. Pick a style, or go fully custom.
6. Same customer. Same phone. This time, she walks right in. A website that looks expensive. It wasn't. Find us at Vilas dot studio.

## Storyboard
| # | Global | Scene | Handoff out |
|---|---|---|---|
| 1 Hook | 0–8.2 | Close on a gold loaf with steam and rings. Pull back to the proud baker in the shop window, then out to the whole storefront. A woman walks up, and a red ghost of her lifts off. She raises her phone. | Blue fills the frame from her phone |
| 2 Recognition | 8.2–15.0 | Blue contracts into a phone. Four figures around it hold phones up ("everyone does now"). Blue ripples fall through the scrolling feed, and the magnifier lands on the tiny-storefront card. | Push into the card |
| 3 Consequence | 15.0–23.4 | The card opens into a dusty old page: broken image, cobwebs, falling dust, flicker. Red cracks, a shatter, and a red X. The blank card shrinks into her phone (red screen). She walks off right, leaving red footprints, and the baker slumps. | Push into the window on the baker |
| 4 Reframe | 23.4–34.0 | The storefront fades. The baker lifts the loaf, and gold scissors and a gold mower stack above it ("bread, haircuts, lawns"). Arms up and gold rings on "never the problem." A giant red cracked storefront drops like a curtain (shake). Passers-by glance and keep walking. | Cracked facade fills the frame |
| 5 Reveal + mechanism | 34.0–44.6 | The designer drops in on a gold line, and a gold sweep erases the facade. A page builds itself section by section (gold sun, gold button, photo row of loaf/scissors/mower). Glints on "ten times more." The designer zips out. A style-tile fan ("pick a style") and a pencil sketch ("fully custom"). | The page shrinks into her phone |
| 6 Payoff + CTA | 44.6–56.0 | Same sidewalk framing as clip 1, with a gold phone. The red ghost returns into her. She walks in (gold doorway, bell), the baker hands her the loaf, gold burst, the window glows. Crane out to a street of storefronts with one gold window, which condenses into a gold circle. | End card |

## On-screen text (Phase A post-production overlays, upper third, clear of the IG UI)
- 2.1–4.3 "You'll **never** know." (red)
- 19.85–22.0 "She kept **walking**." (red)
- 39.4–41.6 "Looks **expensive**." (dark gold)
- 51.4–56.0 "It wasn't." (top) + 52.4–56.0 "vilas.studio" (center, gold bar) under the gold circle

## Audio
- Music: `happy-beats-business-moves-vol-10` with a 650 Hz low-pass through the lost-sale act. It drops to ~0.03 for the reframe (23.7–33.6), then the filter opens to 18 kHz by 36.5 for the rebuild. It sits at ~0.15 under the VO, lifts to 0.36 after the last line, and fades out by 56.0.
- SFX (Kenney CC0): footsteps, phone click, pops for the crowd and page sections, card swipes, a ping when the card is found, a glass crack and shatter, a bell swell on "never the problem," a heavy thud for the facade, a rope zip and landing, card fan, door bell, and a final bell.
- Overall level: mean ≈ −24 dB, peak −1.5 dB, steady across the reel.

## Rebuild
From `work/composition/`: `python3 build.py` → `npx hyperframes check` → `npx hyperframes render --quality high --output ../../brag.mp4`. Scene code is `assets/reel.js` (an immediate-mode SVG renderer on `hf-seek`; the rig and primitives are shared with the "Motivation Comes Second" reel). VO: `npx hyperframes tts "<line>" --voice af_heart --speed 0.95 -o assets/vo/voN.wav`. Word-level transcription is blocked in this sandbox (whisper model download returns 403), so beats are timed from `ffmpeg silencedetect` pauses instead.
