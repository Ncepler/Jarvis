"use client";

// Fractured hero — a 12x7 grid of thin "slab" boxes showing one baked cream
// wordmark texture, sliced per-tile via texture.offset/.repeat so together
// they read as a single continuous hero image at rest (see paintCanvas /
// bakeTexture). On pointer move — mouse or touch, same code path, since
// R3F's `state.pointer` tracks both — tiles within a radius of the cursor
// push radially away, pop toward the camera, and tilt slightly; they ease
// back to their grid position once the cursor moves off (desktop) or lifts
// (touch). Camera stays fixed (no OrbitControls); its distance is
// recomputed on resize from both a width-fit and a height-fit formula,
// whichever needs more room, so the full grid is always in frame.
//
// Reduced motion skips the Three.js grid entirely (no Canvas, no WebGL
// context) and instead renders the SAME baked content as a plain static
// <img> (via canvas.toDataURL) — same wordmark/tagline/fonts/colors as the
// interactive version, just not the grid or the pointer effect, so a
// reduced-motion visitor sees the same hero, not a different one.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SITE } from "@/lib/site";

const COLS = 12;
const ROWS = 7;
const CELL = 1; // world units per grid cell
// Near-zero rather than exactly zero: adjacent box edges are independently
// triangulated meshes, and touching them at exactly the same coordinate can
// leave a hairline rasterization crack/flicker on some GPUs. 0.004 world
// units is sub-pixel at this grid's viewing distance (well under a screen
// pixel) — visually seamless at rest, but never lets two edges coincide
// exactly. Bump this (see task note) if a real GPU ever shows a seam.
const GAP = 0.004;
const BOX_W = CELL - GAP;
const BOX_H = CELL - GAP;
const BOX_D = 0.14; // thin slab depth
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

const INFLUENCE_RADIUS = 2.6; // world units — hover/touch push radius
const PUSH_STRENGTH = 0.6;
const MAX_TILT = 0.35; // radians

// The site's actual tokens (app/globals.css --color-ink / --color-muted;
// CREAM is the site's cream tone used elsewhere, e.g. app/opengraph-image.tsx).
const INK = "#1f1a14";
const CREAM = "#EDE7DA";
const MUTED = "#4d4638";

const TEX_CELL_PX = 128; // baked-texture resolution per grid cell

type Home = { x: number; y: number; z: number };
type TexOffset = { x: number; y: number };

// Paints the wordmark + tagline onto an offscreen 2D canvas — shared by both
// the interactive texture bake and the reduced-motion static <img>, so both
// paths render identical content.
function paintCanvas(wordmark: string, tagline: string): HTMLCanvasElement | null {
  const width = COLS * TEX_CELL_PX;
  const height = ROWS * TEX_CELL_PX;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const root = getComputedStyle(document.documentElement);
  const displayFont =
    root.getPropertyValue("--font-wordmark").trim() || "sans-serif";
  const sansFont = root.getPropertyValue("--font-sans").trim() || "sans-serif";

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = INK;
  ctx.font = `500 ${Math.round(height * 0.13)}px ${displayFont}`;
  ctx.fillText(wordmark, width / 2, height / 2 - height * 0.035);

  ctx.fillStyle = MUTED;
  ctx.font = `400 ${Math.round(height * 0.03)}px ${sansFont}`;
  ctx.fillText(tagline, width / 2, height / 2 + height * 0.08);

  return canvas;
}

// Wraps paintCanvas's output in a single CanvasTexture — every tile clones
// this ONE texture (modern three shares the GPU upload across clones via a
// common Source) and only changes .offset/.repeat, so it's one draw, not 84.
function bakeTexture(wordmark: string, tagline: string) {
  const canvas = paintCanvas(wordmark, tagline);
  if (!canvas) return null;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Recomputes camera distance on mount and on every resize: a width-fit
// distance (so the grid's full width is in frame) and a height-fit distance
// (same for height), and uses whichever is larger so neither axis ever
// clips.
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height || 1;
    const vFov = (persp.fov * Math.PI) / 180;
    const distanceForHeight = GRID_H / 2 / Math.tan(vFov / 2);
    const distanceForWidth = GRID_W / 2 / (aspect * Math.tan(vFov / 2));
    const distance = Math.max(distanceForHeight, distanceForWidth) * 1.08;
    persp.position.set(0, 0, distance);
    persp.aspect = aspect;
    persp.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Tile({
  home,
  texOffset,
  texture,
  geometry,
  sideMaterial,
  mouseWorldRef,
  activeRef,
}: {
  home: Home;
  texOffset: TexOffset;
  texture: THREE.CanvasTexture;
  geometry: THREE.BoxGeometry;
  sideMaterial: THREE.MeshBasicMaterial;
  mouseWorldRef: React.RefObject<THREE.Vector3>;
  activeRef: React.RefObject<boolean>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = useRef({ x: 0, y: 0, z: 0 });
  const rot = useRef({ x: 0, y: 0 });

  const frontMaterial = useMemo(() => {
    const tex = texture.clone();
    tex.needsUpdate = true;
    tex.repeat.set(1 / COLS, 1 / ROWS);
    tex.offset.set(texOffset.x, texOffset.y);
    return new THREE.MeshBasicMaterial({ map: tex });
  }, [texture, texOffset]);

  useEffect(() => {
    return () => {
      frontMaterial.map?.dispose();
      frontMaterial.dispose();
    };
  }, [frontMaterial]);

  const materials = useMemo(
    () => [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      frontMaterial, // +z face — the one facing the camera
      sideMaterial,
    ],
    [sideMaterial, frontMaterial],
  );

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    let targetX = 0,
      targetY = 0,
      targetZ = 0,
      targetRotX = 0,
      targetRotY = 0;

    if (activeRef.current) {
      const mw = mouseWorldRef.current;
      const dx = home.x - mw.x;
      const dy = home.y - mw.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < INFLUENCE_RADIUS) {
        const falloff = Math.pow(1 - dist / INFLUENCE_RADIUS, 2);
        const dirX = dist > 0.0001 ? dx / dist : 0;
        const dirY = dist > 0.0001 ? dy / dist : 0;
        targetX = dirX * falloff * PUSH_STRENGTH;
        targetY = dirY * falloff * PUSH_STRENGTH;
        targetZ = falloff * PUSH_STRENGTH * 0.9;
        targetRotX = dirY * falloff * MAX_TILT;
        targetRotY = -dirX * falloff * MAX_TILT;
      }
    }

    const ease = 1 - Math.pow(0.001, dt); // frame-rate independent
    offset.current.x += (targetX - offset.current.x) * ease;
    offset.current.y += (targetY - offset.current.y) * ease;
    offset.current.z += (targetZ - offset.current.z) * ease;
    rot.current.x += (targetRotX - rot.current.x) * ease;
    rot.current.y += (targetRotY - rot.current.y) * ease;

    mesh.position.set(
      home.x + offset.current.x,
      home.y + offset.current.y,
      home.z + offset.current.z,
    );
    mesh.rotation.set(rot.current.x, rot.current.y, 0);
  });

  return (
    <mesh
      ref={meshRef}
      position={[home.x, home.y, home.z]}
      geometry={geometry}
      material={materials}
    />
  );
}

function Scene({
  texture,
  activeRef,
}: {
  texture: THREE.CanvasTexture;
  activeRef: React.RefObject<boolean>;
}) {
  const mouseWorld = useRef(new THREE.Vector3());
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const geometry = useMemo(
    () => new THREE.BoxGeometry(BOX_W, BOX_H, BOX_D),
    [],
  );
  const sideMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: INK }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      sideMaterial.dispose();
    };
  }, [geometry, sideMaterial]);

  useFrame((state) => {
    state.raycaster.setFromCamera(state.pointer, state.camera);
    state.raycaster.ray.intersectPlane(plane, mouseWorld.current);
  });

  const tiles = useMemo(() => {
    const list: { key: string; home: Home; texOffset: TexOffset }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        list.push({
          key: `${row}-${col}`,
          home: {
            x: (col - (COLS - 1) / 2) * CELL,
            y: ((ROWS - 1) / 2 - row) * CELL, // row 0 = top
            z: 0,
          },
          // texture.flipY (default true) means v=1 samples the image TOP —
          // row 0 (grid top) must map there, hence 1 - (row+1)/ROWS.
          texOffset: {
            x: col / COLS,
            y: 1 - (row + 1) / ROWS,
          },
        });
      }
    }
    return list;
  }, []);

  return (
    <>
      <CameraRig />
      {tiles.map((t) => (
        <Tile
          key={t.key}
          home={t.home}
          texOffset={t.texOffset}
          texture={texture}
          geometry={geometry}
          sideMaterial={sideMaterial}
          mouseWorldRef={mouseWorld}
          activeRef={activeRef}
        />
      ))}
    </>
  );
}

export function FracturedHero() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const [staticSrc, setStaticSrc] = useState<string | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      try {
        await document.fonts?.ready; // bake against the real face, not a fallback
      } catch {
        /* Font Loading API unavailable — bake with whatever's loaded */
      }
      if (cancelled) return;

      const dotted = SITE.domain.slice(SITE.domain.indexOf("."));
      const wordmark = `${SITE.brand.toUpperCase()}${dotted}`;

      // Reduced motion: paint the same content but never touch Three.js at
      // all — no Canvas, no WebGL context, just a static <img>.
      if (reduced) {
        const canvas = paintCanvas(wordmark, SITE.tagline);
        if (!cancelled && canvas) setStaticSrc(canvas.toDataURL());
        return;
      }

      const tex = bakeTexture(wordmark, SITE.tagline);
      if (cancelled) {
        tex?.dispose();
        return;
      }
      textureRef.current = tex;
      setTexture(tex);
    };
    run();
    return () => {
      cancelled = true;
      textureRef.current?.dispose();
    };
  }, []);

  return (
    <div
      className="relative h-svh w-full touch-pan-y overflow-hidden"
      style={{ backgroundColor: CREAM }}
      onPointerMove={() => {
        activeRef.current = true;
      }}
      onPointerLeave={() => {
        activeRef.current = false;
      }}
      onPointerUp={() => {
        activeRef.current = false;
      }}
      onPointerCancel={() => {
        activeRef.current = false;
      }}
    >
      {staticSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={staticSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        texture && (
          <Canvas
            dpr={[1, 2]}
            camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 10] }}
          >
            <Scene texture={texture} activeRef={activeRef} />
          </Canvas>
        )
      )}
    </div>
  );
}
