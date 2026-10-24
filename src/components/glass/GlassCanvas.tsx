"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { STILL_T } from "./layout";

/*
 * The landing's canvas. Three.js (the same chunk the ribbon loads) and the
 * scene are fetched once the page has hydrated, and only where the landing is
 * shown (large screens). Until its first frame the landing shows the still's
 * field behind it (GlassStill), and wherever it never draws (no WebGL, a lost
 * context) the still's forms as well (`data-still` on the landing). Nothing
 * waits for it.
 *
 * It draws on GSAP's ticker only while the landing is on screen and the tab is
 * visible, at half the frame rate once the visitor has been still for a while
 * (the forms move slowly enough not to show it). With reduced motion it draws
 * one frame, held at STILL_T, and again only when its size changes.
 */
const LANDING = "(min-width: 1024px)";
/** Seconds without a pointer, key or scroll before the scene drops to half the frame rate. */
const SETTLE_AFTER = 12;

export function GlassCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const media = window.matchMedia(LANDING);
    const landing = canvas.closest<HTMLElement>(".landing");
    let stop: (() => void) | null = null;
    let starting = false;
    let failed = false;
    let disposed = false;
    // The scene will not draw: the still shows its forms instead (globals.css).
    const fail = () => {
      failed = true;
      if (landing) landing.dataset.still = "";
    };

    const start = async () => {
      if (stop || starting || failed || disposed) return;
      starting = true;
      let createGlassScene: typeof import("./scene").createGlassScene;
      try {
        ({ createGlassScene } = await import("./scene"));
      } catch {
        fail();
        return;
      } finally {
        starting = false;
      }
      if (disposed || !media.matches || stop) return;
      let scene: ReturnType<typeof createGlassScene>;
      try {
        scene = createGlassScene(canvas, { maxPixelRatio: 1.5 });
      } catch {
        fail();
        return;
      }

      const still = !document.documentElement.classList.contains("motion");
      let visible = true;
      let clock = 0;
      let lastActivity = 0;
      let frame = 0;
      let shown = false;

      const draw = (t: number) => {
        scene.render(t);
        if (!shown) {
          shown = true;
          canvas.dataset.live = "";
        }
      };
      const fit = () => {
        scene.resize(canvas.clientWidth, canvas.clientHeight, window.devicePixelRatio || 1);
        if (still) draw(STILL_T);
      };
      const tick = (_time: number, deltaMs: number) => {
        if (!visible || document.hidden) return;
        clock += Math.min(0.05, deltaMs / 1000);
        frame++;
        if (clock - lastActivity > SETTLE_AFTER && frame % 2) return;
        draw(clock);
      };
      const wake = () => void (lastActivity = clock);

      const sizeObserver = new ResizeObserver(fit);
      sizeObserver.observe(canvas);
      const viewObserver = new IntersectionObserver(([entry]) => void (visible = entry.isIntersecting));
      viewObserver.observe(canvas);
      const onLost = (event: Event) => {
        event.preventDefault();
        fail();
        stop?.();
      };
      canvas.addEventListener("webglcontextlost", onLost);
      fit();
      if (!still) {
        gsap.ticker.add(tick);
        window.addEventListener("pointermove", wake, { passive: true });
        window.addEventListener("scroll", wake, { passive: true });
        window.addEventListener("keydown", wake);
      }

      stop = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", wake);
        window.removeEventListener("scroll", wake);
        window.removeEventListener("keydown", wake);
        sizeObserver.disconnect();
        viewObserver.disconnect();
        canvas.removeEventListener("webglcontextlost", onLost);
        delete canvas.dataset.live;
        scene.dispose();
        stop = null;
      };
    };

    // The landing only shows on large screens; the scene comes and goes with it.
    const onMedia = () => (media.matches ? void start() : stop?.());
    media.addEventListener("change", onMedia);
    onMedia();

    return () => {
      media.removeEventListener("change", onMedia);
      disposed = true;
      stop?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="landing-canvas" aria-hidden="true" />;
}
