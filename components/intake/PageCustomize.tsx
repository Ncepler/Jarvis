"use client";

import type { IntakeDraft } from "@/lib/intake";
import { CATCH_ALL, templateByKey } from "@/lib/templates";
import { TextAreaField, TextField } from "./fields";

// Page 4. Its questions come entirely from the template the client picked on
// page 1 (lib/templates.ts), so adding a demo adds its own question set here
// with no change to this file. Nothing on this page is required: a client who
// wants us to make the calls can click straight through.
export function PageCustomize({
  draft,
  onChange,
}: {
  draft: IntakeDraft;
  onChange: (patch: Partial<IntakeDraft>) => void;
}) {
  const tpl = templateByKey(draft.templateChoice);
  if (!tpl) {
    return (
      <p className="text-sm text-muted">
        Go back to the first page and pick a template and this page will fill in.
      </p>
    );
  }

  const set = (key: string, value: string) =>
    onChange({ templateCustomizations: { ...draft.templateCustomizations, [key]: value } });

  return (
    <div className="grid gap-10">
      <p className="max-w-md text-sm text-muted">
        These are the parts of the {tpl.name} template that are yours to set.
        Skip anything you don&rsquo;t care about and we&rsquo;ll make the call.
      </p>

      {tpl.questions.map((q) => {
        const hint = q.current ? (
          <>
            {q.hint ? <>{q.hint}<br /></> : null}
            Right now it says: {q.current}
          </>
        ) : (
          q.hint
        );
        const value = draft.templateCustomizations[q.key] ?? "";

        return q.type === "textarea" ? (
          <TextAreaField
            key={q.key}
            name={q.key}
            label={q.label}
            hint={hint}
            rows={4}
            value={value}
            placeholder={q.placeholder}
            onChange={(e) => set(q.key, e.target.value)}
          />
        ) : (
          <TextField
            key={q.key}
            name={q.key}
            label={q.label}
            hint={hint}
            inputMode={q.type === "number" ? "decimal" : undefined}
            value={value}
            placeholder={q.placeholder}
            onChange={(e) => set(q.key, e.target.value)}
          />
        );
      })}

      <TextAreaField
        name={CATCH_ALL.key}
        label={CATCH_ALL.label}
        hint={CATCH_ALL.hint}
        rows={5}
        value={draft.copyChanges}
        onChange={(e) => onChange({ copyChanges: e.target.value })}
      />
    </div>
  );
}
