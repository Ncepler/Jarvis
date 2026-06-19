import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Honest "why us" differentiators, numbered 01–04. No stats, no client counts,
// no badges — every line is true with zero clients (the brief's hard rule).
export function ValueProps() {
  return (
    <section
      id="why"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why us"
          a={COPY.headings.why.a}
          b={COPY.headings.why.b}
        />
        <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2">
          {COPY.why.map((item, i) => (
            <Reveal key={item.title} delay={Math.min(i * 0.07, 0.3)}>
              <div className="flex h-full flex-col gap-4 bg-bg p-8 md:p-10">
                <span className="font-mono text-sm text-accent tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="text-xl">{item.title}</h3>
                <p className="max-w-sm text-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
