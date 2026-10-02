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
import Image from "next/image";
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
import type { HeroConcept } from "@/lib/heroConcepts";
import { PremiumHeroMedia } from "./PremiumHeroMedia";

// ── Motion tokens (craft pass 2026-09-27) — one set, extended from the site's
// existing --ease-out-expo rather than forked: these are the demo layer's own
// --d-* scoped equivalents (DemoShell sets them as CSS vars below). The
// in-out and drawer curves are only ever needed as CSS (var(--d-ease-in-out)
// etc.) in this file, so only the ease-out tuple — the one Motion component
// below (Rise) actually animates with — exists as a JS value.
// animate/GUIDE.md's canonical values — don't approximate a new curve here.
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE = EASE_OUT; // back-compat alias for existing call sites below

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
  radius?: string; // card/button radius (default: 5px) — the "medium" tier
  // Optional finer-grained tiers (craft pass 2026-09-27, personality-per-
  // style radius scale) for a large panel or a small chip that should read
  // rounder/sharper than the medium default — e.g. florist/bakery 14/8/4,
  // lawncare/powerwash 12/6/3, the sharp-edged niches 4/2/0. Purely additive:
  // every existing var(--d-radius) usage is untouched, and both fall back to
  // the base `radius` if a theme doesn't set them.
  radiusLg?: string;
  radiusSm?: string;
};

// ── Motion: fade + small rise, once on enter. Reduced-motion → final state. ──
// Retuned in the 2026-09-27 craft pass: 8px (was 20px) and 420ms/-4% margin
// (was 600ms/-10%) so content resolves to opaque within ~450ms of entering
// the viewport, matching every other reveal in this system (animate/GUIDE.md
// "content fully opaque within 450ms"). `aboveFold` skips the animation
// entirely for anything a caller knows renders in the first viewport —
// reveals are for content the visitor scrolls to, never for what's already
// there at first paint.
export function Rise({
  children,
  delay = 0,
  className,
  aboveFold = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  aboveFold?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced || aboveFold) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(8px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "0px 0px -4% 0px" }}
      transition={{ duration: 0.42, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

// ── StickyScene: a full-bleed image pinned via `position: sticky` while the
// foreground stack (its children, in normal flow) scrolls over it, then
// releases once the stack runs out. Native scroll only — no scroll-jacking,
// no wheel/touch listeners, no GSAP/Lenis. `svh` (not `vh`) so a mobile
// browser's toolbar collapsing/expanding never shifts the pinned height.
// Scales the image 1.00->1.06 across the pin. Where the browser supports
// scroll-driven animations (view-timeline-name), that's pure CSS —
// `--d-scene`'s progress runs off the compositor, no scroll listener at all
// (craft pass 2026-09-27: animate/GUIDE.md "no JS scroll listeners for
// visuals"). Elsewhere, one shared passive listener, rAF-throttled, writes a
// single CSS custom property the fallback `.scene-scale` rule reads — no
// per-frame React state, no layout thrash. `prefers-reduced-motion` drops
// the scale either way; the pin itself is layout, not "motion", and stays.
export function StickyScene({
  image,
  imageAlt = "",
  priority,
  imagePosition,
  children,
}: {
  image: string;
  imageAlt?: string;
  priority?: boolean;
  // Object-position override for this pinned image's center-crop (default:
  // browser center). Needed when the frame's interesting detail sits off-
  // center — e.g. barber's shop.webp has an out-of-focus lamp filling its
  // left third, so the crop needs to favor the chairs/mirrors on the right.
  imagePosition?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The CSS path (view-timeline-name, checked via @supports above) already
    // handles this with no JS at all — skip attaching the fallback listener
    // when the browser can do it natively.
    if (typeof CSS !== "undefined" && CSS.supports?.("view-timeline-name: --x")) return;
    const root = rootRef.current;
    const scale = scaleRef.current;
    if (!root || !scale) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const span = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / span, 0), 1);
      scale.style.setProperty("--scene-p", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative d-scene-root">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div ref={scaleRef} className="scene-scale d-scene-scale-native h-full w-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        </div>
      </div>
      {/* pulled up over the pinned layer so children paint on top of it in
          normal document flow — no z-index needed, just paint order */}
      <div className="relative" style={{ marginTop: "-100svh" }}>
        {children}
      </div>
    </div>
  );
}

// ── SceneBlock: wraps one StickyScene foreground block that needs to stay
// legible while it rides over the pinned image. The first ~22% (top) fades
// from transparent so a sliver of image shows through as the block arrives;
// past that the block is fully opaque `--d-bg`, so any text — which always
// sits well below a Section's own top padding — reads at the same contrast
// the rest of the site already guarantees for body text on `--d-bg` (every
// theme is built to clear 4.5:1 there), regardless of what's in the photo
// behind it. Reused for both Scene A's Intro block and Scene B sections.
export function SceneBlock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, var(--d-bg) 22%, var(--d-bg) 100%)",
      }}
    >
      {children}
    </div>
  );
}

// ── StickyReveal: fade + rise-24px, once, on IntersectionObserver entry —
// the "each foreground block fades in and rises once it enters" motion
// StickyScene callers wrap their blocks in. Reduced motion shows the final
// state immediately, no observer attached.
//
// threshold must stay near 0, not a fraction like 0.2: several callers wrap
// a single tall block (marquee + full Intro copy, ~900px) in one
// StickyReveal, and a 20%-of-area threshold on something that tall doesn't
// fire until a large fraction of it has already scrolled past — the gap
// reads as a dead, fully-transparent stretch riding over the pinned image
// (confirmed empirically on the auto-body demo: ~180-200px of scroll sitting
// at opacity:0, coinciding with SceneBlock's own fade-to-solid, so it reads
// as a solid blank rectangle). Firing on first intersection, biased 8% off
// the bottom edge (matching every other reveal in this system), makes the
// trigger independent of the wrapped block's height.
export function StickyReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -4% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px)" : "translateY(8px)",
        transition: reduced
          ? undefined
          : "opacity var(--d-dur-reveal) var(--d-ease-out), transform var(--d-dur-reveal) var(--d-ease-out)",
      }}
    >
      {children}
    </div>
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
    "--d-radius-lg": t.radiusLg ?? t.radius ?? DARK_THEME.radius,
    "--d-radius-sm": t.radiusSm ?? t.radius ?? DARK_THEME.radius,
    // Motion tokens — one scale, used by every primitive below and by the
    // per-style files (animate/GUIDE.md canonical curves + a duration scale
    // sized to what each moment actually is, not one number everywhere).
    "--d-ease-out": "cubic-bezier(0.23, 1, 0.32, 1)",
    "--d-ease-in-out": "cubic-bezier(0.77, 0, 0.175, 1)",
    "--d-ease-drawer": "cubic-bezier(0.32, 0.72, 0, 1)",
    "--d-dur-press": "160ms",
    "--d-dur-hover": "200ms",
    "--d-dur-ui": "240ms",
    "--d-dur-reveal": "420ms",
    "--d-dur-media": "700ms",
    background: "var(--d-bg)",
    color: "var(--d-body)",
    fontFamily: "var(--d-font)",
  } as CSSProperties;
  return (
    // id="home" is the nav's "Home" anchor target — the top of every demo.
    // "demo-shell" scopes the anchor-smooth-scroll rule in globals.css so it
    // never touches the main site's own (Lenis-driven) scrolling.
    <div id="home" className="antialiased demo-shell" style={vars}>
      {children}
    </div>
  );
}

const wrap = "mx-auto w-full max-w-[1200px] px-6 md:px-16";

// Anchor targets need to clear the sticky Vilas demo bar (56px — VilasDemoBar
// is `sticky top-3` + h-11) plus a little air so a clicked nav item's heading
// never lands underneath it. DemoHeader is not sticky, so it needs no offset.
export const ANCHOR_SCROLL_CLASS = "scroll-mt-[88px]";

// ── Eyebrow: uppercase label with an accent tick. Sized and weighted to read
// as an intentional section marker, not an afterthought (Noah's fix, §3 note)
// — 15px/bold, and --d-body instead of --d-muted for real contrast while
// staying under full --d-fg. ───────────────────────────────────────────────
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="flex items-center gap-2.5 text-[15px] font-bold uppercase tracking-[0.12em]"
      style={{ color: "var(--d-body)" }}
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
  // Both lines at full contrast (craft pass 2026-09-27, Phase 0 §5 "no
  // greyed second lines") — the two-line pattern is about the copy break,
  // not a dimming treatment; a muted second line was never in the design
  // spec, just an earlier implementation choice.
  return (
    <h2
      className={`text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.022em] md:text-[52px] ${className}`}
      style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)", fontOpticalSizing: "auto" }}
    >
      {a}
      <br />
      {b}
    </h2>
  );
}

// ── Labeled media placeholder (Noah drops real photos in later — §10). ───────
// Solid surface fill, hairline border, centered label naming slot + ratio.
// NO stock, NO AI imagery committed; just the correct aspect box.
// ── Filename badge on every image slot. ─────────────────────────────────────
// Clients naming their photo uploads need to know what each slot is called
// (the /start form tells them to hover a demo image to find out). Subtle by
// design: invisible until the pointer is over the slot, gone on touch.
export function FileBadge({ file }: { file?: string }) {
  if (!file) return null;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-2 top-2 z-10 hidden px-1.5 py-0.5 font-mono text-[10px] leading-tight opacity-0 transition-opacity duration-200 group-hover/media:opacity-100 md:inline-block"
      style={{
        background: "var(--d-bg)",
        color: "var(--d-muted)",
        border: "1px solid var(--d-line)",
        borderRadius: "3px",
      }}
    >
      {file}
    </span>
  );
}

export function Media({
  label,
  img,
  file,
  ratio = "4/3",
  className = "",
  rounded = true,
}: {
  label: string;
  img?: string;
  file?: string; // the filename a client should give their own photo
  ratio?: string;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <div
      className={`group/media relative w-full overflow-hidden ${rounded ? "rounded-[var(--d-radius)]" : ""} ${className}`}
      style={{
        aspectRatio: ratio,
        background: img
          ? `var(--d-surface) url("${img}") center/cover no-repeat`
          : "var(--d-surface)",
        border: "1px solid var(--d-line)",
      }}
    >
      <FileBadge file={file} />
      {!img && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--d-muted)" }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Header: name left, nav + phone + accent quote button right. ──────────────
// NOT sticky (Noah, 2026-10-01): it sits in normal flow and scrolls away with
// the page. The only pinned chrome on a demo is VilasDemoBar's floating pill
// (sticky top-3). Solid --d-bg (themed per demo) so it reads correctly over
// both light and dark demo moods without a per-style override.
export function DemoHeader({
  name,
  phone,
  quoteLabel = "Free estimate",
  contactId = "contact",
}: {
  name: string;
  phone: string;
  quoteLabel?: string;
  // Two demos already had a pre-existing, differently-named contact anchor
  // (their own CTA buttons scroll to it) — override rather than rename it.
  contactId?: string;
}) {
  const nav = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: `#${contactId}` },
  ];
  return (
    <header
      className="relative z-40 w-full"
      style={{
        borderBottom: "1px solid var(--d-line)",
        background: "var(--d-bg)",
      }}
    >
      <div
        className={`${wrap} flex min-h-[72px] flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3`}
      >
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span
            className="text-[15px] font-semibold tracking-[-0.01em] md:text-[17px]"
            style={{ color: "var(--d-fg)" }}
          >
            {name}
          </span>
          {/* honesty label (SKILL §12) — a prospect clicking through must never
              mistake the placeholder phone/email for a real business */}
          <span
            className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--d-muted)", border: "1px solid var(--d-line)" }}
          >
            Demo build
          </span>
        </span>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Section">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="rounded-sm text-[14px] outline-none transition-opacity duration-150 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ color: "var(--d-body)", outlineColor: "var(--d-accent)" }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <span
            className="hidden text-[14px] tabular-nums sm:block"
            style={{ color: "var(--d-muted)" }}
          >
            {phone}
          </span>
          <span
            className="d-press inline-block px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em]"
            style={{
              background: "var(--d-accent)",
              color: "var(--d-onaccent)",
              boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
              border: "1px solid color-mix(in srgb, var(--d-accent) 92%, black)",
            }}
          >
            {quoteLabel}
          </span>
        </div>
      </div>
    </header>
  );
}

// ── Premium-only staggered entrance (Demo bar ticket, job 6): the headline
// group, then the CTA row, each fading/rising in with an increasing delay.
// Callers `key` this by tier so React remounts it — and replays it — exactly
// once per switch INTO premium, never on a loop. The $300 hero keeps the
// plain single-fade <Rise> untouched below. Reduced motion drops the
// animation (children render immediately) but never the content.
export function HeroReveal({ children }: { children: ReactNode[] }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, transform: "translateY(18px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.55, ease: EASE, delay: i * 0.15 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}

// ── Hero entrance choreography (craft pass 2026-09-27). CSS keyframes, not
// JS/Motion — they run off the main thread while the rest of the page is
// still loading (animate/GUIDE.md: "CSS animation runs off the main thread").
// The image is opaque at first paint and only settles (scale 1.06->1,
// 1400ms). Each headline line masks in from an overflow:hidden wrapper
// (translateY(105%)->0, 850ms, 90ms apart, starting at 150ms). Then the
// kicker, paragraph and buttons rise in together (500ms, 60ms stagger,
// starting at 450ms) — visually above the headline but choreographed to
// arrive after it, so the big type gets the first second. Total resolves at
// ~1.4s (the image's own settle, the longest piece). Reduced motion: no
// transform anywhere, just a 200ms opacity fade on the text — the image
// never had motion to begin with once its scale animation is dropped.
// Rendered unconditionally on every DemoHero mount rather than deduped by a
// module flag — a module-level "inject once" guard would stay tripped after
// a client-side route change unmounts this component (e.g. navigating
// between demo slugs), leaving the next hero with no keyframes at all.
// Duplicate <style> tags with identical rules cost nothing meaningful.
function HeroChoreographyStyle() {
  return (
    <style>{`
      @keyframes hero-img-settle { from { transform: scale(1.06); } to { transform: scale(1); } }
      @keyframes hero-line-in { from { transform: translateY(105%); } to { transform: translateY(0); } }
      @keyframes hero-rise-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @media (prefers-reduced-motion: reduce) {
        .hero-img-settle { animation: none !important; transform: none !important; }
        .hero-line-in, .hero-rise-in {
          animation: hero-fade-in 200ms ease both !important;
          transform: none !important;
          animation-delay: 0ms !important;
        }
      }
    `}</style>
  );
}

// A headline line masked in an overflow:hidden box so it slides up from
// underneath its own baseline, not from off-screen.
function HeroLine({ children, delayMs }: { children: ReactNode; delayMs: number }) {
  return (
    <span className="block overflow-hidden">
      <span
        className="hero-line-in block"
        style={{ animation: `hero-line-in 850ms var(--d-ease-out) both`, animationDelay: `${delayMs}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

function HeroRise({ children, delayMs, className = "" }: { children: ReactNode; delayMs: number; className?: string }) {
  return (
    <div
      className={`hero-rise-in ${className}`}
      style={{ animation: `hero-rise-in 500ms var(--d-ease-out) both`, animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
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
  premium,
  pinned,
}: {
  eyebrow: string;
  // ReactNode (not just string) so a caller can style part of the headline —
  // e.g. italicizing one word — without an unsafe cast; HeroLine's own
  // children type was already ReactNode, this just matches it up top.
  line1: ReactNode;
  line2: ReactNode;
  sub: string;
  primaryCta: string;
  phone: string;
  mediaLabel: string;
  heroImage?: string; // drop a real hero background image path here (else placeholder)
  // Premium tier only (round 2, job 5): a moving hero instead of the still
  // `heroImage` above. Pass a lib/heroConcepts.ts entry to swap the static
  // background for PremiumHeroMedia's video (looping or scroll-driven,
  // per the concept's `mode`) — everything else about the hero is unchanged.
  premium?: HeroConcept;
  // Set when a caller wraps this hero in <StickyScene image={heroImage}> —
  // the pinned sticky layer already paints `heroImage` behind this section,
  // so the hero skips rendering its own background media (avoids painting
  // the same image twice). The scrim still renders: it's what keeps the
  // headline legible against whatever's now behind it. Never true together
  // with `premium` — the video tier keeps its own non-pinned background.
  pinned?: boolean;
}) {
  const skipOwnBg = pinned && !premium;
  return (
    <section className="relative w-full" style={{ minHeight: "max(640px, 100svh)" }}>
      {/* full-bleed background media slot — Premium's moving hero if given,
          else a real image, else the placeholder label. Skipped entirely
          when `pinned`: the StickyScene wrapper already paints this (and
          StickyScene's own <Image priority> gets the LCP fast-path there). */}
      {!skipOwnBg && (
        <div className="group/media absolute inset-0 overflow-hidden" style={{ backgroundColor: "var(--d-surface)" }}>
          <FileBadge file={premium ? undefined : "hero.jpg"} />
          {premium ? (
            <PremiumHeroMedia concept={premium} fallbackImage={heroImage} />
          ) : heroImage ? (
            <div
              className="hero-img-settle h-full w-full"
              style={{ animation: "hero-img-settle 1400ms var(--d-ease-out) both" }}
            >
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ) : (
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
      )}
      {/* scrim so headlines stay readable on real footage — light demos pass a
          light scrim so the bright hero stays bright (SKILL §13f) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--d-hero-scrim)" }}
      />
      <div
        className={`${wrap} relative flex flex-col justify-end pt-28`}
        style={{ minHeight: "max(640px, 100svh)", paddingBottom: "8vh" }}
      >
        <HeroChoreographyStyle />
        <HeroRise delayMs={450} className="mb-6">
          <Eyebrow>{eyebrow}</Eyebrow>
        </HeroRise>
        <h1
          className="max-w-3xl text-balance text-[40px] font-bold leading-[1.04] tracking-[-0.035em] md:text-[72px]"
          style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)", fontOpticalSizing: "auto" }}
        >
          <HeroLine delayMs={150}>{line1}</HeroLine>
          <HeroLine delayMs={240}>{line2}</HeroLine>
        </h1>
        <HeroRise delayMs={510}>
          <p
            className="mt-6 max-w-xl text-pretty text-[17px] leading-[1.6]"
            style={{ color: "var(--d-body)" }}
          >
            {sub}
          </p>
        </HeroRise>
        <HeroRise delayMs={570} className="mt-9 flex flex-wrap items-center gap-3">
          <span
            className="d-press inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{
              background: "var(--d-accent)",
              color: "var(--d-onaccent)",
              boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
              border: "1px solid color-mix(in srgb, var(--d-accent) 92%, black)",
            }}
          >
            {primaryCta}
          </span>
          <span
            className="d-press inline-block px-6 py-3.5 text-[14px] font-semibold"
            style={{
              border: "1px solid var(--d-line)",
              color: "var(--d-fg)",
            }}
          >
            Call {phone}
          </span>
        </HeroRise>
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [rowW, setRowW] = useState(0);
  const [copies, setCopies] = useState(2);
  const reduced = useReducedMotion();

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

  // Pause off-thread work while scrolled out of view — an IntersectionObserver
  // toggling animation-play-state, not a scroll listener (craft pass
  // 2026-09-27). Hover-pause is pure CSS (.d-marquee-mask:hover, globals.css).
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { threshold: 0 },
    );
    io.observe(container);
    return () => io.disconnect();
  }, [reduced]);

  // Slow, deliberate constant speed (~40px/s) regardless of how many copies render.
  const dur = rowW ? rowW / 40 : 40;

  return (
    <div
      ref={containerRef}
      role="marquee"
      aria-label="Services"
      className="d-marquee-mask w-full overflow-hidden whitespace-nowrap py-7"
      style={{ borderBottom: "1px solid var(--d-line)" }}
    >
      <style>{`
        @keyframes demo-mq { to { transform: translateX(calc(-1 * var(--mq-w))); } }
        .demo-mq { display: inline-flex; animation: demo-mq var(--mq-dur) linear infinite; }
        @media (prefers-reduced-motion: reduce) { .demo-mq { animation: none; } }
      `}</style>
      <div
        ref={trackRef}
        className="demo-mq d-marquee-track"
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
              <Media label={`${thumbPrefix}: ${s.title} (4:3)`} file={`service-${i + 1}.jpg`} className="mb-6" />
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
  img,
  imgPosition,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  paragraph: string;
  checklist: string[];
  cta: string;
  mediaLabel: string;
  // An existing image already used elsewhere in this style (reused, never a
  // new asset). When given, this becomes StickyScene's Scene B: the image
  // pins while this block's own copy scrolls over it, per style.
  img?: string;
  // Object-position override, forwarded to StickyScene — see its own doc
  // comment. Only needed when the image's focal point isn't centered.
  imgPosition?: string;
}) {
  const copy = (
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
          className="d-press mt-9 inline-block px-6 py-3.5 text-[14px] font-semibold"
          style={{
            background: "var(--d-accent)",
            color: "var(--d-onaccent)",
            boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.16)",
            border: "1px solid color-mix(in srgb, var(--d-accent) 92%, black)",
          }}
        >
          {cta}
        </span>
      </Rise>
    </div>
  );

  if (img) {
    return (
      <StickyScene image={img} imagePosition={imgPosition}>
        <SceneBlock>
          <StickyReveal>{copy}</StickyReveal>
        </SceneBlock>
      </StickyScene>
    );
  }

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
      {copy}
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
  beforeFile = "before.jpg",
  afterFile = "after.jpg",
  ratio = "16/9",
}: {
  beforeImg?: string;
  afterImg?: string;
  beforeLabel: string;
  afterLabel: string;
  beforeFile?: string; // filename a client should use for their own photo
  afterFile?: string;
  ratio?: string;
}) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState(50);
  const [pressed, setPressed] = useState(false);
  const [transitionOk, setTransitionOk] = useState(false); // off during drag/keys, on for the hint
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const interacted = useRef(false);
  const id = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  // First-reveal hint (apple-design §8 "hint in the direction of the
  // gesture"): a single 50->62->50 sweep, 900ms total, so the slider reads as
  // draggable before anyone touches it. Skipped entirely once the user
  // interacts, and never runs under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const t1 = window.setTimeout(() => {
      if (interacted.current) return;
      setTransitionOk(true);
      setPos(62);
    }, 700);
    const t2 = window.setTimeout(() => {
      if (interacted.current) return;
      setPos(50);
    }, 700 + 450);
    const t3 = window.setTimeout(() => {
      setTransitionOk(false);
    }, 700 + 900 + 50);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [reduced]);

  const markInteracted = () => {
    interacted.current = true;
    setTransitionOk(false);
  };

  const onDown = (e: ReactPointerEvent) => {
    markInteracted();
    dragging.current = true;
    setPressed(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
    setPressed(false);
  };
  // Shift+arrow moves 20%, plain arrow moves 5% — overrides the range
  // input's native (1%) step so both live on the same control.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    markInteracted();
    const step = e.shiftKey ? 20 : 5;
    const delta = e.key === "ArrowRight" ? step : -step;
    setPos((p) => Math.max(0, Math.min(100, p + delta)));
  };

  const Slot = ({ img, label, file }: { img?: string; label: string; file: string }) => (
    <div
      className="group/media relative flex h-full w-full items-center justify-center p-4 text-center"
      style={{
        background: img
          ? `var(--d-surface) url("${img}") center/cover no-repeat`
          : "var(--d-surface)",
      }}
    >
      <FileBadge file={file} />
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
          <Slot img={beforeImg} label={beforeLabel} file={beforeFile} />
        </div>
        <div style={{ aspectRatio: ratio, border: "1px solid var(--d-line)" }}>
          <Slot img={afterImg} label={afterLabel} file={afterFile} />
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
        <Slot img={beforeImg} label={beforeLabel} file={beforeFile} />
      </div>
      {/* AFTER (over), clipped to the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Slot img={afterImg} label={afterLabel} file={afterFile} />
      </div>
      {/* labels fade based on handle position — each one recedes once its
          own side is nearly fully revealed, per the §14 "hint in the
          direction of the gesture" spirit rather than sitting static. */}
      <span
        className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-opacity"
        style={{ color: "var(--d-muted)", opacity: pos > 85 ? Math.max(0, (100 - pos) / 15) : 1, transitionDuration: "var(--d-dur-hover, 200ms)" }}
      >
        Before
      </span>
      <span
        className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-opacity"
        style={{ color: "var(--d-accent)", opacity: pos < 15 ? Math.max(0, pos / 15) : 1, transitionDuration: "var(--d-dur-hover, 200ms)" }}
      >
        After
      </span>
      {/* handle — ≥44px hit area; scales up on press with a soft spring;
          `left` only transitions during the first-reveal hint or keyboard
          steps, never while actively dragging (that would lag the pointer). */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: `${pos}%`,
          transform: "translateX(-50%)",
          transition: transitionOk ? `left 450ms var(--d-ease-in-out, cubic-bezier(0.77,0,0.175,1))` : undefined,
        }}
      >
        <div className="h-full" style={{ width: 2, background: "var(--d-accent)" }} />
        <motion.div
          className="absolute top-1/2 left-1/2 flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold"
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
          animate={{ transform: pressed ? "translate(-50%, -50%) scale(1.08)" : "translate(-50%, -50%) scale(1)" }}
          transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0.2 }}
        >
          ⇄
        </motion.div>
      </div>
      {/* a11y / keyboard control — plain arrow moves 5%, shift+arrow 20% */}
      <label className="sr-only" htmlFor={id}>
        Reveal amount
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={pos}
        onChange={(e) => {
          markInteracted();
          setPos(Number(e.target.value));
        }}
        onKeyDown={onKeyDown}
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
export type Work = { tag: string; caption: string; img?: string };
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
                  <Media label={`WORK: ${w.caption} (4:3)`} img={w.img} file={`work-${i + 1}.jpg`} rounded={false} />
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
        {shown.map((w, i) => (
          <Rise key={w.caption}>
            <figure className="group">
              <div className="overflow-hidden rounded-[var(--d-radius)]">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  <Media label={`WORK: ${w.caption} (4:3)`} img={w.img} file={`work-${i + 1}.jpg`} rounded={false} />
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
  const uid = useId();
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
          {/* grid-template-rows 0fr->1fr (animate/RECIPES.md accordion), not a
              Motion height animation — one open at a time, CSS transition so
              rapid toggling retargets instead of restarting. */}
          <style>{`
            .d-faq-panel {
              display: grid;
              grid-template-rows: 0fr;
              transition: grid-template-rows var(--d-dur-ui, 240ms) var(--d-ease-out, cubic-bezier(0.23,1,0.32,1));
            }
            .d-faq-panel[data-open="true"] { grid-template-rows: 1fr; }
            .d-faq-panel > div { overflow: hidden; min-height: 0; }
            .d-faq-panel .d-faq-answer {
              opacity: 0;
              transition: opacity 150ms ease;
            }
            .d-faq-panel[data-open="true"] .d-faq-answer {
              opacity: 1;
              transition: opacity 150ms ease 60ms;
            }
            .d-faq-plus {
              display: inline-block;
              transition: transform 200ms var(--d-ease-out, cubic-bezier(0.23,1,0.32,1));
            }
            .d-faq-plus[data-open="true"] { transform: rotate(45deg); }
            @media (prefers-reduced-motion: reduce) {
              .d-faq-panel { transition: none; }
              .d-faq-plus { transition: none; }
            }
          `}</style>
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-panel-${i}`;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid var(--d-line)" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="d-press flex w-full items-center gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
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
                    className="d-faq-plus text-[20px] leading-none"
                    data-open={isOpen}
                    aria-hidden
                    style={{ color: "var(--d-muted)" }}
                  >
                    +
                  </span>
                </button>
                <div id={panelId} className="d-faq-panel" data-open={isOpen} role="region">
                  <div>
                    <p className="d-faq-answer pb-5 pl-10 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ── Contact: copy + methods row + a plain reach-us block. ────────────────────
export function Contact({
  eyebrow,
  line1,
  line2,
  copy,
  phone,
  email,
  location,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  copy: string;
  phone: string;
  email: string;
  location: string;
  serviceLabel?: string;
  serviceOptions?: string[];
  propertyTypes?: string[];
  vehicleFields?: boolean; // Year / Make / Model row (auto body)
  claimToggle?: boolean; // "this is an insurance claim" toggle (auto body)
  minimal?: boolean;
}) {
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
          <div
            className="p-8"
            style={{
              background: "var(--d-bg)",
              border: "1px solid var(--d-line)",
              borderRadius: "var(--d-radius)",
            }}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
              Reach us directly
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[13px]" style={{ color: "var(--d-muted)" }}>
                  Call or text
                </p>
                <p className="mt-1 text-[22px] font-semibold tabular-nums" style={{ color: "var(--d-fg)" }}>
                  {phone}
                </p>
              </div>
              <div>
                <p className="text-[13px]" style={{ color: "var(--d-muted)" }}>
                  Email
                </p>
                <p className="mt-1 text-[22px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {email}
                </p>
              </div>
              <div>
                <p className="text-[13px]" style={{ color: "var(--d-muted)" }}>
                  Where
                </p>
                <p className="mt-1 text-[17px]" style={{ color: "var(--d-fg)" }}>
                  {location}
                </p>
              </div>
            </div>
          </div>
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
            className="mx-auto text-balance text-[36px] font-bold leading-[1.06] tracking-[-0.035em] md:text-[60px]"
            style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)", fontOpticalSizing: "auto" }}
          >
            {line1}
            <br />
            {line2}
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span
              className="px-7 py-4 text-[14px] font-semibold"
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              {cta}
            </span>
            <span
              className="d-press px-7 py-4 text-[14px] font-semibold tabular-nums"
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
  contactId = "contact",
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
  // Matches DemoHeader's contactId — the two demos with a pre-existing,
  // differently-named contact anchor pass the same override here.
  contactId?: string;
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
          <FooterCol
            title="Navigate"
            items={[
              { label: "Home", href: "#home" },
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Work", href: "#work" },
              { label: "Contact", href: `#${contactId}` },
            ]}
          />
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
      {/* Oversized wordmark, cropped by overflow — a quiet signature moment,
          not a reveal (it's below the fold at the very bottom of the page,
          so there's nothing to gate; it just renders). */}
      <div
        aria-hidden
        className="w-full overflow-hidden text-center leading-[0.85]"
        style={{
          fontFamily: "var(--d-display)",
          fontSize: "clamp(4rem, 14vw, 13rem)",
          letterSpacing: "-0.04em",
          color: "var(--d-fg)",
          opacity: 0.9,
          marginBottom: "-0.08em",
        }}
      >
        {name}
      </div>
      <VilasCredit />
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: (string | { label: string; href: string })[];
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-muted)" }}>
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--d-body)" }}>
        {items.map((i) => {
          const label = typeof i === "string" ? i : i.label;
          const href = typeof i === "string" ? undefined : i.href;
          return (
            <li key={label}>
              {href ? (
                <a
                  href={href}
                  className="d-link rounded-sm pb-0.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: "var(--d-accent)" }}
                >
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Mobile sticky CTA (craft pass 2026-09-27, item 17): a translucent bar
// with the style's two actions, shown only on mobile, only after the hero has
// scrolled past and only until the contact section comes into view. State
// toggles are cheap/discrete (not a per-frame visual scrub), so a
// rAF-throttled scroll check for "past the hero" plus an IntersectionObserver
// for "near contact" is the right tool — the actual enter/exit motion is a
// CSS transition (.d-sticky-cta, globals.css), not JS. Add once per demo,
// near the end of the page (it's `fixed`, position doesn't matter).
export function MobileStickyCta({
  phone,
  bookLabel = "Book",
  contactId = "contact",
}: {
  phone: string;
  bookLabel?: string;
  contactId?: string;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [nearContact, setNearContact] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPastHero(window.scrollY > window.innerHeight * 0.85);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById(contactId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setNearContact(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [contactId]);

  const shown = pastHero && !nearContact;
  const tel = phone.replace(/[^\d+]/g, "");

  return (
    <div
      className="d-material d-sticky-cta fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
      data-shown={shown}
      aria-hidden={!shown}
      style={{ borderColor: "var(--d-line)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-px" style={{ background: "var(--d-line)" }}>
        <a
          href={`tel:${tel}`}
          className="d-press d-no-select flex items-center justify-center py-4 text-[14px] font-semibold"
          style={{ background: "var(--d-bg)", color: "var(--d-fg)" }}
        >
          Call
        </a>
        <a
          href={`#${contactId}`}
          className="d-press d-no-select flex items-center justify-center py-4 text-[14px] font-semibold"
          style={{ background: "var(--d-bg)", color: "var(--d-accent)" }}
        >
          {bookLabel}
        </a>
      </div>
    </div>
  );
}

// ── Vilas credit — belongs to Vilas, not the demo (Demo nav/credit task §2).
// Fixed, theme-independent colors (deliberately NOT --d-* vars) so it reads
// identically, quietly, on every demo regardless of that demo's own palette.
// Never in the sticky Vilas bar, never affected by the $300/$500 toggle.
export function VilasCredit() {
  return (
    <div className="w-full py-3 text-center text-[12px]" style={{ background: "#101012", color: "#8a8a8a" }}>
      Site created by{" "}
      <a
        href="https://vilas.studio"
        className="rounded-sm underline underline-offset-2 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a8a8a]"
        style={{ color: "#b7b7b0" }}
      >
        vilas.studio
      </a>
    </div>
  );
}
