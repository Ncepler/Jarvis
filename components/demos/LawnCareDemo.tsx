// Style demo: a lawn-care homepage, built as a real component so the
// gallery can render it physically inside the page (no iframe). "Fresh Cut
// Lawn Co." is a sample brand for the demo, not a client. Self-contained:
// every color is local, nothing leaks into the studio site's theme.

import { Marquee, Rise } from "./shared";

const ink = "text-[#18241a]";
const muted = "text-[#5c6b5e]";

function Sun() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="lawn-sun h-16 w-16 md:h-24 md:w-24"
      aria-hidden="true"
    >
      <style>{`
        @keyframes lawn-sun-drift {
          to { transform: translateY(7px); }
        }
        .lawn-sun { animation: lawn-sun-drift 6s ease-in-out infinite alternate; }
        @keyframes lawn-cloud-a {
          to { transform: translateX(46px); }
        }
        @keyframes lawn-cloud-b {
          to { transform: translateX(-38px); }
        }
        .lawn-cloud-a { animation: lawn-cloud-a 14s ease-in-out infinite alternate; }
        .lawn-cloud-b { animation: lawn-cloud-b 18s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .lawn-sun, .lawn-cloud-a, .lawn-cloud-b { animation: none; }
        }
      `}</style>
      <circle cx="50" cy="50" r="34" fill="#f3d27a" />
    </svg>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 44" className={className} aria-hidden="true">
      <ellipse cx="38" cy="30" rx="34" ry="14" fill="#ffffff" opacity="0.9" />
      <ellipse cx="74" cy="22" rx="30" ry="16" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

function Hills() {
  return (
    <svg
      viewBox="0 0 800 380"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-2/3 w-full"
      aria-hidden="true"
    >
      <path d="M0 200 Q 200 120 420 190 T 800 160 V 380 H 0 Z" fill="#2e6b3e" />
      <path d="M0 270 Q 240 200 480 260 T 800 240 V 380 H 0 Z" fill="#235633" />
      <path d="M0 330 Q 300 280 800 320 V 380 H 0 Z" fill="#1e4d2b" />
    </svg>
  );
}

const services = [
  {
    name: "Weekly mowing",
    copy: "Cut, trimmed, edged, blown clean. Same crew, same day every week, and the stripes stay straight.",
    price: "from $45 / visit",
  },
  {
    name: "Spring & fall cleanups",
    copy: "Leaves, branches, beds, gutters cleared at ground level. One visit, done.",
    price: "from $180",
  },
  {
    name: "Mulch & edging",
    copy: "Fresh mulch, crisp bed lines. The detail neighbors actually notice.",
    price: "from $120",
  },
];

const steps = [
  ["Text us a photo", "Send a picture of the yard and your address. That's the whole form."],
  ["Get a price that night", "A real quote, not an estimate window. No visit needed."],
  ["We put you on the route", "Same crew, same day each week. Skip or cancel by text anytime."],
];

export function LawnCareDemo() {
  return (
    <div className={`overflow-hidden bg-[#f4f5ef] ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <span className="text-lg font-semibold tracking-tight">
          Fresh Cut Lawn Co.
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>(516) 555-0148</span>
          <a
            href="#lawn-quote"
            className="rounded-full bg-[#1e4d2b] px-5 py-2.5 text-sm font-medium text-[#f4f5ef] transition-colors duration-200 hover:bg-[#2e6b3e]"
          >
            Free quote
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-24 pt-10 md:grid-cols-2 md:px-10 md:pb-32">
        <div>
          <Rise>
            <p className={`text-sm font-medium uppercase tracking-widest ${muted}`}>
              Lawn care · Nassau County
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Your lawn,{" "}
              <em className="font-display font-normal text-[#1e4d2b]">handled.</em>
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-6 max-w-md text-lg ${muted}`}>
              Weekly mowing, cleanups, and edging for homes on the South Shore.
              No contracts, no voicemail tag. Text a photo, get a price.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#lawn-quote"
                className="rounded-full bg-[#1e4d2b] px-7 py-3.5 font-medium text-[#f4f5ef] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2e6b3e]"
              >
                Get a free quote
              </a>
              <span className={`text-sm ${muted}`}>Quotes back same day</span>
            </div>
          </Rise>
        </div>
        <Rise delay={0.15} className="relative">
          {/* the yard scene leans out of its frame instead of sitting in a box */}
          <div className="relative h-72 overflow-hidden rounded-[2.5rem] bg-[#cfe3f5] md:h-96 md:rotate-1">
            <div className="absolute right-8 top-8">
              <Sun />
            </div>
            <Cloud className="lawn-cloud-a absolute left-6 top-10 w-24" />
            <Cloud className="lawn-cloud-b absolute right-24 top-20 w-16 opacity-70" />
            <Hills />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -left-6 hidden rounded-full bg-[#f3d27a] px-5 py-3 text-sm font-semibold shadow-lg md:block md:-rotate-3"
          >
            Mowing since sunrise
          </div>
        </Rise>
      </section>

      {/* trust ticker */}
      <div className="bg-[#1e4d2b] py-3.5 text-[#f4f5ef]">
        <Marquee label="Why homeowners pick us" duration={26} className="text-sm">
          {["Fully insured", "Same crew every week", "No contracts", "Skip anytime by text", "Quotes back same day"].map(
            (t) => (
              <span key={t} className="inline-flex items-center">
                <span className="px-6">{t}</span>
                <span aria-hidden="true" className="text-[#f3d27a]">✦</span>
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* services — one lead panel, two offset cards, nothing identical */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <Rise>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            What we do
          </h2>
        </Rise>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          <Rise className="md:col-span-3">
            <div className="flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-[#1e4d2b] p-8 text-[#f4f5ef] transition-transform duration-300 hover:-translate-y-1 md:p-10">
              <div>
                <h3 className="text-2xl font-semibold">{services[0].name}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#f4f5ef]/75">
                  {services[0].copy}
                </p>
              </div>
              <p className="mt-10 font-display text-2xl text-[#f3d27a]">
                {services[0].price}
              </p>
            </div>
          </Rise>
          <div className="grid gap-6 md:col-span-2">
            {services.slice(1).map((s, i) => (
              <Rise key={s.name} delay={0.1 + i * 0.08}>
                <div className="rounded-[2rem] bg-white p-7 transition-transform duration-300 hover:-translate-y-1">
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{s.copy}</p>
                  <p className="mt-6 text-sm font-medium text-[#1e4d2b]">{s.price}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* how it works — numbered path, not a card row */}
      <section className="border-t border-[#18241a]/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <Rise>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              How it works
            </h2>
          </Rise>
          <ol className="mt-12 grid gap-12 md:grid-cols-3">
            {steps.map(([title, copy], i) => (
              <Rise key={title} delay={i * 0.1}>
                <li className={i === 1 ? "md:translate-y-8" : ""}>
                  <span className="font-display text-6xl text-[#1e4d2b]/30">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className={`mt-2 max-w-xs text-sm leading-relaxed ${muted}`}>
                    {copy}
                  </p>
                </li>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      {/* quote band */}
      <section id="lawn-quote" className="relative overflow-hidden bg-[#1e4d2b] text-[#f4f5ef]">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2e6b3e]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#235633]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <Rise>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Get your free quote{" "}
              <em className="font-display font-normal text-[#f3d27a]">tonight.</em>
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mx-auto mt-5 max-w-md text-[#f4f5ef]/70">
              Text a photo of your yard to (516) 555-0148 or tap below; we reply
              the same day with a real price.
            </p>
            <a
              href="#lawn-quote"
              className="mt-8 inline-block rounded-full bg-[#f4f5ef] px-8 py-4 font-medium text-[#1e4d2b] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
            >
              Text us a photo
            </a>
          </Rise>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
        <span className="text-sm font-semibold">Fresh Cut Lawn Co.</span>
        <span className={`text-sm ${muted}`}>
          Nassau County, NY · (516) 555-0148
        </span>
      </footer>
    </div>
  );
}
