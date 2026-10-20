import { gsap } from "@/lib/gsap";
import { CLEAR_MAX, createClearance, packClearance } from "./clearance";
import { FORMS, type FormId } from "./forms";
import type { RibbonScene } from "./scene";
import { threadSignals } from "./signals";
import { computeStrip, createStrip, type Placement } from "./strip";

/*
 * Drives the ribbon from the page. Each section marks a slot with
 * `data-sculpture="<form>"`. While a section is on stage the ribbon rests in
 * its slot (and scrolls with it); between sections it glides to the next slot
 * and re-threads itself into the next form. Progress is damped so fast scrolls
 * still read as one continuous movement. Renders only when something changed.
 *
 * A slot may name a different element as its box (`data-sculpture-box="id"`):
 * the slot element then only decides *when* its form is on stage (its centre on
 * the reading line), while the box decides *where* it is drawn. "How I learn"
 * uses this on large screens: four stages share one sticky box, so the ribbon
 * stays put and transforms in place while the stages scroll past.
 *
 * Wherever it is, the ribbon is never drawn over the words: each frame passes
 * the boxes of the text on screen to the scene as a clearance mask
 * (clearance.ts), which matters in transit, when a strip crossing to the next
 * slot would otherwise run behind a heading.
 */

type Slot = {
  form: FormId;
  el: HTMLElement;
  box: HTMLElement | null;
  top: number;
  left: number;
  width: number;
  height: number;
  rest: number;
};

const HOLD_START = 0.22;
const HOLD_END = 0.78;
const TAU = Math.PI * 2;
const smoothstep = (a: number, b: number, v: number) => {
  const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function createController(scene: RibbonScene, canvas: HTMLCanvasElement, opts: { samples: number; maxPixelRatio: number }) {
  const strip = createStrip(opts.samples);
  let slots: Slot[] = [];
  let width = 0;
  let height = 0;
  let progress = 0;
  let passage = 0;
  let drift = 0;
  let velocity = 0;
  let emphasis = 0;
  let emphasisTurn = 0;
  let rippleAmount = 0;
  let measuredAt = -1;
  let layout = "";
  let dirty = true;
  let lastScroll = -1;
  let previousScroll = window.scrollY;
  let time = 0;
  // Wall-clock seconds (GSAP's ticker time). `time` above is clamped per frame for smooth motion,
  // so on a slow device it runs behind; idling is decided on the real clock instead.
  let clock = 0;
  let lastActivity = 0;
  let frame = 0;
  const pointer = { x: 0, y: 0, px: -1, py: -1, inside: false };
  const rotation: [number, number, number] = [0, 0, 0];
  const drawn: [number, number, number] = [0, 0, 0];
  const signals = { flourish: 0 };
  let flourished = false;
  let flourishTween: gsap.core.Tween | null = null;
  let drawnReveal = -1;
  let activeForm: FormId | null = null;
  // Live box positions, read at most once per frame.
  const boxRects = new Map<HTMLElement, DOMRect>();
  const clearance = createClearance();
  const cleared = new Float32Array(CLEAR_MAX * 4);

  function measure() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
    slots = Array.from(document.querySelectorAll<HTMLElement>("[data-sculpture]"))
      .filter((el) => el.offsetParent !== null || el.getClientRects().length > 0)
      .map((el) => {
        const r = el.getBoundingClientRect();
        const box = el.dataset.sculptureBox ? document.getElementById(el.dataset.sculptureBox) : null;
        const b = box ? box.getBoundingClientRect() : r;
        return {
          form: el.dataset.sculpture as FormId,
          el,
          box,
          top: r.top + scrollY,
          left: b.left,
          width: b.width,
          height: b.height,
          // Anchored slots rest when their own centre crosses the middle of the screen.
          rest: r.top + scrollY + r.height / 2 - height / 2,
        };
      })
      .filter((s) => s.form in FORMS && s.width > 0 && s.height > 0)
      .sort((a, b) => a.top - b.top);
    let previous = -Infinity;
    for (const slot of slots) {
      const rest = clamp(slot.box ? slot.rest : slot.top + slot.height / 2 - height / 2, 0, maxScroll);
      slot.rest = Math.max(rest, previous + 1);
      previous = slot.rest;
    }
    clearance.measure();
    measuredAt = performance.now();
    // Redraw only when the layout actually moved, so the periodic check costs nothing at rest.
    const signature = slots.map((s) => `${s.form}${Math.round(s.rest)},${Math.round(s.left)},${Math.round(s.width)},${Math.round(s.height)}`).join("|");
    if (signature !== layout) dirty = true;
    layout = signature;
  }

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    scene.resize(width, height, Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio));
    measure();
    dirty = true;
  }

  function targetProgress(scrollY: number) {
    if (slots.length < 2) return 0;
    if (scrollY <= slots[0].rest) return 0;
    const last = slots.length - 1;
    if (scrollY >= slots[last].rest) return last;
    let k = 0;
    while (k < last - 1 && scrollY >= slots[k + 1].rest) k++;
    const t = (scrollY - slots[k].rest) / (slots[k + 1].rest - slots[k].rest);
    return k + smoothstep(HOLD_START, HOLD_END, t);
  }

  /** Linear progress from the opening's rest to Curiosity's: the passage through the point field. */
  function passageTarget(scrollY: number) {
    const from = slots.find((s) => s.form === "hero");
    const to = slots.find((s) => s.form === "curiosity");
    if (!from || !to || to.rest <= from.rest) return 0;
    return clamp((scrollY - from.rest) / (to.rest - from.rest), 0, 1);
  }

  function boxTop(slot: Slot, scrollY: number) {
    if (!slot.box) return slot.top - scrollY;
    let rect = boxRects.get(slot.box);
    if (!rect) {
      rect = slot.box.getBoundingClientRect();
      boxRects.set(slot.box, rect);
    }
    return rect.top;
  }

  function placement(slot: Slot, scrollY: number, shrink: number): Placement {
    const [x, y] = scene.toWorld(slot.left + slot.width / 2, boxTop(slot, scrollY) + slot.height / 2, width, height);
    const aspect = slot.width / slot.height;
    // Narrow boxes (tablet columns, phones) scale the form down instead of letting it spill.
    const fit = Math.min(1, aspect / FORMS[slot.form].minAspect) * shrink;
    return { center: [x, y, 0], unit: (slot.height / 2 / scene.pixelsPerUnit) * fit, aspect: aspect / fit };
  }

  function onPointer(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.px = event.clientX;
    pointer.py = event.clientY;
    pointer.inside = true;
    lastActivity = clock;
  }
  function onPointerLeave() {
    pointer.inside = false;
  }

  /** A one-time turn of the finished knot: the method has come together. It swells a little mid-turn and settles. */
  function flourish() {
    flourished = true;
    flourishTween = gsap.to(signals, {
      flourish: 1,
      duration: 1.9,
      ease: "power3.inOut",
      onComplete: () => {
        // A whole turn ends where it began, so dropping back to 0 is seamless.
        signals.flourish = 0;
      },
    });
  }

  function tick(now: number, deltaMs: number) {
    clock = now;
    if (!slots.length || document.hidden) return;
    const dt = Math.min(0.05, deltaMs / 1000);
    time += dt;
    boxRects.clear();
    const scrollY = window.scrollY;
    const target = targetProgress(scrollY);
    const before = progress;
    progress = Math.abs(target - progress) < 1e-4 ? target : damp(progress, target, 5.5, dt);
    const passageBefore = passage;
    const passageGoal = passageTarget(scrollY);
    passage = Math.abs(passageGoal - passage) < 1e-4 ? passageGoal : damp(passage, passageGoal, 5.5, dt);

    const last = slots.length - 1;
    const k = Math.min(Math.max(0, Math.floor(progress)), Math.max(0, last - 1));
    const t = last === 0 ? 0 : Math.min(1, progress - k);
    const A = slots[k];
    const B = slots[Math.min(last, k + 1)];
    const fa = FORMS[A.form];
    const fb = FORMS[B.form];

    if (scrollY !== lastScroll) lastActivity = clock;
    // The ambient sway settles a while after the visitor stops scrolling or
    // moving the pointer, so an idle tab stops drawing altogether.
    const awake = Math.min(1, Math.max(0, 1 - (clock - lastActivity - 10) / 2));
    const idle = (fa.idle + (fb.idle - fa.idle) * t) * awake;
    const lean = fa.pointer + (fb.pointer - fa.pointer) * t;
    // Scrolling fast tips the ribbon a little in the direction of travel.
    velocity = damp(velocity, (scrollY - previousScroll) / Math.max(dt, 1e-3) / Math.max(1, height), 4, dt);
    previousScroll = scrollY;
    const tilt = clamp(velocity * 0.05, -0.14, 0.14);
    // In transit the strip swings through space instead of sliding flat; alternate the direction.
    const swing = Math.sin(Math.PI * t) * 0.24 * (k % 2 ? -1 : 1);
    // Some forms turn as the page scrolls past them (the coil winds like a screw).
    const spin =
      ((fa.spin ?? 0) * (1 - t) * (scrollY - A.rest) + (fb.spin ?? 0) * t * (scrollY - B.rest)) / Math.max(1, height);
    const rx = pointer.y * lean * 0.6 + Math.sin(time * 0.37) * 0.05 * idle + tilt;
    const ry = pointer.x * lean + Math.sin(time * 0.5) * 0.12 * idle + swing + spin;
    const rz = Math.sin(time * 0.29) * 0.03 * idle + swing * 0.25;
    const r0 = rotation[0],
      r1 = rotation[1],
      r2 = rotation[2];
    rotation[0] = damp(r0, rx, 3, dt);
    rotation[1] = damp(r1, ry, 3, dt);
    rotation[2] = damp(r2, rz, 3, dt);
    const turning = Math.abs(rotation[0] - r0) + Math.abs(rotation[1] - r1) + Math.abs(rotation[2] - r2) > 1e-5;

    // Hovering a foundation lifts its turn of the coil; the pointer combs the certificate ledger.
    const coilWeight = (A.form === "foundations" ? 1 - t : 0) + (B.form === "foundations" ? t : 0);
    const turn = threadSignals.turn;
    if (turn >= 0) emphasisTurn = turn;
    const emphasisBefore = emphasis;
    emphasis = damp(emphasis, turn >= 0 ? coilWeight : 0, 7, dt);
    const rippleWeight = ((fa.ripple ?? 0) * (1 - t) + (fb.ripple ?? 0) * t) * (pointer.inside ? 1 : 0);
    const rippleBefore = rippleAmount;
    rippleAmount = damp(rippleAmount, rippleWeight, 5, dt);
    const shaping =
      Math.abs(emphasis - emphasisBefore) > 1e-4 || Math.abs(rippleAmount - rippleBefore) > 1e-4 || (rippleAmount > 0.01 && clock - lastActivity < 0.05);

    // The knot's one-time flourish, once the visitor has worked through every stage.
    const arrived = (A.form === "try" && B.form === "learn" && t > 0.97) || (A.form === "learn" && t < 0.03);
    if (!flourished && arrived && velocity >= 0) flourish();

    const flying = passage > 0.001 && passage < 0.999;
    if (flying && awake > 0) drift += dt * 0.35 * awake;

    // Layout can move under us (fonts, images, the archive toggle): re-measure now and then.
    if (performance.now() - measuredAt > 1500) measure();

    const reveal = threadSignals.reveal;
    const moving =
      dirty || progress !== before || passage !== passageBefore || scrollY !== lastScroll || reveal !== drawnReveal || signals.flourish > 0;
    if (!moving && !turning && !shaping && !(flying && awake > 0)) return;
    // Sway alone is slow: half the frame rate is plenty for it.
    frame++;
    if (!moving && !shaping && frame % 2) return;
    dirty = false;
    lastScroll = scrollY;

    // In transit between sections the strip draws in a little, so it crosses less of the page.
    const shrink = 1 - 0.14 * Math.sin(Math.PI * t);
    let ripple;
    if (rippleAmount > 0.002 && pointer.px >= 0) {
      const [x, y] = scene.toWorld(pointer.px, pointer.py, width, height);
      const ledger = fa.ripple ? A : B;
      ripple = { x, y, radius: 0.6 * (ledger.height / 2 / scene.pixelsPerUnit), amount: rippleAmount };
    }
    computeStrip(
      {
        a: fa,
        b: fb,
        t,
        pa: placement(A, scrollY, shrink),
        pb: placement(B, scrollY, shrink),
        reveal,
        ripple,
        emphasis: emphasis > 0.002 ? { from: emphasisTurn / 4, to: (emphasisTurn + 1) / 4, amount: 0.3 * emphasis } : undefined,
      },
      strip,
    );
    drawn[0] = rotation[0];
    drawn[1] = rotation[1] + signals.flourish * TAU;
    drawn[2] = rotation[2];
    drawnReveal = reveal;
    // Shadows belong to resting forms; in flight they would land far from the strip.
    scene.update(
      strip,
      drawn,
      (fa.shadow + (fb.shadow - fa.shadow) * t) * (1 - Math.sin(Math.PI * t)),
      1 + 0.05 * Math.sin(Math.PI * signals.flourish),
    );
    scene.updateDust(passage, drift, strip);
    // The fade around the words: a little wider on large screens.
    const soft = clamp(width * 0.016, 14, 26);
    const clearCount = packClearance(clearance.read(height, soft), width, height, scene.pixelRatio, soft, cleared);
    scene.setClearance(cleared, clearCount, soft);
    scene.render();

    const nearest = t < 0.5 ? A.form : B.form;
    if (nearest !== activeForm) {
      activeForm = nearest;
      document.documentElement.dataset.sculptureForm = nearest;
    }
    // Exposed for automated checks: which states are blending, how far, and how many text boxes the ribbon is kept off.
    const state = `${A.form}>${B.form}:${t.toFixed(2)}`;
    if (canvas.dataset.state !== state) canvas.dataset.state = state;
    if (canvas.dataset.clear !== String(clearCount)) canvas.dataset.clear = String(clearCount);
  }

  const observer = new ResizeObserver(() => measure());
  observer.observe(document.body);
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  resize();
  progress = targetProgress(window.scrollY);
  passage = passageTarget(window.scrollY);
  // Arriving below the learning stages (a restored scroll position) counts as having seen them.
  if (progress > slots.findIndex((s) => s.form === "learn") && slots.some((s) => s.form === "learn")) flourished = true;
  gsap.ticker.add(tick);

  // The opening threads the ribbon in through the name (threadSignals.reveal). If the scene
  // arrives after the opening has finished, thread it in on its own, quickly; further down
  // the page it is simply whole.
  let revealTween: gsap.core.Tween | null = null;
  if (window.scrollY < height * 0.5 && document.documentElement.classList.contains("intro-done")) {
    revealTween = gsap.fromTo(threadSignals, { reveal: 0 }, { reveal: 1, duration: 1.1, ease: "power3.inOut" });
  }

  return {
    measure,
    dispose() {
      revealTween?.kill();
      if (revealTween) threadSignals.reveal = 1;
      flourishTween?.kill();
      gsap.ticker.remove(tick);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      delete document.documentElement.dataset.sculptureForm;
    },
  };
}
