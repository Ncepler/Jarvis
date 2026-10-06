# BRGR BOX "pole vault" ad — teardown

Source: a TikTok repost (snaptik download, 37.1s, 576×1024, 30fps) that Noah sent on 2026-10-06. The reposter added a white banner on top reading "Worlds Most Genius marketing strategy 🥲". That banner isn't part of the ad, but it shows the share mechanic working. Watched as 2fps contact sheets, plus ffmpeg scene detection and a loudness pass.

## Timeline

| t (s) | Picture | VO / caption | Note |
|---|---|---|---|
| 0–4 | Game-engine 3D: a runner sprints down a city street toward a skyscraper, holding a yellow pole. Follow-cam. | "If you try to pole vault over the Empire State Building" | In motion from frame 1. No logo, nothing branded. Looks exactly like a physics "what if" channel. |
| 4–8.5 | He vaults, a red bracket ticks 10 → 19 → 20 ft, then he smashes into the façade and ragdolls onto the sidewalk | "you would fly up about 20ft before smashing into it" | First number. Slapstick gives an early small laugh. |
| 8.5–13 | Camera swoops up to a top-down drone view. Excavators dig a pit in front of the building, highlighted in green. | "Now if you dug a giant slot in front" | The "now if you…" restart is the sunk-cost hook. |
| 13–15.5 | Street level again: an F1 car races beside the runner, who's carrying a huge pole | "and ran faster than a race car while hugging a pole" | Comparison instead of a number, so it's instantly picturable. |
| 15.5–19.5 | Camera runs along the pole. Counter 1,206 → 1,844 → 2,000 ft, then a thickness bracket 0 → 3 → 4 ft | "that's almost 2000 feet long and four feet thick" | Ticking counters are the explainer-channel credibility. |
| 19.5–21 | The pole plants into the slot and bends | "you could plant it into the slot and the pole would snap back" | Slight audio dip at ~19s, a breath before the payoff. |
| 21–22.5 | Sky, speed readout 154 → 187 ft/sec, he flies past a spire | "sending you flying" | The spectacle the viewer waited 20s for. |
| 22.5–24 | **PIVOT.** He sails over real rooftops (real drone footage) and lands outside a black storefront with a BRGR BOX sign. The camera never cuts. | "BRGR BOX, where you can get" | Mid-sentence. Same narrator. CG → real footage hidden inside the motion. |
| 24–26.4 | Real food: burger on a board, then a burger on branded paper | "the best burgers in all of Birmingham" | Ad mode, still slower cuts. |
| 26.4–35.5 | Hard cuts every ~0.7s: flame, wings on a grill, fire, sizzling platter, pizza ×2, pomegranate, branded cup, neon sign with steam | "Mouthwatering mix grills and much more. For the freshest food in town, best flavours, BRGR BOX is definitely worth a visit!" | Brand said twice. One CTA. Sensory B-roll only. |
| 35.5–37 | Logo end card over blurred food | — | ~1.5s hold. |

## Measurements

- **Scene cuts (ffmpeg `scene>0.3`):** none from 0 to 26.4s. After that: 26.4, 27.1, 28.0, 29.1, 30.3, 31.1, 31.9, 32.4, 34.3, 34.9, 35.6, 36.1. The hook is one continuous take and the ad is rapid-fire.
- **Pivot point:** ~22.5s of 37.1s, which is 61%. The payload is 14.6s (39%).
- **Audio:** RMS is flat from start to finish (≈1500–2100), with one small dip at ~19s. No silence anywhere (silencedetect at -35 dB found none). The music bed and narration run continuously across the pivot, so the audio never announces the ad.
- **Captions:** 1–3 word chunks, white bold with a shadow, centred in the lower-middle. The style is identical before and after the pivot.

## What to steal vs. what not to

Steal: the continuous take into the pivot, the mid-sentence hinge, escalating numbers with on-screen brackets, the 60/40 split, the fast sensory payload, and a caption that's the question.

Don't copy: the reference's numbers aren't all physically defensible (a 2,000 ft pole snapping back like that is hand-waved). Vilas reels have to keep the numbers we state honest (see SKILL.md, *Writing the hypothetical*). We also don't have "food B-roll". Our payload is real captures of the real site, with demos labelled.
