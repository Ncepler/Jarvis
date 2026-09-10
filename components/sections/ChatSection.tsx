import { ChatAssistant } from "@/components/ChatAssistant";
import vilasFacts from "@/content/chat/vilas.json";

// The chat add-on, mounted inline right under the FAQ (session 1 job 7).
// vilas.studio gets exactly one chat, in `inline` mode — no floating widget
// here, that's for demo sites only.
export function ChatSection() {
  return (
    <section className="border-t border-line px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-sm text-muted">Ask us anything.</p>
        <ChatAssistant
          mode="inline"
          siteSlug={vilasFacts.siteSlug}
          businessName={vilasFacts.businessName}
          phone={vilasFacts.phone || undefined}
        />
      </div>
    </section>
  );
}
