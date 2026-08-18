import { styleDemos } from "@/lib/projects";
import type { DayHours, IntakeDraft } from "@/lib/intake";
import { TextAreaField, TextField, fieldClass } from "./fields";

function HoursTable({
  hours,
  onChange,
}: {
  hours: DayHours[];
  onChange: (hours: DayHours[]) => void;
}) {
  const update = (i: number, patch: Partial<DayHours>) => {
    onChange(hours.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  };
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
                />
                <span className="text-xs text-muted">to</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => update(i, { close: e.target.value })}
                  className={`${fieldClass} text-sm`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageContent({
  draft,
  onChange,
  photoFileNames,
  onPhotos,
}: {
  draft: IntakeDraft;
  onChange: (patch: Partial<IntakeDraft>) => void;
  photoFileNames: string[];
  onPhotos: (files: File[]) => void;
}) {
  return (
    <div className="grid gap-10">
      <label className="grid gap-2 text-sm text-muted">
        <span>
          Which template did you pick?<span className="text-accent"> *</span>
        </span>
        <select
          required
          value={draft.template}
          onChange={(e) => onChange({ template: e.target.value })}
          className={`${fieldClass} cursor-pointer`}
        >
          <option value="" className="bg-bg" disabled>
            Choose one
          </option>
          {styleDemos.map((p) => (
            <option key={p.slug} value={p.slug} className="bg-bg">
              {p.name}
            </option>
          ))}
          <option value="custom" className="bg-bg">
            Custom build
          </option>
        </select>
      </label>

      <TextAreaField
        label="Services or products you offer"
        required
        rows={4}
        value={draft.services}
        onChange={(e) => onChange({ services: e.target.value })}
      />

      <HoursTable hours={draft.hours} onChange={(hours) => onChange({ hours })} />

      <div className="grid gap-6 md:grid-cols-3">
        <TextField
          label="Instagram"
          value={draft.instagram}
          onChange={(e) => onChange({ instagram: e.target.value })}
          hint="Optional."
        />
        <TextField
          label="Facebook"
          value={draft.facebook}
          onChange={(e) => onChange({ facebook: e.target.value })}
          hint="Optional."
        />
        <TextField
          label="Google Business"
          value={draft.googleBusiness}
          onChange={(e) => onChange({ googleBusiness: e.target.value })}
          hint="Optional."
        />
      </div>

      <div className="grid gap-2">
        <p className="text-sm text-muted">
          Upload your own photos. Name each file to match the section it
          should appear in — for example: hero.jpg, service-1.jpg,
          service-2.jpg. If you&rsquo;re not sure which name matches which
          spot, we&rsquo;ll figure it out on our end.
        </p>
        <label className="grid gap-2 text-sm text-muted">
          <span>Photos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onPhotos(Array.from(e.target.files ?? []))}
            className="text-sm text-muted file:mr-4 file:cursor-pointer file:border file:border-line file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-ink hover:file:border-ink"
          />
          {photoFileNames.length > 0 && (
            <span className="text-xs text-muted/80">
              Selected: {photoFileNames.join(", ")}
            </span>
          )}
        </label>
      </div>
    </div>
  );
}
