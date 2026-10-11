# pole vault over the Empire State Building - zach-d-reel v3 (autopilot run 2026-10-11)

## Source and why only this one
Source: `f2d23041-snaptik_7688976381358738695_v3.mp4` from Noah's earlier uploads (576x1024, 30 fps, 37.1 s). TikTok and Snaptik were unreachable from this session
(egress policy answered 403 to CONNECT for www.tiktok.com and snaptik.app), so the only material was the 9 files already uploaded in earlier chats. Of those, 5 were
already used for earlier reels (shark, sloth x2, railgun, parking), 1 was real people dancing (skipped by rule), 1 was a drainpipe-flood story that ends in a third-party burger ad (skipped), leaving this one and the gas-drops video (scored 7/15, skipped).

## IMPORTANT: this upload is a third-party repost
It carries (a) a white header band "Worlds Most Genius marketing strategy" on every frame, (b) two other accounts' handles in tiny text at the bottom centre, and (c) it ends (from ~26 s) with a real restaurant's promo ("BRGR BOX").
The cut at 8.27 s drops (c). (a) and (b) are burned into the picture and were NOT touched (Rule zero: only the creator's marks, watermark and tail trim are standing edits). Noah decides whether to post it with those on it.

## Ending read
Story: if you pole-vaulted over the Empire State Building you would fly up ~20 ft and smash into it. Last kept words: "smashing into it". Last kept frame: 247 (8.233 s), the runner flat on the rooftop; frame 248 (8.267 s) is the first with the next caption ("Now if you dug").
Audio cut 8.255 s in the 70 ms gap after "it". Narrator: young male explainer, median 195 Hz.

Scorecard (cut 8.27 s): affordance 2 (an impact is the story's last beat: shatter) + boundary 2 (clean 70 ms gap, caption flips right after) + payoff 3 (the first complete fact and the joke land) + hook 3 (8.3 s) + fit 1-2 (bright rooftop onto a dark renovation demo) = ~10-11/15. Borderline by the rule (8-10 only with a universal transition): used because nothing better existed in the pool.
Why shatter, not whip: the first build (whip down) smeared the white header band into crisp ghost copies mid-whip. Shatter handles the band as ordinary shards and the transition reuses the story's own beat ("smashing into it").

## Edit list (original)
1. Trim tail: keep frames 0-247 and audio to 8.255 s (the BRGR BOX ad and the rest of the setup are dropped).
2. Creator mark covered: "ZACHD FILMS" on the runner's tank top, frames 17-35 (0.57-1.17 s), hand-tracked boxes in `mark_cover_keys.json`, `erase_letters.py`. Tier 1 (letters erased, no fallback needed). Looked at before/after 4x zoom on 12 frames; letters gone, a soft navy patch remains. Frames 36+ show no legible text. No other Zack D mark appears in 0-8.27 s (scanned 0-8.4 s at 5 fps in two strips).
3. Not touched: the white header band, the handles at the bottom, the captions, grade, speed, framing.
`assemble.py`: all 248 original frames re-encoded (they are one partial GOP, 0-247, and contain the covered frames), min 42.1 dB PSNR vs source; original audio SNR 43.1 dB; part 2 as joined >= 41 dB.

## Part 2 (5.4 s)
Shatter (1.0 s) from frame 247, impact at (0.45, 0.60), onto `demo-renovation` (chip: "A VILAS.STUDIO DEMO . RENOVATION"). Voice (Kokoro bm_george, speed 1.2) starts 0.65 s in, over the shards: "Veelas Studio. Websites that look expensive. They weren't." Captions repeat it in the ink panel from the landing. End card (bone, Vilas / .studio, tagline) holds 1.4 s with the sting.
Sound: real Pixabay-licence SFX (whoosh-cinematic, impact-bass-1, chime, sparkle; `sound_ledger.json`) + generated "playful" bed, seed 41. Nothing commercial baked in.
Length: first build was 6.9 s of part 2 (45%) and failed the length gate (limit 40%). Fix attempt 1: shatter 1.2 -> 1.0 s, voice sped to 1.2x and started under the shards, end card 1.4 s => 5.4 s (40%).

## Voice rung
Rung 3 (Kokoro neural TTS), NOT the narrator's clone. Rung 1 needs the narrator audio pushed to a public throwaway branch (`upload.higgsfield.ai` is blocked here) which this session's branch rules don't allow; rung 2 (preset voice) needs a CDN download that is also blocked, so it was skipped. Voice median 142 Hz vs narrator 195 Hz, spread 29 vs 74 (gate passes). Nobody has heard it.

## QA (pasted)
```
PASS transition continuity at the cut = 6/255; picture 1.15s later differs by 115/255
PASS hook_time  the Vilas hook starts at 8.3s (target <= 20 s, limit 24 s)
PASS audio_hit  30-80 Hz thump after the cut = -19.3 dBFS (at +0.38s), +12.4 dB vs before
PASS dead_air   longest digital silence in part 2 = 0.00s
PASS loudness   original -22.4 LUFS, part 2 -22.2 LUFS
PASS length     part 2 = 5.4s of 13.7s (40%); limit 7s and 40%
PASS voice      narrator median 195 Hz (spread 74), part 2 voice median 142 Hz (spread 29)
ALL QA CHECKS PASSED   (assemble.py: ALL CHECKS PASSED)
```
sound_variety was not checked against other reels (this is the only one in the run). Voice margin over the effects: 7.2 / 15.3 / 10.2 dB by thirds (the first third overlaps the shatter, marginal).
Seam strip looked at (6 fps, 7.6-13.6 s): one move, no pop at frame 0, no black gap, captions legible in the ink panel, chip says demo.

## Duh / send test
Duh: the reel is a joke that ends in a website ad; the ad's claim ("looks expensive, wasn't") is not a restatement of the story. Send: "send this to the friend whose website looks like 2009" (caption CTA). Pinned comment suggestion: "Websites for local businesses, from $300. vilas.studio".
