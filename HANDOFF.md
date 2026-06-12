# HANDOFF — updated 2026-06-12 (v8)

## Current state
- Deployed: https://jarvis-nceplers-projects.vercel.app — builds clean (build + tsc + lint), footer stamp v8
- This session (de-AI copy / wash reveal / two-step intake / promise audit):
  - **Copy de-AI pass (v5):** "X, not Y" tic cut from 6 → 2 page-wide (kept
    "picked, not produced." and "Skip the line, not the bread."); "no X, no Y"
    capped at 2 (kept lawn-care + barber); named fixes: gallery intro "Drag
    through and step inside one.", FAQ "Send your logo, photos, and hours. We
    write everything else.", All Sites header "Every site".
  - **Power-wash reveal rebuilt (v6):** blur-in is GONE. Now: 12 dirt blobs +
    backdrop sepia tint over the Tide Line hero, 0.8s hold after the hero
    scrolls into view (useInView once — mount-time playback was invisible,
    see d8f90c4), then a blurred spray wedge sweeps L→R over 2.5s (2s ≤640px)
    with the dirty layer clip-path-cut in its wake. Near-linear ease, plays
    once, overlay unmounts ~3.6s after start. Reduced motion: overlay
    display:none, loads clean.
  - **Two-step intake (v7):** step 1 (name/business/email/which-way-in +
    honeypot) POSTs /api/lead → full lead row in Supabase, returns id; step 2
    (colors + "not sure yet", links, anything else) PATCHes the row, fully
    skippable, never gates the save. No uploads — success copy sets the
    expectation ("Have your logo and a few photos handy."). No backend env →
    single-step mailto fallback (honest error while SITE.email is TBD).
  - **Promise audit (v8):** risk-reversal sentence now identical near tiers
    AND contact submit (same COPY.services.riskReversal string). Price labels
    consistent everywhere (~$300 / from $500 / let's talk).

## Supabase (decision RESOLVED 2026-06-12: Supabase, council-decided)
- Project "studio-site", ref `wbrftodyvnjxxncfnvvt`, us-east-1, free tier.
- `leads` table created (id, created_at, name, business, email, path,
  style_slug, message, colors, links, details, step2_completed). RLS enabled,
  deny-all, zero policies — service role only. Migration mirrored in
  `supabase/migrations/0001_create_leads.sql`.
- `/api/lead` uses plain fetch → PostgREST (no client lib installed).
  POST = insert, PATCH = step-2 update (only those 3 columns + flag).
- `.env.local` has SUPABASE_URL filled, SERVICE_ROLE_KEY blank — **Noah must
  paste the key** (dashboard → Settings → API keys) into .env.local AND
  Vercel env, then redeploy. Until then the live form is the mailto fallback.
- Free-tier projects pause after ~1 week idle — unpause before launch.

## Next up (ordered)
1. Noah: service role key into Vercel → redeploy → submit a test lead on the
   live form → check the row lands (then delete the test row).
2. "We reply within a day" needs Noah to actually SEE leads: either a daily
   dashboard check habit or an email notification later (needs SITE.email →
   blocked on brand name anyway).
3. Real-browser pass still owed: wash-reveal feel (dirty → wedge sweep →
   clean, once), two-step form flow, phone width, reduced motion. Codespace
   has no browser. Lighthouse mobile number also still pending (≥90 / LCP <2.5s).
4. Brand name still blocks lib/site.ts, OG image, domain.

## Gotchas & decisions
- **Version stamp (standing rule):** bump `lib/version.ts` every push; last
  message of session states "version: vN".
- Copy tic budget (Noah 2026-06-12): "X, not Y" max twice page-wide (the two
  keepers above), "no X, no Y" max twice. Don't reintroduce. Demo copy stays
  punchy ("Baked at 4am. Gone by noon." is the bar).
- Pay-when-happy phrasing is ONE string (COPY.services.riskReversal) rendered
  in Services AND Contact — keep them identical, edit in one place.
- FAQ "Do I own the site?" answer still PENDING NOAH verification (domain/
  hosting reality); yearly-fee copy (~$200/yr) still shipped WITHOUT, his pick.
- §6.3 morph-expand superseded (panel always open, follows center). §6.4
  "not a button" overridden (founder card). Don't update CLAUDE.md unasked.
- Demos: self-contained colors, sample brands + 555 numbers, DEMO_DESIGN_W
  =1280, per-demo keyframe prefixes (pw-, barber-, …); each mounts 2-3×
  (thumb, clipped backdrop, panel) — the pw dirt overlay therefore runs per
  mount, but unmounts itself after the sweep.
- Display font Instrument Serif / body Inter. Gallery ↔ Contact wired via
  `preselect-style` CustomEvent (step-1 style select auto-fills).
- Vercel: vercel.json pins framework=nextjs; deployment protection off.
- Ask Noah before installs outside CLAUDE.md §3 (none this session; /api/lead
  deliberately uses fetch, not @supabase/supabase-js).

## Blocked on Noah
- SUPABASE_SERVICE_ROLE_KEY into Vercel + .env.local (see above)
- Brand name (+ domain, tagline, email, Instagram, founder name → lib/site.ts)
- Sign-off on this session's copy changes (OLD→NEW table in chat)
- Pressure-washing hero clip for the power-wash demo (slot still ready)
- A phone + real-browser pass on the live URL
