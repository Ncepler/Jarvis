-- Creates the intake_submissions table for the /start form
-- (app/api/intake/route.ts writes here). Run this in the Supabase SQL
-- editor for the "studio-site" project. Kept here so the schema is
-- reproducible — same pattern as 0001_create_leads.sql.

create table public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',

  -- page 1: contact
  business_name text not null,
  your_name text not null,
  business_email text not null,
  phone text,
  address text not null,

  -- page 2: brand
  palette_choice text not null, -- 'template' | 'own'
  main_color text, -- hex, only set when palette_choice = 'own'
  accent_color text,
  has_logo text not null, -- 'yes' | 'no'
  logo_url text,

  -- page 3: content
  template text not null, -- demo slug, or 'custom'
  services text not null,
  hours jsonb, -- [{day, closed, open, close}, ...]
  instagram text,
  facebook text,
  google_business text,
  photo_urls jsonb, -- [{name, url}, ...]

  -- page 4: brain dump
  brain_dump text
);

-- deny-all: RLS enabled with zero policies; only the service role
-- (used exclusively by /api/intake and /api/notify-intake, server-side
-- only) bypasses it — same pattern as public.leads.
alter table public.intake_submissions enable row level security;
