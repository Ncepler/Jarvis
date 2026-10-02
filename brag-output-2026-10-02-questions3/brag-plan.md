# Reel: "3 questions to ask before you hire a web designer" (batch-2 idea · SAVE)

Batch 2, built 2026-10-02 with /brag (brag-slim path) + canvas. No Supabase row yet (no Supabase this batch; see `supabase/pending/2026-10-02-reels-batch-2.sql`). 21s.

## Angle
Useful first, pitch second. "Ask these 3 questions before you hire a web designer." Each question gets a big two-line header, a one-line buyer tip,
and "our answer": a card showing the studio's real answer on its own site:
1. **Who owns the site and the domain?** The real FAQ accordion opens "Do I own the site?" → "Yes. The site and the domain are yours…" Tip: *You want a straight yes.*
2. **What happens if I don't like it?** It opens "What if I don't like it?" → "We keep tweaking until you do. The second half of the payment waits until then." Tip: *Ask when the money's due.*
3. **How do I ask for changes later?** The real `/updates` page ("Send us changes."), with an example reference code typed in. Tip: *You want a process, not a lost email.*
Outro: "We answer all three on our own site." + vilas.studio + "Ask whoever you hire. Even if it isn't us."

Every answer is verbatim from `COPY.faq` / the live `/updates` page (real captures). The accordion's opening is rebuilt in canvas from the real closed and open screenshots using the measured answer height and the site's own easing curve.
Honesty: the code VS-4817 is the form's own placeholder, labelled "code shown is an example". No claims about other designers. The tips are general advice.
Sound: calm piano + soft pulse, ticks as lines land, a paper slide as each card rises, a felt pop on the accordion, key clicks, a warm resolve. -15 LUFS. Poster = frame 200 (Q1 answer open).

## Rebuild
From `work/`: `node cap.mjs` (needs `next start -p 3456`), `python3 -m http.server 8928`, `PORT=8928 node render.mjs events`, `python3 sound.py`, `PORT=8928 node render.mjs video video.mp4`, `bash finish.sh 200`.
