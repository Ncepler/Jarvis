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

// ── §16a palette (duplicated here on purpose — this file has zero imports
// from MagicianDemo.tsx or system.tsx so it stays fully self-contained). ────
const BG = "#0A0711"; // velvet near-black — the magician's page background
// BG at low alpha, drawn each frame instead of a full clearRect — leaves a
// soft fade-trail behind the sparks. Only correct because the page is dark
// (§16a); a light-bg niche would need a real clearRect instead.
const BG_R = parseInt(BG.slice(1, 3), 16);
const BG_G = parseInt(BG.slice(3, 5), 16);
const BG_B = parseInt(BG.slice(5, 7), 16);
const BG_FADE = `rgba(${BG_R},${BG_G},${BG_B},0.15)`;
const SHAFT = "#14101D"; // --surface — the wand shaft, dark/near-black
const SHAFT_EDGE = "#7A7388"; // --muted — thin edge so the shaft reads against the velvet bg
const HANDLE = "#B9B2C2"; // --body — lighter grip detail
const TIP_GOLD = "#D4A53C"; // --accent — stage gold, the sparkle at the tip
const SPARK_CORE = "255,248,220"; // #fff8dc, cream core
const SPARK_TAIL = "255,179,71"; // #ffb347, amber fade

const WAND_SIZE = 28; // px — about the size of a normal cursor
const TIP = { x: 24, y: 8 }; // the tip's local position inside the wand's own box
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
      viewBox={`0 0 ${WAND_SIZE} ${WAND_SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* shaft: dark near-black fill with a thin lighter edge underneath so it
          doesn't vanish against the velvet-black magician background */}
      <line x1={4} y1={23} x2={21} y2={9} stroke={SHAFT_EDGE} strokeWidth={4.2} strokeLinecap="round" />
      <line x1={4} y1={23} x2={21} y2={9} stroke={SHAFT} strokeWidth={3} strokeLinecap="round" />
      {/* handle grip — the lighter detail at the base */}
      <circle cx={5.5} cy={21.5} r={2.3} fill={HANDLE} opacity={0.92} />
      {/* tip sparkle: a soft glow behind a 4-point star */}
      <circle cx={TIP.x} cy={TIP.y} r={5} fill={TIP_GOLD} opacity={0.35} style={{ filter: "blur(2.5px)" }} />
      <path
        d={`M${TIP.x} 3 L${TIP.x + 1.2} ${TIP.y - 1.2} L${TIP.x + 5} ${TIP.y} L${TIP.x + 1.2} ${TIP.y + 1.2} L${TIP.x} 13 L${TIP.x - 1.2} ${TIP.y + 1.2} L${TIP.x - 5} ${TIP.y} L${TIP.x - 1.2} ${TIP.y - 1.2} Z`}
        fill={TIP_GOLD}
      />
    </svg>
  );
}

function makeSpark(x: number, y: number, dx: number, dy: number): Spark {
  // opposite of the current motion direction — sparks fly off the back of
  // the tip as it moves, like a sparkler
  const oppositeAngle = Math.atan2(-dy, -dx);
  const spread = (Math.random() - 0.5) * (Math.PI / 2); // ±45°
  const angle = oppositeAngle + spread;
  const spreadSpeed = 1 + Math.random() * 3; // 1–4 px/frame
  return {
    x,
    y,
    // a fraction of the wand's own motion (trails behind) + the spread cone
    vx: dx * 0.3 + Math.cos(angle) * spreadSpeed,
    vy: dy * 0.3 + Math.sin(angle) * spreadSpeed,
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

    const onEnter = () => {
      activeRef.current = true;
      setVisible(true);
    };
    const onLeave = () => {
      activeRef.current = false;
      setVisible(false);
    };
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    zone.addEventListener("mouseenter", onEnter);
    zone.addEventListener("mouseleave", onLeave);
    zone.addEventListener("mousemove", onMove);

    const ctx = canvasRef.current?.getContext("2d") ?? null;

    const frame = () => {
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
      if (ctx) {
        const { w, h } = sizeRef.current;
        // dark magician background → fade-trail instead of a full clear
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = BG_FADE;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = "lighter";
        const arr = sparksRef.current;
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

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      zone.removeEventListener("mouseenter", onEnter);
      zone.removeEventListener("mouseleave", onLeave);
      zone.removeEventListener("mousemove", onMove);
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
