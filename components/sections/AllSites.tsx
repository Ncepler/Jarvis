"use client";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import { orderedProjects } from "@/lib/projects";

// Ask the gallery to center + open this demo's slug (Gallery listens). The
// demos live inline in the gallery, so "stepping inside" one IS opening it
// there — no separate page, no "in the works" dead end.
function openDemo(slug: string) {
  window.dispatchEvent(new CustomEvent("vilas:open-demo", { detail: slug }));
}

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
              <li className="border-b border-line">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between py-5"
                  >
                    <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-2">
                      {p.name}
                    </span>
                    <span className="text-sm text-muted transition-colors duration-200 group-hover:text-ink">
                      View live →
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => openDemo(p.slug)}
                    className="group flex w-full items-baseline justify-between py-5 text-left"
                  >
                    <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-2">
                      {p.name}
                    </span>
                    <span className="text-sm text-muted transition-colors duration-200 group-hover:text-accent">
                      Step inside →
                    </span>
                  </button>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
