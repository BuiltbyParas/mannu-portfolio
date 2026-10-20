import type { ReactNode } from "react";

/**
 * A pill button's contents, set twice. The second set sits on the button's
 * other face (citron on ultramarine, ink on outline, citron on white) behind a
 * mask that rises from below with a domed leading edge on hover or keyboard
 * focus, its words surfacing with it. Both sets share one position, so at
 * every frame of the turn the label reads whole: above the edge on the first
 * face, below it on the second. The copy is hidden from assistive technology,
 * so the control is announced once.
 */
export function PillLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span className="pill-label">{children}</span>
      {icon}
      <span className="pill-face" aria-hidden="true">
        <span className="pill-label">{children}</span>
        {icon}
      </span>
    </>
  );
}
