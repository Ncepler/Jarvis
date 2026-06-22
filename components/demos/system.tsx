"use client";

// ── Local-service demo design system ("the Axel's / Sallem look") ──────────
// Full-bleed, photographic, EDITORIAL. Real photos/video carry the color; the
// chrome stays quiet. Big two-line headers, uppercase eyebrows with an accent
// tick, numbered sections, 1px hairlines, ONE accent per niche used ~2× a
// screen. ZERO decorative geometric shapes — if it isn't a photo, a line of
// text, a hairline, or a button, it doesn't belong here.
//
// The skeleton is identical on every demo; only the MOOD changes per niche
// (SKILL §13). Renovation + landscaping are DARK (the default theme). Florist,
// bakery, power washing, lawn care are LIGHT and barber is WARM-DARK — those
// pass a full `theme` to DemoShell. Every primitive reads the --d-* vars the
// shell sets, so re-mooding is a palette/type swap, never a structural one.
// Spec: .claude/skills/local-service-design-system/SKILL.md

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Default DARK theme — renovation + landscaping (SKILL §2). Light/warm niches
// pass their own `theme` (SKILL §13); anything a theme omits falls back here.
const DARK_THEME = {
  bg: "#0B0B0C",
  surface: "#141416",
  fg: "#F2EFE9",
  body: "#C9C8C0",
  muted: "#8A8A82",
  line: "#232327",
  onAccent: "#0B0B0C",
  heroScrim: "linear-gradient(180deg, rgba(11,11,12,.35), rgba(11,11,12,.85))",
  breakScrim: "linear-gradient(180deg, rgba(11,11,12,.55), rgba(11,11,12,.9))",
  font: "var(--font-tight)",
  display: "var(--font-tight)",
  radius: "5px",
} as const;

// A demo's mood. Only `accent` is required when the dark default is used;
// light/warm niches supply the full palette + type + scrims (SKILL §13).
export type DemoTheme = {
  bg: string;
  surface: string;
  fg: string;
  body: string;
  muted: string;
  line: string;
  accent: string;
  onAccent?: string; // text on accent fills (default: bg)
  heroScrim?: string; // hero gradient over media (default: dark)
  breakScrim?: string; // full-bleed break gradient (default: darker)
  font?: string; // base font-family value (default: --font-tight)
  display?: string; // display/header font-family (default: same as font)
  radius?: string; // card/button radius (default: 5px)
};

// ── Motion: fade + small rise, once on enter. Reduced-motion → final state. ──
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Shell: sets every --d-* var the primitives read — palette, accent, scrims,
// type, radius. Dark niches pass only `accent`; light/warm niches pass `theme`.
export function DemoShell({
  accent,
  theme,
  children,
}: {
  accent: string;
  theme?: DemoTheme;
  children: ReactNode;
}) {
  const t: DemoTheme = theme ?? { ...DARK_THEME, accent };
  const vars = {
    "--d-bg": t.bg,
    "--d-surface": t.surface,
    "--d-fg": t.fg,
    "--d-body": t.body,
    "--d-muted": t.muted,
    "--d-line": t.line,
    "--d-accent": t.accent,
    "--d-onaccent": t.onAccent ?? t.bg,
    "--d-hero-scrim": t.heroScrim ?? DARK_THEME.heroScrim,
    "--d-break-scrim": t.breakScrim ?? DARK_THEME.breakScrim,
    "--d-font": t.font ?? DARK_THEME.font,
    "--d-display": t.display ?? t.font ?? DARK_THEME.font,
    "--d-radius": t.radius ?? DARK_THEME.radius,
    background: "var(--d-bg)",
    color: "var(--d-body)",
    fontFamily: "var(--d-font)",
  } as CSSProperties;
  return (
    <div className="antialiased" style={vars}>
      {children}
    </div>
  );
}

const wrap = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

// ── Eyebrow: uppercase label with an accent tick. ────────────────────────────
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.14em]"
      style={{ color: "var(--d-muted)" }}
    >
      <span
        aria-hidden
        className="inline-block h-px w-6"
        style={{ background: "var(--d-accent)" }}
      />
      {children}
    </p>
  );
}

// ── Two-line section header (the signature move). ────────────────────────────
export function TwoLine({
  a,
  b,
  className = "",
}: {
  a: string;
  b: string;
  className?: string;
}) {
  return (
    <h2
      className={`text-[32px] font-semibold leading-[1.08] tracking-[-0.01em] md:text-[52px] ${className}`}
      style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
    >
      {a}
      <br />
      <span style={{ color: "var(--d-muted)" }}>{b}</span>
    </h2>
  );
}

// ── Labeled media placeholder (Noah drops real photos in later — §10). ───────
// Solid surface fill, hairline border, centered label naming slot + ratio.
// NO stock, NO AI imagery committed; just the correct aspect box.
export function Media({
  label,
  ratio = "4/3",
  className = "",
  rounded = true,
}: {
  label: string;
  ratio?: string;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${rounded ? "rounded-[var(--d-radius)]" : ""} ${className}`}
      style={{
        aspectRatio: ratio,
        background: "var(--d-surface)",
        border: "1px solid var(--d-line)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--d-muted)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Header: name left, nav + phone + accent quote button right. ──────────────
// Not position:fixed — the demo is rendered inside a scaled gallery container,
// so a fixed bar would escape it. A plain top band on a hairline reads right.
export function DemoHeader({
  name,
  phone,
  quoteLabel = "Free estimate",
}: {
  name: string;
  phone: string;
  quoteLabel?: string;
}) {
  const nav = ["Home", "About", "Services", "Work", "Contact"];
  return (
    <header
      className="w-full"
      style={{ borderBottom: "1px solid var(--d-line)" }}
    >
      <div
        className={`${wrap} flex h-[72px] items-center justify-between`}
      >
        <span
          className="text-[17px] font-semibold tracking-[-0.01em]"
          style={{ color: "var(--d-fg)" }}
        >
          {name}
        </span>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <span
              key={n}
              className="text-[14px]"
              style={{ color: "var(--d-body)" }}
            >
              {n}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <span
            className="hidden text-[14px] sm:block"
            style={{ color: "var(--d-muted)" }}
          >
            {phone}
          </span>
          <span
            className="px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em]"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            {quoteLabel}
          </span>
        </div>
      </div>
    </header>
  );
}

// ── Hero: full-bleed media placeholder + scrim, two-line H1, two CTAs. ───────
export function DemoHero({
  eyebrow,
  line1,
  line2,
  sub,
  primaryCta,
  phone,
  mediaLabel,
  heroImage,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  primaryCta: string;
  phone: string;
  mediaLabel: string;
  heroImage?: string; // drop a real hero background image path here (else placeholder)
}) {
  return (
    <section className="relative w-full" style={{ minHeight: "640px" }}>
      {/* full-bleed background media slot — real image if given, else label */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: heroImage ? undefined : "var(--d-surface)",
          backgroundImage: heroImage ? `url("${heroImage}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!heroImage && (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--d-muted)" }}
            >
              {mediaLabel}
            </span>
          </div>
        )}
      </div>
      {/* scrim so headlines stay readable on real footage — light demos pass a
          light scrim so the bright hero stays bright (SKILL §13f) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--d-hero-scrim)" }}
      />
      <div className={`${wrap} relative flex min-h-[640px] flex-col justify-end pb-16 pt-28`}>
        <Rise>
          <div className="mb-6">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1
            className="max-w-3xl text-[40px] font-bold leading-[1.04] tracking-[-0.02em] md:text-[72px]"
            style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
          >
            {line1}
            <br />
            {line2}
          </h1>
          <p
            className="mt-6 max-w-xl text-[17px] leading-[1.6]"
            style={{ color: "var(--d-body)" }}
          >
            {sub}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span
              className="px-6 py-3.5 text-[14px] font-semibold"
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              {primaryCta}
            </span>
            <span
              className="px-6 py-3.5 text-[14px] font-semibold"
              style={{
                border: "1px solid var(--d-line)",
                color: "var(--d-fg)",
              }}
            >
              Call {phone}
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

// ── Marquee: one looping band of niche service words, ● separators. ──────────
function MarqueeRow({
  terms,
  inner,
}: {
  terms: string[];
  inner?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span ref={inner} className="inline-flex items-center">
      {terms.map((t) => (
        <span key={t} className="inline-flex items-center">
          <span className="px-7 text-[22px] md:text-[28px]" style={{ color: "var(--d-muted)" }}>
            {t}
          </span>
          <span aria-hidden style={{ color: "var(--d-accent)" }}>
            ●
          </span>
        </span>
      ))}
    </span>
  );
}

// Seamless at any width: measure one copy of the row + the container, then
// render enough copies to overfill it and slide by exactly one copy width.
// A short term list inside a wide demo used to run out and show a gap before
// it reset (Noah 2026-06-20) — this guarantees it never does.
export function DemoMarquee({ terms }: { terms: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const [rowW, setRowW] = useState(0);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const measure = () => {
      const w = rowRef.current?.offsetWidth ?? 0;
      const cw = containerRef.current?.offsetWidth ?? 0;
      if (w > 0) {
        setRowW(w);
        setCopies(Math.max(2, Math.ceil(cw / w) + 1));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (rowRef.current) ro.observe(rowRef.current);
    return () => ro.disconnect();
  }, [terms]);

  // constant speed (~55px/s) regardless of how many copies render
  const dur = rowW ? rowW / 55 : 30;

  return (
    <div
      ref={containerRef}
      role="marquee"
      aria-label="Services"
      className="w-full overflow-hidden whitespace-nowrap py-7"
      style={{ borderBottom: "1px solid var(--d-line)" }}
    >
      <style>{`
        @keyframes demo-mq { to { transform: translateX(calc(-1 * var(--mq-w))); } }
        .demo-mq { display: inline-flex; animation: demo-mq var(--mq-dur) linear infinite; }
        @media (prefers-reduced-motion: reduce) { .demo-mq { animation: none; } }
      `}</style>
      <div
        className="demo-mq"
        style={
          { "--mq-w": `${rowW}px`, "--mq-dur": `${dur}s` } as CSSProperties
        }
      >
        {Array.from({ length: copies }, (_, i) => (
          <MarqueeRow
            key={i}
            terms={terms}
            inner={i === 0 ? rowRef : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// ── Section wrapper with consistent vertical rhythm. ─────────────────────────
export function Section({
  children,
  className = "",
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`w-full py-[72px] md:py-[140px] ${className}`}
      style={dark ? { background: "var(--d-surface)" } : undefined}
    >
      <div className={wrap}>{children}</div>
    </section>
  );
}

// ── Intro: eyebrow + two-line H2 + paragraphs + honest badge PAIRS. ──────────
export function Intro({
  eyebrow,
  line1,
  line2,
  paragraphs,
  badges,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  paragraphs: string[];
  badges: [string, string][];
}) {
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-[0.85fr_1fr] md:gap-16">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div className="space-y-5">
            {paragraphs.map((p) => (
              <p key={p} className="text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {p}
              </p>
            ))}
          </div>
        </Rise>
      </div>
      {/* honest descriptor pairs — NOT invented numbers */}
      <div
        className="mt-14 grid grid-cols-2 gap-px md:grid-cols-4"
        style={{ background: "var(--d-line)", border: "1px solid var(--d-line)" }}
      >
        {badges.map(([label, value], i) => (
          <Rise key={label} delay={Math.min(i * 0.06, 0.24)}>
            <div className="h-full p-6" style={{ background: "var(--d-bg)" }}>
              <p className="text-[16px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {label}
              </p>
              <p className="mt-1.5 text-[13px]" style={{ color: "var(--d-muted)" }}>
                {value}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Numbered service cards (01–0N). ──────────────────────────────────────────
export type Service = { title: string; copy: string };
export function ServiceCards({
  eyebrow,
  line1,
  line2,
  services,
  thumbPrefix,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  services: Service[];
  thumbPrefix: string;
}) {
  return (
    <Section>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Rise key={s.title} delay={Math.min(i * 0.06, 0.3)}>
            <div
              className="group flex h-full flex-col p-7 transition-colors duration-300"
              style={{
                background: "var(--d-surface)",
                border: "1px solid var(--d-line)",
                borderRadius: "var(--d-radius)",
              }}
            >
              <Media label={`${thumbPrefix} — ${s.title} (4:3)`} className="mb-6" />
              <span
                className="text-[13px] font-semibold tracking-[0.1em]"
                style={{ color: "var(--d-muted)" }}
              >
                0{i + 1}
              </span>
              <h3
                className="mt-2 text-[22px] font-semibold leading-[1.2]"
                style={{ color: "var(--d-fg)" }}
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {s.copy}
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold"
                style={{ color: "var(--d-accent)" }}
              >
                Explore
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Full-bleed transformation break: media + scrim + statement + checklist. ──
export function FullBleedBreak({
  eyebrow,
  line1,
  line2,
  paragraph,
  checklist,
  cta,
  mediaLabel,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  paragraph: string;
  checklist: string[];
  cta: string;
  mediaLabel: string;
}) {
  return (
    <section className="relative w-full">
      <div className="absolute inset-0" style={{ background: "var(--d-surface)" }}>
        <div className="flex h-full w-full items-center justify-center">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--d-muted)" }}
          >
            {mediaLabel}
          </span>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--d-break-scrim)" }}
      />
      <div className={`${wrap} relative py-[96px] md:py-[160px]`}>
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            {paragraph}
          </p>
          <ul className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            {checklist.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-[15px]" style={{ color: "var(--d-body)" }}>
                <span style={{ color: "var(--d-accent)" }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
          <span
            className="mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          >
            {cta}
          </span>
        </Rise>
      </div>
    </section>
  );
}

// ── Before/after slider: draggable clip-path reveal of two stacked images. ───
// Theme-driven (accent handle, --d-onaccent on the grip). Real images if given,
// else labeled placeholders at the right aspect so it works before photos land.
// Reduced-motion → the two stills side by side; a hidden range input keeps it
// keyboard-operable. Shared by renovation rooms, auto-body collision, etc.
// (SKILL §14a/§14d/§14e).
export function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel,
  afterLabel,
  ratio = "16/9",
}: {
  beforeImg?: string;
  afterImg?: string;
  beforeLabel: string;
  afterLabel: string;
  ratio?: string;
}) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const id = useId();

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

  const Slot = ({ img, label }: { img?: string; label: string }) => (
    <div
      className="flex h-full w-full items-center justify-center p-4 text-center"
      style={{
        background: img
          ? `var(--d-surface) url("${img}") center/cover no-repeat`
          : "var(--d-surface)",
      }}
    >
      {!img && (
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--d-muted)" }}
        >
          {label}
        </span>
      )}
    </div>
  );

  // reduced-motion: two stills side by side, no drag
  if (reduced) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div style={{ aspectRatio: ratio, border: "1px solid var(--d-line)" }}>
          <Slot img={beforeImg} label={beforeLabel} />
        </div>
        <div style={{ aspectRatio: ratio, border: "1px solid var(--d-line)" }}>
          <Slot img={afterImg} label={afterLabel} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full touch-none select-none overflow-hidden"
      style={{
        aspectRatio: ratio,
        border: "1px solid var(--d-line)",
        borderRadius: "var(--d-radius)",
        cursor: "ew-resize",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      {/* BEFORE (under) */}
      <div className="absolute inset-0">
        <Slot img={beforeImg} label={beforeLabel} />
      </div>
      {/* AFTER (over), clipped to the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Slot img={afterImg} label={afterLabel} />
      </div>
      <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
        Before
      </span>
      <span className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-accent)" }}>
        After
      </span>
      {/* handle */}
      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="h-full" style={{ width: 2, background: "var(--d-accent)" }} />
        <div
          className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          ⇄
        </div>
      </div>
      {/* a11y / keyboard control */}
      <label className="sr-only" htmlFor={id}>
        Reveal amount
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

// ── Process stepper: horizontal numbered steps on a connecting hairline. ─────
// One-line "what happens" + an honest duration per step, plus an optional
// overall note. Stacks to one column on mobile. (SKILL §14e/§14f.)
export type Step = { title: string; what: string; duration?: string };
export function ProcessStepper({
  eyebrow,
  line1,
  line2,
  steps,
  note,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  steps: Step[];
  note?: string;
}) {
  const colClass = steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <Section>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <div
        className={`mt-14 grid grid-cols-1 gap-px ${colClass}`}
        style={{ background: "var(--d-line)", border: "1px solid var(--d-line)" }}
      >
        {steps.map((s, i) => (
          <Rise key={s.title} delay={Math.min(i * 0.08, 0.32)}>
            <div className="flex h-full flex-col p-7" style={{ background: "var(--d-bg)" }}>
              <span className="text-[13px] font-semibold tracking-[0.1em]" style={{ color: "var(--d-accent)" }}>
                0{i + 1}
              </span>
              <h3 className="mt-3 text-[20px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {s.what}
              </p>
              {s.duration && (
                <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--d-muted)" }}>
                  {s.duration}
                </p>
              )}
            </div>
          </Rise>
        ))}
      </div>
      {note && (
        <Rise delay={0.1}>
          <p className="mt-6 text-[14px]" style={{ color: "var(--d-muted)" }}>
            {note}
          </p>
        </Rise>
      )}
    </Section>
  );
}

// ── Work grid: tiles with a category tag + one-line caption. ─────────────────
export type Work = { tag: string; caption: string };
export function WorkGrid({
  eyebrow,
  line1,
  line2,
  items,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  items: Work[];
}) {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: "var(--d-accent)" }}>
            See all work →
          </span>
        </Rise>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {items.map((w, i) => (
          <Rise key={w.caption} delay={Math.min(i * 0.05, 0.3)}>
            <figure className="group">
              <div className="overflow-hidden rounded-[var(--d-radius)]">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Media label={`WORK — ${w.caption} (4:3)`} rounded={false} />
                </div>
              </div>
              <figcaption className="mt-3">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--d-muted)" }}
                >
                  {w.tag}
                </span>
                <p className="mt-1 text-[15px]" style={{ color: "var(--d-body)" }}>
                  {w.caption}
                </p>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Filterable work grid: category chips filter the same tile grid. ──────────
// Same tile component as WorkGrid; an "All" chip plus the niche's categories
// filter by item.tag. (SKILL §14e renovation rooms / §14f landscaping types.)
export function FilterableWorkGrid({
  eyebrow,
  line1,
  line2,
  chips,
  items,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  chips: string[];
  items: Work[];
}) {
  const [active, setActive] = useState("All");
  const all = ["All", ...chips];
  const shown = active === "All" ? items : items.filter((w) => w.tag === active);
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: "var(--d-accent)" }}>
            See all work →
          </span>
        </Rise>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {all.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            aria-pressed={c === active}
            className="px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors"
            style={{
              background: c === active ? "var(--d-accent)" : "transparent",
              color: c === active ? "var(--d-onaccent)" : "var(--d-muted)",
              border: `1px solid ${c === active ? "var(--d-accent)" : "var(--d-line)"}`,
              borderRadius: "var(--d-radius)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {shown.map((w) => (
          <Rise key={w.caption}>
            <figure className="group">
              <div className="overflow-hidden rounded-[var(--d-radius)]">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Media label={`WORK — ${w.caption} (4:3)`} rounded={false} />
                </div>
              </div>
              <figcaption className="mt-3">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--d-muted)" }}
                >
                  {w.tag}
                </span>
                <p className="mt-1 text-[15px]" style={{ color: "var(--d-body)" }}>
                  {w.caption}
                </p>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Value props: numbered items, no card — hairline grid. ────────────────────
export type Prop = { title: string; copy: string };
export function ValueProps({
  eyebrow,
  line1,
  line2,
  props,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  props: Prop[];
}) {
  return (
    <Section dark>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {props.map((p, i) => (
          <Rise key={p.title} delay={Math.min(i * 0.06, 0.3)}>
            <div
              className="pt-6"
              style={{ borderTop: "1px solid var(--d-line)" }}
            >
              <span
                className="text-[13px] font-semibold tracking-[0.1em]"
                style={{ color: "var(--d-accent)" }}
              >
                0{i + 1}
              </span>
              <h3 className="mt-3 text-[22px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                {p.copy}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Proof strip: a hairline-separated row of ✓ + short claims, no numbers. ───
// Replaces the numbered value list on niches that want a compact, plain strip
// (power washing §14a, lawn care §14g).
export type Claim = { label: string; sub?: string };
export function ProofStrip({
  eyebrow,
  line1,
  line2,
  claims,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  claims: Claim[];
}) {
  return (
    <Section dark>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <div
        className="mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
        style={{ background: "var(--d-line)", border: "1px solid var(--d-line)" }}
      >
        {claims.map((c, i) => (
          <Rise key={c.label} delay={Math.min(i * 0.06, 0.24)}>
            <div className="h-full p-7" style={{ background: "var(--d-bg)" }}>
              <span className="text-[20px] leading-none" style={{ color: "var(--d-accent)" }}>
                ✓
              </span>
              <h3 className="mt-4 text-[17px] font-semibold" style={{ color: "var(--d-fg)" }}>
                {c.label}
              </h3>
              {c.sub && (
                <p className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                  {c.sub}
                </p>
              )}
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── FAQ accordion: Q0N, one open at a time, hairline rows. ───────────────────
export type Qa = { q: string; a: string };
export function Faq({
  eyebrow,
  line1,
  line2,
  items,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  items: Qa[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-[0.7fr_1fr] md:gap-16">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
        </Rise>
        <div style={{ borderTop: "1px solid var(--d-line)" }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid var(--d-line)" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[13px] font-semibold tracking-[0.1em]"
                    style={{ color: "var(--d-accent)" }}
                  >
                    Q0{i + 1}
                  </span>
                  <span className="flex-1 text-[17px] font-semibold" style={{ color: "var(--d-fg)" }}>
                    {item.q}
                  </span>
                  <span
                    className="text-[20px] leading-none"
                    style={{ color: "var(--d-muted)" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="pb-5 pl-10 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                    {item.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ── Contact: copy + methods row + form with a service/project dropdown. ──────
export function Contact({
  eyebrow,
  line1,
  line2,
  copy,
  phone,
  email,
  location,
  serviceLabel,
  serviceOptions,
  propertyTypes,
  vehicleFields,
  claimToggle,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  copy: string;
  phone: string;
  email: string;
  location: string;
  serviceLabel: string;
  serviceOptions: string[];
  propertyTypes?: string[];
  vehicleFields?: boolean; // Year / Make / Model row (auto body)
  claimToggle?: boolean; // "this is an insurance claim" toggle (auto body)
}) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const reduced = useReducedMotion();
  const field = {
    background: "var(--d-bg)",
    border: "1px solid var(--d-line)",
    color: "var(--d-fg)",
    borderRadius: "var(--d-radius)",
  } as CSSProperties;
  const label = "mb-1.5 block text-[13px] font-semibold";
  return (
    <Section dark>
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
          <p className="mt-6 max-w-md text-[17px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            {copy}
          </p>
          <div className="mt-8 space-y-3 text-[15px]">
            {[
              ["Call or text", phone],
              ["Email", email],
              ["Where", location],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="w-28" style={{ color: "var(--d-muted)" }}>
                  {k}
                </span>
                <span style={{ color: "var(--d-fg)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Rise>
        <Rise delay={0.1}>
          <form
            onClick={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className={label} style={{ color: "var(--d-muted)" }}>
                  Name *
                </span>
                <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="Your name" />
              </div>
              <div>
                <span className={label} style={{ color: "var(--d-muted)" }}>
                  Email *
                </span>
                <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className={label} style={{ color: "var(--d-muted)" }}>
                  Phone
                </span>
                <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="(516) 555-0000" />
              </div>
              <div>
                <span className={label} style={{ color: "var(--d-muted)" }}>
                  {serviceLabel}
                </span>
                <select className="w-full px-3.5 py-3 text-[15px]" style={field} defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  {serviceOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            {propertyTypes && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className={label} style={{ color: "var(--d-muted)" }}>
                    Property type
                  </span>
                  <select className="w-full px-3.5 py-3 text-[15px]" style={field} defaultValue="">
                    <option value="" disabled>
                      Select…
                    </option>
                    {propertyTypes.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className={label} style={{ color: "var(--d-muted)" }}>
                    City
                  </span>
                  <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="Your town" />
                </div>
              </div>
            )}
            {vehicleFields && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <span className={label} style={{ color: "var(--d-muted)" }}>
                    Year
                  </span>
                  <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="2019" />
                </div>
                <div>
                  <span className={label} style={{ color: "var(--d-muted)" }}>
                    Make
                  </span>
                  <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="Honda" />
                </div>
                <div>
                  <span className={label} style={{ color: "var(--d-muted)" }}>
                    Model
                  </span>
                  <input className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="Accord" />
                </div>
              </div>
            )}
            {claimToggle && (
              <label className="flex cursor-pointer items-center gap-3 text-[15px]" style={{ color: "var(--d-body)" }}>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  style={{ accentColor: "var(--d-accent)" }}
                />
                This is an insurance claim
              </label>
            )}
            <div>
              <span className={label} style={{ color: "var(--d-muted)" }}>
                Tell us about your project
              </span>
              <textarea rows={4} className="w-full px-3.5 py-3 text-[15px]" style={field} placeholder="A few sentences is plenty." />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setState("ok")}
                className="px-6 py-3.5 text-[14px] font-semibold"
                style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setState("err")}
                className="text-[13px]"
                style={{ color: "var(--d-muted)" }}
              >
                (demo: preview error state)
              </button>
            </div>
            {state === "ok" && (
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[15px]"
                style={{ color: "var(--d-accent)" }}
              >
                Got it — we&apos;ll get back to you the same day.
              </motion.p>
            )}
            {state === "err" && (
              <p className="text-[15px]" style={{ color: "var(--d-fg)" }}>
                That didn&apos;t send. Give us a call at {phone} or{" "}
                <button type="button" onClick={() => setState("idle")} className="underline" style={{ color: "var(--d-accent)" }}>
                  try again
                </button>
                .
              </p>
            )}
          </form>
        </Rise>
      </div>
    </Section>
  );
}

// ── Final CTA band: full-bleed, short, two-line line + CTA + phone. ──────────
export function CtaBand({
  line1,
  line2,
  cta,
  phone,
}: {
  line1: string;
  line2: string;
  cta: string;
  phone: string;
}) {
  return (
    <section className="w-full" style={{ borderTop: "1px solid var(--d-line)" }}>
      <div className={`${wrap} py-[80px] text-center md:py-[120px]`}>
        <Rise>
          <h2
            className="mx-auto text-[36px] font-bold leading-[1.06] tracking-[-0.02em] md:text-[60px]"
            style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
          >
            {line1}
            <br />
            <span style={{ color: "var(--d-muted)" }}>{line2}</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span
              className="px-7 py-4 text-[14px] font-semibold"
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              {cta}
            </span>
            <span
              className="px-7 py-4 text-[14px] font-semibold"
              style={{ border: "1px solid var(--d-line)", color: "var(--d-fg)" }}
            >
              {phone}
            </span>
          </div>
        </Rise>
      </div>
    </section>
  );
}

// ── Structured footer: name + descriptor + columns + hours. ──────────────────
export function DemoFooter({
  name,
  descriptor,
  area,
  services,
  phone,
  email,
  location,
  hours,
  strip,
}: {
  name: string;
  descriptor: string;
  area: string;
  services: string[];
  phone: string;
  email: string;
  location: string;
  hours: string;
  strip: string;
}) {
  return (
    <footer className="w-full" style={{ background: "var(--d-surface)", borderTop: "1px solid var(--d-line)" }}>
      <div className={`${wrap} py-16`}>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-[18px] font-semibold" style={{ color: "var(--d-fg)" }}>
              {name}
            </p>
            <p className="mt-3 max-w-[240px] text-[14px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
              {descriptor}
            </p>
            <p className="mt-3 text-[13px]" style={{ color: "var(--d-muted)" }}>
              {area}
            </p>
          </div>
          <FooterCol title="Navigate" items={["Home", "About", "Services", "Work", "Contact"]} />
          <FooterCol title="Services" items={services} />
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--d-body)" }}>
              <li>{location}</li>
              <li>{phone}</li>
              <li>{email}</li>
              <li style={{ color: "var(--d-muted)" }}>{hours}</li>
            </ul>
          </div>
        </div>
        <div
          className="mt-12 flex flex-wrap items-center justify-between gap-3 pt-6 text-[13px]"
          style={{ borderTop: "1px solid var(--d-line)", color: "var(--d-muted)" }}
        >
          <span>© 2026 {name}. All rights reserved.</span>
          <span>{strip}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--d-body)" }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
