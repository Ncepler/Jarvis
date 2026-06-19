"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { styleDemos } from "@/lib/projects";
import { COPY, SITE, isTBD } from "@/lib/site";

const PATH_OPTIONS = [
  { value: "style", label: "Pick a style" },
  { value: "custom", label: "Something custom" },
  { value: "flagship", label: "You figure it out" },
] as const;

type PathChoice = (typeof PATH_OPTIONS)[number]["value"] | "";

const inputClass =
  "w-full border-b border-line bg-transparent pb-2 pt-1 text-ink transition-colors duration-200 placeholder:text-muted/60 focus:border-ink focus:outline-none";

const submitClass =
  "press cursor-pointer border border-accent bg-accent px-6 py-3 text-sm text-white transition-colors duration-200 hover:bg-accent/90 disabled:cursor-default disabled:opacity-50";

// Two-step intake. Step 1 alone writes a complete lead row — step 2 is a
// bonus that updates the same row, and skipping it is a first-class path.
// Without backend env vars the whole thing collapses to a single-step
// mailto form (or an honest error while SITE.email is still TBD).
export function Contact({ hasBackend }: { hasBackend: boolean }) {
  const [path, setPath] = useState<PathChoice>("");
  const [styleSlug, setStyleSlug] = useState("");
  const [stage, setStage] = useState<"one" | "two" | "done">("one");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [colorsUnsure, setColorsUnsure] = useState(false);

  // gallery cards dispatch this when "Start with this style" is clicked
  useEffect(() => {
    const onPreselect = (e: Event) => {
      setPath("style");
      setStyleSlug((e as CustomEvent<string>).detail);
    };
    window.addEventListener("preselect-style", onPreselect);
    return () => window.removeEventListener("preselect-style", onPreselect);
  }, []);

  const onStepOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // honeypot — bots fill it, people never see it
    if (data.get("website")) {
      setStage("done");
      return;
    }

    if (!hasBackend) {
      // mailto fallback: one step, every field at once — or an honest
      // error while there's no address to send to
      if (isTBD(SITE.email)) {
        setError(
          "The form isn't wired up yet. We're still setting up the inbox; check back soon.",
        );
        return;
      }
      const subject = `Project inquiry — ${data.get("business") || data.get("name")}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Business: ${data.get("business")}`,
        `Email: ${data.get("email")}`,
        `Path: ${data.get("path") || "—"}`,
        data.get("style_slug") ? `Style: ${data.get("style_slug")}` : "",
        data.get("colors") ? `Colors: ${data.get("colors")}` : "",
        data.get("links") ? `Links: ${data.get("links")}` : "",
        "",
        `${data.get("details") || ""}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStage("done");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          email: data.get("email"),
          path: data.get("path") || "",
          style_slug: data.get("style_slug") || "",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : COPY.contact.errorSave);
        return;
      }
      // the lead is saved — everything past this point is optional
      setLeadId(typeof json.id === "string" ? json.id : null);
      setStage("two");
    } catch {
      setError(COPY.contact.errorSave);
    } finally {
      setBusy(false);
    }
  };

  const onStepTwo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    try {
      if (leadId) {
        await fetch("/api/lead", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId,
            colors: colorsUnsure ? "not sure yet" : data.get("colors"),
            links: data.get("links"),
            details: data.get("details"),
          }),
        });
      }
    } catch {
      // step 1 already saved the lead; the extras failing never blocks success
    } finally {
      setBusy(false);
      setStage("done");
    }
  };

  return (
    <section
      id="contact"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          a={COPY.headings.contact.a}
          b={COPY.headings.contact.b}
        />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-muted">{COPY.contact.sub}</p>
          <p className="mt-3 max-w-md text-sm text-muted">
            {COPY.contact.reassurance}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          {stage === "done" ? (
            <p className="mt-16 max-w-md text-lg">{COPY.contact.success}</p>
          ) : stage === "two" ? (
            <form onSubmit={onStepTwo} className="mt-16 grid max-w-2xl gap-10">
              <div className="grid gap-2">
                {hasBackend && (
                  <span className="text-xs text-muted tabular-nums">2 of 2</span>
                )}
                <p className="max-w-md">{COPY.contact.step2Intro}</p>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-2 text-sm text-muted">
                  Brand colors, if you have them
                  <input
                    name="colors"
                    disabled={colorsUnsure}
                    className={`${inputClass} disabled:opacity-40`}
                  />
                </label>
                <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={colorsUnsure}
                    onChange={(e) => setColorsUnsure(e.target.checked)}
                    className="size-4 accent-accent"
                  />
                  Not sure yet
                </label>
              </div>

              <label className="grid gap-2 text-sm text-muted">
                Got a current site, Instagram, or Google listing? Drop a link
                <input name="links" className={inputClass} />
              </label>

              <label className="grid gap-2 text-sm text-muted">
                Anything else?
                <textarea name="details" rows={4} className={inputClass} />
              </label>

              <div className="flex flex-wrap items-baseline gap-5">
                <button type="submit" disabled={busy} className={submitClass}>
                  Send it
                </button>
                <button
                  type="button"
                  onClick={() => setStage("done")}
                  className="cursor-pointer text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  Skip this
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onStepOne} className="mt-16 grid max-w-2xl gap-10">
              {hasBackend && (
                <span className="text-xs text-muted tabular-nums">1 of 2</span>
              )}
              <div className="grid gap-10 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-muted">
                  Your name
                  <input name="name" required className={inputClass} />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Business name
                  <input name="business" required className={inputClass} />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-muted">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                />
              </label>

              <fieldset className="grid gap-3">
                <legend className="text-sm text-muted">Which way in?</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {PATH_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${
                        path === opt.value
                          ? "border-accent text-ink"
                          : "border-line text-muted hover:text-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="path"
                        value={opt.value}
                        checked={path === opt.value}
                        onChange={() => setPath(opt.value)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {path === "style" && styleDemos.length > 0 && (
                <label className="grid gap-2 text-sm text-muted">
                  Which style?
                  <select
                    name="style_slug"
                    value={styleSlug}
                    onChange={(e) => setStyleSlug(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="" className="bg-bg">
                      Not sure yet
                    </option>
                    {styleDemos.map((p) => (
                      <option key={p.slug} value={p.slug} className="bg-bg">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {!hasBackend && (
                <>
                  <label className="grid gap-2 text-sm text-muted">
                    Brand colors, if you have them
                    <input name="colors" className={inputClass} />
                  </label>
                  <label className="grid gap-2 text-sm text-muted">
                    Got a current site, Instagram, or Google listing? Drop a
                    link
                    <input name="links" className={inputClass} />
                  </label>
                  <label className="grid gap-2 text-sm text-muted">
                    Anything else?
                    <textarea name="details" rows={4} className={inputClass} />
                  </label>
                </>
              )}

              {/* honeypot — hidden from people, tempting to bots */}
              <label className="hidden" aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              {error && <p className="text-sm text-muted">{error}</p>}

              <div className="grid gap-4">
                <div className="flex flex-wrap items-baseline gap-5">
                  <button type="submit" disabled={busy} className={submitClass}>
                    Send it
                  </button>
                  <span className="text-sm text-muted">
                    {COPY.contact.nearSubmit}
                  </span>
                </div>
                {/* the same risk-reversal sentence as under the tier grid —
                    identical on purpose, it's the scam-killer (audit 2026-06-12) */}
                <p className="text-sm text-muted">{COPY.services.riskReversal}</p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
