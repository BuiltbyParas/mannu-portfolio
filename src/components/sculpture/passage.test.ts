import assert from "node:assert/strict";
import { test } from "node:test";

import {
  absorbGlow,
  depthFade,
  DUST_FAR,
  DUST_NEAR,
  DUST_TRAVEL,
  emergeWeight,
  gatherWeight,
  passageOpacity,
  seedDust,
  streakAt,
  swirlAngle,
  travelAt,
  travelZ,
} from "./passage.ts";

test("the field is the same on every visit and stays inside its depth range", () => {
  const a = seedDust(300);
  const b = seedDust(300);
  assert.deepEqual(Array.from(a.z), Array.from(b.z));
  for (const travel of [0, 3.3, 15, 40, -7]) {
    for (const z0 of a.z) {
      const z = travelZ(z0, travel);
      assert.ok(z >= DUST_FAR - 1e-9 && z < DUST_NEAR + 1e-9, `z ${z} for travel ${travel}`);
    }
  }
});

test("points fade at both ends of the depth range, so wrapping never pops", () => {
  assert.equal(depthFade(DUST_FAR), 0);
  assert.equal(depthFade(DUST_NEAR), 0);
  assert.ok(depthFade((DUST_FAR + DUST_NEAR) / 2) > 0.99);
});

test("the passage is empty at both rests and every point has gathered by the end", () => {
  assert.equal(passageOpacity(0), 0);
  assert.equal(passageOpacity(1), 0);
  assert.ok(passageOpacity(0.5) > 0.99);
  const seed = seedDust(500);
  for (const order of seed.order) {
    assert.equal(gatherWeight(0.3, order), 0, "nothing gathers early");
    assert.ok(gatherWeight(0.99, order) > 0.99, "everything has gathered by the end");
  }
});

test("scrolling back plays the passage in reverse: the same progress draws the same field", () => {
  const c = 0.62;
  const there = [travelZ(-3, c * 15), gatherWeight(c, 0.4), passageOpacity(c)];
  const back = [travelZ(-3, c * 15), gatherWeight(c, 0.4), passageOpacity(c)];
  assert.deepEqual(there, back);
});

test("the field arrives sparsely: a few points first, all of them within the first third", () => {
  const seed = seedDust(500);
  const early = Array.from(seed.emerge).filter((e) => emergeWeight(0.06, e) > 0.5).length;
  assert.ok(early > 0 && early < seed.count * 0.4, `${early} points out early`);
  for (const e of seed.emerge) {
    assert.equal(emergeWeight(0, e), 0);
    assert.ok(emergeWeight(0.3, e) > 0.99);
  }
});

test("the flight gathers speed and slows again, and only streaks while it is fast", () => {
  assert.equal(travelAt(0), 0);
  assert.ok(Math.abs(travelAt(1) - DUST_TRAVEL) < 1e-9);
  for (let c = 0; c < 1; c += 0.05) assert.ok(travelAt(c + 0.05) > travelAt(c), "always moving forward");
  assert.ok(travelAt(0.55) - travelAt(0.45) > travelAt(0.1) - travelAt(0), "fastest in the middle");
  assert.equal(streakAt(0), 0);
  assert.equal(streakAt(1), 0);
  assert.ok(streakAt(0.5) > 0.9);
});

test("gathering points land exactly on their target, and the ribbon's glow is gone at both rests", () => {
  assert.equal(Math.abs(swirlAngle(1, 1)), 0);
  assert.equal(Math.abs(swirlAngle(1, -1)), 0);
  assert.ok(Math.abs(swirlAngle(0, 1)) > 1);
  assert.equal(absorbGlow(0), 0);
  assert.equal(absorbGlow(1), 0);
  assert.ok(absorbGlow(0.86) > 0.1);
});
