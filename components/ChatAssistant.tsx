"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// The $30/month chat add-on's front end. One component, two mount modes:
// `inline` sits in the page flow (vilas.studio, right under the FAQ);
// `floating` is the round bottom-right button + panel every demo site gets.
// Talks to a single shared backend (apiUrl, defaults to same-origin
// /api/chat) — see app/api/chat/route.ts for the rules this respects
// (per-visitor limit, per-site ceiling, off-topic refusal).
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Msg = { role: "user" | "assistant"; content: string };

export type ChatAssistantProps = {
  mode: "inline" | "floating";
  siteSlug: string;
  businessName: string;
  phone?: string;
  apiUrl?: string;
  dailyLimit?: number;
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          mine ? "bg-ink text-bg" : "bg-bg text-ink"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

function useChat({ siteSlug, businessName, phone, apiUrl, dailyLimit = 10 }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(dailyLimit);
  const [limited, setLimited] = useState<"visitor" | "site" | "error" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, sending]);

  async function send() {
    const content = input.trim();
    if (!content || sending || limited) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch(apiUrl ?? "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSlug, messages: next }),
      });
      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as { limited?: string };
        setLimited(body.limited === "site" ? "site" : "visitor");
        return;
      }
      if (!res.ok) {
        setLimited("error");
        return;
      }
      const data = (await res.json()) as { reply?: string };
      if (!data.reply) {
        setLimited("error");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply as string }]);
      setRemaining((r) => Math.max(0, r - 1));
    } catch {
      setLimited("error");
    } finally {
      setSending(false);
    }
  }

  return { messages, input, setInput, sending, remaining, limited, send, listRef, businessName, phone };
}

function ChatBody(props: ChatAssistantProps & { autoFocus?: boolean }) {
  const { messages, input, setInput, sending, remaining, limited, send, listRef, businessName, phone } =
    useChat(props);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (props.autoFocus) inputRef.current?.focus();
  }, [props.autoFocus]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showLowCount = !limited && remaining < 4 && remaining >= 0;
  const callLine = phone ? ` Call ${phone}.` : "";

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">Ask us anything about {businessName}.</p>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-bg px-4 py-2.5 text-ink">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line p-3">
        {limited === "visitor" ? (
          <p className="text-sm text-muted">
            You&rsquo;ve hit today&rsquo;s message limit. Try again tomorrow{phone ? `, or call ${phone}.` : "."}
          </p>
        ) : limited ? (
          <p className="text-sm text-muted">Chat is unavailable right now.{callLine}</p>
        ) : (
          <>
            {showLowCount && (
              <p className="mb-2 text-xs text-muted">
                {remaining} message{remaining === 1 ? "" : "s"} left today.
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Type a message…"
                aria-label="Message"
                className="max-h-24 flex-1 resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-ink"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                className="shrink-0 rounded-lg bg-ink px-3 py-2 text-sm text-bg disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ChatAssistant(props: ChatAssistantProps) {
  if (props.mode === "inline") return <InlineChat {...props} />;
  return <FloatingChat {...props} />;
}

function InlineChat(props: ChatAssistantProps) {
  return (
    <div className="mx-auto h-[420px] max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface text-ink">
      <ChatBody {...props} />
    </div>
  );
}

function FloatingChat(props: ChatAssistantProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        openButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-bg shadow-lg transition-transform duration-200 ease-out hover:scale-105"
      >
        {open ? "✕" : "Chat"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={`Chat with ${props.businessName}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-50 h-[70vh] rounded-t-2xl border border-line bg-surface text-ink shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:h-[480px] sm:w-96 sm:rounded-2xl"
          >
            <ChatBody {...props} autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
