import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// The chat add-on's single backend. Every site that's bought the $30/month
// chat assistant — vilas.studio itself and every demo, on any domain — POSTs
// here. The OpenAI key never leaves this server (§ rules, session 1 job 4).
export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const IP_HASH_SALT = process.env.IP_HASH_SALT;
const CHAT_MODEL = process.env.CHAT_MODEL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VISITOR_LIMIT = Number(process.env.CHAT_DAILY_MESSAGE_LIMIT ?? "10");
const SITE_LIMIT = Number(process.env.CHAT_SITE_DAILY_LIMIT ?? "400");
const ALLOWED_ORIGINS = (process.env.CHAT_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const SITE_SLUG_RE = /^[a-z0-9-]+$/;
const UNAVAILABLE = "Chat is unavailable right now.";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Facts = {
  siteSlug: string;
  businessName: string;
  whatTheyDo: string;
  services: string[];
  hours: string;
  areaServed: string;
  phone: string;
  contactUrl: string;
  isDemo: boolean;
  faqs: { q: string; a: string }[];
};

function corsHeaders(origin: string | null) {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: Request) {
  const headers = corsHeaders(req.headers.get("origin"));
  if (!headers) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, { status: 204, headers });
}

// ── System prompt ───────────────────────────────────────────────────────
// Rules: answers only from the facts JSON, refuses off-topic asks with one
// exact line, never books/orders/quotes/promises, stays to 2-3 plain
// sentences, and (isDemo) opens by saying it's a demo build.
function buildSystemPrompt(facts: Facts): string {
  const lines: string[] = [];
  lines.push(
    `You are the chat assistant for ${facts.businessName}, a local business. You answer only questions about this specific business, using only the facts below. If something isn't in these facts, say you don't know and point the person to the phone number or contact page — never guess hours, prices, or availability.`,
  );
  lines.push("");
  lines.push("Facts about the business:");
  if (facts.whatTheyDo) lines.push(`- What they do: ${facts.whatTheyDo}`);
  if (facts.services.length) lines.push(`- Services: ${facts.services.join("; ")}`);
  if (facts.hours) lines.push(`- Hours: ${facts.hours}`);
  if (facts.areaServed) lines.push(`- Area served: ${facts.areaServed}`);
  if (facts.phone) lines.push(`- Phone: ${facts.phone}`);
  if (facts.contactUrl) lines.push(`- Contact page: ${facts.contactUrl}`);
  if (facts.faqs.length) {
    lines.push("- FAQs:");
    for (const f of facts.faqs) if (f.q || f.a) lines.push(`  Q: ${f.q}\n  A: ${f.a}`);
  }
  lines.push("");
  lines.push(
    `If the question is off-topic — coding, homework, general knowledge, writing tasks, jokes, anything not about this business — reply with exactly this and nothing else: "Sorry, I can only help with questions about ${facts.businessName}."`,
  );
  lines.push(
    "You cannot book, order, schedule, quote a price that isn't in the facts above, or promise anything on the business's behalf. Answer what you can and direct the rest to a human.",
  );
  lines.push(
    "Keep every reply to two or three sentences. Plain words. No exclamation marks, no marketing adjectives, no emoji.",
  );
  if (facts.isDemo) {
    lines.push(
      "This is a demo build, not a real business. On your very first reply in a conversation, say so plainly before anything else.",
    );
  }
  return lines.join("\n");
}

async function loadFacts(siteSlug: string): Promise<Facts | null> {
  if (!SITE_SLUG_RE.test(siteSlug)) return null;
  try {
    const file = path.join(process.cwd(), "content", "chat", `${siteSlug}.json`);
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<Facts>;
    return {
      siteSlug,
      businessName: parsed.businessName ?? siteSlug,
      whatTheyDo: parsed.whatTheyDo ?? "",
      services: Array.isArray(parsed.services) ? parsed.services : [],
      hours: parsed.hours ?? "",
      areaServed: parsed.areaServed ?? "",
      phone: parsed.phone ?? "",
      contactUrl: parsed.contactUrl ?? "",
      isDemo: Boolean(parsed.isDemo),
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
    };
  } catch {
    return null;
  }
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function visitorHash(ip: string): string {
  return createHash("sha256").update(`${IP_HASH_SALT}${ip}`).digest("hex");
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Supabase (raw REST, service role — CLAUDE.md §14, no @supabase/supabase-js) ──
async function sbSelect(
  table: string,
  match: Record<string, string>,
): Promise<{ message_count: number } | null> {
  const qs = Object.entries(match)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join("&");
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=message_count&${qs}`,
    {
      headers: { apikey: SERVICE_KEY as string, Authorization: `Bearer ${SERVICE_KEY}` },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`${table} select failed: ${res.status}`);
  const rows = (await res.json()) as { message_count: number }[];
  return rows[0] ?? null;
}

async function sbUpsert(
  table: string,
  row: Record<string, string | number>,
  conflictCols: string,
) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictCols}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY as string,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      cache: "no-store",
      body: JSON.stringify(row),
    },
  );
  if (!res.ok) throw new Error(`${table} upsert failed: ${res.status}`);
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);
  // No matching allowed origin → reject outright, same as a same-origin
  // request that isn't cross-origin gets no CORS headers to worry about.
  if (origin && !headers) {
    return NextResponse.json({ error: "origin not allowed" }, { status: 403 });
  }

  const respond = (body: unknown, status = 200) =>
    NextResponse.json(body, { status, headers: headers ?? undefined });

  if (!SUPABASE_URL || !SERVICE_KEY || !IP_HASH_SALT) {
    return respond({ error: UNAVAILABLE }, 503);
  }
  if (!CHAT_MODEL) {
    return respond({ error: "CHAT_MODEL isn't set." }, 500);
  }

  let body: { siteSlug?: unknown; messages?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return respond({ error: "Bad request." }, 400);
  }

  const siteSlug = typeof body.siteSlug === "string" ? body.siteSlug : "";
  const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
  if (!siteSlug || !messages.length) {
    return respond({ error: "Bad request." }, 400);
  }

  const facts = await loadFacts(siteSlug);
  if (!facts) return respond({ error: "Unknown site." }, 404);

  const ip = clientIp(req);
  const vHash = visitorHash(ip);
  const day = today();

  let visitorRow: { message_count: number } | null;
  let siteRow: { message_count: number } | null;
  try {
    [visitorRow, siteRow] = await Promise.all([
      sbSelect("chat_usage", { visitor_hash: vHash, day }),
      sbSelect("chat_site_usage", { site_slug: siteSlug, day }),
    ]);
  } catch {
    return respond({ error: UNAVAILABLE }, 503);
  }

  const visitorCount = visitorRow?.message_count ?? 0;
  const siteCount = siteRow?.message_count ?? 0;

  if (visitorCount >= VISITOR_LIMIT) {
    return respond({ limited: "visitor" }, 429);
  }
  if (siteCount >= SITE_LIMIT) {
    return respond({ limited: "site" }, 429);
  }

  const keyEnvName = `OPENAI_API_KEY_${siteSlug.toUpperCase().replace(/-/g, "_")}`;
  const apiKey = process.env[keyEnvName] || OPENAI_API_KEY;
  if (!apiKey) return respond({ error: UNAVAILABLE }, 503);

  const history = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-6);

  let completion: string;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_tokens: 250,
        messages: [
          { role: "system", content: buildSystemPrompt(facts) },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    completion = data.choices?.[0]?.message?.content?.trim() || "";
    if (!completion) throw new Error("empty completion");
  } catch {
    // Never a stack trace, model name, or key — and no counter burned on a
    // failed call (session 1 job 4g).
    return respond({ error: UNAVAILABLE }, 502);
  }

  try {
    await Promise.all([
      sbUpsert(
        "chat_usage",
        { visitor_hash: vHash, day, message_count: visitorCount + 1 },
        "visitor_hash,day",
      ),
      sbUpsert(
        "chat_site_usage",
        { site_slug: siteSlug, day, message_count: siteCount + 1 },
        "site_slug,day",
      ),
    ]);
  } catch {
    // The reply already succeeded; a failed counter bump isn't worth failing
    // the request over.
  }

  return respond({ reply: completion });
}
