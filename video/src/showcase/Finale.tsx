import { ThreeCanvas } from "@remotion/three";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, C, DOMAIN, EASE_IN, EASE_IN_OUT, EASE_OUT, GROTESK, MONO, clamp } from "../brand";
import { MaskLine } from "../reel/parts";
import { sampleWord, useGlyphs, type Glyphs } from "./glyphs";
import { Particles, makeParticles } from "./particles";
import { OPENING_CAMERA, PARTICLE_COUNT, PARTICLE_SEED } from "./Sculpture";
import { CodeLabel, FOV, Rig, pixelScaleFor } from "./stage";

export const FINALE_DURATION = 120;
const LAST = FINALE_DURATION - 1;

const FinaleScene: React.FC<{ readonly glyphs: Glyphs }> = ({ glyphs }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  // Same seed as the opening, so the swirl is the same galaxy.
  const particles = useMemo(
    () => makeParticles(sampleWord(["V", "I", "L", "A", "S"], glyphs, PARTICLE_COUNT, 23, 0.016), PARTICLE_SEED),
    [glyphs],
  );
  const back = { ...clamp, easing: EASE_IN_OUT };
  return (
    <Rig
      distance={interpolate(frame, [84, 112], [10.6, OPENING_CAMERA.distance], back)}
      azimuth={interpolate(frame, [84, 112], [0, OPENING_CAMERA.azimuth], back)}
      elevation={interpolate(frame, [84, 112], [0, OPENING_CAMERA.elevation], back)}
    >
      <Particles
        data={particles}
        frame={frame}
        fps={fps}
        pixelScale={pixelScaleFor(height)}
        // the galaxy clock reaches t = 0 on the last frame — the opening's t
        tOffset={-LAST / fps}
        assemble={[0, 18, 22]}
        disperse={[86, 14, 18]}
      />
    </Rig>
  );
};

// 20–24s. The galaxy condenses into the full name, holds with the domain and
// the promise, then blows back out into the exact opening frame: the video
// loops with no seam.
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glyphs = useGlyphs();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <ThreeCanvas width={width} height={height} flat camera={{ fov: FOV, position: [0, 0, 0], near: 0.1, far: 100 }}>
        <color attach="background" args={[C.bg]} />
        {glyphs ? <FinaleScene glyphs={glyphs} /> : null}
      </ThreeCanvas>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1096,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 50,
          color: C.muted,
          opacity:
            interpolate(frame, [30, 44], [0, 1], { ...clamp, easing: EASE_OUT }) *
            interpolate(frame, [82, 92], [1, 0], { ...clamp, easing: EASE_IN }),
        }}
      >
        {DOMAIN.slice(BRAND.length)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1220,
          textAlign: "center",
          fontFamily: GROTESK,
          fontWeight: 500,
          fontSize: 68,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: C.ink,
        }}
      >
        <MaskLine inAt={38} outAt={80}>
          A website that
        </MaskLine>
        <MaskLine inAt={41} outAt={82}>
          looks expensive.
        </MaskLine>
        <MaskLine inAt={50} outAt={84} style={{ color: C.muted }}>
          It wasn’t.
        </MaskLine>
      </div>
      <CodeLabel frame={frame} inAt={100} />
    </AbsoluteFill>
  );
};
