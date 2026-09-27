-- Log of every Instagram post/reel made for Vilas (mostly /brag reels), so a
-- new one never accidentally repeats an old angle, hook, or visual trick.
-- Before making a new post: read this table and pick a different angle, hook,
-- and techniques. After rendering one: insert a row. Applied 2026-09-27 to the
-- "Vilas" Supabase project (ref epynfvskwaxejdibvgbr) via the Supabase MCP
-- connector.

create table public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  kind text not null default 'reel' check (kind in ('reel', 'carousel', 'image', 'story')),
  status text not null default 'rendered' check (status in ('idea', 'rendered', 'posted', 'scrapped')),
  posted_at timestamptz,
  instagram_url text,
  made_with text,
  format text check (format in ('vertical', 'square', 'landscape')),
  duration_s numeric(5, 2),
  tone text,
  angle text not null,
  hook text not null,
  beats text[] not null default '{}',
  on_screen_text text[] not null default '{}',
  featured text[] not null default '{}',
  techniques text[] not null default '{}',
  music text,
  caption text,
  hashtags text[] not null default '{}',
  video_path text,
  poster_path text,
  commit_sha text,
  notes text
);

comment on table public.instagram_posts is
  'Every Instagram post/reel made for Vilas. Check angle/hook/techniques here before making a new /brag reel so it is not a repeat; insert a row after rendering. Service-role only.';

-- deny-all: RLS enabled with zero policies; only the service role can read or
-- write (same as revenue_entries). Internal-only, so also hidden from the
-- public GraphQL schema.
alter table public.instagram_posts enable row level security;
revoke all on public.instagram_posts from anon, authenticated;
