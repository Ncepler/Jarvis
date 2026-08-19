"use client";

import type { IntakeDraft, Row } from "@/lib/intake";
import { CATCH_ALL, templateByKey, type TplQuestion } from "@/lib/templates";
import { ListEditor } from "./ListEditor";
import { TextAreaField, inputClass } from "./fields";

// Page 4. Its questions come entirely from the template the client picked on
// page 1 (lib/templates.ts), so adding a demo adds its own question set here
// with no change to this file.
//
// Two things this page is built around:
//   • The list questions arrive pre-filled with the template's real content,
//     read out of the demo's own source. Nobody has to imagine what a section
//     says — they edit the words that are on the page today.
//   • Nothing on a template is compulsory. Every question can be switched off,
//     and that's recorded as "take this section out", not as a blank answer.

function DropToggle({
  id,
  dropped,
  onChange,
}: {
  id: string;
  dropped: boolean;
  onChange: (dropped: boolean) => void;
}) {
  return (
    <label
      htmlFor={`drop-${id}`}
      className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-muted transition-colors duration-200 hover:text-ink"
    >
      <input
        id={`drop-${id}`}
        type="checkbox"
        checked={dropped}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 cursor-pointer accent-accent"
      />
      Leave this off my site
    </label>
  );
}

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
  const setDropped = (key: string, dropped: boolean) =>
    onChange({
      droppedSections: dropped
        ? [...draft.droppedSections, key]
        : draft.droppedSections.filter((k) => k !== key),
    });

  const body = (q: TplQuestion) => {
    if (q.list) {
      if (loading) return <p className="text-sm text-muted">Reading the template…</p>;
      return (
        <ListEditor
          name={q.key}
          list={q.list}
          rows={draft.templateLists[q.key] ?? []}
          errors={errors}
          onChange={(rows) => setRows(q.key, rows)}
        />
      );
    }
    const value = draft.templateCustomizations[q.key] ?? "";
    const shared = {
      value,
      placeholder: q.placeholder,
      "aria-label": q.label,
      className: inputClass(),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        set(q.key, e.target.value),
    };
    return q.type === "textarea" ? (
      <textarea name={q.key} rows={4} {...shared} />
    ) : (
      <input
        name={q.key}
        inputMode={q.type === "number" ? "decimal" : undefined}
        {...shared}
      />
    );
  };

  return (
    <div className="grid gap-14">
      <div className="grid gap-3 border border-line bg-surface/50 p-4">
        <p className="text-sm leading-relaxed text-muted">
          Everything below is what the {tpl.name} template says right now. Change
          what you want changed, and leave the rest — we&rsquo;ll rewrite
          anything you keep so it sounds like you. Nothing here is compulsory:
          tick <span className="text-ink">leave this off my site</span> on any
          section you don&rsquo;t want and we&rsquo;ll build the page without it.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Easiest way to do this page:{" "}
          <a
            href={`/demos/${tpl.key}`}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-4"
          >
            open the {tpl.name} template in another tab
          </a>{" "}
          and keep it next to you, so you can see the section each question is
          asking about.
        </p>
      </div>

      {tpl.questions.map((q) => {
        const dropped = draft.droppedSections.includes(q.key);
        const shipped = content[q.key] ?? [];
        const first = q.list?.fields[0].key;
        return (
          <section key={q.key} data-field={q.key} className="grid gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className={`font-display text-xl ${dropped ? "text-muted" : "text-ink"}`}>
                {q.label}
              </h3>
              <DropToggle id={q.key} dropped={dropped} onChange={(v) => setDropped(q.key, v)} />
            </div>

            {dropped ? (
              <p className="text-sm text-muted">
                We&rsquo;ll build the page without this section.
              </p>
            ) : (
              <>
                {q.hint && (
                  <p className="max-w-lg text-sm leading-relaxed text-muted">{q.hint}</p>
                )}
                {q.current && (
                  <p className="max-w-lg text-sm text-muted">
                    Right now it says: <span className="text-ink">{q.current}</span>
                  </p>
                )}
                {/* One-line lists get the template's version named up front. The
                    longer ones don't need it: the boxes below are the content. */}
                {q.list?.inline && shipped.length > 0 && first && (
                  <p className="max-w-lg text-sm text-muted">
                    The template&rsquo;s:{" "}
                    <span className="text-ink">
                      {shipped.map((r) => r[first]).filter(Boolean).join(", ")}
                    </span>
                  </p>
                )}
                {body(q)}
              </>
            )}
          </section>
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
