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
    <label className="grid gap-2 text-sm text-muted">
      <span>
        Anything else we should know? Anything specific you want, or
        anything we didn&rsquo;t ask about?
      </span>
      <textarea
        rows={8}
        value={draft.brainDump}
        onChange={(e) => onChange({ brainDump: e.target.value })}
        className={fieldClass}
      />
    </label>
  );
}
