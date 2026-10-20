import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { PillLabel } from "./PillLabel";

/**
 * A link that leaves the page: opens in a new tab and says so to screen
 * readers. `pill` sets it as a pill button (its label and arrow on both faces).
 */
export function ExternalLink({ href, className, pill, children }: { href: string; className?: string; pill?: boolean; children: ReactNode }) {
  if (pill) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        <PillLabel icon={<ArrowUpRight className="button-icon button-icon-out" aria-hidden="true" strokeWidth={2} />}>{children}</PillLabel>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      <span className="link-text">{children}</span>
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight className="link-icon" aria-hidden="true" strokeWidth={1.75} />
    </a>
  );
}
