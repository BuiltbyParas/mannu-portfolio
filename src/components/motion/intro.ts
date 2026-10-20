import { THREAD_READY, threadSignals } from "@/components/sculpture/signals";
import { gsap, SplitText } from "@/lib/gsap";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

/*
 * The opening, once per visit and under three seconds. The page can be
 * scrolled at any moment; nothing waits for it.
 *
 *   0.05  header settles down from above
 *   0.10  context line rises out of its mask
 *   0.18  the ribbon starts to thread in from the left (sculpture controller,
 *         through threadSignals.reveal); each letter rises onto the baseline
 *         just as the ribbon's tip reaches it, so the ribbon weaves the name
 *         together, then ties its loop above the last letter
 *   +1.0  tagline, line by line, as the loop forms
 *   +1.2  introduction, then the two actions, last
 *   +1.7  scroll cue
 *
 * The 3D scene loads after the page; if it is not drawing yet at 0.18 s the
 * name waits for it, but never longer than WAIT_FOR_SCENE, so a slow device or
 * no WebGL (the still SVG ribbon) only costs a fraction of a second.
 *
 * CSS hides these elements before first paint only when this will run
 * (`.js.motion`), and reveals them on its own after 3.2 s if it never does.
 * Adding `intro-live` hands control from that CSS to the timeline below.
 */

const NAME_AT = 0.18;
const WAIT_FOR_SCENE = 0.65;
const RIBBON = { duration: 1.8, ease: "power2.inOut" };
/** A letter starts rising this long before the ribbon's tip arrives, so it is mostly up as the ribbon passes. */
const LEAD = 0.14;

export function playIntro() {
  const root = document.documentElement;
  const hero = document.getElementById("top");
  if (!hero) return () => {};
  const q = gsap.utils.selector(hero);
  const header = document.getElementById("site-header");

  // Arriving partway down the page (a restored scroll position): no opening.
  if (window.scrollY > window.innerHeight * 0.4) {
    root.classList.add("intro-live", "intro-done");
    return () => {};
  }

  const lines = { type: "lines", mask: "lines", linesClass: "split-line", aria: "none" } as const;
  const context = SplitText.create(q("[data-intro='context']"), lines);
  const tagline = SplitText.create(q("[data-intro='tagline']"), lines);
  const finish = () => {
    // Plain text again, so later resizes re-wrap it naturally.
    context.revert();
    tagline.revert();
    root.classList.add("intro-done");
  };

  const letters = q<HTMLElement>(".hero-ch");
  const starts = letterStarts(letters, q<HTMLElement>(".hero-slot")[0]);
  const lastLetter = Math.max(...starts);

  const tl = gsap.timeline({ defaults: { ease: EASE.enter }, onComplete: finish });
  if (header) tl.from(header, { yPercent: -70, autoAlpha: 0, duration: 1.1, clearProps: "all" }, 0.05);
  tl.from(context.lines, { yPercent: 130, duration: DURATION.text }, 0.1).addLabel("name", NAME_AT);
  tl.fromTo(threadSignals, { reveal: 0 }, { reveal: 1, ...RIBBON }, "name");
  letters.forEach((letter, i) => {
    tl.from(
      letter,
      { yPercent: 112, rotate: 5, transformOrigin: "0% 100%", duration: DURATION.signature, clearProps: "transform" },
      `name+=${starts[i]}`,
    );
  });
  const afterName = `name+=${lastLetter + 0.32}`;
  tl.from(tagline.lines, { yPercent: 130, duration: 1.1, stagger: STAGGER.lines + 0.02 }, afterName)
    .from(q("[data-intro='aside']"), { autoAlpha: 0, y: 18, duration: 1, clearProps: "all" }, `${afterName}+=0.2`)
    .from(q("[data-intro='actions'] > *"), { autoAlpha: 0, y: 14, duration: 0.9, stagger: STAGGER.items, clearProps: "all" }, `${afterName}+=0.36`)
    .from(q("[data-intro='cue']"), { autoAlpha: 0, y: -8, duration: 0.9, clearProps: "all" }, `${afterName}+=0.8`);
  root.classList.add("intro-live");

  // Hold the name until the ribbon can be drawn with it (briefly; see WAIT_FOR_SCENE).
  let go: (() => void) | null = null;
  let cap: gsap.core.Tween | null = null;
  if (!threadSignals.ready) {
    tl.addPause("name");
    go = () => {
      window.removeEventListener(THREAD_READY, go!);
      cap?.kill();
      tl.removePause("name");
      if (tl.paused()) tl.play();
    };
    window.addEventListener(THREAD_READY, go);
    cap = gsap.delayedCall(WAIT_FOR_SCENE, go);
  }

  return () => {
    if (go) window.removeEventListener(THREAD_READY, go);
    cap?.kill();
    tl.revert();
    context.revert();
    tagline.revert();
  };
}

/**
 * When each letter should start rising (seconds after the ribbon starts), from
 * where the ribbon's tip will be: the opening's form (sculpture/forms.ts, `hero`)
 * runs its tail from 1.18 slot-half-widths left of centre to `reach` right of
 * it over the first 66% of the strip, and the controller shows the strip up to
 * s = reveal × 1.08. Inverting the ribbon's ease turns that into a time.
 */
function letterStarts(letters: HTMLElement[], slot: HTMLElement | undefined) {
  const box = slot?.getBoundingClientRect();
  if (!box || box.width === 0) return letters.map((_, i) => 0.3 + i * 0.12);
  const reach = box.width / box.height > 3 ? 0.8 : 0.6;
  const ease = gsap.parseEase(RIBBON.ease);
  return letters.map((letter) => {
    const r = letter.getBoundingClientRect();
    const x = ((r.left + r.width * 0.2 - box.left) / box.width) * 2 - 1;
    const s = (0.66 * (x + 1.18)) / (1.18 + reach);
    const reveal = Math.min(1, Math.max(0, s / 1.08));
    return Math.max(0, invert(ease, reveal) * RIBBON.duration - LEAD);
  });
}

/** The time (0–1) at which an increasing ease reaches `value`. */
function invert(ease: (t: number) => number, value: number) {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (ease(mid) < value) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
