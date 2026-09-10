-- Chat assistant rate limiting (Vilas chat add-on, session 1 job 2). Applied
-- 2026-09-10 to the "Vilas" Supabase project (ref epynfvskwaxejdibvgbr) via
-- the Supabase MCP connector.
--
-- Server-only (service role key) — RLS on with no public policies, same
-- pattern as intake_submissions / client_sites. chat_usage is keyed on a
-- salted hash of the visitor's IP and is GLOBAL across every site (see
-- app/api/chat/route.ts); chat_site_usage is a per-site ceiling so one
-- client's site going viral can't drain the shared OpenAI balance.

create table if not exists public.chat_usage (
  id bigint generated always as identity primary key,
  visitor_hash text not null,
  day date not null,
  message_count int not null default 0,
  unique (visitor_hash, day)
);

alter table public.chat_usage enable row level security;

create table if not exists public.chat_site_usage (
  id bigint generated always as identity primary key,
  site_slug text not null,
  day date not null,
  message_count int not null default 0,
  unique (site_slug, day)
);

alter table public.chat_site_usage enable row level security;

comment on table public.chat_usage is
  'Per-visitor daily chat message count, keyed by a salted SHA-256 hash of IP — global across every site (vilas.studio + all demos). Enforces CHAT_DAILY_MESSAGE_LIMIT in app/api/chat/route.ts. Service-role only.';
comment on table public.chat_site_usage is
  'Per-site daily chat message count. Enforces CHAT_SITE_DAILY_LIMIT in app/api/chat/route.ts so one site cannot drain the shared OpenAI balance. Service-role only.';
