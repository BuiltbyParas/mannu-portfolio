import {
  Color,
  IcosahedronGeometry,
  LinearSRGBColorSpace,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three";
import { CAMERA_Z, FOV } from "../sculpture/scenery";
import { arrivalAt, BANDS, bandAt, BASE, driftAt, FIELDS, fieldAt, FORMS, placeOf, radiusOf } from "./layout";

/*
 * The landing's liquid glass (layout.ts for the composition and the motion).
 *
 * The ground is one full-view quad that paints the landing's field: a pale
 * base, two faint bands of light and soft pools of colour. Each form is a sphere whose surface swells
 * and sinks slowly (noise in the vertex shader, normals found from the
 * displaced surface), drawn opaque: instead of showing what is behind it, its
 * fragment shader works out the same field at the point the glass bends the
 * view to (a thick lens: magnified, turned over toward the rim, the three
 * colours bent by slightly different amounts), soaks up a little tint where
 * it is thick, and adds what glass reflects: a soft studio (a key light up and
 * to the left, a long softbox, a pale floor), a bright rim, the light it
 * gathers on the side away from the key, and a fine ultramarine edge so it
 * holds its shape on a pale page. No textures, no render targets, one draw
 * call per form. The caller decides when to render; nothing here runs a loop.
 */

export type GlassScene = ReturnType<typeof createGlassScene>;

const MAX_FIELDS = 8;
const MAX_BANDS = 4;
/** How strongly the glass bends the view, per unit of its radius on screen (past 1 the field turns over toward the rim). */
const LENS = 2.6;

/**
 * A colour exactly as written: the shaders mix and write page colours
 * directly (no lighting, no output conversion), so they are passed on
 * without three.js converting them to linear light first.
 */
const raw = (hex: string) => new Color().setStyle(hex, LinearSRGBColorSpace);

// The field, shared by the ground and the glass so the glass bends exactly what is around it.
const FIELD_GLSL = /* glsl */ `
  uniform vec2 uView;
  uniform vec3 uBaseTop;
  uniform vec3 uBaseMiddle;
  uniform vec3 uBaseBottom;
  uniform vec4 uFields[${MAX_FIELDS}];
  uniform vec3 uFieldColors[${MAX_FIELDS}];
  uniform int uFieldCount;
  uniform vec4 uBands[${MAX_BANDS}];
  uniform vec4 uBandWaves[${MAX_BANDS}];
  uniform vec3 uBandColors[${MAX_BANDS}];
  uniform int uBandCount;
  // A point of the view given as a share of it (0–1 each way), as the ground's quad and the screen have it.
  // Fields and bands are placed in half-heights from the middle (across, stretched by the aspect).
  // \`gather\` strengthens the bands: glass concentrates the light it bends, so through it they show more.
  vec3 field(vec2 uv, float gather) {
    float aspect = uView.x / uView.y;
    vec2 p = uv * 2.0 - 1.0;
    vec2 q = vec2(p.x * aspect, p.y);
    float y = clamp(uv.y, 0.0, 1.0);
    vec3 c = mix(uBaseBottom, uBaseMiddle, smoothstep(0.0, 0.55, y));
    c = mix(c, uBaseTop, smoothstep(0.55, 1.0, y));
    for (int i = 0; i < ${MAX_FIELDS}; i++) {
      if (i >= uFieldCount) break;
      vec4 f = uFields[i];
      vec2 d = vec2((p.x - f.x) * aspect, p.y - f.y) / f.z;
      float w = exp(-2.6 * dot(d, d)) * f.w;
      c = mix(c, uFieldColors[i], w);
    }
    for (int i = 0; i < ${MAX_BANDS}; i++) {
      if (i >= uBandCount) break;
      vec4 b = uBands[i];
      vec4 s = uBandWaves[i];
      vec2 along = vec2(cos(b.z), sin(b.z));
      vec2 d = q - vec2(b.x * aspect, b.y);
      float across = dot(d, vec2(-along.y, along.x)) - s.x * sin(dot(d, along) * s.y + s.z);
      c = mix(c, uBandColors[i], min(1.0, exp(-across * across / (s.w * s.w)) * b.w * gather));
    }
    return c;
  }
`;

const GROUND_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const GROUND_FRAGMENT = /* glsl */ `
  ${FIELD_GLSL}
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  void main() {
    vec3 c = field(vUv, 1.0);
    // A little grain, so the long gradients never band.
    c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(c, 1.0);
  }
`;

// Simplex noise (Ashima Arts / Stefan Gustavson, MIT), for the swell of the surface.
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

// The surface: a unit sphere pushed out and in along its normal by two octaves
// of slow noise. The normal is found from two nearby points on the displaced
// surface, so the light follows the swells.
const GLASS_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uWobble;
  uniform float uRipple;
  uniform float uFlow;
  varying vec3 vNormal;
  varying vec3 vView;
  ${NOISE_GLSL}
  vec3 swell(vec3 p) {
    vec3 q = p * uRipple + vec3(uSeed, uSeed * 0.7, -uSeed * 1.3);
    float t = uTime * uFlow;
    float n = snoise(q + vec3(0.0, t, t * 0.6)) + 0.18 * snoise(q * 1.7 - vec3(t * 0.8, 0.0, t));
    return p * (1.0 + uWobble * n);
  }
  void main() {
    vec3 n = normalize(position);
    vec3 a = normalize(abs(n.y) < 0.99 ? cross(n, vec3(0.0, 1.0, 0.0)) : cross(n, vec3(1.0, 0.0, 0.0)));
    vec3 b = cross(n, a);
    float e = 0.012;
    vec3 p = swell(n);
    vec3 pa = swell(normalize(n + a * e));
    vec3 pb = swell(normalize(n + b * e));
    vec3 normal = normalize(cross(pa - p, pb - p));
    if (dot(normal, n) < 0.0) normal = -normal;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const GLASS_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uTint;
  uniform float uLens;
  // How much more of the bands shows through the glass than on the page around it.
  const float GATHER = 3.2;
  ${FIELD_GLSL}
  varying vec3 vNormal;
  varying vec3 vView;

  // What the glass reflects: a pale room. Bright overhead; a cool mid-tone band
  // at the horizon and a paler floor below it (on a light page this is what
  // gives glass its edge); a faint citron bounce from below on the right. Its
  // lights: a sharp key up and to the left with a halo, a long softbox high
  // across, and a small rim light low on the right.
  vec3 studio(vec3 r, out float light) {
    vec3 sky = mix(vec3(0.88, 0.9, 0.97), vec3(1.0), smoothstep(0.05, 0.6, r.y));
    vec3 c = mix(vec3(0.58, 0.64, 0.84), sky, smoothstep(-0.1, 0.14, r.y));
    c = mix(vec3(0.86, 0.88, 0.95), c, smoothstep(-0.62, -0.24, r.y));
    float bounce = pow(max(dot(r, normalize(vec3(0.45, -0.75, 0.5))), 0.0), 5.0);
    c = mix(c, vec3(0.9, 0.97, 0.6), bounce * 0.6);
    vec3 key = normalize(vec3(-0.55 + 0.05 * sin(uTime * 0.11 + uSeed), 0.62, 0.56));
    float k = max(dot(r, key), 0.0);
    float spot = pow(k, 320.0) * 1.6 + pow(k, 22.0) * 0.14;
    float box = smoothstep(0.34, 0.46, r.y) * smoothstep(0.82, 0.66, r.y) * smoothstep(0.7, 0.3, abs(r.x + 0.12)) * smoothstep(0.0, 0.3, r.z);
    float rim = pow(max(dot(r, normalize(vec3(0.7, -0.35, 0.45))), 0.0), 90.0) * 0.7;
    light = clamp(spot + box * 0.95 + rim, 0.0, 1.0);
    return c;
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float facing = clamp(dot(n, v), 0.0, 1.0);
    float edge = 1.0 - facing;
    vec2 screen = gl_FragCoord.xy / uView;

    // Through the glass: the field where the view is bent to, each colour a little differently.
    // uLens is in shares of the view's height; across, the view is wider.
    vec3 bent = refract(-v, n, 1.0 / 1.48);
    vec2 shift = bent.xy * uLens * vec2(uView.y / uView.x, 1.0);
    vec3 through = vec3(
      field(screen + shift * 0.9, GATHER).r,
      field(screen + shift, GATHER).g,
      field(screen + shift * 1.12, GATHER).b
    );
    // Thick glass soaks up a little of its tint. Toward the rim the light inside turns back on
    // itself and the glass darkens in a ring; on the side away from the key it gathers.
    through *= mix(vec3(1.0), uTint, facing * 0.2);
    float ring = smoothstep(0.42, 0.78, edge) * (1.0 - smoothstep(0.86, 0.98, edge));
    through = mix(through, through * vec3(0.7, 0.76, 0.94), ring * 0.28);
    float gather = pow(max(dot(n, normalize(vec3(0.5, -0.55, 0.65))), 0.0), 4.0) * smoothstep(0.1, 0.5, facing);
    through = mix(through, vec3(1.0, 1.0, 0.9), gather * 0.6);

    // Off the glass.
    vec3 r = reflect(-v, n);
    float light;
    vec3 mirror = studio(r, light);
    float fresnel = 0.04 + 0.96 * pow(edge, 3.0);
    vec3 c = mix(through, mirror, fresnel * 0.9);
    c = mix(c, vec3(1.0), light);
    // A hair of white right at the rim.
    c = mix(c, vec3(1.0), smoothstep(0.97, 1.0, edge) * 0.45);
    gl_FragColor = vec4(c, 1.0);
  }
`;

/** Builds the scene on the canvas; throws if the browser cannot give it a WebGL 2 context. */
export function createGlassScene(canvas: HTMLCanvasElement, opts: { maxPixelRatio: number }) {
  // Asked for here, so a browser without WebGL 2 is a quiet fallback rather than three.js's console errors.
  const context = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
  if (!context) throw new Error("WebGL 2 is not available");
  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(raw(BASE.middle), 1);
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1.6, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);

  const fields = FIELDS.slice(0, MAX_FIELDS);
  const bands = BANDS.slice(0, MAX_BANDS);
  const fieldUniforms = {
    uView: { value: new Vector2(1, 1) },
    uBaseTop: { value: raw(BASE.top) },
    uBaseMiddle: { value: raw(BASE.middle) },
    uBaseBottom: { value: raw(BASE.bottom) },
    uFields: { value: Array.from({ length: MAX_FIELDS }, () => new Vector4()) },
    uFieldColors: { value: Array.from({ length: MAX_FIELDS }, (_, i) => raw(fields[i]?.color ?? "#ffffff")) },
    uFieldCount: { value: fields.length },
    uBands: { value: Array.from({ length: MAX_BANDS }, () => new Vector4()) },
    uBandWaves: { value: Array.from({ length: MAX_BANDS }, () => new Vector4()) },
    uBandColors: { value: Array.from({ length: MAX_BANDS }, (_, i) => raw(bands[i]?.color ?? "#ffffff")) },
    uBandCount: { value: bands.length },
  };
  const time = { value: 0 };

  const groundGeometry = new PlaneGeometry(2, 2);
  const groundMaterial = new ShaderMaterial({
    vertexShader: GROUND_VERTEX,
    fragmentShader: GROUND_FRAGMENT,
    uniforms: fieldUniforms,
    depthTest: false,
    depthWrite: false,
  });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.frustumCulled = false;
  ground.renderOrder = -1;
  scene.add(ground);

  const sphere = new IcosahedronGeometry(1, 40);
  const glass = FORMS.map((form, i) => {
    const material = new ShaderMaterial({
      vertexShader: GLASS_VERTEX,
      fragmentShader: GLASS_FRAGMENT,
      uniforms: {
        ...fieldUniforms,
        uTime: time,
        uSeed: { value: 1.7 + i * 2.9 },
        uWobble: { value: form.wobble },
        uRipple: { value: form.ripple },
        uFlow: { value: form.flow },
        uTint: { value: raw(form.tint) },
        // How far the lens bends the view, in shares of the view's height: in proportion to the
        // form's radius on screen (half of `size`), enough to turn the field over toward the rim.
        uLens: { value: LENS * form.size * 0.5 },
      },
    });
    const mesh = new Mesh(sphere, material);
    mesh.rotation.z = form.tilt;
    scene.add(mesh);
    return { form, mesh, material, base: new Vector3(), radius: radiusOf(form) };
  });

  let width = 1;
  let height = 1;

  function resize(w: number, h: number, pixelRatio: number) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setPixelRatio(Math.min(pixelRatio, opts.maxPixelRatio));
    renderer.setSize(width, height, false);
    const buffer = renderer.getDrawingBufferSize(new Vector2());
    fieldUniforms.uView.value.copy(buffer);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    for (const g of glass) g.base.fromArray(placeOf(g.form, camera.aspect));
  }

  /** Draws the scene as it is t seconds after it first appeared. */
  function render(t: number) {
    time.value = t;
    for (const [i, f] of fields.entries()) {
      const [u, v] = fieldAt(f, t);
      fieldUniforms.uFields.value[i].set(u, v, f.radius, f.strength);
    }
    for (const [i, b] of bands.entries()) {
      const [across, travel] = bandAt(b, t);
      // Drifting across itself moves the band's line along its normal.
      fieldUniforms.uBands.value[i].set(b.u - (Math.sin(b.angle) * across) / camera.aspect, b.v + Math.cos(b.angle) * across, b.angle, b.strength);
      fieldUniforms.uBandWaves.value[i].set(b.curve, b.waves, travel, b.width);
    }
    for (const [i, g] of glass.entries()) {
      const { form, mesh, base, radius } = g;
      const [dx, dy] = driftAt(form, t);
      const arrive = arrivalAt(i, t);
      // Each settles into place as the scene first appears: up a little, and swelling to its size.
      mesh.position.set(base.x + dx, base.y + dy - (1 - arrive) * radius * 0.35, base.z);
      const s = radius * (0.9 + 0.1 * arrive) * (1 + 0.012 * Math.sin(t * 0.4 + i * 1.9));
      mesh.scale.set(s * form.squash[0], s * form.squash[1], s * form.squash[2]);
      mesh.rotation.y = form.spin * t;
      mesh.rotation.x = 0.25 * Math.sin(t * form.spin * 0.7 + form.phase);
    }
    renderer.render(scene, camera);
  }

  function dispose() {
    groundGeometry.dispose();
    groundMaterial.dispose();
    sphere.dispose();
    for (const g of glass) g.material.dispose();
    renderer.dispose();
  }

  return { resize, render, dispose, get width() { return width; }, get height() { return height; } };
}
