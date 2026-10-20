import { threadSignals } from "@/components/sculpture/signals";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { DURATION, EASE, ENTER_AT, STAGGER } from "@/lib/motion";
import { ariaFor } from "./split";

/*
 * Section motion, declared in the markup and built here in page order (so
 * ScrollTriggers refresh top to bottom). Each kind is a different reading
 * pace, so no two sections arrive the same way:
 *
 *   data-reveal="lines"    heading lines rise out of a mask
 *   data-reveal="words"    the same, word by word (the Curiosity statement)
 *   data-reveal="wipe"     lines uncover left to right (Experience, after its long strand)
 *   data-reveal="lede"     a paragraph's lines rise in readable chunks, slower than a heading
 *   data-reveal="fade"     the element, or with data-reveal-children its children, settle in
 *   data-reveal="stage"    a learning stage: its marker comes into focus, then title, then words
 *   data-reveal="ruled"    a list whose items each draw their rule, then their words arrive
 *                          (with data-reveal-turns, each item also lifts its turn of the coil)
 *
 * Optional: data-reveal-delay (seconds). A heading holding `.em` gets its mark
 * drawn once its words have landed.
 *
 * Entrances play once and then hand the element back as plain, unsplit text.
 * Nothing is hidden by CSS: the start state is applied here, so if this never
 * runs the content is simply already in place.
 */
export function setupReveals() {
  const cleanups: (() => void)[] = [];
  const restored = window.scrollY > 0;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))) {
    if (el.closest("#top")) continue; // the opening has its own sequence
    // Already on screen when the page opens partway down: leave it be.
    if (restored && ScrollTrigger.isInViewport(el, 0.05)) {
      el.dataset.mark = "on";
      continue;
    }
    const kind = el.dataset.reveal;
    const delay = Number(el.dataset.revealDelay ?? 0);
    if (kind === "lines" || kind === "words" || kind === "wipe" || kind === "lede") cleanups.push(split(el, kind, delay));
    else if (kind === "fade") fade(el, delay);
    else if (kind === "stage") cleanups.push(stage(el));
    else if (kind === "ruled") ruled(el);
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

function split(el: HTMLElement, kind: "lines" | "words" | "wipe" | "lede", delay: number) {
  const marker = el.querySelector(".em");
  if (marker) el.dataset.mark = "pending";
  const instance = SplitText.create(el, {
    type: kind === "words" ? "lines,words" : "lines",
    mask: kind === "words" ? "words" : kind === "wipe" ? undefined : "lines",
    linesClass: "split-line",
    wordsClass: "split-word",
    aria: ariaFor(el),
    // The drawn mark under a word is not text; leave it where it is.
    ignore: ".em-loop",
    autoSplit: true,
    onSplit(self) {
      const targets = kind === "words" ? self.words : self.lines;
      const timing: gsap.TweenVars = {
        ease: EASE.enter,
        delay,
        scrollTrigger: { trigger: el, start: ENTER_AT, once: true },
        onComplete() {
          self.kill();
          self.revert();
          if (marker) el.dataset.mark = "on";
        },
      };
      if (kind === "wipe") {
        // The clip reaches past each line's box so ascenders and descenders are never cut.
        return gsap.fromTo(
          targets,
          { clipPath: "inset(-15% 100% -25% 0%)", x: -28 },
          { clipPath: "inset(-15% 0% -25% 0%)", x: 0, duration: DURATION.heading + 0.15, stagger: STAGGER.lines + 0.03, ...timing },
        );
      }
      if (kind === "lede") {
        // Reading text: a shorter rise and a slower stagger, so each line can be read as it lands.
        return gsap.from(targets, { yPercent: 70, autoAlpha: 0, duration: DURATION.text + 0.25, stagger: 0.14, ...timing });
      }
      if (kind === "words") return gsap.from(targets, { yPercent: 130, duration: DURATION.heading, stagger: STAGGER.words, ...timing });
      return gsap.from(targets, {
        yPercent: 130,
        rotate: 2.5,
        transformOrigin: "0% 100%",
        duration: DURATION.heading,
        stagger: STAGGER.lines,
        ...timing,
      });
    },
  });
  return () => instance.revert();
}

function fade(el: HTMLElement, delay: number) {
  const targets = el.hasAttribute("data-reveal-children") ? Array.from(el.children) : el;
  gsap.from(targets, {
    autoAlpha: 0,
    y: 26,
    duration: DURATION.text,
    ease: EASE.enter,
    delay,
    stagger: STAGGER.items,
    clearProps: "all",
    scrollTrigger: { trigger: el, start: ENTER_AT, once: true },
  });
}

/**
 * A learning stage reaching the reading position: its number comes into focus
 * on the rail, its title rises out of a mask, then its sentence follows. The
 * stage's state (current, done) is separate and reversible (stages.ts).
 */
function stage(el: HTMLElement) {
  const num = el.querySelector(".stage-num");
  const title = el.querySelector<HTMLElement>(".t-stage");
  const body = el.querySelector(".stage-body");
  if (!title) return () => {};
  const instance = SplitText.create(title, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    aria: ariaFor(title),
    autoSplit: true,
    onSplit(self) {
      const tl = gsap.timeline({
        defaults: { ease: EASE.enter },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete() {
          self.kill();
          self.revert();
        },
      });
      if (num) tl.from(num, { scale: 0.6, autoAlpha: 0, duration: 0.8, clearProps: "transform,opacity,visibility" }, 0);
      tl.from(self.lines, { yPercent: 130, duration: DURATION.heading, stagger: STAGGER.lines }, 0.06);
      if (body) tl.from(body, { autoAlpha: 0, y: 16, duration: DURATION.text, clearProps: "all" }, 0.18);
      return tl;
    },
  });
  return () => instance.revert();
}

/**
 * Each item draws its rule across, then its words arrive. A list marked
 * data-reveal-turns (Foundations) is slower and lifts the coil's matching turn
 * as each course arrives, so the four turns read as the four courses.
 */
function ruled(list: HTMLElement) {
  const items = Array.from(list.children) as HTMLElement[];
  const turns = list.hasAttribute("data-reveal-turns");
  const gap = turns ? 0.3 : 0.14;
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter(batch) {
      batch.forEach((item, i) => {
        const tl = gsap
          .timeline({ delay: i * gap })
          .fromTo(item.querySelector(".rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: EASE.move, clearProps: "transform" })
          .fromTo(
            item.querySelectorAll(":scope > :not(.rule)"),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: DURATION.text, ease: EASE.enter, stagger: 0.07, clearProps: "all" },
            0.25,
          );
        if (turns) {
          const turn = items.indexOf(item as HTMLElement);
          tl.call(() => lift(turn), [], 0.3).call(() => release(turn), [], 0.3 + gap + 0.25);
        }
      });
    },
  });
  // Start hidden only once the batch exists; anything already passed plays at once.
  gsap.set(list.querySelectorAll(":scope > * > .rule"), { scaleX: 0 });
  gsap.set(list.querySelectorAll(":scope > * > :not(.rule)"), { autoAlpha: 0 });
}

/** Lifts a turn of the coil for the entrance, unless the visitor is pointing at a course. */
function lift(turn: number) {
  if (document.querySelector(".course:hover")) return;
  threadSignals.turn = turn;
}
function release(turn: number) {
  if (threadSignals.turn === turn && !document.querySelector(".course:hover")) threadSignals.turn = -1;
}
