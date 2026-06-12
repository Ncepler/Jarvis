// Style demo: a power-washing homepage. "Tide Line Power Washing" is a
// sample brand for the demo, not a client. Self-contained: every color is
// local, nothing leaks into the studio site's theme.

"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Marquee, Rise } from "./shared";

const ink = "text-[#0e2233]";
const muted = "text-[#56707f]";

// TODO(asset): full-bleed pressure-washing clip behind the hero, supplied
// later. When it lands, move the <video> into a small client component so
// autoplay can be gated behind prefers-reduced-motion (see
// components/sections/HeroVideo.tsx for the pattern).
const HERO_VIDEO: { src: string; poster: string } | null = null;

// The hero loads genuinely dirty — grime blobs over a sepia tint — then a
// spray wedge sweeps left to right and cuts the dirty layer away in its wake.
// Gated on useInView (once), not mount: mount-time playback finished before
// anyone scrolled down to the gallery, so nobody ever saw it. Plays once;
// the overlay unmounts after the sweep so the backdrop-filter stops costing.
const DIRT_BLOBS = [
  { left: "4%", top: "12%", w: 220, h: 130, c: "rgba(70,55,40,0.55)", blur: 5 },
  { left: "18%", top: "55%", w: 280, h: 160, c: "rgba(62,52,44,0.5)", blur: 6 },
  { left: "31%", top: "8%", w: 140, h: 90, c: "rgba(80,66,50,0.45)", blur: 3 },
  { left: "42%", top: "38%", w: 300, h: 170, c: "rgba(58,50,45,0.6)", blur: 6 },
  { left: "55%", top: "70%", w: 180, h: 110, c: "rgba(75,60,42,0.5)", blur: 4 },
  { left: "63%", top: "16%", w: 240, h: 140, c: "rgba(66,58,50,0.55)", blur: 5 },
  { left: "76%", top: "48%", w: 200, h: 130, c: "rgba(72,56,40,0.45)", blur: 4 },
  { left: "86%", top: "10%", w: 120, h: 80, c: "rgba(82,70,55,0.4)", blur: 2 },
  { left: "9%", top: "80%", w: 160, h: 90, c: "rgba(60,52,46,0.5)", blur: 4 },
  { left: "48%", top: "2%", w: 100, h: 60, c: "rgba(78,64,48,0.4)", blur: 3 },
  { left: "70%", top: "82%", w: 240, h: 120, c: "rgba(64,54,44,0.55)", blur: 5 },
  { left: "90%", top: "62%", w: 150, h: 100, c: "rgba(74,60,46,0.45)", blur: 3 },
];

function WashReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!inView) return;
    // 0.8s hold + 2.5s sweep + slack, then drop the overlay for good
    const t = setTimeout(() => setDone(true), 3600);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <div ref={ref} className={`relative${inView ? " pw-washed" : ""}`}>
      {children}
      {!done && (
        <>
          {/* the dirty layer — clip-path cuts it away behind the wedge */}
          <div aria-hidden="true" className="pw-dirt absolute inset-0 z-10">
            {DIRT_BLOBS.map((b, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: b.left,
                  top: b.top,
                  width: b.w,
                  height: b.h,
                  background: `radial-gradient(ellipse at center, ${b.c}, transparent 70%)`,
                  filter: `blur(${b.blur}px)`,
                }}
              />
            ))}
          </div>
          {/* the spray wedge riding the leading edge of the reveal */}
          <div aria-hidden="true" className="pw-wedge-wrap pointer-events-none absolute inset-0 z-10">
            <div className="pw-wedge" />
          </div>
        </>
      )}
    </div>
  );
}

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

// before/after that wipes itself — the clean layer's clip-path travels
// across and back on a slow loop
function WipeReveal() {
  return (
    <div className="relative h-52 overflow-hidden md:h-72">
      <style>{`
        @keyframes pw-wipe {
          0%, 8% { clip-path: inset(0 86% 0 0); }
          46%, 58% { clip-path: inset(0 10% 0 0); }
          92%, 100% { clip-path: inset(0 86% 0 0); }
        }
        .pw-wipe { animation: pw-wipe 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pw-wipe { animation: none; clip-path: inset(0 50% 0 0); }
        }
      `}</style>
      {/* before: grimy */}
      <div className="absolute inset-0 bg-[#7a8289]">
        <div aria-hidden="true" className="absolute left-[12%] top-[30%] h-16 w-24 rounded-full bg-[#5f666c] opacity-70" />
        <div aria-hidden="true" className="absolute right-[18%] top-[55%] h-12 w-32 rounded-full bg-[#646b71] opacity-70" />
        <div aria-hidden="true" className="absolute left-[40%] bottom-[12%] h-10 w-20 rounded-full bg-[#585f65] opacity-60" />
      </div>
      {/* after: clean, wiping over it */}
      <div className="pw-wipe absolute inset-0 border-r-4 border-[#1b9fd8] bg-[#dfe9ef]" />
      <span className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-widest text-white/90">
        Before
      </span>
      <span className={`absolute right-4 top-4 text-xs font-semibold uppercase tracking-widest ${ink}`}>
        After
      </span>
    </div>
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

const towns = ["Sayville", "Patchogue", "Bayport", "Blue Point", "Oakdale", "Bohemia", "Holbrook"];

export function PowerWashDemo() {
  return (
    <div className={`overflow-hidden bg-white ${ink} antialiased`}>
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

      {/* hero — the signature move for this niche: the page itself gets
          power-washed. It loads filthy (dirt blobs + sepia tint over
          everything), holds 0.8s, then a spray wedge sweeps left to right
          over ~2.5s with the dirty layer clipped away in its wake. Both
          clip-path and transform are cheap, off the main thread. Near-linear
          travel (a real wand moves steadily), eased only at the ends.
          Reduced motion never shows the overlay at all. */}
      <section className="relative overflow-hidden bg-[#0e2233] text-white [clip-path:polygon(0_0,100%_0,100%_94%,0_100%)]">
        <style>{`
          .pw-dirt {
            backdrop-filter: sepia(0.5) brightness(0.85) contrast(0.9);
            -webkit-backdrop-filter: sepia(0.5) brightness(0.85) contrast(0.9);
            /* dirty region: left edge at X% (top) / X-8% (bottom), X: 0 → 110.
               Same point count both states so it interpolates. */
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, -8% 100%);
          }
          .pw-wedge-wrap {
            transform: translateX(-30%);
          }
          .pw-wedge {
            position: absolute;
            top: -6%;
            left: 0;
            height: 116%;
            width: 22%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.08) 78%, transparent);
            clip-path: polygon(42% 0%, 100% 100%, 0% 100%);
            filter: blur(8px);
            transform: rotate(12deg);
            transform-origin: 50% 0%;
          }
          .pw-washed .pw-dirt {
            clip-path: polygon(110% 0%, 100% 0%, 100% 100%, 102% 100%);
            transition: clip-path 2.5s cubic-bezier(0.3, 0.05, 0.7, 0.95) 0.8s;
          }
          .pw-washed .pw-wedge-wrap {
            transform: translateX(112%);
            transition: transform 2.5s cubic-bezier(0.3, 0.05, 0.7, 0.95) 0.8s;
          }
          @media (max-width: 640px) {
            .pw-washed .pw-dirt { transition-duration: 2s; }
            .pw-washed .pw-wedge-wrap { transition-duration: 2s; }
          }
          @media (prefers-reduced-motion: reduce) {
            .pw-dirt, .pw-wedge-wrap { display: none; }
          }
        `}</style>
        <WashReveal>
          {/* full-bleed wash footage behind the headline; a stylized scene
              stands in until the clip exists */}
          <div className="absolute inset-0" aria-hidden="true">
            {HERO_VIDEO ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={HERO_VIDEO.src}
                poster={HERO_VIDEO.poster}
                muted
                loop
                playsInline
                preload="none"
                autoPlay
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_15%,rgba(27,159,216,0.35),transparent_60%)]" />
                <div className="absolute -right-12 bottom-0 h-[88%] w-[58%] opacity-50">
                  <HouseWash />
                </div>
              </>
            )}
            {/* keeps the headline readable over whatever plays behind it */}
            <div className="absolute inset-0 bg-linear-to-r from-[#0e2233] via-[#0e2233]/70 to-[#0e2233]/15" />
          </div>

          <div className="relative mx-auto flex min-h-[540px] max-w-6xl flex-col justify-center px-6 py-24 md:min-h-[640px] md:px-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1b9fd8]">
              Power washing · Suffolk County
            </p>
            <h1 className="mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Like the day
              <br />
              it was built.
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Houses, driveways, decks, and fences, washed back to new in one
              visit. Flat quotes, no surprises.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#wash-quote"
                className="bg-[#1b9fd8] px-7 py-3.5 font-semibold uppercase tracking-wide text-[#0e2233] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                Get a free quote
              </a>
              <span className="text-sm text-white/60">Most quotes same day</span>
            </div>
          </div>
        </WashReveal>
      </section>

      {/* town ticker */}
      <div className="border-b border-[#0e2233]/10 py-3.5">
        <Marquee label="Towns we serve" duration={28} className={`text-sm font-semibold uppercase tracking-wide ${ink}`}>
          {towns.map((t) => (
            <span key={t} className="inline-flex items-center">
              <span className="px-6">{t}</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1b9fd8]" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* services — oversized numbered rows, not a card grid */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <Rise>
          <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
            What we wash
          </h2>
        </Rise>
        <div className="mt-10">
          {services.map((s, i) => (
            <Rise key={s.name} delay={i * 0.08}>
              <div className="group grid items-baseline gap-2 border-t border-[#0e2233]/10 py-8 last:border-b md:grid-cols-[80px_1.2fr_2fr_auto] md:gap-6">
                <span className="text-4xl font-bold text-[#1b9fd8]/30 transition-colors duration-300 group-hover:text-[#1b9fd8] md:text-5xl">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-bold transition-transform duration-300 md:group-hover:translate-x-2">
                  {s.name}
                </h3>
                <p className={`max-w-md text-sm leading-relaxed ${muted}`}>{s.copy}</p>
                <p className="text-sm font-bold text-[#1b9fd8]">{s.price}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* before / after */}
      <section className="bg-[#eef5f9]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <Rise>
            <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
              The difference is not subtle
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <div className="mt-10 overflow-hidden">
              <WipeReveal />
            </div>
            <p className={`mt-6 max-w-md text-sm ${muted}`}>
              Same driveway, two hours apart. Send a photo of yours and
              we&apos;ll tell you exactly what it&apos;ll cost.
            </p>
          </Rise>
        </div>
      </section>

      {/* quote band — angled top edge */}
      <section
        id="wash-quote"
        className="bg-[#0e2233] text-white [clip-path:polygon(0_6%,100%_0,100%_100%,0_100%)]"
      >
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-center md:px-10 md:pb-24 md:pt-32">
          <Rise>
            <h2 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">
              Text a photo. <span className="text-[#1b9fd8]">Get a price.</span>
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mx-auto mt-5 max-w-md text-white/70">
              Send a picture of the house or driveway to (631) 555-0192. We
              reply with a flat quote, usually the same day.
            </p>
            <a
              href="#wash-quote"
              className="mt-8 inline-block bg-[#1b9fd8] px-8 py-4 font-semibold uppercase tracking-wide text-[#0e2233] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
            >
              Text us a photo
            </a>
          </Rise>
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
