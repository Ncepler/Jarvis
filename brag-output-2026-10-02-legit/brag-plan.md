# Reel: "Is this legit?" (batch 3 · line art · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
A stick figure opens a mailbox: an email from a stranger. 'Who's this? Is it real?' They search the studio's name (generic search field, no real search brand), see the site's real search title and description, open it, and land on the real FAQ answer to 'Is this legit?' with the three claims ticked: the work is ours, click through all of it, the second half when you're happy. Ends 'Fair question. Google us.'
Honesty: the FAQ answer is verbatim from COPY.faq (captured live from the site). The search result uses the site's real META_TITLE and META_DESCRIPTION.
Sound: footsteps, creak, paper whoosh, thinking pops, typing clicks, result chime, a tick bell per claim. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
