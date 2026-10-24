import { GLASS, halfHeightAt } from "./scenery.ts";

/*
 * The opening's world as a still (large screens), drawn on the server from the
 * same layout the 3D scene uses (scenery.ts): the opening's glass as seen from
 * the name. It stands in for the scene without JavaScript, without WebGL and
 * with reduced motion, so the opening keeps its composition either way.
 */

// A 16:10 view: (u, v) ∈ [-1, 1] spans it. The stage crops it to its own shape ("slice").
const W = 160;
const H = 100;
const f = (v: number) => Math.round(v * 100) / 100;

type Sphere = { u: number; v: number; r: number };

/** Clear glass as two gradients: a film toward the rim (powder, blush, a fine ultramarine edge) and a soft highlight up and to the left. */
function GlassSpheres({ id, spheres, className }: { id: string; spheres: Sphere[]; className?: string }) {
  return (
    <svg className={className} viewBox={`${-W} ${-H} ${W * 2} ${H * 2}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-body`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="0.62" stopColor="#eef1ff" stopOpacity="0.1" />
          <stop offset="0.84" stopColor="#c9d4ff" stopOpacity="0.3" />
          <stop offset="0.95" stopColor="#ffc6b8" stopOpacity="0.34" />
          <stop offset="1" stopColor="#5a72ee" stopOpacity="0.32" />
        </radialGradient>
        <radialGradient id={`${id}-ground`} cx="0.5" cy="0.9" r="0.6">
          <stop offset="0" stopColor="#c5cff5" stopOpacity="0.22" />
          <stop offset="1" stopColor="#c5cff5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-light`} cx="0.34" cy="0.27" r="0.2">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {spheres.map((s, i) => (
        <g key={i} transform={`translate(${f(s.u * W)} ${f(-s.v * H)})`}>
          <circle r={f(s.r)} fill={`url(#${id}-body)`} />
          <circle r={f(s.r)} fill={`url(#${id}-ground)`} />
          <circle r={f(s.r)} fill={`url(#${id}-light)`} />
        </g>
      ))}
    </svg>
  );
}

const OPENING_SPHERES: Sphere[] = GLASS.map((g) => ({ u: g.u, v: g.v, r: (g.r / halfHeightAt(g.z)) * H }));

/** The opening's glass as seen from the name. */
export function WorldSVG({ className }: { className?: string }) {
  return <GlassSpheres id="world-glass" spheres={OPENING_SPHERES} className={className} />;
}
