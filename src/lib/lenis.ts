import type Lenis from "lenis";
import { stageScroll } from "./stage";

/** The page's Lenis instance, when wheel smoothing is active (null otherwise). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Scrolls to an element through Lenis when it runs, natively otherwise. A
 * section on the opening's stage is scrolled to its moment there (lib/stage.ts).
 */
export function scrollToElement(target: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = stageScroll(target);
  if (y !== null) {
    if (instance) instance.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  } else if (instance) instance.scrollTo(target, { duration: 1.1 });
  else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Holds the page still behind a modal (the phone menu) and lets it go again. */
export function holdScroll(hold: boolean) {
  if (!instance) return;
  if (hold) instance.stop();
  else instance.start();
}
