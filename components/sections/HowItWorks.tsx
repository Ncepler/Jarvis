import { Reveal } from "@/components/Reveal";
import { COPY } from "@/lib/site";

// Answers "what am I signing up for" right where the tiers raise it.
// Utility strip in the All Sites register: rows, hairlines, no animation
// beyond the shared reveal.
export function HowItWorks() {
  return (
    <section
      id="process"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-title">{COPY.howItWorks.title}</h2>
        </Reveal>
        <ol className="mt-16 max-w-2xl">
          {COPY.howItWorks.steps.map((step, i) => (
            <Reveal key={step} delay={Math.min(i * 0.06, 0.3)}>
              <li className="flex items-baseline gap-6 border-b border-line py-5">
                <span className="shrink-0 text-sm text-muted tabular-nums">
                  0{i + 1}
                </span>
                <span>{step}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
