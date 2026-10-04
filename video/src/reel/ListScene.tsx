import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE_OUT, GROTESK, MONO, clamp } from "../brand";
import { BLOCK, MaskLine, Paper } from "./parts";

type ItemProps = {
  readonly index: string;
  readonly inAt: number;
  readonly outAt: number;
  readonly children: string;
};

// One sign of a dated site: rises in, then a bronze strike draws through it
// and the words fall back. The strike sits outside the dimmed span so it
// stays full strength.
const Item: React.FC<ItemProps> = ({ index, inAt, outAt, children }) => {
  const frame = useCurrentFrame();
  return (
    <MaskLine inAt={inAt} outAt={outAt}>
      <span
        style={{
          display: "inline-block",
          width: 92,
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: "0.04em",
          color: C.muted,
          verticalAlign: "0.62em",
        }}
      >
        {index}
      </span>
      <span style={{ position: "relative", display: "inline-block" }}>
        <span
          style={{
            opacity: interpolate(frame, [inAt + 12, inAt + 22], [1, 0.4], clamp),
          }}
        >
          {children}
        </span>
        <span
          style={{
            position: "absolute",
            left: -8,
            right: -8,
            top: "56%",
            height: 7,
            backgroundColor: C.accent,
            transformOrigin: "left center",
            scale: `${interpolate(frame, [inAt + 12, inAt + 22], [0, 1], { ...clamp, easing: EASE_OUT })} 1`,
          }}
        />
      </span>
    </MaskLine>
  );
};

// 2.8–7.5s. What a customer actually finds when they look you up.
export const ListScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Paper />
      <div
        style={{
          position: "absolute",
          left: BLOCK.left,
          top: 540,
          fontFamily: MONO,
          fontSize: 44,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.muted,
        }}
      >
        <MaskLine inAt={0} outAt={118}>
          What customers find:
        </MaskLine>
      </div>
      <div
        style={{
          position: "absolute",
          left: BLOCK.left,
          top: 650,
          display: "flex",
          flexDirection: "column",
          gap: 46,
          fontFamily: GROTESK,
          fontWeight: 500,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
          color: C.ink,
        }}
      >
        <Item index="01" inAt={6} outAt={120}>
          Site from 2011.
        </Item>
        <Item index="02" inAt={30} outAt={122}>
          Facebook page only.
        </Item>
        <Item index="03" inAt={54} outAt={124}>
          Can’t tap to call.
        </Item>
        <Item index="04" inAt={78} outAt={126}>
          Flip-phone photos.
        </Item>
      </div>
    </AbsoluteFill>
  );
};
