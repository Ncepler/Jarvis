"use client";

import { useEffect, useState } from "react";
import {
  MAX_VIDEO_BYTES,
  VIDEO_TYPES,
  type DayHours,
  type Errors,
  type IntakeDraft,
  type IntakeFiles,
} from "@/lib/intake";
import { templateByKey } from "@/lib/templates";
import { FieldError, TextAreaField, TextField, fieldClass, fileInputClass } from "./fields";

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

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

function VideoField({
  file,
  error,
  onFile,
}: {
  file: File | null;
  error?: string;
  onFile: (f: File | null) => void;
}) {
  const [url, setUrl] = useState("");
  const [tooBig, setTooBig] = useState("");

  useEffect(() => {
    if (!file) return setUrl("");
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <label data-field="heroVideo" className="grid gap-2 text-sm text-muted">
      <span>Hero background video (optional)</span>
      <p className="text-xs text-muted/80">
        Some businesses upload a short video of themselves working, under 30
        seconds. A few quick clips edited together, or one continuous shot. It
        plays behind your hero section on desktop, muted, on loop. Skip it if
        you&rsquo;d rather stick with a still image.
      </p>
      <input
        type="file"
        accept={VIDEO_TYPES}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f && f.size > MAX_VIDEO_BYTES) {
            setTooBig(`That file is ${mb(f.size)}. The limit is 25MB, so trim it or export it smaller.`);
            onFile(null);
            e.target.value = "";
            return;
          }
          setTooBig("");
          onFile(f);
        }}
        className={fileInputClass}
      />
      <span className="text-xs text-muted/80">MP4, MOV, or WebM. 25MB max.</span>
      {url && (
        <video src={url} controls muted playsInline className="mt-1 w-full max-w-sm border border-line" />
      )}
      <FieldError error={tooBig || error} />
    </label>
  );
}

export function PageContent({
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
  const tpl = templateByKey(draft.templateChoice);

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
          value={draft.instagram}
          onChange={(e) => onChange({ instagram: e.target.value })}
        />
        <TextField
          name="facebook"
          label="Facebook"
          hint="Optional."
          value={draft.facebook}
          onChange={(e) => onChange({ facebook: e.target.value })}
        />
        <TextField
          name="googleBusiness"
          label="Google Business"
          hint="Optional."
          value={draft.googleBusiness}
          onChange={(e) => onChange({ googleBusiness: e.target.value })}
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
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onFiles({ photos: Array.from(e.target.files ?? []) })}
          className={fileInputClass}
          aria-label="Photos"
        />
        {files.photos.length > 0 && (
          <span className="text-xs text-muted/80">
            {files.photos.length} selected: {files.photos.map((f) => f.name).join(", ")}
          </span>
        )}
      </div>

      <VideoField
        file={files.heroVideo}
        error={errors.heroVideo}
        onFile={(f) => onFiles({ heroVideo: f })}
      />
    </div>
  );
}
