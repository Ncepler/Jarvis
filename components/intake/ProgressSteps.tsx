// Thin segmented bar plus "N of M". The step list is passed in rather than
// fixed: the "Customize" page only exists when a template was picked.
export function ProgressSteps({
  steps,
  step,
}: {
  steps: { id: string; label: string }[];
  step: number;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted tabular-nums">
          Step {step + 1} of {steps.length}
        </span>
        <span className="text-xs text-muted">{steps[step]?.label}</span>
      </div>
      <div className="flex gap-2" aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s.id} className="h-[2px] flex-1 bg-line">
            <div
              className="h-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: i <= step ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
