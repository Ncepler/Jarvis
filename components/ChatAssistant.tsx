"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Role = "user" | "assistant";
type ChatMessage = { role: Role; content: string };
type Limited = null | "visitor" | "site" | "error";

export type ChatAssistantProps = {
  mode: "inline" | "floating";
  siteSlug: string;
  businessName: string;
  /** Header title. Defaults to "{businessName} assistant". */
  title?: string;
  /** Optional — shown in the limit/error copy only when set. */
  phone?: string;
  /** Defaults to the same-origin route; demo sites pass the full vilas.studio URL. */
  apiUrl?: string;
};

const callLine = (phone?: string) => (phone ? ` Call ${phone}.` : "");

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function useChat({ siteSlug, apiUrl = "/api/chat" }: { siteSlug: string; apiUrl?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [limited, setLimited] = useState<Limited>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending || limited) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setPending(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSlug, messages: next }),
      });
      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as { limited?: Limited };
        setLimited(data.limited === "site" ? "site" : "visitor");
        return;
      }
      if (!res.ok) {
        setLimited("error");
        return;
      }
      const data = (await res.json()) as { reply: string; remaining: number };
      setMessages((cur) => [...cur, { role: "assistant", content: data.reply }]);
      setRemaining(data.remaining);
    } catch {
      setLimited("error");
    } finally {
      setPending(false);
    }
  }

  return { messages, pending, limited, remaining, send };
}

// Bubble shapes lean on a real texting app: rounded all around, with the
// corner nearest the sender's own edge pulled in tight (the "tail" corner) —
// user bubbles sit right with a tucked bottom-right, assistant bubbles sit
// left with a tucked bottom-left.
function Bubble({ role, children }: { role: Role; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[80%] px-4 py-2.5 text-[15px] leading-relaxed ${
        isUser
          ? "ml-auto rounded-2xl rounded-br-md bg-accent text-surface"
          : "rounded-2xl rounded-bl-md border border-line bg-bg text-ink"
      }`}
    >
      {children}
    </div>
  );
}

function ChatHeader({ title }: { title: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-b border-line px-4 py-3.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
      <span className="text-sm font-semibold text-ink">{title}</span>
    </div>
  );
}

function ChatBody({
  siteSlug,
  businessName,
  title,
  phone,
  apiUrl,
  panel,
}: ChatAssistantProps & { panel?: boolean }) {
  const { messages, pending, limited, remaining, send } = useChat({ siteSlug, apiUrl });
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, pending]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = draft;
      setDraft("");
      void send(text);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft;
    setDraft("");
    void send(text);
  }

  const lowOnMessages =
    remaining !== null && remaining < 4 && remaining >= 0 && !limited;

  return (
    <div className={`flex flex-col ${panel ? "h-full" : "h-[460px]"} bg-surface`}>
      <ChatHeader title={title ?? `${businessName} assistant`} />

      <div
        ref={listRef}
        className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {messages.length === 0 && !limited && (
          <p className="text-sm text-muted">
            Ask us anything about {businessName}.
          </p>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}
        {pending && (
          <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-line bg-bg px-4 py-2.5">
            <TypingDots />
          </div>
        )}
      </div>

      <div className="border-t border-line px-3 py-3">
        {limited === "visitor" ? (
          <p className="px-1 text-sm text-muted">
            You&rsquo;ve hit today&rsquo;s message limit. Try again tomorrow.{callLine(phone)}
          </p>
        ) : limited === "site" || limited === "error" ? (
          <p className="px-1 text-sm text-muted">Chat is unavailable right now.{callLine(phone)}</p>
        ) : (
          <>
            {lowOnMessages && (
              <p className="mb-2 px-1 text-xs text-muted">
                {remaining} message{remaining === 1 ? "" : "s"} left today.
              </p>
            )}
            <form onSubmit={onSubmit} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Type a message"
                aria-label="Message"
                className="max-h-24 flex-1 resize-none rounded-3xl border border-line bg-bg px-4 py-2.5 text-sm text-ink outline-none focus-visible:border-ink"
              />
              <button
                type="submit"
                disabled={pending || !draft.trim()}
                aria-label="Send"
                className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-bg disabled:opacity-40"
              >
                <span aria-hidden="true">↑</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function ChatAssistant(props: ChatAssistantProps) {
  if (props.mode === "inline") {
    return (
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line shadow-sm">
        <ChatBody {...props} panel />
      </div>
    );
  }
  return <FloatingChat {...props} />;
}

function FloatingChat(props: ChatAssistantProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        dialogRef.current?.querySelector("textarea")?.focus();
      }, reduced ? 0 : 250);
      return () => clearTimeout(t);
    }
  }, [open, reduced]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="press fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-ink text-bg shadow-lg sm:bottom-8 sm:right-8"
      >
        {open ? "✕" : "Chat"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-label={`Chat with ${props.title ?? props.businessName}`}
            className="fixed inset-x-0 bottom-0 z-50 h-[70vh] w-full overflow-hidden rounded-t-2xl border border-line bg-surface shadow-xl sm:bottom-24 sm:right-8 sm:left-auto sm:h-[520px] sm:w-[380px] sm:rounded-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
          >
            <ChatBody {...props} panel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
