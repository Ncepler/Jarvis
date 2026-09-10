import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

// Shared chat backend (session 1). One endpoint on vilas.studio, called by
// vilas.studio itself and by every demo site on any domain — the OpenAI key
// never goes into a client site or the browser. Talks to Supabase's REST API
// directly with fetch, same pattern as /api/intake: no client lib, and the
// service role key never leaves the server.
export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHAT_MODEL = process.env.CHAT_MODEL;
const DAILY_MESSAGE_LIMIT = Number(process.env.CHAT_DAILY_MESSAGE_LIMIT ?? "10");
const SITE_DAILY_LIMIT = Number(process.env.CHAT_SITE_DAILY_LIMIT ?? "400");
const IP_HASH_SALT = process.env.IP_HASH_SALT;
const ALLOWED_ORIGINS = (process.env.CHAT_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

type Message = { role: "user" | "assistant"; content: string };

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

// The off-topic refusal is a hard rule (§5): a chat box that will write
// someone a Python script becomes a screenshot on the internet. Scope is the
// product, not a limitation of it.
function systemPrompt(facts: Facts): string {
  const lines = [
    `You are the chat assistant on ${facts.businessName}'s website. You answer only questions about this specific business, using only the facts given below. Never use outside knowledge about this business or any other.`,
    "",
    `What they do: ${facts.whatTheyDo || "not provided"}`,
    `Services: ${facts.services.length ? facts.services.join(" | ") : "not provided"}`,
    `Hours: ${facts.hours || "not provided"}`,
    `Area served: ${facts.areaServed || "not provided"}`,
    `Phone: ${facts.phone || "not provided"}`,
    `Contact page: ${facts.contactUrl || "not provided"}`,
    "",
    `If a fact isn't provided above, say you don't know and point to the phone number or the contact page. Never guess hours, prices, or availability.`,
    `If the question is off-topic — coding, homework, general knowledge, writing tasks, jokes, anything not about this business — reply with exactly this and nothing else: "Sorry, I can only help with questions about ${facts.businessName}."`,
    `You cannot book, order, schedule, quote a price that isn't in the facts above, or promise anything on the business's behalf. Answer what you can, then direct them to a human.`,
    `Keep every reply to two or three sentences. Plain words. No exclamation marks, no marketing adjectives, no emoji.`,
  ];
  if (facts.isDemo) {
    lines.push(
      `This is a demo build, not a real business. State that plainly in your first reply.`,
    );
  }
  return lines.join("\n");
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

const bad = (
  body: Record<string, unknown>,
  status: number,
  origin?: string,
) =>
  NextResponse.json(body, {
    status,
    headers: origin ? corsHeaders(origin) : undefined,
  });

export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

function visitorHash(req: Request): string | null {
  if (!IP_HASH_SALT) return null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  if (!ip) return null;
  return createHash("sha256").update(IP_HASH_SALT + ip).digest("hex");
}

async function readCount(
  table: "chat_usage" | "chat_site_usage",
  keyColumn: "visitor_hash" | "site_slug",
  keyValue: string,
  day: string,
): Promise<number> {
  const url =
    `${SUPABASE_URL}/rest/v1/${table}` +
    `?select=message_count&${keyColumn}=eq.${encodeURIComponent(keyValue)}&day=eq.${day}`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const rows = (await res.json()) as { message_count: number }[];
  return rows[0]?.message_count ?? 0;
}

async function bumpCount(
  table: "chat_usage" | "chat_site_usage",
  keyColumn: "visitor_hash" | "site_slug",
  keyValue: string,
  day: string,
  current: number,
) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${keyColumn},day`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    cache: "no-store",
    body: JSON.stringify({
      [keyColumn]: keyValue,
      day,
      message_count: current + 1,
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") ?? "";

  // a. Origin check — every failure below hands back CORS headers too, since
  // demo sites call this cross-origin and need to read the JSON error body.
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  if (!SUPABASE_URL || !SERVICE_KEY || !IP_HASH_SALT) {
    return bad({ error: "Chat isn't wired up on this deploy." }, 503, origin);
  }
  if (!OPENAI_API_KEY) {
    return bad({ error: "Chat isn't wired up on this deploy." }, 503, origin);
  }
  if (!CHAT_MODEL) {
    return bad({ error: "No chat model is configured." }, 503, origin);
  }

  let payload: { siteSlug?: unknown; messages?: unknown };
  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return bad({ error: "Bad request." }, 400, origin);
  }

  const siteSlug =
    typeof payload.siteSlug === "string" ? payload.siteSlug.trim() : "";
  const messages = Array.isArray(payload.messages)
    ? (payload.messages as Message[]).filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string",
      )
    : [];
  if (!siteSlug || !messages.length) {
    return bad({ error: "Bad request." }, 400, origin);
  }

  let facts: Facts;
  try {
    const mod = await import(`@/content/chat/${siteSlug}.json`);
    facts = mod.default as Facts;
  } catch {
    return bad({ error: "Unknown site." }, 400, origin);
  }

  // b. Visitor hash — never store or log the raw IP.
  const vHash = visitorHash(req);
  if (!vHash) {
    return bad({ error: "Bad request." }, 400, origin);
  }

  const day = new Date().toISOString().slice(0, 10);

  // c. Per-visitor limit — global across every site.
  const visitorCount = await readCount("chat_usage", "visitor_hash", vHash, day);
  if (visitorCount >= DAILY_MESSAGE_LIMIT) {
    return bad({ limited: "visitor" }, 429, origin);
  }

  // d. Per-site ceiling.
  const siteCount = await readCount(
    "chat_site_usage",
    "site_slug",
    siteSlug,
    day,
  );
  if (siteCount >= SITE_DAILY_LIMIT) {
    return bad({ limited: "site" }, 429, origin);
  }

  // e. Key resolver — no per-client keys exist yet, but the lookup is built
  // so issuing one later is just setting an env var.
  const perClientKey =
    process.env[`OPENAI_API_KEY_${siteSlug.toUpperCase().replace(/-/g, "_")}`];
  const apiKey = perClientKey || OPENAI_API_KEY;

  // f. Call OpenAI — plain fetch, non-streaming, last 6 messages + system.
  const recent = messages.slice(-6);
  let reply: string;
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
          { role: "system", content: systemPrompt(facts) },
          ...recent.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!res.ok) throw new Error("openai error");
    const data = await res.json();
    reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply) throw new Error("empty reply");
  } catch {
    // Never a stack trace, never the model name, never the key. A failed
    // call doesn't burn one of the visitor's messages — return before the
    // counters below are touched.
    return bad(
      { error: "Chat is unavailable right now." },
      502,
      origin,
    );
  }

  // g. Only increment after a successful response.
  await Promise.all([
    bumpCount("chat_usage", "visitor_hash", vHash, day, visitorCount),
    bumpCount("chat_site_usage", "site_slug", siteSlug, day, siteCount),
  ]);

  return NextResponse.json(
    { reply, remaining: Math.max(0, DAILY_MESSAGE_LIMIT - visitorCount - 1) },
    { headers: corsHeaders(origin) },
  );
}
