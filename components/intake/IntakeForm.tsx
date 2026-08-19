"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  STORAGE_KEY,
  emptyDraft,
  emptyFiles,
  stepsFor,
  validateStep,
  type IntakeDraft,
  type IntakeFiles,
} from "@/lib/intake";
import { templateByKey } from "@/lib/templates";
import { ProgressSteps } from "./ProgressSteps";
import { PageContact } from "./PageContact";
import { PageBrand } from "./PageBrand";
import { PageContent } from "./PageContent";
import { PageCustomize } from "./PageCustomize";
import { PageBrainDump } from "./PageBrainDump";
import { ghostButtonClass, primaryButtonClass } from "./fields";

type Stage = "form" | "submitting" | "done";
type Stored = { step: number; draft: IntakeDraft };

// Multi-page intake for /start. One draft object holds every text field; the
// files live alongside it (they can't be JSON-serialized). Page navigation is
// local state, and the draft mirrors to localStorage so a refresh doesn't cost
// someone their answers.
//
// Validation model: errors are recomputed on every render, but a message is
// only *shown* once its field has been blurred, or once someone has pressed
// Next on a page with problems. Next is never silently disabled.
export function IntakeForm({ hasBackend }: { hasBackend: boolean }) {
  const [draft, setDraft] = useState<IntakeDraft>(emptyDraft);
  const [files, setFiles] = useState<IntakeFiles>(emptyFiles);
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [touched, setTouched] = useState<Record<string, true>>({});
  const [showAll, setShowAll] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<Stored>;
        if (stored.draft) setDraft({ ...emptyDraft(), ...stored.draft });
        if (typeof stored.step === "number") setIndex(Math.max(0, stored.step));
      }
    } catch {
      // corrupt or blocked storage, just start fresh
    }
    // Arriving from a gallery card's "start with this style" link, e.g.
    // /start?template=demo-bakery. An explicit choice beats a stored draft.
    const wanted = new URLSearchParams(window.location.search).get("template");
    if (wanted && templateByKey(wanted)) {
      setDraft((d) => ({ ...d, usingTemplate: "yes", templateChoice: wanted }));
    }
    setHydrated(true);
  }, []);

  const steps = useMemo(() => stepsFor(draft), [draft]);
  // A draft loaded from storage can point past the end when someone switches
  // to a custom build, so the index is always clamped to what exists.
  const step = Math.min(index, steps.length - 1);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, draft } satisfies Stored));
    } catch {
      // storage full or blocked, the form still works
    }
  }, [draft, step, hydrated]);

  const allErrors = validateStep(current.id, draft, files);
  const visible = Object.fromEntries(
    Object.entries(allErrors).filter(([k]) => showAll || touched[k]),
  );

  const patch = (p: Partial<IntakeDraft>) => setDraft((d) => ({ ...d, ...p }));
  const patchFiles = (p: Partial<IntakeFiles>) => setFiles((f) => ({ ...f, ...p }));
  const blur = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  const goTo = (next: number) => {
    setShowAll(false);
    setIndex(next);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Reveals every error on the page at once and jumps to the first one.
  const reveal = () => {
    setShowAll(true);
    const first = Object.keys(allErrors)[0];
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input, textarea, select")?.focus();
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(allErrors).length > 0) return reveal();
    if (!isLast) return goTo(step + 1);

    if (honeypotRef.current?.value) {
      // bots fill hidden fields. Answer like a normal success, send nothing.
      setStage("done");
      return;
    }
    if (!hasBackend) {
      setError("The form isn't wired up on this deploy yet, the backend env vars are missing.");
      return;
    }

    setStage("submitting");
    setError("");
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(draft));
      if (files.mainLogo) fd.append("mainLogo", files.mainLogo);
      if (files.profileLogo) fd.append("profileLogo", files.profileLogo);
      if (files.profileLogoOriginal) fd.append("profileLogoOriginal", files.profileLogoOriginal);
      if (files.heroVideo) fd.append("heroVideo", files.heroVideo);
      files.photos.forEach((f) => fd.append("photos", f));

      const res = await fetch("/api/intake", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "That didn't send. Give it another try in a minute.",
        );
        setStage("form");
        return;
      }

      // Best effort. The row is already saved either way, so a mail outage
      // never blocks the person who just filled this in.
      if (typeof json.id === "string") {
        fetch("/api/notify-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: json.id }),
        }).catch(() => {});
      }

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // nothing to clean up if storage was never writable
      }
      setStage("done");
    } catch {
      setError("That didn't send. Give it another try in a minute.");
      setStage("form");
    }
  };

  if (stage === "done") {
    return (
      <div className="grid gap-4">
        <p className="text-lg text-ink">
          Got it, thanks. We&rsquo;ll go through everything and reach out within a day.
        </p>
        <p className="text-sm text-muted">
          Keep your logo and photos handy in case we need to follow up on anything.
        </p>
      </div>
    );
  }

  const busy = stage === "submitting";
  const shared = { draft, errors: visible, onChange: patch, onBlur: blur };

  return (
    <div className="grid gap-10">
      <ProgressSteps steps={steps} step={step} />

      <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-10">
        {current.id === "contact" && <PageContact {...shared} />}
        {current.id === "brand" && (
          <PageBrand {...shared} files={files} onFiles={patchFiles} />
        )}
        {current.id === "content" && (
          <PageContent {...shared} files={files} onFiles={patchFiles} />
        )}
        {current.id === "customize" && <PageCustomize draft={draft} onChange={patch} />}
        {current.id === "braindump" && <PageBrainDump draft={draft} onChange={patch} />}

        {/* honeypot, hidden from people and tempting to bots */}
        <label className="hidden" aria-hidden="true">
          Website
          <input ref={honeypotRef} tabIndex={-1} autoComplete="off" />
        </label>

        {showAll && Object.keys(allErrors).length > 0 && (
          <p className="text-sm text-red-500">
            {Object.keys(allErrors).length === 1
              ? "One field needs another look."
              : `${Object.keys(allErrors).length} fields need another look.`}
          </p>
        )}
        {error && <p className="text-sm text-accent">{error}</p>}

        <div className="flex flex-wrap items-center gap-5">
          {step > 0 && (
            <button type="button" onClick={() => goTo(step - 1)} disabled={busy} className={ghostButtonClass}>
              Back
            </button>
          )}
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {isLast ? (busy ? "Sending…" : "Submit") : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
