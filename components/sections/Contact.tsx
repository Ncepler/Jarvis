"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { styleDemos } from "@/lib/projects";
import { SITE, isTBD } from "@/lib/site";

const PATH_OPTIONS = [
  { value: "style", label: "Pick a style" },
  { value: "custom", label: "Something custom" },
  { value: "flagship", label: "You figure it out" },
] as const;

type PathChoice = (typeof PATH_OPTIONS)[number]["value"] | "";

const inputClass =
  "w-full border-b border-line bg-transparent pb-2 pt-1 text-ink transition-colors duration-200 placeholder:text-muted/60 focus:border-ink focus:outline-none";

export function Contact() {
  const [path, setPath] = useState<PathChoice>("");
  const [styleSlug, setStyleSlug] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  // gallery cards dispatch this when "Start with this style" is clicked
  useEffect(() => {
    const onPreselect = (e: Event) => {
      setPath("style");
      setStyleSlug((e as CustomEvent<string>).detail);
    };
    window.addEventListener("preselect-style", onPreselect);
    return () => window.removeEventListener("preselect-style", onPreselect);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // honeypot — bots fill it, people never see it
    if (data.get("website")) {
      setStatus("sent");
      return;
    }

    // No backend yet (decision pending) and no inbox until the brand exists.
    // Until one of those lands, submitting falls back to the visitor's own
    // mail client — or an honest error if there's no address to send to.
    if (isTBD(SITE.email)) {
      setStatus("error");
      return;
    }

    const subject = `Project inquiry — ${data.get("business") || data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Business: ${data.get("business")}`,
      `Email: ${data.get("email")}`,
      `Path: ${data.get("path") || "—"}`,
      data.get("style_slug") ? `Style: ${data.get("style_slug")}` : "",
      "",
      `${data.get("message") || ""}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <section
      id="contact"
      className="border-t border-line px-6 py-24 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-title">Start a project</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-muted">
            Tell us about your business. We reply within a day.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
        {status === "sent" ? (
          <p className="mt-16 max-w-md text-lg">
            Got it — we&apos;ll reply within a day.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-16 grid max-w-2xl gap-10"
            noValidate={false}
          >
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
              <legend className="text-sm text-muted">
                Which way in?
              </legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {PATH_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${
                      path === opt.value
                        ? "border-ink text-ink"
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

            <label className="grid gap-2 text-sm text-muted">
              Anything else?
              <textarea name="message" rows={4} className={inputClass} />
            </label>

            {/* honeypot — hidden from people, tempting to bots */}
            <label className="hidden" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>

            {status === "error" && (
              <p className="text-sm text-muted">
                The form isn&apos;t wired up yet — we&apos;re still setting up
                the inbox. Check back soon.
              </p>
            )}

            <button
              type="submit"
              className="justify-self-start border border-ink px-6 py-3 text-sm transition-colors duration-200 hover:bg-ink hover:text-bg"
            >
              Send it
            </button>
          </form>
        )}
        </Reveal>
      </div>
    </section>
  );
}
