"use client";

import { useId, useState } from "react";

// Collapsed: a one-line phonetic button under the hero subhead. Expanded: a
// verbatim dictionary entry for "vilas" animates open beneath it (CSS grid-rows
// trick, no JS-driven height measuring). Reads as a citation, not copy — see
// CLAUDE.md §6.1.1 discipline: nothing here is a marketing line.
export function NameDefinition() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mx-auto mt-5 w-full max-w-[340px] text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="press border-b border-dotted border-ink/55 text-[13px] tracking-[0.08em] text-ink/55 transition-opacity duration-200 hover:opacity-100"
      >
        vee-lahs
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        className="name-definition-panel grid transition-[grid-template-rows] duration-[280ms] ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="pt-3 transition-opacity duration-[280ms] ease-out"
            style={{ opacity: open ? 1 : 0 }}
          >
            <p className="font-display text-[15px] text-ink">vilas</p>
            <p className="mt-1 font-serif text-[12px] italic text-ink/55">
              vee-lahs <span className="not-italic">·</span> Sanskrit
            </p>

            <ol className="mt-3 space-y-1.5">
              <li className="pl-5 text-[14px] leading-snug text-ink/75 [text-indent:-1.25rem]">
                1. <span className="font-serif italic">v.</span> to shine
                forth; to appear; to become visible.
              </li>
              <li className="pl-5 text-[14px] leading-snug text-ink/75 [text-indent:-1.25rem]">
                2. <span className="font-serif italic">n.</span> grace;
                charm; beauty.
              </li>
            </ol>

            <p className="mt-2.5 border-t border-ink/15 pt-2.5 text-[10px] tracking-[0.05em] text-ink/40">
              Monier-Williams Sanskrit–English Dictionary
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
