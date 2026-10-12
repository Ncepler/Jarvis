# Worked example: three v3 reels that failed (2026-10-12), and what each should have been

Noah's verdict: "the physical transitions look very nice, well edited, however it doesn't make sense where the transition is. It's just placed in the middle of a sentence or something, it doesn't flow."
"It doesn't seem to understand that the transition should be into a Vilas Studio thing, not showing a demo website. That's a no-no." "These new edited clips don't use any voice audio." "Really boring."
Measured here from the files (contact sheets at 2 fps, a 300-3400 Hz energy profile, and `qa.py voice_in_mix`).

| Reel | Where it cut | What part 2 did | Voice in the mix |
|---|---|---|---|
| Sea lion / diver clamp (17.6 s) | after "...quickly reel the diver up to the surface" (~11 s) | a whip into a scrolling **power-washing demo website**, captions "Vilas Studio." / "Websites that look expensive." / "They weren't." on an ink panel, bone end card | none (speech band 1-10% of the energy under the captions; correlation with a voice take 0.06) |
| New car / brain filter (26.1 s) | after "...so it has to filter for what matters to you" (~19.5 s) | an iris through the brain hole into a scrolling **auto-body demo website**, same captions | none |
| Brain shape (23.1 s) | after "...supported from every direction inside your head" (~16.5 s) | a zoom into the brain into a scrolling **magician demo website**, same captions | none |

## Why they failed (each is now a law in SKILL.md)
1. **No sentence slot (law 1).** v3 chose the cut by shape and silence (`find_transitions.py`): a finished sentence, then a NEW sentence "Vilas Studio." The viewer hears the story stop and an unrelated ad start. In the railgun the narrator's sentence itself turns into the brand.
2. **A website as the destination (law 3).** The demo footage made part 2 a site screen-recording with a "DEMO" chip: it reads as an ad for a different business, and it kills the joke.
3. **No funny part (law 4).** Scrolling a site under three caption lines is the opposite of the over-the-top laser drop that made the railgun reel engaging.
4. **No voice (law 5).** The gate accepted a voice FILE or a written reason; nothing checked that a voice was in the final. `qa.py` now has `voice_in_mix` and no voiceless pass.

## What each should have been
- **Sea lion:** "Which lets the crew quickly reel the diver up to | **Vilas Studio**." Slot 2 (destination after "reel ... up to"), motion 2 (the rope pulls the diver up), gap ~2, hook ~10.5 s = 3, payoff 2 => 11: build it.
  Move: `whip` with `dir: "up"` (the diver is being pulled up), landing in the metal VILAS STUDIO wordmark on "Vee-". Caption "up to Vilas Studio". Then the drop.
- **New car / brain filter:** the slots are weak ("filter for what matters to you" has no motion; nothing arrives). Score < 10 => **skip this video** and use another one. Never rescue it with a standalone line.
- **Brain shape:** no slot ("...inside your head." is a finished sentence, nothing moves toward anything) => **skip**.
