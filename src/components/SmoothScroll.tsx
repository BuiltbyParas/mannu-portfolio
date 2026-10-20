"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/*
 * Wheel smoothing for mouse and trackpad users. Lenis shares GSAP's ticker, so
 * the scroll position, ScrollTrigger and the ribbon all advance on the same
 * frame. Touch screens keep native scrolling, keyboard and focus scrolling are
 * untouched, and visitors who ask for reduced motion never get it.
 */
export function SmoothScroll() {
  useEffect(() => {
    const allow = window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)");
    if (!allow.matches) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: true, stopInertiaOnNavigate: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
