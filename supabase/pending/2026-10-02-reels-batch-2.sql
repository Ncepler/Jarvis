-- Write-back for the 2026-10-02 SECOND batch (20 reels, built with NO Supabase access that turn). NOT applied.
-- Run 2026-10-02-reels-batch.sql (batch 1) FIRST: it inserts the "Details 4/9" row this file marks rendered.
-- 1) marks 13 existing idea rows rendered (queue_position -> null), 2) inserts 7 new rows straight as rendered,
-- 3) renumbers the remaining ideas 1..n in their current order. Final SELECT shows the new queue.
-- Rows matched by title: if a title differs in the table, that UPDATE touches 0 rows. Check the counts before committing.
begin;

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 13,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth, series template$q$,
  video_path = 'brag-output-2026-10-02-details-4/brag.mp4', poster_path = 'brag-output-2026-10-02-details-4/brag.jpg', commit_sha = '10bd924',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Built from the ep-4 row that batch-1 SQL inserts; run that file first.$q$
where title = 'Details nobody notices 4/9: the before & after handle' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 18,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-dating/brag.mp4', poster_path = 'brag-output-2026-10-02-dating/brag.jpg', commit_sha = '695d1c4',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Only made-up sites get swiped left (drawn in canvas); Tide Line is labelled a demo brand. Post well after reel #4 (same hero).$q$
where id = 'a516beea-58d8-4cda-bc25-75d19c0ad52c' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 22,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-busy/brag.mp4', poster_path = 'brag-output-2026-10-02-busy/brag.jpg', commit_sha = '39e3e4a',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Archetypes only, through demo photography; start times labelled illustrative on screen.$q$
where id = 'd96bc7dd-366e-47e3-8933-15a54cb5ecab' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 18,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-board/brag.mp4', poster_path = 'brag-output-2026-10-02-board/brag.jpg', commit_sha = '695d1c4',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Answers are COPY.faq shortened to board length without changing what they say; no price/date/promise the site does not state.$q$
where id = '0d27ca0a-1fe3-4292-bd9b-959e1f11df38' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-meanwhile/brag.mp4', poster_path = 'brag-output-2026-10-02-meanwhile/brag.jpg', commit_sha = 'f04c9d9',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Split-screen pictograms. Same family as "Waiting for the old site"; don't post back to back.$q$
where id = 'b3630b09-6625-4ec9-bb2f-55fa46c51a12' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 20,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-fw26/brag.mp4', poster_path = 'brag-output-2026-10-02-fw26/brag.jpg', commit_sha = '39e3e4a',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Lookbook lines describe only what each demo really has ("paint-matched", not "chrome").$q$
where id = '8ebe3fa0-1b77-4829-8174-8c54e8de8136' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-race/brag.mp4', poster_path = 'brag-output-2026-10-02-race/brag.jpg', commit_sha = 'f9e6ba0',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): The Vilas lane uses only the site's own wording (COPY.headings.process), no day count. "No shade to your nephew." on screen.$q$
where id = 'd1a50f8d-7a5f-4c15-aec1-9e4a09ae6256' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 9,
  made_with = $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$,
  video_path = 'brag-output-2026-10-02-countdown/brag.mp4', poster_path = 'brag-output-2026-10-02-countdown/brag.jpg', commit_sha = '39e3e4a',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Real code + real build output (cut before the route table). Post only once the grid has 6+ finished posts and after the power-wash reel (#4).$q$
where id = '34ca5c05-3af0-4205-8dfe-4acc2ada49d7' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16,
  made_with = $q$brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)$q$,
  video_path = 'brag-output-2026-10-02-draw/brag.mp4', poster_path = 'brag-output-2026-10-02-draw/brag.jpg', commit_sha = '4725a49',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2).$q$
where title = 'Draw your business' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 16,
  made_with = $q$brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)$q$,
  video_path = 'brag-output-2026-10-02-twoshops/brag.mp4', poster_path = 'brag-output-2026-10-02-twoshops/brag.jpg', commit_sha = '4725a49',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2).$q$
where title = 'Two shop owners' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 15,
  made_with = $q$brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)$q$,
  video_path = 'brag-output-2026-10-02-threelines/brag.mp4', poster_path = 'brag-output-2026-10-02-threelines/brag.jpg', commit_sha = '2b41b5d',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2).$q$
where title = 'Three lines to launch' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 20,
  made_with = $q$brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)$q$,
  video_path = 'brag-output-2026-10-02-shy/brag.mp4', poster_path = 'brag-output-2026-10-02-shy/brag.jpg', commit_sha = '2b41b5d',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2).$q$
where title = 'The owner who hid from the internet' and status = 'idea';

update public.instagram_posts set status = 'rendered', queue_position = null, duration_s = 14,
  made_with = $q$brag-slim path + canvas line art (stickman-inspired; not Gemini Omni)$q$,
  video_path = 'brag-output-2026-10-02-waiting/brag.mp4', poster_path = 'brag-output-2026-10-02-waiting/brag.jpg', commit_sha = '6f0a82e',
  notes = coalesce(notes, '') || $q$

BUILT 2026-10-02 (batch 2): Same family as "Meanwhile, while your site loads"; don't post back to back.$q$
where title = 'Waiting for the old site' and status = 'idea';

insert into public.instagram_posts (title, kind, status, made_with, format, duration_s, tone, angle, hook, hook_family, featured, techniques, music, caption, hashtags, video_path, poster_path, commit_sha, notes) values
($q$Details nobody notices 5/9: the estimate that doesn't count up$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth, series template$q$, 'vertical', 13,
 $q$Quiet, macro, nerdy-calm (series template)$q$,
 $q$Episode 5. The lawn care estimate: when the price changes it blurs for a split second and lands, instead of spinning up like a slot machine.$q$,
 $q$Series band, lens ring on the estimate price.$q$, $q$15 Day N of ___ serial · FOLLOW$q$,
 ARRAY[$q$demo-lawncare estimate (LawnCareDemo.tsx)$q$]::text[], ARRAY[$q$series template$q$,$q$Motion spring simulated in canvas from real captured states (fake clock blanked the page)$q$]::text[],
 $q$No music. Series sound palette.$q$,
 $q$Nobody notices this either.

When the lawn care style's estimate changes, the price doesn't spin up like a slot machine. It blurs for a split second and lands. Fresh Cut Lawn Co. is a demo we built, not a real company. Episode 5 of 9.

#webdesign #uidesign #lawncare #details$q$,
 ARRAY[$q$webdesign$q$,$q$uidesign$q$,$q$lawncare$q$,$q$details$q$]::text[],
 'brag-output-2026-10-02-details-5/brag.mp4', 'brag-output-2026-10-02-details-5/brag.jpg', '2e2114a',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. SERIES: insert ep 7 when the next one is built (ep 6 is built).$q$),
($q$Details nobody notices 6/9: the occasion preview$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth, series template$q$, 'vertical', 13,
 $q$Quiet, macro, nerdy-calm (series template)$q$,
 $q$Episode 6. On desktop the florist demo shows the real flowers trailing the mouse as you look through the occasions.$q$,
 $q$Series band, lens ring on the occasion list.$q$, $q$15 Day N of ___ serial · FOLLOW$q$,
 ARRAY[$q$demo-florist occasion preview (FloristDemo.tsx)$q$]::text[], ARRAY[$q$series template$q$,$q$real captures + real preview crops$q$]::text[],
 $q$No music. Series sound palette.$q$,
 $q$Nobody notices this either.

On a computer, the florist style shows you the real flowers trailing your mouse as you look through the occasions. Wildstem Florals is a demo we built, not a real shop. Episode 6 of 9.

#webdesign #uidesign #florist #details$q$,
 ARRAY[$q$webdesign$q$,$q$uidesign$q$,$q$florist$q$,$q$details$q$]::text[],
 'brag-output-2026-10-02-details-6/brag.mp4', 'brag-output-2026-10-02-details-6/brag.jpg', '7d3ada0',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. SERIES: ep 7 not written yet; its next card is in details-6/brag-plan.md.$q$),
($q$Same site. Every screen.$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$, 'vertical', 15,
 $q$Clean, calm, demonstrative$q$,
 $q$A browser window on the real florist demo is dragged from 1280px to 360px and back; 225 real screenshots, one per width; the readout flips desktop → tablet → phone.$q$,
 $q$A cursor grabs the window edge: 1280px.$q$, $q$process reveal · SAVE$q$,
 ARRAY[$q$demo-florist$q$]::text[], ARRAY[$q$one real screenshot per viewport width (225)$q$,$q$breakpoint-synced sound$q$]::text[],
 $q$Pad + pulse, stretch sweep following the drag, marimba tick per breakpoint.$q$,
 $q$Same site. Every screen. Most of your customers will see the phone version first, so we build that one first.

Wildstem Florals is a demo brand. Every frame is the real page at that width.

#webdesign #responsivedesign #smallbusiness #longisland$q$,
 ARRAY[$q$webdesign$q$,$q$responsivedesign$q$,$q$smallbusiness$q$,$q$longisland$q$]::text[],
 'brag-output-2026-10-02-reflow/brag.mp4', 'brag-output-2026-10-02-reflow/brag.jpg', 'b9ed8d2',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder.$q$),
($q$Your name here$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$, 'vertical', 18,
 $q$Warm, inviting, interactive$q$,
 $q$In four real demo styles the sample brand name is backspaced out and a placeholder ("Your Bakery Here") typed in, every occurrence swapped in the DOM, one screenshot per keystroke. Ends on a comment prompt.$q$,
 $q$Pushed in on "Golden Hour Bakehouse" with a blinking caret: "A bakery?"$q$, $q$fill-in-the-blank · COMMENT$q$,
 ARRAY[$q$demo-bakery$q$,$q$demo-barber$q$,$q$demo-florist$q$,$q$demo-powerwash$q$]::text[], ARRAY[$q$live DOM text swap per keystroke$q$,$q$camera push-in on the header$q$]::text[],
 $q$Warm groove, soft key clicks, a bell per landed name.$q$,
 $q$Picture your name up there. What would yours say? Tell us in the comments.

Mockup: our demo styles with placeholder names. Start at vilas.studio/start.

#webdesign #smallbusiness #localbusiness #longisland$q$,
 ARRAY[$q$webdesign$q$,$q$smallbusiness$q$,$q$localbusiness$q$,$q$longisland$q$]::text[],
 'brag-output-2026-10-02-yourname/brag.mp4', 'brag-output-2026-10-02-yourname/brag.jpg', 'b9ed8d2',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. Mockup label on screen; DEMO BUILD badge stays visible. CTA asks for comments only (no free-mockup promise).$q$),
($q$3 questions to ask before you hire a web designer$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$, 'vertical', 21,
 $q$Useful, calm, trustworthy$q$,
 $q$General buyer advice, each question answered with the studio's real answer on its own site: the FAQ accordion (own the site? / don't like it?) and the /updates page for changes later.$q$,
 $q$"Ask these 3 questions before you hire a web designer."$q$, $q$listicle · SAVE$q$,
 ARRAY[$q$FAQ accordion (components/sections/Faq.tsx)$q$,$q$/updates$q$]::text[], ARRAY[$q$accordion height rebuilt from real closed/open captures + measured height + house easing$q$,$q$full-width card crops for readability$q$]::text[],
 $q$Calm piano + soft pulse, a felt pop on the accordion.$q$,
 $q$3 questions to ask before you hire a web designer. Save this.

1. Who owns the site and the domain?
2. What happens if I don't like it?
3. How do I ask for changes later?

Our answers are on vilas.studio. Ask whoever you hire, even if it isn't us.

#smallbusiness #webdesign #smallbusinesstips #longisland$q$,
 ARRAY[$q$smallbusiness$q$,$q$webdesign$q$,$q$smallbusinesstips$q$,$q$longisland$q$]::text[],
 'brag-output-2026-10-02-questions3/brag.mp4', 'brag-output-2026-10-02-questions3/brag.jpg', '287776c',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. Example ref code is the form's own placeholder (labelled).$q$),
($q$Spin for a style$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$, 'vertical', 19,
 $q$Playful, game-show-lite in studio colours$q$,
 $q$A prize wheel of seven demo niches spins, ticks on every peg and lands; it dives into that real demo. Twice. Then "Which one's yours?"$q$,
 $q$A wheel in studio colours: "Spin for a style."$q$, $q$game · SHARE$q$,
 ARRAY[$q$demo-barber$q$,$q$demo-bakery (+ wheel slices for all 7)$q$]::text[], ARRAY[$q$ease-out-quart spin as a pure function of t; ticks derived from the same angle$q$]::text[],
 $q$Wooden peg ticks following wheel speed, landed chime, marimba groove under each demo.$q$,
 $q$Spin for a style. Which one's yours?

Every style shown is a demo, not a client site. vilas.studio

#webdesign #smallbusiness #localbusiness #longisland$q$,
 ARRAY[$q$webdesign$q$,$q$smallbusiness$q$,$q$localbusiness$q$,$q$longisland$q$]::text[],
 'brag-output-2026-10-02-wheel/brag.mp4', 'brag-output-2026-10-02-wheel/brag.jpg', '287776c',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. Demo captures reused from the FW26 reel.$q$),
($q$If these sites had a soundtrack$q$, 'reel', 'rendered', $q$hyperframes (brag pipeline) — brag-slim path: Playwright capture + canvas composition + numpy synth$q$, 'vertical', 19.2,
 $q$Vibe edit, music-led$q$,
 $q$Seven real demos, each scored with its own 2.2s genre cue (piano, boom bap, lo-fi, dark synth, summer pop, acoustic, waltz), hard-cut on the downbeat, with a now-playing card whose EQ bars are the real mix.$q$,
 $q$"If these sites had a soundtrack." + sound on.$q$, $q$vibe edit · SEND$q$,
 ARRAY[$q$all 7 demos$q$]::text[], ARRAY[$q$per-genre synth cues levelled per bus$q$,$q$EQ bars driven by band levels of the final mix (cap/env.json)$q$]::text[],
 $q$Seven synthesized genre cues; made-up track titles, no real songs.$q$,
 $q$If these sites had a soundtrack. Sound on.

Which one's your shop? All demo builds, not client sites. Track titles are made up.

#webdesign #smallbusiness #localbusiness #longisland$q$,
 ARRAY[$q$webdesign$q$,$q$smallbusiness$q$,$q$localbusiness$q$,$q$longisland$q$]::text[],
 'brag-output-2026-10-02-soundtrack/brag.mp4', 'brag-output-2026-10-02-soundtrack/brag.jpg', '4b2d442',
 $q$BUILT 2026-10-02 (batch 2). See brag-plan.md in the folder. Track titles are invented for the bit (labelled on screen).$q$);

-- close the gaps left by the built ideas, keeping their order
with o as (select id, row_number() over (order by queue_position) as rn from public.instagram_posts where status = 'idea' and queue_position is not null)
update public.instagram_posts p set queue_position = o.rn from o where p.id = o.id;

commit;

select queue_position, title from public.instagram_posts where status = 'idea' order by queue_position;
