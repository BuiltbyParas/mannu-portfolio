/*
 * Keeps the ribbon off the words. Every frame the scene draws, the text on
 * screen is reduced to one box per block (a heading, a paragraph, a button, a
 * course), padded a little, and the ribbon, its shadow and the passage points
 * fade out over a short soft edge as they come near one. Resting forms are laid
 * out clear of the words, so in practice this only acts in transit, when a
 * strip crossing to the next section would otherwise pass behind a heading:
 * the words stay clean and the ribbon reads as tucking under the page.
 *
 * Only `.content` (and the footer) count. The opening's name is not content:
 * the ribbon weaves through its letters on purpose (see Hero.tsx).
 *
 * The packing and the mask itself are pure (`packClearance`, `clearanceAt`)
 * and unit-tested; the shader in scene.ts evaluates the same expression.
 */

/** Most boxes the shader takes at once; a viewport rarely holds more than a dozen blocks. */
export const CLEAR_MAX = 24;

const ROOTS = "main .content, .site-footer";
const BLOCKS = ".button, p, h1, h2, h3, h4, li, figcaption, code, .stage-num";

export type Box = { left: number; top: number; right: number; bottom: number; pad: number };

type Block = { el: HTMLElement; button: boolean; pad: number; top: number; bottom: number };

const range = typeof document === "undefined" ? null : document.createRange();

/**
 * Writes the boxes (viewport CSS pixels, origin top-left) into `out` as
 * drawing-buffer rectangles [x0, y0, x1, y1] with the origin bottom-left, the
 * way gl_FragCoord sees them. Boxes entirely outside the view (plus `soft`) are
 * dropped; the nearest to the middle of the screen win when there are too many.
 */
export function packClearance(boxes: Box[], viewW: number, viewH: number, ratio: number, soft: number, out: Float32Array) {
  const visible = boxes.filter(
    (b) => b.right + b.pad + soft > 0 && b.left - b.pad - soft < viewW && b.bottom + b.pad + soft > 0 && b.top - b.pad - soft < viewH,
  );
  if (visible.length > CLEAR_MAX) {
    const mid = viewH / 2;
    visible.sort((a, b) => Math.abs((a.top + a.bottom) / 2 - mid) - Math.abs((b.top + b.bottom) / 2 - mid));
    visible.length = CLEAR_MAX;
  }
  visible.forEach((b, i) => {
    out[i * 4] = (b.left - b.pad) * ratio;
    out[i * 4 + 1] = (viewH - b.bottom - b.pad) * ratio;
    out[i * 4 + 2] = (b.right + b.pad) * ratio;
    out[i * 4 + 3] = (viewH - b.top + b.pad) * ratio;
  });
  return visible.length;
}

const smoothstep = (a: number, b: number, v: number) => {
  const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

/** How much of the ribbon shows at drawing-buffer pixel (x, y): 0 on a box, 1 at `soft` or more away. */
export function clearanceAt(x: number, y: number, rects: Float32Array, count: number, soft: number) {
  let m = 1;
  for (let i = 0; i < count; i++) {
    const qx = Math.max(rects[i * 4] - x, x - rects[i * 4 + 2]);
    const qy = Math.max(rects[i * 4 + 1] - y, y - rects[i * 4 + 3]);
    const d = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
    m *= smoothstep(0, soft, d);
  }
  return m;
}

/** The same mask in GLSL, for scene.ts. */
export const CLEARANCE_GLSL = /* glsl */ `
  #define CLEAR_MAX ${CLEAR_MAX}
  uniform vec4 uClear[CLEAR_MAX];
  uniform int uClearCount;
  uniform float uClearSoft;
  float clearance(vec2 p) {
    float m = 1.0;
    for (int i = 0; i < CLEAR_MAX; i++) {
      if (i >= uClearCount) break;
      vec4 r = uClear[i];
      vec2 q = max(r.xy - p, p - r.zw);
      float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      m *= smoothstep(0.0, uClearSoft, d);
    }
    return m;
  }
`;

/** Finds the text blocks once per layout check and reads their live boxes on each drawn frame. */
export function createClearance() {
  let blocks: Block[] = [];
  const boxes: Box[] = [];

  function measure() {
    const scrollY = window.scrollY;
    const seen = new Set<HTMLElement>();
    blocks = [];
    for (const root of Array.from(document.querySelectorAll<HTMLElement>(ROOTS))) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!parent || !node.textContent?.trim() || parent.closest(".sr-only")) continue;
        const el = parent.closest<HTMLElement>(BLOCKS);
        const block = el && root.contains(el) ? el : parent;
        if (seen.has(block)) continue;
        seen.add(block);
        const r = block.getBoundingClientRect();
        const size = parseFloat(getComputedStyle(block).fontSize) || 16;
        // Large type gets a little more room than body text.
        blocks.push({ el: block, button: block.matches(".button"), pad: Math.min(16, Math.max(5, size * 0.14)), top: r.top + scrollY, bottom: r.bottom + scrollY });
      }
    }
  }

  /** The blocks' current boxes (transforms included, so rising headings are followed). */
  function read(viewH: number, margin: number) {
    boxes.length = 0;
    const scrollY = window.scrollY;
    for (const block of blocks) {
      // Cheap cull on the cached page position first; generous, since layout may have moved a little.
      if (block.bottom - scrollY < -margin - viewH * 0.25 || block.top - scrollY > viewH + margin + viewH * 0.25) continue;
      if (!block.el.isConnected) continue;
      if (block.button) {
        const r = block.el.getBoundingClientRect();
        if (r.width > 0) boxes.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, pad: block.pad });
        continue;
      }
      // The words' own extent, not the block's (a paragraph's box can run the full column).
      let left = Infinity,
        top = Infinity,
        right = -Infinity,
        bottom = -Infinity;
      const walker = document.createTreeWalker(block.el, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim()) continue;
        range!.selectNodeContents(node);
        for (const r of Array.from(range!.getClientRects())) {
          if (r.width < 1) continue;
          left = Math.min(left, r.left);
          top = Math.min(top, r.top);
          right = Math.max(right, r.right);
          bottom = Math.max(bottom, r.bottom);
        }
      }
      if (right > left) boxes.push({ left, top, right, bottom, pad: block.pad });
    }
    return boxes;
  }

  return { measure, read };
}
