import type Lenis from "lenis";

/** The page's Lenis instance, when wheel smoothing is active (null otherwise). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Scrolls to an element through Lenis when it runs, natively otherwise. */
export function scrollToElement(target: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance) instance.scrollTo(target, { duration: 1.1 });
  else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Holds the page still behind a modal (the phone menu) and lets it go again. */
export function holdScroll(hold: boolean) {
  if (!instance) return;
  if (hold) instance.stop();
  else instance.start();
}
