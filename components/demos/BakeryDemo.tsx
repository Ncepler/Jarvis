// Style demo: a neighborhood bakery homepage. "Golden Hour Bakehouse" is a
// sample brand for the demo, not a client. Self-contained: every color is
// local.

import { Marquee, Rise } from "./shared";

const ink = "text-[#3c2a18]";
const muted = "text-[#8c7a64]";

// rising loaf with scored top and looping steam
function Loaf() {
  return (
    <svg viewBox="0 0 300 200" className="h-full w-full" aria-hidden="true">
      <ellipse cx="150" cy="150" rx="120" ry="48" fill="#b9854c" />
      <ellipse cx="150" cy="120" rx="110" ry="62" fill="#d9a868" />
      <path d="M90 100 Q 150 70 210 100" stroke="#f4e3c8" strokeWidth="5" fill="none" />
      <path d="M100 125 Q 150 98 200 125" stroke="#f4e3c8" strokeWidth="5" fill="none" />
      {/* steam — rises and fades on a loop */}
      <style>{`
        @keyframes bake-steam {
          from { transform: translateY(6px); opacity: 0.25; }
          60% { opacity: 1; }
          to { transform: translateY(-8px); opacity: 0; }
        }
        .bake-steam { animation: bake-steam 2.8s ease-out infinite; }
        @keyframes bake-spin {
          to { transform: rotate(360deg); }
        }
        .bake-badge {
          transform-origin: center;
          animation: bake-spin 18s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bake-steam, .bake-badge { animation: none; }
        }
      `}</style>
      <path className="bake-steam" d="M120 52 q 6 -12 0 -22" stroke="#c9b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path className="bake-steam" style={{ animationDelay: "0.9s" }} d="M150 46 q 6 -12 0 -22" stroke="#c9b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path className="bake-steam" style={{ animationDelay: "1.7s" }} d="M180 52 q 6 -12 0 -22" stroke="#c9b8a0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// rotating stamp — text on a circle, classic bakery-window sticker
function FreshBadge() {
  return (
    <svg viewBox="0 0 120 120" className="bake-badge h-24 w-24 md:h-28 md:w-28" aria-hidden="true">
      <defs>
        <path
          id="bake-circle"
          d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
        />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#3c2a18" />
      <circle cx="60" cy="60" r="30" fill="#d9a868" />
      <text fill="#f7eedd" fontSize="11" letterSpacing="2.2" fontWeight="bold">
        <textPath href="#bake-circle">BAKED FRESH DAILY · SINCE 4AM ·</textPath>
      </text>
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

const bakes = ["sourdough", "morning buns", "seeded rye", "focaccia", "cookies", "whole cakes"];

export function BakeryDemo() {
  return (
    <div className={`overflow-hidden bg-[#f7eedd] ${ink} antialiased`}>
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-8 md:grid-cols-2 md:px-10 md:pb-28">
        <div>
          <Rise>
            <p className={`text-sm font-medium uppercase tracking-widest ${muted}`}>
              Bakery · Sayville
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
              Baked at 4am.
              <br />
              <span className="text-[#b9854c]">Gone by noon.</span>
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className={`mt-6 max-w-md text-lg ${muted}`}>
              Sourdough, morning buns, and one very good cookie, baked in small
              batches every morning. When the case is empty, that&apos;s the day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#bake-order"
                className="rounded-lg bg-[#3c2a18] px-7 py-3.5 font-medium text-[#f7eedd] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b9854c]"
              >
                Order ahead
              </a>
              <span className={`text-sm ${muted}`}>Pickup from 7am</span>
            </div>
          </Rise>
        </div>
        <Rise delay={0.15} className="relative">
          <div className="h-64 rounded-[3rem] bg-[#efdfc2] p-6 md:h-80 md:rotate-1">
            <Loaf />
          </div>
          <div className="absolute -bottom-8 -left-4 md:-left-8">
            <FreshBadge />
          </div>
        </Rise>
      </section>

      {/* daily bake ticker */}
      <div className="bg-[#3c2a18] py-3.5 text-[#f7eedd]">
        <Marquee label="Today's bake" duration={24} className="text-sm font-medium">
          {bakes.map((t) => (
            <span key={t} className="inline-flex items-center">
              <span className="px-6">{t}</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#d9a868]" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* menu */}
      <section className="bg-[#fdf8ec]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <Rise>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              The daily case
            </h2>
            <p className={`mt-3 max-w-md text-sm ${muted}`}>
              What&apos;s here most days. Follow the morning post for specials,
              and for the bad news when the buns sell out.
            </p>
          </Rise>
          <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
            {menu.map(([name, copy, price], i) => (
              <Rise key={name} delay={Math.min(i * 0.06, 0.3)}>
                <li className="group flex items-baseline justify-between gap-6 border-b border-[#3c2a18]/10 py-5">
                  <div className="transition-transform duration-300 md:group-hover:translate-x-2">
                    <h3 className="font-bold">{name}</h3>
                    <p className={`mt-1 text-sm ${muted}`}>{copy}</p>
                  </div>
                  <span className="shrink-0 font-medium text-[#b9854c]">{price}</span>
                </li>
              </Rise>
            ))}
          </ul>
        </div>
      </section>

      {/* order band */}
      <section id="bake-order" className="relative overflow-hidden bg-[#3c2a18] text-[#f7eedd]">
        <div
          aria-hidden="true"
          className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#b9854c]/25"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[#d9a868]/15"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-center md:px-10 md:py-24">
          <Rise>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Skip the line, not the bread.
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mx-auto mt-5 max-w-md text-[#f7eedd]/70">
              Order by 8pm and your bag is on the shelf with your name on it the
              next morning. Cakes need two days&apos; notice.
            </p>
            <a
              href="#bake-order"
              className="mt-8 inline-block rounded-lg bg-[#d9a868] px-8 py-4 font-medium text-[#3c2a18] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7eedd]"
            >
              Place an order
            </a>
          </Rise>
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
