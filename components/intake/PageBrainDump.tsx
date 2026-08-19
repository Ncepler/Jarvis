"use client";

import type { IntakeDraft } from "@/lib/intake";
import { fieldClass } from "./fields";

export function PageBrainDump({
  draft,
  onChange,
}: {
  draft: IntakeDraft;
  onChange: (patch: Partial<IntakeDraft>) => void;
}) {
  return (
    <div className="grid gap-4">
      <h2 className="font-display text-2xl text-ink">
        One last thing. Tell us anything else.
      </h2>
      <p className="max-w-md text-sm text-muted">
        Anything the form didn&rsquo;t cover, anything specific you want,
        anything you&rsquo;re unsure about. Don&rsquo;t worry about being
        organized. We read every word of these.
      </p>
      <textarea
        name="brainDump"
        rows={10}
        value={draft.brainDump}
        onChange={(e) => onChange({ brainDump: e.target.value })}
        className={`${fieldClass} mt-2`}
        aria-label="Anything else"
      />
    </div>
  );
}
