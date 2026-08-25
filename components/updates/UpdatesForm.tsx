"use client";

import { useState, useTransition } from "react";
import { lookupSubmission, sendUpdateRequest } from "@/app/updates/actions";
import type { LookupResult } from "@/lib/updates";
import { ghostButtonClass, primaryButtonClass, TextAreaField, TextField } from "@/components/intake/fields";

type Step = "lookup" | "confirm" | "request" | "done";

// Same visual language as /start (components/intake/fields.tsx): bottom-
// border inputs, the same button classes, errors surfaced the same way.
export function UpdatesForm() {
  const [step, setStep] = useState<Step>("lookup");
  const [refCode, setRefCode] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [found, setFound] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const doLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const result = await lookupSubmission(refCode, email);
      if (!result.ok) return setError(result.error);
      setFound(result.value);
      setStep("confirm");
    });
  };

  const doSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!found) return;
    setError("");
    start(async () => {
      const result = await sendUpdateRequest(refCode, found.submissionId, body);
      if (!result.ok) return setError(result.error);
      setStep("done");
    });
  };

  if (step === "done") {
    return (
      <div className="grid gap-5 py-10">
        <h1 className="font-display text-title text-ink">Got it.</h1>
        <p className="max-w-md leading-relaxed text-muted">
          We&rsquo;ll read this and get back to you at the email on file.
          Keep your code, you&rsquo;ll need it again next time.
        </p>
      </div>
    );
  }

  if (step === "confirm" && found) {
    return (
      <div className="grid gap-10">
        <div className="grid gap-2">
          <h1 className="font-display text-title text-ink">Is this you?</h1>
        </div>

        <div className="grid gap-4 border border-line bg-surface p-6 text-sm">
          <div className="grid gap-1">
            <span className="text-muted">Business</span>
            <span className="text-ink">{found.businessName || "—"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted">Contact</span>
            <span className="text-ink">{found.contactName || "—"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted">Build</span>
            <span className="text-ink">{found.buildType}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted">Email on file</span>
            <span className="text-ink">{found.maskedEmail}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setStep("request")}
            className={primaryButtonClass}
          >
            Yes, that&rsquo;s me
          </button>
          <button
            type="button"
            onClick={() => {
              setFound(null);
              setError("");
              setStep("lookup");
            }}
            className={ghostButtonClass}
          >
            That&rsquo;s not right
          </button>
        </div>
      </div>
    );
  }

  if (step === "request" && found) {
    return (
      <form onSubmit={doSend} className="grid gap-10">
        <div className="grid gap-2">
          <h1 className="font-display text-title text-ink">What do you want changed?</h1>
          <p className="max-w-md text-muted">
            Write out everything you want changed. Plain English is fine, and
            it doesn&rsquo;t need to be organized. Just get it all down and
            we&rsquo;ll sort it out.
          </p>
        </div>

        <TextAreaField
          name="body"
          label="What's changing"
          required
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-5">
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Sending…" : "Send it."}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={doLookup} className="grid gap-10">
      <div className="grid gap-2">
        <h1 className="font-display text-title text-ink">Send us changes.</h1>
        <p className="max-w-md text-muted">
          Enter the reference code we gave you when you started, plus the
          email you signed up with.
        </p>
      </div>

      <TextField
        name="refCode"
        label="Reference code"
        required
        placeholder="VS-4817"
        value={refCode}
        onChange={(e) => setRefCode(e.target.value)}
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Checking…" : "Look it up"}
        </button>
      </div>
    </form>
  );
}
