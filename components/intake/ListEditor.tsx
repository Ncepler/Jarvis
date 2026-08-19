"use client";

import { blankRow, padRows, type Errors, type Row } from "@/lib/intake";
import type { ListSpec } from "@/lib/templates";
import { FieldError, inputClass } from "./fields";

// The editor for a `list` question. The rows arrive pre-filled with what the
// chosen template actually says today (lib/templateContent.ts reads it out of
// the demo's source), so nobody has to picture a section they've never seen:
// they edit the real words, delete what doesn't apply, and add their own.
//
// Row identity is positional, which is what lets the × and + buttons work
// without a key on each row.

const addButtonClass =
  "press w-fit cursor-pointer border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-ink";

const removeButtonClass =
  "size-9 shrink-0 cursor-pointer border border-line text-muted transition-colors duration-200 hover:border-ink hover:text-ink disabled:cursor-default disabled:border-line/60 disabled:text-muted/40 disabled:hover:border-line/60";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function ListEditor({
  name,
  list,
  rows,
  errors,
  onChange,
}: {
  name: string;
  list: ListSpec;
  rows: Row[];
  errors: Errors;
  onChange: (rows: Row[]) => void;
}) {
  const padded = padRows(rows, list);
  const min = list.min ?? 0;
  const atMin = padded.length <= min;

  const patch = (i: number, key: string, value: string) =>
    onChange(padded.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  const remove = (i: number) => onChange(padded.filter((_, idx) => idx !== i));
  const add = () => onChange([...padded, blankRow(list.fields)]);

  const removeButton = (i: number) => (
    <button
      type="button"
      onClick={() => remove(i)}
      disabled={atMin}
      aria-label={`Remove ${list.noun} ${i + 1}`}
      title={atMin ? `You need at least ${min}.` : `Remove this ${list.noun}`}
      className={removeButtonClass}
    >
      ×
    </button>
  );

  return (
    <div className="grid gap-4">
      {padded.map((row, i) => {
        const error = errors[`${name}.${i}`];

        // One-field rows (the scrolling words, the work filters) are a single
        // line each — a heading per row would be more chrome than content.
        if (list.inline) {
          const field = list.fields[0];
          return (
            <div key={i} data-field={`${name}.${i}`} className="grid gap-2">
              <div className="flex items-end gap-3">
                <input
                  value={row[field.key] ?? ""}
                  onChange={(e) => patch(i, field.key, e.target.value)}
                  aria-label={`${capitalize(list.noun)} ${i + 1}`}
                  aria-invalid={Boolean(error)}
                  className={inputClass(error)}
                />
                {removeButton(i)}
              </div>
              <FieldError error={error} />
            </div>
          );
        }

        return (
          <div
            key={i}
            data-field={`${name}.${i}`}
            className="grid gap-4 border border-line bg-surface/50 p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {capitalize(list.noun)} {i + 1}
              </span>
              {removeButton(i)}
            </div>
            {list.fields.map((field, fi) => {
              // Only the first field carries the row's error: it's the row's
              // identity, and repeating one message per box is noise.
              const fieldError = fi === 0 ? error : undefined;
              return (
                <label key={field.key} className="grid gap-2 text-sm text-muted">
                  <span>{field.label}</span>
                  {field.area ? (
                    <textarea
                      rows={2}
                      value={row[field.key] ?? ""}
                      onChange={(e) => patch(i, field.key, e.target.value)}
                      aria-invalid={Boolean(fieldError)}
                      className={inputClass(fieldError)}
                    />
                  ) : (
                    <input
                      value={row[field.key] ?? ""}
                      onChange={(e) => patch(i, field.key, e.target.value)}
                      aria-invalid={Boolean(fieldError)}
                      className={inputClass(fieldError)}
                    />
                  )}
                  <FieldError error={fieldError} />
                </label>
              );
            })}
          </div>
        );
      })}

      <button type="button" onClick={add} className={addButtonClass}>
        + {list.add}
      </button>
    </div>
  );
}
