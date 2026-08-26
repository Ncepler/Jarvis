-- Pricing restructure (round 2, job 1): Style/Custom become Basic/Premium/
-- Custom. This adds the `tier` column /start now writes
-- (components/intake/PageContact.tsx's "What matters more" choice →
-- app/api/intake/route.ts). Applied 2026-08-26 to the "Vilas" Supabase
-- project (ref epynfvskwaxejdibvgbr) via the Supabase MCP connector.
--
-- Checked first: no pricing tier was ever persisted before this. The only
-- related columns are `is_custom_build` (boolean) and `template_choice`
-- (a demo slug, e.g. "demo-bakery" — which STYLE, not which pricing tier).
-- Neither one encodes "flagship" or any other tier name, so there is nothing
-- to rename or migrate on the 7 pre-existing rows — `tier` is simply null on
-- all of them, same as any other field added after they were submitted.
alter table public.intake_submissions
  add column if not exists tier text check (tier in ('basic', 'premium', 'custom'));
