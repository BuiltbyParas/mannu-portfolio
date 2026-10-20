/*
 * The ribbon's states, one per place on the page.
 *
 * Every state is the same strip of material described as a pure function of
 * s ∈ [0, 1] (the distance along the strip). Coordinates are in units of half
 * the slot's height: y runs from -1 (bottom) to 1 (top) and x from -aspect to
 * aspect, so a form always fits the box it is given. The WebGL scene and the
 * static SVG fallback both read these definitions; nothing here imports three.
 */

import { approximateCertificateCount } from "../../content/site.ts";

export type Vec3 = [number, number, number];

export const FORM_IDS = [
  "hero",
  "curiosity",
  "understand",
  "break",
  "try",
  "learn",
  "foundations",
  "certificates",
  "experience",
  "contact",
] as const;

export type FormId = (typeof FORM_IDS)[number];

export type FormSpec = {
  id: FormId;
  point: (s: number, aspect: number) => Vec3;
  /** Rotation of the cross-section around the strip's direction, in radians. */
  twist: (s: number) => number;
  /** Ribbon width and thickness, in the same units as `point`. */
  width: number;
  thickness: number;
  /** Width for a given slot aspect when narrow slots need a slimmer strip (defaults to `width`). */
  widthAt?: (aspect: number) => number;
  /** The two ends meet (point(0) === point(1)); total twist is a multiple of 2π. */
  closed: boolean;
  /** Number of separate pieces the strip is cut into, and the share of each piece removed. */
  pieces: number;
  gap: number;
  /** 0: the strip turns freely in space; 1: its face keeps looking at the viewer. */
  facing: number;
  top: string;
  bottom: string;
  edge: string;
  /** A stretch of the strip painted in another colour (the piece that does not fit). */
  accent?: { from: number; to: number; color: string };
  /** Slow ambient sway and how far the strip leans toward the pointer. */
  idle: number;
  pointer: number;
  /** Strength of the soft shadow the strip casts on the page (desktop only). */
  shadow: number;
  /** Turn around the vertical axis per viewport of scroll away from the rest point, in radians. */
  spin?: number;
  /** How far marks near the pointer turn on their own axis, in radians. */
  ripple?: number;
  /** How sequential the change into this form is along the strip (0 all at once; default 0.38). */
  stagger?: number;
  /** Narrowest box (width ÷ height) the form fills; narrower boxes scale it down to fit. */
  minAspect: number;
};

export const ULTRA = "#3657F5";
export const CITRON = "#D6F36A";
export const CORAL = "#FF806B";
export const EDGE = "#F4F6FF";
export const WHITE = "#FFFFFF";

const TAU = Math.PI * 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function rotate([x, y, z]: Vec3, rx: number, ry: number, rz = 0): Vec3 {
  // X, then Y, then Z.
  let c = Math.cos(rx);
  let s = Math.sin(rx);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(ry);
  s = Math.sin(ry);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(rz);
  s = Math.sin(rz);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}

/** Deterministic jitter in [-1, 1] so the SVG and WebGL versions match. */
const jitter = (k: number) => {
  const v = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
};

/*
 * Possibility. The tail weaves along the name's centre line (the letters
 * alternate above and below the ribbon layer, so it passes over and under
 * them), then ties a loop above the final letter. On wide slots the slot is
 * the name itself; on narrow (phone) slots the name fills the lower half and
 * the loop gets the room above it.
 */
function hero(s: number, aspect: number): Vec3 {
  const nameShare = aspect > 3 ? 1 : 0.5;
  const half = nameShare; // the name's half height
  const yc = -1 + half; // the name's centre line
  const split = 0.66;
  if (s <= split) {
    const u = s / split;
    const env = (1 - u) * (1 - u) * 0.85 + 0.15 * Math.sin(Math.PI * u);
    const reach = aspect > 3 ? 0.8 : 0.6;
    const x = -aspect * 1.18 + u * aspect * (1.18 + reach);
    const y = yc + half * (0.02 + 0.44 * Math.sin(u * Math.PI * 3.1 + 0.5) * env);
    const z = 0.22 * Math.sin(u * Math.PI * 2.4);
    return [x, y, z];
  }
  // The loop starts where the tail ends, heading the same way, and rises.
  const end = hero(split, aspect);
  const v = (s - split) / (1 - split);
  const r = half * 0.6 + (1 - half) * 0.62;
  const theta = -Math.PI / 2 + v * TAU * 0.86;
  const cx = end[0];
  const cy = end[1] + r;
  return [cx + r * Math.cos(theta) * (1 + 0.18 * v), cy + r * Math.sin(theta), end[2] + 0.42 * Math.sin(Math.PI * v)];
}

/* Exploration: three loose loops travelling across the clearing, seen from different angles. */
function curiosity(s: number, aspect: number): Vec3 {
  const w = Math.min(aspect, 1.6);
  const loops = 2.6;
  const a = s * TAU * loops;
  const swell = 0.55 + 0.45 * Math.sin(Math.PI * s);
  const p: Vec3 = [-w * 0.86 + s * w * 1.72 + 0.32 * Math.sin(a) * swell, 0.62 * Math.cos(a) * swell - 0.1 + 0.18 * s, 0.55 * Math.sin(a) * swell];
  return rotate(p, 0.32, -0.38, 0.12);
}

/* Understand: an open ring, ends apart. Look at the whole problem first. */
function ring(s: number, open: number): Vec3 {
  const theta = Math.PI * 0.68 + s * TAU * (1 - open);
  return [0.8 * Math.cos(theta), 0.8 * Math.sin(theta), 0.1 * Math.sin(2 * theta)];
}

function understand(s: number): Vec3 {
  return rotate(ring(s, 0.12), -0.42, 0.3, 0);
}

/* Break it down: the same ring in four arcs, pulled apart. */
function breakDown(s: number): Vec3 {
  const k = Math.min(3, Math.floor(s * 4));
  const mid = (k + 0.5) / 4;
  const [mx, my] = ring(mid, 0.12);
  const len = Math.hypot(mx, my) || 1;
  const [x, y, z] = ring(s, 0.12);
  const push = 0.3;
  return rotate([x + (mx / len) * push, y + (my / len) * push, z + 0.18 * jitter(k)], -0.42, 0.3, 0);
}

/* Try a solution: the arcs joined as steps, each a tread and a riser; the third sits out of line. */
function attempt(s: number, aspect: number): Vec3 {
  const w = Math.min(aspect, 1.25) * 0.86;
  const k = Math.min(3, Math.floor(s * 4));
  const u = s * 4 - k;
  const dx = (w * 2) / 4.3;
  const dy = 0.42;
  const x0 = -w + k * dx;
  const y0 = -0.84 + k * dy;
  // Cubic from the start of the tread, round the corner, up the riser.
  const p0: [number, number] = [x0, y0];
  const p1: [number, number] = [x0 + dx * 0.92, y0];
  const p2: [number, number] = [x0 + dx, y0 + dy * 0.12];
  const p3: [number, number] = [x0 + dx, y0 + dy];
  const m = 1 - u;
  let x = m * m * m * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u * u * u * p3[0];
  let y = m * m * m * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u * u * u * p3[1];
  let z = 0.08 * Math.sin(Math.PI * u);
  if (k === 2) {
    x += 0.14;
    y -= 0.16;
    z += 0.24;
  }
  return rotate([x, y, z], 0.32, -0.42, 0);
}

/* Learn from the result: every piece joined into one smooth, closed knot. */
function learn(s: number): Vec3 {
  const t = s * TAU;
  const k = 0.27;
  const p: Vec3 = [k * (Math.sin(t) + 2 * Math.sin(2 * t)), k * (Math.cos(t) - 2 * Math.cos(2 * t)), k * -Math.sin(3 * t) * 1.3];
  return rotate(p, 0.35, 0.25, 0.2);
}

/* Foundations: a coil of four turns, one for each course of the wall. */
function coil(s: number): Vec3 {
  const theta = s * TAU * 4 + Math.PI * 0.5;
  const r = 0.66;
  const p: Vec3 = [r * Math.cos(theta), 0.74 - s * 1.48, r * Math.sin(theta)];
  return rotate(p, 0.3, 0, -0.06);
}

/* Certificates: one short mark for (about) every certificate, in five rows. */
const LEDGER_ROWS = 5;
export const LEDGER = {
  rows: LEDGER_ROWS,
  columns: Math.max(3, Math.ceil(Math.max(1, Math.round(approximateCertificateCount)) / LEDGER_ROWS)),
};
const MARKS = LEDGER.columns * LEDGER.rows;
/** How many marks the ledger draws (shown in the Certificates caption). */
export const LEDGER_MARKS = MARKS;
/** Samples along the strip: ten per ledger mark (plus the end), so the marks are cut cleanly. */
export const STRIP_SAMPLES = MARKS * 10 + 1;
// With STRIP_SAMPLES below, every mark's two cuts fall exactly on samples (gap × 10 / 2 = 2).
const LEDGER_GAP = 0.4;
function ledger(s: number, aspect: number): Vec3 {
  const k = Math.min(MARKS - 1, Math.floor(s * MARKS));
  const u = s * MARKS - k;
  const c = k % LEDGER.columns;
  const r = Math.floor(k / LEDGER.columns);
  const halfW = Math.min(aspect, 1.15) * 0.9;
  const dx = (halfW * 2) / (LEDGER.columns - 1);
  const dy = 1.66 / (LEDGER.rows - 1);
  const xc = -halfW + c * dx + (r % 2 ? dx * 0.22 : 0) - dx * 0.11;
  const yc = 0.83 - r * dy;
  const len = (dy * 0.74) / (1 - LEDGER_GAP);
  const dir = k % 2 ? -1 : 1;
  const lean = jitter(k) * 0.07;
  const along = (u - 0.5) * len * dir;
  return [xc + along * Math.sin(lean), yc + along * Math.cos(lean), 0];
}

/* Experience: one long strand running out toward the edge of the page. */
function strand(s: number, aspect: number): Vec3 {
  const x = -aspect * 0.92 + s * aspect * 2.3;
  const y = 0.05 + 0.34 * Math.sin(s * TAU * 0.85 + 0.6) * (1 - s * 0.7);
  return [x, y, 0.25 * Math.sin(Math.PI * s)];
}

/* Contact: resolution. A single closed loop with one full twist. */
function loop(s: number): Vec3 {
  const t = s * TAU;
  return rotate([0.8 * Math.cos(t), 0.74 * Math.sin(t), 0.12 * Math.sin(2 * t)], 0.55, -0.35, 0.2);
}

const base = { thickness: 0.035, closed: false, pieces: 1, gap: 0, edge: EDGE, top: ULTRA, bottom: CITRON, shadow: 0.09, minAspect: 1.3 };

export const FORMS: Record<FormId, FormSpec> = {
  hero: {
    ...base,
    id: "hero",
    minAspect: 0.5,
    shadow: 0,
    point: hero,
    twist: (s) => (s < 0.66 ? (s / 0.66) * TAU * 1.25 : TAU * 1.25 + ((s - 0.66) / 0.34) * Math.PI * 0.6),
    width: 0.26,
    // On phones the slot doubles upward, so the same width would read twice as heavy against the name.
    widthAt: (aspect) => (aspect > 3 ? 0.26 : 0.15),
    thickness: 0.05,
    facing: 1,
    idle: 0.5,
    pointer: 0.06,
  },
  curiosity: {
    ...base,
    id: "curiosity",
    minAspect: 1.35,
    shadow: 0.1,
    point: curiosity,
    twist: (s) => s * Math.PI,
    width: 0.2,
    facing: 0,
    idle: 1,
    pointer: 0.34,
  },
  understand: {
    ...base,
    id: "understand",
    point: (s) => understand(s),
    twist: (s) => s * Math.PI,
    width: 0.2,
    facing: 1,
    idle: 0.6,
    pointer: 0.16,
  },
  break: {
    ...base,
    id: "break",
    point: (s) => breakDown(s),
    twist: (s) => s * Math.PI,
    width: 0.2,
    pieces: 4,
    gap: 0.1,
    facing: 1,
    idle: 0.5,
    pointer: 0.16,
  },
  try: {
    ...base,
    id: "try",
    point: attempt,
    twist: (s) => (Math.floor(Math.min(s, 0.999) * 4) % 2 ? Math.PI : 0),
    width: 0.2,
    pieces: 4,
    gap: 0.05,
    facing: 1,
    accent: { from: 0.5, to: 0.75, color: CORAL },
    idle: 0.45,
    pointer: 0.16,
  },
  learn: {
    ...base,
    id: "learn",
    shadow: 0.09,
    point: (s) => learn(s),
    twist: (s) => s * TAU,
    width: 0.17,
    closed: true,
    facing: 0,
    idle: 0.8,
    pointer: 0.22,
  },
  foundations: {
    ...base,
    id: "foundations",
    minAspect: 1.0,
    shadow: 0.09,
    point: (s) => coil(s),
    twist: () => 0,
    width: 0.15,
    facing: 0,
    idle: 0.35,
    pointer: 0.12,
    spin: 0.9,
  },
  certificates: {
    ...base,
    id: "certificates",
    minAspect: 0.9,
    shadow: 0,
    point: ledger,
    twist: () => 0,
    width: 0.085,
    thickness: 0.02,
    pieces: MARKS,
    gap: LEDGER_GAP,
    // The marks arrive almost one at a time, like a tally being written.
    stagger: 0.85,
    facing: 1,
    idle: 0,
    // No sway, so the count reads still; the whole ledger only tips a little toward the pointer, for depth.
    pointer: 0.1,
    ripple: 1.3,
  },
  experience: {
    ...base,
    id: "experience",
    minAspect: 1.2,
    shadow: 0.07,
    point: strand,
    twist: (s) => s * Math.PI,
    width: 0.3,
    thickness: 0.05,
    facing: 1,
    idle: 0,
    pointer: 0.04,
  },
  contact: {
    ...base,
    id: "contact",
    minAspect: 1.12,
    shadow: 0.13,
    point: (s) => loop(s),
    twist: (s) => s * TAU,
    width: 0.2,
    closed: true,
    facing: 0,
    top: WHITE,
    bottom: CITRON,
    edge: "#DCE7FF",
    idle: 0.4,
    pointer: 0.14,
  },
};

/*
 * Cutting the strip into pieces. Samples that fall in a gap are pulled onto
 * the nearest cut of their own piece and given no width, so each piece ends in
 * a square cut and the jump to the next piece happens between two invisible
 * samples. (The ledger's sample count puts its cuts exactly on samples.)
 */
export function pieceParam(s: number, pieces: number, gap: number) {
  if (pieces <= 1 || gap <= 0) return s;
  const k = Math.min(pieces - 1, Math.floor(s * pieces));
  const u = s * pieces - k;
  const h = gap / 2;
  return (k + Math.min(1 - h, Math.max(h, u))) / pieces;
}

export function pieceMask(s: number, pieces: number, gap: number) {
  if (pieces <= 1 || gap <= 0) return 1;
  const u = s * pieces - Math.min(pieces - 1, Math.floor(s * pieces));
  const h = gap / 2;
  return u >= h - 1e-6 && u <= 1 - h + 1e-6 ? 1 : 0;
}

/** The width a form takes in a slot of the given aspect. */
export const widthOf = (form: FormSpec, aspect: number) => (form.widthAt ? form.widthAt(aspect) : form.width);

/** Rounded ends for an open strip: 0 at the tips, 1 once a half-width in. */
export function endMask(s: number, cap: number) {
  return Math.sqrt(clamp01(Math.min(s, 1 - s) / Math.max(cap, 1e-4)));
}
