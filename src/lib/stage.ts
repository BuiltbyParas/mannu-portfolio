/*
 * The opening's stage (sections/Opening.tsx) holds still while the page
 * scrolls past it on large screens, so anything inside it sits at the same
 * place on screen whatever the scroll, and its box cannot say where the page
 * should be to show it. Instead, elements inside it name their moment on the
 * stage with `data-stage-at` (a share of the opening's part of the stage's
 * stuck stretch, the progress p of sculpture/scenery.ts), and this turns that
 * into a scroll position. Used for in-page links, the trail's knots and the
 * ribbon's rests. A short rest on the name comes first on the same stretch
 * (its length is the stage's `.opening-lead`), so p = 0 is where that rest
 * ends and the opening starts to move on.
 */

/** Media condition for the stage; globals.css uses the same one. */
export const STAGE = "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

/**
 * Dispatched on window when the stage changes which chapter the header should
 * name (detail: "top" or "about", or null once the stage no longer fills the
 * middle of the screen). The stage's wrapper also carries it as `data-chapter`.
 */
export const STAGE_CHAPTER = "stage:chapter";

/**
 * Dispatched on window when the visitor has scrolled from the landing
 * (sections/Landing.tsx) into the opening (detail: true), so the name's
 * entrance plays (motion/intro.ts), or back up into the landing (false), so it
 * steps back again.
 */
export const LANDING_PASSED = "stage:landing";

/** The opening's part of the stage in page pixels (after the rest on the name), or null where the opening simply scrolls (small screens, reduced motion, no stage). */
export function stageSpan(within: Element) {
  const wrapper = within.closest<HTMLElement>(".opening");
  const stage = wrapper?.querySelector<HTMLElement>(".opening-stage");
  if (!wrapper || !stage || getComputedStyle(stage).position !== "sticky") return null;
  const total = Math.max(0, wrapper.offsetHeight - stage.offsetHeight);
  const rest = Math.min(total, wrapper.querySelector<HTMLElement>(".opening-lead")?.offsetHeight ?? 0);
  return { start: wrapper.getBoundingClientRect().top + window.scrollY + rest, run: total - rest };
}

/** The scroll position at which an element on the stage is in its moment, or null if it is not on a stage in use. */
export function stageScroll(el: HTMLElement) {
  const at = el.dataset.stageAt;
  if (at === undefined) return null;
  const span = stageSpan(el);
  return span ? Math.round(span.start + span.run * Number(at)) : null;
}
