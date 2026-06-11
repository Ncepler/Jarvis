// Style demo: a barbershop homepage. "Standard Barber Co." is a sample
// brand for the demo, not a client. Self-contained: every color is local.

const ink = "text-[#e8e2d6]";
const muted = "text-[#9a917f]";

// barber pole — the stripes actually turn (Noah 2026-06-11). Pure CSS:
// a striped strip taller than the pole translates by exactly one stripe
// period and loops. Linear, constant, off the main thread.
function Pole() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-1">
      <style>{`
        @keyframes barber-turn {
          to { transform: translateY(-79.2px); }
        }
        .barber-stripes { animation: barber-turn 2.4s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .barber-stripes { animation: none; }
        }
      `}</style>
      <div className="h-4 w-8 rounded-t-full bg-[#b08d4f]" />
      <div className="relative h-56 w-14 overflow-hidden rounded-full border-2 border-[#b08d4f]/60 md:h-72">
        <div
          className="barber-stripes absolute inset-x-0 -top-24 h-[calc(100%+12rem)]"
          style={{
            background:
              "repeating-linear-gradient(45deg, #e8e2d6 0 14px, #b08d4f 14px 28px, #e8e2d6 28px 42px, #2e2820 42px 56px)",
          }}
        />
      </div>
      <div className="h-4 w-8 rounded-b-full bg-[#b08d4f]" />
    </div>
  );
}

const prices = [
  ["Haircut", "$35"],
  ["Skin fade", "$40"],
  ["Beard trim & line-up", "$20"],
  ["Hot towel shave", "$45"],
  ["Kids (12 & under)", "$25"],
  ["The works: cut, shave, towel", "$70"],
];

export function BarberDemo() {
  return (
    <div className={`bg-[#1d1a16] ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <span className="text-lg font-bold uppercase tracking-[0.2em]">
          Standard Barber Co.
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>Walk-ins welcome</span>
          <a
            href="#barber-book"
            className="border border-[#b08d4f] px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-[#b08d4f] transition-colors duration-200 hover:bg-[#b08d4f] hover:text-[#1d1a16]"
          >
            Book a chair
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-[1.4fr_1fr] md:px-10 md:pb-24 md:pt-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b08d4f]">
            Barbershop · Patchogue
          </p>
          <h1 className="mt-5 text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            A good cut.
            <br />
            Every time.
          </h1>
          <p className={`mt-6 max-w-md text-lg ${muted}`}>
            Four chairs, no rush, no upsell. Book online or walk in; either
            way you leave sharp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#barber-book"
              className="bg-[#b08d4f] px-7 py-3.5 font-medium uppercase tracking-wide text-[#1d1a16] transition-colors duration-200 hover:bg-[#e8e2d6]"
            >
              Book a chair
            </a>
            <span className={`text-sm ${muted}`}>Tue–Sat · 9–7</span>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center md:h-80">
          <Pole />
        </div>
      </section>

      {/* price list */}
      <section className="border-t border-[#e8e2d6]/10 bg-[#241f1a]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
            The list
          </h2>
          <ul className="mt-10 max-w-2xl">
            {prices.map(([name, price]) => (
              <li
                key={name}
                className="flex items-baseline gap-4 border-b border-[#e8e2d6]/10 py-4"
              >
                <span>{name}</span>
                <span className="flex-1 border-b border-dotted border-[#e8e2d6]/25" />
                <span className="font-medium text-[#b08d4f]">{price}</span>
              </li>
            ))}
          </ul>
          <p className={`mt-6 text-sm ${muted}`}>
            Cash or card. Rebook on your way out and the next one&apos;s
            already on the calendar.
          </p>
        </div>
      </section>

      {/* book band */}
      <section id="barber-book" className="border-t border-[#e8e2d6]/10">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
          <h2 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Your chair&apos;s <span className="text-[#b08d4f]">waiting.</span>
          </h2>
          <p className={`mx-auto mt-5 max-w-md ${muted}`}>
            Book online in under a minute, or just come by: 311 Main St,
            Patchogue. If the pole&apos;s spinning, we&apos;re cutting.
          </p>
          <a
            href="#barber-book"
            className="mt-8 inline-block bg-[#b08d4f] px-8 py-4 font-medium uppercase tracking-wide text-[#1d1a16] transition-colors duration-200 hover:bg-[#e8e2d6]"
          >
            Book a chair
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[#e8e2d6]/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
          <span className="text-sm font-bold uppercase tracking-[0.2em]">
            Standard Barber Co.
          </span>
          <span className={`text-sm ${muted}`}>
            311 Main St, Patchogue, NY · Tue–Sat 9–7
          </span>
        </div>
      </footer>
    </div>
  );
}
