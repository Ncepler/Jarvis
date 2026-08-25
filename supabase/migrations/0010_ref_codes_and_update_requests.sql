-- Reference codes for /start submissions, the personal email that looks a
-- submission back up on /updates, and the update_requests table /updates
-- writes to. Applied 2026-08-25 to the "Vilas" Supabase project (ref
-- epynfvskwaxejdibvgbr) via the Supabase MCP connector.
--
-- The sequence starts at 4817 rather than 1 so codes don't look sequential
-- from the first one issued — codes ARE sequential after that (VS-4818
-- follows VS-4817), which is fine: /updates also requires the matching
-- personal_email, so the code alone isn't a secret. Format: 'VS-' + the
-- sequence value, e.g. "VS-4817".
create sequence public.vilas_ref_seq start with 4817 increment by 1;

alter table public.intake_submissions
  add column if not exists ref_code text unique default ('VS-' || nextval('public.vilas_ref_seq')::text),
  add column if not exists personal_email text;

-- Backfill existing rows with a code — the column default only fires on new
-- inserts. personal_email stays null on these; they predate the field, and
-- /updates requires both to match, so old test rows just can't look
-- themselves up until they're resubmitted. Safe to re-run.
update public.intake_submissions
set ref_code = 'VS-' || nextval('public.vilas_ref_seq')
where ref_code is null;

-- /updates: a client looks up their submission by ref_code + personal_email
-- (app/updates/actions.ts, server-side only), then sends free-text change
-- requests against it. Newest first in /d48's Updates view.
create table public.update_requests (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null,
  submission_id uuid references public.intake_submissions(id),
  body text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.update_requests enable row level security;
-- deny-all: no policies. The lookup and the insert both run server-side with
-- the service role key, same pattern as intake_submissions.
