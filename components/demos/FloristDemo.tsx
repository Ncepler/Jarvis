// Style demo: a flower-shop homepage. "Wildstem Florals" is a sample brand
// for the demo, not a client. Self-contained: every color is local.

const ink = "text-[#42252e]";
const muted = "text-[#8a6b72]";

// loose stem arrangement — abstract blooms
function Stems() {
  return (
    <svg
      viewBox="0 0 300 340"
      className="florist-stems h-full w-full"
      aria-hidden="true"
    >
      <style>{`
        @keyframes florist-sway {
          to { transform: rotate(1.6deg); }
        }
        .florist-stems {
          transform-origin: 50% 100%;
          animation: florist-sway 5.5s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .florist-stems { animation: none; }
        }
      `}</style>
      <path d="M150 330 C 150 240 130 200 105 150" stroke="#5d7556" strokeWidth="3" fill="none" />
      <path d="M150 330 C 150 250 165 210 190 130" stroke="#5d7556" strokeWidth="3" fill="none" />
      <path d="M150 330 C 150 260 148 220 150 180" stroke="#5d7556" strokeWidth="3" fill="none" />
      <circle cx="103" cy="138" r="26" fill="#d8a7a0" />
      <circle cx="192" cy="118" r="32" fill="#c47d86" />
      <circle cx="150" cy="166" r="20" fill="#e7c9b8" />
      <ellipse cx="125" cy="240" rx="22" ry="9" fill="#5d7556" transform="rotate(-30 125 240)" />
      <ellipse cx="175" cy="255" rx="22" ry="9" fill="#5d7556" transform="rotate(28 175 255)" />
    </svg>
  );
}

const offerings = [
  {
    name: "Daily arrangements",
    copy: "Whatever came in beautiful that morning, arranged loose and seasonal. No two alike.",
    price: "from $35",
  },
  {
    name: "Weddings & events",
    copy: "From two table arrangements to the whole room. We design around your venue, not a catalog.",
    price: "by consultation",
  },
  {
    name: "Weekly flowers",
    copy: "A standing order for your home, restaurant, or office. Fresh every week, no reordering.",
    price: "from $30 / week",
  },
];

export function FloristDemo() {
  return (
    <div className={`bg-[#faf5ef] ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="font-display text-xl italic tracking-tight">
          Wildstem Florals
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>(516) 555-0167</span>
          <a
            href="#florist-order"
            className="rounded-full bg-[#42252e] px-5 py-2.5 text-sm text-[#faf5ef] transition-colors duration-200 hover:bg-[#c47d86]"
          >
            Order flowers
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-[1.2fr_1fr] md:px-10 md:pb-24">
        <div>
          <p className={`text-sm uppercase tracking-widest ${muted}`}>
            Flower shop · Rockville Centre
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Flowers that look{" "}
            <em className="text-[#c47d86]">picked, not produced.</em>
          </h1>
          <p className={`mt-6 max-w-md text-lg ${muted}`}>
            Seasonal stems, arranged the morning you order them. Walk in, call
            ahead, or set up weekly flowers for the house.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#florist-order"
              className="rounded-full bg-[#42252e] px-7 py-3.5 text-[#faf5ef] transition-colors duration-200 hover:bg-[#c47d86]"
            >
              Order for pickup
            </a>
            <span className={`text-sm ${muted}`}>Same-day until 2pm</span>
          </div>
        </div>
        <div className="h-72 rounded-t-full bg-[#f0e3d8] md:h-96">
          <Stems />
        </div>
      </section>

      {/* offerings */}
      <section className="border-t border-[#42252e]/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl">What we make</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {offerings.map((o) => (
              <div key={o.name} className="rounded-2xl bg-white/70 p-7">
                <h3 className="font-display text-xl">{o.name}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{o.copy}</p>
                <p className="mt-6 text-sm font-medium text-[#c47d86]">{o.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* wedding band */}
      <section className="bg-[#42252e] text-[#faf5ef]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Getting married?{" "}
              <em className="text-[#d8a7a0]">Let&apos;s talk flowers early.</em>
            </h2>
            <p className="mt-5 text-[#faf5ef]/70">
              The best dates book a season out. Tell us the venue and the
              month, and we&apos;ll bring ideas to a first call. No
              commitment, no mood-board fee.
            </p>
            <a
              href="#florist-order"
              className="mt-8 inline-block rounded-full bg-[#faf5ef] px-7 py-3.5 text-[#42252e] transition-colors duration-200 hover:bg-[#d8a7a0]"
            >
              Start a wedding inquiry
            </a>
          </div>
        </div>
      </section>

      {/* visit */}
      <section id="florist-order" className="mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
        <h2 className="font-display text-4xl md:text-5xl">Come smell the shop.</h2>
        <p className={`mx-auto mt-5 max-w-md ${muted}`}>
          14 Maple Ave, Rockville Centre · Tue–Sat 9–6, Sun 10–2 · or call
          (516) 555-0167 and we&apos;ll have it wrapped when you arrive.
        </p>
      </section>

      {/* footer */}
      <footer className="border-t border-[#42252e]/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
          <span className="font-display italic">Wildstem Florals</span>
          <span className={`text-sm ${muted}`}>
            Rockville Centre, NY · (516) 555-0167
          </span>
        </div>
      </footer>
    </div>
  );
}
