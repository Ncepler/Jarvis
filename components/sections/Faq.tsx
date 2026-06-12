import { Reveal } from "@/components/Reveal";
import { COPY } from "@/lib/site";

// The real objections a cold-email visitor has, answered flat — no
// accordion, no theatrics. Every answer must be true with zero clients.
export function Faq() {
  return (
    <section
      id="faq"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-title">{COPY.faq.title}</h2>
        </Reveal>
        <div className="mt-16 max-w-3xl">
          {COPY.faq.items.map((item, i) => (
            <Reveal key={item.q} delay={Math.min(i * 0.06, 0.3)}>
              <div className="grid gap-2 border-b border-line py-7 md:grid-cols-[220px_1fr] md:gap-10">
                <h3>{item.q}</h3>
                <p className="text-muted leading-relaxed">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
