import { FORMS, STRIP_SAMPLES, type FormId, type Vec3 } from "./forms.ts";
import { computeStrip, createStrip, linearToHex, type Strip } from "./strip.ts";

/*
 * The still version of a ribbon state, drawn on the server from the same
 * form functions the WebGL scene uses. It is what visitors see without
 * JavaScript, without WebGL, or with reduced motion, and it holds each slot's
 * composition so no section depends on the 3D scene.
 */

/** Enough samples that every piece of the cut states keeps a clean outline. */
const samplesFor = (form: FormId) => (FORMS[form].pieces > 8 ? STRIP_SAMPLES : 150);
const RUN = 10; // segments per polygon: short enough for painter's sorting to hold
const LIGHT: Vec3 = (() => {
  const v: Vec3 = [-0.35, 0.55, 0.76];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

type Run = { d: string; fill: string; z: number };

function runs(strip: Strip): Run[] {
  const { n, pos, nrm, bin, width, top, bottom } = strip;
  const out: Run[] = [];
  const f = (v: number) => (Math.round(v * 1000) / 1000).toString();
  let i = 0;
  while (i < n - 1) {
    if (width[i] < 1e-4 && width[i + 1] < 1e-4) {
      i++;
      continue;
    }
    const k = i * 3;
    const face = nrm[k + 2] >= 0 ? 1 : -1;
    const left: string[] = [];
    const right: string[] = [];
    let z = 0;
    let count = 0;
    let lit = 0;
    let colour: Vec3 = [0, 0, 0];
    let j = i;
    const add = (q: number, include: boolean) => {
      const h = width[q / 3] / 2;
      left.push(`${f(pos[q] + bin[q] * h)} ${f(-(pos[q + 1] + bin[q + 1] * h))}`);
      right.push(`${f(pos[q] - bin[q] * h)} ${f(-(pos[q + 1] - bin[q + 1] * h))}`);
      if (!include) return;
      z += pos[q + 2];
      lit += Math.max(0, face * (nrm[q] * LIGHT[0] + nrm[q + 1] * LIGHT[1] + nrm[q + 2] * LIGHT[2]));
      const src = face > 0 ? top : bottom;
      colour = [colour[0] + src[q], colour[1] + src[q + 1], colour[2] + src[q + 2]];
      count++;
    };
    for (; j < n; j++) {
      const q = j * 3;
      if (j > i && (width[j] < 1e-4 || (nrm[q + 2] >= 0 ? 1 : -1) !== face || j - i > RUN)) break;
      add(q, true);
    }
    // Close the run on the next sample so neighbouring polygons share an edge (no seams).
    if (j < n && width[j] >= 1e-4) add(j * 3, false);
    const end = Math.min(j, n - 1);
    if (end > i && count > 1) {
      const shade = 0.78 + 0.3 * (lit / count);
      const fill = linearToHex([(colour[0] / count) * shade, (colour[1] / count) * shade, (colour[2] / count) * shade]);
      out.push({ d: `M${left.join("L")}L${right.reverse().join("L")}Z`, fill, z: z / count });
    }
    i = Math.max(i + 1, end);
  }
  return out.sort((p, q) => p.z - q.z);
}

type Props = { form: FormId; aspect: number; className?: string; "data-for"?: number };

export function RibbonSVG({ form, aspect, className, "data-for": dataFor }: Props) {
  const spec = FORMS[form];
  const fit = Math.min(1, aspect / spec.minAspect);
  const place = { center: [0, 0, 0] as Vec3, unit: fit, aspect: aspect / fit };
  const strip = computeStrip({ a: spec, b: spec, t: 0, pa: place, pb: place, reveal: 1 }, createStrip(samplesFor(form)));
  return (
    <svg
      className={className}
      data-for={dataFor}
      viewBox={`${-aspect} -1 ${aspect * 2} 2`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {runs(strip).map((run, i) => (
        <path key={i} d={run.d} fill={run.fill} stroke={run.fill} strokeWidth={0.008} strokeLinejoin="round" />
      ))}
    </svg>
  );
}
