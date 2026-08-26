import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Three flat tiers, no feature bullet lists, no "most popular" badge — the
// tiers are the same work at a different starting point, not different
// levels of effort. Premium sits in the center position (both in price order
// and physical layout — center gets a real, separately-documented attention
// bias regardless of price) and carries more visual weight: a wider card
// that sits slightly forward, an accent border. That weight is earned by
// position and size alone, never by a fabricated "recommended" label.
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

        <div className="mt-16 grid items-center gap-6 md:grid-cols-3">
          {COPY.pricing.tiers.map((tier, i) => {
            const isPremium = tier.key === "premium";
            return (
              <Reveal key={tier.key} delay={i * 0.09}>
                <div
                  className={
                    isPremium
                      ? "relative flex h-full flex-col gap-3 border-2 border-accent bg-surface p-8 md:-my-4 md:p-10"
                      : "flex h-full flex-col gap-3 border border-line p-8 md:p-10"
                  }
                >
                  <h3 className="text-xl">{tier.title}</h3>
                  <p
                    className={
                      isPremium
                        ? "text-3xl text-accent"
                        : "text-2xl text-accent"
                    }
                  >
                    {tier.build}
                    {tier.monthly && (
                      <span className="text-lg text-ink"> + {tier.monthly}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {tier.why}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.24}>
          <p className="mt-10 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
            {COPY.pricing.note}
          </p>
        </Reveal>

        {/* What the upfront vs. monthly cost each actually pay for. */}
        <Reveal delay={0.3}>
          <div className="mt-16 max-w-2xl border-t border-line pt-10">
            <h3 className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
              {COPY.pricing.costExplainer.heading}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink/85">
              {COPY.pricing.costExplainer.upfront}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/85">
              {COPY.pricing.costExplainer.monthly}
            </p>
            <p className="mt-6 text-sm text-muted">
              {COPY.pricing.costExplainer.annual}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
