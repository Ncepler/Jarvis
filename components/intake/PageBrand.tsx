"use client";

import { useState } from "react";
import { isValidHex, type Errors, type IntakeDraft, type IntakeUploads } from "@/lib/intake";
import { FieldError, FieldSet, RadioCards, fileInputClass, inputClass } from "./fields";
import { LogoCropper } from "./LogoCropper";
import { UploadField, UploadPreview, uploadFile } from "./UploadField";

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

export function PageBrand({
  draft,
  errors,
  onChange,
  onUploads,
  onBlur,
  getPrefix,
}: {
  draft: IntakeDraft;
  errors: Errors;
  onChange: (patch: Partial<IntakeDraft>) => void;
  onUploads: (patch: Partial<IntakeUploads>) => void;
  onBlur: (name: string) => void;
  getPrefix: () => string;
}) {
  // The image waiting to be cropped. Set when someone picks a profile logo,
  // cleared once they save or cancel.
  const [cropping, setCropping] = useState<File | null>(null);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState("");
  const uploads = draft.uploads;

  // The cropper hands back two files — the square crop and the untouched
  // original — and both go up before the modal closes.
  const saveProfile = async (cropped: File, original: File) => {
    setProfileBusy(true);
    setProfileError("");
    try {
      const prefix = getPrefix();
      const [profileLogo, profileLogoOriginal] = await Promise.all([
        uploadFile(cropped, "profileLogo", prefix),
        uploadFile(original, "profileLogoOriginal", prefix),
      ]);
      onUploads({ profileLogo, profileLogoOriginal });
      setCropping(null);
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "That upload didn't go through.");
    } finally {
      setProfileBusy(false);
    }
  };

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
              onUploads({ mainLogo: null, profileLogo: null, profileLogoOriginal: null });
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
          <UploadField
            name="mainLogo"
            label="Main logo"
            required
            accept="image/*"
            kind="mainLogo"
            getPrefix={getPrefix}
            value={uploads.mainLogo}
            error={errors.mainLogo}
            onChange={(mainLogo) => onUploads({ mainLogo })}
            onBlur={() => onBlur("mainLogo")}
            hint="Any shape. This is the one that goes in your header and footer."
          />

          <label data-field="profileLogo" className="grid gap-2 text-sm text-muted">
            <span>Profile logo</span>
            <input
              type="file"
              accept="image/*"
              disabled={profileBusy}
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
            {profileBusy && <span className="text-xs text-muted">Uploading…</span>}
            {uploads.profileLogo && (
              <UploadPreview
                upload={uploads.profileLogo}
                round
                onRemove={() => onUploads({ profileLogo: null, profileLogoOriginal: null })}
              />
            )}
            <FieldError error={profileError} />
          </label>
        </>
      )}

      {cropping && (
        <LogoCropper
          file={cropping}
          onCancel={() => setCropping(null)}
          onSave={(cropped) => saveProfile(cropped, cropping)}
        />
      )}

      <p className="text-xs text-muted/80">
        No logo yet? Pick &ldquo;use text&rdquo; and we&rsquo;ll set your name in
        type. It looks better than a rushed logo.
      </p>
    </div>
  );
}
