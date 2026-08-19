-- /start now lets a client switch off any section of the template they picked:
-- a business with no reason for a scrolling word strip shouldn't have to fill
-- one in to get past that page. The keys they switched off are recorded here,
-- and the generated build prompt turns them into "remove these sections".
--
-- Kept out of template_customizations on purpose: that column holds content
-- for the page, and this is an instruction about the page. Safe to re-run.

alter table public.intake_submissions
  add column if not exists dropped_sections jsonb;

comment on column public.intake_submissions.dropped_sections is
  'Question keys from lib/templates.ts the client asked to leave off the site '
  'entirely, e.g. ["marqueeWords","faq"]. Null means they kept everything.';
