"use client";

import { forwardRef } from "react";
import { ADDONS, estimate } from "@/lib/pricing";
import type { IntakeDraft } from "@/lib/intake";

// Fixed to the viewport bottom, visible on all 4 /start steps once a tier is
// picked. Custom sits outside pricing entirely — nothing to estimate there.
export const EstimateBar = forwardRef<HTMLDivElement, { draft: IntakeDraft }>(
  function EstimateBar({ draft }, ref) {
    if (draft.tier !== "basic" && draft.tier !== "premium") return null;

    const { build, monthly, dueToStart, waivedId, hasFrom } = estimate(
      draft.tier,
      draft.addonIds,
    );
    const waivedAddon = waivedId ? ADDONS.find((a) => a.id === waivedId) : null;

    return (
      <div
        ref={ref}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-6 py-4 md:px-10"
      >
        <div className="mx-auto grid max-w-2xl gap-1">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Estimate
          </span>
          <p className="text-sm text-ink">
            Build: {hasFrom ? "from " : ""}${build}. Half (${dueToStart}) to
            start, the rest when you approve.
          </p>
          <p className="text-sm text-ink">Monthly after launch: ${monthly}</p>
          {waivedAddon && (
            <p className="text-xs text-muted">
              Included with Premium: {waivedAddon.name} build fee.
            </p>
          )}
          <p className="text-xs text-muted">
            This is an estimate. You don&rsquo;t pay anything until we email
            you back and confirm.
          </p>
        </div>
      </div>
    );
  },
);
