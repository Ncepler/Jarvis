import { COPY } from "@/lib/site";

// A single quiet line near the work section — sets the timeline expectation
// before anyone starts browsing the gallery. Deliberately tiny: no heading,
// no section chrome, just a hairline-bounded strip.
export function WorkNote() {
  return (
    <section className="border-t border-line px-6 py-8 md:px-10">
      <p className="mx-auto max-w-6xl text-center font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {COPY.workNote}
      </p>
    </section>
  );
}
