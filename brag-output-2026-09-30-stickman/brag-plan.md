# Reel: "Motivation Comes Second" (stick-figure explainer)

Planned with the `directing-stickman-videos` skill (Phase A director's proposal), then built and rendered here with `/brag` → Hyperframes instead of Gemini Omni Flash. Not a Vilas promo. It's a general-audience motivational short picked for reach: "you're not lazy" is one of the most-shared stick-figure formats, it calls the viewer out, and it ends on a tiny action. No stats or claims to fact-check.

- **Format:** 9:16, 1080×1920, 30fps, 59.0s. Light theme: black stick figure on a flat, pure-white canvas.
- **Accents (3 max):** vivid red = the trap (phone, guilt, days lost) · electric blue = action (first step, door light, momentum) · warm gold = motivation (the spark).
- **Voice:** Kokoro `af_heart` at 0.9× (bright American female), 134 words, one WAV per clip.
- **Arc:** hook → recognition → reframe → action → momentum → payoff/CTA.

## Voiceover script
1. You're not lazy. You're waiting for a feeling that only shows up after you start. And that one mistake is quietly stealing your days.
2. Every morning, the same loop. You wait for motivation. It doesn't come. So you scroll instead, and the guilt piles higher.
3. Here's the trap. We think motivation comes first, then action. It's backwards. The feeling is the reward, not the ticket in.
4. So stop waiting. Shrink the task until it feels almost silly. One push-up. One sentence. Two minutes. Just crack the door.
5. Then watch what happens. One small step sparks momentum. Momentum builds energy. And the motivation you were waiting for finally shows up.
6. You don't need to feel ready. You need to begin. So put the phone down, take one tiny step, and let the feeling catch up.

## Storyboard (scene starts are beat-locked to the track's strong cues)
| # | Global | Scene | Handoff out |
|---|---|---|---|
| 1 Hook | 0–9.2 | Tight on the figure slumped on a couch, red phone glowing. Camera cranes up to a gold spark far out of reach, and he stretches for it and gives up. A calendar pad tears off its pages, a clock spins, and pages bury the couch. Push into the phone. | A red circle swallows the frame |
| 2 Loop | 9.2–18.55 | The red frame becomes a phone and a thumb flicks icon-only cards. The phone becomes a hamster wheel of cards, with the spark hovering above. "It doesn't come": the spark pulls away. Five red blocks drop onto his back (camera shake per hit) and he sinks to his knees. | Kneeling figure under the tower |
| 3 Reframe | 18.55–28.37 *(beat-locked 18.55)* | The music drops out and a bell rings. The tower dissolves. Diagram: spark → arrow → walker. "It's backwards": they swap places and the arrow redraws in blue. The spark becomes a gold medal. A ticket tears in half. A tall door rises in front of him. | The closed door |
| 4 Action | 28.37–38.07 *(beat-locked 28.37)* | Low angle up the huge door. He pinches and it shrinks to knee height. Three panels pop in (push-up, pencil scribble, blue timer). He crouches and cracks the tiny door, and blue light spills out. Push into the crack. | Solid blue frame |
| 5 Momentum | 38.07–48.55 *(beat-locked 38.07)* | The blue frame contracts into one blue step. Each step spawns the next: three slow, then five fast with streaks and a gold trail. At the top, the spark from clip 1 finally drifts down into his chest, and gold rings and a burst go off. | Gold circle fills the frame |
| 6 Payoff | 48.55–59.0 *(beat-locked 48.55)* | Callback to the couch. He sets the phone face-down (red dies), turns, and takes one step, leaving a blue footprint. The spark catches up and merges. He walks up a winding path into the distance, leaving blue footprints. "Start now." Final chime on the 57.01 cue. | End |

## On-screen text (the Phase A post-production overlays, upper third, clear of the IG UI)
- 0.25–2.35 "You're not **lazy**." (red)
- 23.17–25.65 "It's **backwards**." (blue)
- 30.27–32.72 "Make it **tiny**." (blue)
- 56.55–59.0 "Start now." (gold bar)

## Audio
- Music: `happy-beats-business-moves-vol-10` (60s, ~110 BPM). A low-pass at 650 Hz keeps it muffled through the stuck act. It dips to near-silence for the reframe (18.75–27.9), then the filter opens to 18 kHz by 30.5s. It sits at ~0.15 under the VO, lifts to 0.38 after the last line, and fades out by 59.0.
- SFX (Kenney CC0): paper slides for the pages and thumb flicks, heavy soft thuds for the red blocks, a bell for the reframe, pops for the panels, a click for the doorknob, footsteps for each step, a bell on the spark landing, and a final bell at 57.01.
- Audio-reactive treatment: skipped on purpose. The piece is VO-led with the music bed at ~13–15%, so RMS-driven motion would read as noise. Every visual beat is already cued to the narration.

## Rebuild
From `work/composition/`: `python3 build.py` (writes index.html from the audio/text tables) → `npx hyperframes check` → `npx hyperframes render --quality high --output ../../brag.mp4`. The scene code is `assets/reel.js`: an immediate-mode SVG renderer driven by the `hf-seek` event, so every frame is a pure function of time. VO: `npx hyperframes tts "<line>" --voice af_heart --speed 0.9 -o assets/vo/voN.wav`.
