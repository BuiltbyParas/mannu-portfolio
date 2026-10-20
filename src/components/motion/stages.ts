import { ScrollTrigger } from "@/lib/gsap";

/*
 * "How I learn": which stage is being read. A stage is current while its box
 * spans the middle of the screen, the same line the ribbon uses to decide which
 * form is on stage, so the words and the shape always change together.
 *
 * The section carries `data-step` (0–3); each stage carries `data-active` or
 * `data-done`. CSS does the rest: stage emphasis, the numbers, and on large
 * screens which still drawing the sticky box shows when the 3D scene is off.
 *
 * The rail joins the four numbers. Its ultramarine fill follows the scroll and
 * reaches each number exactly as that stage becomes current, so the line, the
 * numbers and the ribbon all move on one timing; scrolling back draws it back.
 * This is state, not decoration, so it also runs with reduced motion.
 */
export function setupStages() {
  const section = document.getElementById("how-i-learn");
  if (!section) return () => {};
  const stages = Array.from(section.querySelectorAll<HTMLElement>("[data-stage]"));
  const show = (current: number) => {
    section.dataset.step = String(current);
    stages.forEach((stage, i) => {
      stage.toggleAttribute("data-active", i === current);
      stage.toggleAttribute("data-done", i < current);
    });
  };
  show(0);
  const triggers = stages.map((stage, i) =>
    ScrollTrigger.create({
      trigger: stage,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) show(i);
      },
    }),
  );
  const rail = setupRail(section, stages);
  return () => {
    triggers.forEach((trigger) => trigger.kill());
    rail();
  };
}

function setupRail(section: HTMLElement, stages: HTMLElement[]) {
  const rail = section.querySelector<HTMLElement>(".learn-rail");
  const fill = rail?.querySelector<HTMLElement>(".learn-rail-fill");
  const nums = stages.map((stage) => stage.querySelector<HTMLElement>(".stage-num"));
  if (!rail || !fill || stages.length < 2 || nums.some((n) => !n)) return () => {};
  const track = rail.offsetParent as HTMLElement | null;
  // For each stage: the scroll position where it becomes current, and how far down the rail its number sits.
  let stops: { at: number; y: number }[] = [];
  let length = 0;

  const layout = () => {
    if (!track) return;
    const box = track.getBoundingClientRect();
    const centres = nums.map((n) => {
      const r = n!.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    length = centres[centres.length - 1].y - centres[0].y;
    rail.style.left = `${centres[0].x}px`;
    rail.style.top = `${centres[0].y}px`;
    rail.style.height = `${Math.max(0, length)}px`;
    stops = stages.map((stage, i) => ({
      at: stage.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
      y: centres[i].y - centres[0].y,
    }));
  };

  const update = () => {
    if (!stops.length || length <= 0) return;
    const y = window.scrollY;
    let drawn = 0;
    if (y >= stops[stops.length - 1].at) drawn = length;
    else {
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i],
          b = stops[i + 1];
        if (y < b.at) {
          drawn = y <= a.at ? a.y : a.y + ((b.y - a.y) * (y - a.at)) / Math.max(1, b.at - a.at);
          break;
        }
      }
    }
    fill.style.transform = `scaleY(${drawn / length})`;
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onRefresh: () => {
      layout();
      update();
    },
    onUpdate: update,
  });
  return () => trigger.kill();
}
