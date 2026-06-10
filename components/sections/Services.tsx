const PATHS = [
  {
    key: "style",
    title: "Pick a style",
    price: "~$300",
    copy: "Choose a ready-made style and we fit it to your business. Live in about a week.",
  },
  {
    key: "custom",
    title: "Custom build",
    price: "from $500",
    copy: "Designed from scratch around how your business actually works.",
  },
  {
    key: "flagship",
    title: "Flagship",
    price: "let's talk",
    copy: "The full treatment. We scope it together.",
  },
] as const;

export function Services() {
  return (
    <section id="services" className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-title">Three ways in</h2>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {PATHS.map((p) => (
            <div key={p.key} className="border border-line p-8">
              <h3 className="text-lg">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.copy}</p>
              <p className="mt-6 text-sm">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
