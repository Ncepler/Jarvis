import { Reveal } from "@/components/Reveal";
import { COPY } from "@/lib/site";

// "Getting found on Google" — sits right after pricing, since the monthly
// fee is what funds this work. Two equal-weight groups (launch setup vs.
// ongoing monthly work), side by side on desktop, stacked on mobile.
function Group({ heading, items }: { heading: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
        {heading}
      </h3>
      <ul className="mt-6 flex flex-col divide-y divide-line border-t border-line">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 py-4 text-[15px] leading-relaxed text-ink/85"
          >
            <span aria-hidden="true" className="shrink-0 text-accent">
              –
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Seo() {
  return (
    <section id="seo" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-title leading-[1.02]">
          {COPY.seo.heading}
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-muted">{COPY.seo.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.14}>
            <Group heading={COPY.seo.launch.heading} items={COPY.seo.launch.items} />
          </Reveal>
          <Reveal delay={0.2}>
            <Group heading={COPY.seo.ongoing.heading} items={COPY.seo.ongoing.items} />
          </Reveal>
        </div>

        <Reveal delay={0.26}>
          <p className="mt-12 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
            {COPY.seo.closing}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <a
            href="/start"
            className="mt-12 inline-block border border-accent bg-accent px-6 py-3 text-sm text-white transition-colors duration-200 hover:bg-accent/90"
          >
            {COPY.seo.cta} →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
