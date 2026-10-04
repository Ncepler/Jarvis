import type React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../brand";
import { BLOCK, HookLead, MaskLine, Paper, SECOND_PAIR_TOP, displayType } from "./parts";

// 0.0–2.8s. The hook is fully on screen at frame 0 (muted viewers, no intro
// card); the turn line follows a beat later.
export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Paper />
      <HookLead outAt={70} />
      <div
        style={{
          position: "absolute",
          left: BLOCK.left,
          top: SECOND_PAIR_TOP,
          color: C.muted,
          ...displayType,
        }}
      >
        <MaskLine inAt={10} outAt={72}>
          Invisible
        </MaskLine>
        <MaskLine inAt={13} outAt={74}>
          online.
        </MaskLine>
      </div>
    </AbsoluteFill>
  );
};
