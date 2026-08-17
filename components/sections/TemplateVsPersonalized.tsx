import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Labeled gray-box placeholders at the real aspect ratio — Noah drops in
// real before/after screenshots later (same pattern as the demo system's
// <Media> placeholders). Never fake a screenshot in the meantime.
function Slot({ label, niche }: { label: string; niche: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-[16/10] items-center justify-center border border-line bg-surface">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          {niche} — {label}
        </span>
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
    </div>
  );
}

export function TemplateVsPersonalized() {
  return (
    <section className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Before / after"
          a={COPY.headings.templateVsPersonalized.a}
          b={COPY.headings.templateVsPersonalized.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {COPY.templateVsPersonalized.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-16">
          {COPY.templateVsPersonalized.rows.map((row, i) => (
            <Reveal key={row.niche} delay={Math.min(i * 0.08, 0.24)}>
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  {row.niche}
                </span>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <Slot label="Template" niche={row.niche} />
                  <Slot label="Yours" niche={row.niche} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-14 max-w-2xl text-sm leading-relaxed text-muted">
            {COPY.templateVsPersonalized.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
