import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Two flat tiers, side by side, no feature bullet lists — the tiers are the
// same work at a different starting point, not different levels of effort.
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {COPY.pricing.tiers.map((tier, i) => (
            <Reveal key={tier.title} delay={i * 0.09}>
              <div className="flex h-full flex-col gap-2 border border-line p-8 md:p-10">
                <h3 className="text-xl">{tier.title}</h3>
                <p className="mt-2 text-2xl text-accent">
                  {tier.build}{" "}
                  <span className="text-lg text-ink">+ {tier.monthly}</span>
                </p>
                <p className="mt-4 text-sm text-muted">{tier.yearOne}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-lg">{COPY.pricing.flagship}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
            {COPY.pricing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
