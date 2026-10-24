/*
 * The motion vocabulary, in one place. Three levels (see docs/design-direction.md §8):
 *
 *   signature  the opening, the learning sequence, the final loop      1.2–1.9 s
 *   section    headings, ledes and fields arriving as a chapter opens  0.9–1.3 s
 *   micro      hover, focus and press feedback (CSS, see globals.css)  140–520 ms
 *
 * Entrances decelerate hard (expo.out: quick to move, long to settle); things
 * that move on screen ease in and out; anything tied to the scrollbar is linear
 * and follows the scroll. Matching CSS curves live in globals.css as
 * --ease-out and --ease-in-out.
 */
export const EASE = {
  enter: "expo.out",
  /** Reading text: settles sooner and more evenly than a heading, so lines can be read as they land. */
  read: "power3.out",
  move: "power3.inOut",
  scroll: "none",
} as const;

export const DURATION = {
  signature: 1.3,
  heading: 1.15,
  /** A heading line rising out of its mask. */
  line: 1,
  text: 0.95,
  /** A group of paragraph lines. */
  read: 0.75,
  /** Chapter marks, numbers and other small labels. */
  label: 0.7,
  field: 1,
} as const;

/** Gap between siblings that arrive together (lines, words, list items). */
export const STAGGER = {
  lines: 0.09,
  words: 0.045,
  items: 0.08,
  /** Between the two or three groups a paragraph's lines arrive in. */
  groups: 0.16,
} as const;

/** Where a section's entrance starts: its top this far down the viewport. */
export const ENTER_AT = "top 84%";
