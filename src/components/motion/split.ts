/**
 * SplitText's `aria` setting for an element. "auto" labels the element with its
 * text and hides the split pieces from assistive technology, which is right for
 * a heading (headings take a label). A paragraph cannot carry a label, so its
 * pieces stay exposed instead ("none"): split into lines or words, they still
 * read as whole words, never letter by letter.
 */
export function ariaFor(el: Element): "auto" | "none" {
  return /^H[1-6]$/.test(el.tagName) ? "auto" : "none";
}

/**
 * A paragraph's lines in two or three reading groups (one per line when it has
 * three or fewer), so a paragraph arrives in a few calm steps instead of all at
 * once or line after line after line.
 */
export function lineGroups<T>(lines: T[]): T[][] {
  if (lines.length <= 3) return lines.map((line) => [line]);
  const size = Math.ceil(lines.length / 3);
  const groups: T[][] = [];
  for (let i = 0; i < lines.length; i += size) groups.push(lines.slice(i, i + size));
  return groups;
}

/** A CSS custom property's value on the root (the colour tokens in globals.css). */
export function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
