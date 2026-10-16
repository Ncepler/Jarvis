# balloon: "You just watched | a balloon" -> "You just watched Vilas Studio"  (zach-d-reel v4, built 2026-10-16)
Source: a 29.7 s 720x1280 video (user upload `SnapInsta.to_...`). NOT a Zack D story: it is an AD for another studio ("FYD Studios", fydstudios.com): a needle over a balloon with a
"frames to impact" HUD, on-screen captions typed word by word ("You just watched a balloon for 7 seconds. A balloon that doesn't exist...", then FYD phone mockups, logo, "DM POP"). No spoken narrator at all.
Noah chose to use it anyway: "cut it around the part where it cuts to like 'you just watched a xxxx' and then put vilas there. Do it."
Kept: frames 0-243 (0-8.133 s) only. FYD's branding first appears at ~16 s (phone mockups) and the logo at ~24 s: none of it is in the cut. No creator marks in the kept part (scanned: only the REC HUD, the countdown and the "watching X s" chip).

## Seam sentence (law 1)
"You just watched | Vilas Studio."  (the dropped words were "a balloon"; the on-screen caption continues "You just watched Vilas Studio")
Scorecard (slot verb "watched" is not in transitions.md's verb list; Noah's call overrides the skill's skip rule): Slot 1-2 (grammatical, a thing watched, no motion), Motion 2 (zoom into the needle tip), Gap 1 (no speech: cut in the SFX silence 8.10-8.12 s), Hook 3 (8.1 s), Payoff 1 -> below the skill's own bar (>= 2 slot, >= 10/15). Built on Noah's explicit instruction.

## Edit list (standing edits only)
- cut at frame 244 (8.1333 s, the first frame where the "a" of "a balloon" starts to appear); audio cut 8.115 s, in the silence just before the caption's typing tick. Frames 0-149 stream-copied bit-identical; 150-243 re-encoded unedited (44 dB).
- no watermark to remove (none present), no marks to cover.

## Part 2 (5.37 s, amber style, photoreal)
Move: zoom into the needle tip (focus 0.5, 0.6) over 0.8 s, landing on "Vee-" (tImp1 0.8, flash), "Stu-" on tImp2 1.55, drop at 2.1, slams WEBSITES / THAT LOOK / EXPENSIVE. / IT WASN'T. / FROM $300 (message bank), end card Vilas .studio, "websites that look expensive. they weren't."
Caption after the landing: "You just watched Vilas Studio" (white, ~29 px, baseline y 886, matching the source's caption).
What the viewer laughs at: the ad's own sentence ends with the studio's name, then a laser show.
Send test / duh test: "send to the friend with the 2009 site" (caption CTA); the joke is the self-importance of a tiny web studio.

## Voice (rung 2, not the narrator: there is none)
Higgsfield preset "Emmett" (seed_audio, preset voice 3c7d32be-...), text "Veelahs Studio.", 1 take used of 2 generated (the other, "Reid", was discarded). Sped up 1.2x (atempo) to fit the 40% length rule.
Fetched through the Composio workbench (CDN blocked here), md5-verified. Cost ~0.4 credits for 2 takes (balance 270 before). NOT HEARD BY EAR: check "VEE-lahs" and that the voice sounds fine as the first spoken word of the reel.
Kokoro bm_george/am_michael takes (rung 3) were also made in work/voice and not used.

## Template changes in this reel's work copy (assets/hype-ending untouched)
- audio.py: fx/drums duck deepened (0.12 / 0.07) so the slower voice stays >= 7 dB over the riser on every third; a pure 34-90 Hz sine sub thump on its own never-ducked bus at the landing (the source's own sub-bass hit at 7.0 s is loud, so the standard boom alone failed `audio_hit`).
- cfg: tighter timeline (part 2 = 5.37 s) because part 1 is only 8.1 s and `length` caps part 2 at 40% of the video.

## QA (qa.py --cut 8.133 --mode bridge --transition-dur 0.8 --max-part2 7 --voice-file voice.wav)
PASS transition (9/255 at the cut, 69/255 later) · PASS hook_time 8.1 s · PASS audio_hit -8.6 dBFS, +5.3 dB · PASS dead_air · PASS loudness -12.6 vs -13.7 LUFS · PASS length 5.4 of 13.5 s (40%) · PASS voice_in_mix corr 0.94
FAIL voice: "narrator median 400 Hz (spread 123), part 2 voice median 117 Hz (spread 42)". NOT APPLICABLE: the check pitch-tracks a narrator and this video has none (it measured the music/SFX). Not bypassed. For reference the voice's pitch spread is 42 Hz vs the 26 Hz Kokoro the skill accepts (robot = 14 Hz).
assemble.py: ALL CHECKS PASSED. Voice margin over everything else (audio.py): 15.5 / 24.5 / 11.2 dB. Stills + seam strip + end strip looked at: frame 0 == part 1's last frame, one continuous move, no website/UI/browser anywhere.

## Risks (said once)
1. Rights/originality: the 8.1 s of picture and sound design are another studio's ad (FYD Studios). No FYD logo, name or URL is in the kept part, but it is their footage. 2. The voice is a stock preset, not a clone: nothing in this reel is the "narrator". 3. See reel-lab-notes.md §4 (reposted-footage reels can cost recommendation eligibility).
