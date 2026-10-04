import type React from "react";
import { Series, useVideoConfig } from "remotion";
import { HookScene } from "./HookScene";
import { ListScene } from "./ListScene";
import { RevealScene } from "./RevealScene";
import { TurnScene } from "./TurnScene";

// "Great at the work" — Instagram reel, 1080×1920, ~15s, loops seamlessly
// (RevealScene ends on HookScene's frame 0). Music goes on in Instagram.
export const VilasReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence name="Hook" durationInFrames={84} premountFor={fps}>
        <HookScene />
      </Series.Sequence>
      <Series.Sequence name="List" durationInFrames={140} premountFor={fps}>
        <ListScene />
      </Series.Sequence>
      <Series.Sequence name="Turn" durationInFrames={78} premountFor={fps}>
        <TurnScene />
      </Series.Sequence>
      <Series.Sequence name="Reveal" durationInFrames={150} premountFor={fps}>
        <RevealScene />
      </Series.Sequence>
    </Series>
  );
};
