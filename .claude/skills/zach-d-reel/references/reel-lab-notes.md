# What this skill takes from /reel-lab (and the originality risk, stated plainly)

`reel-lab` (the claude.ai skill) owns hooks, music licensing, captions and posting for Noah's Instagram. zach-d-reel is a different product (an existing video + a Vilas ending) but the same account and the same algorithm,
so these reel-lab rules apply here. Read reel-lab's `references/post.md` and `sound.md` when posting; this file is the part that changes how reels are *built*.

## 1. The laws, applied to this format
| reel-lab law | Applied here |
|---|---|
| **Duh test** (if the first thought is "duh", rewrite) | Applies to the Vilas voice line and the echo words. "Websites that look expensive. They weren't." is the safe line; an echo like "Clean cut." only if it isn't a restatement of the last line. Kill any line that merely repeats part 1. |
| **Send test** (who sends this, what do they type?) | Write it in `plan.md`. Honest answer for this format: a small-business owner's friend sends it with "you need this", or someone who liked the video sends the twist ("lol the ad at the end"). If the plan has no answer, the transition isn't surprising enough: pick a better one. |
| **Short and looping beats long and finished** | Total watch time incl. replays is the ranking signal. Shorter is better: this skill now cuts the original at the transition point (a 34 s reel became 24.5 s) and requires the hook by 20 s. Never end on a fade to black; the end card holds >= 1.4 s with the sting. |
| **Must work on mute** | Captions carry every spoken word, in part 1's caption style, from the landing; the brand is on screen (chip + first line) at landing. |
| **Specific beats general** | The echo words reuse a noun from this video's last line. The voice line may name the niche of the demo footage ("barbers", "bakeries") only if a demo exists. |
| **Law 6: why before what** | The story is the belief (the viewer agrees with the fact); the ad is the reveal. The transition IS the turn from belief to product. Don't put the offer before the transition. |
| **Law 7: never bake a CTA into a generation** | No CTA inside the transition footage. The CTA is the end card + the caption's send/comment prompt. |
| **Rotate hook families** | The transition type is this format's "family". No two in a row; the QA `sound_variety` gate enforces unique transition + mood inside a batch. |

## 2. Account gate (ask once, default Business)
Reel-lab: Personal/Creator accounts can use Instagram's full music library; a **Business account** (@vilaswebdesign, client-facing) is limited to the Meta Sound Collection, commercial tracks get muted/region-blocked and the
reel can't be promoted. Default = **Business**: the MP4 contains only generated/CC-licensed sound (see `sound.md`), and each video gets a **music cue sheet** for the Instagram editor. If Noah says it's a Personal/Creator account,
the cue sheet may name real tracks from reel-lab's `sound.md` library.

## 3. Captions and posting (reel-lab `post.md`, merged into SKILL.md section 6)
- First line extends the hook (it's the only line shown before "more"), 1-3 sentences, natural keywords, **one CTA that's a comment/send prompt** (not a link), **five hashtags at most** (this skill uses four).
- Hook text on screen from frame one; but for this format frame one is the original's own hook. Don't add text to part 1 (Rule zero).
- Use **Trial Reels** for any transition type the account hasn't posted before.
- Reply to comments (conversation depth > comment count). Don't post two videos with the same transition back to back.
- **Measure** (reel-lab's order): (1) retention in the first 3 s (that's the *original's* hook, not ours); (2) **where the retention curve is at the Vilas hook time** (the one number specific to this format: the % of viewers still watching when part 2 begins, compared across your own posts: moving the hook from 31 s to 18 s should raise it);
(3) sends; (4) watch time incl. replays; (5) profile visits and follows. Log each post in `results.md` in the output folder: video, transition, mood, hook time, % at hook, sends, profile visits. Likes are the least informative number.

## 4. The originality risk (read this; it matters more than any transition)
This format is a creator's video plus a short ad. Instagram's rules, as of the sources below:
- Reel-lab's own `post.md`: "Original content only. Reposts get materially less distribution, and accounts posting many reposts within a 30-day window get dropped from recommendations entirely... a re-uploaded TikTok with a watermark does not [count as original]."
- April 2026 coverage (PetaPixel, MediaPost, RouteNote, Communicate Online): Instagram extended the policy platform-wide: accounts that **primarily** post unoriginal content are not shown in recommendation surfaces; it is judged over about a month of posts; adding a watermark, changing speed or crediting the creator does **not** make it original.
  (Secondary sources; the 10-posts-in-30-days threshold in one article is unconfirmed. Treat as direction, not a number.)
What that means for you: a 24 s reel that is 18 s of someone else's video and 6 s of ad is very likely "unoriginal" to the classifier, and a feed made mostly of them can lose recommendation eligibility for the whole account, which is the
opposite of what the account needs. A takedown/strike from the creator is a separate risk (copyright).
**Mitigations, in order of strength:** (1) get the creator's permission or a collab (ask Zack D; "can I add a 6 s ad to the end, credit and tag you"); (2) keep this format a **minority of the feed** and make the rest original reels (reel-lab/ugc-studio with Higgsfield, the demos, build-process clips);
(3) use videos you license or own; (4) Trial Reels first so a flop doesn't poison the account's average; (5) watch for the "Not recommended" / reduced-reach signs in Insights and stop if reach to non-followers collapses.
This skill says it once per run in the delivery (SKILL.md). It does not stop the run; the call is Noah's.
