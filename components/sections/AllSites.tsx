import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import { orderedProjects } from "@/lib/projects";

export function AllSites() {
  return (
    <section id="sites" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The index"
          a={COPY.headings.sites.a}
          b={COPY.headings.sites.b}
        />
        <ul className="mt-16">
          {orderedProjects.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.06, 0.3)}>
              <li className="group flex items-baseline justify-between border-b border-line py-5">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform duration-300 ease-out-expo group-hover:translate-x-2"
                  >
                    {p.name}
                  </a>
                ) : (
                  <span>{p.name}</span>
                )}
                <span className="text-sm text-muted transition-colors duration-200 group-hover:text-ink">
                  {p.url ? "View live →" : "In the works"}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
