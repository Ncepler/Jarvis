-- Turns instagram_posts into an idea queue as well as a log. Rows with
-- status = 'idea' are future reels; queue_position orders them (lower =
-- next up). hook_family records which reel-lab hook format the idea uses so
-- consecutive reels rotate formats. Applied 2026-09-29 via the Supabase MCP
-- connector.
--
-- "Make another reel" workflow:
--   1. select * from instagram_posts where status = 'idea'
--        order by queue_position limit 1;
--   2. build it (Hyperframes / brag pipeline), following the row's beats,
--      on_screen_text, music and notes;
--   3. update that same row: status = 'rendered', queue_position = null,
--      video_path, poster_path, commit_sha, and fix any fields that changed
--      during the build. Don't insert a second row for it.

alter table public.instagram_posts
  add column queue_position integer,
  add column hook_family text;

create index instagram_posts_idea_queue_idx
  on public.instagram_posts (queue_position)
  where status = 'idea';

comment on column public.instagram_posts.queue_position is
  'Order of unbuilt ideas (status = idea); lower = next. Null once built.';
comment on column public.instagram_posts.hook_family is
  'reel-lab hook format the post uses (e.g. "13 guess game · COMMENT · LOOP").';

comment on table public.instagram_posts is
  'Every Instagram post/reel made for Vilas, plus the queue of future reel ideas (status = idea, ordered by queue_position). To make the next reel: take the lowest queue_position idea, build it, then update that row to rendered. Service-role only.';
