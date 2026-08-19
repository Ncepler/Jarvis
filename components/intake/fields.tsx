// Shared form primitives for the /start intake pages. Same visual language
// as components/sections/Contact.tsx (bottom-border inputs, warm bone tokens)
// so the intake flow doesn't feel like a different product from the site.
//
// Every field takes `name` + `error`. `name` doubles as the scroll target the
// form jumps to when someone hits Next with something invalid, and `error` is
// the message shown under the field. Errors are surfaced on blur, never on
// every keystroke.
import type {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const base =
  "w-full border-b bg-transparent pb-2 pt-1 text-ink transition-colors duration-200 placeholder:text-muted/60 focus:outline-none";

export const fieldClass = `${base} border-line focus:border-ink`;
export const inputClass = (error?: string) =>
  error ? `${base} border-red-500 focus:border-red-500` : fieldClass;

export const primaryButtonClass =
  "press cursor-pointer border border-accent bg-accent px-6 py-3 text-sm text-white transition-colors duration-200 hover:bg-accent/90 disabled:cursor-default disabled:opacity-40";

export const ghostButtonClass =
  "press cursor-pointer border border-line px-6 py-3 text-sm text-ink transition-colors duration-200 hover:border-ink disabled:cursor-default disabled:opacity-40";

export const fileInputClass =
  "text-sm text-muted file:mr-4 file:cursor-pointer file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-ink hover:file:border-ink";

export function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <span role="alert" className="text-xs text-red-500">
      {error}
    </span>
  );
}

// The wrapper every field shares: label, the control, a hint, an error.
export function Wrap({
  name,
  label,
  hint,
  required,
  error,
  children,
}: {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label data-field={name} className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
      <FieldError error={error} />
    </label>
  );
}

type Common = { name: string; label: string; hint?: ReactNode; error?: string };

export function TextField({
  name,
  label,
  hint,
  error,
  ...props
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap name={name} label={label} hint={hint} required={props.required} error={error}>
      <input
        name={name}
        aria-invalid={Boolean(error)}
        className={inputClass(error)}
        {...props}
      />
    </Wrap>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  error,
  ...props
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap name={name} label={label} hint={hint} required={props.required} error={error}>
      <textarea
        name={name}
        aria-invalid={Boolean(error)}
        className={inputClass(error)}
        {...props}
      />
    </Wrap>
  );
}

export function SelectField({
  name,
  label,
  hint,
  error,
  placeholder,
  options,
  ...props
}: Common & {
  placeholder?: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap name={name} label={label} hint={hint} required={props.required} error={error}>
      <select
        name={name}
        aria-invalid={Boolean(error)}
        className={`${inputClass(error)} cursor-pointer`}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-bg">
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-bg">
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function RadioCards<T extends string>({
  name,
  value,
  onChange,
  options,
  error,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  error?: string;
}) {
  return (
    <div data-field={name} className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${
              value === opt.value
                ? "border-accent text-ink"
                : error
                  ? "border-red-500 text-muted hover:text-ink"
                  : "border-line text-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
      <FieldError error={error} />
    </div>
  );
}

export function FieldSet({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm text-muted">{legend}</legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}
