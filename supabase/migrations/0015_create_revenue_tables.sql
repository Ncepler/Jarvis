-- Manual revenue ledger for /d48/revenue (webhook/Stripe version comes
-- later — this is deliberately the simplest model that can be replaced by
-- one). Noah logs payments and monthly plans by hand behind the same
-- password gate the rest of /d48 uses. Dollars in the UI, integer cents in
-- the DB, same convention as everywhere else money touches this app.

create table if not exists public.revenue_entries (
  id uuid primary key default gen_random_uuid(),
  received_on date not null,
  client_name text not null,
  kind text not null check (kind in ('build', 'monthly', 'other')),
  amount_cents integer not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.revenue_plans (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  monthly_cents integer not null,
  starts_on date not null,
  ends_on date,
  note text,
  created_at timestamptz not null default now()
);

-- deny-all: RLS enabled with zero policies; only the service role (server
-- side, same pattern as intake_submissions) can read or write.
alter table public.revenue_entries enable row level security;
alter table public.revenue_plans enable row level security;
