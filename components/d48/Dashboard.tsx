"use client";

import { Fragment, useEffect, useMemo, useState, useTransition } from "react";
import {
  archive,
  copyBuildPrompt,
  copyTemplateCode,
  destroy,
  logout,
  markRequestHandled,
  setStatus,
  type Result,
} from "@/app/d48/actions";
import type { UpdateRequestRow } from "@/lib/d48";
import { LIVE_STATUSES, STATUSES, droppedLabels, type SubmissionRow } from "@/lib/intake";
import { questionsFor, templateByKey } from "@/lib/templates";

const hairline = "border-b border-line";
const meta = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const isImage = (url: string) => /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(url);

const statusOf = (row: SubmissionRow) => row.status ?? "new";
const templateOf = (row: SubmissionRow) =>
  row.is_custom_build
    ? "Custom"
    : (templateByKey(row.template_choice ?? "")?.name ?? row.template_choice ?? "—");

// ── Icons ────────────────────────────────────────────────────────────────
// Line icons rather than emoji (CLAUDE.md §5), sized to the row.
const svg = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.3 };

const EyeIcon = () => (
  <svg {...svg} aria-hidden="true">
    <path d="M1 8s2.6-4.2 7-4.2S15 8 15 8s-2.6 4.2-7 4.2S1 8 1 8Z" />
    <circle cx="8" cy="8" r="1.9" />
  </svg>
);

const ArchiveIcon = () => (
  <svg {...svg} aria-hidden="true">
    <rect x="1.8" y="2.6" width="12.4" height="3" />
    <path d="M3 5.6v7.8h10V5.6M6.2 8.4h3.6" />
  </svg>
);

const TrashIcon = () => (
  <svg {...svg} aria-hidden="true">
    <path d="M2.6 4.2h10.8M6.4 4.2V2.6h3.2v1.6M4 4.2l.7 9.2h6.6l.7-9.2M6.6 6.6v4.4M9.4 6.6v4.4" />
  </svg>
);

// ── Bits ─────────────────────────────────────────────────────────────────
const TONE: Record<string, string> = {
  new: "border-accent/40 bg-accent/[0.07] text-accent",
  "in progress": "border-line bg-surface text-ink",
  done: "border-accent-2/40 bg-accent-2/[0.07] text-accent-2",
  archived: "border-line bg-transparent text-muted/70",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block shrink-0 border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.14em] ${
        TONE[status] ?? TONE.archived
      }`}
    >
      {status}
    </span>
  );
}

const iconButtonClass =
  "grid size-8 cursor-pointer place-items-center border border-transparent text-muted transition-colors duration-200 hover:border-line hover:text-ink disabled:cursor-default disabled:opacity-40";

function IconButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`${iconButtonClass} ${danger ? "hover:border-red-500/50 hover:text-red-500" : ""}`}
    >
      {children}
    </button>
  );
}

// Destructive actions ask first. One dialog for both, with the copy carrying
// the difference — a browser confirm in the middle of this page would look
// like a different piece of software.
function ConfirmDialog({
  title,
  body,
  confirm,
  danger,
  busy,
  error,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirm: string;
  danger?: boolean;
  busy: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="grid w-full max-w-md gap-4 border border-line bg-bg p-6"
      >
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <p className="text-sm leading-relaxed text-muted">{body}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={onConfirm}
            className={`press cursor-pointer border px-5 py-2 text-sm transition-colors duration-200 disabled:opacity-40 ${
              danger
                ? "border-red-500 bg-red-500 text-white hover:bg-red-500/90"
                : "border-accent bg-accent text-white hover:bg-accent/90"
            }`}
          >
            {busy ? "Working…" : confirm}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="press cursor-pointer border border-line px-5 py-2 text-sm text-ink transition-colors duration-200 hover:border-ink disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Runs a server action, copies whatever it returns, and confirms beside the
// button. The label stays put: a button that renames itself is a button you
// can't find again.
function CopyButton({
  label,
  get,
}: {
  label: string;
  get: () => Promise<Result<string>>;
}) {
  const [note, setNote] = useState("");
  const [failed, setFailed] = useState("");
  const [pending, start] = useTransition();

  const click = () =>
    start(async () => {
      setFailed("");
      const result = await get();
      if (!result.ok) return setFailed(result.error);
      try {
        await navigator.clipboard.writeText(result.value);
        setNote("Copied to clipboard");
        setTimeout(() => setNote(""), 2400);
      } catch {
        setFailed("The browser wouldn't let us reach the clipboard.");
      }
    });

  return (
    <span className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={click}
        disabled={pending}
        className="press cursor-pointer border border-line px-4 py-2 text-sm text-ink transition-colors duration-200 hover:border-ink disabled:opacity-40"
      >
        {label}
      </button>
      {pending && <span className={meta}>Working…</span>}
      {note && (
        <span role="status" className="animate-fade-in font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2">
          {note}
        </span>
      )}
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
  const [status, setLocal] = useState(statusOf(row));
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
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          Status
          <select
            value={LIVE_STATUSES.includes(status as never) ? status : ""}
            onChange={(e) => {
              const next = e.target.value;
              setLocal(next);
              start(async () => {
                const result = await setStatus(row.id, next);
                if (!result.ok) setLocal(statusOf(row));
              });
            }}
            className="cursor-pointer border border-line bg-bg px-2 py-1 text-sm text-ink"
          >
            {status === "archived" && <option value="">archived</option>}
            {LIVE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <CopyButton label="Copy build prompt" get={() => copyBuildPrompt(row.id)} />
        {tpl && <CopyButton label="Copy template code" get={() => copyTemplateCode(tpl.key)} />}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Group title="Contact">
          <Field label="Reference code" value={row.ref_code} />
          <Field label="Business" value={row.business_name} />
          <Field label="Type of business" value={row.business_type} />
          <Field label="Contact person" value={row.your_name} />
          <Field label="Personal email" value={row.personal_email} />
          <Field label="Business email" value={row.business_email} />
          <Field label="Phone" value={row.phone} />
          <Field label="Address" value={row.address} />
          <Field label="Domain they want" value={row.desired_domain} />
          <Field label="Build" value={row.is_custom_build ? "Custom build, no template" : templateOf(row)} />
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
            questionsFor(tpl.key).map((q) => <Field key={q.key} label={q.label} value={answers[q.key]} />)
          ) : (
            <p className="py-2 text-sm text-muted">No template on this one.</p>
          )}
          <Field label="Copy changes they asked for" value={row.copy_changes} />
          <Field
            label="Sections to remove"
            value={droppedLabels(row.template_choice ?? "", row.dropped_sections ?? []).join("\n")}
          />
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

// ── The list ─────────────────────────────────────────────────────────────
type Filter = "all" | string;
type SortKey = "created_at" | "status";
type Pending = { kind: "archive" | "delete"; row: SubmissionRow } | null;

const th = "px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted";

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th scope="col" className={th} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={onClick}
        className={`cursor-pointer transition-colors duration-200 hover:text-ink ${active ? "text-ink" : ""}`}
      >
        {label}
        <span aria-hidden="true" className="ml-1">
          {active ? (dir === "asc" ? "↑" : "↓") : "·"}
        </span>
      </button>
    </th>
  );
}

export function Dashboard({
  rows,
  requests,
  error,
}: {
  rows: SubmissionRow[];
  requests: UpdateRequestRow[];
  error?: string;
}) {
  const [view, setView] = useState<"submissions" | "updates">("submissions");
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "created_at",
    dir: "desc",
  });
  const [pending, setPending] = useState<Pending>(null);
  const [busy, startAction] = useTransition();
  const [actionError, setActionError] = useState("");

  const counts = useMemo(() => {
    const out: Record<string, number> = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    for (const row of rows) out[statusOf(row)] = (out[statusOf(row)] ?? 0) + 1;
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    // "All" means everything still in play. Archived is its own view, which is
    // the point of archiving.
    const kept = rows.filter((r) =>
      filter === "all" ? statusOf(r) !== "archived" : statusOf(r) === filter,
    );
    const rank = (r: SubmissionRow) =>
      sort.key === "created_at" ? r.created_at : String(STATUSES.indexOf(statusOf(r) as never));
    return [...kept].sort((a, b) => {
      const cmp = rank(a) < rank(b) ? -1 : rank(a) > rank(b) ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, filter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const run = () => {
    if (!pending) return;
    const { kind, row } = pending;
    setActionError("");
    startAction(async () => {
      const result = await (kind === "archive" ? archive(row.id) : destroy(row.id));
      if (!result.ok) return setActionError(result.error);
      setOpen((id) => (id === row.id ? null : id));
      setPending(null);
    });
  };

  const newRequests = requests.filter((r) => r.status !== "done").length;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-title text-ink">
          {view === "submissions" ? "Intake submissions" : "Update requests"}
        </h1>
        <form action={logout}>
          <button type="submit" className="cursor-pointer text-sm text-muted hover:text-ink">
            Sign out
          </button>
        </form>
      </div>

      {/* Following the existing dashboard's own pattern of a filter control
          rather than separate routes — /d48 has no nav to extend. */}
      <div className="flex gap-2" role="tablist" aria-label="Dashboard view">
        {(
          [
            ["submissions", `Submissions (${rows.length})`],
            ["updates", `Update requests (${newRequests})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`cursor-pointer border px-4 py-2 text-sm transition-colors duration-200 ${
              view === key
                ? "border-accent text-ink"
                : "border-line text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "updates" ? (
        <UpdateRequestsPanel requests={requests} error={error} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className={meta}>
              {STATUSES.map((s) => `${counts[s] ?? 0} ${s}`).join(" · ")}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted">
              Show
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="cursor-pointer border border-line bg-bg px-2 py-1 text-sm text-ink"
              >
                <option value="all">All</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          {!error && shown.length === 0 && (
            <p className="text-sm text-muted">
          {filter === "all" ? "Nothing has come in yet." : `No ${filter} submissions yet.`}
        </p>
      )}

      {shown.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className={hairline}>
                <th scope="col" className={th}>
                  Business
                </th>
                <th scope="col" className={th}>
                  Code
                </th>
                <th scope="col" className={th}>
                  Template
                </th>
                <SortHeader
                  label="Submitted"
                  active={sort.key === "created_at"}
                  dir={sort.dir}
                  onClick={() => toggleSort("created_at")}
                />
                <SortHeader
                  label="Status"
                  active={sort.key === "status"}
                  dir={sort.dir}
                  onClick={() => toggleSort("status")}
                />
                <th scope="col" className={`${th} text-right`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const isOpen = open === row.id;
                const archived = statusOf(row) === "archived";
                const name = row.business_name || "(no name)";
                return (
                  <Fragment key={row.id}>
                    <tr
                      onClick={() => setOpen(isOpen ? null : row.id)}
                      className={`h-12 cursor-pointer transition-colors duration-200 hover:bg-surface ${hairline} ${
                        isOpen ? "bg-surface" : ""
                      }`}
                    >
                      <th scope="row" className="max-w-[16rem] truncate px-3 text-left font-normal">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpen(isOpen ? null : row.id);
                          }}
                          className="cursor-pointer text-ink"
                        >
                          {name}
                        </button>
                      </th>
                      <td className="px-3 font-mono text-xs text-muted">{row.ref_code || "—"}</td>
                      <td className="px-3 text-muted">{templateOf(row)}</td>
                      <td className="px-3 tabular-nums text-muted">{fmtDate(row.created_at)}</td>
                      <td className="px-3">
                        <StatusBadge status={statusOf(row)} />
                      </td>
                      <td className="px-3">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            label={isOpen ? `Hide ${name}` : `View ${name}`}
                            onClick={() => setOpen(isOpen ? null : row.id)}
                          >
                            <EyeIcon />
                          </IconButton>
                          {archived ? (
                            <IconButton
                              danger
                              label={`Permanently delete ${name}`}
                              onClick={() => {
                                setActionError("");
                                setPending({ kind: "delete", row });
                              }}
                            >
                              <TrashIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              label={`Archive ${name}`}
                              onClick={() => {
                                setActionError("");
                                setPending({ kind: "archive", row });
                              }}
                            >
                              <ArchiveIcon />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <Detail row={row} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pending && (
        <ConfirmDialog
          danger={pending.kind === "delete"}
          busy={busy}
          error={actionError}
          title={
            pending.kind === "archive"
              ? "Archive this submission?"
              : `Permanently delete ${pending.row.business_name || "this submission"}?`
          }
          body={
            pending.kind === "archive"
              ? "It drops out of this list. You can find it again under the Archived filter, and move it back from there."
              : "This cannot be undone. Everything they uploaded — logo, photos, video — is deleted along with the record."
          }
          confirm={pending.kind === "archive" ? "Archive it" : "Delete permanently"}
          onConfirm={run}
          onCancel={() => {
            setPending(null);
            setActionError("");
          }}
        />
      )}
        </>
      )}
    </div>
  );
}

// ── Update requests view ────────────────────────────────────────────────
function RequestRow({ row }: { row: UpdateRequestRow }) {
  const [status, setLocal] = useState(row.status);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const handled = status === "done";

  return (
    <tr className={hairline}>
      <td className="px-3 py-3 align-top font-mono text-xs text-muted">{row.ref_code}</td>
      <td className="max-w-[12rem] truncate px-3 py-3 align-top">
        {row.intake_submissions?.business_name || "—"}
      </td>
      <td className="max-w-md px-3 py-3 align-top whitespace-pre-wrap text-sm text-ink">
        {row.body}
      </td>
      <td className="px-3 py-3 align-top tabular-nums text-muted">{fmtDate(row.created_at)}</td>
      <td className="px-3 py-3 align-top">
        <StatusBadge status={status} />
      </td>
      <td className="px-3 py-3 align-top text-right">
        {!handled && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError("");
                const result = await markRequestHandled(row.id);
                if (!result.ok) return setError(result.error);
                setLocal("done");
              })
            }
            className="press cursor-pointer border border-line px-3 py-1.5 text-xs text-ink transition-colors duration-200 hover:border-ink disabled:opacity-40"
          >
            {pending ? "Working…" : "Mark as handled"}
          </button>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </td>
    </tr>
  );
}

function UpdateRequestsPanel({
  requests,
  error,
}: {
  requests: UpdateRequestRow[];
  error?: string;
}) {
  if (error) return <p className="text-sm text-accent">{error}</p>;
  if (requests.length === 0) {
    return <p className="text-sm text-muted">Nothing has come in yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-sm">
        <thead>
          <tr className={hairline}>
            <th scope="col" className={th}>Code</th>
            <th scope="col" className={th}>Business</th>
            <th scope="col" className={th}>Request</th>
            <th scope="col" className={th}>Sent</th>
            <th scope="col" className={th}>Status</th>
            <th scope="col" className={`${th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((row) => (
            <RequestRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
