import { glide, halfHeightAt, viewToWorld, type Vec3 } from "../sculpture/scenery.ts";

/*
 * The landing's liquid glass (large screens; sections/Landing.tsx): its
 * composition and its motion, in one place. A few thick, soft forms of clear
 * glass float over a pale field lit by an ultramarine pool and a citron glow;
 * each bends the field behind it (scene.ts). The name sits in front of the
 * largest form, the tagline under it, the cue low in the middle.
 *
 * Everything is placed by its share of a 16:10 view, as the opening's world
 * is (sculpture/scenery.ts: u, v ∈ [-1, 1] across and up the view, at a world
 * depth z, with the camera the ribbon uses), so the composition holds on any
 * screen shape. Motion is given the same way, in shares of the half-height at
 * the form's own depth, so near and far forms drift by similar amounts.
 *
 * Pure (no three.js, no DOM): unit-tested, and the still that stands in for
 * the scene (GlassStill.tsx) is drawn from the same numbers.
 */

/**
 * A form of glass.
 *
 *   u, v, z   where it sits: across and up the view, and its world depth
 *   size      its radius as a share of the view's half-height at that depth
 *   squash    how it is stretched across, up and through (a pebble, a drop)
 *   tilt      how it leans (radians about the view axis)
 *   wobble    how far its surface swells and sinks, as a share of its radius
 *   ripple    how many swells run round it (the noise's frequency)
 *   flow      how quickly they move (per second)
 *   drift     how far it wanders across and up while the page is still
 *   period    the seconds each of those swings takes (unequal, so the path never closes)
 *   phase     where on that path it starts
 *   spin      its slow turn, rad/s (the swells and highlights move with it)
 *   tint      what the glass soaks up as it thickens (multiplied in, so pale)
 */
export type Form = {
  name: string;
  u: number;
  v: number;
  z: number;
  size: number;
  squash: Vec3;
  tilt: number;
  wobble: number;
  ripple: number;
  flow: number;
  drift: [number, number];
  period: [number, number];
  phase: number;
  spin: number;
  tint: string;
};

/**
 * The composition: one large form behind the name, a little right of and
 * above the middle, holding the ultramarine; a near drop cut by the lower-left
 * edge, holding the citron; a small pebble low on the right; a bead high on
 * the left and a seed high on the right, both far off. The band under the
 * header and the strip above the cue stay clear. The first entry is the large
 * one.
 */
export const FORMS: Form[] = [
  {
    name: "core",
    u: 0.15,
    v: 0.1,
    z: -2,
    size: 0.6,
    squash: [1.06, 0.95, 0.9],
    tilt: -0.22,
    wobble: 0.06,
    ripple: 0.85,
    flow: 0.11,
    drift: [0.022, 0.03],
    period: [21, 15.5],
    phase: 0.6,
    spin: 0.045,
    tint: "#C9D3FF",
  },
  {
    name: "drop",
    u: -0.86,
    v: -0.64,
    z: 3,
    size: 0.36,
    squash: [0.96, 1.06, 0.92],
    tilt: 0.35,
    wobble: 0.055,
    ripple: 0.95,
    flow: 0.13,
    drift: [0.03, 0.04],
    period: [17.5, 12.5],
    phase: 2.3,
    spin: -0.06,
    tint: "#E9F6B4",
  },
  {
    name: "pebble",
    u: 0.83,
    v: -0.42,
    z: 1,
    size: 0.15,
    squash: [1.12, 0.88, 0.95],
    tilt: -0.4,
    wobble: 0.045,
    ripple: 1.05,
    flow: 0.16,
    drift: [0.045, 0.06],
    period: [13.5, 11],
    phase: 4.1,
    spin: 0.08,
    tint: "#D5DEFF",
  },
  {
    name: "bead",
    u: -0.55,
    v: 0.58,
    z: -6,
    size: 0.075,
    squash: [1, 1, 1],
    tilt: 0,
    wobble: 0.035,
    ripple: 1.1,
    flow: 0.18,
    drift: [0.055, 0.06],
    period: [12, 14.5],
    phase: 1.2,
    spin: -0.1,
    tint: "#EEF7C8",
  },
  {
    name: "seed",
    u: 0.61,
    v: 0.64,
    z: -8,
    size: 0.042,
    squash: [1, 1, 1],
    tilt: 0,
    wobble: 0.03,
    ripple: 1.15,
    flow: 0.2,
    drift: [0.06, 0.05],
    period: [11, 16.5],
    phase: 5.3,
    spin: 0.12,
    tint: "#DCE4FF",
  },
];

/**
 * A field of colour on the landing's ground: a soft round pool at (u, v),
 * reaching `radius` (a share of the view's half-height), mixed in up to
 * `strength`, wandering by `drift` over `period` seconds. Drawn in order over
 * the base, so later fields lie on top.
 */
export type Field = { u: number; v: number; radius: number; color: string; strength: number; drift: number; period: number; phase: number };

/** The ground: pearl at the top, a cool pale floor, so the bottom edge meets the opening's sky below without a seam. */
export const BASE = { top: "#F1F4FB", middle: "#F8F8F5", bottom: "#EEF1F8" } as const;

export const FIELDS: Field[] = [
  // Powder high on the right and low on the left: the cool light the page sits in.
  { u: 0.95, v: 0.95, radius: 0.95, color: "#DCE7FF", strength: 0.75, drift: 0.04, period: 31, phase: 0.4 },
  // The ultramarine pool behind the large form, a little below it; the glass gathers it and turns it over.
  { u: 0.3, v: -0.08, radius: 0.85, color: "#8FA2FB", strength: 0.3, drift: 0.05, period: 26, phase: 2.1 },
  { u: 0.36, v: -0.3, radius: 0.4, color: "#4A68F6", strength: 0.2, drift: 0.04, period: 19, phase: 4.4 },
  // The citron glow low on the left, behind the near drop.
  { u: -0.88, v: -0.78, radius: 0.85, color: "#D6F36A", strength: 0.5, drift: 0.05, period: 23, phase: 1.3 },
  // A bright, soft source high in the middle, which the highlights answer and the name stands in.
  { u: -0.12, v: 0.42, radius: 0.85, color: "#FFFFFF", strength: 0.78, drift: 0.035, period: 29, phase: 3.6 },
];

/**
 * A band of light across the ground: a long, soft stroke through (u, v) at
 * `angle` (radians, from the horizontal), `width` wide (a share of the
 * half-height), swaying along its length by `curve` with `waves` swells across
 * the view, mixed in up to `strength`. Faint on the page, they give the glass
 * something to bend: through a form a band thickens, kinks and turns over.
 * Each drifts across itself by `drift` over `period` seconds, and its swells
 * travel along it.
 */
export type Band = {
  u: number;
  v: number;
  angle: number;
  width: number;
  curve: number;
  waves: number;
  color: string;
  strength: number;
  drift: number;
  period: number;
  phase: number;
};

export const BANDS: Band[] = [
  // Ultramarine, falling gently to the right through the large form.
  { u: 0.2, v: -0.02, angle: -0.42, width: 0.11, curve: 0.1, waves: 1.3, color: "#7F95FA", strength: 0.11, drift: 0.05, period: 24, phase: 0.8 },
  // Citron, rising to the right low on the page, through the near drop and under the tagline.
  { u: -0.35, v: -0.5, angle: 0.3, width: 0.14, curve: 0.08, waves: 1.1, color: "#D6F36A", strength: 0.17, drift: 0.05, period: 28, phase: 2.6 },
];

/** Where a band has drifted at time t: how far across itself (shares of the half-height), and how far its swells have travelled along it (radians). */
export function bandAt(band: Band, t: number): [number, number] {
  const w = (Math.PI * 2) / band.period;
  return [band.drift * Math.sin(t * w + band.phase), t * w * 0.6 + band.phase];
}

/** The time (seconds) the scene is frozen at where motion is reduced. */
export const STILL_T = 7.5;

/** How the forms settle into place when the scene first draws: each rises a little and swells into its size, one after another (0–1). */
export const arrivalAt = (i: number, t: number) => glide((t - i * 0.12) / 2.2);

/**
 * Where a form has wandered at time t, in world units across and up: two
 * unequal swings per axis, so the path is smooth, slow and never quite repeats,
 * and no two forms move together. Its depth stays put.
 */
export function driftAt(form: Form, t: number): [number, number] {
  const h = halfHeightAt(form.z);
  const [tx, ty] = form.period;
  const w = (Math.PI * 2) / tx;
  const z = (Math.PI * 2) / ty;
  const x = Math.sin(t * w + form.phase) + 0.35 * Math.sin(t * w * 1.83 + form.phase * 2.3);
  const y = Math.sin(t * z + form.phase * 1.4) + 0.3 * Math.sin(t * z * 2.11 + form.phase * 0.7);
  return [(form.drift[0] * h * x) / 1.35, (form.drift[1] * h * y) / 1.3];
}

/** A form's resting place in world units, for a view of the given aspect. */
export const placeOf = (form: Form, aspect: number): Vec3 => viewToWorld(form.u, form.v, form.z, aspect);

/** A form's radius in world units. */
export const radiusOf = (form: Form) => form.size * halfHeightAt(form.z);

/** Where a field's centre has wandered at time t, in shares of the view (u, v). */
export function fieldAt(field: Field, t: number): [number, number] {
  const w = (Math.PI * 2) / field.period;
  return [field.u + field.drift * Math.sin(t * w + field.phase), field.v + field.drift * 0.8 * Math.sin(t * w * 0.77 + field.phase * 1.9)];
}
