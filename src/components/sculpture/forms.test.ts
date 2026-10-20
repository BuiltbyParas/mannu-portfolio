import assert from "node:assert/strict";
import { test } from "node:test";

import { FORM_IDS, FORMS, LEDGER_MARKS, STRIP_SAMPLES } from "./forms.ts";
import { computeStrip, createStrip } from "./strip.ts";
import { approximateCertificateCount } from "../../content/site.ts";

const place = { center: [0, 0, 0] as [number, number, number], unit: 1, aspect: 1.3 };
const strip = (id: (typeof FORM_IDS)[number], n = STRIP_SAMPLES) =>
  computeStrip({ a: FORMS[id], b: FORMS[id], t: 0, pa: place, pb: place, reveal: 1 }, createStrip(n));

test("every ribbon state is finite along its whole length", () => {
  for (const id of FORM_IDS) {
    for (let i = 0; i <= 200; i++) {
      const p = FORMS[id].point(i / 200, 1.3);
      assert.ok(p.every(Number.isFinite), `${id} at s=${i / 200}`);
    }
    const s = strip(id);
    assert.ok(s.pos.every(Number.isFinite) && s.nrm.every(Number.isFinite), `${id} strip`);
  }
});

test("closed states meet themselves without a visible seam", () => {
  for (const id of FORM_IDS.filter((f) => FORMS[f].closed)) {
    const a = FORMS[id].point(0, 1.3);
    const b = FORMS[id].point(1, 1.3);
    assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1e-9, `${id} ends meet`);
    const turns = (FORMS[id].twist(1) - FORMS[id].twist(0)) / (Math.PI * 2);
    assert.ok(Math.abs(turns - Math.round(turns)) < 1e-9, `${id} twists a whole number of turns`);
    const s = strip(id);
    const last = (s.n - 1) * 3;
    const dot = s.nrm[0] * s.nrm[last] + s.nrm[1] * s.nrm[last + 1] + s.nrm[2] * s.nrm[last + 2];
    assert.ok(dot > 0.999, `${id} faces match at the seam (dot ${dot})`);
  }
});

test("the ledger draws about one mark per certificate, each cut cleanly", () => {
  assert.ok(LEDGER_MARKS >= approximateCertificateCount && LEDGER_MARKS < approximateCertificateCount + 5);
  const s = strip("certificates");
  let pieces = 0;
  for (let i = 0; i < s.n - 1; i++) {
    const visible = s.width[i] > 0 && s.width[i + 1] > 0;
    if (s.width[i] === 0 && s.width[i + 1] > 0) pieces++;
    const k = i * 3;
    const length = Math.hypot(s.pos[k + 3] - s.pos[k], s.pos[k + 4] - s.pos[k + 1]);
    // A visible segment never spans the jump between two marks, and no mark tapers to a point.
    if (visible) assert.ok(length < 0.12, `segment ${i} spans a jump`);
    if (s.width[i] > 0 !== s.width[i + 1] > 0) assert.ok(length < 1e-6, `segment ${i} tapers instead of ending square`);
  }
  assert.equal(pieces, LEDGER_MARKS);
});

test("a hidden reveal draws nothing, a full one draws the whole opening", () => {
  const hidden = computeStrip({ a: FORMS.hero, b: FORMS.hero, t: 0, pa: place, pb: place, reveal: 0 }, createStrip(200));
  assert.ok(hidden.width.every((w) => w === 0));
  const shown = strip("hero", 200);
  assert.ok(shown.width.slice(5, 195).every((w) => w > 0));
});

test("the phone opening uses a slimmer strip than the wide one", () => {
  const wide = computeStrip({ a: FORMS.hero, b: FORMS.hero, t: 0, pa: { ...place, aspect: 4.2 }, pb: { ...place, aspect: 4.2 }, reveal: 1 }, createStrip(200));
  const narrow = computeStrip({ a: FORMS.hero, b: FORMS.hero, t: 0, pa: { ...place, aspect: 1.97 }, pb: { ...place, aspect: 1.97 }, reveal: 1 }, createStrip(200));
  const max = (s: { width: Float32Array }) => Math.max(...s.width);
  assert.ok(max(narrow) < max(wide) * 0.7, `narrow ${max(narrow)} vs wide ${max(wide)}`);
});

test("every change between neighbouring states stays finite, unit-framed and seam-free", () => {
  for (let f = 0; f < FORM_IDS.length - 1; f++) {
    const a = FORMS[FORM_IDS[f]];
    const b = FORMS[FORM_IDS[f + 1]];
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const s = computeStrip({ a, b, t, pa: place, pb: { ...place, center: [0.4, -0.3, 0] }, reveal: 1 }, createStrip(STRIP_SAMPLES));
      for (let i = 0; i < s.n; i++) {
        const k = i * 3;
        assert.ok(Number.isFinite(s.pos[k]) && Number.isFinite(s.pos[k + 1]) && Number.isFinite(s.pos[k + 2]), `${a.id}>${b.id} t=${t} pos ${i}`);
        const nl = Math.hypot(s.nrm[k], s.nrm[k + 1], s.nrm[k + 2]);
        const bl = Math.hypot(s.bin[k], s.bin[k + 1], s.bin[k + 2]);
        assert.ok(Math.abs(nl - 1) < 1e-3 && Math.abs(bl - 1) < 1e-3, `${a.id}>${b.id} t=${t} frame ${i}`);
        const dot = s.nrm[k] * s.bin[k] + s.nrm[k + 1] * s.bin[k + 1] + s.nrm[k + 2] * s.bin[k + 2];
        assert.ok(Math.abs(dot) < 1e-3, `${a.id}>${b.id} t=${t} frame not orthogonal at ${i}`);
      }
    }
  }
});

test("colours switch over the middle of a move instead of lingering half-mixed", () => {
  const s = computeStrip({ a: FORMS.break, b: FORMS.try, t: 0.5, pa: place, pb: place, reveal: 1 }, createStrip(STRIP_SAMPLES));
  // Inside the coral stretch, each sample is either mostly ultramarine or mostly coral, rarely between.
  let between = 0;
  let total = 0;
  for (let i = 0; i < s.n; i++) {
    const u = i / (s.n - 1);
    if (u < 0.52 || u > 0.73) continue;
    total++;
    const r = s.top[i * 3]; // linear red: ultramarine ≈ 0.04, coral = 1
    if (r > 0.15 && r < 0.85) between++;
  }
  assert.ok(between / total < 0.35, `${between}/${total} samples half-mixed`);
});

test("a pointer ripple turns only the marks near it, and an emphasis swells only its own turn", () => {
  const base = computeStrip({ a: FORMS.certificates, b: FORMS.certificates, t: 0, pa: place, pb: place, reveal: 1 }, createStrip(STRIP_SAMPLES));
  const rippled = computeStrip(
    { a: FORMS.certificates, b: FORMS.certificates, t: 0, pa: place, pb: place, reveal: 1, ripple: { x: 0, y: 0, radius: 0.25, amount: 1.2 } },
    createStrip(STRIP_SAMPLES),
  );
  let near = 0;
  let far = 0;
  for (let i = 0; i < base.n; i++) {
    if (base.width[i] === 0) continue;
    const k = i * 3;
    const turned = 1 - (base.nrm[k] * rippled.nrm[k] + base.nrm[k + 1] * rippled.nrm[k + 1] + base.nrm[k + 2] * rippled.nrm[k + 2]);
    const d = Math.hypot(base.pos[k], base.pos[k + 1]);
    if (d < 0.1) near = Math.max(near, turned);
    if (d > 1) far = Math.max(far, turned);
  }
  assert.ok(near > 0.4 && far < 1e-3, `near ${near}, far ${far}`);

  const coil = (amount: number) =>
    computeStrip({ a: FORMS.foundations, b: FORMS.foundations, t: 0, pa: place, pb: place, reveal: 1, emphasis: { from: 0.25, to: 0.5, amount } }, createStrip(400));
  const flat = coil(0);
  const lifted = coil(0.3);
  const radius = (s: ReturnType<typeof coil>, i: number) => Math.hypot(s.pos[i * 3], s.pos[i * 3 + 2]);
  assert.ok(radius(lifted, 150) > radius(flat, 150) * 1.2, "the emphasised turn swells");
  assert.ok(Math.abs(radius(lifted, 20) - radius(flat, 20)) < 1e-6 && Math.abs(radius(lifted, 380) - radius(flat, 380)) < 1e-6, "other turns stay put");
});
