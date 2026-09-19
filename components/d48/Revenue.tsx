"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { addPayment, addPlan, removeEntry, removePlan } from "@/app/d48/revenue/actions";
import { fieldClass, primaryButtonClass } from "@/components/intake/fields";
import type { RevenueEntry, RevenuePlan } from "@/lib/d48";

const meta = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";
const hairline = "border-b border-line";

const fmtDollars = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const todayIso = () => new Date().toISOString().slice(0, 10);
const thisMonth = todayIso().slice(0, 7);

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border border-line bg-surface p-5">
      <span className={meta}>{label}</span>
      <span className="font-display text-2xl text-ink">{value}</span>
    </div>
  );
}

function DeleteButton({ onDelete, label }: { onDelete: () => Promise<{ ok: boolean; error?: string }>; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="cursor-pointer text-xs text-muted hover:text-ink"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <span className="text-xs text-muted">Delete {label}?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const result = await onDelete();
            if (!result.ok) return setError(result.error ?? "Couldn't delete that.");
            setConfirming(false);
          })
        }
        className="cursor-pointer text-xs text-red-500 hover:underline disabled:opacity-40"
      >
        {pending ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="cursor-pointer text-xs text-muted hover:text-ink"
      >
        Cancel
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </span>
  );
}

function AddPaymentForm() {
  const [result, action, pending] = useActionState(addPayment, null);
  return (
    <form action={action} className="grid gap-4 border border-line bg-surface p-6">
      <h3 className="font-display text-lg text-ink">Add payment</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Client</span>
          <input name="client_name" required className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Received on</span>
          <input name="received_on" type="date" required defaultValue={todayIso()} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Kind</span>
          <select name="kind" required defaultValue="build" className={`${fieldClass} cursor-pointer`}>
            <option value="build" className="bg-bg">Build</option>
            <option value="monthly" className="bg-bg">Monthly</option>
            <option value="other" className="bg-bg">Other</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Amount ($)</span>
          <input name="amount" type="number" step="0.01" min="0.01" required className={fieldClass} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm text-muted">
        <span>Note (optional)</span>
        <input name="note" className={fieldClass} />
      </label>
      {result && !result.ok && <p className="text-sm text-red-500">{result.error}</p>}
      <button type="submit" disabled={pending} className={`${primaryButtonClass} justify-self-start`}>
        {pending ? "Saving…" : "Add payment"}
      </button>
    </form>
  );
}

function AddPlanForm() {
  const [result, action, pending] = useActionState(addPlan, null);
  return (
    <form action={action} className="grid gap-4 border border-line bg-surface p-6">
      <h3 className="font-display text-lg text-ink">Add monthly plan</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Client</span>
          <input name="client_name" required className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Monthly ($)</span>
          <input name="monthly" type="number" step="0.01" min="0.01" required className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Starts on</span>
          <input name="starts_on" type="date" required defaultValue={todayIso()} className={fieldClass} />
        </label>
        <label className="grid gap-1.5 text-sm text-muted">
          <span>Ends on (optional)</span>
          <input name="ends_on" type="date" className={fieldClass} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm text-muted">
        <span>Note (optional)</span>
        <input name="note" className={fieldClass} />
      </label>
      {result && !result.ok && <p className="text-sm text-red-500">{result.error}</p>}
      <button type="submit" disabled={pending} className={`${primaryButtonClass} justify-self-start`}>
        {pending ? "Saving…" : "Add plan"}
      </button>
    </form>
  );
}

export function Revenue({
  entries,
  plans,
  error,
}: {
  entries: RevenueEntry[];
  plans: RevenuePlan[];
  error?: string;
}) {
  const [rows, setRows] = useState(entries);
  const [planRows, setPlanRows] = useState(plans);

  const collectedAllTime = rows.reduce((sum, r) => sum + r.amount_cents, 0);
  const collectedThisMonth = rows
    .filter((r) => r.received_on.slice(0, 7) === thisMonth)
    .reduce((sum, r) => sum + r.amount_cents, 0);
  const today = todayIso();
  const mrrNow = planRows
    .filter((p) => p.starts_on <= today && (!p.ends_on || p.ends_on >= today))
    .reduce((sum, p) => sum + p.monthly_cents, 0);
  const mrrUpcoming = planRows
    .filter((p) => p.starts_on > today)
    .reduce((sum, p) => sum + p.monthly_cents, 0);

  // by-client table: every client that shows up in either payments or plans
  const clients = Array.from(new Set([...rows.map((r) => r.client_name), ...planRows.map((p) => p.client_name)])).sort();
  const byClient = clients.map((client) => {
    const collected = rows.filter((r) => r.client_name === client).reduce((s, r) => s + r.amount_cents, 0);
    const clientPlans = planRows.filter((p) => p.client_name === client);
    const current = clientPlans.find((p) => p.starts_on <= today && (!p.ends_on || p.ends_on >= today));
    const next = clientPlans
      .filter((p) => p.starts_on > today)
      .sort((a, b) => (a.starts_on < b.starts_on ? -1 : 1))[0];
    return { client, collected, current, next };
  });

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-title text-ink">Revenue</h1>
        <Link href="/d48" className="text-sm text-muted hover:text-ink">
          ← Back to intake
        </Link>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-500">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Collected all time" value={fmtDollars(collectedAllTime)} />
        <StatCard label="Collected this month" value={fmtDollars(collectedThisMonth)} />
        <StatCard label="MRR now" value={fmtDollars(mrrNow)} />
        <StatCard label="MRR upcoming" value={fmtDollars(mrrUpcoming)} />
      </div>

      <section className="grid gap-1">
        <h2 className="font-display text-lg text-ink">By client</h2>
        <div className={`grid ${hairline} pb-4`}>
          <div className={`grid grid-cols-4 gap-3 ${hairline} py-2 ${meta}`}>
            <span>Client</span>
            <span>Collected</span>
            <span>Current monthly</span>
            <span>Next monthly start</span>
          </div>
          {byClient.length === 0 && <p className="py-4 text-sm text-muted">Nothing logged yet.</p>}
          {byClient.map((c) => (
            <div key={c.client} className={`grid grid-cols-4 gap-3 py-2 text-sm text-ink ${hairline}`}>
              <span>{c.client}</span>
              <span>{fmtDollars(c.collected)}</span>
              <span>{c.current ? fmtDollars(c.current.monthly_cents) : "—"}</span>
              <span>{c.next ? `${fmtDollars(c.next.monthly_cents)} on ${fmtDate(c.next.starts_on)}` : "—"}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <AddPaymentForm />
        <AddPlanForm />
      </div>

      <section className="grid gap-1">
        <h2 className="font-display text-lg text-ink">Payments</h2>
        <div className={`grid ${hairline} pb-4`}>
          {rows.length === 0 && <p className="py-4 text-sm text-muted">No payments logged.</p>}
          {rows.map((r) => (
            <div key={r.id} className={`flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm ${hairline}`}>
              <span className="flex flex-wrap items-center gap-3">
                <span className="text-ink">{r.client_name}</span>
                <span className={meta}>{r.kind}</span>
                <span className="text-muted">{fmtDate(r.received_on)}</span>
                {r.note && <span className="text-muted">{r.note}</span>}
              </span>
              <span className="flex items-center gap-4">
                <span className="text-ink">{fmtDollars(r.amount_cents)}</span>
                <DeleteButton
                  label={`this payment from ${r.client_name}`}
                  onDelete={async () => {
                    const result = await removeEntry(r.id);
                    if (result.ok) setRows((cur) => cur.filter((x) => x.id !== r.id));
                    return result;
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-1">
        <h2 className="font-display text-lg text-ink">Monthly plans</h2>
        <div className={`grid ${hairline} pb-4`}>
          {planRows.length === 0 && <p className="py-4 text-sm text-muted">No plans logged.</p>}
          {planRows.map((p) => (
            <div key={p.id} className={`flex flex-wrap items-center justify-between gap-3 py-2.5 text-sm ${hairline}`}>
              <span className="flex flex-wrap items-center gap-3">
                <span className="text-ink">{p.client_name}</span>
                <span className="text-muted">
                  starts {fmtDate(p.starts_on)}
                  {p.ends_on ? `, ends ${fmtDate(p.ends_on)}` : ""}
                </span>
                {p.note && <span className="text-muted">{p.note}</span>}
              </span>
              <span className="flex items-center gap-4">
                <span className="text-ink">{fmtDollars(p.monthly_cents)}/mo</span>
                <DeleteButton
                  label={`${p.client_name}'s plan`}
                  onDelete={async () => {
                    const result = await removePlan(p.id);
                    if (result.ok) setPlanRows((cur) => cur.filter((x) => x.id !== p.id));
                    return result;
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
