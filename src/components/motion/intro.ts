import { THREAD_READY, threadSignals } from "@/components/sculpture/signals";
import { gsap, SplitText } from "@/lib/gsap";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { LANDING_PASSED } from "@/lib/stage";
import { lineGroups } from "./split";

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
 *   +1.3  introduction, in two or three groups of lines (never letters)
 *   +1.7  the scroll cue, last
 *
 * Large screens open on the landing instead (sections/Landing.tsx): the
 * header and the landing's own words arrive with the page, the label rising
 * just before the name, then the name with its ribbon (threaded in, each
 * letter rising as the tip reaches it), then the cue. The opening's own
 * words (only the assistive-technology copies of the label and the name, and
 * the scroll cue) wait until the visitor scrolls into the opening, then play
 * (LANDING_PASSED, motion/opening.ts). If the visitor scrolls back
 * up into the landing, that entrance plays backward, a little faster, and
 * forward again on the way down.
 *
 * The 3D scene loads after the page; if it is not drawing yet when the name
 * starts, the name waits for it, but never longer than WAIT_FOR_SCENE, so a
 * slow device or no WebGL (the still SVG ribbon) only costs a fraction of a
 * second.
 *
 * CSS hides these elements before first paint only when this will run
 * (`.js.motion`), and reveals them on its own after 3.2 s if it never does.
 * Adding `intro-live` hands control from that CSS to the timelines below.
 */

const NAME_AT = 0.18;
const WAIT_FOR_SCENE = 0.65;
const RIBBON = { duration: 1.8, ease: "power2.inOut" };
/** A letter starts rising this long before the ribbon's tip arrives, so it is mostly up as the ribbon passes. */
const LEAD = 0.14;
/** How much faster the entrance plays backward when the visitor returns to the landing. */
const RETREAT = 2.2;

export function playIntro() {
  const root = document.documentElement;
  const hero = document.getElementById("top");
  if (!hero) return () => {};
  const q = gsap.utils.selector(hero);
  const header = document.getElementById("site-header");
  const landing = document.querySelector<HTMLElement>(".landing");
  // Where the landing shows, the name waits for it to clear.
  const held = landing !== null && landing.getClientRects().length > 0;

  // Arriving partway down the page (a restored scroll position): no opening.
  if (!held && window.scrollY > window.innerHeight * 0.4) {
    root.classList.add("intro-live", "intro-done");
    return () => {};
  }

  // What arrives with the page, whenever the name does: the header.
  const arrival = gsap.timeline({ defaults: { ease: EASE.enter } });
  if (header) arrival.from(header, { yPercent: -70, autoAlpha: 0, duration: 1.1, clearProps: "all" }, 0.05);

  // Where the landing shows, its label, the name and its ribbon arrive on it with the page: the label
  // rises out of its mask, the ribbon threads in and each letter rises out of its mask as its tip
  // reaches it (as the opening's name does below), then the cue.
  let landingName: gsap.core.Timeline | null = null;
  let landingStarts: number[] = [];
  if (held) {
    const l = gsap.utils.selector(landing);
    const letters = l<HTMLElement>(".landing-ch");
    landingStarts = letterStarts(letters, l<HTMLElement>(".landing-slot")[0]);
    const afterName = `name+=${Math.max(...landingStarts) + 0.2}`;
    const n = gsap.timeline({ paused: true, defaults: { ease: EASE.enter }, onComplete: () => root.classList.add("intro-done") });
    n.from(l(".landing-context"), { yPercent: 130, duration: DURATION.text, clearProps: "transform" }, 0.1)
      .addLabel("name", NAME_AT)
      .fromTo(threadSignals, { reveal: 0 }, { reveal: 1, ...RIBBON }, "name");
    letters.forEach((letter, i) => {
      n.from(letter, { yPercent: 112, duration: DURATION.signature, clearProps: "transform" }, `name+=${landingStarts[i]}`);
    });
    n.from(l(".landing-cue-inner"), { autoAlpha: 0, y: 14, duration: 1.3, clearProps: "all" }, afterName);
    landingName = n;
  }

  let splits: SplitText[] = [];
  let tl: gsap.core.Timeline | null = null;

  /**
   * The name's entrance, paused at its start. Where it may have to play
   * backward (`keep`), its splits stay in place once it has played; otherwise
   * they are let go of at the end, so later resizes re-wrap the text.
   */
  const build = (keep: boolean) => {
    const context = SplitText.create(q("[data-intro='context']"), { type: "lines", mask: "lines", linesClass: "split-line", aria: "none" });
    // On large screens the introduction paragraph is left to Curiosity (Hero.tsx) and is not shown here.
    const aside = q<HTMLElement>("[data-intro='aside']").filter((el) => el.getClientRects().length > 0);
    const intro = aside.length ? SplitText.create(aside, { type: "lines", linesClass: "split-line", aria: "none" }) : null;
    splits = [context, intro].filter((split): split is SplitText => split !== null);
    const finish = () => {
      root.classList.add("intro-done");
      if (keep) return;
      // Plain text again, so later resizes re-wrap it naturally.
      splits.forEach((split) => split.revert());
      splits = [];
      tl = null;
    };

    // Where the landing shows, the name and its ribbon are the landing's (above); the opening's own
    // words keep the timing they had, from the moment the name would have finished.
    const letters = held ? [] : q<HTMLElement>(".hero-ch");
    const starts = held ? landingStarts : letterStarts(letters, q<HTMLElement>(".hero-slot")[0]);
    const lastLetter = Math.max(...starts);

    const t = gsap.timeline({ paused: true, defaults: { ease: EASE.enter }, onComplete: finish, onReverseComplete: () => root.classList.remove("intro-done") });
    t.from(context.lines, { yPercent: 130, duration: DURATION.text }, 0.1).addLabel("name", NAME_AT);
    if (!held) t.fromTo(threadSignals, { reveal: 0 }, { reveal: 1, ...RIBBON }, "name");
    letters.forEach((letter, i) => {
      t.from(
        letter,
        { yPercent: 112, rotate: 3, transformOrigin: "0% 100%", duration: DURATION.signature, clearProps: "transform" },
        `name+=${starts[i]}`,
      );
    });
    const afterName = `name+=${lastLetter + 0.32}`;
    lineGroups(intro?.lines ?? []).forEach((group, i) => {
      t.from(group, { autoAlpha: 0, y: 12, duration: DURATION.read, ease: EASE.read }, `${afterName}+=${0.3 + i * STAGGER.groups}`);
    });
    t.from(q("[data-intro='cue']"), { autoAlpha: 0, y: -8, duration: 0.9, clearProps: "all" }, `${afterName}+=1`);
    return t;
  };

  // Hold the name until the ribbon can be drawn with it (briefly, and only the first time; see WAIT_FOR_SCENE).
  let go: (() => void) | null = null;
  let cap: gsap.core.Tween | null = null;
  const play = (t: gsap.core.Timeline) => {
    if (!go && !threadSignals.ready) {
      t.addPause("name");
      go = () => {
        window.removeEventListener(THREAD_READY, go!);
        cap?.kill();
        t.removePause("name");
        if (t.paused() && !t.reversed()) t.play();
      };
      window.addEventListener(THREAD_READY, go);
      cap = gsap.delayedCall(WAIT_FOR_SCENE, go);
    }
    t.timeScale(1).play();
  };

  tl = build(held);
  root.classList.add("intro-live");
  if (landingName) play(landingName);
  else play(tl);

  const onPassed = (event: Event) => {
    const passed = (event as CustomEvent<boolean>).detail;
    if (!tl) {
      // It has played and let go of its splits; to step back, it is built again at its end.
      if (passed) return;
      tl = build(true);
      tl.progress(1);
    }
    if (passed) play(tl);
    else tl.timeScale(RETREAT).reverse();
  };
  window.addEventListener(LANDING_PASSED, onPassed);

  return () => {
    window.removeEventListener(LANDING_PASSED, onPassed);
    if (go) window.removeEventListener(THREAD_READY, go);
    cap?.kill();
    arrival.revert();
    landingName?.revert();
    tl?.revert();
    splits.forEach((split) => split.revert());
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
