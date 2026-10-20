/*
 * The passage between the opening and Curiosity: a short flight through a
 * pale field of fine points. As the visitor scrolls, a sparse few points
 * appear, then the whole field; it streams past faster and faster (near
 * points stretch into short streaks and blur out of focus, far ones stay fine
 * and sharp), then slows as the points spiral in onto the ribbon, come into
 * focus on it and are absorbed, the ribbon brightening a little as they land.
 * Everything is a pure function of the passage progress c ∈ [0, 1] and a fixed
 * seed, so scrolling back up plays the flight in reverse and the same scroll
 * position always draws the same frame.
 *
 * No three.js here, so the math is unit-tested on its own.
 */

/** Depth range the points travel through (world units; the camera sits at z = 14). */
export const DUST_FAR = -14;
export const DUST_NEAR = 9;
const RANGE = DUST_NEAR - DUST_FAR;
/** How far the field travels toward the viewer over the whole passage. */
export const DUST_TRAVEL = 15;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** Small deterministic generator (mulberry32) so every visit gets the same field. */
export function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type DustSeed = {
  count: number;
  /** Position across the view at the point's starting depth, in [-1.15, 1.15]. */
  u: Float32Array;
  v: Float32Array;
  /** Starting depth. */
  z: Float32Array;
  /** When the point starts gathering onto the ribbon, in [0, 1]. */
  order: Float32Array;
  /** When the point first appears, in [0, 1]: a sparse few early, most later. */
  emerge: Float32Array;
  /** Which way it spirals in as it gathers (±1). */
  spin: Float32Array;
  /** Where on the ribbon it lands, as a share of the strip's length. */
  along: Float32Array;
  /** Size in world units at z = 0. */
  size: Float32Array;
  /** sRGB colour. */
  color: Float32Array;
};

const PALETTE: [number, [number, number, number]][] = [
  [0.68, [0x36 / 255, 0x57 / 255, 0xf5 / 255]], // ultramarine
  [0.88, [0x8f / 255, 0xa6 / 255, 0xff / 255]], // ultramarine, lifted
  [0.97, [0xb9 / 255, 0xd4 / 255, 0x3a / 255]], // citron, deepened to read on paper
  [1.0, [0xff / 255, 0x80 / 255, 0x6b / 255]], // coral, rare
];

export function seedDust(count: number, seed = 7): DustSeed {
  const rand = seeded(seed);
  const out: DustSeed = {
    count,
    u: new Float32Array(count),
    v: new Float32Array(count),
    z: new Float32Array(count),
    order: new Float32Array(count),
    emerge: new Float32Array(count),
    spin: new Float32Array(count),
    along: new Float32Array(count),
    size: new Float32Array(count),
    color: new Float32Array(count * 3),
  };
  for (let i = 0; i < count; i++) {
    out.u[i] = (rand() * 2 - 1) * 1.15;
    out.v[i] = (rand() * 2 - 1) * 1.15;
    out.z[i] = DUST_FAR + rand() * RANGE;
    out.order[i] = rand();
    out.along[i] = (i + rand()) / count;
    // Mostly fine points, some larger beads, and a few big ones that blur into soft discs up close.
    out.size[i] = rand() < 0.06 ? 0.16 + 0.14 * rand() : 0.03 + 0.07 * rand() ** 3;
    const pick = rand();
    const [, rgb] = PALETTE.find(([edge]) => pick <= edge) ?? PALETTE[0];
    out.color.set(rgb, i * 3);
    // Squared, so only a few points come early and the field fills in after them.
    out.emerge[i] = rand() ** 2;
    out.spin[i] = rand() < 0.5 ? -1 : 1;
  }
  return out;
}

/** How far the field has travelled toward the viewer: it gathers speed, then slows as the points gather. */
export function travelAt(c: number) {
  const x = clamp01(c);
  return DUST_TRAVEL * (0.4 * x + 0.6 * x * x * (3 - 2 * x));
}

/** Speed of that travel, 0 at the rests and 1 at the fastest point (c = 0.5): how long the streaks are. */
export function streakAt(c: number) {
  const x = clamp01(c);
  const speed = 0.4 + 3.6 * x * (1 - x); // d(travel)/dc ÷ DUST_TRAVEL, 0.4 at the ends, 1.3 at the middle
  return clamp01((speed - 0.55) / 0.75) * passageOpacity(c);
}

/** A point's own arrival: points appear one by one over the first fifth of the passage. */
export function emergeWeight(c: number, emerge: number) {
  const start = 0.01 + 0.2 * emerge;
  return smooth(start, start + 0.07, c);
}

/** How far round its target a gathering point has still to spiral, in radians (0 once it lands). */
export function swirlAngle(g: number, spin: number) {
  return (1 - g) * (1 - g) * 1.9 * spin;
}

/** The ribbon's brief brightening as the field is absorbed into it (an emissive intensity). */
export function absorbGlow(c: number) {
  return 0.16 * smooth(0.66, 0.84, c) * (1 - smooth(0.88, 0.99, c));
}

/** Depth after travelling `travel` units toward the viewer, wrapped back to the far end. */
export function travelZ(z0: number, travel: number) {
  const d = (((z0 - DUST_FAR + travel) % RANGE) + RANGE) % RANGE;
  return DUST_FAR + d;
}

/** Points fade in at the far end and out just before they would pass the viewer. */
export function depthFade(z: number) {
  return smooth(DUST_FAR, DUST_FAR + 4, z) * (1 - smooth(DUST_NEAR - 3.5, DUST_NEAR, z));
}

/** How far a point has gathered onto the ribbon (0 free, 1 on the strip). */
export function gatherWeight(c: number, order: number) {
  const start = 0.46 + 0.3 * order;
  return smooth(start, start + 0.22, c);
}

/** Overall presence of the field: on at the first scroll (each point then arrives on its own), gone by the end. */
export function passageOpacity(c: number) {
  return smooth(0.004, 0.03, c) * (1 - smooth(0.9, 0.995, c));
}
