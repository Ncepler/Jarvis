"use client";

import { useState } from "react";
import type { Upload } from "@/lib/intake";
import { FieldError, fileInputClass } from "./fields";

// Files go to Supabase Storage the moment they're picked, not at submit
// (/api/intake/upload). A slow phone upload then happens while someone keeps
// filling the form, and a failed submit doesn't cost them the files — the
// draft carries URLs, so they survive a refresh too.

export type UploadKind =
  | "mainLogo"
  | "profileLogo"
  | "profileLogoOriginal"
  | "photo"
  | "heroVideo";

export async function uploadFile(file: File, kind: UploadKind, prefix: string): Promise<Upload> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);
  body.append("prefix", prefix);
  const res = await fetch("/api/intake/upload", { method: "POST", body });
  const json = (await res.json()) as Partial<Upload> & { error?: string };
  if (!res.ok || !json.url) {
    throw new Error(json.error || "That upload didn't go through. Try it again.");
  }
  return { name: json.name ?? file.name, url: json.url };
}

// A thumbnail of what's already uploaded, so someone can see they grabbed the
// right file.
export function UploadPreview({
  upload,
  round,
  onRemove,
}: {
  upload: Upload;
  round?: boolean;
  onRemove: () => void;
}) {
  const video = /\.(mp4|mov|webm)(\?|$)/i.test(upload.url);
  return (
    <span className="flex items-center gap-3">
      {video ? (
        <video src={upload.url} muted playsInline className="h-12 w-20 border border-line bg-surface object-cover" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={upload.url}
          alt=""
          className={`size-12 border border-line bg-surface object-contain ${round ? "rounded-full" : ""}`}
        />
      )}
      <span className="min-w-0 flex-1 truncate text-xs text-muted/80">{upload.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="cursor-pointer text-xs text-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
      >
        Remove
      </button>
    </span>
  );
}

export function UploadField({
  name,
  label,
  hint,
  accept,
  kind,
  getPrefix,
  required,
  round,
  value,
  error,
  onChange,
  onBlur,
}: {
  name: string;
  label: string;
  hint?: React.ReactNode;
  accept: string;
  kind: UploadKind;
  getPrefix: () => string;
  required?: boolean;
  round?: boolean;
  value: Upload | null;
  error?: string;
  onChange: (upload: Upload | null) => void;
  onBlur?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  const pick = async (file: File | null | undefined, input: HTMLInputElement) => {
    if (!file) return;
    setFailed("");
    setBusy(true);
    try {
      onChange(await uploadFile(file, kind, getPrefix()));
    } catch (e) {
      onChange(null);
      setFailed(e instanceof Error ? e.message : "That upload didn't go through.");
      input.value = "";
    } finally {
      setBusy(false);
      onBlur?.();
    }
  };

  return (
    <label data-field={name} className="grid gap-2 text-sm text-muted">
      <span>
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => pick(e.target.files?.[0], e.target)}
        className={fileInputClass}
      />
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
      {busy && <span className="text-xs text-muted">Uploading…</span>}
      {value && <UploadPreview upload={value} round={round} onRemove={() => onChange(null)} />}
      <FieldError error={failed || error} />
    </label>
  );
}
