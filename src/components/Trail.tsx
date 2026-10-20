import { chapters } from "@/content/site";

/**
 * The trail in the right margin (motion/trail.ts draws it): a hairline with a
 * knot for each chapter and a loop at its end for Contact. Decorative and
 * hidden from assistive technology; without scripts it is not shown at all.
 */
export function Trail() {
  return (
    <div className="trail" aria-hidden="true">
      <span className="trail-line">
        <span className="trail-fill" />
      </span>
      {chapters
        .filter(({ id }) => id !== "contact")
        .map(({ id }) => (
          <span className="trail-knot" data-for={id} key={id} />
        ))}
      <svg className="trail-loop" viewBox="0 0 20 20" focusable="false">
        <circle cx="10" cy="10" r="6.5" pathLength={1} transform="rotate(-90 10 10)" />
      </svg>
    </div>
  );
}
