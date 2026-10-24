import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { stageScroll } from "@/lib/stage";

/*
 * Scenery tied to the scroll position: all scrubbed, so scrolling back plays
 * every one of them in reverse and no state is ever left half-way. Only with
 * motion allowed; otherwise each element simply stays in its resting place.
 *
 *   the opening's exit   the name and its context line rise a little faster
 *                        than the page as it leaves, opening depth between
 *                        them and the words below (parallax, 1 of 3)
 *   the cue              its line fills with the first scroll and hands over
 *                        to the trail in the margin
 *   the passage veil     a pale ultramarine vignette deepens around the view
 *                        while the scene flies through its points, then clears
 *   rising chapters      where one colour gives way to the next, the next one
 *                        swells up into the end of the last as a soft dome and
 *                        settles flat as it reaches its place
 *   Experience           the heading drifts against the long strand under it
 *                        (parallax, 2 of 3; the passage's depth is the third)
 *   "Room to grow."      the words of the line ease apart as the heading rises
 *
 * Where the opening's stage is in use (`stage`, large screens), the opening's
 * exit, the passage and the dome at the end of Curiosity belong to the stage
 * instead (opening.ts).
 */
export function setupScenes(stage = false) {
  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
  const scrub = (trigger: Element | string, start: string, end: string) => ({ trigger, start, end, scrub: true, invalidateOnRefresh: true });

  const hero = stage ? null : document.getElementById("top");
  if (hero) {
    tweens.push(
      gsap
        .timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: scrub(hero, "top top", "bottom top") })
        .to(hero.querySelector(".hero-name-wrap"), { y: () => -window.innerHeight * 0.1 }, 0)
        .to(hero.querySelector(".hero-context"), { y: () => -window.innerHeight * 0.16 }, 0),
    );
  }

  const cue = document.querySelector(".hero-cue-inner");
  const trail = document.querySelector(".trail");
  if (cue || trail) {
    // From where the name is at rest: the top of the page, or past the landing on large screens.
    const opening = document.getElementById("top");
    const from = () => (opening ? (stageScroll(opening) ?? opening.getBoundingClientRect().top + window.scrollY) : 0);
    const tl = gsap.timeline({
      defaults: { ease: EASE.scroll },
      scrollTrigger: { start: from, end: () => from() + window.innerHeight * 0.5, scrub: true, invalidateOnRefresh: true },
    });
    if (cue) {
      tl.fromTo(cue.querySelector(".hero-cue-fill"), { scaleY: 0 }, { scaleY: 1, duration: 0.6 }, 0)
        .to(cue.querySelector(".hero-cue-label"), { autoAlpha: 0, y: 14, duration: 0.4 }, 0)
        .to(cue, { autoAlpha: 0, duration: 0.3 }, 0.6);
      // The bead stops travelling as soon as the scroll takes over the line.
      tl.eventCallback("onUpdate", () => cue.classList.toggle("is-moving", tl.progress() > 0.001));
    }
    if (trail) tl.fromTo(trail, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.5);
    tweens.push(tl);
  }

  const passage = stage ? null : document.querySelector(".curiosity-passage");
  const veil = document.querySelector(".passage-veil");
  if (passage && veil) {
    tweens.push(
      gsap
        .timeline({ defaults: { ease: "sine.inOut" }, scrollTrigger: scrub(passage, "top bottom", "bottom 20%") })
        .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 })
        .to(veil, { autoAlpha: 0, duration: 0.4 }, 0.6),
    );
  }

  for (const rise of Array.from(document.querySelectorAll<HTMLElement>(".rise"))) {
    const section = rise.parentElement;
    if (!section || (stage && rise.closest(".opening"))) continue;
    tweens.push(gsap.fromTo(rise, { scaleY: 1 }, { scaleY: 0, ease: EASE.scroll, scrollTrigger: scrub(section, "bottom bottom", "bottom 38%") }));
  }

  const experience = document.querySelector(".experience-head");
  if (experience) {
    tweens.push(
      gsap.fromTo(
        experience,
        { y: () => window.innerHeight * 0.05 },
        { y: () => -window.innerHeight * 0.05, ease: EASE.scroll, scrollTrigger: scrub(experience, "top bottom", "bottom top") },
      ),
    );
  }

  const grow = document.querySelector<HTMLElement>("[data-grow]");
  if (grow) {
    tweens.push(gsap.fromTo(grow, { "--grow": 0 }, { "--grow": 1, ease: EASE.scroll, scrollTrigger: scrub(grow, "top 75%", "top 15%") }));
  }

  return () => tweens.forEach((tween) => tween.revert());
}
