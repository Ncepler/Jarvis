-- `template` predates `template_choice` and duplicated it: on a template
-- build the two always held the same value, and on a custom build `template`
-- held the literal string "custom" while `template_choice` was null and
-- `is_custom_build` already said the same thing as a proper boolean. Nothing
-- lived in `template` that isn't already derivable from `template_choice` +
-- `is_custom_build`.
--
-- Backfill first in case any row somehow has a template value that never
-- made it into template_choice, then drop the column. Safe to re-run: the
-- backfill only touches rows that still need it, and the drop is a no-op
-- once the column is gone.

update public.intake_submissions
set template_choice = template
where template_choice is null
  and template is not null
  and template <> 'custom';

alter table public.intake_submissions
  drop column if exists template;
