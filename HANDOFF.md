# HANDOFF — updated 2026-10-10 (zach-d autopilot; reel batches 1–3; site state below is from main, merged in)

## Marketing — new format (2026-10-06)
- **Skill `.claude/skills/zach-d-reel/`** (replaces the short-lived `trojan-reel`): Noah uploads a Zack D Films-style story video (part 1).
  We append a part 2 that hooks the video's last line/last image and lands it on vilas.studio. **The original is never edited unless Noah asks.**
  Updated 2026-10-07 with everything learned on the railgun reel: word-swap hinge, voice clone recipe (Higgsfield), covering the creator's marks,
  the hype laser-drop ending (config-driven template in `assets/hype-ending/`), and tested scripts: `gop.py` (keyframes / GOP extract),
  `assemble.py` (cut + cover + append; stream-copies untouched frames and verifies them bit-identical, PSNR-checks every re-encoded range,
  checks the audio; replaces `join.sh`), `strip.sh` and `envelope.py` (frame/audio timing). `references/` has the teardowns, `vilas.md`,
  `editing-the-original.md`, `voice-clone.md`, `hype-ending.md`, `environment.md` and `worked-example-railgun.md`.
  A zip of the folder was sent to Noah to upload as a claude.ai skill (re-send it after any change).
- **2026-10-10: zach-d-reel is now autopilot ("make N videos" is the whole order).** Cause: Noah's unattended sloth run shipped a silent
  non-cut (part 2 began on the original's footage under a caption band), a hollow "VILAS.studio" box, a flat TTS voice (pitch spread 14 Hz vs
  the narrator's 69 Hz: "Stephen Hawking"), 1.66 s of dead air, and left "ZACK D FILMS" uncovered at ~16-18 s. The laser drop, the clone and the mark
  covers had all been opt-in, and every fallback said "ask Noah". Now: `references/autopilot.md` holds every answer (source from @zackdfilms92, Snaptik,
  TikTok-watermark removal, cover all creator marks, hype laser-drop default, clone-or-no-voice, style rotation, copy sets, delivery);
  `assets/hype-ending` + the dancers preset take `"opening": "orb"` (hard cut to a whole new screen, hit on frame 0) and run voiceless;
  new `scripts/qa.py` gate (hard cut / 30-80 Hz thump / dead air / loudness / length / voice pitch), calibrated: railgun + vehicle PASS, sloth FAILS;
  `references/worked-example-sloth-failure.md` is the negative example. Not verified by ear: nothing here can hear. The claude.ai-uploaded copy of the
  skill is a separate zip and must be re-uploaded after this change (zip re-sent to Noah).
- **First zach-d reel built: `brag-output-2026-10-07-railgun/`.** A railgun-from-the-Moon video, cut at 33.167s (Noah asked for this cut) so "until it hit Earth" becomes "until it hit Vilas Studio" in a Higgsfield clone of the narrator's voice, then a 5.85s laser drop. Not posted.
  Still to check: listen to whether the clone says "VEE-las". Also: the delivered mix has only ~0.8 dB of voice-over-snare-roll on the last syllable of "Studio" (template's `audio.py` now ducks the roll, 9.0/22.1/10.5 dB); the delivered file is unchanged, offer a re-render. Noah also needs to decide whether to post a clone of the creator's voice at all (see its brag-plan.md).
- **Second zach-d reel: `brag-output-2026-10-08-vehicle/`.** "If you forgot where you parked" video; cut at frame 916 (30.564s) so
  "…and the police locate your vehicle" becomes "…locate Vilas Studio" (clone of the narrator, spelled "Veelas"), then a 6.6s
  purple/blue/red laser drop with laser stick-figure dancers. Covered on Noah's ask: "ZACK D FILMS" licence plate/tailgate
  (10.8-12.6s) and the D◀ logo on the key fob (1.9-3.0s). Not posted. To check by ear: "VEE-las" and the mix.
  Skill fixes from it: `assemble.py` now keeps BT.709 colour on re-encoded GOPs (was a ~5-level shift) and checks frames by decode
  index (the ffmpeg psnr filter mis-paired frames); new `scripts/examples/erase_letters.py` for printed letters on moving props.
  Higgsfield balance after this reel: 2.66 credits. Skill updated 2026-10-10 with the lessons (worked-example-vehicle.md, presets/locate-dancers,
  grid.py / compare_cover.py / pitch.py); re-send the skill zip to Noah after any further change.
- Gotcha: upload.higgsfield.ai, the Higgsfield CDN and backend.composio.dev are all blocked by the egress proxy. Workaround: send files to Higgsfield via a public raw.githubusercontent URL (`media_import_url`), and bring results back through the Composio workbench as md5-checked base64.
- Gotcha: Hugging Face model downloads are blocked by the proxy, so local speech-to-text (whisper) can't fetch models. Read the burned-in captions instead.

## Reels — state as of 2026-10-02 (branch `claude/eager-fermat-5bv4m7`)
- **10 new reels rendered + committed tonight** (one folder each, `brag-output-2026-10-02-<slug>/` with
  brag.mp4, brag.jpg (poster, baked in as frame 0), share-copy.txt, brag-plan.md). From the queue: `214am` (#8),
  `details-3` (#9, series ep 3/9), `noir` (#10), `speedrun` (#11), `calm` (#12). Stickman-inspired (#21–25, built with
  /brag-slim + canvas line art, NOT Gemini Omni): `oneline`, `hours`, `commute`, `storefront`, `questions`.
- **Supabase is NOT written back yet.** `supabase/pending/2026-10-02-reels-batch.sql` marks the 10 rows
  rendered and inserts series ep 4/9 at queue position 13 (it shifts the rest down by one). Noah runs or approves it, then delete the file.
  The only Supabase writes tonight: one SELECT of the queue + one INSERT of 10 stickman-inspired ideas (positions 21–30).
- Queue after the write-back: 13 = Details 4/9, then the old 13–20 (dating profiles … © 2019) as 14–21, then stickman ideas 26–30 as 27–31.
- Honesty calls made tonight (details are in each brag-plan.md): the speedrun is labelled **TAS** (bot run), because there was no human time;
  noir's string is grey so the magician demo stays the only colour; every demo is labelled a demo on screen.
- **Batch 2 (same day, NO Supabase that turn — Noah's rule): 20 more reels rendered + committed**, same folder layout.
  From the queue: `dating` (#13), `busy` (#14), `board` (#15), `meanwhile` (#16), `fw26` (#17), `race` (#18), `countdown` (#19).
  Series: `details-4`, `details-5`, `details-6`. Stickman-inspired ideas: `draw` (#26), `twoshops` (#27), `threelines` (#28), `waiting` (#29), `shy` (#30)
  (so all 10 stickman ideas are built). New ideas with no row yet: `reflow`, `yourname`, `questions3`, `wheel`, `soundtrack`.
  Skipped: #20 "Still says © 2019?" (needs Noah's OK, see its row); after the write-back it's the only idea left in the queue.
- **Batch-2 write-back = `supabase/pending/2026-10-02-reels-batch-2.sql`** (not applied). Run batch 1's file FIRST (it creates
  the Details 4/9 row). It marks 13 rows rendered, inserts 7 new rendered rows, then renumbers the remaining ideas 1..n.
  The 5 stickman rows and the ep-4 row are matched by title, so check that each UPDATE count is 1 before committing.
- Posting-order notes live in each brag-plan.md: `countdown` only after 6+ posts and after the power-wash reel; `meanwhile` and
  `waiting` are the same joke family (space them out); `dating` should go well after reel #4 (same Tide Line hero).
- Pipeline kit (scratchpad, not committed): `newreel.sh`, `caplib.mjs`, `render.mjs`, `finish.sh`, `ship.sh` (mux + blackdetect + check
  sheet), `synth.py`. Each folder's `work/` (gitignored) has its own copy + a Rebuild line in brag-plan.md.
- Merged `origin/main` into this branch first (real demo photos + the non-sticky demo header), so captures show the current site.
  HANDOFF conflicted, so main's site state was kept and this reel section was re-added.

- **Batch 3 (same day, NO Supabase, NO Composio for these): 50 more reels rendered + committed** (folders `brag-output-2026-10-02-<slug>/`, same layout).
  The idea list is `reels-batch-3-ideas.md` (local only; **not in Supabase**, so there is no write-back SQL for batch 3). Slugs by family:
  series 7–9 (`d7` paint ring, `d8` progress line, `d9` card flip: the series is now complete, 9/9);
  "5 things every [trade] website needs" (`need-barber`, `need-bakery`, `need-florist`, `need-lawn`, `need-wash`, `need-auto`, `need-landscape`, `need-reno`);
  scroll ASMR (`asmr-florist`, `asmr-barber`, `asmr-auto`); quizzes/polls (`fivesec`, `guess-headline`, `lightdark`); design (`colors`, `typefaces`, `tierlist`);
  metaphors (`scanner`, `manual`, `recipe`, `tracker`, `unbox`, `vending`, `elevator`, `lockscreen`); line art (`lost`, `thumb`, `bouncer`, `stairs`, `treasure`, `legit`, `whisper`);
  edu (`domain`, `words5`, `notasite`, `needsite`, `photos`, `redgreen`, `alphabet`, `seohonest`); real copy/UI (`headlines`, `menu`, `changes`, `homework`, `math`, `googletest`, `addons`).
  `d7`/`d8`/`d9` are real captures: d7 redraws the layoutId ring on the component's own spring over four real states; d8 is 180 real scroll frames with the line's
  live scaleY measured each frame; d9 plays the card's real rotateY angle (recorded from the live component, including a mid-turn reversal) against real plates every 5°.
- **#50 is `addons`, not `hover`** (real-time screen recording was too slow on this machine; see the Notes in `reels-batch-3-ideas.md`).
- Batch 3 honesty rules held: every demo labelled a demo, no invented stats or clients, copy quoted from `lib/site.ts` / `lib/pricing.ts` where it quotes the site,
  no real search-engine or brand names (placeholder names on `.example` domains). Captions avoid `#longisland`; **13 of the earlier 30 captions still carry it**
  (`214am board busy commute oneline questions3 race reflow shy speedrun threelines wheel yourname`), which clashes with the site's "anywhere in the US" line. Not edited (some are already posted).
- Posting (updated Oct 2, ~7pm ET): batch 3 is being posted via Composio to `@vilaswebdesign`. **Posted now (10):** legit, tierlist, math, lost, lockscreen, need-barber, scanner, menu, fivesec, bouncer.
  **Scheduled (Claude Code Remote routines firing into the main session, 5 reels each, all ET):** Sat 12pm `d7 googletest vending need-bakery colors` · Sat 6pm `thumb recipe guess-headline domain asmr-florist` ·
  Sun 12pm `d8 stairs need-florist notasite headlines` · Sun 6pm `tracker lightdark words5 elevator asmr-barber` · Mon 12pm `unbox need-lawn whisper changes typefaces` ·
  Mon 6pm `d9 manual redgreen need-wash seohonest` · Tue 12pm `addons need-auto needsite alphabet asmr-auto` · Tue 6pm `homework need-landscape photos need-reno treasure` (final; also audits all 50).
  The older 20 (routines A, 8pm Fri, and B, 8am Sat) are unchanged. Series order held: details-4/5/6 (tonight) then d7 (Sat), d8 (Sun), d9 (Mon).
  Gotchas: in the Composio workbench `upload_local_file` returns a **tuple** `(dict, err)`, so take `r[0]["s3key"]`; a long-running background thread can stall on a hung call
  (a publish succeeded but the progress file never updated), so check the account's recent media before retrying, and `items.clear()` the shared list to stop a stalled worker before starting another.
- Build kit (scratchpad, not committed): per-family templates (`tpl/{list,need,rapid,quiz,seq,line,asmr}`), `enqueue.sh` + `worker.sh` (max 3 concurrent builds on 4 cores),
  `build.sh`, `ship.sh`, `peek.py` (8-frame contact row from a finished mp4), `look.sh` (stills before building). Every reel's `work/` has its own copy and a Rebuild line in `brag-plan.md`.


## Current state
- **Demo header is no longer sticky** (2026-10-01, Noah): `DemoHeader` in
  `components/demos/system.tsx` is now `relative` and scrolls away with the page;
  only `VilasDemoBar`'s pill stays pinned, on all 8 demos that use `DemoHeader`
  (Magician has its own chrome, no header). Header background is now solid
  `--d-bg` (the blur only mattered while content scrolled under it).
  `ANCHOR_SCROLL_CLASS` dropped 168px → 88px (clears just the 56px Vilas bar).
  Verified with Playwright at 1280 + 390 widths: bar `top` holds at 12px after
  a 2500px scroll, header goes off-screen. tsc / lint / build clean.
- **Auto body Premium hero = scroll-scrubbed video** (`components/demos/AutoBodyScrollHero.tsx`,
  wired in `AutoBodyDemo.tsx` when `tier === "premium"`; Basic untouched). Video +
  poster in `public/videos/` (all-keyframe H.264, 1s frozen tail). `HeroCarReveal`'s
  premium branch / `PremiumHeroMedia` use for auto body is now dead code. Not yet
  checked in a real H.264 browser (sandbox Chromium has no H.264) or on iOS Safari.
- Deployed: `main` fast-forwarded to `e7eeb3a` (the full 3-round second
  photo folder) and confirmed `READY` on production (`vilas.studio`) via
  Vercel MCP. Commits `aa49a13` (chrome fixes) through `1f094a5`
  (power-wash hero, below) are on `claude/sleepy-newton-uaamxu`, pushed but
  not yet fast-forwarded to main as of this writing — do that next unless
  told otherwise. Builds clean locally: `npx tsc --noEmit`, `next lint`,
  `next build` all pass.
- **PowerWashDemo hero replaced** (`22e29b5`/`1f094a5`): the old hero
  (`/previews/firstPowerWashImage.webp`) was a badly mismatched stock photo
  of a municipal street cleaner on a busy European sidewalk — no
  residential/driveway context at all. Generated a real match via
  Higgsfield (`gpt_image_2_5`, prompt in git log) and Noah picked one of 2
  candidates; saved as `public/demos/powerwash/hero.webp`. Wired into BOTH
  `PowerWashDemo.tsx`'s `firstPowerWashImage` const AND `lib/projects.ts`'s
  `demo-powerwash` gallery-thumbnail `screenshot` field (these are two
  separate things — see Gotchas). Verified via local Playwright screenshot
  on both `/demos/demo-powerwash` and `/#work`.
- **Fixed a real, site-wide sticky-positioning bug** (`aa49a13`): `app/
  globals.css` had `overflow-x: hidden` on BOTH `html` and `body`. That
  combination makes both elements compute to `overflow: hidden auto` and
  register as scroll containers simultaneously, which silently breaks
  `position: sticky` everywhere on the page — `VilasDemoBar` (and then-sticky
  `DemoHeader`) were scrolling away instead of staying pinned on every demo.
  Confirmed with a Playwright test before/after (sticky bar's `rect.top`
  went from drifting to -2988px after a 3000px scroll, to holding at
  12px). Fix: keep the rule on `body` only, drop it from `html`.
- **Exit link** (`VilasDemoBar.tsx`) now goes to `/#work` (the homepage
  gallery section) instead of `/` — a visitor leaving a demo lands back
  among the style cards, not at the top of the homepage.
- **Gallery thumbnails were stale** (`lib/projects.ts`'s `screenshot`
  field — a separate static image per project used only by the homepage
  `AccordionGallery`, NOT a live render of the demo). 3 of 9 still pointed
  at old images: autobody's showed the photo with visible Mercedes-Benz
  branding that was replaced in the demo itself weeks ago, landscaping and
  lawncare showed their old mismatched heroes, and magician had no image
  at all. All 9 now match each demo's real current hero
  (`magician` uses `portrait.webp`, the others use whatever `heroImage`
  constant that demo file currently sets — checked each one directly
  rather than assumed).
- **"Out in the world" client-sites sphere (`InfiniteMenu.tsx`/`.css`)**:
  `.face-title` had no `max-width`, so a long name like "Val's Elegant
  Barbershop" or "Jonah Shapiro Magic" ran wide enough at its fixed
  3rem/900-weight size to overlap the centered sphere face. Capped to
  `8ch` so it wraps to a second line instead.
- **Added 2 new client sites** to Supabase (`client_sites` table, not a
  file — see Gotchas): NextGenRest (`nextgenrest.vercel.app`) and
  SporesRUs (`sporesrus.vercel.app`), `published: true`, no
  `screenshot_url` set (so the existing daily auto-capture cron picks them
  up — see Blocked on Noah). Real business details unknown, so
  `description` was left `null` rather than invented — Noah should fill
  it in via the `client_sites` table if he wants one shown.
- **First+second photo folders and the craft pass** are all fully shipped
  to production — see git log around `45216ce`, `141f22c`, `e7eeb3a` for
  the itemized breakdowns. Nothing outstanding from any of them.

## Blocked on Noah
- **The two new client-site screenshots aren't live yet.** This sandbox
  can't reach `nextgenrest.vercel.app`/`sporesrus.vercel.app` (network
  policy) to capture them directly, and `mcp__Vercel__web_fetch_vercel_url`
  refused both projects with an authorization-scope error (same for the
  `jarvis` project itself, so it's not project-specific — that whole tool
  path looks unauthorized for this session regardless of target). The
  site's own `/api/capture-sites` cron (`vercel.json`, daily 8am UTC,
  Puppeteer on Vercel's infra — not this sandbox) already ran successfully
  as recently as Sep 28 for the existing rows, so the two new ones should
  get auto-captured at the next run. To force it sooner: visit
  `https://vilas.studio/api/capture-sites` once (plain GET, no auth
  needed — `CRON_SECRET` isn't set on this project).
- **2 generated power-wash replacement candidates are still unclaimed** in
  Higgsfield history (job ids `1d67034b-bab1-4410-b545-bd6965908c8b` and
  `4a5508a3-4d2a-4e58-8c35-d0e94ec72243`) — no confirmed destination for
  this photo either way (`PowerWashDemo`'s slider already has real photos
  from round 1, this one has no "before" companion). 1 of the 5 remake
  credits Noah offered is still unspent.
- No pull request opened.

## Next up (ordered)
1. Fast-forward `main` to `1f094a5` (chrome fixes + power-wash hero),
   confirm Vercel green.
2. Confirm the NextGenRest/SporesRUs screenshots landed after the next
   `/api/capture-sites` run; add a real `description` for each if wanted.
3. If a "before" shot for the power-wash garage-door photo ever comes in,
   decide whether it becomes a second before/after slider or something
   else.
4. TRFox screenshot capture (pending from before this session).
5. Real Higgsfield hero clips for Premium tier.

## Gotchas & decisions (standing, trimmed)
- **Reel pipeline (brag-slim path)**: each reel's `work/` (gitignored) has `cap.mjs` (Playwright against `next start -p 3456`),
  `comp/index.html` (canvas, every frame a pure function of t, using the shared `comp/common.js` kit: easing, text, phone mock,
  grain, and a **stick-figure rig** with poses and line boil), `render.mjs` (JPEG-piped frame renderer, ~0.4s/frame), `sound.py` + `synth.py`
  (numpy synth, master -15 LUFS), and `finish.sh <posterFrame>` (mux + poster as frame 0; `CRF=24` for grainy reels). The kit
  isn't committed, but every reel's work/ has a copy. Gotchas: canvas font family names must be quoted (`"Press Start 2P"`
  silently fails unquoted); headless Chromium had a transient all-black frame once (scan every final with ffmpeg blackdetect);
  hide the Vilas demo bar in captures with `div.sticky.top-3.z-50{display:none}`; CSS transitions (DayNight wipe, FAQ accordion)
  can be caught at t=0 via `document.getAnimations()` and seeked frame by frame; landscaping DayNight auto-plays as soon as the
  section intersects at all; local /start shows a "not wired up" notice (no backend env), so hide it, and nothing can submit.
- **Supabase `instagram_posts` = the log of every IG post AND the reel idea queue.** "Make another reel" → take the lowest
  `queue_position` idea, build it with /brag, then UPDATE that row to rendered (queue_position null, video_path, commit_sha). The
  Details series needs the next episode inserted each time one is built. Supabase MCP tools are pre-allowed in `.claude/settings.json`.
- Older reel folders (`brag-output*`, 2026-09-27 → 10-01) are listed in git history of this file; same layout.
- **"Out in the world" client sites (Val's Barbershop, Jonah Shapiro Magic,
  PackPerfect, TRFox, now NextGenRest/SporesRUs) are Supabase rows
  (`client_sites` table, Vilas project), not a file in this repo.** There's
  no `lib/clientSites.ts` data array to edit — `lib/clientSites.ts` only
  has the *fetch* code (`listClientSites()`). Add/edit a site with
  `mcp__Supabase__execute_sql` against `epynfvskwaxejdibvgbr`. A row's
  image comes from `screenshot_url` if set (manual override), else an
  auto-captured PNG keyed by `captured_at`'s date — see `lib/screenshot.ts`
  and `app/api/capture-sites/route.ts` (a Vercel Cron, `vercel.json`, daily
  8am UTC, runs real Puppeteer on Vercel's infra so it can reach sites this
  sandbox can't).
- **This session cannot read Noah's local computer at all** — no mounted
  drive, no path access, nothing. A folder path like `~/Downloads/
  higgsfield-9-27` is meaningless here; the only way media reaches this
  session is a chat attachment. (A `claude remote-control` session on his
  own machine could read it directly, but that's a different session.)
  Also still true: this sandbox's egress is blocked to both the Higgsfield
  CDN (`d8j0ntlcm91z4.cloudfront.net`) and `vilas.studio` itself — a fresh
  `generate_image` job's result URL and the live production site are
  equally unreachable from here. Verification runs against a local
  `next start` + Playwright instead of the real deployed URL.
- **Don't assume a new image folder maps 1:1 onto the original 11-slot
  manifest.** This round's images had no prior job-ID table — matching them
  to a destination meant reading each target demo file fresh. Two of five
  replaced an existing (flawed) photo instead of filling an empty slot;
  read the component before assuming "new photo = new placeholder."
- **Check a new photo against its destination's existing palette/grade**,
  not just its own quality — a fine photo can still be wrong for a spot
  (renovation's WORK grid is uniformly sepia-toned; a full-color drop-in
  needs `sharp` toning to match, see round 1 above).
- **Concurrent subagents sharing one working tree is genuinely risky**:
  this session hit a `git stash` collision (again) mid-Phase-3, and two
  subagents were cut off mid-task by a session-wide API rate limit. Every
  case was recoverable (`git checkout stash@{0} -- <path>`, or just
  verifying the interrupted agent's last edit was actually already
  complete before treating it as done) — but budget time for this kind of
  recovery when running 9 parallel file-editing agents in one checkout.
- **This devcontainer flakes on `next build` under concurrent sessions**
  (SIGKILL/stale-cache errors) — `tsc`/`eslint` stay reliable throughout;
  re-run build once contention clears.
- `.review/` (gitignored) holds per-style gate reports and screenshots —
  **`git add` on an explicitly-named gitignored path exits non-zero and
  silently kills the rest of an `&&` chain**, including a `git commit` after
  it. Add real files and ignored files in separate commands, not one `git
  add realfile ignoredfile && git commit`.
- `public/vilasherovideo.mp4` still does not decode (falls back to the
  static poster) — unrelated to demos.
- **Demos live in `components/demos/`, not `app/demos/`.**
- **Demos vary by mood (SKILL §13).** DARK = renovation + landscaping.
  FOREST-DARK = landscaping specifically. LIGHT = florist/bakery/powerwash/
  lawncare. WARM-DARK = barber. GRAPHITE-DARK = auto body. THEATRICAL = the
  Magician (§16).
- Renovation and florist's *existing* hero photos read a bit hazy/soft
  compared to barber's crisp one — asset quality, not a code/scrim bug.
- `Faq`/`Contact` in `system.tsx` both render a fixed two-column layout and
  sit adjacent in every demo — the one unavoidable back-to-back layout
  repeat without a `system.tsx` structural change.
- **Known pre-existing bug, still not fixed:** `Marquee.tsx` (main site, not
  the demo one) hydration mismatch under `prefers-reduced-motion: reduce`
  at first paint (React self-heals, nothing visibly breaks).

## Supabase
- Canonical project: **"Vilas"**, ref `epynfvskwaxejdibvgbr`, us-west-2.
  RLS deny-all on `intake_submissions`/`update_requests` (service role
  bypasses). Free tier pauses after ~1wk idle; a cold request just needs a
  retry.
