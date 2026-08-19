"use client";

import type { IntakeDraft, Row } from "@/lib/intake";
import { CATCH_ALL, templateByKey } from "@/lib/templates";
import { ListEditor } from "./ListEditor";
import { TextAreaField, TextField } from "./fields";

// Page 4. Its questions come entirely from the template the client picked on
// page 1 (lib/templates.ts), so adding a demo adds its own question set here
// with no change to this file.
//
// The list questions arrive pre-filled with the template's real content, read
// out of the demo's own source at load time — nobody has to imagine what a
// section says, they edit the words that are on the page today. Everything
// else is optional: a client who wants us to make the calls can click through.
export function PageCustomize({
  draft,
  errors,
  content,
  loading,
  onChange,
}: {
  draft: IntakeDraft;
  errors: Record<string, string>;
  content: Record<string, Row[]>;
  loading: boolean;
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
  const setRows = (key: string, rows: Row[]) =>
    onChange({ templateLists: { ...draft.templateLists, [key]: rows } });

  return (
    <div className="grid gap-14">
      <p className="max-w-md text-sm text-muted">
        Everything below is what the {tpl.name} template says right now. Change
        what you want changed, delete what doesn&rsquo;t apply, and leave the
        rest — we&rsquo;ll rewrite anything you keep so it sounds like you.
      </p>

      {tpl.questions.map((q) => {
        if (q.list) {
          const shipped = content[q.key] ?? [];
          const first = q.list.fields[0].key;
          return (
            <section key={q.key} className="grid gap-4">
              <h3 className="font-display text-xl text-ink">{q.label}</h3>
              {q.hint && <p className="max-w-lg text-sm leading-relaxed text-muted">{q.hint}</p>}
              {/* One-line lists get the template's version named up front. The
                  longer ones don't need it: the boxes below are the content. */}
              {q.list.inline && shipped.length > 0 && (
                <p className="max-w-lg text-sm text-muted">
                  The template&rsquo;s:{" "}
                  <span className="text-ink">
                    {shipped.map((r) => r[first]).filter(Boolean).join(", ")}
                  </span>
                </p>
              )}
              {loading ? (
                <p className="text-sm text-muted">Reading the template…</p>
              ) : (
                <ListEditor
                  name={q.key}
                  list={q.list}
                  rows={draft.templateLists[q.key] ?? []}
                  errors={errors}
                  onChange={(rows) => setRows(q.key, rows)}
                />
              )}
            </section>
          );
        }

        const hint = q.current ? (
          <>
            {q.hint ? (
              <>
                {q.hint}
                <br />
              </>
            ) : null}
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
