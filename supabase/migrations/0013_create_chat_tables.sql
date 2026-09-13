-- Chat backend (session 1): two counters that enforce the daily message
-- limits in app/api/chat/route.ts. No RLS policies on purpose — both tables
-- are touched only server-side with the service role key, which bypasses
-- RLS entirely. Applied 2026-09-10 to the "Vilas" Supabase project (ref
-- epynfvskwaxejdibvgbr) via the Supabase MCP connector.

-- Per-visitor daily count, keyed by a salted SHA-256 hash of IP — global
-- across every site (vilas.studio + all demos). Enforces
-- CHAT_DAILY_MESSAGE_LIMIT.
create table public.chat_usage (
  id bigint generated always as identity primary key,
  visitor_hash text not null,
  day date not null,
  message_count int not null default 0,
  unique (visitor_hash, day)
);

alter table public.chat_usage enable row level security;

-- Per-site daily count. Enforces CHAT_SITE_DAILY_LIMIT so one client's site
-- going viral can't drain the shared OpenAI balance.
create table public.chat_site_usage (
  id bigint generated always as identity primary key,
  site_slug text not null,
  day date not null,
  message_count int not null default 0,
  unique (site_slug, day)
);

alter table public.chat_site_usage enable row level security;
