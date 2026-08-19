"use client";

import { useEffect, useRef, useState } from "react";
import {
  PHONE_KEY_RE,
  scrubDomain,
  scrubPhone,
  type Errors,
  type IntakeDraft,
} from "@/lib/intake";
import { TEMPLATES } from "@/lib/templates";
import { FieldSet, RadioCards, SelectField, TextField, Wrap, inputClass } from "./fields";

type DomainState = "idle" | "checking" | "available" | "taken" | "unknown";

const DOMAIN_NOTE: Record<DomainState, { text: string; tone: string } | null> = {
  idle: null,
  checking: { text: "Checking…", tone: "text-muted" },
  available: { text: "✓ Available", tone: "text-accent-2" },
  taken: { text: "✕ Taken. Try something else.", tone: "text-red-500" },
  unknown: {
    text: "Couldn't check right now. We'll verify at build time.",
    tone: "text-yellow-700",
  },
};

// Live availability lookup against /api/check-domain, fired on blur. A failed
// lookup is never treated as a blocker: the field still submits.
function DomainField({
  value,
  error,
  onChange,
  onBlur,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const [state, setState] = useState<DomainState>("idle");
  const checked = useRef("");

  useEffect(() => {
    if (value !== checked.current) setState("idle");
  }, [value]);

  const check = async () => {
    onBlur();
    const domain = scrubDomain(value);
    if (!domain || domain === checked.current) return;
    checked.current = domain;
    setState("checking");
    try {
      const res = await fetch(`/api/check-domain?domain=${encodeURIComponent(domain)}`);
      const json = (await res.json()) as { available?: boolean };
      if (!res.ok) setState("unknown");
      else setState(json.available ? "available" : "taken");
    } catch {
      setState("unknown");
    }
  };

  const note = DOMAIN_NOTE[state];
  return (
    <Wrap
      name="desiredDomain"
      label="What domain do you want for your site?"
      required
      error={error}
      hint={
        note ? (
          <span className={note.tone}>{note.text}</span>
        ) : (
          "Just the name, like yourshop.com. We'll register it for you."
        )
      }
    >
      <input
        name="desiredDomain"
        inputMode="url"
        placeholder="yourshop.com"
        value={value}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(scrubDomain(e.target.value))}
        onBlur={check}
        className={inputClass(error)}
      />
    </Wrap>
  );
}

export function PageContact({
  draft,
  errors,
  onChange,
  onBlur,
}: {
  draft: IntakeDraft;
  errors: Errors;
  onChange: (patch: Partial<IntakeDraft>) => void;
  onBlur: (name: string) => void;
}) {
  const touch = (name: string) => () => onBlur(name);
  const usingTemplate = draft.usingTemplate === "yes";

  return (
    <div className="grid gap-10">
      <FieldSet legend="How do you want your site built?">
        <RadioCards
          name="usingTemplate"
          value={draft.usingTemplate}
          error={errors.usingTemplate}
          onChange={(v) => {
            onChange({
              usingTemplate: v,
              ...(v === "no" ? { templateChoice: "" } : null),
            });
            onBlur("usingTemplate");
          }}
          options={[
            { value: "yes", label: "Pick a style from our work" },
            { value: "no", label: "Fully custom, built from scratch" },
          ]}
        />
      </FieldSet>

      {usingTemplate && (
        <SelectField
          name="templateChoice"
          label="Which one?"
          required
          placeholder="Choose a style"
          error={errors.templateChoice}
          value={draft.templateChoice}
          onChange={(e) => {
            onChange({ templateChoice: e.target.value });
            onBlur("templateChoice");
          }}
          onBlur={touch("templateChoice")}
          options={TEMPLATES.map((t) => ({ value: t.key, label: t.name }))}
          hint="The one you looked at on the site. You can still change your mind later."
        />
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <TextField
          name="businessName"
          label="Business name"
          required
          error={errors.businessName}
          value={draft.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          onBlur={touch("businessName")}
        />
        <TextField
          name="yourName"
          label="Your name"
          required
          error={errors.yourName}
          value={draft.yourName}
          onChange={(e) => onChange({ yourName: e.target.value })}
          onBlur={touch("yourName")}
        />
      </div>

      {/* Optional on a template build: the template already says what kind
          of business this is. On a custom build nothing else does. */}
      <TextField
        name="businessType"
        label="What kind of business is it?"
        required={!usingTemplate}
        placeholder="Flower shop, barbershop, roofing…"
        error={errors.businessType}
        value={draft.businessType}
        onChange={(e) => onChange({ businessType: e.target.value })}
        onBlur={touch("businessType")}
        hint={
          usingTemplate
            ? "Only fill this in if it's not obvious from the style you picked."
            : undefined
        }
      />

      <TextField
        name="businessEmail"
        label="Business email"
        type="email"
        required
        error={errors.businessEmail}
        value={draft.businessEmail}
        onChange={(e) => onChange({ businessEmail: e.target.value })}
        onBlur={touch("businessEmail")}
        hint="This is where your live site's contact form will send new leads. Not a login, just the inbox messages land in."
      />

      <TextField
        name="phone"
        label="Phone"
        type="tel"
        inputMode="tel"
        error={errors.phone}
        value={draft.phone}
        onChange={(e) => onChange({ phone: scrubPhone(e.target.value) })}
        // A letter never reaches state: the keystroke is dropped here, and
        // onChange scrubs what gets pasted. No warning needed for something
        // that can't be typed in the first place.
        onKeyDown={(e) => {
          const typing = e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey;
          if (typing && !PHONE_KEY_RE.test(e.key)) e.preventDefault();
        }}
        onBlur={touch("phone")}
        hint="Optional."
      />

      <TextField
        name="address"
        label="Business address, or the town you work out of"
        required
        error={errors.address}
        value={draft.address}
        onChange={(e) => onChange({ address: e.target.value })}
        onBlur={touch("address")}
      />

      <DomainField
        value={draft.desiredDomain}
        error={errors.desiredDomain}
        onChange={(v) => onChange({ desiredDomain: v })}
        onBlur={() => onBlur("desiredDomain")}
      />
    </div>
  );
}
