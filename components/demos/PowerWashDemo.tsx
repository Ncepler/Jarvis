// Style demo: a power-washing homepage. "Tide Line Power Washing" is a
// sample brand for the demo, not a client. Self-contained: every color is
// local, nothing leaks into the studio site's theme.

const ink = "text-[#0e2233]";
const muted = "text-[#56707f]";

// stylized house front getting washed — flat shapes, no imagery
function HouseWash() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <rect x="70" y="140" width="260" height="130" fill="#dfe9ef" />
      <polygon points="50,140 200,60 350,140" fill="#0e2233" />
      <rect x="180" y="190" width="44" height="80" fill="#0e2233" />
      <rect x="100" y="165" width="50" height="40" fill="#9fc6dc" />
      <rect x="250" y="165" width="50" height="40" fill="#9fc6dc" />
      {/* the clean sweep — the wand works back and forth over the edge */}
      <rect x="70" y="140" width="110" height="130" fill="#b7d8e8" opacity="0.5" />
      <g className="pw-wand">
        <style>{`
          @keyframes pw-sweep {
            to { transform: translateX(-26px); }
          }
          .pw-wand { animation: pw-sweep 3.2s ease-in-out infinite alternate; }
          @media (prefers-reduced-motion: reduce) {
            .pw-wand { animation: none; }
          }
        `}</style>
        <line x1="180" y1="140" x2="180" y2="270" stroke="#1b9fd8" strokeWidth="3" />
        <circle cx="180" cy="120" r="6" fill="#1b9fd8" />
        <path d="M180 120 L150 145 M180 120 L165 150 M180 120 L180 152" stroke="#1b9fd8" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

const services = [
  {
    name: "House soft wash",
    copy: "Siding, trim, and gutters. Low pressure, no stripped paint. Most homes done in a morning.",
    price: "from $250",
  },
  {
    name: "Driveways & walkways",
    copy: "Concrete and pavers back to the color you forgot they were. Oil stains included.",
    price: "from $150",
  },
  {
    name: "Decks, fences & patios",
    copy: "Wood and vinyl, cleaned and brightened, ready for staining or just for summer.",
    price: "from $175",
  },
];

export function PowerWashDemo() {
  return (
    <div className={`bg-white ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <span className="text-lg font-bold uppercase tracking-tight">
          Tide Line <span className="text-[#1b9fd8]">Power Washing</span>
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>(631) 555-0192</span>
          <a
            href="#wash-quote"
            className="bg-[#0e2233] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-[#1b9fd8]"
          >
            Free quote
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="bg-[#0e2233] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1b9fd8]">
              Power washing · Suffolk County
            </p>
            <h1 className="mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
              Like the day
              <br />
              it was built.
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/70">
              Houses, driveways, decks, and fences, washed back to new in one
              visit. Flat quotes, no surprises.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#wash-quote"
                className="bg-[#1b9fd8] px-7 py-3.5 font-semibold uppercase tracking-wide text-[#0e2233] transition-colors duration-200 hover:bg-white"
              >
                Get a free quote
              </a>
              <span className="text-sm text-white/60">Most quotes same day</span>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <HouseWash />
          </div>
        </div>
      </section>

      {/* stat strip */}
      <div className="border-b border-[#0e2233]/10 bg-[#eef5f9]">
        <p className={`mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-1 px-6 py-4 text-sm font-medium md:px-10 ${ink}`}>
          <span>Fully insured</span>
          <span>Flat quotes, no hourly meter</span>
          <span>Soft wash safe for siding</span>
          <span>Done in one visit</span>
        </p>
      </div>

      {/* services */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
          What we wash
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-[#0e2233]/10 bg-[#0e2233]/10 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.name} className="bg-white p-7">
              <h3 className="text-lg font-bold">{s.name}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{s.copy}</p>
              <p className="mt-6 text-sm font-bold text-[#1b9fd8]">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* before / after */}
      <section className="border-t border-[#0e2233]/10 bg-[#eef5f9]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
            The difference is not subtle
          </h2>
          <div className="mt-10 grid overflow-hidden md:grid-cols-2">
            <div className="flex h-48 items-center justify-center bg-[#7a8289] md:h-64">
              <span className="text-sm font-semibold uppercase tracking-widest text-white/80">
                Before
              </span>
            </div>
            <div className="flex h-48 items-center justify-center bg-[#dfe9ef] md:h-64">
              <span className={`text-sm font-semibold uppercase tracking-widest ${ink}`}>
                After
              </span>
            </div>
          </div>
          <p className={`mt-6 max-w-md text-sm ${muted}`}>
            Same driveway, two hours apart. Send a photo of yours and we&apos;ll
            tell you exactly what it&apos;ll cost.
          </p>
        </div>
      </section>

      {/* quote band */}
      <section id="wash-quote" className="bg-[#0e2233] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
          <h2 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Text a photo. <span className="text-[#1b9fd8]">Get a price.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/70">
            Send a picture of the house or driveway to (631) 555-0192. We
            reply with a flat quote, usually the same day.
          </p>
          <a
            href="#wash-quote"
            className="mt-8 inline-block bg-[#1b9fd8] px-8 py-4 font-semibold uppercase tracking-wide text-[#0e2233] transition-colors duration-200 hover:bg-white"
          >
            Text us a photo
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
        <span className="text-sm font-bold uppercase">Tide Line Power Washing</span>
        <span className={`text-sm ${muted}`}>
          Suffolk County, NY · (631) 555-0192
        </span>
      </footer>
    </div>
  );
}
