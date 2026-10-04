import type React from "react";
import { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_IN_OUT, EASE_OUT, GROTESK, MONO, clamp } from "../brand";
import { Paper } from "../reel/parts";

// Mirrors COPY.marquee in lib/site.ts — the trades the studio builds for.
// Data in, video out: change this list and the drum re-renders itself.
export const TRADES = [
  "Florists",
  "Landscapers",
  "Power washing",
  "Lawn care",
  "Bakeries",
  "Barbershops",
  "Contractors",
  "Auto body",
];

const STEP = 16; // frames per click of the drum
const FIRST = 14;
const RADIUS = 230;
const CENTER_Y = 1010;

// Rotation in "items" (1 = one trade). Each click eases in and out, so the
// drum lands, rests a beat, then turns again.
const turns = (f: number) => {
  const k = Math.floor((f - FIRST) / STEP);
  if (f < FIRST) return 0;
  const local = (f - FIRST - k * STEP) / 11;
  return Math.min(k, TRADES.length) + (k >= TRADES.length ? 0 : EASE_IN_OUT(Math.min(local, 1)));
};

// A 3D drum of type in plain CSS. Each name sits on the face of a cylinder;
// a directional SVG blur, scaled by the drum's angular speed, smears the
// letters vertically only while it spins.
export const Trades: React.FC = () => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, "");
  const rot = turns(frame);
  const speed = Math.abs(turns(frame + 0.5) - turns(frame - 0.5));
  const step = 360 / TRADES.length;
  const enter = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: EASE_OUT });

  return (
    <AbsoluteFill>
      <Paper />
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation={`0 ${speed * 26}`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 44,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.muted,
          opacity: enter,
        }}
      >
        Built for
      </div>
      {[-1, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            top: CENTER_Y + side * 92,
            height: 2,
            backgroundColor: C.accent,
            transformOrigin: "center",
            scale: `${enter} 1`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CENTER_Y,
          perspective: 2300,
          perspectiveOrigin: "50% 0",
        }}
      >
        {TRADES.map((trade, i) => {
          const angle = i * step - rot * step;
          const wrapped = ((((angle + 180) % 360) + 360) % 360) - 180;
          const facing = Math.cos((wrapped * Math.PI) / 180);
          return (
            <div
              key={trade}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                textAlign: "center",
                fontFamily: GROTESK,
                fontWeight: 500,
                fontSize: 96,
                lineHeight: 1,
                letterSpacing: "-0.035em",
                whiteSpace: "nowrap",
                color: C.ink,
                translate: "0 -50%",
                transform: `rotateX(${-wrapped}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
                opacity: enter * Math.pow(Math.max(facing, 0), 2.2),
                filter: `url(#${id})`,
              }}
            >
              {trade}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
