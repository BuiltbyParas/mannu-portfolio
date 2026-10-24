import {
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  Scene,
  ShadowMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CLEAR_MAX, CLEARANCE_GLSL } from "./clearance";
import { absorbGlow, depthFade, emergeWeight, gatherWeight, passageOpacity, seedDust, streakAt, swirlAngle, travelAt, travelZ } from "./passage";
import type { Strip } from "./strip";
import { createWorld, type WorldState } from "./world";

/*
 * The renderer for the ribbon: one mesh, one draw call, a studio environment
 * for soft reflections, and (on large screens) a shadow-catching plane so the
 * strip seems to float a little above the page. A field of fine points (one
 * more draw call) appears only during the passage from the opening into
 * Curiosity; see passage.ts. The caller decides when to render; nothing here
 * runs a loop of its own.
 *
 * On large screens the opening also has a world of glass spheres (world.ts),
 * drawn only while the opening's stage is in use.
 *
 * All the materials share one clearance mask (clearance.ts): the boxes of
 * the words on screen, where nothing of the scene is drawn.
 */

export type RibbonScene = ReturnType<typeof createRibbonScene>;

const FOV = 26;
const CAMERA_Z = 14;
const VERTS_PER_SAMPLE = 8;

/** Writes one vector in place: the update loop runs per sample per frame, so it allocates nothing. */
function w3(arr: Float32Array, o: number, x: number, y: number, z: number) {
  arr[o] = x;
  arr[o + 1] = y;
  arr[o + 2] = z;
}

// Depth of field around the ribbon's plane (z = 0): points well in front of it
// grow soft and wide, far ones a little soft; points that gather onto the
// ribbon come into focus. Free points near the viewer stretch along the line
// from the centre of the view while the flight is fast (aStreak).
const DUST_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aStreak;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying float vBlur;
  varying float vStretch;
  varying vec2 vDir;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vBlur = max(smoothstep(1.5, 8.0, position.z), 0.35 * smoothstep(-4.0, -13.0, position.z));
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vDir = length(ndc) > 0.001 ? normalize(ndc) : vec2(1.0, 0.0);
    // Streaks lengthen toward the edges of the view, as if rushing past it.
    vStretch = aStreak * smoothstep(0.05, 0.75, length(ndc));
    gl_PointSize = min(260.0, max(1.0, aSize * uScale / -mv.z) * (1.0 + vBlur * 0.9) * (1.0 + vStretch));
    vAlpha = aAlpha;
    vColor = aColor;
  }
`;

// A bead of light: a solid core inside a soft halo of its own colour. Out of
// focus the core melts into the halo; in a streak the bead is drawn out along
// vDir while keeping its width.
const DUST_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBlur;
  varying float vStretch;
  varying vec2 vDir;
  varying vec3 vColor;
  ${CLEARANCE_GLSL}
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    p.y = -p.y;
    float along = dot(p, vDir);
    float across = dot(p, vec2(-vDir.y, vDir.x));
    float d = length(vec2(along, across * (1.0 + vStretch)));
    float coreR = mix(0.24, 0.07, vBlur);
    float halo = smoothstep(0.5, 0.05 * (1.0 - vBlur), d);
    float core = smoothstep(coreR, coreR * 0.5, d);
    float energy = mix(1.0, 0.45, vBlur) * mix(1.0, 0.55, min(1.0, vStretch / 3.0));
    float a = (core * 0.92 + halo * halo * mix(0.3, 0.5, vBlur)) * energy * vAlpha * uOpacity * clearance(gl_FragCoord.xy);
    if (a < 0.004) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), (1.0 - core) * 0.35), a);
  }
`;

/** Shared by every material, so one write per frame moves the mask everywhere. */
function clearanceUniforms() {
  return {
    uClear: { value: new Float32Array(CLEAR_MAX * 4) },
    uClearCount: { value: 0 },
    uClearSoft: { value: 24 },
  };
}

/** Adds the mask to a built-in material: fully cleared fragments are dropped, the soft edge fades. */
function withClearance<M extends MeshPhysicalMaterial | ShadowMaterial>(material: M, uniforms: ReturnType<typeof clearanceUniforms>, last: string) {
  material.transparent = true;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", `${CLEARANCE_GLSL}\nvoid main() {`)
      .replace(last, `${last}\n  float clearMask = clearance(gl_FragCoord.xy);\n  if (clearMask < 0.004) discard;\n  gl_FragColor.a *= clearMask;`);
  };
  return material;
}

export function createRibbonScene(
  canvas: HTMLCanvasElement,
  samples: number,
  { shadows, dustCount }: { shadows: boolean; dustCount: number },
) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = PCFShadowMap;
  // Redrawn only on frames where the shadow can be seen (see update).
  renderer.shadowMap.autoUpdate = false;
  let shadowDrawn = false;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  room.dispose();
  pmrem.dispose();

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, CAMERA_Z);

  scene.add(new HemisphereLight(0xffffff, 0xc9d3ff, 0.55));
  const key = new DirectionalLight(0xffffff, 1.5);
  key.position.set(-3.2, 4.6, 9);
  scene.add(key);
  key.castShadow = shadows;
  if (shadows) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 4;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
  }

  /* Geometry: 8 vertices per sample (top face, bottom face, two edges). */
  const count = samples * VERTS_PER_SAMPLE;
  const geometry = new BufferGeometry();
  const position = new BufferAttribute(new Float32Array(count * 3), 3);
  const normal = new BufferAttribute(new Float32Array(count * 3), 3);
  const color = new BufferAttribute(new Float32Array(count * 3), 3);
  position.setUsage(35048); // DynamicDrawUsage
  normal.setUsage(35048);
  color.setUsage(35048);
  geometry.setAttribute("position", position);
  geometry.setAttribute("normal", normal);
  geometry.setAttribute("color", color);
  const index = new Uint32Array((samples - 1) * 24);
  for (let i = 0, o = 0; i < samples - 1; i++) {
    const a = i * VERTS_PER_SAMPLE;
    const b = a + VERTS_PER_SAMPLE;
    // top (faces +N), bottom (faces -N), edge on +B, edge on -B
    index.set([a, b, b + 1, a, b + 1, a + 1], o);
    index.set([a + 2, a + 3, b + 3, a + 2, b + 3, b + 2], o + 6);
    index.set([a + 5, b + 5, b + 4, a + 5, b + 4, a + 4], o + 12);
    index.set([a + 7, a + 6, b + 6, a + 7, b + 6, b + 7], o + 18);
    o += 24;
  }
  geometry.setIndex(new BufferAttribute(index, 1));

  const clear = clearanceUniforms();
  const material = new MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.38,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.75,
    // Lit only by the passage's absorbed points (see updateDust); zero otherwise.
    emissive: 0xc4d0ff,
    emissiveIntensity: 0,
  });
  withClearance(material, clear, "#include <dithering_fragment>");
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.castShadow = shadows;
  scene.add(mesh);

  const shadowMaterial = withClearance(new ShadowMaterial({ color: 0x1c2a78, opacity: 0.09 }), clear, "#include <premultiplied_alpha_fragment>");
  // The catcher only receives the shadow; it must not hide the opening's glass that sits behind it.
  shadowMaterial.depthWrite = false;
  const plane = new Mesh(new PlaneGeometry(1, 1), shadowMaterial);
  plane.position.z = -1.15;
  plane.receiveShadow = true;
  plane.visible = shadows;
  scene.add(plane);

  /* The passage field. Positions are written on the CPU each frame it is visible. */
  const seed = seedDust(dustCount);
  const dustGeometry = new BufferGeometry();
  const dustPosition = new BufferAttribute(new Float32Array(dustCount * 3), 3);
  const dustAlpha = new BufferAttribute(new Float32Array(dustCount), 1);
  const dustStreak = new BufferAttribute(new Float32Array(dustCount), 1);
  dustPosition.setUsage(35048);
  dustAlpha.setUsage(35048);
  dustStreak.setUsage(35048);
  dustGeometry.setAttribute("position", dustPosition);
  dustGeometry.setAttribute("aAlpha", dustAlpha);
  dustGeometry.setAttribute("aStreak", dustStreak);
  dustGeometry.setAttribute("aSize", new BufferAttribute(seed.size, 1));
  dustGeometry.setAttribute("aColor", new BufferAttribute(seed.color, 3));
  const dustMaterial = new ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    uniforms: { uScale: { value: 1 }, uOpacity: { value: 0 }, ...clear },
    transparent: true,
    depthWrite: false,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  dust.renderOrder = 1;
  dust.visible = false;
  scene.add(dust);
  const onStrip = new Vector3();

  const world = createWorld(clear);
  scene.add(world.root);

  let pixelsPerUnit = 1;
  let pixelRatio = 1;
  let viewW = 1;
  let viewH = 1;

  function resize(width: number, height: number, ratio: number) {
    pixelRatio = ratio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    viewH = 2 * CAMERA_Z * Math.tan(((FOV / 2) * Math.PI) / 180);
    viewW = viewH * camera.aspect;
    pixelsPerUnit = height / viewH;
    dustMaterial.uniforms.uScale.value = pixelsPerUnit * CAMERA_Z * pixelRatio;
    // The plane sits behind the strip, so it must be a little larger than the view.
    plane.scale.set(viewW * 1.4, viewH * 1.4, 1);
    world.resize(camera.aspect);
    if (shadows) {
      const cam = key.shadow.camera;
      cam.left = -viewW * 0.7;
      cam.right = viewW * 0.7;
      cam.top = viewH * 0.7;
      cam.bottom = -viewH * 0.7;
      cam.near = 0.5;
      cam.far = 30;
      cam.updateProjectionMatrix();
    }
  }

  /** Viewport pixels (origin top-left) to world units on the z = 0 plane. */
  function toWorld(x: number, y: number, width: number, height: number): [number, number] {
    return [(x - width / 2) / pixelsPerUnit, -(y - height / 2) / pixelsPerUnit];
  }

  function update(strip: Strip, rotation: [number, number, number], shadow = 0.09, scale = 1) {
    shadowMaterial.opacity = shadow;
    // In transit the shadow fades to nothing: skip both the shadow map and the full-view catcher then.
    // The map is still drawn once up front, since the lit shaders sample it from their first frame.
    plane.visible = shadows && shadow > 0.003;
    renderer.shadowMap.needsUpdate = plane.visible || !shadowDrawn;
    shadowDrawn = true;
    const p = position.array as Float32Array;
    const nm = normal.array as Float32Array;
    const c = color.array as Float32Array;
    const { pos, nrm, bin, width, thick, top, bottom, edge } = strip;
    for (let i = 0; i < strip.n; i++) {
      const k = i * 3;
      const h = width[i] / 2;
      const t = thick[i] / 2;
      const px = pos[k],
        py = pos[k + 1],
        pz = pos[k + 2];
      const nx = nrm[k],
        ny = nrm[k + 1],
        nz = nrm[k + 2];
      const bx = bin[k],
        by = bin[k + 1],
        bz = bin[k + 2];
      const lx = px + bx * h,
        ly = py + by * h,
        lz = pz + bz * h;
      const rx = px - bx * h,
        ry = py - by * h,
        rz = pz - bz * h;
      const v = i * VERTS_PER_SAMPLE * 3;
      // positions: top L/R, bottom L/R, edge +B top/bottom, edge -B top/bottom
      w3(p, v, lx + nx * t, ly + ny * t, lz + nz * t);
      w3(p, v + 3, rx + nx * t, ry + ny * t, rz + nz * t);
      w3(p, v + 6, lx - nx * t, ly - ny * t, lz - nz * t);
      w3(p, v + 9, rx - nx * t, ry - ny * t, rz - nz * t);
      w3(p, v + 12, lx + nx * t, ly + ny * t, lz + nz * t);
      w3(p, v + 15, lx - nx * t, ly - ny * t, lz - nz * t);
      w3(p, v + 18, rx + nx * t, ry + ny * t, rz + nz * t);
      w3(p, v + 21, rx - nx * t, ry - ny * t, rz - nz * t);
      // normals and colours, two vertices at a time
      for (let j = 0; j < 2; j++) {
        w3(nm, v + j * 3, nx, ny, nz);
        w3(nm, v + 6 + j * 3, -nx, -ny, -nz);
        w3(nm, v + 12 + j * 3, bx, by, bz);
        w3(nm, v + 18 + j * 3, -bx, -by, -bz);
        w3(c, v + j * 3, top[k], top[k + 1], top[k + 2]);
        w3(c, v + 6 + j * 3, bottom[k], bottom[k + 1], bottom[k + 2]);
        w3(c, v + 12 + j * 3, edge[k], edge[k + 1], edge[k + 2]);
        w3(c, v + 18 + j * 3, edge[k], edge[k + 1], edge[k + 2]);
      }
    }
    position.needsUpdate = true;
    normal.needsUpdate = true;
    color.needsUpdate = true;
    mesh.position.set(strip.center[0], strip.center[1], strip.center[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.scale.setScalar(scale);
  }

  /**
   * Places the passage field for progress c. Free points stream toward the viewer; gathering
   * points spiral onto the ribbon's centre line (as just drawn by `update`) and fade into it.
   */
  function updateDust(c: number, drift: number, strip: Strip) {
    const opacity = passageOpacity(c);
    material.emissiveIntensity = absorbGlow(c);
    dust.visible = opacity > 0.002;
    if (!dust.visible) return;
    dustMaterial.uniforms.uOpacity.value = opacity;
    mesh.updateMatrix();
    mesh.updateMatrixWorld();
    const p = dustPosition.array as Float32Array;
    const alpha = dustAlpha.array as Float32Array;
    const streaks = dustStreak.array as Float32Array;
    const tan = Math.tan(((FOV / 2) * Math.PI) / 180);
    const travel = travelAt(c) + drift;
    const streak = streakAt(c) * 4.5;
    const last = strip.n - 1;
    for (let i = 0; i < seed.count; i++) {
      const z = travelZ(seed.z[i], travel);
      // Spread across the view as seen from the point's starting depth, so it streams outward as it nears.
      const reach = (CAMERA_Z - seed.z[i]) * tan;
      let x = seed.u[i] * reach * camera.aspect;
      let y = seed.v[i] * reach;
      let pz = z;
      let a = depthFade(z) * emergeWeight(c, seed.emerge[i]);
      // Only points coming toward the viewer streak, and only while they fly free.
      let s = streak * Math.min(1, Math.max(0, (z + 3) / 9));
      const g = gatherWeight(c, seed.order[i]);
      if (g > 0) {
        const j = Math.min(last, Math.round(seed.along[i] * last)) * 3;
        onStrip.set(strip.pos[j], strip.pos[j + 1], strip.pos[j + 2]).applyMatrix4(mesh.matrixWorld);
        // Close in on the target along a spiral: the remaining offset shrinks as it turns.
        const angle = swirlAngle(g, seed.spin[i]);
        const cos = Math.cos(angle),
          sin = Math.sin(angle);
        const dx = (x - onStrip.x) * (1 - g),
          dy = (y - onStrip.y) * (1 - g);
        x = onStrip.x + dx * cos - dy * sin;
        y = onStrip.y + dx * sin + dy * cos;
        pz += (onStrip.z - pz) * g;
        a = a + (1 - a) * g; // once caught, it stays visible until absorbed
        a *= 1 - Math.min(1, Math.max(0, (g - 0.82) / 0.18));
        s *= 1 - g;
      }
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = pz;
      alpha[i] = a;
      streaks[i] = s;
    }
    dustPosition.needsUpdate = true;
    dustAlpha.needsUpdate = true;
    dustStreak.needsUpdate = true;
  }

  /** Boxes as packed by clearance.ts (drawing-buffer pixels); `soft` is the fade in CSS pixels. */
  function setClearance(rects: Float32Array, count: number, soft: number) {
    clear.uClear.value.set(rects.subarray(0, CLEAR_MAX * 4));
    clear.uClearCount.value = count;
    clear.uClearSoft.value = soft * pixelRatio;
  }

  /** Places the opening's world for this frame, or hides it (null) wherever the opening's stage is not in use. */
  function updateWorld(state: WorldState | null) {
    if (state) world.update(state);
    else world.hide();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    plane.geometry.dispose();
    shadowMaterial.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    world.dispose();
    envTarget.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    resize,
    toWorld,
    update,
    updateDust,
    updateWorld,
    setClearance,
    render,
    dispose,
    get pixelsPerUnit() {
      return pixelsPerUnit;
    },
    get pixelRatio() {
      return pixelRatio;
    },
  };
}
