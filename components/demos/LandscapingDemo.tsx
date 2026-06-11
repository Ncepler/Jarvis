// Style demo: an upscale landscape design/build homepage — the flagship-tier
// look. "Stone & Sage Landscapes" is a sample brand for the demo, not a
// client. Self-contained: every color is local.

const ink = "text-[#26261f]";
const muted = "text-[#75756a]";

// abstract garden plan — circles for plantings, lines for hardscape
function GardenPlan() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="0" width="400" height="300" fill="#3c4434" />
      <path d="M40 260 Q 140 200 200 220 T 380 180" stroke="#ece7df" strokeWidth="2" fill="none" opacity="0.6" />
      <style>{`
        @keyframes land-breathe {
          to { transform: scale(1.05); }
        }
        .land-breathe {
          transform-box: fill-box;
          transform-origin: center;
          animation: land-breathe 7s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .land-breathe { animation: none; }
        }
      `}</style>
      <circle className="land-breathe" cx="90" cy="110" r="38" fill="#5a6b4d" />
      <circle className="land-breathe" style={{ animationDelay: "1.4s" }} cx="150" cy="80" r="22" fill="#6e8059" />
      <circle className="land-breathe" style={{ animationDelay: "2.8s" }} cx="290" cy="120" r="48" fill="#4c5a41" />
      <circle className="land-breathe" style={{ animationDelay: "0.7s" }} cx="330" cy="220" r="26" fill="#6e8059" />
      <rect x="180" y="140" width="70" height="70" fill="none" stroke="#ece7df" strokeWidth="2" opacity="0.7" />
    </svg>
  );
}

const work = [
  ["Bayside terrace & plantings", "Port Washington", "2025"],
  ["Pool surround in bluestone", "Huntington", "2025"],
  ["Native meadow front yard", "Northport", "2024"],
  ["Outdoor kitchen & pergola", "Cold Spring Harbor", "2024"],
];

const practice = [
  {
    name: "Design",
    copy: "A measured plan for the whole property (plantings, stone, lighting, grading) before anything is dug.",
  },
  {
    name: "Build",
    copy: "Our own crews, not subs. Masonry, carpentry, irrigation, and planting held to the drawing.",
  },
  {
    name: "Care",
    copy: "Seasonal maintenance by the people who built it, so year five looks better than year one.",
  },
];

export function LandscapingDemo() {
  return (
    <div className={`bg-[#ece7df] ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="font-display text-xl tracking-tight">
          Stone &amp; Sage Landscapes
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>(516) 555-0123</span>
          <a
            href="#land-consult"
            className="border border-[#26261f] px-5 py-2.5 text-sm transition-colors duration-200 hover:bg-[#26261f] hover:text-[#ece7df]"
          >
            Book a consultation
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
        <p className={`text-sm uppercase tracking-widest ${muted}`}>
          Landscape design &amp; build · North Shore
        </p>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.04] tracking-tight md:text-7xl">
          Gardens designed to be lived in, built to stay.
        </h1>
        <div className="mt-12 h-64 overflow-hidden md:h-96">
          <GardenPlan />
        </div>
        <p className={`mt-6 max-w-lg text-lg ${muted}`}>
          We design and build the whole property: stone, plantings, lighting,
          water. Then we keep it. One studio, one crew, one standard.
        </p>
      </section>

      {/* practice */}
      <section className="border-t border-[#26261f]/15">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10 md:py-24">
          {practice.map((p, i) => (
            <div key={p.name}>
              <span className={`text-sm ${muted}`}>0{i + 1}</span>
              <h2 className="font-display mt-2 text-3xl">{p.name}</h2>
              <p className={`mt-4 text-sm leading-relaxed ${muted}`}>{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* selected work */}
      <section className="bg-[#3c4434] text-[#ece7df]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl">Selected work</h2>
          <ul className="mt-10">
            {work.map(([name, town, year]) => (
              <li
                key={name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#ece7df]/20 py-5"
              >
                <span className="text-lg">{name}</span>
                <span className="text-sm text-[#ece7df]/60">
                  {town} · {year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* consult band */}
      <section id="land-consult" className="mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-display mx-auto max-w-2xl text-4xl leading-tight md:text-5xl">
          Walk the property with us.
        </h2>
        <p className={`mx-auto mt-5 max-w-md ${muted}`}>
          Consultations run about an hour. You&apos;ll leave with a clear sense
          of what the land wants to be, whether or not you build with us.
        </p>
        <a
          href="#land-consult"
          className="mt-8 inline-block border border-[#26261f] px-8 py-4 transition-colors duration-200 hover:bg-[#26261f] hover:text-[#ece7df]"
        >
          Book a consultation
        </a>
      </section>

      {/* footer */}
      <footer className="border-t border-[#26261f]/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
          <span className="font-display">Stone &amp; Sage Landscapes</span>
          <span className={`text-sm ${muted}`}>
            North Shore, Long Island · (516) 555-0123
          </span>
        </div>
      </footer>
    </div>
  );
}
