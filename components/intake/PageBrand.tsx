"use client";

import { useEffect, useState } from "react";
import { isValidHex, type Errors, type IntakeDraft, type IntakeFiles } from "@/lib/intake";
import { FieldError, FieldSet, RadioCards, fileInputClass, inputClass } from "./fields";
import { LogoCropper } from "./LogoCropper";

function ColorField({
  name,
  label,
  value,
  error,
  onChange,
  onBlur,
}: {
  name: string;
  label: string;
  value: string;
  error?: string;
  onChange: (hex: string) => void;
  onBlur: () => void;
}) {
  return (
    <label data-field={name} className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        <span className="text-accent"> *</span>
      </span>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={isValidHex(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 shrink-0 cursor-pointer border border-line bg-transparent p-0"
          aria-label={`${label}, color picker`}
        />
        <input
          type="text"
          value={value}
          placeholder="#8A5A2B"
          maxLength={7}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${inputClass(error)} font-mono uppercase`}
        />
      </div>
      <FieldError error={error} />
    </label>
  );
}

// Shows the picked file with a thumbnail so someone can see they grabbed the
// right one before moving on.
function Preview({ file, round }: { file: File; round?: boolean }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  if (!url) return null;
  return (
    <span className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className={`size-12 border border-line bg-surface object-contain ${round ? "rounded-full" : ""}`}
      />
      <span className="text-xs text-muted/80">{file.name}</span>
    </span>
  );
}

export function PageBrand({
  draft,
  files,
  errors,
  onChange,
  onFiles,
  onBlur,
}: {
  draft: IntakeDraft;
  files: IntakeFiles;
  errors: Errors;
  onChange: (patch: Partial<IntakeDraft>) => void;
  onFiles: (patch: Partial<IntakeFiles>) => void;
  onBlur: (name: string) => void;
}) {
  // The image waiting to be cropped. Set when someone picks a profile logo,
  // cleared once they save or cancel.
  const [cropping, setCropping] = useState<File | null>(null);

  return (
    <div className="grid gap-10">
      <FieldSet legend="Colors">
        <RadioCards
          name="paletteChoice"
          value={draft.paletteChoice}
          error={errors.paletteChoice}
          onChange={(v) => {
            onChange({ paletteChoice: v });
            onBlur("paletteChoice");
          }}
          options={[
            { value: "template", label: "Keep the template's palette" },
            { value: "own", label: "Use my own colors" },
          ]}
        />
      </FieldSet>

      {draft.paletteChoice === "own" && (
        <div className="grid gap-6 md:grid-cols-2">
          <ColorField
            name="mainColor"
            label="Main color"
            value={draft.mainColor}
            error={errors.mainColor}
            onChange={(hex) => onChange({ mainColor: hex })}
            onBlur={() => onBlur("mainColor")}
          />
          <ColorField
            name="accentColor"
            label="Accent color"
            value={draft.accentColor}
            error={errors.accentColor}
            onChange={(hex) => onChange({ accentColor: hex })}
            onBlur={() => onBlur("accentColor")}
          />
        </div>
      )}

      <FieldSet legend="Logo">
        <RadioCards
          name="hasLogo"
          value={draft.hasLogo}
          error={errors.hasLogo}
          onChange={(v) => {
            onChange({ hasLogo: v });
            onBlur("hasLogo");
            if (v === "no") {
              onFiles({ mainLogo: null, profileLogo: null, profileLogoOriginal: null });
            }
          }}
          options={[
            { value: "yes", label: "Yes, I'll upload one" },
            { value: "no", label: "No, use text" },
          ]}
        />
      </FieldSet>

      {draft.hasLogo === "yes" && (
        <>
          <label data-field="mainLogo" className="grid gap-2 text-sm text-muted">
            <span>
              Main logo<span className="text-accent"> *</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                onFiles({ mainLogo: e.target.files?.[0] ?? null });
                onBlur("mainLogo");
              }}
              className={fileInputClass}
            />
            <span className="text-xs text-muted/80">
              Any shape. This is the one that goes in your header and footer.
            </span>
            {files.mainLogo && <Preview file={files.mainLogo} />}
            <FieldError error={errors.mainLogo} />
          </label>

          <label data-field="profileLogo" className="grid gap-2 text-sm text-muted">
            <span>Profile logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setCropping(f);
                e.target.value = "";
              }}
              className={fileInputClass}
            />
            <span className="text-xs text-muted/80">
              The square, cropped version. It becomes your favicon and anywhere
              the site shows your logo in a circle. Pick a file and you&rsquo;ll get a
              crop step.
            </span>
            {files.profileLogo && <Preview file={files.profileLogo} round />}
          </label>
        </>
      )}

      {cropping && (
        <LogoCropper
          file={cropping}
          onCancel={() => setCropping(null)}
          onSave={(cropped) => {
            onFiles({ profileLogo: cropped, profileLogoOriginal: cropping });
            setCropping(null);
          }}
        />
      )}

      <p className="text-xs text-muted/80">
        No logo yet? Pick &ldquo;use text&rdquo; and we&rsquo;ll set your name in
        type. It looks better than a rushed logo.
      </p>
    </div>
  );
}
