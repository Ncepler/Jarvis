import { useThree } from "@react-three/fiber";
import type React from "react";
import { useLayoutEffect, useMemo } from "react";
import { interpolate } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { C, EASE_IN, EASE_OUT, MONO, clamp } from "../brand";

export const FOV = 35;
export const pixelScaleFor = (height: number) => height / 2 / Math.tan((FOV * Math.PI) / 360);

// The camera never moves: it sits at the origin looking down -z, and the
// whole world is orbited around it instead. Declarative props on one group,
// so every frame is fully described by its props.
export const Rig: React.FC<{
  readonly distance: number;
  readonly azimuth: number;
  readonly elevation: number;
  readonly children: React.ReactNode;
}> = ({ distance, azimuth, elevation, children }) => (
  <group position={[0, 0, -distance]} rotation={[elevation, -azimuth, 0]}>
    {children}
  </group>
);

// A soft studio reflection map built in code (no HDR download), so the
// letters have something to reflect.
export const StudioEnvironment: React.FC<{ readonly intensity: number }> = ({ intensity }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  scene.environmentIntensity = intensity;
  return null;
};

// Directional light whose target lives inside the orbiting world group.
export const KeyLight: React.FC<{
  readonly position: [number, number, number];
  readonly intensity: number;
  readonly color?: string;
  readonly shadows?: boolean;
}> = ({ position, intensity, color = "#fff6ea", shadows = false }) => {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={target} />
      <directionalLight
        position={position}
        target={target}
        intensity={intensity}
        color={color}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
    </>
  );
};

// The one honest hook line, on frame 0 and on the last frame.
export const CodeLabel: React.FC<{ readonly frame: number; readonly inAt?: number; readonly outAt?: number }> = ({
  frame,
  inAt,
  outAt,
}) => {
  const enter = inAt === undefined ? 1 : interpolate(frame, [inAt, inAt + 16], [0, 1], { ...clamp, easing: EASE_OUT });
  const leave = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 12], [0, 1], { ...clamp, easing: EASE_IN });
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: MONO,
        fontSize: 42,
        letterSpacing: "0.02em",
        color: C.ink,
        textShadow: `0 0 10px ${C.bg}, 0 0 22px ${C.bg}, 0 0 36px ${C.bg}`,
        opacity: enter * (1 - leave),
        translate: `0 ${(1 - enter) * 20 - leave * 20}px`,
      }}
    >
      Every frame of this is code.
    </div>
  );
};
