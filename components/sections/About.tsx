import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { COPY, SITE, isTBD } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          a={COPY.headings.about.a}
          b={COPY.headings.about.b}
        />
        <Reveal delay={0.1}>
          <div className="mt-16 grid max-w-xl gap-6 text-lg leading-relaxed">
            <p>{COPY.about.p1}</p>
            <p>{COPY.about.p2}</p>
            <p>
              {COPY.about.closer}
              {isTBD(SITE.instagram) ? (
                "."
              ) : (
                <>
                  ; the rest is on{" "}
                  <a
                    href={SITE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-accent-2 hover:decoration-accent-2"
                  >
                    Instagram
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
