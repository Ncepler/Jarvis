-- Creates the two Storage buckets the /start form uploads into
-- (app/api/intake/route.ts: logo → intake-logos, photos → intake-photos).
-- Run this in the Supabase SQL editor for the "studio-site" project,
-- after 0002_create_intake_submissions.sql. You can also create these by
-- hand in the dashboard (Storage → New bucket) if you'd rather click.
--
-- Both are public so an uploaded file resolves as a plain URL with no
-- signed token needed (that URL is what gets stored in logo_url /
-- photo_urls and what the email in /api/notify-intake links to). The
-- service role key /api/intake uses to upload bypasses bucket RLS either
-- way, public or not — "public" here only affects whether reading a file
-- back out needs a signed URL. Nothing in either bucket is listable
-- without the key; paths include a timestamp, so they're not guessable,
-- but anyone who has a URL can view that one file. Flip `true` to `false`
-- below if that's not okay and ask for the signed-URL version instead.

insert into storage.buckets (id, name, public)
values ('intake-logos', 'intake-logos', true);

insert into storage.buckets (id, name, public)
values ('intake-photos', 'intake-photos', true);
