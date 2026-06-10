import { SITE, isTBD } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-title">About</h2>
        <p className="mt-16 max-w-xl text-lg leading-relaxed">
          We&apos;re a small web studio on {SITE.region.replace(", NY", "")}.
          We build sites for local businesses — flower shops, landscapers,
          contractors — that look like they cost 10x what they did. The work
          above is the pitch
          {isTBD(SITE.instagram) ? (
            "."
          ) : (
            <>
              ; the rest is on{" "}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-muted"
              >
                Instagram
              </a>
              .
            </>
          )}
        </p>
      </div>
    </section>
  );
}
