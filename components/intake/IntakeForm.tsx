"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  STORAGE_KEY,
  emptyDraft,
  mergedCustomizations,
  slugify,
  stepsFor,
  validateStep,
  type IntakeDraft,
  type IntakeUploads,
  type Row,
} from "@/lib/intake";
import { questionsFor, templateByKey } from "@/lib/templates";
import { SITE } from "@/lib/site";
import { getTemplateContent } from "@/app/start/actions";
import { ProgressSteps } from "./ProgressSteps";
import { PageContact } from "./PageContact";
import { PageBrand } from "./PageBrand";
import { PageContent } from "./PageContent";
import { PageCustomize } from "./PageCustomize";
import { PageBrainDump } from "./PageBrainDump";
import { ghostButtonClass, primaryButtonClass } from "./fields";

type Stage = "form" | "submitting" | "done";
type Stored = { step: number; draft: IntakeDraft };

// Multi-page intake for /start. One draft object holds every answer, including
// where each uploaded file landed in Storage, and it mirrors to localStorage
// so a refresh doesn't cost someone their answers or their uploads.
//
// Validation model: errors are recomputed on every render, but a message is
// only *shown* once its field has been blurred, or once someone has pressed
// Next on a page with problems. Next is never silently disabled — pressing it
// with something wrong reveals every message at once and jumps to the first.
export function IntakeForm({ hasBackend }: { hasBackend: boolean }) {
  const [draft, setDraft] = useState<IntakeDraft>(emptyDraft);
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [touched, setTouched] = useState<Record<string, true>>({});
  const [showAll, setShowAll] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // The chosen template's real content, read off its source server-side.
  const [content, setContent] = useState<Record<string, Row[]>>({});
  const [loadingContent, setLoadingContent] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // A second click event can land before React's re-render disables the
  // button — this ref blocks it synchronously, the instant the handler
  // runs, rather than waiting on state. Two real rows landed 0.4s apart
  // from exactly that gap.
  const sendingRef = useRef(false);

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
    // Arriving from a gallery card or a demo's tier bar, e.g.
    // /start?style=demo-bakery&tier=premium. `style` is the current param —
    // "template" never appears anywhere a client sees, address bar included.
    // `template` stays as a silent alias so any older link keeps working.
    const searchParams = new URLSearchParams(window.location.search);
    const wanted = searchParams.get("style") || searchParams.get("template");
    const tierParam = searchParams.get("tier");
    const wantedTier = tierParam === "basic" || tierParam === "premium" ? tierParam : undefined;
    if (wanted && templateByKey(wanted)) {
      // Arriving with a style already picked doesn't answer the "what
      // matters more" question — default to Basic (the visitor can change
      // it) rather than leaving tier blank with a style already chosen,
      // unless the link itself already said which tier they were looking at.
      setDraft((d) => ({
        ...d,
        tier: wantedTier || d.tier || "basic",
        usingTemplate: "yes",
        templateChoice: wanted,
      }));
    }
    setHydrated(true);
  }, []);

  const steps = useMemo(() => stepsFor(draft), [draft]);
  // A draft loaded from storage can point past the end when someone switches
  // to a custom build, so the index is always clamped to what exists.
  const step = Math.min(index, steps.length - 1);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const patch = useCallback(
    (p: Partial<IntakeDraft>) => setDraft((d) => ({ ...d, ...p })),
    [],
  );
  const patchUploads = (p: Partial<IntakeUploads>) =>
    setDraft((d) => ({ ...d, uploads: { ...d.uploads, ...p } }));
  const blur = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, draft } satisfies Stored));
    } catch {
      // storage full or blocked, the form still works
    }
  }, [draft, step, hydrated]);

  // Every upload for one submission shares a storage folder. Created by the
  // first upload rather than on mount, so the business name is already in it,
  // and held in a ref so an upload handler can read it without waiting for a
  // render. Fixed once created: it must not move if the name is edited later.
  const prefixRef = useRef(draft.uploads.prefix);
  useEffect(() => {
    if (draft.uploads.prefix) prefixRef.current = draft.uploads.prefix;
  }, [draft.uploads.prefix]);

  const getPrefix = useCallback(() => {
    if (!prefixRef.current) {
      prefixRef.current = `${slugify(draft.businessName) || "intake"}-${Date.now()}`;
      setDraft((d) => ({ ...d, uploads: { ...d.uploads, prefix: prefixRef.current } }));
    }
    return prefixRef.current;
  }, [draft.businessName]);

  // Read the chosen template's content, then seed every list with what that
  // template says today. Switching template throws the old answers out rather
  // than carrying them across a same-named question: they described a
  // different site.
  const templateChoice = draft.usingTemplate === "yes" ? draft.templateChoice : "";
  useEffect(() => {
    if (!templateChoice) return setContent({});
    let live = true;
    setLoadingContent(true);
    getTemplateContent(templateChoice)
      .then((rows) => {
        if (!live) return;
        setContent(rows);
        setDraft((d) => {
          const fresh = d.templateListsFor !== templateChoice;
          const lists: Record<string, Row[]> = {};
          for (const q of questionsFor(templateChoice)) {
            if (!q.list) continue;
            lists[q.key] = (fresh ? undefined : d.templateLists[q.key]) ?? rows[q.key] ?? [];
          }
          return { ...d, templateLists: lists, templateListsFor: templateChoice };
        });
      })
      .catch(() => live && setContent({}))
      .finally(() => live && setLoadingContent(false));
    return () => {
      live = false;
    };
  }, [templateChoice]);

  const allErrors = validateStep(current.id, draft);
  const visible = Object.fromEntries(
    Object.entries(allErrors).filter(([k]) => showAll || touched[k]),
  );
  const problems = Object.keys(allErrors).length;

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

  const send = async () => {
    setStage("submitting");
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          templateCustomizations: mergedCustomizations(draft),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "That didn't send. Give it another try in a minute.",
        );
        setStage("form");
        sendingRef.current = false;
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

      if (typeof json.refCode === "string") setRefCode(json.refCode);

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // nothing to clean up if storage was never writable
      }
      setStage("done");
    } catch {
      setError("That didn't send. Check your connection and try again — nothing you typed is lost.");
      setStage("form");
      sendingRef.current = false;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problems > 0) return reveal();
    if (!isLast) return goTo(step + 1);
    if (!termsAccepted) return;
    if (honeypotRef.current?.value) {
      // bots fill hidden fields. Answer like a normal success, send nothing.
      setStage("done");
      return;
    }
    if (!hasBackend) {
      setError("The form isn't wired up on this deploy yet, the backend env vars are missing.");
      return;
    }
    // Blocked synchronously, not through `busy`/`disabled` — a second click
    // fired before React re-renders the disabled button shouldn't slip a
    // second request through.
    if (sendingRef.current) return;
    sendingRef.current = true;
    void send();
  };

  if (stage === "done") {
    return (
      <div className="grid gap-8 py-10">
        <div className="grid gap-5">
          <h1 className="font-display text-title text-ink">Got it — we&rsquo;re on it.</h1>
          <p className="max-w-md leading-relaxed text-muted">
            We reply within one business day to confirm details and get
            started. If you don&rsquo;t hear back, check your spam folder or email
            us at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-accent underline underline-offset-4"
            >
              {SITE.email}
            </a>
            .
          </p>
        </div>

        {refCode && (
          <div className="grid max-w-md gap-3 border border-line bg-surface p-6">
            <span className="text-sm text-muted">Your reference code</span>
            <span className="font-display text-3xl tracking-[-0.01em] text-ink">
              {refCode}
            </span>
            <p className="text-sm leading-relaxed text-muted">
              Write this down somewhere you&rsquo;ll actually find it again.
              You&rsquo;ll need this code and the email you just gave us any
              time you want to send us changes to your site.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(refCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2400);
                } catch {
                  // clipboard blocked — the code is right there to select
                }
              }}
              className={ghostButtonClass}
            >
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const busy = stage === "submitting";

  return (
    <>
      <h1 className="text-title font-display text-ink">Let&rsquo;s get your site built.</h1>
      <p className="mt-4 max-w-md text-muted">
        A few questions about your business so we can start building. Takes
        about five minutes, and nothing here locks you in.
      </p>
      {!hasBackend && (
        <p className="mt-6 max-w-md text-sm text-accent">
          Heads up: this form isn&rsquo;t wired up to save submissions on this
          deploy yet.
        </p>
      )}

      <div className="mt-16 grid gap-10">
        <ProgressSteps steps={steps} step={step} />

        <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-10">
          {showAll && problems > 0 && (
            <p className="animate-fade-in border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              Fix the highlighted fields to continue.
            </p>
          )}

          {current.id === "contact" && (
            <PageContact draft={draft} errors={visible} onChange={patch} onBlur={blur} />
          )}
          {current.id === "brand" && (
            <PageBrand
              draft={draft}
              errors={visible}
              onChange={patch}
              onUploads={patchUploads}
              onBlur={blur}
              getPrefix={getPrefix}
            />
          )}
          {current.id === "content" && (
            <PageContent
              draft={draft}
              errors={visible}
              onChange={patch}
              onUploads={patchUploads}
              onBlur={blur}
              getPrefix={getPrefix}
            />
          )}
          {current.id === "customize" && (
            <PageCustomize
              draft={draft}
              errors={visible}
              content={content}
              loading={loadingContent}
              onChange={patch}
            />
          )}
          {current.id === "braindump" && <PageBrainDump draft={draft} onChange={patch} />}

          {/* honeypot, hidden from people and tempting to bots */}
          <label className="hidden" aria-hidden="true">
            Website
            <input ref={honeypotRef} tabIndex={-1} autoComplete="off" />
          </label>

          {error && (
            <div className="grid gap-3 border border-red-500/40 bg-red-500/5 px-4 py-4">
              <p className="text-sm text-red-500">{error}</p>
              <p className="text-xs text-muted">
                Everything you typed is still here, and your uploads are already
                saved.
              </p>
            </div>
          )}

          {isLast && (
            <label className="flex cursor-pointer items-start gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors duration-200 hover:text-ink"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors duration-200 hover:text-ink"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          )}

          <div className="flex flex-wrap items-center gap-5">
            {step > 0 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={busy}
                className={ghostButtonClass}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={busy || (isLast && !termsAccepted)}
              className={primaryButtonClass}
            >
              {isLast ? (busy ? "Sending…" : error ? "Try again" : "Submit") : "Next"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
