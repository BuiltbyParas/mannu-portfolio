/*
 * Small values the page hands to the ribbon without a render cycle: the
 * controller reads them on its own frame. Kept apart from the controller so
 * page code can set them before (or without) the 3D scene ever loading.
 */
export const threadSignals = {
  /** The foundation being hovered (0–3), whose turn of the coil lifts; -1 for none. */
  turn: -1,
  /**
   * How much of the ribbon has threaded in (0–1). The opening drives it, so the
   * ribbon's tip reaches each letter of the name as that letter rises
   * (motion/intro.ts); anything else leaves it whole.
   */
  reveal: 1,
  /** True once the 3D scene draws; the opening waits a moment for it (see THREAD_READY). */
  ready: false,
};

/** Dispatched on window when the 3D scene has drawn its first frame. */
export const THREAD_READY = "thread:ready";
