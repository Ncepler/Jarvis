import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY } from "@/lib/site";
import { projects } from "@/lib/projects";

// One labeled box, either a placeholder or real media inside.
function Slot({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface">
        {children}
      </div>
      <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
    </div>
  );
}

// Real, finished work on the right — the actual demo sites we built (§7:
// screenshots are real captures, never mocked up). The left side is still a
// placeholder: there's no generic "before personalizing" screenshot to show
// yet, since every demo already starts from its niche mood.
export function TemplateVsPersonalized() {
  return (
    <section className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Before / after"
          a={COPY.headings.templateVsPersonalized.a}
          b={COPY.headings.templateVsPersonalized.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
            {COPY.templateVsPersonalized.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-16">
          {COPY.templateVsPersonalized.rows.map((slug, i) => {
            const project = projects.find((p) => p.slug === slug);
            if (!project) return null;
            return (
              <Reveal key={slug} delay={Math.min(i * 0.08, 0.24)}>
                <div>
                  <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">
                    {project.name}
                  </span>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <Slot label="Template">
                      <div className="flex h-full items-center justify-center px-4 text-center">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                          Starting template
                        </span>
                      </div>
                    </Slot>
                    <Slot label="Yours">
                      {project.screenshot ? (
                        <Image
                          src={project.screenshot}
                          alt={`${project.name}, the finished site`}
                          fill
                          sizes="(max-width: 768px) 92vw, 480px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-muted">Preview</span>
                        </div>
                      )}
                    </Slot>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-14 max-w-2xl text-[15px] font-medium leading-relaxed text-muted">
            {COPY.templateVsPersonalized.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
