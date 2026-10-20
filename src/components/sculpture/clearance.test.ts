import assert from "node:assert/strict";
import { test } from "node:test";

import { CLEAR_MAX, clearanceAt, packClearance, type Box } from "./clearance.ts";

const box = (left: number, top: number, right: number, bottom: number, pad = 0): Box => ({ left, top, right, bottom, pad });

test("boxes are flipped into drawing-buffer pixels, padded and scaled", () => {
  const out = new Float32Array(CLEAR_MAX * 4);
  const count = packClearance([box(100, 50, 300, 90, 10)], 800, 600, 2, 20, out);
  assert.equal(count, 1);
  // x0, y0 (bottom edge, measured from the bottom), x1, y1
  assert.deepEqual(Array.from(out.subarray(0, 4)), [180, 1000, 620, 1120]);
});

test("boxes off screen are dropped; too many keep the ones nearest the middle", () => {
  const out = new Float32Array(CLEAR_MAX * 4);
  assert.equal(packClearance([box(0, -400, 100, -200), box(0, 900, 100, 1000)], 800, 600, 1, 20, out), 0);
  const many = Array.from({ length: CLEAR_MAX + 6 }, (_, i) => box(0, i * 40, 100, i * 40 + 20));
  assert.equal(packClearance(many, 800, 2000, 1, 0, out), CLEAR_MAX);
  // The rows run from y = 0 to 1180, so the top six are the farthest from the middle (y = 1000).
  const kept = Array.from({ length: CLEAR_MAX }, (_, i) => 2000 - out[i * 4 + 3]);
  for (let i = 0; i < 6; i++) assert.ok(!kept.includes(i * 40), `row ${i} should have been dropped`);
  assert.ok(kept.includes(6 * 40));
});

test("nothing shows on a box, everything shows past the soft edge, and the fade is monotonic", () => {
  const rects = new Float32Array([100, 100, 200, 150]);
  assert.equal(clearanceAt(150, 120, rects, 1, 24), 0);
  assert.equal(clearanceAt(100, 120, rects, 1, 24), 0);
  assert.equal(clearanceAt(240, 120, rects, 1, 24), 1);
  let previous = 0;
  for (let x = 200; x <= 230; x += 2) {
    const m = clearanceAt(x, 120, rects, 1, 24);
    assert.ok(m >= previous, `fade dips at x = ${x}`);
    previous = m;
  }
  // Corners are rounded: off a corner the distance is diagonal (21 px here), not the larger axis (15 px).
  const corner = clearanceAt(215, 165, rects, 1, 24);
  assert.ok(corner > clearanceAt(215, 120, rects, 1, 24) && corner < 1);
  // With no boxes the ribbon is untouched.
  assert.equal(clearanceAt(150, 120, rects, 0, 24), 1);
});
