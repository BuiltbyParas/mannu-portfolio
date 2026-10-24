"use client";

import { threadSignals } from "@/components/sculpture/signals";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { STAGE } from "@/lib/stage";
import { playIntro } from "./intro";
import { setupLandingFlow, setupOpening } from "./opening";
import { setupReveals } from "./reveals";
import { setupScenes } from "./scenes";
import { setupStages } from "./stages";
import { setupTrail } from "./trail";

/*
 * The page's whole motion system, mounted once. Everything is created inside
 * one GSAP context, so a hot reload or unmount reverts every tween, split and
 * ScrollTrigger together and nothing is ever doubled. Created in page order
 * (opening, scenery, sections), so ScrollTriggers refresh top to bottom.
 *
 * Always on (state, not motion): the learning stages and their rail, the trail
 * in the margin, the coil's response to hovered courses, pressed states on
 * touch screens. Only with motion
 * allowed: the opening, the scrubbed scenery and the section entrances. On
 * large screens the landing comes first, and the scroll out of it says when
 * the name's entrance plays (opening.ts, setupLandingFlow); the opening and
 * Curiosity also share a stage (opening.ts, setupOpening), which takes over
 * those sections' scrolled motion. The scenery and the entrances are built
 * again whenever the stage comes or goes with the window.
 *
 * The ribbon itself is driven separately (sculpture/controller.ts) from the
 * same scroll position; this file handles the words, fields and states around it.
 */
export function Choreography() {
  useGSAP(() => {
    const cleanups = [setupTrail(), setupStages(), linkCoursesToCoil(), enableTouchPress(), refreshOnReflow()];
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => playIntro());
    mm.add({ motion: MOTION_OK, stage: STAGE }, (context) => {
      const { motion, stage } = context.conditions as { motion: boolean; stage: boolean };
      if (!motion) return;
      const stopOpening = stage ? setupOpening() : () => {};
      // The scroll from the landing into the opening says when the name arrives.
      const stopLanding = setupLandingFlow();
      const stopScenes = setupScenes(stage);
      const stopReveals = setupReveals(stage);
      return () => {
        stopReveals();
        stopScenes();
        stopLanding();
        stopOpening();
      };
    });
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      mm.revert();
    };
  });
  return null;
}

/**
 * ScrollTrigger re-measures on window resizes; this catches the page changing
 * height without one (the certificate archive opening, a late layout change,
 * or a viewport whose height settles after its width), so every trigger, the
 * rail and the trail stay true. Nothing here pins, so a refresh never changes
 * the height it reacts to.
 */
function refreshOnReflow() {
  let height = document.body.offsetHeight;
  let timer = 0;
  const observer = new ResizeObserver(() => {
    const next = document.body.offsetHeight;
    if (next === height) return;
    height = next;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  observer.observe(document.body);
  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
  };
}

/**
 * iOS Safari applies `:active` to a tapped control only when the page listens
 * for touches; without it the pills' pressed face (globals.css) never shows.
 */
function enableTouchPress() {
  const noop = () => {};
  document.addEventListener("touchstart", noop, { passive: true });
  return () => document.removeEventListener("touchstart", noop);
}

/** Hovering a foundation lifts its own turn of the coil (one turn per foundation). */
function linkCoursesToCoil() {
  const courses = Array.from(document.querySelectorAll<HTMLElement>(".course"));
  const handlers = courses.map((course, i) => {
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") threadSignals.turn = i;
    };
    const leave = () => {
      if (threadSignals.turn === i) threadSignals.turn = -1;
    };
    course.addEventListener("pointerenter", enter);
    course.addEventListener("pointerleave", leave);
    return () => {
      course.removeEventListener("pointerenter", enter);
      course.removeEventListener("pointerleave", leave);
    };
  });
  return () => {
    handlers.forEach((remove) => remove());
    threadSignals.turn = -1;
  };
}
