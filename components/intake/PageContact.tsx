import type { IntakeDraft } from "@/lib/intake";
import { TextField } from "./fields";

export function PageContact({
  draft,
  onChange,
}: {
  draft: IntakeDraft;
  onChange: (patch: Partial<IntakeDraft>) => void;
}) {
  return (
    <div className="grid gap-10">
      <div className="grid gap-10 md:grid-cols-2">
        <TextField
          label="Business name"
          required
          value={draft.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
        />
        <TextField
          label="Your name"
          required
          value={draft.yourName}
          onChange={(e) => onChange({ yourName: e.target.value })}
        />
      </div>

      <TextField
        label="Business email"
        type="email"
        required
        value={draft.businessEmail}
        onChange={(e) => onChange({ businessEmail: e.target.value })}
        hint="This is the address your live site's contact form will email new leads to — not your login, just where the form drops messages."
      />

      <TextField
        label="Phone"
        type="tel"
        value={draft.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        hint="Optional."
      />

      <TextField
        label="Business address or town on Long Island"
        required
        placeholder="Or just type “not local”"
        value={draft.address}
        onChange={(e) => onChange({ address: e.target.value })}
      />
    </div>
  );
}
