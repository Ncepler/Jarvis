"use client";

import { useEffect, useRef, useState } from "react";

// Fixed camera, not auto-framed: the model is 0.49m tall closed, 0.78m open,
// and the lid ends 0.42m back — auto-framing crops the open pose.
const SWATCHES = [
  { name: "Blush", hex: "#EE99A8" },
  { name: "Sage", hex: "#A3BC9E" },
  { name: "Sky", hex: "#93B5D9" },
  { name: "Butter", hex: "#F0D68A" },
  { name: "Charcoal", hex: "#3B3B40" },
] as const;

type ModelViewerElement = HTMLElement & {
  timeScale: number;
  play: (options?: { repetitions?: number }) => void;
  model?: {
    materials: {
      name: string;
      pbrMetallicRoughness: {
        setBaseColorFactor: (hex: string) => void;
      };
    }[];
  };
};

export function GiftBoxDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<ModelViewerElement | null>(null);
  const [ready, setReady] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<string>(SWATCHES[0].hex);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      await import("@google/model-viewer");
      if (cancelled || !containerRef.current) return;

      const el = document.createElement("model-viewer") as ModelViewerElement;
      el.setAttribute("src", "/models/gift-box.glb");
      el.setAttribute("alt", "A pink gift box that opens to show flowers");
      el.setAttribute("camera-controls", "");
      el.setAttribute("disable-zoom", "");
      el.setAttribute("disable-pan", "");
      el.setAttribute("touch-action", "pan-y");
      el.setAttribute("interaction-prompt", "none");
      el.setAttribute("environment-image", "neutral");
      el.setAttribute("shadow-intensity", "0.8");
      el.setAttribute("animation-name", "Open");
      el.setAttribute("camera-orbit", "30deg 72deg 2.2m");
      el.setAttribute("camera-target", "0m 0.39m -0.1m");
      el.setAttribute("field-of-view", "30deg");
      el.setAttribute("min-camera-orbit", "auto 40deg auto");
      el.setAttribute("max-camera-orbit", "auto 95deg auto");
      el.style.width = "100%";
      el.style.height = "340px";
      el.style.backgroundColor = "transparent";

      el.addEventListener("load", () => setReady(true));
      el.addEventListener("finished", () => setAnimating(false));

      containerRef.current.appendChild(el);
      elRef.current = el;
    }

    mount();

    return () => {
      cancelled = true;
      elRef.current?.remove();
      elRef.current = null;
    };
  }, []);

  function toggle() {
    const el = elRef.current;
    if (!el || animating) return;
    setAnimating(true);
    el.timeScale = open ? -1 : 1;
    el.play({ repetitions: 1 });
    setOpen((o) => !o);
    // fallback in case the "finished" event doesn't fire
    setTimeout(() => setAnimating(false), 3000);
  }

  function pickColor(hex: string) {
    setColor(hex);
    const material = elRef.current?.model?.materials.find(
      (m) => m.name === "Box_Color"
    );
    material?.pbrMetallicRoughness.setBaseColorFactor(hex);
  }

  return (
    <div>
      <div ref={containerRef} className="h-[340px] w-full" />
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {SWATCHES.map((s) => (
            <button
              key={s.hex}
              type="button"
              aria-label={`Box color: ${s.name}`}
              disabled={!ready}
              onClick={() => pickColor(s.hex)}
              className={`h-6 w-6 rounded-full border transition-opacity duration-200 disabled:opacity-40 ${
                color === s.hex ? "ring-2 ring-ink ring-offset-2" : "border-line"
              }`}
              style={{ backgroundColor: s.hex }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={!ready || animating}
          className="press shrink-0 border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
        >
          {open ? "Close it" : "Open it"}
        </button>
      </div>
    </div>
  );
}
