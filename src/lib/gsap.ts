import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/*
 * The one place GSAP plugins are registered. Import gsap from here, never from
 * "gsap" directly, so every component shares the same configured instance.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile address bars resize the viewport while scrolling; re-measuring every
  // trigger then would make the scroll-linked drawing jump.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Web fonts change line lengths and section heights, so measure again once they land.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/** gsap.matchMedia() conditions shared by every animated component. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
