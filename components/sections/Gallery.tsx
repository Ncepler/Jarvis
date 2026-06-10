import { orderedProjects } from "@/lib/projects";

export function Gallery() {
  return (
    <section id="work" className="border-t border-line py-24 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="font-display text-title">The work</h2>
        <p className="mt-4 max-w-md text-muted">
          Styles we build from, and the sites that came out of them.
        </p>
      </div>
      <div className="mt-16 flex gap-6 overflow-x-auto px-6 md:px-10">
        {orderedProjects.map((p) => (
          <div
            key={p.slug}
            className="aspect-[16/10] w-80 shrink-0 border border-line p-6"
          >
            <p>{p.name}</p>
            <p className="mt-1 text-sm text-muted">{p.priceLabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
