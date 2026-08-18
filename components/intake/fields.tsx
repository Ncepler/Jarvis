// Small shared form primitives for the /start intake pages. Same visual
// language as components/sections/Contact.tsx (bottom-border inputs, warm
// bone/espresso tokens) so the intake flow doesn't feel like a different
// product from the rest of the site.
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const fieldClass =
  "w-full border-b border-line bg-transparent pb-2 pt-1 text-ink transition-colors duration-200 placeholder:text-muted/60 focus:border-ink focus:outline-none";

export const primaryButtonClass =
  "press cursor-pointer border border-accent bg-accent px-6 py-3 text-sm text-white transition-colors duration-200 hover:bg-accent/90 disabled:cursor-default disabled:opacity-40";

export const ghostButtonClass =
  "press cursor-pointer border border-line px-6 py-3 text-sm text-ink transition-colors duration-200 hover:border-ink disabled:cursor-default disabled:opacity-40";

type FieldProps = {
  label: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, hint, className, ...props }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        {props.required && <span className="text-accent"> *</span>}
      </span>
      <input className={className ?? fieldClass} {...props} />
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
    </label>
  );
}

type AreaProps = {
  label: string;
  hint?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, hint, ...props }: AreaProps) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        {props.required && <span className="text-accent"> *</span>}
      </span>
      <textarea className={fieldClass} {...props} />
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
    </label>
  );
}

export function RadioCards<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${
            value === opt.value
              ? "border-accent text-ink"
              : "border-line text-muted hover:text-ink"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            required
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export function FieldSet({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm text-muted">{legend}</legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}
