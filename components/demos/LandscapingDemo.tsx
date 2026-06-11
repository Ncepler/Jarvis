// Style demo: an upscale landscape design/build homepage — the flagship-tier
// look. "Stone & Sage Landscapes" is a sample brand for the demo, not a
// client. Self-contained: every color is local.

import { Marquee, Rise } from "./shared";

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

const materials = ["bluestone", "granite", "cedar", "native plantings", "corten", "gravel gardens"];

export function LandscapingDemo() {
  return (
    <div className={`overflow-hidden bg-[#ece7df] ${ink} antialiased`}>
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

      {/* hero — type first, then three arched garden panels at offset heights */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:px-10 md:pb-28 md:pt-20">
        <Rise>
          <p className={`text-sm uppercase tracking-widest ${muted}`}>
            Landscape design &amp; build · North Shore
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.04] tracking-tight md:text-7xl">
            Gardens designed to be lived in, built to stay.
          </h1>
        </Rise>
        <div className="mt-14 grid grid-cols-3 items-end gap-4 md:gap-6">
          <Rise delay={0.05}>
            <div className="h-40 overflow-hidden rounded-t-full bg-[#5a6b4d] md:h-64" />
          </Rise>
          <Rise delay={0.15}>
            <div className="h-56 overflow-hidden rounded-t-full md:h-80">
              <GardenPlan />
            </div>
          </Rise>
          <Rise delay={0.25}>
            <div className="h-48 overflow-hidden rounded-t-full bg-[#b9a98e] md:h-72" />
          </Rise>
        </div>
        <Rise delay={0.2}>
          <p className={`mt-10 max-w-lg text-lg ${muted}`}>
            We design and build the whole property: stone, plantings, lighting,
            water. Then we keep it. One studio, one crew, one standard.
          </p>
        </Rise>
      </section>

      {/* materials ticker — quiet, serif, the luxury version of a marquee */}
      <div className="border-y border-[#26261f]/15 py-4">
        <Marquee label="Materials we work in" duration={30} className="font-display text-xl">
          {materials.map((t) => (
            <span key={t} className="inline-flex items-center">
              <span className="px-8">{t}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#3c4434]" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* practice */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-3 md:gap-8 md:px-10 md:py-28">
          {practice.map((p, i) => (
            <Rise key={p.name} delay={i * 0.1}>
              <div className={i === 1 ? "md:translate-y-10" : ""}>
                <span className={`text-sm ${muted}`}>0{i + 1}</span>
                <h2 className="font-display mt-2 text-3xl">{p.name}</h2>
                <p className={`mt-4 max-w-xs text-sm leading-relaxed ${muted}`}>
                  {p.copy}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* selected work */}
      <section className="bg-[#3c4434] text-[#ece7df]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <Rise>
            <h2 className="font-display text-3xl md:text-4xl">Selected work</h2>
          </Rise>
          <ul className="mt-10">
            {work.map(([name, town, year], i) => (
              <Rise key={name} delay={Math.min(i * 0.07, 0.28)}>
                <li className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#ece7df]/20 py-6">
                  <span className="font-display text-xl transition-transform duration-300 md:text-2xl md:group-hover:translate-x-3">
                    {name}
                  </span>
                  <span className="text-sm text-[#ece7df]/60 transition-colors duration-300 group-hover:text-[#ece7df]">
                    {town} · {year}
                  </span>
                </li>
              </Rise>
            ))}
          </ul>
          <Rise delay={0.2}>
            <blockquote className="mx-auto mt-16 max-w-2xl text-center">
              <p className="font-display text-2xl leading-snug md:text-3xl">
                &ldquo;They treated our half acre like it was a museum
                courtyard.&rdquo;
              </p>
              <cite className="mt-4 block text-sm not-italic text-[#ece7df]/60">
                A client in Huntington, sample quote for this demo
              </cite>
            </blockquote>
          </Rise>
        </div>
      </section>

      {/* consult band */}
      <section
        id="land-consult"
        className="relative mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#26261f]/15"
        />
        <Rise>
          <h2 className="font-display relative mx-auto max-w-2xl text-4xl leading-tight md:text-5xl">
            Walk the property with us.
          </h2>
        </Rise>
        <Rise delay={0.1}>
          <p className={`relative mx-auto mt-5 max-w-md ${muted}`}>
            Consultations run about an hour. You&apos;ll leave with a clear sense
            of what the land wants to be, whether or not you build with us.
          </p>
          <a
            href="#land-consult"
            className="relative mt-8 inline-block border border-[#26261f] px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#26261f] hover:text-[#ece7df]"
          >
            Book a consultation
          </a>
        </Rise>
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
