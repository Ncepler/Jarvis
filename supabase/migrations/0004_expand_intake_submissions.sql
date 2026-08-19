-- Expands intake_submissions for the reworked /start form and the /d48
-- dashboard. Run this in the Supabase SQL editor against the "Vilas" project
-- (ref epynfvskwaxejdibvgbr) before the new form can save anything: the
-- insert in app/api/intake/route.ts writes every column below.
--
-- Safe to re-run. `status` already exists on this table with a 'new' default;
-- it's listed here so a fresh database built from these files matches.

alter table public.intake_submissions
  add column if not exists business_type text,
  add column if not exists template_choice text,
  add column if not exists is_custom_build boolean not null default false,
  add column if not exists desired_domain text,
  add column if not exists main_logo_url text,
  add column if not exists profile_logo_url text,
  add column if not exists profile_logo_original_url text,
  add column if not exists hero_video_url text,
  add column if not exists template_customizations jsonb,
  add column if not exists copy_changes text,
  add column if not exists status text default 'new';

-- Hero video uploads (app/api/intake/route.ts, bucket "intake-videos").
-- Public for the same reason as intake-logos / intake-photos: the stored URL
-- resolves without a signed token. See 0003 for the tradeoff.
insert into storage.buckets (id, name, public)
values ('intake-videos', 'intake-videos', true)
on conflict (id) do nothing;
