import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// The five steps, rendered as numbered editorial rows: an oversized display
// numeral leads each line, hairline between. Quiet on purpose — the gallery is
// the one loud beat; this just answers "what am I signing up for."
export function HowItWorks() {
  return (
    <section
      id="process"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The process"
          a={COPY.headings.process.a}
          b={COPY.headings.process.b}
        />
        <ol className="mt-16 max-w-3xl">
          {COPY.howItWorks.steps.map((step, i) => (
            <Reveal key={step} delay={Math.min(i * 0.06, 0.3)}>
              <li className="flex items-baseline gap-6 border-b border-line py-7 md:gap-10">
                <span className="shrink-0 font-display text-4xl leading-none text-muted/40 tabular-nums md:text-5xl">
                  0{i + 1}
                </span>
                <span className="text-lg md:text-xl">{step}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
