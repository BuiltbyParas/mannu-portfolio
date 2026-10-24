import { BASE, FIELDS, FORMS, type Form } from "./layout.ts";

/*
 * The landing's liquid glass as a still, drawn on the server from the same
 * layout the scene uses (layout.ts): the field as soft pools of colour on its
 * pale base, and each form as tinted glass with its highlight, its fine
 * ultramarine edge and the light it gathers low on the far side. It is the
 * landing's picture wherever the scene does not run (no JavaScript, no
 * WebGL). Where the scene is about to run, only its field shows until the
 * scene fades in over it, so the forms arrive once, in the scene
 * (globals.css, `.landing-still-forms`).
 */

// A 16:10 view: (u, v) ∈ [-1, 1] spans it, a half-height is H. The landing crops it to its own shape ("slice").
const H = 100;
const W = 160;
const f = (v: number) => Math.round(v * 100) / 100;

/** The shader's falloff for a field (exp(-2.6 d²)) as gradient stops, out to where it has all but gone. */
const FALLOFF = [0, 0.25, 0.5, 0.75, 1].map((s) => ({ offset: s, weight: Math.exp(-2.6 * (s * 1.4) ** 2) }));

function Glass({ form, id }: { form: Form; id: string }) {
  const rx = form.size * H * form.squash[0];
  const ry = form.size * H * form.squash[1];
  return (
    <g transform={`translate(${f(form.u * W)} ${f(-form.v * H)}) rotate(${f((-form.tilt * 180) / Math.PI)})`}>
      <defs>
        <radialGradient id={`${id}-body`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={form.tint} stopOpacity="0.5" />
          <stop offset="0.7" stopColor={form.tint} stopOpacity="0.32" />
          <stop offset="0.9" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.975" stopColor="#4563f0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <ellipse rx={f(rx)} ry={f(ry)} fill={`url(#${id}-body)`} />
      <ellipse rx={f(rx)} ry={f(ry)} fill="url(#landing-still-gather)" />
      <ellipse rx={f(rx)} ry={f(ry)} fill="url(#landing-still-light)" />
    </g>
  );
}

export function GlassStill({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`${-W} ${-H} ${W * 2} ${H * 2}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="landing-still-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BASE.top} />
          <stop offset="0.45" stopColor={BASE.middle} />
          <stop offset="1" stopColor={BASE.bottom} />
        </linearGradient>
        {FIELDS.map((field, i) => (
          <radialGradient key={i} id={`landing-still-field-${i}`} cx="0.5" cy="0.5" r="0.5">
            {FALLOFF.map(({ offset, weight }) => (
              <stop key={offset} offset={offset} stopColor={field.color} stopOpacity={f(weight * field.strength)} />
            ))}
          </radialGradient>
        ))}
        <radialGradient id="landing-still-light" cx="0.32" cy="0.27" r="0.24">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="landing-still-gather" cx="0.66" cy="0.74" r="0.3">
          <stop offset="0" stopColor="#fbffe6" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fbffe6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-W * 2} y={-H} width={W * 4} height={H * 2} fill="url(#landing-still-base)" />
      {FIELDS.map((field, i) => (
        <circle key={i} cx={f(field.u * W)} cy={f(-field.v * H)} r={f(field.radius * H * 1.4)} fill={`url(#landing-still-field-${i})`} />
      ))}
      <g className="landing-still-forms">
        {FORMS.map((form) => (
          <Glass key={form.name} form={form} id={`landing-still-${form.name}`} />
        ))}
      </g>
    </svg>
  );
}
