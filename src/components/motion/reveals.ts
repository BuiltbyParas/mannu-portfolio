import { threadSignals } from "@/components/sculpture/signals";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { DURATION, EASE, ENTER_AT, STAGGER } from "@/lib/motion";
import { ariaFor, lineGroups, token } from "./split";

/*
 * Section motion, declared in the markup and built here in page order (so
 * ScrollTriggers refresh top to bottom). One small vocabulary, set by what the
 * words are doing, so no two headings arrive the same way and reading text
 * always arrives calmly:
 *
 *   data-reveal="index"     a chapter mark: its rule draws, its number and name rise
 *   data-reveal="question"  Curiosity: lines lift a short way through their masks and run
 *                           straight on into the thread drawn under "questions." as it turns ultramarine
 *   data-reveal="progress"  How I learn: lines rise, then the words fill from slate to
 *                           ink with the scroll (its last words to ultramarine)
 *   data-reveal="phrases"   Foundations: the first sentence rises by lines, the second
 *                           ("Room to grow.") word by word inside its line, a beat later
 *   data-reveal="rise"      a heading's lines rise out of their masks (Certificates)
 *   data-reveal="wipe"      lines uncover left to right (Experience, after its long strand)
 *   data-reveal="finale"    Contact: the opening lines rise together, the last one later
 *                           and slower, and its tinted word settles into citron
 *   data-reveal="lede"      a paragraph in two or three groups of lines, small and calm
 *   data-reveal="fade"      the element, or with data-reveal-children its children, settle in
 *   data-reveal="stage"     a learning stage: its number wipes up, its title rises word by
 *                           word, then its sentence
 *   data-reveal="ruled"     a list: each item's knot appears, its rule draws from it, its
 *                           label rises, then its details (with data-reveal-turns, each
 *                           item also lifts its turn of the coil)
 *
 * Optional: data-reveal-delay (seconds).
 *
 * Where the opening's stage is in use (`stage`), the words on it arrive with
 * the stage's own progress instead (opening.ts) and are skipped here.
 *
 * Entrances play once and then hand the element back as plain, unsplit text
 * (only the scroll-linked heading stays split, for as long as it is linked).
 * Nothing is hidden by CSS: the start state is applied here, so if this never
 * runs the content is simply already in place, in its final colours.
 */
export function setupReveals(stage = false) {
  const cleanups: (() => void)[] = [];
  const restored = window.scrollY > 0;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))) {
    if (el.closest("#top")) continue; // the opening has its own sequence
    if (stage && el.closest(".opening-stage")) continue;
    // Already on screen when the page opens partway down: leave it be.
    if (restored && ScrollTrigger.isInViewport(el, 0.05)) continue;
    const delay = Number(el.dataset.revealDelay ?? 0);
    const build = BUILD[el.dataset.reveal ?? ""];
    if (build) cleanups.push(build(el, delay) ?? (() => {}));
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}

type Build = (el: HTMLElement, delay: number) => (() => void) | void;

const BUILD: Record<string, Build> = {
  index,
  question,
  progress,
  phrases,
  rise: (el, delay) =>
    entrance(el, { type: "lines", mask: "lines" }, delay, (self, tl) => {
      tl.from(self.lines, { yPercent: 105, duration: DURATION.line, stagger: STAGGER.lines });
    }),
  wipe: (el, delay) =>
    // The clip reaches past each line's box so ascenders, descenders and the full stop are never cut.
    entrance(el, { type: "lines" }, delay, (self, tl) => {
      tl.fromTo(
        self.lines,
        { clipPath: "inset(-20% 100% -30% -2%)", x: -28 },
        { clipPath: "inset(-20% -4% -30% -2%)", x: 0, duration: DURATION.heading + 0.15, stagger: STAGGER.lines + 0.03 },
      );
    }),
  finale,
  lede,
  fade,
  stage,
  ruled: (el) => ruled(el),
};

/**
 * The common shape of a split entrance: split (and re-split if fonts or the
 * width change before it plays), build a timeline that starts as the element
 * enters, and hand the element back as plain text once it has played.
 */
function entrance(
  el: HTMLElement,
  vars: SplitText.Vars,
  delay: number,
  build: (self: SplitText, tl: gsap.core.Timeline) => void,
  opts: { start?: string; keep?: boolean; done?: () => void } = {},
) {
  const instance = SplitText.create(el, {
    linesClass: "split-line",
    wordsClass: "split-word",
    aria: ariaFor(el),
    autoSplit: true,
    ...vars,
    onSplit(self) {
      const tl = gsap.timeline({
        delay,
        defaults: { ease: EASE.enter },
        scrollTrigger: { trigger: el, start: opts.start ?? ENTER_AT, once: true },
        onComplete() {
          if (!opts.keep) {
            self.kill();
            self.revert();
          }
          opts.done?.();
        },
      });
      build(self, tl);
      return tl;
    },
  });
  return () => instance.revert();
}

/** A chapter mark: the number and name rise out of their masks as the rule draws out between them. */
function index(el: HTMLElement, delay: number) {
  const words = el.querySelectorAll(".chapter-num > span, .chapter-name > span");
  const rule = el.querySelector(".chapter-rule");
  gsap
    .timeline({ delay, scrollTrigger: { trigger: el, start: "top 90%", once: true } })
    .from(words, { yPercent: 110, duration: DURATION.label, ease: EASE.enter, stagger: 0.12, clearProps: "transform" }, 0)
    .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: DURATION.label + 0.2, ease: EASE.move, clearProps: "transform" }, 0.05);
}

/**
 * Curiosity's statement. Its lines travel less than other headings (two
 * thirds of a line, clearing as they come) and the motion carries straight on
 * into its last word: "questions." turns ultramarine as the last line lands,
 * the split hands back plain text the moment that line is settled (the masks
 * would cut the thread), and the thread is drawn under the word.
 */
const QUESTION = { rise: 65, duration: 1.1, stagger: 0.12 };
function question(el: HTMLElement, delay: number) {
  if (!el.querySelector(".em")) return BUILD.rise(el, delay);
  el.dataset.mark = "pending";
  let drawing: gsap.core.Tween | null = null;
  const instance = SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    aria: ariaFor(el),
    ignore: ".em-loop",
    autoSplit: true,
    onSplit(self) {
      const lastStart = QUESTION.stagger * (self.lines.length - 1);
      return (
        gsap
          .timeline({ delay, defaults: { ease: EASE.enter }, scrollTrigger: { trigger: el, start: ENTER_AT, once: true } })
          .from(self.lines, { yPercent: QUESTION.rise, autoAlpha: 0, duration: QUESTION.duration, stagger: QUESTION.stagger })
          .call(() => void (el.dataset.mark = "on"), [], lastStart + 0.22)
          // Halfway through its tween, expo.out has the last line within about a pixel of its place.
          .call(
            () => {
              self.kill();
              self.revert();
              const path = el.querySelector(".em-loop path");
              if (path) drawing = gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "sine.inOut" });
            },
            [],
            lastStart + QUESTION.duration * 0.5,
          )
      );
    },
  });
  return () => {
    drawing?.revert();
    instance.revert();
  };
}

/**
 * "Every difficult problem has a starting point." Its lines rise as the
 * section opens; after that the words stay split and fill from slate to ink
 * as the heading travels up the screen, the last two ("starting point.") to
 * ultramarine, so reading down to the first stage finishes the sentence.
 * Scrolling back drains it again. Without motion it is simply set in its
 * final colours.
 */
function progress(el: HTMLElement, delay: number) {
  let fill: gsap.core.Tween | null = null;
  const instance = SplitText.create(el, {
    type: "lines,words",
    mask: "lines",
    linesClass: "split-line",
    wordsClass: "split-word",
    aria: ariaFor(el),
    autoSplit: true,
    onSplit(self) {
      fill?.revert();
      fill = gsap.from(self.words, {
        color: token("--muted"),
        ease: EASE.scroll,
        stagger: 0.5,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 48%", scrub: true },
      });
      return gsap.from(self.lines, {
        yPercent: 105,
        duration: DURATION.line,
        ease: EASE.enter,
        stagger: STAGGER.lines,
        delay,
        scrollTrigger: { trigger: el, start: ENTER_AT, once: true },
      });
    },
  });
  return () => {
    fill?.revert();
    instance.revert();
  };
}

/**
 * "Strong foundations. Room to grow." Two sentences, two arrivals: the first
 * rises by whole lines, the second a beat later word by word inside its own
 * line, so the two blocks come into alignment rather than arriving as one.
 * The second sentence's words then ease apart with the scroll (scenes.ts).
 */
function phrases(el: HTMLElement, delay: number) {
  return entrance(el, { type: "lines,words", mask: "lines" }, delay, (self, tl) => {
    const second = self.words.filter((word) => word.closest(".grow-word"));
    const first = self.lines.filter((line) => !line.querySelector(".grow-word"));
    if (!second.length || !first.length) {
      tl.from(self.lines, { yPercent: 105, duration: DURATION.line, stagger: STAGGER.lines });
      return;
    }
    tl.from(first, { yPercent: 105, duration: DURATION.line, stagger: STAGGER.lines + 0.02 }, 0).from(
      second,
      { yPercent: 110, duration: DURATION.line - 0.1, stagger: 0.09 },
      0.32 + (first.length - 1) * (STAGGER.lines + 0.02),
    );
  });
}

/**
 * Contact, the last beat. The opening lines rise together; the last line
 * follows later and slower, and its tinted word ("conversation.") turns from
 * white to citron as it settles, as the ribbon's loop closes beside it.
 */
function finale(el: HTMLElement, delay: number) {
  if (el.querySelector(".tint")) el.dataset.mark = "pending";
  return entrance(
    el,
    { type: "lines", mask: "lines" },
    delay,
    (self, tl) => {
      const lines = self.lines;
      const last = lines[lines.length - 1];
      const rest = lines.slice(0, -1);
      if (rest.length) tl.from(rest, { yPercent: 105, duration: DURATION.line - 0.1, stagger: STAGGER.lines - 0.02 }, 0);
      tl.from(last, { yPercent: 105, duration: DURATION.heading + 0.35 }, rest.length ? 0.38 + rest.length * 0.05 : 0).call(
        () => {
          el.dataset.mark = "on";
        },
        [],
        "-=0.9",
      );
    },
    { start: "top 80%" },
  );
}

/**
 * Reading text: the paragraph's lines in two or three groups, each rising a
 * little (about a third of a line) and clearing as it comes, a short beat apart.
 */
function lede(el: HTMLElement, delay: number) {
  const rise = parseFloat(getComputedStyle(el).fontSize) * 0.55;
  return entrance(el, { type: "lines" }, delay, (self, tl) => {
    lineGroups(self.lines).forEach((group, i) => {
      tl.from(group, { y: rise, autoAlpha: 0, duration: DURATION.read, ease: EASE.read }, i * STAGGER.groups);
    });
  });
}

function fade(el: HTMLElement, delay: number) {
  const targets = el.hasAttribute("data-reveal-children") ? Array.from(el.children) : el;
  gsap.from(targets, {
    autoAlpha: 0,
    y: 16,
    duration: DURATION.read,
    ease: EASE.read,
    delay,
    stagger: STAGGER.items,
    clearProps: "all",
    scrollTrigger: { trigger: el, start: ENTER_AT, once: true },
  });
}

/**
 * A learning stage nearing the reading line: its number wipes up inside its
 * ring, its title rises word by word, then its sentence follows in one calm
 * step. Split only when it plays (short text, gone again a second later).
 * The stage's state (current, done) is separate and reversible (stages.ts), on
 * the same line the ribbon uses, so the words, rail and form always agree.
 */
function stage(el: HTMLElement) {
  const num = el.querySelector(".stage-num");
  const title = el.querySelector<HTMLElement>(".t-stage");
  const body = el.querySelector<HTMLElement>(".stage-body");
  if (!title || !body) return;
  const splits: SplitText[] = [];
  gsap.set([title, body], { autoAlpha: 0 });
  if (num) gsap.set(num, { clipPath: "inset(100% 0% 0% 0% round 999px)" });
  ScrollTrigger.create({
    trigger: el,
    start: "top 76%",
    once: true,
    onEnter() {
      const words = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", aria: ariaFor(title) });
      const lines = SplitText.create(body, { type: "lines", linesClass: "split-line", aria: "none" });
      splits.push(words, lines);
      const tl = gsap.timeline({
        defaults: { ease: EASE.enter },
        onComplete() {
          words.revert();
          lines.revert();
        },
      });
      if (num) tl.to(num, { clipPath: "inset(0% 0% 0% 0% round 999px)", duration: 0.6, ease: EASE.read, clearProps: "clipPath" }, 0);
      tl.set([title, body], { autoAlpha: 1 }, 0)
        .from(words.words, { yPercent: 110, duration: DURATION.line - 0.15, stagger: 0.07 }, 0.12)
        .from(lines.lines, { y: 12, autoAlpha: 0, duration: DURATION.read, ease: EASE.read, stagger: 0.06 }, 0.34);
    },
  });
  return () => splits.forEach((split) => split.revert());
}

/**
 * Each item's knot appears, its rule draws out of it, its label rises from a
 * mask and its details follow. A list marked data-reveal-turns (Foundations)
 * is slower and lifts the coil's matching turn as each course arrives, so the
 * four turns read as the four courses. Lists added later in site.ts
 * (certificates, experience) get the same entrance without new code.
 */
function ruled(list: HTMLElement) {
  const items = Array.from(list.children) as HTMLElement[];
  const turns = list.hasAttribute("data-reveal-turns");
  const gap = turns ? 0.3 : 0.14;
  // The item's label (its h3) and everything else that follows it in, label excluded.
  const parts = (item: HTMLElement) => {
    const label = item.querySelector<HTMLElement>("h3");
    const rest: Element[] = [];
    for (const child of Array.from(item.children)) {
      if (child === label || child.matches(".rule, .rule-knot")) continue;
      if (label && child.contains(label)) rest.push(...Array.from(child.children).filter((el) => el !== label));
      else rest.push(child);
    }
    return { label, rest };
  };
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter(batch) {
      batch.forEach((element, i) => {
        const item = element as HTMLElement;
        const { label, rest } = parts(item);
        const split = label ? SplitText.create(label, { type: "lines", mask: "lines", linesClass: "split-line", aria: ariaFor(label) }) : null;
        const tl = gsap
          .timeline({ delay: i * gap, onComplete: () => split?.revert() })
          .fromTo(item.querySelector(".rule-knot"), { scale: 0 }, { scale: 1, duration: 0.4, ease: EASE.read, clearProps: "transform" }, 0)
          .fromTo(item.querySelector(".rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: EASE.move, clearProps: "transform" }, 0.08);
        if (label && split) {
          tl.set(label, { autoAlpha: 1 }, 0.3).from(split.lines, { yPercent: 105, duration: DURATION.line - 0.1, ease: EASE.enter, stagger: STAGGER.lines }, 0.3);
        }
        tl.fromTo(rest, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: DURATION.read, ease: EASE.read, stagger: 0.07, clearProps: "all" }, 0.45);
        if (turns) {
          const turn = items.indexOf(item);
          tl.call(() => lift(turn), [], 0.3).call(() => release(turn), [], 0.3 + gap + 0.25);
        }
      });
    },
  });
  // Start hidden only once the batch exists; anything already passed plays at once.
  for (const item of items) {
    const { label, rest } = parts(item);
    gsap.set(item.querySelector(".rule"), { scaleX: 0 });
    gsap.set(item.querySelector(".rule-knot"), { scale: 0 });
    gsap.set([label, ...rest].filter(Boolean), { autoAlpha: 0 });
  }
}

/** Lifts a turn of the coil for the entrance, unless the visitor is pointing at a course. */
function lift(turn: number) {
  if (document.querySelector(".course:hover")) return;
  threadSignals.turn = turn;
}
function release(turn: number) {
  if (threadSignals.turn === turn && !document.querySelector(".course:hover")) threadSignals.turn = -1;
}
