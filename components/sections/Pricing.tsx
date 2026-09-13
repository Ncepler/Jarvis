import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Recap line + explainer paragraphs — no tier cards here (those live in the
// "Three ways in" Services section near the top). This section is the
// fine-print counterpart: what the money actually covers.
export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          a={COPY.headings.pricing.a}
          b={COPY.headings.pricing.b}
        />

        <Reveal delay={0.08}>
          <p className="mt-16 max-w-2xl text-lg leading-relaxed text-ink">
            {COPY.pricing.recap}
          </p>
        </Reveal>

        <div className="mt-8 max-w-2xl">
          {COPY.pricing.body.map((p, i) => (
            <Reveal key={p} delay={0.12 + i * 0.06}>
              <p className="mt-4 text-base leading-relaxed text-ink/85">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
