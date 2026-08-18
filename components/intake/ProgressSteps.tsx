import { TOTAL_STEPS } from "@/lib/intake";

const LABELS = ["Contact", "Brand", "Content", "Last thing"];

// Thin segmented bar + "N of 4" — same restrained language as the site's
// mini step counters in Contact.tsx ("1 of 2"), just wider since this form
// has more ground to cover.
export function ProgressSteps({ step }: { step: number }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted tabular-nums">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs text-muted">{LABELS[step - 1]}</span>
      </div>
      <div className="flex gap-2" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className="h-[2px] flex-1 bg-line">
            <div
              className="h-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: i < step ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
