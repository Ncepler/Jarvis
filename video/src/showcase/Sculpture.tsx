import { ThreeCanvas } from "@remotion/three";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { C, EASE_IN_OUT, EASE_OUT, clamp } from "../brand";
import { BASELINE, LETTERS, layoutWord, sampleWord, useGlyphs, type Glyphs, type Letter } from "./glyphs";
import { Particles, makeParticles } from "./particles";
import { CodeLabel, FOV, KeyLight, Rig, StudioEnvironment, pixelScaleFor } from "./stage";

export const PARTICLE_COUNT = 9000;
export const PARTICLE_SEED = 7;
const DEPTH = 0.24;
const BEVEL = 0.014;

const VAL: Letter[] = ["V", "A", "L"];
const VALIS: Letter[] = ["V", "A", "L", "I", "S"];
const VILAS: Letter[] = ["V", "I", "L", "A", "S"];

// Opening camera — the finale must land on exactly these values to loop.
export const OPENING_CAMERA = { distance: 9.5, azimuth: 0.55, elevation: 0.12 };

type LetterSolid = { geometry: THREE.ExtrudeGeometry; cx: number; cy: number };

const buildSolids = (g: Glyphs) => {
  const out = {} as Record<Letter, LetterSolid>;
  for (const l of LETTERS) {
    const geometry = new THREE.ExtrudeGeometry(g.shapes[l], {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: 0.008,
      bevelSegments: 4,
      curveSegments: 14,
    });
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    // front face at z = 0, so scaling z grows the letter backwards from it
    geometry.translate(-cx, -cy, -DEPTH);
    out[l] = { geometry, cx, cy };
  }
  return out;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SculptureScene: React.FC<{ readonly glyphs: Glyphs }> = ({ glyphs }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const solids = useMemo(() => buildSolids(glyphs), [glyphs]);
  const particles = useMemo(
    () => makeParticles(sampleWord(VAL, glyphs, PARTICLE_COUNT, 11, BEVEL + 0.002), PARTICLE_SEED),
    [glyphs],
  );
  const materials = useMemo(() => {
    const m = {} as Record<Letter, THREE.MeshPhysicalMaterial>;
    for (const l of LETTERS) {
      m[l] = new THREE.MeshPhysicalMaterial({
        color: C.ink,
        roughness: 0.3,
        metalness: 0.25,
        clearcoat: 0.8,
        clearcoatRoughness: 0.18,
      });
    }
    return m;
  }, []);

  const xVal = layoutWord(VAL, glyphs);
  const xValis = layoutWord(VALIS, glyphs);
  const xVilas = layoutWord(VILAS, glyphs);

  // camera: drift in to a front-on read of VAL, back out for VALIS, then a
  // low three-quarter hero angle once the word resolves
  const distance = interpolate(frame, [0, 130, 168, 206, 250, 318], [OPENING_CAMERA.distance, 7.8, 7.8, 10.6, 10.6, 9.8], {
    ...clamp,
    easing: EASE_IN_OUT,
  });
  const azimuth =
    interpolate(frame, [0, 130, 250, 318], [OPENING_CAMERA.azimuth, 0, 0, -0.4], { ...clamp, easing: EASE_IN_OUT }) +
    0.015 * Math.sin(frame / 37);
  const elevation = interpolate(frame, [0, 130, 250, 318], [OPENING_CAMERA.elevation, 0, 0, 0.17], {
    ...clamp,
    easing: EASE_IN_OUT,
  });

  const solidify = interpolate(frame, [150, 178], [0, 1], { ...clamp, easing: EASE_OUT });
  const p1 = interpolate(frame, [176, 204], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const fly = interpolate(frame, [176, 212], [0, 1], { ...clamp, easing: EASE_OUT });
  const p2 = interpolate(frame, [218, 250], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const swing = Math.sin(p2 * Math.PI);
  const sweep = interpolate(frame, [248, 326], [-4.5, 4.5], { ...clamp, easing: EASE_IN_OUT });

  const placement = (l: Letter) => {
    const s = solids[l];
    let x: number;
    let z = 0;
    let rotY = 0;
    let opacity = 1;
    let scaleZ = 1;
    if (l === "V" || l === "A" || l === "L") {
      x = lerp(lerp(xVal[l], xValis[l], p1), xVilas[l], p2) + s.cx;
      opacity = interpolate(frame, [150, 162], [0, 1], clamp);
      scaleZ = Math.max(solidify, 0.001);
    } else {
      x = lerp(xValis[l], xVilas[l], p2) + s.cx + (1 - fly) * 1.8;
      z = -(1 - fly) * 4.5;
      rotY = -(1 - fly) * 2.4;
      opacity = interpolate(frame, [176, 188], [0, 1], clamp);
    }
    if (l === "A") {
      z += swing * 0.85; // A passes in front of L…
      rotY -= swing * 0.55;
    }
    if (l === "I") {
      z -= swing * 0.85; // …while I passes behind it
      rotY += swing * 0.55;
    }
    return { x, y: BASELINE + s.cy, z, rotY, opacity, scaleZ };
  };

  return (
    <Rig distance={distance} azimuth={azimuth} elevation={elevation}>
      <StudioEnvironment intensity={0.55} />
      <ambientLight intensity={0.5} color="#fff3e4" />
      <KeyLight position={[sweep, 5, 5]} intensity={2.6} shadows />
      <KeyLight position={[2.5, 2.5, -5]} intensity={5} color="#c8925a" />
      {frame < 176 ? (
        <Particles
          data={particles}
          frame={frame}
          fps={fps}
          pixelScale={pixelScaleFor(height)}
          assemble={[28, 60, 40]}
          opacity={interpolate(frame, [150, 172], [1, 0], clamp)}
        />
      ) : null}
      {frame >= 150
        ? LETTERS.map((l) => {
            const p = placement(l);
            const m = materials[l];
            m.opacity = p.opacity;
            m.transparent = p.opacity < 1;
            return p.opacity > 0 ? (
              <mesh
                key={l}
                geometry={solids[l].geometry}
                material={m}
                position={[p.x, p.y, p.z]}
                rotation={[0, p.rotY, 0]}
                scale={[1, 1, p.scaleZ]}
                castShadow
              />
            ) : null;
          })
        : null}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASELINE - 0.016, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.2} color={C.ink} depthWrite={false} />
      </mesh>
    </Rig>
  );
};

// 0–11s. Particles condense into VAL, solidify into extruded letters, I and
// S fly in, and A and I orbit past each other in depth to spell VILAS.
export const Sculpture: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glyphs = useGlyphs();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <ThreeCanvas
        width={width}
        height={height}
        flat
        shadows="soft"
        camera={{ fov: FOV, position: [0, 0, 0], near: 0.1, far: 100 }}
      >
        <color attach="background" args={[C.bg]} />
        {glyphs ? <SculptureScene glyphs={glyphs} /> : null}
      </ThreeCanvas>
      <CodeLabel frame={frame} outAt={104} />
    </AbsoluteFill>
  );
};
