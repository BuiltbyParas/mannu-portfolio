"use client";

import { useId, useState, type ReactNode } from "react";

/** Reveals the certificates beyond the featured few. A native button, so it works with any input. */
export function CertificateArchive({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="archive">
      <div id={panelId} className="archive-panel" hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        className="archive-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="archive-sign" aria-hidden="true" data-open={open ? "" : undefined} />
        {open ? "Show fewer certificates" : `Show ${count} more ${count === 1 ? "certificate" : "certificates"}`}
      </button>
    </div>
  );
}
