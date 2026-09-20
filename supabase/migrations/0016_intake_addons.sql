-- Add-ons picker on /start step 1 (job: add-ons + live estimate). Records
-- what was picked and the server-recomputed estimate at submit time — never
-- dollar amounts the client sent, since those can be edited in the browser.
-- Nullable: null for a custom build, which never shows the picker.
alter table public.intake_submissions
  add column if not exists addons jsonb;
