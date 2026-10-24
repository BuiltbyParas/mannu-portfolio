import assert from "node:assert/strict";
import { test } from "node:test";

import { cameraAt, flightAt, glide, GLASS, morphAt, nearFade, OPENING, softAt, span, viewToWorld, type Range } from "./scenery.ts";

const rangesOf = (beats: Record<string, Range | number>) => Object.entries(beats).filter((entry): entry is [string, Range] => typeof entry[1] !== "number");

test("every beat of the opening is a forward range inside its stretch", () => {
  for (const [name, [a, b]] of rangesOf(OPENING)) {
    assert.ok(a >= 0 && b <= 1 && a < b, `${name} is [${a}, ${b}]`);
  }
  assert.ok(OPENING.chapter > 0 && OPENING.chapter < 1);
  assert.ok(OPENING.settled > 0 && OPENING.settled < 1);
});

test("the beats come in reading order: the name's words leave before Curiosity arrives, and links land once it has", () => {
  // Nothing of the introduction shows while the opening's words are still on stage.
  assert.ok(OPENING.exit[1] < OPENING.mark[0]);
  assert.ok(OPENING.mark[0] <= OPENING.heading[0]);
  // The paragraphs follow the statement; the thread is drawn once its lines are home.
  assert.ok(OPENING.copy[0] > OPENING.heading[0]);
  assert.ok(OPENING.em[0] >= OPENING.heading[1] - 0.05);
  // The ribbon has gathered before the writing finishes, and the header turns over inside the gap between the two sets of words.
  assert.ok(OPENING.morph[1] < OPENING.copy[1]);
  assert.ok(OPENING.chapter >= OPENING.exit[1] && OPENING.chapter <= OPENING.heading[1]);
  // "About" links land on the settled introduction, before the stage is released.
  assert.ok(OPENING.settled >= OPENING.copy[1] && OPENING.settled < 1);
});

test("progress curves are clamped, start at rest, end at rest and never turn back", () => {
  assert.equal(span(-1, [0.2, 0.4]), 0);
  assert.equal(span(2, [0.2, 0.4]), 1);
  assert.equal(glide(0), 0);
  assert.equal(glide(1), 1);
  for (const curve of [glide, morphAt, flightAt]) {
    let last = -Infinity;
    for (let i = 0; i <= 200; i++) {
      const v = curve(i / 200);
      assert.ok(v >= last - 1e-12 && v >= 0 && v <= 1, `${curve.name} at ${i / 200}`);
      last = v;
    }
  }
  assert.equal(morphAt(0), 0);
  assert.equal(morphAt(1), 1);
});

test("the view starts at the name and only moves while the flight plays", () => {
  assert.deepEqual(cameraAt(0), { x: -0, y: -0, z: 0, yaw: -0 });
  const end = cameraAt(flightAt(1));
  assert.ok(end.z > 4, "it travels forward");
  assert.deepEqual(cameraAt(flightAt(OPENING.flight[1] + 0.05)), end);
});

test("the world is placed by its share of the view, so it keeps its composition on any screen shape", () => {
  for (const g of GLASS) {
    const wide = viewToWorld(g.u, g.v, g.z, 16 / 9);
    const narrow = viewToWorld(g.u, g.v, g.z, 4 / 3);
    assert.equal(wide[1], narrow[1]);
    assert.ok(Math.abs(wide[0] / (16 / 9) - narrow[0] / (4 / 3)) < 1e-9);
  }
  // The near glass starts in view and fades before it could pass the lens; only what is close softens.
  assert.ok(nearFade(0.5) === 0 && nearFade(14) === 1);
  assert.ok(softAt(12) === 0 && softAt(3) === 1);
});
