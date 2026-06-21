"use client";

// Style demo — an auto-body / collision homepage in the graphite-dark,
// motion-heavy "Apex Collision" mood (SKILL §13h + §14d): asphalt-black base,
// cool white text, electric-blue accent with a hot-orange secondary used only
// on urgent CTAs, a tight technical grotesque, and figures/specs set in mono
// for an instrument-readout feel. This is the niche where MOTION IS THE PITCH
// — but every moving part is content (cars, paint, damage, before/after),
// never decoration (§11). Each interactive piece ships a reduced-motion +
// tap (not hover) fallback. "Apex Collision" is a sample brand, not a client.

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Contact,
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoMarquee,
  DemoShell,
  type DemoTheme,
  Eyebrow,
  Faq,
  Intro,
  Rise,
  Section,
  TwoLine,
  WorkGrid,
} from "./system";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ACCENT = "#2FA8FF"; // electric blue — precision / automotive (primary)
const ACCENT2 = "#FF5A2C"; // hot orange — urgent CTAs only, used sparingly
const MONO = "var(--font-mono)"; // figures/estimates/specs — instrument readout

// Graphite-dark auto-body mood (SKILL §13h).
const THEME: DemoTheme = {
  bg: "#0A0C0F", // asphalt black, faint cool blue
  surface: "#12161B", // graphite panel
  fg: "#F4F6F8", // cool white
  body: "#AFB7C0", // cool steel gray
  muted: "#6E7782", // gunmetal gray
  line: "#20262E", // steel hairline
  accent: ACCENT,
  onAccent: "#0A0C0F", // dark text on electric blue
  font: "var(--font-tight)", // tight technical grotesque
  heroScrim: "linear-gradient(180deg, rgba(10,12,15,.35), rgba(10,12,15,.9))",
  breakScrim: "linear-gradient(180deg, rgba(10,12,15,.5), rgba(10,12,15,.92))",
};

const PHONE = "(516) 555-0143";
const NAME = "Apex Collision";
const EMAIL = "hello@apexcollision.demo";

// ── Reusable side-profile car outline (content, not decoration — §14d). ──────
// viewBox 360×170; used by the damage map and the paint matcher.
function CarOutline({
  fill = "transparent",
  stroke = "var(--d-line)",
  transition,
}: {
  fill?: string;
  stroke?: string;
  transition?: string;
}) {
  return (
    <svg viewBox="0 0 360 170" className="h-full w-full" aria-hidden>
      {/* body */}
      <path
        d="M18 120 Q22 96 54 92 L80 92 Q94 62 130 58 L212 58 Q250 60 266 92 L320 96 Q346 100 346 120 L346 128 Q346 134 340 134 L26 134 Q18 134 18 128 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
        style={transition ? { transition } : undefined}
      />
      {/* windows */}
      <path
        d="M96 90 Q108 66 132 64 L168 64 L168 90 Z M178 64 L206 64 Q236 66 250 90 L178 90 Z"
        fill="rgba(47,168,255,0.10)"
        stroke={stroke}
        strokeWidth={1.5}
      />
      {/* wheels */}
      <circle cx="100" cy="134" r="24" fill="var(--d-bg)" stroke={stroke} strokeWidth={2} />
      <circle cx="272" cy="134" r="24" fill="var(--d-bg)" stroke={stroke} strokeWidth={2} />
      <circle cx="100" cy="134" r="10" fill="none" stroke={stroke} strokeWidth={1.5} />
      <circle cx="272" cy="134" r="10" fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

// ── 1. HERO — car reveal with a clear-coat shine sweep. ──────────────────────
function HeroCarReveal() {
  const reduced = useReducedMotion();
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "640px" }}>
      {/* full-bleed media slot (labeled placeholder until a sequence exists) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: "var(--d-surface)" }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--d-muted)" }}
        >
          HERO — car reveal sequence (16:9)
        </span>
      </div>
      {/* clear-coat shine sweep — a glossy highlight travels across on enter */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.35 }}
          style={{
            background:
              "linear-gradient(105deg, transparent 42%, rgba(244,246,248,.16) 50%, rgba(47,168,255,.12) 53%, transparent 62%)",
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0" style={{ background: "var(--d-hero-scrim)" }} />
      <div className="relative mx-auto flex min-h-[640px] w-full max-w-[1200px] flex-col justify-end px-6 pb-16 pt-28 md:px-16">
        <Rise>
          <div className="mb-6">
            <Eyebrow>Collision center · Nassau County</Eyebrow>
          </div>
          <h1
            className="max-w-3xl text-[40px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[72px]"
            style={{ color: "var(--d-fg)" }}
          >
            Wrecked.
            <br />
            Like it never happened.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Collision repair, refinishing, and glass — done to factory spec. We
            handle the insurance claim, you get your car back right.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#apex-contact"
              className="px-6 py-3.5 text-[14px] font-semibold"
              style={{ background: ACCENT2, color: "#0A0C0F" }}
            >
              Get a free estimate
            </a>
            <span
              className="px-6 py-3.5 text-[14px] font-semibold"
              style={{ border: "1px solid var(--d-line)", color: "var(--d-fg)", fontFamily: MONO }}
            >
              Call {PHONE}
            </span>
          </div>
        </Rise>
        <div
          className="mt-14 text-[12px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--d-muted)" }}
        >
          Scroll
        </div>
      </div>
    </section>
  );
}

// ── 2. SERVICES — interactive damage map. The car IS the menu. ───────────────
type Hotspot = {
  key: string;
  panel: string;
  service: string;
  desc: string;
  x: number; // % across the car box
  y: number; // % down the car box
};
const HOTSPOTS: Hotspot[] = [
  {
    key: "bumper",
    panel: "Front bumper",
    service: "Collision repair",
    desc: "Crumpled bumpers and crossmembers straightened, replaced, and refit to factory gaps.",
    x: 9,
    y: 70,
  },
  {
    key: "fender",
    panel: "Fender",
    service: "Dent removal (PDR)",
    desc: "Dings and creases massaged out paintless — no filler, no respray when the paint's intact.",
    x: 26,
    y: 60,
  },
  {
    key: "glass",
    panel: "Windshield & glass",
    service: "Glass & calibration",
    desc: "Glass replaced and ADAS sensors recalibrated so lane-keep and braking read true.",
    x: 40,
    y: 40,
  },
  {
    key: "door",
    panel: "Door",
    service: "Auto painting & refinishing",
    desc: "Color-matched in a downdraft booth so the repair disappears into the panel.",
    x: 49,
    y: 64,
  },
  {
    key: "quarter",
    panel: "Quarter panel",
    service: "Frame straightening",
    desc: "Unibody pulled back to spec on a laser-measured frame rack.",
    x: 73,
    y: 60,
  },
  {
    key: "rocker",
    panel: "Body & finish",
    service: "Detailing & paint correction",
    desc: "Wash, clay, machine polish — the car leaves looking better than it came in.",
    x: 55,
    y: 82,
  },
];

function DamageMap() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const a = HOTSPOTS[active];
  return (
    <Section>
      <Rise>
        <Eyebrow>What we fix</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Point at the damage." b="We've fixed it before." />
        </div>
      </Rise>
      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1.25fr_1fr] md:gap-14">
        {/* the car + hotspots */}
        <Rise>
          <div className="relative w-full" style={{ aspectRatio: "360/170" }}>
            <CarOutline stroke="var(--d-muted)" />
            {HOTSPOTS.map((h, i) => {
              const on = i === active;
              return (
                <button
                  key={h.key}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-label={`${h.panel} — ${h.service}`}
                  aria-pressed={on}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {/* pulse ring (static on reduced motion) */}
                  {on && !reduced && (
                    <motion.span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ border: `1px solid ${ACCENT}` }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }}
                    />
                  )}
                  <span
                    className="block h-3.5 w-3.5 rounded-full transition-transform duration-200"
                    style={{
                      background: on ? ACCENT : "var(--d-surface)",
                      border: `2px solid ${on ? ACCENT : "var(--d-muted)"}`,
                      transform: on ? "scale(1.15)" : "scale(1)",
                      boxShadow: on ? `0 0 0 4px rgba(47,168,255,.18)` : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>
          {/* tap-list — mobile + reduced-motion path; also the labeled list */}
          <div className="mt-6 flex flex-wrap gap-2">
            {HOTSPOTS.map((h, i) => (
              <button
                key={h.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className="px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  border: `1px solid ${i === active ? ACCENT : "var(--d-line)"}`,
                  color: i === active ? ACCENT : "var(--d-muted)",
                  borderRadius: "var(--d-radius)",
                }}
              >
                {h.panel}
              </button>
            ))}
          </div>
        </Rise>
        {/* the panel that swaps with the active hotspot */}
        <Rise delay={0.1}>
          <div
            className="p-7"
            style={{
              background: "var(--d-surface)",
              border: "1px solid var(--d-line)",
              borderRadius: "var(--d-radius)",
            }}
          >
            <span
              className="text-[13px] font-semibold tracking-[0.1em]"
              style={{ color: "var(--d-accent)", fontFamily: MONO }}
            >
              0{active + 1} / 0{HOTSPOTS.length}
            </span>
            <p
              className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--d-muted)" }}
            >
              {a.panel}
            </p>
            <motion.div key={a.key} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
              <h3 className="mt-2 text-[26px] font-semibold leading-[1.15]" style={{ color: "var(--d-fg)" }}>
                {a.service}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {a.desc}
              </p>
            </motion.div>
            <a
              href="#apex-contact"
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold"
              style={{ color: "var(--d-accent)" }}
            >
              Get this looked at →
            </a>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// ── 3. TRANSFORMATION — full-bleed draggable before/after slider. ────────────
function BeforeAfter() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  const Slot = ({ label, when }: { label: string; when: string }) => (
    <div className="flex h-full w-full items-center justify-center" style={{ background: "var(--d-surface)" }}>
      <div className="text-center">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--d-muted)" }}>
          {label}
        </span>
        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-line)" }}>
          {when}
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full" style={{ borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-[80px] md:px-16 md:py-[120px]">
        <Rise>
          <Eyebrow>The transformation</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Same car." b="You'd never know." />
          </div>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            Drag the handle. Wrecked on one side, back to factory on the other —
            that gap is the whole job.
          </p>
        </Rise>

        {reduced ? (
          // reduced-motion: show both stills side by side, no drag
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div style={{ aspectRatio: "16/9", border: "1px solid var(--d-line)" }}>
              <Slot label="BEFORE — collision" when="(16:9)" />
            </div>
            <div style={{ aspectRatio: "16/9", border: "1px solid var(--d-line)" }}>
              <Slot label="AFTER — restored" when="(16:9)" />
            </div>
          </div>
        ) : (
          <Rise delay={0.1}>
            <div
              ref={wrapRef}
              className="relative mt-10 w-full touch-none select-none overflow-hidden"
              style={{ aspectRatio: "16/9", border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)", cursor: "ew-resize" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            >
              {/* BEFORE (under) */}
              <div className="absolute inset-0">
                <Slot label="BEFORE — collision" when="(16:9)" />
              </div>
              {/* AFTER (over), clipped to the handle */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <Slot label="AFTER — restored" when="(16:9)" />
              </div>
              {/* labels */}
              <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
                Before
              </span>
              <span className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
                After
              </span>
              {/* handle */}
              <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
                <div className="h-full" style={{ width: 2, background: ACCENT }} />
                <div
                  className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-bold"
                  style={{ background: ACCENT, color: "#0A0C0F" }}
                >
                  ⇄
                </div>
              </div>
              {/* a11y / keyboard control */}
              <label className="sr-only" htmlFor="apex-ba">Reveal amount</label>
              <input
                id="apex-ba"
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
              />
            </div>
          </Rise>
        )}
      </div>
    </section>
  );
}

// ── 4. PAINT & COLOR MATCH — live color picker tints the car. ────────────────
const PAINTS = [
  { name: "Midnight Black", hex: "#15171A" },
  { name: "Storm Gray", hex: "#5A626B" },
  { name: "Silver Flake", hex: "#B9C0C7" },
  { name: "Apex Blue", hex: "#2FA8FF" },
  { name: "Carbon Red", hex: "#B5202A" },
  { name: "Sunset Orange", hex: "#FF5A2C" },
  { name: "British Green", hex: "#2E5D45" },
  { name: "Pearl White", hex: "#E7EAEC" },
];

function PaintMatch() {
  const reduced = useReducedMotion();
  const [paint, setPaint] = useState(3); // Apex Blue
  const p = PAINTS[paint];
  return (
    <Section dark>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
        <Rise>
          <Eyebrow>Paint & color match</Eyebrow>
          <div className="mt-5">
            <TwoLine a="Any color." b="Matched to the panel." />
          </div>
          <p className="mt-6 max-w-md text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            We scan the existing paint and mix to it, then blend into the
            surrounding panels so the repair vanishes. Tap a swatch to preview.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {PAINTS.map((sw, i) => (
              <button
                key={sw.hex}
                type="button"
                onClick={() => setPaint(i)}
                aria-label={sw.name}
                aria-pressed={i === paint}
                className="h-9 w-9 rounded-full transition-transform duration-200"
                style={{
                  background: sw.hex,
                  outline: i === paint ? `2px solid ${ACCENT}` : "1px solid var(--d-line)",
                  outlineOffset: 2,
                  transform: i === paint ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <p className="mt-5 text-[13px]" style={{ color: "var(--d-muted)" }}>
            <span style={{ color: "var(--d-fg)" }}>{p.name}</span>{" "}
            <span style={{ fontFamily: MONO }}>{p.hex.toUpperCase()}</span>
          </p>
        </Rise>
        <Rise delay={0.1}>
          <div
            className="flex items-center justify-center p-6"
            style={{ background: "var(--d-bg)", border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)", aspectRatio: "360/200" }}
          >
            <CarOutline
              fill={p.hex}
              stroke="rgba(244,246,248,.35)"
              transition={reduced ? undefined : "fill .4s ease"}
            />
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// ── 5. ESTIMATE WIDGET — "get a ballpark," live mono range. ──────────────────
const SIZES = [
  { label: "Sedan / Coupe", mult: 1 },
  { label: "SUV / Crossover", mult: 1.25 },
  { label: "Truck / Van", mult: 1.4 },
];
const AREAS = [
  { label: "Bumper", base: 600 },
  { label: "Door / Fender", base: 950 },
  { label: "Quarter panel", base: 1350 },
  { label: "Multiple panels", base: 2400 },
];
const SEVERITIES = [
  { label: "Minor", mult: 0.8 },
  { label: "Moderate", mult: 1.15 },
  { label: "Heavy", mult: 1.6 },
];
const fmt = (n: number) => "$" + (Math.round(n / 50) * 50).toLocaleString();

function EstimateWidget() {
  const [size, setSize] = useState(0);
  const [area, setArea] = useState(0);
  const [sev, setSev] = useState(1);
  const center = AREAS[area].base * SIZES[size].mult * SEVERITIES[sev].mult;
  const low = fmt(center * 0.85);
  const high = fmt(center * 1.25);

  const Row = ({
    title,
    options,
    value,
    onPick,
  }: {
    title: string;
    options: { label: string }[];
    value: number;
    onPick: (i: number) => void;
  }) => (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
        {title}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={i === value}
            className="px-3.5 py-2 text-[13px] font-semibold transition-colors"
            style={{
              background: i === value ? "var(--d-accent)" : "transparent",
              color: i === value ? "var(--d-onaccent)" : "var(--d-body)",
              border: `1px solid ${i === value ? "var(--d-accent)" : "var(--d-line)"}`,
              borderRadius: "var(--d-radius)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Section>
      <Rise>
        <Eyebrow>Get a ballpark</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Rough number," b="before you come in." />
        </div>
      </Rise>
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_0.8fr] md:gap-14">
        <Rise>
          <div className="space-y-6">
            <Row title="Vehicle" options={SIZES} value={size} onPick={setSize} />
            <Row title="Damage area" options={AREAS} value={area} onPick={setArea} />
            <Row title="Severity" options={SEVERITIES} value={sev} onPick={setSev} />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div
            className="flex h-full flex-col justify-between p-7"
            style={{ background: "var(--d-surface)", border: "1px solid var(--d-line)", borderRadius: "var(--d-radius)" }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--d-muted)" }}>
                Estimated range
              </p>
              <p className="mt-3 text-[36px] font-bold leading-none md:text-[44px]" style={{ color: "var(--d-fg)", fontFamily: MONO }}>
                {low}
                <span style={{ color: "var(--d-muted)" }}> – </span>
                {high}
              </p>
              <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
                Rough estimate, not a quote. Real number after we see the car.
              </p>
            </div>
            <a
              href="#apex-contact"
              className="mt-7 inline-block px-6 py-3.5 text-center text-[14px] font-semibold"
              style={{ background: ACCENT2, color: "#0A0C0F" }}
            >
              Get this in writing →
            </a>
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// ── 6. VALUE PROPS — spec-readout strip (mono figures), not a numbered list. ─
const SPECS = [
  { fig: "$0", label: "Written estimate", desc: "A real number on paper before any work starts." },
  { fig: "1", label: "Claim, handled", desc: "We deal with the adjuster and the paperwork, not you." },
  { fig: "∞", label: "Paint warranty", desc: "Our refinishing is guaranteed for as long as you own it." },
  { fig: "OEM", label: "Quality parts", desc: "Parts that match how the car left the factory." },
];

function SpecStrip() {
  return (
    <Section dark>
      <Rise>
        <Eyebrow>Why bring it here</Eyebrow>
        <div className="mt-5">
          <TwoLine a="The fine print," b="up front." />
        </div>
      </Rise>
      <div
        className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
        style={{ background: "var(--d-line)", border: "1px solid var(--d-line)" }}
      >
        {SPECS.map((s, i) => (
          <Rise key={s.label} delay={Math.min(i * 0.06, 0.24)}>
            <div className="h-full p-7" style={{ background: "var(--d-bg)" }}>
              <p className="text-[34px] font-bold leading-none" style={{ color: "var(--d-accent)", fontFamily: MONO }}>
                {s.fig}
              </p>
              <h3 className="mt-4 text-[18px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {s.label}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {s.desc}
              </p>
            </div>
          </Rise>
        ))}
      </div>
      {/* honest cert placeholder — never a faked credential (§12) */}
      <Rise delay={0.1}>
        <div className="mt-6 flex flex-wrap gap-3">
          {["CERT — I-CAR (placeholder)", "CERT — manufacturer (placeholder)"].map((c) => (
            <span
              key={c}
              className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--d-muted)", border: "1px dashed var(--d-line)", borderRadius: "var(--d-radius)" }}
            >
              {c}
            </span>
          ))}
        </div>
      </Rise>
    </Section>
  );
}

// ── Spine data ───────────────────────────────────────────────────────────────
const WORK = [
  { tag: "Collision", caption: "Front-end collision — bumper & hood rebuilt" },
  { tag: "Paint", caption: "Full panel respray, color-matched" },
  { tag: "Dent", caption: "Door crease pulled paintless (PDR)" },
  { tag: "Frame", caption: "Unibody pulled back to spec" },
  { tag: "Glass", caption: "Windshield swap & ADAS recalibration" },
  { tag: "Detail", caption: "Paint correction & ceramic finish" },
];

const FAQ = [
  { q: "What areas do you serve?", a: "All of Nassau County — Hicksville, Levittown, Bethpage, Plainview, Westbury, Syosset, and nearby towns." },
  { q: "Do you work with my insurance?", a: "Yes. We work with every major carrier, handle the claim directly with your adjuster, and keep you out of the back-and-forth." },
  { q: "Do you offer loaner cars?", a: "We keep a few loaners on hand and can help set up a rental through your claim. Ask when you drop the car off." },
  { q: "How long will my repair take?", a: "A bumper or small panel is usually a few days; heavier collision and frame work runs one to two weeks. You get a real timeline at drop-off." },
  { q: "Is your work guaranteed?", a: "Our paint and refinishing carry a lifetime warranty for as long as you own the vehicle, and body and structural repairs are guaranteed too." },
  { q: "Do you give free estimates?", a: "Always. Bring the car by or send photos and we'll write up a free estimate — no obligation." },
];

export function AutoBodyDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Free estimate" />
      <HeroCarReveal />
      <DemoMarquee terms={["Collision", "Paint", "Dents", "Frame", "Glass", "Detailing"]} />
      <Intro
        eyebrow="Who we are"
        line1="Back to factory."
        line2="Claim and all."
        paragraphs={[
          "A collision shop is mostly about two things: getting the car right, and not making the claim your problem. We do both.",
          "Apex repairs, refinishes, and reglasses every make in Hicksville — laser-measured frames, booth-baked paint, and an estimate you can read.",
        ]}
        badges={[
          ["Collision to refinishing", "Full service"],
          ["We handle the claim", "Insurance"],
          ["Lifetime paint warranty", "Guaranteed"],
          ["Free written estimates", "No pressure"],
        ]}
      />
      <DamageMap />
      <BeforeAfter />
      <PaintMatch />
      <WorkGrid eyebrow="Recent work" line1="In the booth," line2="and back out." items={WORK} />
      <EstimateWidget />
      <SpecStrip />
      <Faq eyebrow="Questions" line1="The stuff" line2="people ask." items={FAQ} />
      <div id="apex-contact">
        <Contact
          eyebrow="Free estimate"
          line1="Send us the damage."
          line2="We'll handle it."
          copy="Call, text photos, or fill out the form. We'll write up a free estimate and walk the claim with you. Usually same-day."
          phone={PHONE}
          email={EMAIL}
          location="Hicksville, Nassau County, NY"
          serviceLabel="What happened"
          serviceOptions={[
            "Collision repair",
            "Auto painting & refinishing",
            "Dent removal (PDR)",
            "Frame straightening",
            "Glass & calibration",
            "Detailing",
            "Not sure yet",
          ]}
          vehicleFields
          claimToggle
        />
      </div>
      <CtaBand line1="Wrecked?" line2="Let's make it disappear." cta="Get a free estimate" phone={PHONE} />
      <DemoFooter
        name={NAME}
        descriptor="Collision repair, refinishing, and glass — insurance claims handled."
        area="Serving Nassau County, Long Island"
        services={["Collision repair", "Auto painting & refinishing", "Dent removal (PDR)", "Frame & glass"]}
        phone={PHONE}
        email={EMAIL}
        location="Hicksville, Nassau County, NY"
        hours="Mon–Fri 8am–6pm · Sat 9am–1pm"
        strip="Free Estimates · Insurance Claims Handled · Lifetime Paint Warranty"
      />
    </DemoShell>
  );
}
