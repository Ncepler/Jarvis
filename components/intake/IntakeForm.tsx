"use client";

import { useEffect, useRef, useState } from "react";
import {
  STORAGE_KEY,
  TOTAL_STEPS,
  emptyDraft,
  page1Valid,
  page2Valid,
  page3Valid,
  type IntakeDraft,
} from "@/lib/intake";
import { ProgressSteps } from "./ProgressSteps";
import { PageContact } from "./PageContact";
import { PageBrand } from "./PageBrand";
import { PageContent } from "./PageContent";
import { PageBrainDump } from "./PageBrainDump";
import { ghostButtonClass, primaryButtonClass } from "./fields";

type Stage = "form" | "submitting" | "done";

type StoredShape = { step: number; draft: IntakeDraft };

// Multi-page intake for /start. One draft object holds every field; page
// navigation is local state (no URL params, CLAUDE.md instruction), and the
// whole draft (minus files — they can't survive JSON) mirrors to
// localStorage so a refresh doesn't lose someone's answers.
export function IntakeForm({ hasBackend }: { hasBackend: boolean }) {
  const [draft, setDraft] = useState<IntakeDraft>(emptyDraft);
  const [step, setStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  // load a draft left behind by a refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<StoredShape>;
        if (stored.draft) setDraft({ ...emptyDraft(), ...stored.draft });
        if (typeof stored.step === "number") {
          setStep(Math.min(Math.max(stored.step, 1), TOTAL_STEPS));
        }
      }
    } catch {
      // corrupt/blocked storage — just start fresh
    }
    setHydrated(true);
  }, []);

  // mirror every change back to localStorage (text fields + step only)
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: StoredShape = { step, draft };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage full/blocked — the form still works, it just won't survive a refresh
    }
  }, [draft, step, hydrated]);

  const patch = (p: Partial<IntakeDraft>) => setDraft((d) => ({ ...d, ...p }));

  const canProceed =
    step === 1
      ? page1Valid(draft)
      : step === 2
        ? page2Valid(draft, Boolean(logoFile))
        : step === 3
          ? page3Valid(draft)
          : true;

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const goBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotRef.current?.value) {
      // bots fill hidden fields — answer like a normal success and send nothing
      setStage("done");
      return;
    }
    if (!hasBackend) {
      setError(
        "The form isn't wired up on this deploy yet — the backend env vars are missing.",
      );
      return;
    }

    setStage("submitting");
    setError("");
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(draft));
      if (logoFile) fd.append("logo", logoFile);
      photos.forEach((file) => fd.append("photos", file));

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

      // best-effort — the row's already saved either way (§ spec: never
      // block the user on the mail service)
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
          Got it — thanks. We&rsquo;ll go through everything and reach out
          within a day.
        </p>
        <p className="text-sm text-muted">
          Have your logo and photos handy if we need to follow up on
          anything.
        </p>
      </div>
    );
  }

  const busy = stage === "submitting";
  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="grid gap-10">
      <ProgressSteps step={step} />

      <form onSubmit={isLastStep ? submit : goNext} className="grid gap-10">
        {step === 1 && <PageContact draft={draft} onChange={patch} />}
        {step === 2 && (
          <PageBrand
            draft={draft}
            onChange={patch}
            logoFileName={logoFile?.name ?? null}
            onLogoFile={setLogoFile}
          />
        )}
        {step === 3 && (
          <PageContent
            draft={draft}
            onChange={patch}
            photoFileNames={photos.map((f) => f.name)}
            onPhotos={setPhotos}
          />
        )}
        {step === 4 && <PageBrainDump draft={draft} onChange={patch} />}

        {/* honeypot — hidden from people, tempting to bots */}
        <label className="hidden" aria-hidden="true">
          Website
          <input ref={honeypotRef} tabIndex={-1} autoComplete="off" />
        </label>

        {error && <p className="text-sm text-accent">{error}</p>}

        <div className="flex flex-wrap items-center gap-5">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={busy}
              className={ghostButtonClass}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={busy || (!isLastStep && !canProceed)}
            className={primaryButtonClass}
          >
            {isLastStep ? (busy ? "Sending…" : "Submit") : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
