// Style demo: a simple lawn-care homepage, built as a real component so the
// gallery can render it physically inside the page (no iframe). "Fresh Cut
// Lawn Co." is a sample brand for the demo, not a client. Self-contained:
// every color is local, nothing leaks into the studio site's theme.

const ink = "text-[#18241a]";
const muted = "text-[#5c6b5e]";

function Sun() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16 md:h-24 md:w-24" aria-hidden="true">
      <circle cx="50" cy="50" r="34" fill="#f3d27a" />
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
    copy: "Cut, trimmed, edged, blown clean. Same crew, same day every week.",
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
    <div className={`bg-[#f4f5ef] ${ink} antialiased`}>
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:px-10 md:pb-28">
        <div>
          <p className={`text-sm font-medium uppercase tracking-widest ${muted}`}>
            Lawn care · Nassau County
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Your lawn,{" "}
            <em className="font-display font-normal text-[#1e4d2b]">handled.</em>
          </h1>
          <p className={`mt-6 max-w-md text-lg ${muted}`}>
            Weekly mowing, cleanups, and edging for homes on the South Shore.
            No contracts, no voicemail tag — text a photo, get a price.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#lawn-quote"
              className="rounded-full bg-[#1e4d2b] px-7 py-3.5 font-medium text-[#f4f5ef] transition-colors duration-200 hover:bg-[#2e6b3e]"
            >
              Get a free quote
            </a>
            <span className={`text-sm ${muted}`}>Quotes back same day</span>
          </div>
        </div>
        <div className="relative h-72 overflow-hidden rounded-3xl bg-[#cfe3f5] md:h-96">
          <div className="absolute right-8 top-8">
            <Sun />
          </div>
          <Hills />
        </div>
      </section>

      {/* trust strip */}
      <div className="bg-[#1e4d2b] py-4 text-[#f4f5ef]">
        <p className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-1 px-6 text-sm md:px-10">
          <span>Fully insured</span>
          <span>Same crew every week</span>
          <span>No contracts</span>
          <span>Skip anytime by text</span>
        </p>
      </div>

      {/* services */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What we do
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.name} className="rounded-2xl bg-white p-7">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{s.copy}</p>
              <p className="mt-6 text-sm font-medium text-[#1e4d2b]">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="border-t border-[#18241a]/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map(([title, copy], i) => (
              <li key={title}>
                <span className="font-display text-4xl text-[#1e4d2b]">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* quote band */}
      <section id="lawn-quote" className="bg-[#1e4d2b] text-[#f4f5ef]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Get your free quote{" "}
            <em className="font-display font-normal text-[#f3d27a]">tonight.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[#f4f5ef]/70">
            Text a photo of your yard to (516) 555-0148 or tap below — we reply
            the same day with a real price.
          </p>
          <a
            href="#lawn-quote"
            className="mt-8 inline-block rounded-full bg-[#f4f5ef] px-8 py-4 font-medium text-[#1e4d2b] transition-colors duration-200 hover:bg-white"
          >
            Text us a photo
          </a>
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
