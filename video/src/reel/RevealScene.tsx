import { measureText } from "@remotion/layout-utils";
import type React from "react";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  BRAND,
  C,
  DOMAIN,
  EASE_IN,
  EASE_IN_OUT,
  EASE_OUT,
  GROTESK,
  MONO,
  clamp,
  fontsLoaded,
} from "../brand";
import { HookLead, MaskLine, Paper } from "./parts";

// The site's opening reveal, cut down for a reel: the V·A·L nodes persist
// while I and S arrive (VAL → VALIS), then A and I trade places (→ VILAS).
// Every letter is the same size, weight and colour — only motion separates
// the core three (CLAUDE.md §6.1.1).
type Letter = "V" | "A" | "L" | "I" | "S";
const VAL: Letter[] = ["V", "A", "L"];
const VALIS: Letter[] = ["V", "A", "L", "I", "S"];
const VILAS: Letter[] = ["V", "I", "L", "A", "S"];
const ALL: Letter[] = ["V", "A", "L", "I", "S"];

const FS = 284;
const TRACK = -0.02 * FS;
const WORD_TOP = 600;
const CENTER_X = 540;
const ARC = 0.74 * FS; // A passes over L, I passes under — clears both

const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Measuring the wordmark"));
  useEffect(() => {
    fontsLoaded
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);
  return ready;
};

// Left edge of each letter, relative to the frame's centre line.
const layout = (word: Letter[], advance: Record<Letter, number>) => {
  const total = word.reduce((sum, l) => sum + advance[l], 0) - TRACK;
  const x = {} as Record<Letter, number>;
  let cursor = -total / 2;
  for (const l of word) {
    x[l] = cursor;
    cursor += advance[l];
  }
  return x;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  if (!ready) return null;

  const advance = {} as Record<Letter, number>;
  for (const l of ALL) {
    advance[l] =
      measureText({ text: l, fontFamily: GROTESK, fontSize: FS, fontWeight: "500" }).width +
      TRACK;
  }
  const xVal = layout(VAL, advance);
  const xValis = layout(VALIS, advance);
  const xVilas = layout(VILAS, advance);

  const p1 = interpolate(frame, [18, 34], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const p2 = interpolate(frame, [40, 62], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const leave = interpolate(frame, [124, 134], [0, 1], { ...clamp, easing: EASE_IN });
  const arc = Math.sin(p2 * Math.PI) * ARC;

  return (
    <>
      {ALL.map((l) => {
        const core = l === "V" || l === "A" || l === "L";
        const enter = core
          ? interpolate(frame, [VAL.indexOf(l) * 3, VAL.indexOf(l) * 3 + 16], [0, 1], {
              ...clamp,
              easing: EASE_OUT,
            })
          : interpolate(frame, [l === "I" ? 22 : 25, l === "I" ? 36 : 39], [0, 1], {
              ...clamp,
              easing: EASE_OUT,
            });
        const x = core
          ? lerp(lerp(xVal[l], xValis[l], p1), xVilas[l], p2)
          : lerp(xValis[l], xVilas[l], p2) + (1 - enter) * 0.3 * FS;
        const y =
          (core ? (1 - enter) * 0.35 * FS : 0) +
          (l === "A" ? -arc : l === "I" ? arc : 0) -
          leave * 0.25 * FS;
        return (
          <span
            key={l}
            style={{
              position: "absolute",
              left: CENTER_X + x,
              top: WORD_TOP,
              fontFamily: GROTESK,
              fontWeight: 500,
              fontSize: FS,
              lineHeight: 1,
              color: C.ink,
              opacity: enter * (1 - leave),
              translate: `0 ${y}px`,
            }}
          >
            {l}
          </span>
        );
      })}
    </>
  );
};

// 10–15s. The name, the domain, the promise — then the hook comes back in so
// the last frame is frame 0.
export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Paper />
      <Wordmark />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: WORD_TOP + FS + 22,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 52,
          letterSpacing: "0.02em",
          color: C.muted,
          opacity:
            interpolate(frame, [58, 72], [0, 1], { ...clamp, easing: EASE_OUT }) *
            interpolate(frame, [122, 132], [1, 0], clamp),
          translate: `0 ${interpolate(frame, [58, 72], [24, 0], { ...clamp, easing: EASE_OUT })}px`,
        }}
      >
        {DOMAIN.slice(BRAND.length)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1130,
          textAlign: "center",
          fontFamily: GROTESK,
          fontWeight: 500,
          fontSize: 70,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: C.ink,
        }}
      >
        <MaskLine inAt={66} outAt={120}>
          A website that
        </MaskLine>
        <MaskLine inAt={69} outAt={122}>
          looks expensive.
        </MaskLine>
        <MaskLine inAt={80} outAt={124} style={{ color: C.muted }}>
          It wasn’t.
        </MaskLine>
      </div>
      <HookLead inAt={133} />
    </AbsoluteFill>
  );
};
