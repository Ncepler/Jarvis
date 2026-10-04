import { ThreeCanvas } from "@remotion/three";
import type React from "react";
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { C, GROTESK } from "../brand";
import { MaskLine } from "../reel/parts";

// Domain-warped fractal noise, lit as if it were a sheet of silk: the
// surface normal comes from the noise gradient, so the folds catch a key
// light and throw a bronze sheen. Pure function of time — no textures.
const FRAG = /* glsl */ `
  precision highp float;
  uniform float uT;
  uniform vec2 uRes;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }
  float field(vec2 p, float t) {
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.10)), fbm(p + vec2(5.2, 1.3) - t * 0.08));
    vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.12),
                  fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.10));
    return fbm(p + 3.0 * r);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.7;
    float e = 0.006;
    float h = field(p, uT);
    float hx = field(p + vec2(e, 0.0), uT);
    float hy = field(p + vec2(0.0, e), uT);
    vec3 n = normalize(vec3((h - hx) / e * 0.11, (h - hy) / e * 0.11, 1.0));
    vec3 L = normalize(vec3(-0.45, 0.65, 0.6));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 28.0);

    vec3 ink = vec3(0.122, 0.102, 0.078);
    vec3 bronze = vec3(0.541, 0.353, 0.169);
    vec3 sand = vec3(0.94, 0.86, 0.74);
    vec3 col = mix(ink * 0.8, bronze, smoothstep(0.42, 0.9, h) * 0.8);
    col *= 0.45 + 0.75 * diff;
    col += sand * spec * 0.45;
    col *= 1.0 - 0.55 * pow(length(uv - 0.5) * 1.2, 2.0);
    col += (hash(uv * uRes + fract(uT) * 97.0) - 0.5) * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SilkPlane: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        depthTest: false,
        uniforms: { uT: { value: 0 }, uRes: { value: new THREE.Vector2(width, height) } },
      }),
    [width, height],
  );
  material.uniforms.uT.value = 4 + frame / fps;
  return (
    <mesh material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};

// The one dark beat (like the site's FullBleed band): a live GPU shader at
// half resolution — it's soft by nature, and that quarters the cost.
export const Silk: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <ThreeCanvas width={width} height={height} flat dpr={0.5}>
        <SilkPlane />
      </ThreeCanvas>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 720,
          fontFamily: GROTESK,
          fontWeight: 500,
          fontSize: 132,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: C.bg,
          whiteSpace: "nowrap",
        }}
      >
        <MaskLine inAt={16} outAt={128}>
          Made to
        </MaskLine>
        <MaskLine inAt={19} outAt={130}>
          move.
        </MaskLine>
        <div style={{ height: 40 }} />
        <MaskLine inAt={40} outAt={132} style={{ color: C.line }}>
          Built to be
        </MaskLine>
        <MaskLine inAt={43} outAt={134} style={{ color: C.line }}>
          remembered.
        </MaskLine>
      </div>
    </AbsoluteFill>
  );
};
