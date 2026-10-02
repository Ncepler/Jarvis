# Reel: "Notifications from a good website" (batch 3 · metaphor · SEND)

Batch 3, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase (not used this batch). Idea list: `reels-batch-3-ideas.md`.

## Angle
A phone lock screen collecting three example notifications while the clock says 7:42 on a Saturday: a quote request from the site's form, an answer from the optional chat add-on ('Asked: are you open Sunday? Answered from your site.'), a booking request. Closes 'Your site works while you work.'
Honesty: every notification is an illustrative example (footer says so); the chat answer is the optional $30/month add-on, labelled as optional; no real app names or logos.
Sound: a double buzz and a soft ping per notification, a whoosh, an end chord. -15 LUFS.

## Rebuild
From `work/`: see the pipeline notes in HANDOFF.md (capture with `next start -p 3456`, `python3 -m http.server <port>`, `PORT=<port> node render.mjs events`, `python3 sound.py`, `PORT=<port> node render.mjs video video.mp4`, `bash finish.sh <poster>`).
