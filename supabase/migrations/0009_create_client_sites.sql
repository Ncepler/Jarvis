-- Real client sites for the new "Out in the world" gallery (replaces the
-- deleted before/after section). Noah adds rows manually as clients ship;
-- the gallery reads them ordered by sort_order, then created_at, filtered to
-- published = true. Applied 2026-08-25 to the "Vilas" Supabase project (ref
-- epynfvskwaxejdibvgbr) via the Supabase MCP connector.

create table public.client_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  build_type text not null check (build_type in ('custom', 'style')),
  style_name text,
  description text,
  screenshot_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.client_sites enable row level security;

-- Read-only and public on purpose: the gallery section fetches this table
-- server-side with the service role key (same pattern as everywhere else in
-- this app), so this policy isn't actually exercised by the app today, but
-- it's here in case a client-side read is ever wired up directly.
create policy "public read published sites"
  on public.client_sites for select
  using (published = true);

-- Seed: the three sites live as of this writing. Ordered so PackPerfect
-- (the custom build) isn't first — Jonah Shapiro Magic and Val's Elegant
-- Barbershop (style demos) lead.
insert into public.client_sites (name, url, build_type, style_name, description, sort_order) values
  ('Jonah Shapiro Magic', 'https://jonahshapiromagic.vercel.app', 'style', 'Magician', 'A working magician''s site built from our Magician style: shows, reactions, and a booking form up front.', 10),
  ('PackPerfect', 'https://packperfectinc.com', 'custom', null, 'A custom build for a packing and shipping company, built from scratch around how they actually take orders.', 20),
  ('Val''s Elegant Barbershop', 'https://valsbarbershop.vercel.app', 'style', 'Barbershop', 'A barbershop site built from our Barbershop style, booking a chair front and center.', 30);
