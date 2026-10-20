/*
 * Turns one or two forms into a drawable strip: a centre line, an orientation
 * frame at every sample, a width, a thickness and face colours. Blending two
 * forms happens here, in world space, staggered along the strip so a change of
 * state reads as the ribbon re-threading itself from one end to the other.
 *
 * Pure math with no three.js import, so the server can draw the SVG fallback
 * from exactly the same numbers the WebGL scene uses.
 */

import { endMask, pieceMask, pieceParam, widthOf, type FormSpec, type Vec3 } from "./forms.ts";

export type Placement = { center: Vec3; unit: number; aspect: number };

export type StripState = {
  a: FormSpec;
  b: FormSpec;
  /** 0 = form a, 1 = form b. */
  t: number;
  pa: Placement;
  pb: Placement;
  /** Draw-in progress for the opening: 0 hides the whole strip, 1 shows all of it. */
  reveal: number;
  /**
   * Pointer ripple: samples near (x, y) (world units, z = 0 plane) turn on their own axis by up
   * to `amount` radians, fading out over `radius`. Used by the certificate ledger.
   */
  ripple?: { x: number; y: number; radius: number; amount: number };
  /**
   * Emphasis: the stretch [from, to] of the strip swells away from the vertical axis through the
   * centre by up to `amount` (a share of its distance). Used to lift one turn of the coil.
   */
  emphasis?: { from: number; to: number; amount: number };
};

export type Strip = {
  n: number;
  closed: boolean;
  /** Positions relative to `center`. */
  center: Vec3;
  pos: Float32Array;
  /** Face normal (thickness direction) and binormal (width direction). */
  nrm: Float32Array;
  bin: Float32Array;
  width: Float32Array;
  thick: Float32Array;
  /** Linear-light RGB per sample. */
  top: Float32Array;
  bottom: Float32Array;
  edge: Float32Array;
};

export function createStrip(n: number): Strip {
  return {
    n,
    closed: false,
    center: [0, 0, 0],
    pos: new Float32Array(n * 3),
    nrm: new Float32Array(n * 3),
    bin: new Float32Array(n * 3),
    width: new Float32Array(n),
    thick: new Float32Array(n),
    top: new Float32Array(n * 3),
    bottom: new Float32Array(n * 3),
    edge: new Float32Array(n * 3),
  };
}

/* ── colour ─────────────────────────────────────────────────────────── */

const linearCache = new Map<string, Vec3>();
export function hexToLinear(hex: string): Vec3 {
  const hit = linearCache.get(hex);
  if (hit) return hit;
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as Vec3;
  linearCache.set(hex, lin);
  return lin;
}

export function linearToHex([r, g, b]: Vec3) {
  const enc = (v: number) => {
    const s = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, s)) * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${enc(r)}${enc(g)}${enc(b)}`;
}

/* ── helpers ────────────────────────────────────────────────────────── */

const smooth = (v: number) => {
  const x = Math.min(1, Math.max(0, v));
  return x * x * (3 - 2 * x);
};
const STAGGER = 0.38;

/** 1 inside [from, to], easing to 0 over `soft` on either side. */
export function windowMask(s: number, from: number, to: number, soft: number) {
  return smooth((s - from + soft) / soft) * smooth((to + soft - s) / soft);
}

function faceColor(form: FormSpec, s: number, face: "top" | "bottom"): Vec3 {
  if (form.accent && s >= form.accent.from && s <= form.accent.to) return hexToLinear(form.accent.color);
  return hexToLinear(face === "top" ? form.top : form.bottom);
}

// Scratch buffers reused between frames (sized on demand).
// `s` is kept in double precision: the ledger's cuts sit exactly on samples.
let scratch = { n: 0, T: new Float32Array(0), N: new Float32Array(0), blend: new Float32Array(0), s: new Float64Array(0) };
function scratchFor(n: number) {
  if (scratch.n !== n) {
    scratch = { n, T: new Float32Array(n * 3), N: new Float32Array(n * 3), blend: new Float32Array(n), s: new Float64Array(n) };
  }
  return scratch;
}

function normalize(v: Float32Array, i: number) {
  const x = v[i],
    y = v[i + 1],
    z = v[i + 2];
  const l = Math.hypot(x, y, z);
  if (l < 1e-9) return 0;
  v[i] = x / l;
  v[i + 1] = y / l;
  v[i + 2] = z / l;
  return l;
}

/* ── main ───────────────────────────────────────────────────────────── */

export function computeStrip(state: StripState, out: Strip) {
  const { a, b, pa, pb, reveal, ripple, emphasis } = state;
  const t = Math.min(1, Math.max(0, state.t));
  const n = out.n;
  const { T, N, blend, s: S } = scratchFor(n);
  const closedness = a.closed === b.closed ? (a.closed ? 1 : 0) : a.closed ? 1 - t : t;
  // How far apart along the strip the change travels: the arriving form decides.
  const stagger = b.stagger ?? STAGGER;
  const closed = closedness > 0.5;
  out.closed = closedness > 0.98;

  // Centre of the blended placement: geometry is stored relative to it.
  const c: Vec3 = [
    pa.center[0] + (pb.center[0] - pa.center[0]) * t,
    pa.center[1] + (pb.center[1] - pa.center[1]) * t,
    pa.center[2] + (pb.center[2] - pa.center[2]) * t,
  ];
  out.center = c;

  // 1. Positions (world space, relative to c) with a staggered blend.
  let length = 0;
  let avgWidth = 0;
  for (let i = 0; i < n; i++) {
    const s = i / (n - 1);
    S[i] = s;
    const w = t <= 0 ? 0 : t >= 1 ? 1 : smooth(t * (1 + stagger) - stagger * s);
    blend[i] = w;
    const p = a.point(pieceParam(s, a.pieces, a.gap), pa.aspect);
    const q = w > 0 ? b.point(pieceParam(s, b.pieces, b.gap), pb.aspect) : p;
    const ax = pa.center[0] + p[0] * pa.unit,
      ay = pa.center[1] + p[1] * pa.unit,
      az = pa.center[2] + p[2] * pa.unit;
    const bx = pb.center[0] + q[0] * pb.unit,
      by = pb.center[1] + q[1] * pb.unit,
      bz = pb.center[2] + q[2] * pb.unit;
    const k = i * 3;
    out.pos[k] = ax + (bx - ax) * w - c[0];
    out.pos[k + 1] = ay + (by - ay) * w - c[1];
    out.pos[k + 2] = az + (bz - az) * w - c[2];
    if (emphasis && emphasis.amount > 0) {
      const swell = 1 + emphasis.amount * windowMask(s, emphasis.from, emphasis.to, 0.04);
      out.pos[k] *= swell;
      out.pos[k + 2] *= swell;
    }
    const wa = widthOf(a, pa.aspect) * pa.unit,
      wb = widthOf(b, pb.aspect) * pb.unit;
    out.width[i] = wa + (wb - wa) * w;
    avgWidth += out.width[i];
    if (i > 0) length += Math.hypot(out.pos[k] - out.pos[k - 3], out.pos[k + 1] - out.pos[k - 2], out.pos[k + 2] - out.pos[k - 1]);
  }
  avgWidth /= n;
  const cap = length > 0 ? avgWidth / 2 / length : 0.02;

  // 2. Tangents.
  for (let i = 0; i < n; i++) {
    let i0 = i - 1,
      i1 = i + 1;
    if (closed) {
      // The last sample repeats the first, so wrap around it.
      if (i0 < 0) i0 = n - 2;
      if (i1 > n - 1) i1 = 1;
    } else {
      i0 = Math.max(0, i0);
      i1 = Math.min(n - 1, i1);
    }
    const k = i * 3;
    T[k] = out.pos[i1 * 3] - out.pos[i0 * 3];
    T[k + 1] = out.pos[i1 * 3 + 1] - out.pos[i0 * 3 + 1];
    T[k + 2] = out.pos[i1 * 3 + 2] - out.pos[i0 * 3 + 2];
    if (!normalize(T, k)) {
      T[k] = 1;
      T[k + 1] = 0;
      T[k + 2] = 0;
    }
  }

  // 3. Parallel-transport frames, started facing the viewer (+z).
  const facingTo = (k: number, target: Float32Array, tk: number) => {
    const d = T[k + 2];
    target[tk] = -d * T[k];
    target[tk + 1] = -d * T[k + 1];
    target[tk + 2] = 1 - d * T[k + 2];
    if (!normalize(target, tk)) {
      // The strip points straight at the viewer: fall back to "up".
      const e = T[k + 1];
      target[tk] = -e * T[k];
      target[tk + 1] = 1 - e * T[k + 1];
      target[tk + 2] = -e * T[k + 2];
      normalize(target, tk);
    }
  };
  facingTo(0, N, 0);
  for (let i = 1; i < n; i++) {
    const k = i * 3,
      p = k - 3;
    const d = N[p] * T[k] + N[p + 1] * T[k + 1] + N[p + 2] * T[k + 2];
    N[k] = N[p] - d * T[k];
    N[k + 1] = N[p + 1] - d * T[k + 1];
    N[k + 2] = N[p + 2] - d * T[k + 2];
    if (!normalize(N, k)) facingTo(k, N, k);
  }
  if (closed) {
    // Spread the transport's mismatch at the seam evenly along the loop.
    const e = (n - 1) * 3;
    const cx = N[e + 1] * N[2] - N[e + 2] * N[1];
    const cy = N[e + 2] * N[0] - N[e] * N[2];
    const cz = N[e] * N[1] - N[e + 1] * N[0];
    const sin = cx * T[0] + cy * T[1] + cz * T[2];
    const cos = N[e] * N[0] + N[e + 1] * N[1] + N[e + 2] * N[2];
    const mismatch = Math.atan2(sin, cos);
    for (let i = 1; i < n; i++) rotateAround(N, T, i * 3, (mismatch * i) / (n - 1));
  }

  // 4. Facing blend, twist, widths and colours.
  const tmp = new Float32Array(3);
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    const s = S[i];
    const w = blend[i];
    // Turning to face the viewer happens early in a change, turning away late,
    // so cut pieces travel as flat chips instead of tumbling.
    const wf = b.facing > a.facing ? smooth(w / 0.45) : b.facing < a.facing ? smooth((w - 0.55) / 0.45) : w;
    const facing = a.facing + (b.facing - a.facing) * wf;
    if (facing > 0) {
      facingTo(k, tmp, 0);
      let px = N[k],
        py = N[k + 1],
        pz = N[k + 2];
      if (px * tmp[0] + py * tmp[1] + pz * tmp[2] < 0) {
        px = -px;
        py = -py;
        pz = -pz;
      }
      N[k] = px + (tmp[0] - px) * facing;
      N[k + 1] = py + (tmp[1] - py) * facing;
      N[k + 2] = pz + (tmp[2] - pz) * facing;
      // Re-orthogonalise against the tangent.
      const d = N[k] * T[k] + N[k + 1] * T[k + 1] + N[k + 2] * T[k + 2];
      N[k] -= d * T[k];
      N[k + 1] -= d * T[k + 1];
      N[k + 2] -= d * T[k + 2];
      if (!normalize(N, k)) facingTo(k, N, k);
    }
    let twist = a.twist(s) + (b.twist(s) - a.twist(s)) * w;
    if (ripple && ripple.amount > 0) {
      const dx = out.pos[k] + c[0] - ripple.x;
      const dy = out.pos[k + 1] + c[1] - ripple.y;
      twist += ripple.amount * Math.exp(-(dx * dx + dy * dy) / (ripple.radius * ripple.radius));
    }
    rotateAround(N, T, k, twist);
    out.nrm[k] = N[k];
    out.nrm[k + 1] = N[k + 1];
    out.nrm[k + 2] = N[k + 2];
    // binormal = T × N
    out.bin[k] = T[k + 1] * N[k + 2] - T[k + 2] * N[k + 1];
    out.bin[k + 1] = T[k + 2] * N[k] - T[k] * N[k + 2];
    out.bin[k + 2] = T[k] * N[k + 1] - T[k + 1] * N[k];

    // A gap that is opening closes its width early; one that is closing waits
    // until the very end. Pieces separate first and then fly into place, so
    // the jumps between pieces never show as stretched strips.
    const cut =
      (pieceMask(s, a.pieces, a.gap) ? 1 : smooth((w - 0.65) / 0.35)) * (pieceMask(s, b.pieces, b.gap) ? 1 : 1 - smooth(w / 0.35));
    const ends = endMask(s, cap) * (1 - closedness) + closedness;
    const head = reveal >= 1 ? 1 : 1 - smooth((s - reveal * 1.08 + 0.08) / 0.08);
    const m = cut * ends * head;
    out.width[i] *= m;
    const ta = a.thickness * pa.unit,
      tb = b.thickness * pb.unit;
    out.thick[i] = (ta + (tb - ta) * w) * Math.min(1, m * 4);

    // Colours change over the middle of each sample's move, not across all of it, so two
    // colours never sit half-mixed for long (ultramarine into coral would pass through violet).
    const wc = smooth((w - 0.42) / 0.16);
    mix3(out.top, k, faceColor(a, s, "top"), faceColor(b, s, "top"), wc);
    mix3(out.bottom, k, faceColor(a, s, "bottom"), faceColor(b, s, "bottom"), wc);
    mix3(out.edge, k, hexToLinear(a.edge), hexToLinear(b.edge), wc);
  }
  // Invisible samples at a cut sit on the cut itself; give them the frame of
  // the visible sample beside them so the tiny end faces shade like the strip.
  for (let i = 0; i < n; i++) {
    if (out.width[i] > 0) continue;
    const j = i > 0 && out.width[i - 1] > 0 ? i - 1 : i < n - 1 && out.width[i + 1] > 0 ? i + 1 : -1;
    if (j < 0) continue;
    for (let c = 0; c < 3; c++) {
      out.nrm[i * 3 + c] = out.nrm[j * 3 + c];
      out.bin[i * 3 + c] = out.bin[j * 3 + c];
    }
  }
  return out;
}

function mix3(target: Float32Array, k: number, x: Vec3, y: Vec3, w: number) {
  target[k] = x[0] + (y[0] - x[0]) * w;
  target[k + 1] = x[1] + (y[1] - x[1]) * w;
  target[k + 2] = x[2] + (y[2] - x[2]) * w;
}

/** Rotates the vector at N[k] around the unit axis at T[k] (Rodrigues; N ⟂ T). */
function rotateAround(N: Float32Array, T: Float32Array, k: number, angle: number) {
  if (!angle) return;
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const nx = N[k],
    ny = N[k + 1],
    nz = N[k + 2];
  const tx = T[k],
    ty = T[k + 1],
    tz = T[k + 2];
  // T × N
  const cx = ty * nz - tz * ny,
    cy = tz * nx - tx * nz,
    cz = tx * ny - ty * nx;
  N[k] = nx * c + cx * s;
  N[k + 1] = ny * c + cy * s;
  N[k + 2] = nz * c + cz * s;
}
