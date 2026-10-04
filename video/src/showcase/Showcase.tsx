import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type React from "react";
import { useVideoConfig } from "remotion";
import { Finale } from "./Finale";
import { Sculpture } from "./Sculpture";
import { Silk } from "./Silk";
import { Trades } from "./Trades";

// What Remotion can do, on the Vilas brand: GPU particles, real-time 3D,
// a live shader, a data-driven 3D drum, and a seamless loop. 1080×1920.
export const Showcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Sculpture" durationInFrames={330} premountFor={fps}>
        <Sculpture />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Silk" durationInFrames={150} premountFor={fps}>
        <Silk />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Trades" durationInFrames={150} premountFor={fps}>
        <Trades />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 16 })} />
      <TransitionSeries.Sequence name="Finale" durationInFrames={120} premountFor={fps}>
        <Finale />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
