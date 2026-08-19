-- /d48 gained an Archived view: archiving a submission sets
-- intake_submissions.status to 'archived' instead of deleting anything, and
-- permanent delete is offered from that view only.
--
-- No schema change was needed. `status` is plain `text not null default 'new'`
-- (0002) with no CHECK constraint, so the new value was already legal —
-- verified against the "Vilas" project (ref epynfvskwaxejdibvgbr) before
-- writing this. What the column is missing is a record of what it means, so
-- that's what this adds. Safe to re-run.
--
-- If a CHECK constraint is ever added here, it has to list all four values.

comment on column public.intake_submissions.status is
  'Where a submission is in the pipeline: new | in progress | done | archived. '
  'Archived rows are hidden from every /d48 view except the Archived filter; '
  'they are the only rows that can be permanently deleted, which also removes '
  'their uploaded files from intake-logos / intake-photos / intake-videos.';
