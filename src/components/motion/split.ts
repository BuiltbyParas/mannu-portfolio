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
