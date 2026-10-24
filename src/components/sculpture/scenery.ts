/*
 * The opening on large screens: the name and its ribbon in a small world of
 * glass, and the short scroll that carries the visitor from it into the
 * introduction.
 *
 * The opening's stage (sections/Opening.tsx) holds still for a stretch of
 * scroll, one screen's worth (p ∈ [0, 1], OPENING), during which Curiosity
 * arrives. There is no rest first: the landing's name has already gone, and
 * the ribbon, carried off it as the stage rises (controller.ts, carried),
 * crosses the stage's sky from the start. The words
 * (motion/opening.ts), the ribbon (controller.ts), the world (world.ts) and
 * the sky behind them all read p, and this file holds its beats and the
 * world's layout, so all of them agree on when and where.
 *
 *   0.00–0.10  the opening's words step back: actions, tagline, the label,
 *              then the letters sink below their baseline one after another
 *   0.00–0.72  the view travels on and drifts right through the world
 *   0.00–0.60  the ribbon crosses the sky and gathers into its loops
 *   0.30–0.70  the introduction: its label, its heading line by line, the
 *              thread under "questions.", then the paragraphs in groups
 *   0.84–1.00  settled, while the next chapter's paper swells into the bottom
 *              of the stage; then the stage is released and the page moves on
 *
 * The world's glass carries the sense of travel here, so the passage's field
 * of points (passage.ts) stays for small screens, where the opening simply
 * scrolls into Curiosity.
 *
 * Pure (no three.js, no DOM), so the beats and the world are unit-tested and
 * the still fallbacks (WorldSVG.tsx) are drawn from the same numbers.
 */

export type Vec3 = [number, number, number];
export type Range = readonly [number, number];

export const OPENING = {
  exit: [0, 0.1],
  sky: [0, 0.6],
  flight: [0, 0.72],
  morph: [0, 0.6],
  mark: [0.3, 0.38],
  heading: [0.32, 0.5],
  em: [0.48, 0.58],
  copy: [0.42, 0.7],
  /** The paper of the next chapter swells up into the bottom of the stage, then flattens as the stage leaves. */
  rise: [0.84, 1],
  /** From here the header names the introduction instead of the opening. */
  chapter: 0.3,
  /** Where links to the introduction land: everything settled. */
  settled: 0.76,
} as const satisfies Record<string, Range | number>;

/** Camera, as the ribbon's renderer sets it (scene.ts). */
export const CAMERA_Z = 14;
export const FOV = 26;

const TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Share of a beat that has played at p (linear, clamped). */
export const span = (p: number, [a, b]: Range) => clamp01((p - a) / (b - a));

/** Smootherstep: starts and stops without a jolt, for anything that travels. */
export const glide = (x: number) => {
  const v = clamp01(x);
  return v * v * v * (v * (v * 6 - 15) + 10);
};

/** The ribbon's change from the opening's form into Curiosity's (strip.ts adds its own stagger). */
export const morphAt = (p: number) => glide(span(p, OPENING.morph));

/** How far the view has travelled through the world from the name. */
export const flightAt = (p: number) => glide(span(p, OPENING.flight));

/**
 * Where the world sits relative to its place at the name after travelling e:
 * it comes toward the viewer and slides left while turning a little, so the
 * view seems to move forward and drift right through it. World units.
 */
export function cameraAt(e: number) {
  const x = clamp01(e);
  return { x: -1.6 * x, y: -0.55 * x, z: 7.2 * x, yaw: -0.16 * x };
}

/** Half the view's height at a depth (world units), for placing things by their place on screen. */
export const halfHeightAt = (z: number) => (CAMERA_Z - z) * TAN;

/** A point given as (u, v) across the view at depth z (u, v ∈ [-1, 1] span the view) to world units. */
export function viewToWorld(u: number, v: number, z: number, aspect: number): Vec3 {
  const h = halfHeightAt(z);
  return [u * h * aspect, v * h, z];
}

/**
 * How visible something is at a distance d from the viewer: anything about to
 * pass the camera fades out first (no sudden pop), and the farthest things
 * thin into the sky.
 */
export function nearFade(d: number) {
  return clamp01((d - 2.2) / 3.2) * (1 - clamp01((d - 30) / 10));
}

/** How far out of focus glass is at a distance: only what is right in front of the viewer softens. */
export const softAt = (d: number) => glide((9 - d) / 4.5);

/* ── The opening's own glass ───────────────────────────────────────── */

/**
 * Glass: a few clear spheres at different depths, placed by where they sit on
 * a 16:10 view once the name is reached (u, v as in viewToWorld; z is the
 * world depth). One far and large in the sky to the right of the ribbon's loop
 * (it ends framing the introduction from above its writing), one small and
 * high on the left (it drifts out of the frame), and one close to the viewer
 * at the left edge, which the view passes on the first scroll.
 */
export type Glass = { u: number; v: number; z: number; r: number; tint: string };
export const GLASS: Glass[] = [
  { u: 0.5, v: 0.38, z: -5.5, r: 1.42, tint: "#F4F7FF" },
  { u: -0.6, v: 0.62, z: -1.5, r: 0.3, tint: "#FFF8F4" },
  { u: -0.98, v: 0.55, z: 6.4, r: 0.55, tint: "#F7FAFF" },
];
