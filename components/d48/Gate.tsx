"use client";

import { useActionState } from "react";
import { login } from "@/app/d48/actions";
import { fieldClass, primaryButtonClass } from "@/components/intake/fields";

export function Gate() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto grid w-full max-w-xs gap-6 py-32">
      <label className="grid gap-2 text-sm text-muted">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className={fieldClass}
        />
      </label>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
