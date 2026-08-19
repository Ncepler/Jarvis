"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ghostButtonClass, primaryButtonClass } from "./fields";

// Crops the selected image to the square inside the circle and hands back a
// PNG File. PNG so a logo with a transparent background stays transparent.
async function cropToFile(src: string, area: Area, name: string): Promise<File> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Couldn't read that image."));
    el.src = src;
  });

  const size = Math.max(1, Math.round(area.width));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't read that image.");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("Couldn't read that image.");
  return new File([blob], name.replace(/\.[^.]+$/, "") + "-profile.png", {
    type: "image/png",
  });
}

// Modal cropper for the profile logo. The circular mask is what the client
// is actually choosing: the square it returns is what gets used for the
// favicon and any round placement on their site.
export function LogoCropper({
  file,
  onCancel,
  onSave,
}: {
  file: File;
  onCancel: () => void;
  onSave: (cropped: File) => void;
}) {
  const [src, setSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCancel]);

  const onCropComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  const save = async () => {
    if (!area) return;
    setBusy(true);
    try {
      onSave(await cropToFile(src, area, file.name));
    } catch {
      setError("That image wouldn't crop. Try a JPG or PNG.");
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop your profile logo"
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/70 p-4"
    >
      <div className="grid w-full max-w-md gap-5 border border-line bg-bg p-6">
        <div className="grid gap-1">
          <h2 className="font-display text-xl text-ink">Crop your profile logo</h2>
          <p className="text-sm text-muted">
            Drag to move, pinch or use the slider to zoom. Whatever sits inside
            the circle becomes your favicon and any round placement on the site.
          </p>
        </div>

        <div className="relative h-64 w-full bg-ink">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <label className="grid gap-2 text-sm text-muted">
          Zoom
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="range"
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={save} disabled={busy || !area} className={primaryButtonClass}>
            {busy ? "Cropping…" : "Save"}
          </button>
          <button type="button" onClick={onCancel} className={ghostButtonClass}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
