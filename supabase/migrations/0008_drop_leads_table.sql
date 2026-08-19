-- `leads` was the homepage contact form's table, alongside /api/lead. The
-- homepage form was removed a while back (see HANDOFF) and nothing in the
-- app writes to /api/lead any more — grepped the codebase to confirm, only
-- /api/lead/route.ts itself still references it. The table holds nothing but
-- old test rows. Dropping it, and the route with it.

drop table if exists public.leads;
