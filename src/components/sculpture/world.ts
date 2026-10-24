import { Color, DoubleSide, Group, Mesh, ShaderMaterial, SphereGeometry } from "three";
import { CLEARANCE_GLSL } from "./clearance";
import { cameraAt, CAMERA_Z, flightAt, GLASS, nearFade, softAt, span, viewToWorld, type Vec3 } from "./scenery";

/*
 * The opening's world (large screens only; see scenery.ts for the layout and
 * the beats): a few clear glass spheres hanging in the sky above the name.
 * Everything sits in one group that moves the way a camera would (forward,
 * drifting and turning a little), so near things pass quickly and far ones
 * slowly.
 *
 * Two draw calls per sphere (its far wall, then its near one), no textures,
 * nothing per frame on the CPU but a few transforms. Every material shares the
 * scene's clearance mask (no glass is drawn behind words) and stops at the
 * stage's lower edge, so when the stage is released the world leaves with it
 * instead of hanging over the next section. While the stage is still rising
 * into view from under the landing, the world rises with it.
 */

// A soap film is never quite still: the sphere breathes a little out of round
// (uWobble, a share of its radius). The surface position is passed on in the
// bubble's own frame, so the film's pattern turns with it.
const BUBBLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uWobble;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vSurface;
  void main() {
    float w = sin(position.x * 2.3 + uTime * 0.8 + uSeed) * sin(position.y * 1.9 - uTime * 0.6 + uSeed * 1.3)
      + 0.5 * sin(position.z * 2.9 + uTime * 0.5 + uSeed * 0.6);
    vec4 mv = modelViewMatrix * vec4(position + normal * w * uWobble, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vSurface = position;
    gl_Position = projectionMatrix * mv;
  }
`;

// Glass on a light page. A bubble is drawn twice, its far wall first (seen
// through the near one, fainter, its light on the opposite side) and then its
// near wall. Each reflects the world: a bright sky above and a cool ground
// below meeting at a blush horizon, which gives the body its volume; toward
// the rim a thin film whose colours (powder, blush, a breath of citron) drift
// across the surface; a fine ultramarine silhouette, so the bubble holds its
// shape on a pale sky. Light: a crisp key up and to the left with a soft halo,
// a broad soft window up and to the right, and a faint bounce from below. Out
// of focus (uSoft) the rim spreads and the highlights melt.
const BUBBLE_FRAGMENT = /* glsl */ `
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uStageBottom;
  uniform float uStageTop;
  uniform float uTime;
  uniform float uSeed;
  uniform float uHue;
  uniform float uSoft;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vSurface;
  ${CLEARANCE_GLSL}
  vec3 film(float t) {
    t = fract(t);
    vec3 c = mix(vec3(0.62, 0.72, 1.0), vec3(1.0, 0.66, 0.6), smoothstep(0.0, 0.4, t));
    c = mix(c, vec3(0.86, 0.96, 0.52), smoothstep(0.42, 0.68, t));
    return mix(c, vec3(0.62, 0.72, 1.0), smoothstep(0.72, 1.0, t));
  }
  void main() {
    if (gl_FragCoord.y < uStageBottom || gl_FragCoord.y > uStageTop) discard;
    float far = gl_FrontFacing ? 0.0 : 1.0;
    vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 v = normalize(vView);
    float edge = 1.0 - clamp(abs(dot(n, v)), 0.0, 1.0);
    float rim = pow(edge, mix(2.2, 1.3, uSoft));
    vec3 s = vSurface;
    float swirl = sin(s.x * 3.1 + s.y * 2.2 + uTime * 0.23 + uSeed) + 0.6 * sin(s.y * 4.1 - s.z * 2.6 - uTime * 0.17 + uSeed * 1.7);
    vec3 tone = film(uHue + edge * 1.3 + swirl * 0.09);

    // The world, reflected; its horizon leans a little differently in each bubble.
    vec3 r = reflect(-v, n);
    float level = r.y + r.x * 0.14 * sin(uSeed * 2.7) + 0.05 * sin(uTime * 0.13 + uSeed);
    float sky = smoothstep(-0.45, 0.12, level);
    vec3 env = mix(vec3(0.6, 0.67, 0.92), vec3(1.0), sky);
    env = mix(env, vec3(1.0, 0.8, 0.74), exp(-pow((level + 0.06) * 8.0, 2.0)) * 0.55);

    vec3 key = normalize(vec3(-0.5 + 0.07 * sin(uTime * 0.11 + uSeed), 0.6 + 0.05 * cos(uTime * 0.09 + uSeed * 2.0), 0.62));
    float k = max(dot(r, key), 0.0);
    float spot = pow(k, mix(420.0, 30.0, uSoft)) * mix(1.6, 0.35, uSoft);
    float halo = pow(k, mix(26.0, 8.0, uSoft)) * 0.2;
    vec3 fill = normalize(vec3(0.6 + 0.05 * cos(uTime * 0.07 + uSeed), 0.42, 0.68));
    float window = smoothstep(mix(0.94, 0.8, uSoft), 0.985, dot(r, fill)) * mix(0.42, 0.18, uSoft);
    float bounce = pow(max(dot(r, normalize(vec3(0.25, -0.8, 0.55))), 0.0), mix(40.0, 10.0, uSoft)) * 0.22;
    float light = clamp(spot + halo + window + bounce, 0.0, 1.0) * mix(1.0, 0.55, far);

    float fresnel = 0.07 + 0.93 * pow(edge, 3.0);
    float ground = 1.0 - sky;
    vec3 col = mix(mix(uTint, env, 0.85), tone, smoothstep(0.35, 0.95, edge) * mix(0.9, 0.5, far));
    col = mix(col, vec3(0.26, 0.36, 0.92), smoothstep(0.84, 1.0, edge) * mix(0.5, 0.2, uSoft) * (1.0 - far));
    col = mix(col, vec3(1.0), light);
    float a = fresnel * 0.62 + ground * (1.0 - edge) * 0.1 + rim * 0.22 + light * 0.9;
    a *= mix(1.0, 0.42, far) * mix(1.0, 0.7, uSoft);
    a *= uOpacity * clearance(gl_FragCoord.xy);
    if (a < 0.003) discard;
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`;

type Clear = { uClear: { value: Float32Array }; uClearCount: { value: number }; uClearSoft: { value: number } };

export type WorldState = {
  /** The opening's progress p (scenery.ts). */
  progress: number;
  /**
   * How far the stage sits above its place in the view, in world units at the
   * page plane: positive once it is released and moves up, negative while it
   * is still rising into view from below.
   */
  shift: number;
  /** The stage's lower edge in drawing-buffer pixels from the bottom; nothing is drawn below it. */
  stageBottom: number;
  /** The stage's upper edge in drawing-buffer pixels from the bottom; nothing is drawn above it (the ribbon on the landing has the view above the stage while it rises). */
  stageTop: number;
  /** Seconds on the scene's own clock (the film's drift). */
  time: number;
  /** Ambient motion, 0 at rest (the same settling as the ribbon's sway); the glass bobs with it. */
  idle: number;
};

export function createWorld(clear: Clear) {
  const root = new Group();
  const camera = new Group();
  root.add(camera);
  const stageBottom = { value: 0 };
  const stageTop = { value: 0 };
  const time = { value: 0 };
  const sphere = new SphereGeometry(1, 72, 48);

  const bubble = (tint: string, seed: number, hue: number, wobble: number) => {
    const material = new ShaderMaterial({
      vertexShader: BUBBLE_VERTEX,
      fragmentShader: BUBBLE_FRAGMENT,
      uniforms: {
        uTint: { value: new Color(tint) },
        uOpacity: { value: 0 },
        uSoft: { value: 0 },
        uSeed: { value: seed },
        uHue: { value: hue },
        uWobble: { value: wobble },
        uTime: time,
        uStageBottom: stageBottom,
        uStageTop: stageTop,
        ...clear,
      },
      transparent: true,
      depthWrite: false,
      // Both walls: three.js draws a transparent two-sided material far side first.
      side: DoubleSide,
    });
    const mesh = new Mesh(sphere, material);
    mesh.renderOrder = 2;
    mesh.visible = false;
    camera.add(mesh);
    return { mesh, material, base: [0, 0, 0] as Vec3 };
  };

  const glass = GLASS.map((spec, i) => {
    const b = bubble(spec.tint, 11 + i * 2.3, 0.15 + i * 0.3, 0.006);
    b.mesh.scale.setScalar(spec.r);
    return { spec, ...b };
  });

  let aspect = 1.6;
  function resize(viewAspect: number) {
    aspect = viewAspect;
    for (const g of glass) g.base = viewToWorld(g.spec.u, g.spec.v, g.spec.z, aspect);
  }

  function update(state: WorldState) {
    const { progress, shift, idle } = state;
    const t = state.time;
    stageBottom.value = state.stageBottom;
    stageTop.value = state.stageTop;
    time.value = t;
    root.visible = true;

    // The view travels on through the world as the opening plays, and the world moves with the stage.
    const cam = cameraAt(flightAt(progress));
    camera.position.set(cam.x, cam.y + shift, cam.z);
    camera.rotation.set(0, cam.yaw, 0);
    camera.updateMatrixWorld();

    for (const [i, g] of glass.entries()) {
      const bob = Math.sin(t * 0.3 + i * 2.1) * 0.035 * idle;
      g.mesh.position.set(g.base[0], g.base[1] + bob, g.base[2]);
      // Distance from the viewer after the travel, so the near sphere fades before it would pass the lens.
      const d = CAMERA_Z - (g.base[2] + camera.position.z);
      const opacity = nearFade(d) * (1 - span(progress, [0.9, 1.2]) * 0.25);
      g.mesh.visible = opacity > 0.002;
      g.material.uniforms.uOpacity.value = opacity;
      g.material.uniforms.uSoft.value = softAt(d);
    }
  }

  function hide() {
    root.visible = false;
  }

  function dispose() {
    sphere.dispose();
    for (const g of glass) g.material.dispose();
  }

  root.visible = false;
  return { root, resize, update, hide, dispose, get aspect() { return aspect; } };
}
