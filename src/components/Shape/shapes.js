// src/components/Shape/shapes.js
/**
 * THE shape source. Every shape is an SVG path in a 0–100 box, generated from
 * a short formula, and the same path is used three ways:
 *
 *   code    as a CSS mask (shapeMask) — it stretches to any box and works in
 *           every browser, unlike clip-path: path(), which takes pixels only
 *   Figma   as a vector, written by the plugin from the same list, so the
 *           design and the code are the same shape point for point
 *   docs    drawn in the gallery
 *
 * ROUND shapes (polar ones) are all sampled at the same POINTS count from the
 * same start angle, which is what lets any of them morph into any other: a
 * transition between two paths needs the same commands in the same order.
 *
 * Two names are not paths:
 *   rounded   the brand's own corner (--Card-Radius) — it follows the
 *             design system, so it is a radius, not a fixed drawing
 *   squircle  Figma's corner smoothing — CSS corner-shape where supported,
 *             a rounded corner elsewhere
 *
 * No colors here. A shape is geometry; what fills it comes from the component
 * that uses it.
 */

export const POINTS = 120;
const C = 50;
const r2 = (n) => Math.round(n * 100) / 100;

function toPath(pts) {
  return 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L') + 'Z';
}

/* r(theta) sampled POINTS times from the top, clockwise. */
function polar(r, start = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i * 2 * Math.PI / POINTS;
    const R = r(t);
    pts.push([C + R * Math.cos(start + t), C + R * Math.sin(start + t)]);
  }
  return pts;
}

/* A polygon with every corner rounded by a quadratic through the vertex. */
function rounded(verts, rad) {
  const out = [];
  const k = verts.length;
  for (let i = 0; i < k; i++) {
    const p = verts[(i + k - 1) % k];
    const v = verts[i];
    const q = verts[(i + 1) % k];
    const a = [p[0] - v[0], p[1] - v[1]];
    const b = [q[0] - v[0], q[1] - v[1]];
    const la = Math.hypot(a[0], a[1]);
    const lb = Math.hypot(b[0], b[1]);
    const r = Math.min(rad, la / 2.2, lb / 2.2);
    const s = [v[0] + a[0] / la * r, v[1] + a[1] / la * r];
    const e = [v[0] + b[0] / lb * r, v[1] + b[1] / lb * r];
    for (let j = 0; j <= 6; j++) {
      const t = j / 6;
      const u = 1 - t;
      out.push([u * u * s[0] + 2 * u * t * v[0] + t * t * e[0], u * u * s[1] + 2 * u * t * v[1] + t * t * e[1]]);
    }
  }
  return out;
}

function regular(n, R, rot = -Math.PI / 2) {
  const v = [];
  for (let i = 0; i < n; i++) {
    const t = rot + i * 2 * Math.PI / n;
    v.push([C + R * Math.cos(t), C + R * Math.sin(t)]);
  }
  return v;
}

function rotate(pts, deg) {
  const a = deg * Math.PI / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([x, y]) => [C + (x - C) * c - (y - C) * s, C + (x - C) * s + (y - C) * c]);
}

function stretch(pts, sx, sy) {
  return pts.map(([x, y]) => [C + (x - C) * sx, C + (y - C) * sy]);
}

function arc(cx, cy, R, from, to, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = from + (to - from) * i / steps;
    pts.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]);
  }
  return pts;
}

const circle = () => 46;
const cookie = (n, a) => (t) => 44 - a + a * Math.cos(n * t);
const sunny = (n, a, p) => (t) => 47 - a + a * Math.pow((1 + Math.cos(n * t)) / 2, p);
const flower = (n, d) => (t) => 47 - d + d * Math.abs(Math.cos(n * t / 2));
const puffy = (n) => (t) => 40 + 7 * Math.sqrt(Math.abs(Math.cos(n * t / 2)));
const clover = (n) => (t) => 22 + 26 * Math.pow(Math.abs(Math.cos(n * t / 2)), 0.55);

function heart() {
  const pts = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i * 2 * Math.PI / POINTS;
    pts.push([
      C + 2.75 * 16 * Math.pow(Math.sin(t), 3),
      47 - 2.75 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    ]);
  }
  return pts;
}

/* A shape made of whole rows of pixels: each row is [left, right], drawn as
   a staircase down the right edge and back up the left. */
function pixelRows(rows, top = 6, bottom = 94) {
  const h = (bottom - top) / rows.length;
  const right = [];
  const left = [];
  rows.forEach(([l, r], i) => {
    const y0 = top + i * h;
    right.push([r, y0], [r, y0 + h]);
  });
  for (let i = rows.length - 1; i >= 0; i--) {
    const y0 = top + i * h;
    left.push([rows[i][0], y0 + h], [rows[i][0], y0]);
  }
  return right.concat(left);
}

function pixelCircle() {
  return pixelRows([[34, 66], [22, 78], [14, 86], [8, 92], [6, 94], [6, 94], [6, 94], [8, 92], [14, 86], [22, 78], [34, 66]]);
}

/* Pointing right: every row starts at the left edge, and the rows lengthen to
   the middle and shorten again. */
function pixelTriangle() {
  const n = 9;
  const rows = [];
  for (let i = 0; i < n; i++) rows.push([8, 8 + 86 * (1 - Math.abs((2 * (i + 0.5)) / n - 1))]);
  return pixelRows(rows, 4, 96);
}

function scallop(bumps = 6) {
  const w = 100 / bumps;
  const R = w / 2;
  let pts = [[0, 100], [0, R]];
  for (let i = 0; i < bumps; i++) pts = pts.concat(arc(i * w + R, R, R, Math.PI, 2 * Math.PI, 12).slice(1));
  return pts.concat([[100, 100]]);
}

/* A rectangle with a half-circle bitten out of the top edge's middle — the
   arc runs from angle PI down to 0, so sin is positive: it dips INTO the box. */
function notch() {
  return [[0, 0]].concat(arc(50, 0, 14, Math.PI, 0, 20)).concat([[100, 0], [100, 100], [0, 100]]);
}

/* Name → group → points. Groups are what the docs and the picker sort by,
   and roughly what each brand style reaches for. */
const DEFS = [
  // Round
  ['circle', 'round', () => polar(circle)],
  ['oval', 'round', () => rotate(stretch(polar(circle), 1, 0.62), -40)],
  ['pill', 'round', () => rotate(rounded([[24, 4], [76, 4], [76, 96], [24, 96]], 26), -40)],
  ['arch', 'round', () => [[6, 94]].concat(arc(C, 50, 44, Math.PI, 2 * Math.PI, 40)).concat([[94, 94]])],
  ['semicircle', 'round', () => arc(C, 74, 47, Math.PI, 2 * Math.PI, 48)],
  ['heart', 'round', heart],
  // Soft polygons
  ['square', 'polygon', () => rounded([[6, 6], [94, 6], [94, 94], [6, 94]], 18)],
  ['slanted', 'polygon', () => rounded([[18, 8], [96, 8], [82, 92], [4, 92]], 12)],
  ['triangle', 'polygon', () => rounded([[50, 8], [96, 90], [4, 90]], 14)],
  ['arrow', 'polygon', () => rounded([[50, 6], [96, 90], [50, 70], [4, 90]], 14)],
  ['fan', 'polygon', () => rounded([[6, 6], [52, 6], [94, 48], [94, 94], [6, 94]], 10)],
  ['diamond', 'polygon', () => rounded([[50, 2], [90, 50], [50, 98], [10, 50]], 14)],
  ['clamshell', 'polygon', () => rounded([[24, 20], [76, 20], [98, 50], [76, 80], [24, 80], [2, 50]], 14)],
  ['pentagon', 'polygon', () => rounded(regular(5, 48), 12)],
  ['gem', 'polygon', () => rounded(regular(6, 48, 0), 14)],
  ['heptagon', 'polygon', () => rounded(regular(7, 48), 10)],
  // Cookies, suns, flowers — all polar, all morphable
  ['cookie-4', 'cookie', () => polar(cookie(4, 7))],
  ['cookie-6', 'cookie', () => polar(cookie(6, 4))],
  ['cookie-7', 'cookie', () => polar(cookie(7, 4))],
  ['cookie-9', 'cookie', () => polar(cookie(9, 3.5))],
  ['cookie-12', 'cookie', () => polar(cookie(12, 3))],
  ['sunny', 'cookie', () => polar(sunny(8, 9, 1.5))],
  ['very-sunny', 'cookie', () => polar(sunny(8, 14, 3))],
  ['clover-4', 'cookie', () => polar(clover(4))],
  ['clover-8', 'cookie', () => polar(clover(8))],
  ['flower', 'cookie', () => polar(flower(8, 12))],
  ['puffy', 'cookie', () => polar(puffy(10))],
  ['puffy-diamond', 'cookie', () => stretch(polar(puffy(8)), 0.86, 1.06)],
  // Bursts
  ['burst', 'burst', () => polar(sunny(12, 20, 6))],
  ['soft-burst', 'burst', () => polar(sunny(12, 12, 2.2))],
  ['boom', 'burst', () => polar(sunny(16, 26, 9))],
  ['soft-boom', 'burst', () => polar(sunny(16, 14, 3))],
  // Pixel
  ['pixel-circle', 'pixel', pixelCircle],
  ['pixel-triangle', 'pixel', pixelTriangle],
  // Cut — Material 2's set, for Professional and Bold brands
  ['cut-corners', 'cut', () => [[14, 0], [86, 0], [100, 14], [100, 86], [86, 100], [14, 100], [0, 86], [0, 14]]],
  ['cut-two', 'cut', () => [[16, 0], [100, 0], [100, 84], [84, 100], [0, 100], [0, 16]]],
  ['octagon', 'cut', () => [[29, 0], [71, 0], [100, 29], [100, 71], [71, 100], [29, 100], [0, 71], [0, 29]]],
  ['one-corner', 'cut', () => [[100, 0], [100, 100], [0, 100], [0, 40]].concat(arc(40, 40, 40, Math.PI, 1.5 * Math.PI, 16).slice(1))],
  ['notch', 'cut', notch],
  ['scallop', 'cut', () => scallop(6)],
];

const PATHS = {};
const GROUPS = {};
DEFS.forEach(([name, group, make]) => {
  PATHS[name] = toPath(make());
  GROUPS[name] = group;
});

/** Every drawn shape, in display order. `rounded` and `squircle` are added
 *  by the component as radius shapes. */
export const SHAPE_NAMES = ['rounded', 'squircle', ...DEFS.map(([n]) => n)];
export const SHAPE_GROUPS = { rounded: 'radius', squircle: 'radius', ...GROUPS };

/** The polar shapes — same point count, same start — which can morph. */
export const MORPHABLE_SHAPES = DEFS
  .filter(([name, group]) => ['cookie', 'burst'].includes(group) || name === 'circle' || name === 'heart')
  .map(([n]) => n);

/** Shapes an icon still reads inside at IconBadge's 40px with a 24px glyph:
 *  nothing pointed enough to clip the icon's corners. */
export const ICON_SHAPES = [
  'rounded', 'squircle', 'circle', 'square', 'gem', 'pentagon', 'heptagon', 'diamond',
  'cookie-4', 'cookie-6', 'cookie-7', 'cookie-9', 'cookie-12', 'sunny', 'flower', 'puffy',
  'arch', 'cut-corners', 'octagon',
];

/** The path (0–100 box), or null for a radius shape or an unknown name. */
export function shapePath(name) {
  return PATHS[name] || null;
}

/** CSS for a shape on an element: a mask for a path, a radius for the two
 *  radius shapes. Spread into sx / style. */
export function shapeStyle(name) {
  if (!name || name === 'none') return {};
  /* Card-Radius, as the Figma Shape component binds it — the brand's corner
     for a surface, which is what a framed image is. */
  if (name === 'rounded') return { borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius, 8px))' };
  if (name === 'squircle') {
    return { borderRadius: '28%', '@supports (corner-shape: squircle)': { borderRadius: '40%', cornerShape: 'squircle' } };
  }
  const d = PATHS[name];
  if (!d) return {};
  const url = 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + d + '"/></svg>',
  ) + '")';
  const mask = url + ' center / 100% 100% no-repeat';
  return { WebkitMask: mask, mask };
}
