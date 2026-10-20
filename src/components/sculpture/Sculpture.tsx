"use client";

import { useEffect, useRef } from "react";
import { THREAD_READY, threadSignals } from "./signals";

/*
 * The fixed canvas the ribbon is drawn on. Three.js is loaded only after the
 * page has painted, and only when the visitor allows motion and the browser
 * has WebGL; otherwise the still SVG states inside each slot remain the
 * visual and no canvas work happens at all.
 */
function webglAvailable() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Sculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (!canvas || !root.classList.contains("motion")) return;
    if (!webglAvailable()) {
      root.classList.add("no-webgl");
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;
    const compact = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

    const start = async () => {
      const [{ createRibbonScene }, { createController }, { STRIP_SAMPLES }] = await Promise.all([
        import("./scene"),
        import("./controller"),
        import("./forms"),
      ]);
      if (disposed) return;
      try {
        const scene = createRibbonScene(canvas, STRIP_SAMPLES, { shadows: !compact, dustCount: compact ? 360 : 820 });
        const controller = createController(scene, canvas, { samples: STRIP_SAMPLES, maxPixelRatio: compact ? 1.5 : 1.75 });
        root.classList.add("sculpture-live");
        threadSignals.ready = true;
        window.dispatchEvent(new Event(THREAD_READY));
        const onLost = (event: Event) => {
          event.preventDefault();
          root.classList.remove("sculpture-live");
          root.classList.add("no-webgl");
        };
        canvas.addEventListener("webglcontextlost", onLost);
        cleanup = () => {
          canvas.removeEventListener("webglcontextlost", onLost);
          controller.dispose();
          scene.dispose();
          threadSignals.ready = false;
          root.classList.remove("sculpture-live");
        };
      } catch {
        root.classList.add("no-webgl");
      }
    };

    // Wait for the page to finish loading and the main thread to go quiet: the
    // words and the still layout come first, the 3D scene after.
    let idleHandle = 0;
    const queue = () => {
      idleHandle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(() => void start(), { timeout: 600 })
          : window.setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") queue();
    else window.addEventListener("load", queue, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", queue);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleHandle);
      window.clearTimeout(idleHandle);
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="sculpture-canvas" aria-hidden="true" />;
}
