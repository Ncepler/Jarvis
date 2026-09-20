"use client";

import { useState } from "react";

// Static mock only — admin pages get built per client on a separate backend
// later. This demo never connects to anything.
export function AdminDemo() {
  const [hours, setHours] = useState("Mon–Fri, 8am–5pm");
  const [announcement, setAnnouncement] = useState(
    "Booking spring cleanups now."
  );

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted">Opening hours</span>
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="mt-1 w-full border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Announcement</span>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="mt-1 w-full border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-accent"
          />
        </label>
      </div>
      <div className="mt-4 border border-line bg-bg p-4">
        <p className="text-sm text-ink">{announcement}</p>
        <p className="mt-1 text-xs text-muted">{hours}</p>
      </div>
      <p className="mt-3 text-xs text-muted">Demo. Nothing here is saved.</p>
    </div>
  );
}
