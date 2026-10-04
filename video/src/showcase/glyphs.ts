import { parse, type Font } from "opentype.js";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";

// Real Space Grotesk outlines (the wordmark face), parsed at render time and
// shared by the particle targets and the extruded 3D letters, so particles
// condense into exactly the shapes that then solidify.
export type Letter = "V" | "A" | "L" | "I" | "S";
export const LETTERS: Letter[] = ["V", "A", "L", "I", "S"];
export const CAP = 0.7; // cap height in world units at font size 1
// Looser than the flat wordmark (-0.02): extruded letters seen at an angle
// need room for their side faces.
const TRACK = 0.035;

export type Glyphs = {
  readonly shapes: Record<Letter, THREE.Shape[]>; // y-up, origin at left baseline
  readonly advance: Record<Letter, number>;
};

let fontPromise: Promise<Font> | null = null;
const loadFontFile = () => {
  fontPromise ??= fetch(staticFile("fonts/SpaceGrotesk-500.woff"))
    .then((r) => r.arrayBuffer())
    .then((buf) => parse(buf));
  return fontPromise;
};

const glyphShapes = (font: Font, ch: string) => {
  const sp = new THREE.ShapePath();
  for (const c of font.charToGlyph(ch).getPath(0, 0, 1).commands) {
    // opentype paths are y-down; flip to three's y-up
    if (c.type === "M") sp.moveTo(c.x, -c.y);
    else if (c.type === "L") sp.lineTo(c.x, -c.y);
    else if (c.type === "Q") sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
    else if (c.type === "C") sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
  }
  return sp.toShapes(false);
};

let cache: Glyphs | null = null;

export const useGlyphs = (): Glyphs | null => {
  const [glyphs, setGlyphs] = useState<Glyphs | null>(cache);
  const [handle] = useState(() => (cache ? null : delayRender("Parsing glyph outlines")));
  useEffect(() => {
    if (handle === null) return;
    loadFontFile()
      .then((font) => {
        const shapes = {} as Record<Letter, THREE.Shape[]>;
        const advance = {} as Record<Letter, number>;
        for (const l of LETTERS) {
          shapes[l] = glyphShapes(font, l);
          advance[l] = font.charToGlyph(l).advanceWidth! / font.unitsPerEm;
        }
        cache = { shapes, advance };
        setGlyphs(cache);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);
  return glyphs;
};

// Left edge of each letter for a word centred on x = 0.
export const layoutWord = (word: Letter[], g: Glyphs) => {
  const total = word.reduce((s, l) => s + g.advance[l] + TRACK, 0) - TRACK;
  const x = {} as Record<Letter, number>;
  let cursor = -total / 2;
  for (const l of word) {
    x[l] = cursor;
    cursor += g.advance[l] + TRACK;
  }
  return x;
};

export const BASELINE = -CAP / 2; // letters sit centred on y = 0

// Deterministic PRNG so every render (and every frame) agrees.
export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// n points spread evenly (by area) over the filled letterforms of a word.
export const sampleWord = (
  word: Letter[],
  g: Glyphs,
  n: number,
  seed: number,
  z: number,
): Float32Array => {
  const rand = mulberry32(seed);
  const xs = layoutWord(word, g);
  const tris: number[][] = [];
  const areas: number[] = [];
  for (const l of word) {
    const geo = new THREE.ShapeGeometry(g.shapes[l], 10);
    const p = geo.attributes.position;
    const idx = geo.index!;
    for (let i = 0; i < idx.count; i += 3) {
      const t: number[] = [];
      for (let k = 0; k < 3; k++) {
        const v = idx.getX(i + k);
        t.push(p.getX(v) + xs[l], p.getY(v) + BASELINE);
      }
      const area = Math.abs((t[2] - t[0]) * (t[5] - t[1]) - (t[4] - t[0]) * (t[3] - t[1])) / 2;
      tris.push(t);
      areas.push(area);
    }
    geo.dispose();
  }
  const cum: number[] = [];
  areas.reduce((s, a, i) => (cum[i] = s + a), 0);
  const totalArea = cum[cum.length - 1];
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const pick = rand() * totalArea;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < pick) lo = mid + 1;
      else hi = mid;
    }
    const t = tris[lo];
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    out[i * 3] = t[0] + u * (t[2] - t[0]) + v * (t[4] - t[0]);
    out[i * 3 + 1] = t[1] + u * (t[3] - t[1]) + v * (t[5] - t[1]);
    out[i * 3 + 2] = z;
  }
  return out;
};
