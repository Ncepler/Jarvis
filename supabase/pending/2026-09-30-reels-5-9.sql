-- Write-back for the reels built 2026-09-30 (overnight run, no Supabase access
-- during the build). Run this once in the Supabase SQL editor for project
-- "Vilas" (ref epynfvskwaxejdibvgbr), then delete this file.
-- Each statement updates the idea row that was built (per the queue workflow,
-- no new row per reel), plus inserts the next episode of the "Details nobody
-- notices" series.

begin;

-- Reel #5 — queue idea 1
update public.instagram_posts set
  status = 'rendered', queue_position = null,
  video_path = 'brag-output-2026-09-30-spot/brag.mp4',
  poster_path = 'brag-output-2026-09-30-spot/brag.jpg',
  commit_sha = 'af0efaf',
  duration_s = 18.5,
  music = 'Original numpy-synth game-show bed, 120 BPM in F (pizzicato, light kit, clock tick on every countdown second so the ticks sit on beats). Buzzer at 0 cuts the bed dead. Marker squeak + a bell one F-pentatonic step higher per circle, thud on the X stamp, win chime, one bar of F that runs into the frame-0 pickup.',
  notes = notes || E'\n\nBUILT 2026-09-30: side-by-side phones instead of stacked (stacked windows could not show "below the fold"). 120 BPM not 128 so the countdown seconds land on beats. The answer circles are pinned to the page and the reveal scrolls through them (footer -> CTA band -> hero). Pin the answer list as the first comment (share-copy.txt).'
where id = '1f4622fc-2dca-4bed-b6fe-b5afe9848f37' and status = 'idea';

-- Reel #7 — queue idea 3 (series ep 1/9)
update public.instagram_posts set
  status = 'rendered', queue_position = null,
  video_path = 'brag-output-2026-09-30-details-1/brag.mp4',
  poster_path = 'brag-output-2026-09-30-details-1/brag.jpg',
  commit_sha = '0c29b99',
  duration_s = 13,
  on_screen_text = ARRAY[$$Details nobody notices$$, $$1/9$$, $$6:58 AM$$, $$reads the real time$$, $$So nobody drives over at 12:15.$$, $$2/9 next: the barber's walk-in sign$$],
  notes = notes || $$

BUILT 2026-09-30: chip states are the real computeBakeryStatus() under a Playwright fixed clock (Wed 06:58 / 07:00 / 12:01); the loop fast-forwards through midnight so the chip flips back on the exact frame Thursday starts. "2/9 tomorrow" became "2/9 next: the barber's walk-in sign" (no promise of a posting day). 13s not 12s. SERIES TEMPLATE (band, ring, zoom, control pill, annotation, why panel, next card, sound palette) is written down in brag-output-2026-09-30-details-1/brag-plan.md — copy it exactly for eps 2-9.$$
where id = '896b84d7-df79-4b3b-8276-ebcbfb0069b9' and status = 'idea';

-- Series ep 2/9 as the next idea (queue slot 5 is free once idea 5 is built)
insert into public.instagram_posts
  (title, kind, status, queue_position, hook_family, made_with, format, duration_s, tone, angle, hook, beats, on_screen_text, featured, techniques, music, caption, hashtags, notes)
values (
  $$Details nobody notices 2/9: the barber's walk-in sign$$, 'reel', 'idea', 5,
  $$15 Day N of ___ serial · FOLLOW$$, $$hyperframes (brag pipeline)$$, 'vertical', 13,
  $$Quiet, macro, nerdy-calm, ASMR-adjacent (series template, identical to ep 1)$$,
  $$Episode 2 of the details series. The barber demo's walk-in chip ("Walk-ins open · until 7pm" / "Walk-ins by appointment after 7pm") reads the posted hours table against the visitor's clock (BarberDemo.tsx useWalkInStatus). Macro on the chip in the Hours section; the clock drives the real component across 6:59pm -> 7:00pm.$$,
  $$Series band "Details nobody notices 2/9", lens ring already on the barber's walk-in chip, clock at 6:58 PM.$$,
  ARRAY[$$0.0–1.0s  Series band + lens ring on the walk-in chip (Hours section, 'Walk in. Or call ahead.'), clock 6:58 PM.$$,
        $$1.0–2.4s  Zoom to 4.6 px/css with depth-of-field blur (series template).$$,
        $$2.4–5.0s  Clock ticks 6:58 -> 6:59 -> 7:00 PM; the chip flips from 'Walk-ins open · until 7pm' to 'Walk-ins by appointment after 7pm' (real component under a fixed clock).$$,
        $$5.0–8.0s  Annotation: 'reads the posted hours'. Fast-forward to next morning 9:00 AM, chip flips back to open.$$,
        $$8.0–11.0s  Pull back; why-line: 'So nobody walks in at 7:05.'$$,
        $$11.0–13.0s  '3/9 next: the landscaping site that knows it's night'; ring returns; exact loop.$$],
  ARRAY[$$Details nobody notices$$, $$2/9$$, $$reads the posted hours$$, $$So nobody walks in at 7:05.$$, $$3/9 next: …$$],
  ARRAY[$$demo-barber walk-in status chip (BarberDemo.tsx useWalkInStatus + HOURS)$$],
  ARRAY[$$series template from ep 1 (band, lens ring, zoom + DOF, control pill, annotation, why panel, next card)$$, $$Playwright fixed clock driving the real component$$, $$12x DPR macro plates$$],
  $$No music. Series sound palette: room tone, clock tick per minute, felt click on each state flip, focus-motor whirr, pen swish on the annotation.$$,
  $$Nobody notices this either.

The barber style reads its own posted hours and tells you if they're taking walk-ins right now. Standard Barber Co. is a demo we built. Episode 2 of 9.$$,
  ARRAY['webdesign', 'uidesign', 'barber', 'details'],
  $$SERIES: copy the template in brag-output-2026-09-30-details-1/brag-plan.md exactly (grade, type, positions, sound). Capture with timezoneId UTC + page.clock.setFixedTime on a Tue–Sat. Walk-in chip sits in the HoursBoard section, which is Rise-revealed: scroll to it gradually before the screenshot (a direct scrollTo leaves it blank). Insert ep 3 when this one is built.$$
);

-- Reel #6 — queue idea 2
update public.instagram_posts set
  status = 'rendered', queue_position = null,
  video_path = 'brag-output-2026-09-30-keynote/brag.mp4',
  poster_path = 'brag-output-2026-09-30-keynote/brag.jpg',
  commit_sha = '18125db',
  duration_s = 24,
  notes = notes || $$

BUILT 2026-09-30: real three.js stage (Reflector floor, volumetric cone beam, RoundedBox phone, per-frame CanvasTexture screen from 3x captures). The "photo of your actual shop" beat shows the hero with a LABELED PLACEHOLDER frame, not the demo's stand-in photo (captioning that image "your actual shop" would mislead). Silence before "One more thing." is true digital silence, reverb tails included.$$
where id = 'ab34ed79-4c37-4023-a59f-3bc6aa946185' and status = 'idea';

-- Reel #8 — queue idea 4
update public.instagram_posts set
  status = 'rendered', queue_position = null,
  video_path = 'brag-output-2026-09-30-haircut/brag.mp4',
  poster_path = 'brag-output-2026-09-30-haircut/brag.jpg',
  commit_sha = '6bb4aa7',
  duration_s = 15,
  on_screen_text = on_screen_text || ARRAY[$$one tap. calling…$$],
  notes = notes || $$

BUILT 2026-09-30: attempts 1-5 are a made-up generic booking site built in HTML/CSS (no name, no platform). Attempt 6 lands on the real barber demo's Hours section (walk-in chip from useWalkInStatus under a fixed Wed 2:30pm clock) and taps the page's own sticky Call button. Every retry hard-cuts the jingle back to bar 1 (faster, more detuned, more bit-crushed each time).$$
where id = '9329cef1-b916-4bc3-ae81-e0452eeeea00' and status = 'idea';

-- Reel #9 — queue idea 5
update public.instagram_posts set
  status = 'rendered', queue_position = null,
  video_path = 'brag-output-2026-09-30-val/brag.mp4',
  poster_path = 'brag-output-2026-09-30-val/brag.jpg',
  commit_sha = '798e775',
  duration_s = 14.17,
  music = 'Original numpy-synth, minimal marimba + soft kick, ~110 BPM; the loop is exactly 52 eighths. Each tour word lands on a marimba note one step up C pentatonic (C5 -> A6); kick drops out for the revolve, rising 16th arpeggio, VILAS lands on C major + bell + held pad; descending figure back to VAL.',
  notes = notes || $$

BUILT 2026-09-30: VilasReveal.tsx no longer exists on the site (removed in 8123421), so the reel re-creates it from its git-history source for a frame-exact render: same face/weight/colour, persistent V·A·L FLIP on (0.16,1,0.3,1), scale-to-fit, and the ORIGINAL VALIS -> VILAS finale (V/S fly out, L shrinks to a dot, A revolves over, I under). Words: value valid invaluable approval evaluate festival arrival survival carnival interval (all checked).$$
where id = '1eeddc77-b704-46af-8ee8-d8948b0cfbfa' and status = 'idea';

-- sanity check: should list the five rows above as rendered, and ep 2/9 at queue_position 5
-- select title, status, queue_position, commit_sha from public.instagram_posts order by created_at;

commit;
