import { glide, OPENING, span, type Range } from "@/components/sculpture/scenery";
import { threadSignals } from "@/components/sculpture/signals";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { LANDING_PASSED, STAGE_CHAPTER, stageScroll, stageSpan } from "@/lib/stage";
import { lineGroups } from "./split";

/*
 * The opening's stage on large screens (sections/Opening.tsx): one
 * scroll-linked sequence from the name into Curiosity. The landing scrolls
 * away above it as an ordinary section (sections/Landing.tsx), the stage
 * rises into view and holds still, rests a moment on the name, and then plays
 * the opening. The stage's stuck stretch is one ScrollTrigger on its wrapper
 * (so it is measured again after fonts load and on every resize), eased once
 * here toward the scroll; past the rest (`.opening-lead`) it is the opening's
 * progress p. Its beats live in sculpture/scenery.ts (OPENING); the ribbon and
 * the world read the same value from threadSignals, so the words, the sky,
 * the scene and the ribbon can never disagree. Everything is one paused
 * timeline. Scrolling back plays it in reverse; every state is a function of
 * the scroll, except the name's own entrance, which plays in time as the
 * opening comes into view and backward if the visitor returns to the landing
 * (setupLandingFlow below, motion/intro.ts).
 *
 *   the sky                  pearl and blush give way to powder in one broad
 *                            change, while the horizon swells as the view
 *                            moves toward it
 *   Curiosity arrives        its label (rule, number, name), the statement's
 *                            lines out of masks, the thread under "questions."
 *                            as the word turns ultramarine, then the lede and
 *                            the paragraph in groups of lines, never letters
 *
 * Alongside: whichever layer is out of play is marked `data-dormant` (the
 * ribbon's clearance ignores its words and it takes no pointer), the wrapper
 * carries the chapter the header should name (`data-chapter`), and in-page
 * links to the two sections land on their moment on the stage.
 */

/** How quickly the shared progress follows the scroll (1/s): enough to smooth a jump, not enough to feel late. */
const FOLLOW = 9;
/** Where the opening's top is in the view when the name arrives on the way down, and when it steps back on the way up. */
const LANDING_FLOW = { arrive: "30%", back: "55%" };

const passLanding = (passed: boolean) => window.dispatchEvent(new CustomEvent(LANDING_PASSED, { detail: passed }));

export function setupOpening() {
  const wrapper = document.querySelector<HTMLElement>(".opening");
  const stage = wrapper?.querySelector<HTMLElement>(".opening-stage");
  const hero = document.getElementById("top");
  const about = document.getElementById("about");
  const root = document.documentElement;
  if (!wrapper || !stage || !hero || !about) return () => {};
  // The stage's layout applies from here on (globals.css); if it does not take, the sections simply follow each other.
  root.classList.add("stage-live");
  if (!stageSpan(stage)) {
    root.classList.remove("stage-live");
    return () => {};
  }
  const title = about.querySelector<HTMLElement>(".curiosity-title");

  /** The stretch's progress as scrolled, and as eased (-1 before the first frame). */
  let raw = 0;
  let g = -1;
  /** The rest on the name's share of the stretch; the opening has the remainder. */
  let share = 0;
  let p = 0;
  let tl: gsap.core.Timeline | null = null;
  let splits: SplitText[] = [];
  let masks: HTMLElement[] = [];
  let chapter: string | null = null;
  let disposed = false;

  const measure = (self: ScrollTrigger) => {
    raw = self.progress;
    const opening = stageSpan(stage);
    const total = self.end - self.start;
    share = opening && total > 0 ? Math.min(1, Math.max(0, (opening.start - self.start) / total)) : 0;
  };
  const trigger = ScrollTrigger.create({
    trigger: wrapper,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => void (raw = self.progress),
    onRefresh: measure,
  });
  measure(trigger);

  /** Everything on the stage that is not the scene, as one timeline from p = 0 to p = 1. */
  const build = () => {
    const q = gsap.utils.selector(stage);
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const at = ([a, b]: Range) => ({ start: a, length: b - a });

    // The name, its label and its ribbon are the landing's, which leaves on its own (setupLandingFlow below).
    // Where the ribbon is a still (no WebGL), one still hands over to the other as the ribbon would change.
    const morph = at(OPENING.morph);
    t.to(q(".hero-slot"), { autoAlpha: 0, duration: morph.length * 0.5, ease: "power1.in" }, morph.start);
    t.fromTo(q(".curiosity-slot"), { autoAlpha: 0 }, { autoAlpha: 1, duration: morph.length * 0.6, ease: "power1.out" }, morph.start + morph.length * 0.4);

    // The sky turns, and the horizon swells as the view travels toward it.
    const sky = at(OPENING.sky);
    const flight = at(OPENING.flight);
    t.fromTo(q(".sky-intro"), { autoAlpha: 0 }, { autoAlpha: 1, duration: sky.length, ease: "sine.inOut" }, sky.start);
    t.to(q(".sky-landing"), { scale: 1.18, yPercent: 7, duration: flight.length, ease: "power1.inOut" }, flight.start);
    t.to(q(".world-still"), { autoAlpha: 0, scale: 1.3, duration: 0.36, ease: "power1.in" }, 0.04);

    // Curiosity arrives: label, statement, thread, writing.
    t.from(q(".curiosity-mark .chapter-num > span, .curiosity-mark .chapter-name > span"), { yPercent: 110, duration: 0.07, stagger: 0.015, ease: "power3.out" }, OPENING.mark[0]);
    t.fromTo(q(".curiosity-mark .chapter-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.09, ease: "power2.inOut" }, OPENING.mark[0] + 0.01);

    if (title) {
      const lines = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line", aria: "auto", ignore: ".em-loop" });
      splits.push(lines);
      masks = lines.masks as HTMLElement[];
      const step = (OPENING.heading[1] - OPENING.heading[0] - 0.11) / Math.max(1, lines.lines.length - 1);
      lines.lines.forEach((line, i) => t.from(line, { yPercent: 104, duration: 0.11, ease: "power3.out" }, OPENING.heading[0] + i * Math.min(0.04, step)));
      const path = title.querySelector(".em-loop path");
      if (path) t.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: OPENING.em[1] - OPENING.em[0], ease: "sine.inOut" }, OPENING.em[0]);
    }

    // The writing: the lede in its groups of lines, then the paragraph, a beat later, the same way.
    const copy = Array.from(about.querySelectorAll<HTMLElement>(".curiosity-copy p"));
    let start: number = OPENING.copy[0];
    for (const paragraph of copy) {
      const split = SplitText.create(paragraph, { type: "lines", linesClass: "split-line", aria: "none" });
      splits.push(split);
      const rise = parseFloat(getComputedStyle(paragraph).fontSize) * 0.6;
      const groups = lineGroups(split.lines);
      groups.forEach((group, i) => t.from(group, { y: rise, autoAlpha: 0, duration: 0.08, ease: "power2.out" }, start + i * 0.03));
      start += 0.06 + groups.length * 0.03;
    }
    t.set({}, {}, 1);
    return t;
  };

  const apply = (value: number) => {
    p = share < 1 ? Math.max(0, (value - share) / (1 - share)) : 0;
    tl?.progress(p);
    threadSignals.opening = p;
    // The name is out of play once it has stepped back, and Curiosity until it arrives.
    hero.toggleAttribute("data-dormant", p >= OPENING.exit[1]);
    about.toggleAttribute("data-dormant", p <= OPENING.mark[0]);
    if (title) title.dataset.mark = p >= OPENING.em[0] ? "on" : "pending";
    // The line masks would cut the thread under "questions." once it is drawn; they open once the lines are home.
    const open = p >= OPENING.heading[1];
    for (const mask of masks) mask.style.overflow = open ? "visible" : "clip";
  };

  /** The header names the opening, then Curiosity, for as long as the stage fills the middle of the screen. */
  const nameChapter = () => {
    const leave = window.scrollY - trigger.end;
    const next = leave < window.innerHeight * 0.54 ? (p < OPENING.chapter ? "top" : "about") : null;
    if (next === chapter) return;
    chapter = next;
    if (next) wrapper.dataset.chapter = next;
    else delete wrapper.dataset.chapter;
    // Once the name has stepped back, the header's small one stands in for it (globals.css).
    root.classList.toggle("stage-intro", next === "about");
    window.dispatchEvent(new CustomEvent(STAGE_CHAPTER, { detail: next }));
  };

  // The paper of "How I learn" swells up into the bottom of the stage as Curiosity settles, and
  // flattens as the stage leaves (the dome every other change of colour makes; scenes.ts).
  const dome = about.querySelector<HTMLElement>(".rise");
  let domed = -1;
  const swell = () => {
    const leave = window.scrollY - trigger.end;
    const next = leave > 0 ? 1 - Math.min(1, leave / (window.innerHeight * 0.62)) : glide(span(p, OPENING.rise));
    if (!dome || Math.abs(next - domed) < 1e-4) return;
    domed = next;
    dome.style.transform = `scaleY(${next})`;
  };

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(0.05, deltaMs / 1000);
    const next = g < 0 || Math.abs(raw - g) < 1e-4 ? raw : g + (raw - g) * (1 - Math.exp(-FOLLOW * dt));
    if (next !== g) {
      g = next;
      apply(g);
    }
    swell();
    nameChapter();
  };

  const rebuild = () => {
    if (disposed) return;
    tl?.revert();
    splits.forEach((split) => split.revert());
    splits = [];
    masks = [];
    tl = build();
    apply(g < 0 ? raw : g);
  };

  // Links to the opening or to Curiosity land on their moment on the stage. Their scroll
  // margin is set just before Lenis or the browser reads it, so both arrive at the same place.
  const aim = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href^='#']");
    const target = link?.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null;
    const y = target ? stageScroll(target) : null;
    if (!target || y === null) return;
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    target.style.scrollMarginTop = `${target.getBoundingClientRect().top + window.scrollY - padding - y}px`;
  };
  document.addEventListener("click", aim, true);

  // Arriving with #about in the address: the browser can only scroll to where the stage starts.
  const arrive = () => {
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const y = target ? stageScroll(target) : null;
    if (y !== null && window.scrollY < y - 4) window.scrollTo(0, y);
  };
  arrive();
  if (document.readyState !== "complete") window.addEventListener("load", arrive, { once: true });

  let width = window.innerWidth;
  let timer = 0;
  const onResize = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(rebuild, 160);
  };
  window.addEventListener("resize", onResize);
  document.fonts?.ready.then(rebuild);

  rebuild();
  gsap.ticker.add(tick);

  return () => {
    disposed = true;
    gsap.ticker.remove(tick);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", arrive);
    window.clearTimeout(timer);
    document.removeEventListener("click", aim, true);
    trigger.kill();
    tl?.revert();
    splits.forEach((split) => split.revert());
    threadSignals.opening = -1;
    hero.removeAttribute("data-dormant");
    about.removeAttribute("data-dormant");
    hero.style.scrollMarginTop = "";
    about.style.scrollMarginTop = "";
    if (dome) dome.style.transform = "";
    if (title) delete title.dataset.mark;
    delete wrapper.dataset.chapter;
    root.classList.remove("stage-intro", "stage-live");
    window.dispatchEvent(new CustomEvent(STAGE_CHAPTER, { detail: null }));
  };
}

/**
 * Where the landing shows (large screens), it simply scrolls away above the
 * opening, with or without the stage: the name arrives once most of the
 * opening has come into view (its words sit low), and steps back only once
 * the visitor is well back up in the landing, so lingering near the point
 * does not toggle it. Measured on the opening's wrapper, which, unlike the
 * stage inside it, always scrolls with the page. Where the landing does not
 * show (small screens), the name arrives at once.
 *
 * As the landing goes, its cue steps back with the first of the scroll, and
 * its words lag a little behind the glass and fade before they reach the
 * header (scrubbed, so scrolling back brings them back).
 */
export function setupLandingFlow() {
  const landing = document.querySelector<HTMLElement>(".landing");
  const opening = document.querySelector<HTMLElement>(".opening");
  if (!landing || !opening || landing.getClientRects().length === 0) {
    passLanding(true);
    return () => {};
  }
  let passed: boolean | null = null;
  const pass = (next: boolean) => {
    if (next === passed) return;
    passed = next;
    passLanding(next);
  };
  // Arriving already scrolled past the point (a restored position or a link), the name arrives at once.
  const settle = (self: ScrollTrigger) => {
    if (passed === null && self.start > 0 && window.scrollY >= self.start) pass(true);
  };
  const arrive = ScrollTrigger.create({ trigger: opening, start: `top ${LANDING_FLOW.arrive}`, end: "max", onEnter: () => pass(true), onRefresh: settle });
  const back = ScrollTrigger.create({ trigger: opening, start: `top ${LANDING_FLOW.back}`, end: "max", onLeaveBack: () => pass(false) });
  settle(arrive);

  const leave = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: landing, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
  });
  // The words' wrapper stays still: a moving one would be a layer of its own, and the name's
  // letters could no longer pass over and under the ribbon. Each piece moves instead, and the
  // ribbon's box with them.
  const words = [...landing.querySelectorAll(".landing-name .landing-mask, .landing-mark, .landing-slot")];
  leave
    .to(landing.querySelector(".landing-cue"), { autoAlpha: 0, y: 24, duration: 0.12, ease: "power1.in" }, 0)
    .to(words, { y: () => window.innerHeight * 0.14, duration: 0.6 }, 0)
    .to(words, { autoAlpha: 0, duration: 0.26, ease: "power1.in" }, 0.14)
    .set({}, {}, 1);
  return () => {
    arrive.kill();
    back.kill();
    leave.scrollTrigger?.kill();
    leave.revert();
  };
}
