-- Write-back for the 2026-10-02 overnight batch (10 reels). NOT applied yet — Noah approves in the morning.
-- Project: Vilas (epynfvskwaxejdibvgbr). Table: public.instagram_posts.
-- 1) marks the 10 built ideas as rendered (queue_position -> null, paths, commit, duration, a build note)
-- 2) queues "Details nobody notices 4/9" (the series notes say to insert the next episode once one is built) at position 13,
--    shifting the remaining ideas down by one.
-- Run the whole file as one statement batch. The final SELECT shows the new queue.
begin;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 23.63,
  made_with = 'hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth',
  video_path = 'brag-output-2026-10-02-214am/brag.mp4', poster_path = 'brag-output-2026-10-02-214am/brag.jpg', commit_sha = 'c3c8498',
  notes = coalesce(notes, '') || E'\n\nBUILT 2026-10-02: answers shortened to fit the 0.3s/word read rule (lighting / North Shore incl. Northport / free written estimate, all from the demo FAQ). Chat UI redrawn to match ChatAssistant.tsx. "Example conversation · demo brand" on screen throughout.'
where id = '76b48dd5-84e1-4504-88c8-fd713586f446' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 13,
  made_with = 'hyperframes (brag pipeline) — brag-slim path, series template',
  video_path = 'brag-output-2026-10-02-details-3/brag.mp4', poster_path = 'brag-output-2026-10-02-details-3/brag.jpg', commit_sha = '74875c4',
  notes = coalesce(notes, '') || E'\n\nBUILT 2026-10-02: real photos now (not placeholders). Deviations: zoom 3.7 px/css (switch is 280 css wide), ring hugs the switch thumb, control pill shows the driver (first view / scrolled into view / tap), a 3rd tap wipes back to day for the exact loop. Found: the component auto-plays on any intersection (IO isIntersecting), not at 60% as its comment says.'
where id = '2e6f3045-2c73-4c87-b091-6c514db2e0d8' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 26,
  made_with = 'hyperframes (brag pipeline) — brag-slim path, B&W canvas noir',
  video_path = 'brag-output-2026-10-02-noir/brag.mp4', poster_path = 'brag-output-2026-10-02-noir/brag.jpg', commit_sha = '1334ba5',
  notes = coalesce(notes, '') || E'\n\nBUILT 2026-10-02: string is pale grey (not red) so the magician demo stays the only colour. No voice narration (brag-slim has none). Fictional site "Lawn & Garden Co." tagged "(fictional)" on its polaroid. Encoded CRF 24 (grain).'
where id = '0347557a-1000-42de-8499-70fbdce3a679' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 18.77,
  made_with = 'hyperframes (brag pipeline) — brag-slim path, scripted Playwright run of /start',
  video_path = 'brag-output-2026-10-02-speedrun/brag.mp4', poster_path = 'brag-output-2026-10-02-speedrun/brag.jpg', commit_sha = '4d6552c',
  notes = coalesce(notes, '') || E'\n\nBUILT 2026-10-02: no human time available, so the run is labelled TAS (a bot filled it in) on screen; timer = real on-screen time; deltas vs the form''s own "Takes about five minutes". Splits use the form''s real step names. Nothing submitted (no backend env locally). Want a human-time version? Time yourself and we swap the TAS label.'
where id = 'fe35fd5b-76db-4c79-805d-5fb7ce817c99' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 12,
  made_with = 'hyperframes (brag pipeline) — brag-slim path, 330 real scroll screenshots',
  video_path = 'brag-output-2026-10-02-calm/brag.mp4', poster_path = 'brag-output-2026-10-02-calm/brag.jpg', commit_sha = '88de58f',
  notes = coalesce(notes, '') || E'\n\nBUILT 2026-10-02: hard audio cut + caption swap on frame 108 (3.6s); true silence 9.0–11.0. Spacing: don''t post right after reel #4 (also sound-led).'
where id = '9ac768bd-70f2-4f2b-a3bf-bbcbc2e80b66' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16.5,
  made_with = 'brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)',
  video_path = 'brag-output-2026-10-02-oneline/brag.mp4', poster_path = 'brag-output-2026-10-02-oneline/brag.jpg', commit_sha = 'c5c9edc'
where title = 'Drawn in one line' and status = 'idea' and queue_position = 21;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 18,
  made_with = 'brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)',
  video_path = 'brag-output-2026-10-02-hours/brag.mp4', poster_path = 'brag-output-2026-10-02-hours/brag.jpg', commit_sha = '94aae16'
where title = 'Where are your hours?' and status = 'idea' and queue_position = 22;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16,
  made_with = 'brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)',
  video_path = 'brag-output-2026-10-02-commute/brag.mp4', poster_path = 'brag-output-2026-10-02-commute/brag.jpg', commit_sha = '94aae16'
where title = 'A lead''s commute' and status = 'idea' and queue_position = 23;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 15,
  made_with = 'brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)',
  video_path = 'brag-output-2026-10-02-storefront/brag.mp4', poster_path = 'brag-output-2026-10-02-storefront/brag.jpg', commit_sha = '94aae16'
where title = 'Your storefront shrank' and status = 'idea' and queue_position = 24;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 18,
  made_with = 'brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)',
  video_path = 'brag-output-2026-10-02-questions/brag.mp4', poster_path = 'brag-output-2026-10-02-questions/brag.jpg', commit_sha = '464f7eb'
where title = 'The same five questions' and status = 'idea' and queue_position = 25;

-- next series episode right after the current front of the queue
update public.instagram_posts set queue_position = queue_position + 1 where status = 'idea' and queue_position >= 13;

insert into public.instagram_posts (title, kind, status, queue_position, made_with, format, duration_s, tone, angle, hook, hook_family, beats, on_screen_text, featured, techniques, music, caption, hashtags, notes) values
($q$Details nobody notices 4/9: the before & after handle$q$, 'reel', 'idea', 13, 'hyperframes (brag pipeline)', 'vertical', 13,
 $q$Quiet, macro, nerdy-calm, ASMR-adjacent (series template, identical to eps 1–3)$q$,
 $q$Episode 4. The power-wash demo's full-bleed before/after slider: the handle is spring-scaled, it shows a one-time first-reveal hint, shift+arrow steps it from the keyboard, and the BEFORE/AFTER labels fade by position. Macro on the handle as it's dragged across the driveway.$q$,
 $q$Series band "Details nobody notices 4/9", lens ring on the slider handle, the slider resting mid-way.$q$,
 $q$15 Day N of ___ serial · FOLLOW$q$,
 ARRAY[$q$0.0–1.0s  Band + lens ring on the handle.$q$,$q$1.0–2.4s  Zoom with depth of field (template).$q$,$q$2.4–6.0s  The handle is dragged left then right (real component, captured frame by frame); the spring squash on grab, labels fading by position.$q$,$q$6.0–7.5s  Annotation: 'springs when you grab it'.$q$,$q$8.0–11.0s  Pull back; why-line: 'So the clean half / feels like a reveal.'$q$,$q$11.0–13.0s  '5/9 next: the estimate slider'; ring returns; exact loop.$q$],
 ARRAY['Details nobody notices','4/9','springs when you grab it','5/9 next: the estimate slider'],
 ARRAY['demo-powerwash BeforeAfterSlider (components/demos/system.tsx)'],
 ARRAY['series template (band, lens ring, zoom + DOF, control pill, annotation, why panel, next card)','drive the slider with Playwright pointer events and capture each frame; seek any CSS transitions via document.getAnimations()'],
 $q$No music. Series sound palette: room tone, felt click on grab/release, focus-motor whirr, pen swish on the annotation, a soft water hiss that follows the handle.$q$,
 $q$Nobody notices this either.

The power washing style's before/after handle springs a little when you grab it, so the clean side feels like a reveal. The company is a demo we built, not a real business. Episode 4 of 9.$q$,
 ARRAY['webdesign','uidesign','powerwashing','details'],
 $q$SERIES: copy the template in brag-output-2026-09-30-details-1/brag-plan.md; deviations used so far are in details-2 and brag-output-2026-10-02-details-3/brag-plan.md (wide controls: zoom 3.7 + ring on the part that moves). Check the demo's brand name and the real slider behaviour in system.tsx before writing beats. Insert ep 5 when this one is built.$q$);

commit;

select queue_position, title from public.instagram_posts where status = 'idea' order by queue_position;
