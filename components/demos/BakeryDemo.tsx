// Style demo: a neighborhood bakery homepage. "Golden Hour Bakehouse" is a
// sample brand for the demo, not a client. Self-contained: every color is
// local.

const ink = "text-[#3c2a18]";
const muted = "text-[#8c7a64]";

// rising loaf with scored top
function Loaf() {
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
      <ellipse cx="150" cy="150" rx="120" ry="48" fill="#b9854c" />
      <ellipse cx="150" cy="120" rx="110" ry="62" fill="#d9a868" />
      <path d="M90 100 Q 150 70 210 100" stroke="#f4e3c8" strokeWidth="5" fill="none" />
      <path d="M100 125 Q 150 98 200 125" stroke="#f4e3c8" strokeWidth="5" fill="none" />
      {/* steam */}
      <path d="M120 52 q 6 -12 0 -22 M150 46 q 6 -12 0 -22 M180 52 q 6 -12 0 -22" stroke="#c9b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const menu = [
  ["Sourdough loaf", "Levain, 36-hour ferment. Out of the oven at 7am.", "$9"],
  ["Morning buns", "Cardamom sugar, croissant dough. Gone by 10 most days.", "$5"],
  ["Seeded rye", "Dense, dark, keeps all week. Toast it.", "$10"],
  ["Chocolate chip cookie", "Brown butter, flaky salt. Bigger than it needs to be.", "$4"],
  ["Focaccia square", "Rosemary and olive oil, baked in sheets all morning.", "$6"],
  ["Birthday cake (whole)", "Vanilla or chocolate, order two days ahead.", "from $48"],
];

export function BakeryDemo() {
  return (
    <div className={`bg-[#f7eedd] ${ink} antialiased`}>
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <span className="text-lg font-bold tracking-tight">
          Golden Hour Bakehouse
        </span>
        <nav className="flex items-center gap-6">
          <span className={`hidden text-sm sm:block ${muted}`}>
            Wed–Sun · 7am until sold out
          </span>
          <a
            href="#bake-order"
            className="rounded-lg bg-[#3c2a18] px-5 py-2.5 text-sm font-medium text-[#f7eedd] transition-colors duration-200 hover:bg-[#b9854c]"
          >
            Order ahead
          </a>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:px-10 md:pb-24">
        <div>
          <p className={`text-sm font-medium uppercase tracking-widest ${muted}`}>
            Bakery · Sayville
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
            Baked at 4am.
            <br />
            <span className="text-[#b9854c]">Gone by noon.</span>
          </h1>
          <p className={`mt-6 max-w-md text-lg ${muted}`}>
            Sourdough, morning buns, and one very good cookie — baked in small
            batches every morning. When the case is empty, that&apos;s the day.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#bake-order"
              className="rounded-lg bg-[#3c2a18] px-7 py-3.5 font-medium text-[#f7eedd] transition-colors duration-200 hover:bg-[#b9854c]"
            >
              Order ahead
            </a>
            <span className={`text-sm ${muted}`}>Pickup from 7am</span>
          </div>
        </div>
        <div className="h-64 rounded-3xl bg-[#efdfc2] p-6 md:h-80">
          <Loaf />
        </div>
      </section>

      {/* menu */}
      <section className="border-t border-[#3c2a18]/10 bg-[#fdf8ec]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            The daily case
          </h2>
          <p className={`mt-3 max-w-md text-sm ${muted}`}>
            What&apos;s here most days. Follow the morning post for specials —
            and for the bad news when the buns sell out.
          </p>
          <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
            {menu.map(([name, copy, price]) => (
              <li
                key={name}
                className="flex items-baseline justify-between gap-6 border-b border-[#3c2a18]/10 py-5"
              >
                <div>
                  <h3 className="font-bold">{name}</h3>
                  <p className={`mt-1 text-sm ${muted}`}>{copy}</p>
                </div>
                <span className="shrink-0 font-medium text-[#b9854c]">{price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* order band */}
      <section id="bake-order" className="bg-[#3c2a18] text-[#f7eedd]">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Skip the line, not the bread.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[#f7eedd]/70">
            Order by 8pm and your bag is on the shelf with your name on it the
            next morning. Cakes need two days&apos; notice.
          </p>
          <a
            href="#bake-order"
            className="mt-8 inline-block rounded-lg bg-[#d9a868] px-8 py-4 font-medium text-[#3c2a18] transition-colors duration-200 hover:bg-[#f7eedd]"
          >
            Place an order
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 md:px-10">
        <span className="text-sm font-bold">Golden Hour Bakehouse</span>
        <span className={`text-sm ${muted}`}>
          22 Main St, Sayville, NY · Wed–Sun from 7am
        </span>
      </footer>
    </div>
  );
}
