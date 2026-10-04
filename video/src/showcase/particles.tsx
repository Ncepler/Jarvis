import type React from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "./glyphs";

// Every particle's position is a pure function of (frame, its own seeds),
// evaluated on the GPU — no simulation state, so any frame renders on its
// own, in any order, on any machine. That is what makes it Remotion-safe.
const VERT = /* glsl */ `
  attribute vec4 aSeed;   // radius, angle, height, phase
  attribute vec3 aTarget;
  attribute float aDelay;
  attribute vec2 aArc;
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uFrame;
  uniform float uFps;
  uniform float uTrail;    // sub-frame offset for the motion trail passes
  uniform float uTOffset;  // seconds added to the swirl clock
  uniform vec3 uIn;        // start, spread, duration (frames)
  uniform vec3 uOut;
  uniform float uScale;
  varying vec3 vColor;
  varying float vSettled;

  float ease(float x) { return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) / 2.0; }

  // A three-arm spiral galaxy, tilted toward the camera. Inner stars orbit
  // faster than outer ones, so the arms wind as it turns.
  vec3 swirl(vec4 s, float t) {
    float w = 0.42 / pow(s.x + 0.3, 1.15);
    float ang = s.y + w * t;
    vec3 p = vec3(cos(ang) * s.x, s.z, sin(ang) * s.x);
    float c = 0.5;      // cos(60deg)
    float sn = 0.866;   // sin(60deg)
    p = vec3(p.x, p.y * c - p.z * sn, p.y * sn + p.z * c);
    p += 0.03 * vec3(sin(1.7*t + s.w*12.0), cos(1.3*t + s.w*9.0), sin(1.1*t + s.w*7.0));
    return p;
  }

  void main() {
    float f = uFrame + uTrail;
    float t = f / uFps + uTOffset;
    float aIn = ease(clamp((f - uIn.x - aDelay * uIn.y) / uIn.z, 0.0, 1.0));
    float aOut = ease(clamp((f - uOut.x - aDelay * uOut.y) / uOut.z, 0.0, 1.0));
    float w = aIn * (1.0 - aOut);
    vec3 p = mix(swirl(aSeed, t), aTarget, w);
    float bulge = 4.0 * w * (1.0 - w);
    p += vec3(aArc.x * 0.4, aArc.y, 0.9 + aArc.x) * bulge * 0.7;
    p.xy += 0.002 * w * vec2(sin(t * 2.3 + aSeed.w * 40.0), cos(t * 1.9 + aSeed.w * 31.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * mix(1.0, 0.72, w) * uScale / -mv.z;
    vColor = aColor;
    vSettled = w;
  }
`;

const FRAG = /* glsl */ `
  uniform float uAlpha;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vSettled;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.3, d);
    if (a <= 0.0) discard;
    gl_FragColor = vec4(vColor, a * uAlpha * uOpacity * mix(0.82, 1.0, vSettled));
  }
`;

export type ParticleData = { readonly geometry: THREE.BufferGeometry };

const INK = [0x1f / 255, 0x1a / 255, 0x14 / 255];
const BRONZE = [0x8a / 255, 0x5a / 255, 0x2b / 255];

// Swirl seeds, colours and sizes come from `seed` alone, so two particle
// sets made with the same seed share one swirl — which is what lets the
// finale dissolve back into the opening frame.
export const makeParticles = (targets: Float32Array, seed: number): ParticleData => {
  const n = targets.length / 3;
  const rand = mulberry32(seed);
  const seeds = new Float32Array(n * 4);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);
  const arcs = new Float32Array(n * 2);
  const gauss = () => {
    const u = Math.max(rand(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  for (let i = 0; i < n; i++) {
    const dust = rand() < 0.14;
    const r = dust ? 0.3 + 2.9 * rand() : 0.08 + 2.55 * Math.pow(rand(), 0.85);
    const arm = Math.floor(rand() * 3);
    const theta = dust
      ? rand() * Math.PI * 2
      : (arm * Math.PI * 2) / 3 + r * 2.1 + gauss() * 0.32 * (0.45 + r * 0.25);
    seeds[i * 4] = r;
    seeds[i * 4 + 1] = theta;
    seeds[i * 4 + 2] = gauss() * (dust ? 0.35 : 0.045 * (1 + 0.7 / (r + 0.25)));
    seeds[i * 4 + 3] = rand();
    const c = rand() < (r < 0.6 ? 0.4 : 0.14) ? BRONZE : INK;
    colors.set(c, i * 3);
    sizes[i] = 0.011 + rand() * 0.011;
    arcs[i * 2] = rand() - 0.5;
    arcs[i * 2 + 1] = (rand() - 0.5) * 0.8;
  }
  // assembly sweeps left → right across the word, with a little scatter
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < n; i++) {
    minX = Math.min(minX, targets[i * 3]);
    maxX = Math.max(maxX, targets[i * 3]);
  }
  const jitter = mulberry32(seed + 1);
  const delays = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    delays[i] = ((targets[i * 3] - minX) / (maxX - minX)) * 0.8 + jitter() * 0.2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(targets, 3));
  g.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  g.setAttribute("aArc", new THREE.BufferAttribute(arcs, 2));
  g.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
  return { geometry: g };
};

// Three passes: the particle, then two fainter copies a fraction of a frame
// behind it — cheap per-particle motion blur.
const TRAILS: Array<[number, number]> = [
  [0, 1],
  [-0.5, 0.32],
  [-1, 0.14],
];

type ParticlesProps = {
  readonly data: ParticleData;
  readonly frame: number;
  readonly fps: number;
  readonly pixelScale: number;
  readonly tOffset?: number;
  readonly assemble: [number, number, number];
  readonly disperse?: [number, number, number];
  readonly opacity?: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  data,
  frame,
  fps,
  pixelScale,
  tOffset = 0,
  assemble,
  disperse = [1e9, 0, 1],
  opacity = 1,
}) => {
  const materials = useMemo(
    () =>
      TRAILS.map(
        ([trail, alpha]) =>
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: {
              uFrame: { value: 0 },
              uFps: { value: 30 },
              uTrail: { value: trail },
              uTOffset: { value: 0 },
              uIn: { value: new THREE.Vector3() },
              uOut: { value: new THREE.Vector3() },
              uScale: { value: 1 },
              uAlpha: { value: alpha },
              uOpacity: { value: 1 },
            },
          }),
      ),
    [],
  );
  for (const m of materials) {
    m.uniforms.uFrame.value = frame;
    m.uniforms.uFps.value = fps;
    m.uniforms.uTOffset.value = tOffset;
    m.uniforms.uIn.value.set(...assemble);
    m.uniforms.uOut.value.set(...disperse);
    m.uniforms.uScale.value = pixelScale;
    m.uniforms.uOpacity.value = opacity;
  }
  return (
    <>
      {materials.map((m, i) => (
        <points key={i} geometry={data.geometry} material={m} frustumCulled={false} renderOrder={2} />
      ))}
    </>
  );
};
