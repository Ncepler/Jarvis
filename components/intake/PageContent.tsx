"use client";

import { useState } from "react";
import {
  VIDEO_TYPES,
  type DayHours,
  type Errors,
  type IntakeDraft,
  type IntakeUploads,
  type Upload,
} from "@/lib/intake";
import { templateByKey } from "@/lib/templates";
import { FieldError, TextAreaField, TextField, fieldClass, fileInputClass } from "./fields";
import { UploadField, UploadPreview, uploadFile } from "./UploadField";

function HoursTable({
  hours,
  onChange,
}: {
  hours: DayHours[];
  onChange: (hours: DayHours[]) => void;
}) {
  const update = (i: number, patch: Partial<DayHours>) =>
    onChange(hours.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));

  return (
    <div className="grid gap-3">
      <span className="text-sm text-muted">Hours</span>
      <div className="grid gap-2">
        {hours.map((h, i) => (
          <div
            key={h.day}
            className="grid grid-cols-[5.5rem_1fr] items-center gap-3 border-b border-line py-2 sm:grid-cols-[5.5rem_auto_1fr]"
          >
            <span className="text-sm text-ink">{h.day}</span>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={h.closed}
                onChange={(e) => update(i, { closed: e.target.checked })}
                className="size-4 accent-accent"
              />
              Closed
            </label>
            {!h.closed && (
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => update(i, { open: e.target.value })}
                  className={`${fieldClass} text-sm`}
                  aria-label={`${h.day} opens`}
                />
                <span className="text-xs text-muted">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => update(i, { close: e.target.value })}
                  className={`${fieldClass} text-sm`}
                  aria-label={`${h.day} closes`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Photos go up one at a time as they're picked, so a batch off a phone
// uploads while the rest of the form gets filled in. Each one can be pulled
// back out without touching the others.
function PhotosField({
  photos,
  getPrefix,
  onChange,
}: {
  photos: Upload[];
  getPrefix: () => string;
  onChange: (photos: Upload[]) => void;
}) {
  const [busy, setBusy] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);

  const pick = async (files: File[], input: HTMLInputElement) => {
    if (!files.length) return;
    setFailed([]);
    setBusy(files.length);
    const prefix = getPrefix();
    const done: Upload[] = [];
    const errors: string[] = [];
    for (const file of files) {
      try {
        done.push(await uploadFile(file, "photo", prefix));
      } catch (e) {
        errors.push(`${file.name}: ${e instanceof Error ? e.message : "didn't upload"}`);
      }
      setBusy((n) => n - 1);
    }
    // One patch at the end: a per-file patch would race against the stale
    // `photos` this closure captured.
    onChange([...photos, ...done]);
    setFailed(errors);
    input.value = "";
  };

  return (
    <div data-field="photos" className="grid gap-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => pick(Array.from(e.target.files ?? []), e.target)}
        className={fileInputClass}
        aria-label="Photos"
      />
      {busy > 0 && (
        <span className="text-xs text-muted">
          Uploading {busy} {busy === 1 ? "photo" : "photos"}…
        </span>
      )}
      {photos.length > 0 && (
        <ul className="grid gap-2">
          {photos.map((p, i) => (
            <li key={p.url}>
              <UploadPreview
                upload={p}
                onRemove={() => onChange(photos.filter((_, idx) => idx !== i))}
              />
            </li>
          ))}
        </ul>
      )}
      {failed.map((f) => (
        <FieldError key={f} error={f} />
      ))}
    </div>
  );
}

export function PageContent({
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
  const tpl = templateByKey(draft.templateChoice);
  const uploads = draft.uploads;

  return (
    <div className="grid gap-10">
      <TextAreaField
        name="services"
        label="Services or products you offer"
        required
        rows={4}
        error={errors.services}
        value={draft.services}
        onChange={(e) => onChange({ services: e.target.value })}
        onBlur={() => onBlur("services")}
      />

      <HoursTable hours={draft.hours} onChange={(hours) => onChange({ hours })} />

      <div className="grid gap-6 md:grid-cols-3">
        <TextField
          name="instagram"
          label="Instagram"
          hint="Optional."
          error={errors.instagram}
          value={draft.instagram}
          onChange={(e) => onChange({ instagram: e.target.value })}
          onBlur={() => onBlur("instagram")}
        />
        <TextField
          name="facebook"
          label="Facebook"
          hint="Optional."
          error={errors.facebook}
          value={draft.facebook}
          onChange={(e) => onChange({ facebook: e.target.value })}
          onBlur={() => onBlur("facebook")}
        />
        <TextField
          name="googleBusiness"
          label="Google Business"
          hint="Optional."
          error={errors.googleBusiness}
          value={draft.googleBusiness}
          onChange={(e) => onChange({ googleBusiness: e.target.value })}
          onBlur={() => onBlur("googleBusiness")}
        />
      </div>

      <div className="grid gap-3">
        <span className="text-sm text-muted">Photos</span>
        <p className="text-xs leading-relaxed text-muted/80">
          Upload your business&rsquo;s photos here. To make sure each photo ends
          up in the right spot on your site, name each file to match its
          placement.{" "}
          {tpl
            ? `On the ${tpl.name} template you chose, hover over any image in the demo to see its name. Use those exact filenames.`
            : "On the template you chose, hover over any image in the demo to see its name. Use those exact filenames."}{" "}
          For example, if the template&rsquo;s hero image is called{" "}
          <code className="font-mono text-ink">hero.jpg</code>, name your version{" "}
          <code className="font-mono text-ink">hero.jpg</code> too. Don&rsquo;t
          worry about matching perfectly. We&rsquo;ll adjust anything that&rsquo;s
          unclear on our end.
        </p>
        <PhotosField
          photos={uploads.photos}
          getPrefix={getPrefix}
          onChange={(photos) => onUploads({ photos })}
        />
      </div>

      <UploadField
        name="heroVideo"
        label="Hero background video (optional)"
        accept={VIDEO_TYPES}
        kind="heroVideo"
        getPrefix={getPrefix}
        value={uploads.heroVideo}
        error={errors.heroVideo}
        onChange={(heroVideo) => onUploads({ heroVideo })}
        hint={
          <>
            Some businesses upload a short video of themselves working, under 30
            seconds. A few quick clips edited together, or one continuous shot. It
            plays behind your hero section on desktop, muted, on loop. Skip it if
            you&rsquo;d rather stick with a still image. MP4, MOV, or WebM, 25MB max.
          </>
        }
      />
    </div>
  );
}
