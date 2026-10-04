import type React from "react";
import { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_IN, EASE_OUT, GROTESK, clamp } from "../brand";

// Bone field with a static paper grain. Static on purpose: animated grain
// shimmers and eats bitrate once Instagram re-encodes it.
export const Paper: React.FC = () => {
  const id = useId();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.32, mixBlendMode: "soft-light" }}
      >
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

type MaskLineProps = {
  readonly children: React.ReactNode;
  // Frame the line starts rising into its mask. Omit = already in at frame 0.
  readonly inAt?: number;
  // Frame the line starts leaving upward. Omit = stays.
  readonly outAt?: number;
  readonly dur?: number;
  readonly outDur?: number;
  readonly style?: React.CSSProperties;
};

// One line of type that slides up through an overflow mask — the same reveal
// the site's SectionHeading uses. The mask is padded so descenders survive.
export const MaskLine: React.FC<MaskLineProps> = ({
  children,
  inAt,
  outAt,
  dur = 14,
  outDur = 10,
  style,
}) => {
  const frame = useCurrentFrame();
  const enter =
    inAt === undefined
      ? 1
      : interpolate(frame, [inAt, inAt + dur], [0, 1], { ...clamp, easing: EASE_OUT });
  const leave =
    outAt === undefined
      ? 0
      : interpolate(frame, [outAt, outAt + outDur], [0, 1], { ...clamp, easing: EASE_IN });

  return (
    <div
      style={{
        overflow: "hidden",
        paddingTop: "0.08em",
        marginTop: "-0.08em",
        paddingBottom: "0.16em",
        marginBottom: "-0.16em",
      }}
    >
      <div style={{ translate: `0 ${(1 - enter) * 130 - leave * 130}%`, ...style }}>
        {children}
      </div>
    </div>
  );
};

// Shared layout for the four-line display blocks (hook + turn), so the
// loop-back lands on exactly the pixels frame 0 starts on.
export const BLOCK = { left: 96, top: 560, size: 158, lineHeight: 1, gap: 44 } as const;

export const displayType: React.CSSProperties = {
  fontFamily: GROTESK,
  fontWeight: 500,
  fontSize: BLOCK.size,
  lineHeight: BLOCK.lineHeight,
  letterSpacing: "-0.04em",
  whiteSpace: "nowrap",
};

// "Great at / the work." — frame 0 of the reel, and the last thing the reveal
// scene draws so the loop is seamless.
export const HookLead: React.FC<{ readonly inAt?: number; readonly outAt?: number }> = ({
  inAt,
  outAt,
}) => (
  <div
    style={{
      position: "absolute",
      left: BLOCK.left,
      top: BLOCK.top,
      color: C.ink,
      ...displayType,
    }}
  >
    <MaskLine inAt={inAt} outAt={outAt}>
      Great at
    </MaskLine>
    <MaskLine
      inAt={inAt === undefined ? undefined : inAt + 2}
      outAt={outAt === undefined ? undefined : outAt + 2}
    >
      the work.
    </MaskLine>
  </div>
);

// Top of the second pair of lines in a display block.
export const SECOND_PAIR_TOP = BLOCK.top + 2 * BLOCK.size * BLOCK.lineHeight + BLOCK.gap;
