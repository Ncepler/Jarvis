import { isValidHex, type IntakeDraft } from "@/lib/intake";
import { FieldSet, RadioCards, fieldClass } from "./fields";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const valid = isValidHex(value);
  return (
    <label className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        <span className="text-accent"> *</span>
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={valid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer border border-line bg-transparent p-0"
          aria-label={`${label} — picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#8A5A2B"
          className={`${fieldClass} font-mono uppercase`}
          maxLength={7}
        />
      </div>
      {!valid && value !== "" && (
        <span className="text-xs text-accent">
          That doesn&rsquo;t look like a hex code (e.g. #8A5A2B).
        </span>
      )}
    </label>
  );
}

export function PageBrand({
  draft,
  onChange,
  logoFileName,
  onLogoFile,
}: {
  draft: IntakeDraft;
  onChange: (patch: Partial<IntakeDraft>) => void;
  logoFileName: string | null;
  onLogoFile: (file: File | null) => void;
}) {
  return (
    <div className="grid gap-10">
      <FieldSet legend="Colors">
        <RadioCards
          name="paletteChoice"
          value={draft.paletteChoice}
          onChange={(v) => onChange({ paletteChoice: v })}
          options={[
            { value: "template", label: "Keep the template's palette" },
            { value: "own", label: "Use my own colors" },
          ]}
        />
      </FieldSet>

      {draft.paletteChoice === "own" && (
        <div className="grid gap-6 md:grid-cols-2">
          <ColorField
            label="Main color"
            value={draft.mainColor}
            onChange={(hex) => onChange({ mainColor: hex })}
          />
          <ColorField
            label="Accent color"
            value={draft.accentColor}
            onChange={(hex) => onChange({ accentColor: hex })}
          />
        </div>
      )}

      <FieldSet legend="Logo">
        <RadioCards
          name="hasLogo"
          value={draft.hasLogo}
          onChange={(v) => onChange({ hasLogo: v })}
          options={[
            { value: "yes", label: "Yes, I'll upload one" },
            { value: "no", label: "No — use text" },
          ]}
        />
      </FieldSet>

      {draft.hasLogo === "yes" && (
        <label className="grid gap-2 text-sm text-muted">
          <span>
            Logo file<span className="text-accent"> *</span>
          </span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => onLogoFile(e.target.files?.[0] ?? null)}
            className="text-sm text-muted file:mr-4 file:cursor-pointer file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-ink hover:file:border-ink"
          />
          {logoFileName && (
            <span className="text-xs text-muted/80">Selected: {logoFileName}</span>
          )}
        </label>
      )}
    </div>
  );
}
