import { orderedProjects } from "@/lib/projects";

export function AllSites() {
  return (
    <section id="sites" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-title">Every site, one list</h2>
        <ul className="mt-16">
          {orderedProjects.map((p) => (
            <li
              key={p.slug}
              className="flex items-baseline justify-between border-b border-line py-5"
            >
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-muted"
                >
                  {p.name}
                </a>
              ) : (
                <span>{p.name}</span>
              )}
              <span className="text-sm text-muted">
                {p.url ? "View live" : "In the works"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
