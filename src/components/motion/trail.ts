import { ScrollTrigger } from "@/lib/gsap";

/*
 * The trail: a hairline in the right margin that is drawn as the page is read,
 * one knot for each chapter, placed where that chapter arrives under the
 * header. It is the ribbon's quiet companion: the ribbon tells the story in
 * each section, the trail says how much of it has been told. At Contact its
 * end closes into a small loop, filled by the last stretch of the page, the
 * way the ribbon closes its own loop beside the invitation.
 *
 * Position, not decoration: it follows the scroll directly (also with reduced
 * motion) and is hidden from assistive technology, since the header already
 * names the current section.
 */
export function setupTrail() {
  const trail = document.querySelector<HTMLElement>(".trail");
  const fill = trail?.querySelector<HTMLElement>(".trail-fill");
  const loop = trail?.querySelector<SVGCircleElement>(".trail-loop circle");
  if (!trail || !fill) return () => {};
  const knots = Array.from(trail.querySelectorAll<HTMLElement>(".trail-knot"));
  let marks: number[] = [];
  let closeFrom = 1;

  const place = () => {
    const max = Math.max(1, ScrollTrigger.maxScroll(window));
    const header = document.getElementById("site-header")?.offsetHeight ?? 0;
    marks = knots.map((knot) => {
      const section = knot.dataset.for ? document.getElementById(knot.dataset.for) : null;
      const at = section ? Math.min(1, Math.max(0, (section.getBoundingClientRect().top + window.scrollY - header) / max)) : 0;
      knot.style.top = `${at * 100}%`;
      return at;
    });
    // The loop closes over the last stretch: from Contact reaching the middle of the screen to the end of the page.
    const contact = document.getElementById("contact");
    closeFrom = contact ? Math.min(0.99, Math.max(0, (contact.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2) / max)) : 0.95;
  };

  const update = (progress: number) => {
    fill.style.transform = `scaleY(${progress})`;
    knots.forEach((knot, i) => knot.toggleAttribute("data-passed", progress >= marks[i] - 0.002));
    if (loop) {
      const closed = Math.min(1, Math.max(0, (progress - closeFrom) / (1 - closeFrom)));
      loop.style.strokeDashoffset = String(1 - closed);
      trail.toggleAttribute("data-closed", closed > 0.995);
    }
  };

  const progress = ScrollTrigger.create({
    start: 0,
    end: "max",
    onRefresh: (self) => {
      place();
      update(self.progress);
    },
    onUpdate: (self) => update(self.progress),
  });
  // Over the ultramarine field the trail turns light (and stays light to the very end).
  const tone = ScrollTrigger.create({
    trigger: "#contact",
    start: "top 50%",
    onEnter: () => trail.toggleAttribute("data-light", true),
    onLeaveBack: () => trail.toggleAttribute("data-light", false),
    // A strict boolean: toggleAttribute with `undefined` would flip the attribute instead of setting it.
    onRefresh: (self) => trail.toggleAttribute("data-light", self.progress > 0),
  });
  return () => {
    progress.kill();
    tone.kill();
  };
}
