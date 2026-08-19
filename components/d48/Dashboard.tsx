"use client";

import { useState, useTransition } from "react";
import { copyBuildPrompt, copyTemplateCode, logout, setStatus } from "@/app/d48/actions";
import { STATUSES, type SubmissionRow } from "@/lib/intake";
import { questionsFor, templateByKey } from "@/lib/templates";

const hairline = "border-b border-line";
const meta = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const isImage = (url: string) => /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(url);

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "done"
      ? "border-accent-2 text-accent-2"
      : status === "in progress"
        ? "border-accent text-accent"
        : "border-line text-muted";
  return (
    <span className={`shrink-0 border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.14em] ${tone}`}>
      {status}
    </span>
  );
}

// Runs a server action, copies whatever it returns, and says so for 2s.
function CopyButton({
  label,
  get,
}: {
  label: string;
  get: () => Promise<string>;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState("");
  const [pending, start] = useTransition();

  const click = () =>
    start(async () => {
      try {
        await navigator.clipboard.writeText(await get());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        setFailed(e instanceof Error ? e.message : "Couldn't copy that.");
      }
    });

  return (
    <span className="grid gap-1">
      <button
        type="button"
        onClick={click}
        disabled={pending}
        className="press cursor-pointer border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-ink disabled:opacity-40"
      >
        {copied ? "Copied!" : pending ? "…" : label}
      </button>
      {failed && <span className="text-xs text-red-500">{failed}</span>}
    </span>
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  const v = typeof value === "string" ? value.trim() : value;
  if (v === null || v === undefined || v === "" || v === false) return null;
  return (
    <div className="grid gap-1 py-2">
      <span className={meta}>{label}</span>
      <span className="whitespace-pre-wrap text-sm text-ink">{String(v)}</span>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    // content-start matters: these sit in a 2-col grid whose rows stretch, and
    // without it a short group spreads its fields to fill the tall one's height.
    <section className="grid content-start gap-1">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <div className={`grid content-start ${hairline} pb-4`}>{children}</div>
    </section>
  );
}

function Asset({ label, url }: { label: string; url: string }) {
  return (
    <figure className="grid gap-2">
      <span className={meta}>{label}</span>
      {isImage(url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          className="h-32 w-full border border-line bg-surface object-contain"
        />
      ) : (
        <video src={url} controls muted className="h-32 w-full border border-line bg-surface object-contain" />
      )}
      <a
        href={url}
        download
        target="_blank"
        rel="noreferrer"
        className="text-xs text-accent underline underline-offset-4"
      >
        Download
      </a>
    </figure>
  );
}

function Detail({ row }: { row: SubmissionRow }) {
  const [status, setLocal] = useState(row.status ?? "new");
  const [, start] = useTransition();
  const tpl = templateByKey(row.template_choice ?? "");
  const answers = row.template_customizations ?? {};

  const assets: { label: string; url: string }[] = [
    ["Main logo", row.main_logo_url],
    ["Profile logo (cropped)", row.profile_logo_url],
    ["Profile logo (original)", row.profile_logo_original_url],
    ["Logo (older submission)", row.logo_url],
    ["Hero video", row.hero_video_url],
  ]
    .filter((p): p is [string, string] => Boolean(p[1]))
    .map(([label, url]) => ({ label, url }))
    .concat((row.photo_urls ?? []).map((p) => ({ label: p.name, url: p.url })));

  return (
    <div className="grid gap-8 border-t border-line bg-surface px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          Status
          <select
            value={status}
            onChange={(e) => {
              const next = e.target.value;
              setLocal(next);
              start(() => {
                setStatus(row.id, next).catch(() => setLocal(row.status ?? "new"));
              });
            }}
            className="cursor-pointer border border-line bg-bg px-2 py-1 text-sm text-ink"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <CopyButton label="Copy build prompt" get={() => copyBuildPrompt(row.id)} />
        {tpl && (
          <CopyButton label="Copy template code" get={() => copyTemplateCode(tpl.key)} />
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Group title="Contact">
          <Field label="Business" value={row.business_name} />
          <Field label="Type of business" value={row.business_type} />
          <Field label="Contact person" value={row.your_name} />
          <Field label="Email" value={row.business_email} />
          <Field label="Phone" value={row.phone} />
          <Field label="Address" value={row.address} />
          <Field label="Domain they want" value={row.desired_domain} />
          <Field
            label="Build"
            value={row.is_custom_build ? "Custom build, no template" : (tpl?.name ?? row.template_choice ?? row.template)}
          />
        </Group>

        <Group title="Brand">
          <Field
            label="Palette"
            value={row.palette_choice === "own" ? "Their own colors" : row.palette_choice === "template" ? "Keep the template's" : null}
          />
          <Field label="Main color" value={row.main_color} />
          <Field label="Accent color" value={row.accent_color} />
          <Field label="Has a logo" value={row.has_logo} />
        </Group>

        <Group title="Content">
          <Field label="Services" value={row.services} />
          <Field
            label="Hours"
            value={(row.hours ?? [])
              .map((h) => `${h.day}: ${h.closed ? "closed" : `${h.open} to ${h.close}`}`)
              .join("\n")}
          />
          <Field label="Instagram" value={row.instagram} />
          <Field label="Facebook" value={row.facebook} />
          <Field label="Google Business" value={row.google_business} />
        </Group>

        <Group title={tpl ? `${tpl.name} template` : "Template"}>
          {tpl ? (
            questionsFor(tpl.key)
              .map((q) => <Field key={q.key} label={q.label} value={answers[q.key]} />)
              .filter(Boolean)
          ) : (
            <p className="py-2 text-sm text-muted">No template on this one.</p>
          )}
          <Field label="Copy changes they asked for" value={row.copy_changes} />
        </Group>
      </div>

      <Group title="Brain dump">
        <Field label="Their words" value={row.brain_dump} />
      </Group>

      {assets.length > 0 && (
        <section className="grid gap-4">
          <h3 className="font-display text-lg text-ink">Files</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {assets.map((a) => (
              <Asset key={a.url} label={a.label} url={a.url} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function Dashboard({ rows, error }: { rows: SubmissionRow[]; error?: string }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-title text-ink">Intake</h1>
        <form action={logout}>
          <button type="submit" className="cursor-pointer text-sm text-muted hover:text-ink">
            Sign out
          </button>
        </form>
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      {!error && rows.length === 0 && (
        <p className="text-sm text-muted">Nothing has come in yet.</p>
      )}

      <div className="grid">
        {rows.map((row) => {
          const isOpen = open === row.id;
          const tpl = templateByKey(row.template_choice ?? "");
          return (
            <div key={row.id} className={hairline}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : row.id)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 px-1 py-5 text-left transition-colors duration-200 hover:bg-surface"
              >
                <span className="min-w-0 flex-1 truncate text-ink">
                  {row.business_name || "(no name)"}
                </span>
                <span className={meta}>{fmtDate(row.created_at)}</span>
                <span className={meta}>
                  {row.is_custom_build ? "custom" : (tpl?.name ?? row.template_choice ?? row.template ?? "—")}
                </span>
                <StatusBadge status={row.status ?? "new"} />
                <span className="w-4 text-muted">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <Detail row={row} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
