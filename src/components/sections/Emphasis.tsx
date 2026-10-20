/**
 * Sets a statement with its last word marked (`.em`): a thread drawn under it
 * that ties one small loop near its end, like the ribbon's own loops beside it.
 * It is drawn left to right once the statement has arrived (see
 * motion/reveals.ts), or simply present when motion is off. The words
 * themselves are unchanged; the drawing is hidden from assistive technology.
 */
export function Emphasis({ text }: { text: string }) {
  const cut = text.trimEnd().lastIndexOf(" ");
  const loop = (
    <svg className="em-loop" viewBox="0 0 300 50" preserveAspectRatio="xMinYMin meet" aria-hidden="true" focusable="false">
      <path d={LOOP} pathLength={1} />
    </svg>
  );
  if (cut < 0)
    return (
      <span className="em">
        {text}
        {loop}
      </span>
    );
  return (
    <>
      {text.slice(0, cut + 1)}
      <span className="em">
        {text.slice(cut + 1)}
        {loop}
      </span>
    </>
  );
}

/*
 * A line that runs right with a slight sway, turns one full loop hanging below
 * itself near the end of the word (two half circles, so the line leaves the
 * loop the way it entered), then trails off a little upward.
 */
const LOOP = "M3 10C60 6 130 12 190 9.5C208 8.6 220 8 228 8A18 18 0 1 1 228 44A18 18 0 1 1 228 8C244 8 272 7.5 296 3";
