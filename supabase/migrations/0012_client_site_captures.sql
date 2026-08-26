-- Automatic screenshot capture for "Out in the world" (round 2, job 4). The
-- iframe embed approach is gone — there's no reliable way to detect a
-- blocked cross-origin iframe from JS, and it was silently falling back to
-- the plain name+link card on every tile. Replaced with real screenshots,
-- either captured server-side (this migration's columns) or dropped in by
-- hand via the existing `screenshot_url` column, which always wins when set.
-- Applied 2026-08-26 to the "Vilas" Supabase project (ref
-- epynfvskwaxejdibvgbr) via the Supabase MCP connector.

alter table public.client_sites
  add column if not exists captured_at timestamptz,
  add column if not exists capture_error text;

comment on column public.client_sites.captured_at is
  'When app/api/capture-sites last wrote a screenshot for this site. Combined with id to build the storage path client-site-captures/{id}/{captured_at date}.png — see lib/screenshot.ts. Null if never captured or if screenshot_url is set by hand (manual overrides skip capture entirely).';
comment on column public.client_sites.capture_error is
  'The last capture attempt''s error message, if any, for a quick look in the dashboard. Cleared on the next successful capture.';

-- Public bucket, same reasoning as intake-logos/intake-photos
-- (0003_create_intake_storage_buckets.sql): captures are served as plain
-- next/image URLs with no signed token, and nothing in it is sensitive —
-- it's a screenshot of a public homepage.
insert into storage.buckets (id, name, public)
values ('client-site-captures', 'client-site-captures', true)
on conflict (id) do nothing;
