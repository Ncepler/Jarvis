-- Session 2: the $30/month chat assistant add-on, opted into on /start.
-- Bought separately from the monthly, never bundled into a tier — this
-- column just records whether the client asked for it, and
-- lib/generatePrompt.ts reads it to add or drop the whole "Chat assistant"
-- section of the admin build prompt. Applied 2026-09-10 to the "Vilas"
-- Supabase project (ref epynfvskwaxejdibvgbr) via the Supabase MCP
-- connector.

alter table public.intake_submissions
  add column wants_chat_assistant boolean not null default false;
