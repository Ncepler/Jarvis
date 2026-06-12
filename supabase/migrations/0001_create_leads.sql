-- Applied to the "studio-site" Supabase project (ref wbrftodyvnjxxncfnvvt)
-- on 2026-06-12. Kept here so the schema is reproducible.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business text not null,
  email text not null,
  path text,
  style_slug text,
  message text,
  colors text,
  links text,
  details text,
  step2_completed boolean not null default false
);

-- deny-all: RLS enabled with zero policies; only the service role
-- (used exclusively by /api/lead server-side) bypasses it
alter table public.leads enable row level security;
