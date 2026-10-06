---
name: trojan-reel
description: The "Trojan reel" ad format for Vilas Instagram/TikTok. It plays as a genuine, absurd "what if" physics hypothetical with no brand in sight, keeps the viewer for ~20s, then the story's own momentum carries them mid-sentence and with no cut straight onto vilas.studio. The reveal is the punchline, so people laugh, save and repost it ("world's most genius marketing strategy"). Use when Noah says "/trojan-reel", "do the pole-vault thing", "genius ad", "bait-and-switch reel", "make an ad that doesn't look like an ad", "what-if reel", or wants a reel that sells Vilas without looking like an ad. Built and rendered with HyperFrames using the /brag folder conventions. Not for the regular /brag launch videos, skit reels, or client work.
---

# /trojan-reel

The reference is a reposted TikTok ad for **BRGR BOX** (a burger place in Birmingham). It opens as a "what if you pole-vaulted over the Empire State Building" physics video. For 22 seconds it's exactly what it looks like. Then the pole flings the guy across the city, he lands on BRGR BOX's roof in the middle of a sentence, and the same narrator carries on into a 14-second food ad. People watch the whole thing, laugh at the turn, and save it. A reposter put "World's Most Genius marketing strategy 🥲" over it, so that repost was free distribution.

The second-by-second teardown is in `references/brgr-box-teardown.md`. Read it once before writing your first script.

## Why it works (the seven laws, ranked by importance)

1. **The first 20 seconds are real content, not an ad.** A "what if" physics hypothetical is a native feed format that people already trust and watch through. Nothing on screen is branded, so ad-blindness never kicks in. The viewer chose to watch, so they aren't skipping.
2. **The ad is the punchline, not a tax.** The turn lands like the end of a joke. The viewer feels outplayed rather than tricked, and being outplayed is funny. Laughing leads to saving and sending, and that's the whole distribution model.
3. **The pivot is physical and mid-sentence.** The object's momentum ("…sending you flying…") delivers the viewer *into* the business. The sentence never ends on the hypothetical: the preposition is the hinge ("…onto **BRGR BOX**, where you can get…"). There's no cut, the narrator doesn't change voice, and the audio level stays flat. Nothing announces the turn.
4. **The hook never cuts.** 0–22s is one continuous follow-cam with zero hard cuts (ffmpeg scene detection finds none until 26.4s). Without a cut there's no natural place to stop watching. Once the ad starts, it cuts every ~0.7s.
5. **Escalating, specific numbers.** "about 20 ft", "almost 2,000 feet long and four feet thick", "187 ft/sec". Red measurement brackets and counters on screen borrow the credibility of an explainer channel, and every new number is a reason to keep watching.
6. **Sunk cost plus a promise.** "Now if you…" restarts the problem with a crazier fix, so the viewer has to see whether it works. They've already invested 10s by then, and the payoff comes at ~21s, right as the fix pays off.
7. **The ad half is short, sensory and conventional.** Five to seven fast shots, the brand name said twice, one plain CTA ("worth a visit!"), and a logo end card. It takes ~35–40% of the runtime. Any longer and the laugh turns into "oh it's an ad".

Rule of thumb: **60 / 40**. That's ~60% hypothetical (to the pivot), ~40% payload. The total runs 30–40s.

## The structure (fill this in for every reel)

| Beat | Time (35s reel) | Job | Rules |
|---|---|---|---|
| 1. The question | 0–4s | "If you tried to X…" | First frame already in motion. No logo, no Vilas colours, no "ad" energy. The caption is the question. |
| 2. The fail | 4–9s | The naive attempt fails, with a real number | Measurement bracket on screen. Slapstick (smash, flop) gives a small laugh early. |
| 3. "Now if you…" | 9–19s | Escalate the setup with 2–3 absurd, specific requirements | Each requirement gets its own number or comparison ("faster than a race car"). Counters tick up on screen. |
| 4. The launch | 19–21s | The fix works. Speed readout, sky, momentum | This is the payoff the viewer was waiting for. Give them the spectacle. |
| 5. **The pivot** | 21–23s | Momentum lands on Vilas, mid-sentence | Same take, same voice. The hinge word is a preposition or "where". See *Pivot rules*. |
| 6. The payload | 23–33s | 4–6 fast real shots of Vilas work + one honest benefit line | Cut every 0.6–0.9s. Real captures only. Say the brand twice. |
| 7. The sign-off | 33–35s | CTA + end card | "vilas.studio" spoken and on screen. Hold the end card ≥1.5s. |

## Pivot rules (the part that makes or breaks it)

- **The trajectory must physically end on a screen.** Vilas sells websites, so its "rooftop" is a phone or laptop screen out in the world. The flying object/person/camera dives *into* a phone in someone's hand, a laptop on a café table, or a storefront's QR code, and the screen it hits is showing vilas.studio (a real capture). Wherever the world ends, the website begins.
- **Never cut at the pivot.** Hand off with a move (a push-in through the screen glass, a whip, a match-move). The style can change at that moment, from CG/line-art world to real screen capture, as long as the motion carries through. BRGR BOX goes from game-engine 3D to real drone footage while the camera keeps moving.
- **Keep the sentence going.** Write the VO so that one sentence spans the turn. Example: "…and the ball would come all the way around the planet, hit you in the back of the head, and knock you face-first into your phone, onto **vilas.studio**, where a local business gets a site that looks like it cost ten times more."
- **Don't wink.** No "but seriously", no "anyway", no sound effect or music drop to flag the turn. The narrator acts like this was always the plan, and that deadpan is the joke.

## Writing the hypothetical

A good hook question:
- Is one line and instantly picturable: a famous landmark or everyday object, plus a ridiculous act.
- Can be answered with **real, computable physics**. Do the maths yourself (kinematics, energy, orbital velocity, terminal velocity) and show your working in `brag-plan.md`. Round conservatively and pick the simple model ("no air resistance") where the real answer is murky. The format borrows explainer-channel credibility, so wrong numbers break both the format and Vilas's honesty rules.
- Has a natural "now if you…" escalation that ends in **launch or fall motion**, because the pivot needs momentum.
- Doesn't depend on any real person, real business (other than Vilas), or brand logo. Landmarks are fine to name.

Seed bank (run each through the maths before scripting; the numbers here are starting points, not facts to paste):

| Seed | Escalation | The maths to check | Lands on |
|---|---|---|---|
| Pole-vault over the Empire State Building (443 m to the tip) | You'd need to run ~93 m/s (~210 mph), since h = v²/2g | v = √(2gh) | Thrown over Midtown, through a café window, onto a laptop |
| Throw a baseball from Montauk to Manhattan (~170 km straight line) | ~1.3 km/s at 45°, no drag (~Mach 3.8) | R = v²/g | Comes down in a park and bounces into a phone screen |
| Kick a soccer ball into orbit | ~7.9 km/s, comes back around in ~90 min | v = √(GM/r), T ≈ 90 min | Hits you in the back of the head and knocks you into your phone |
| Jump into a tunnel through the Earth | Fall time ~38 min (Klotz 2015, real density profile) | cite the paper's figure | Fly out the other side into a shop owner's hand, phone first |
| Drop a penny off the Empire State Building | Terminal velocity of a tumbling penny is only ~25 mph, so it stings rather than kills | cite a source or skip the number | Pings off a taxi and lands face-up on a phone screen |
| Ride a skateboard down a ramp as tall as the Empire State Building | v = √(2gh) ≈ 93 m/s at the bottom, ignoring friction | energy | Launches off the kicker and sails into a storefront's tablet |

Write new seeds the same way. The best ones get a laugh from slapstick in beat 2 and a "no way" from the number in beat 3.

## The payload (beats 6–7) — Vilas-honest

- **Real captures only.** Record the live site (Playwright, 1080×1920) showing the hero wordmark reveal, the gallery coverflow, a demo opening and a scroll through a demo. Every demo is labelled a demo on screen. No invented clients, stats, testimonials or "trusted by" (CLAUDE.md §7).
- **One benefit line from the site's own copy.** Use `SITE.tagline` from `lib/site.ts` ("A website that looks expensive. It wasn't.") or a tier from `lib/pricing.ts`. Prices are ranges and tiers only, and flagship is always "let's talk".
- **Say "Vilas" twice and "vilas.studio" once.** The end card is the Vilas wordmark plus "vilas.studio", held ≥1.5s.
- **CTA in plain voice:** "Worth a look.", "Start a project at vilas.studio." Never "link in bio 🚀".
- Don't make it a "local business" claim beyond what `SITE.region` and the site already say. Captions skip `#longisland` (see HANDOFF; the site serves the whole US).

## Production (HyperFrames, /brag folder conventions)

Read `/hyperframes` first (it routes to `hyperframes-core`, `hyperframes-animation`, `media-use`). Output goes in `brag-output-YYYY-MM-DD-<slug>/` with `brag.mp4`, `brag.jpg` (poster), `share-copy.txt`, `brag-plan.md` and a gitignored `work/`, the same layout as every other reel.

1. **Plan** (`brag-plan.md`): the hook question, beat table with timings, the full VO script with the pivot sentence marked, the physics working, the shot list, and the honesty checklist below.
2. **VO first.** Narration drives this format. Generate it with HyperFrames TTS via `/media-use`, using a calm, curious explainer voice, steady pace, ~150 wpm. Time every beat to the VO, not the other way round. Run it at ~-15 LUFS with a light, steady music bed that does **not** change at the pivot.
3. **The hypothetical world** (beats 1–5), one continuous camera. Pick one:
   - **Three.js low-poly city** (`hyperframes-animation` → Three.js adapter). This is closest to the reference's game-engine look. Use a follow-cam on a seek-safe timeline, every frame a pure function of t.
   - **Canvas line art** (the stickman kit from batch 3). Cheaper and on-brand, and the measurement brackets look native.
   - **Higgsfield clips** only if they can be chained without a visible cut. Read `higgsfield-prompt-engineering` first and get Noah's OK before spending credits.
4. **Explainer overlays:** red measurement brackets with numbers, counters that tick (1,206 → 2,000 ft), and a speed readout. Use one accent colour for the overlays (red/orange explainer-style is fine here; it's not the Vilas palette).
5. **The pivot shot:** in the same camera move, the subject hits a screen and the camera pushes through the glass into a real capture of vilas.studio. Composite the capture as a texture/plane in the scene so the motion stays continuous.
6. **Payload:** 4–6 real captures, a hard cut every 0.6–0.9s, then the wordmark end card.
7. **Captions:** 1–3 word chunks, centred in the lower third, white, bold, with a soft shadow, the same style the whole way through (no style change at the pivot either). Keep them inside the 9:16 safe zone.
8. Render at 1080×1920, 30fps, 30–40s. Bake the poster in as frame 0, and make it the beat-1 action shot, not the logo.

## QA gates (all must pass before calling it done)

- [ ] **No cuts before the pivot:** `ffmpeg -i brag.mp4 -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep pts_time` returns nothing earlier than the pivot timestamp.
- [ ] **Brand invisible before the pivot:** none of the frames from 0 to the pivot shows "Vilas", the wordmark, the bone palette, or a URL. Check a contact sheet (`fps=2,tile=8x5`).
- [ ] **Pivot lands mid-sentence:** in the VO script, the brand name falls inside a sentence that started in the hypothetical.
- [ ] **Ratio:** pivot falls at 55–65% of the runtime.
- [ ] **Every number is checked** and the working is in `brag-plan.md`.
- [ ] **Honesty:** demos labelled demos, real captures only, no fake clients/stats/testimonials, no real person's likeness, prices as tiers.
- [ ] **The cold-watch test:** watch it once as a stranger. Did beat 1 make you want to hear the answer? Did the turn get at least an exhale-laugh? If not, the hypothetical is the problem. Rewrite beat 1 before polishing anything else.

## share-copy.txt

- The caption is **the hypothetical question**, not the ad: "What if you pole-vaulted over the Empire State Building?" The caption must not give away the turn.
- After that come 3–5 broad hashtags (#physics #whatif #webdesign #smallbusiness). No `#ad` is needed because it's Vilas's own account, but never claim it's anything other than Vilas's own video.
- Pin a comment after posting, something like: "the physics is real. so is the website → vilas.studio". It rewards the people who laughed and invites replies.
