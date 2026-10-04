import type React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../brand";
import { BLOCK, MaskLine, Paper, SECOND_PAIR_TOP, displayType } from "./parts";

// 7.5–10s. Flatter the owner, blame the site. Same four-line grid as the
// hook so the two read as a pair.
export const TurnScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Paper />
      <div
        style={{
          position: "absolute",
          left: BLOCK.left,
          top: BLOCK.top,
          color: C.ink,
          ...displayType,
        }}
      >
        <MaskLine inAt={0} outAt={62}>
          It’s not
        </MaskLine>
        <MaskLine inAt={3} outAt={64}>
          you.
        </MaskLine>
      </div>
      <div
        style={{
          position: "absolute",
          left: BLOCK.left,
          top: SECOND_PAIR_TOP,
          ...displayType,
        }}
      >
        <MaskLine inAt={14} outAt={66} style={{ color: C.muted }}>
          It’s the
        </MaskLine>
        <MaskLine inAt={17} outAt={68} style={{ color: C.accent }}>
          website.
        </MaskLine>
      </div>
    </AbsoluteFill>
  );
};
