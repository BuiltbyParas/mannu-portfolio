import assert from "node:assert/strict";
import { test } from "node:test";

import { halfHeightAt } from "../sculpture/scenery.ts";
import { arrivalAt, driftAt, fieldAt, FIELDS, FORMS, placeOf, radiusOf, STILL_T } from "./layout.ts";

/** A form's box on a 16:10 view in shares of the view (u, v), drift included. */
function reach(form: (typeof FORMS)[number]) {
  const r = form.size * Math.max(...form.squash) * (1 + form.wobble);
  const rx = r / 1.6 + form.drift[0] / 1.6;
  const ry = r + form.drift[1];
  return { left: form.u - rx, right: form.u + rx, bottom: form.v - ry, top: form.v + ry };
}

test("one large form anchors the landing; the rest are clearly smaller and at other depths", () => {
  const [core, ...rest] = FORMS;
  assert.ok(rest.length >= 3);
  for (const form of rest) assert.ok(form.size < core.size * 0.65, `${form.name} is ${form.size}`);
  // Near, middle and far: something in front of the page plane and something well behind it.
  assert.ok(rest.some((f) => f.z > 1) && rest.some((f) => f.z < -4));
  assert.equal(new Set(FORMS.map((f) => f.z)).size, FORMS.length);
  // One form is cut by an edge of the view, for scale.
  assert.ok(FORMS.some((f) => reach(f).left < -1 || reach(f).bottom < -1));
});

test("the forms leave the header's band and the cue's strip clear", () => {
  for (const form of FORMS) {
    const box = reach(form);
    // The header: the top tenth of the view.
    assert.ok(box.top < 0.84, `${form.name} reaches ${box.top.toFixed(2)} into the header`);
    // The cue: low in the middle.
    const overCue = box.left < 0.14 && box.right > -0.14 && box.bottom < -0.68;
    assert.ok(!overCue, `${form.name} covers the cue`);
  }
});

test("forms drift smoothly within their reach, never dart, and never move together", () => {
  for (const form of FORMS) {
    const h = halfHeightAt(form.z);
    let moved = 0;
    let [px, py] = driftAt(form, 0);
    for (let t = 1 / 60; t <= 40; t += 1 / 60) {
      const [x, y] = driftAt(form, t);
      assert.ok(Math.abs(x) <= form.drift[0] * h + 1e-9 && Math.abs(y) <= form.drift[1] * h + 1e-9);
      // Slower than a twentieth of the view's half-height a second: a drift.
      const speed = Math.hypot(x - px, y - py) * 60;
      assert.ok(speed < h * 0.05, `${form.name} at ${speed.toFixed(3)} at ${t.toFixed(2)}s`);
      moved += Math.hypot(x - px, y - py);
      [px, py] = [x, y];
    }
    assert.ok(moved > h * 0.04, `${form.name} visibly moves`);
  }
  const paths = new Set(FORMS.map((f) => `${f.period[0]}:${f.period[1]}:${f.phase}`));
  assert.equal(paths.size, FORMS.length);
});

test("the surface swells gently and every form turns slowly", () => {
  for (const form of FORMS) {
    assert.ok(form.wobble > 0 && form.wobble <= 0.1, `${form.name} wobble ${form.wobble}`);
    assert.ok(form.flow > 0 && form.flow <= 0.25);
    assert.ok(Math.abs(form.spin) > 0 && Math.abs(form.spin) <= 0.15);
    assert.ok(form.period.every((p) => p >= 10 && p <= 25));
  }
});

test("the forms settle in one after another and are in place by the still's moment", () => {
  for (let i = 0; i < FORMS.length; i++) {
    assert.equal(arrivalAt(i, 0), 0);
    assert.equal(arrivalAt(i, STILL_T), 1);
  }
  assert.ok(arrivalAt(0, 1) > arrivalAt(1, 1));
});

test("the composition is placed by its share of the view, so it holds on any screen shape", () => {
  for (const form of FORMS) {
    const wide = placeOf(form, 16 / 9);
    const narrow = placeOf(form, 4 / 3);
    assert.equal(wide[1], narrow[1]);
    assert.ok(Math.abs(wide[0] / (16 / 9) - narrow[0] / (4 / 3)) < 1e-9);
    assert.ok(Math.abs(radiusOf(form) / halfHeightAt(form.z) - form.size) < 1e-12);
  }
});

test("the field's pools wander only a little and stay soft", () => {
  for (const field of FIELDS) {
    for (let t = 0; t <= 60; t += 0.5) {
      const [u, v] = fieldAt(field, t);
      assert.ok(Math.abs(u - field.u) <= field.drift + 1e-9 && Math.abs(v - field.v) <= field.drift + 1e-9);
    }
    assert.ok(field.strength > 0 && field.strength <= 0.8 && field.radius >= 0.3);
  }
});
