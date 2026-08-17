import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";

// Three short blocks instead of a wall of text (Noah's rewrite). Each block
// is 2–3 sentences, quiet mono-label heading, no mention of studio size,
// location, or who's behind it.
const BLOCKS = [COPY.about.who, COPY.about.how, COPY.about.what] as const;

export function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          a={COPY.headings.about.a}
          b={COPY.headings.about.b}
        />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {BLOCKS.map((block, i) => (
            <Reveal key={block.heading} delay={Math.min(i * 0.08, 0.24)}>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {block.heading}
                </h3>
                <p className="max-w-sm text-lg leading-relaxed text-muted">
                  {block.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
