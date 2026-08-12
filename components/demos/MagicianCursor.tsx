"use client";

// MagicianCursor.tsx — a magic-wand mouse cursor with speed-driven ember
// sparks. Scoped STRICTLY to the Elias Vane demo (SKILL §16, the theatrical
// exception) — nothing else on the site should ever see this file imported.
//
// Architecture note (why this isn't a Next.js route guard): this project has
// no per-demo routes — every demo, including the magician, is a plain React
// component that mounts inline inside the single `/` page's gallery panel
// (see components/sections/Gallery.tsx — `<Demo />` only renders while that
// project's panel is open) and unmounts the instant the panel closes or a
// different demo opens. So "only on the magician page" is implemented two
// ways at once, belt-and-suspenders:
//   1. Mount scope — <MagicianCursor> wraps ALL of MagicianDemo's content
//      and nothing else, so it only ever exists in the tree while that demo
//      is the one open. Closing it / opening a different demo unmounts this
//      file entirely (React cleans up the rAF loop, listeners, and the
//      portaled DOM nodes automatically).
//   2. Pointer scope — the effect additionally only activates while the
//      mouse is actually over the wrapped content (onMouseEnter/Leave on the
//      zone div), so even if the magician panel stays mounted while the
//      visitor scrolls back up to browse the rest of the single-page site,
//      the wand cannot leak onto the main Vilas site or any other demo.
//
// Rendering note: the demo panel that hosts this is a `motion.div` that
// slides in (Gallery.tsx's HomepagePanel), which puts an inline `transform`
// on an ancestor. Per the CSS spec, a transformed ancestor becomes the
// containing block for `position: fixed` descendants — so a naive fixed
// canvas/wand nested normally in the tree would track the PANEL, not the
// viewport. We sidestep that by portaling the canvas + wand straight into
// `document.body`, which is unaffected by any ancestor transform.
//
// Self-contained: canvas particle sim + inline SVG wand, no external deps,
// no imports from the shared local-service spine. Colors pulled from SKILL
// §16a (velvet black / stage gold / ember).

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// Wand is strictly black + white (Noah's call) — no palette gold on it, the
// gold/ember stays reserved for the sparks themselves.
const WAND_BLACK = "#0A0A0A";
const WAND_WHITE = "#FFFFFF";
const SPARK_CORE = "255,248,220"; // #fff8dc, cream core
const SPARK_TAIL = "255,179,71"; // #ffb347, amber fade

// The SVG is drawn in a fixed 28-unit design space (paths below never
// change); WAND_SIZE is the actual rendered px — bump that alone to resize
// the whole wand, everything scales proportionally.
const DESIGN_SIZE = 28;
const WAND_SIZE = 34; // px — slightly bigger than a normal cursor
const WAND_SCALE = WAND_SIZE / DESIGN_SIZE;
const TIP_DESIGN = { x: 24, y: 8 }; // tip position in the 28-unit design space
// tip position in actual rendered px — this is what the positioning math
// (translate offset, hover-scale transform-origin) needs
const TIP = { x: TIP_DESIGN.x * WAND_SCALE, y: TIP_DESIGN.y * WAND_SCALE };
const MAX_PARTICLES = 300;
const GRAVITY = 0.15;
const LIFE_DECAY = 0.02;

type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number };

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
  }, []);
  return coarse;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// ── The wand — inline SVG, angled ~-35° so the tip leads up-and-right. ──────
function WandSVG() {
  return (
    <svg
      width={WAND_SIZE}
      height={WAND_SIZE}
      viewBox={`0 0 ${DESIGN_SIZE} ${DESIGN_SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* shaft: black fill with a thin white edge underneath so it doesn't
          vanish against the velvet-black magician background */}
      <line x1={4} y1={23} x2={21} y2={9} stroke={WAND_WHITE} strokeWidth={4.2} strokeLinecap="round" />
      <line x1={4} y1={23} x2={21} y2={9} stroke={WAND_BLACK} strokeWidth={3} strokeLinecap="round" />
      {/* handle grip — the lighter (white) detail at the base */}
      <circle cx={5.5} cy={21.5} r={2.3} fill={WAND_WHITE} opacity={0.92} />
      {/* tip sparkle: a soft white glow behind a 4-point star */}
      <circle cx={TIP_DESIGN.x} cy={TIP_DESIGN.y} r={5} fill={WAND_WHITE} opacity={0.4} style={{ filter: "blur(2.5px)" }} />
      <path
        d={`M${TIP_DESIGN.x} 3 L${TIP_DESIGN.x + 1.2} ${TIP_DESIGN.y - 1.2} L${TIP_DESIGN.x + 5} ${TIP_DESIGN.y} L${TIP_DESIGN.x + 1.2} ${TIP_DESIGN.y + 1.2} L${TIP_DESIGN.x} 13 L${TIP_DESIGN.x - 1.2} ${TIP_DESIGN.y + 1.2} L${TIP_DESIGN.x - 5} ${TIP_DESIGN.y} L${TIP_DESIGN.x - 1.2} ${TIP_DESIGN.y - 1.2} Z`}
        fill={WAND_WHITE}
      />
    </svg>
  );
}

function makeSpark(x: number, y: number, dx: number, dy: number): Spark {
  // Sparks launch ONLY opposite the current travel direction (a spread cone
  // centered dead-opposite, no forward-inherited component pulling them
  // toward the motion) — then gravity takes over frame by frame in the main
  // loop, so they arc down and fall like real sparks off a struck flint.
  const oppositeAngle = Math.atan2(-dy, -dx);
  const spread = (Math.random() - 0.5) * (Math.PI / 2); // ±45°
  const angle = oppositeAngle + spread;
  const speed = 1 + Math.random() * 3; // 1–4 px/frame
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0.6 + Math.random() * 0.4,
    size: 1 + Math.random() * 2,
  };
}

// ── The overlay: one shared canvas + the wand, both fixed to the viewport
// via a portal (so the sliding demo panel's transform can't hijack them). ───
function CursorOverlay({ zoneRef }: { zoneRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wandOuterRef = useRef<HTMLDivElement>(null);
  const wandInnerRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: -999, y: -999 });
  const prevFrameRef = useRef({ x: -999, y: -999 });
  const activeRef = useRef(false);
  const hoverRef = useRef(false);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [visible, setVisible] = useState(false);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w, h, dpr };
  }, []);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    resize();
    window.addEventListener("resize", resize);

    // Geometry-based activity check — NOT just mouseenter/mouseleave.
    // Browsers only fire mouseleave on actual pointer movement, never on
    // scroll alone: a visitor who moves the wand around then scrolls the
    // page (wheel/trackpad, cursor never physically moving again) leaves
    // the zone without ever generating a mouseleave event. That left
    // `activeRef` stuck true, which kept the fade-trail compositing over
    // the full viewport every frame forever — the "whole page goes dark"
    // bug this function exists to prevent. So containment is re-derived
    // from the actual DOM rect (cheap) on real mousemove, on scroll, AND
    // once per animation frame for as long as the loop is running (e.g.
    // sparks still fading right as a scroll happens) — always self-
    // correcting within a frame or two, never dependent on a single event.
    const evaluate = () => {
      const rect = zone.getBoundingClientRect();
      const { x, y } = mouseRef.current;
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (inside !== activeRef.current) {
        activeRef.current = inside;
        setVisible(inside);
      }
      // the loop pauses itself once fully idle (see the end of `frame`
      // below) — restart it the moment the pointer is inside again
      if (inside && rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      evaluate();
    };
    // window-scoped (not zone-scoped) — needed to notice the pointer
    // crossing back IN, and to keep position fresh right up to the edge
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", evaluate, { passive: true });

    const ctx = canvasRef.current?.getContext("2d") ?? null;

    const frame = () => {
      evaluate();
      const { x, y } = mouseRef.current;
      const dx = x - prevFrameRef.current.x;
      const dy = y - prevFrameRef.current.y;
      const speed = Math.hypot(dx, dy);
      prevFrameRef.current = { x, y };

      // wand tracks the raw cursor position, no easing — instant 1:1 follow
      if (wandOuterRef.current) {
        wandOuterRef.current.style.transform = `translate(${x - TIP.x}px, ${y - TIP.y}px)`;
      }

      if (activeRef.current) {
        // hover-scale: once per frame is plenty, cheaper than per mousemove
        const el = document.elementFromPoint(x, y);
        const interactive = !!el?.closest(
          'a, button, [role="button"], input, select, textarea, label',
        );
        if (interactive !== hoverRef.current) {
          hoverRef.current = interactive;
          if (wandInnerRef.current) {
            wandInnerRef.current.style.transform = `scale(${interactive ? 1.15 : 1})`;
          }
        }

        // speed-driven emission
        let n = 0;
        if (speed < 2) {
          n = Math.random() < 0.06 ? 1 : 0; // stationary/slow: quiet, occasional spark
        } else {
          n = Math.min(15, Math.floor(Math.max(0, (speed - 2) * 0.5)));
        }
        for (let i = 0; i < n; i++) {
          sparksRef.current.push(makeSpark(x, y, dx, dy));
        }
        if (sparksRef.current.length > MAX_PARTICLES) {
          sparksRef.current.splice(0, sparksRef.current.length - MAX_PARTICLES);
        }
      }

      // update + draw
      const arr = sparksRef.current;
      if (ctx) {
        const { w, h } = sizeRef.current;
        // A hard clear every frame — NOT a semi-transparent "fade" rect.
        // The fade-rect trick (repeatedly compositing rgba(bg, .15) with
        // source-over to leave a soft motion trail) looks fine for a few
        // frames, but per-pixel alpha compositing is unbounded: a pixel
        // that never gets a bright particle drawn over it keeps
        // accumulating that 0.15 alpha frame after frame and converges to
        // FULLY OPAQUE within well under a second of sustained movement
        // (~15-20 frames), independent of any scroll/idle state — that's
        // what was painting the whole viewport dark navy. Individual
        // sparks already carry their own soft-edged radial gradient and
        // fade via `life`, so a clean per-frame clear loses none of the
        // visual softness while making the "whole screen goes dark" bug
        // structurally impossible.
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (let i = arr.length - 1; i >= 0; i--) {
          const p = arr[i];
          p.vy += GRAVITY;
          p.vx += (Math.random() - 0.5) * 0.1; // jitter — drift, not straight lines
          p.vy += (Math.random() - 0.5) * 0.1;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= LIFE_DECAY;
          if (p.life <= 0) {
            arr.splice(i, 1);
            continue;
          }
          const alpha = Math.max(0, p.life);
          const r = Math.max(0.4, p.size * alpha);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          grad.addColorStop(0, `rgba(${SPARK_CORE},${alpha})`);
          grad.addColorStop(0.5, `rgba(${SPARK_TAIL},${alpha * 0.7})`);
          grad.addColorStop(1, `rgba(${SPARK_TAIL},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      // stop scheduling frames once fully idle — no mouse in the zone and
      // nothing left animating. `evaluate()` restarts the loop the instant
      // the pointer is back inside. Otherwise the rAF loop (and the CPU it
      // burns) would run forever for as long as the magician demo panel
      // stays open, even hours after the visitor scrolled past it to browse
      // the rest of the single-page site.
      rafRef.current = activeRef.current || arr.length > 0 ? requestAnimationFrame(frame) : undefined;
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", evaluate);
    };
    // zoneRef.current is stable for this component's lifetime (set once by
    // the parent before mounting the portal — see MagicianCursor below)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resize]);

  const fixedBase: CSSProperties = { position: "fixed", left: 0, top: 0, pointerEvents: "none" };

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" style={{ ...fixedBase, inset: 0, zIndex: 9998 }} />
      <div
        ref={wandOuterRef}
        style={{ ...fixedBase, zIndex: 9999, opacity: visible ? 1 : 0, transition: "opacity 120ms ease" }}
      >
        <div ref={wandInnerRef} style={{ transformOrigin: `${TIP.x}px ${TIP.y}px`, transition: "transform 150ms ease" }}>
          <WandSVG />
        </div>
      </div>
    </>
  );
}

// ── Public component: wrap the magician demo's content in this, once. ───────
export function MagicianCursor({ children }: { children: ReactNode }) {
  const isTouch = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const zoneRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  // Custom cursors have no place on touch devices, and this is a purely
  // decorative motion effect — bail out entirely for reduced-motion too
  // (consistent with every other moving part on this demo, SKILL §16f).
  const disabled = isTouch || reducedMotion;

  if (disabled) return <>{children}</>;

  return (
    <div ref={zoneRef} className="ev-cursor-zone">
      {/* scoped to THIS subtree only — never a global cursor rule */}
      <style>{`
        .ev-cursor-zone, .ev-cursor-zone * { cursor: none !important; }
      `}</style>
      {children}
      {portalReady && zoneRef.current
        ? createPortal(<CursorOverlay zoneRef={zoneRef} />, document.body)
        : null}
    </div>
  );
}
