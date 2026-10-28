// src/components/Section/edges.js
/**
 * Section edges — the shape where one section meets the next.
 *
 * Each edge is a path in a 0–100 box whose BOTTOM is the section's boundary:
 * the filled part is the section reaching up into the one above it. A bottom
 * edge is the same path turned upside down.
 *
 * Two kinds:
 *   repeating  wave, zigzag, scallop, steps — one TILE, repeated across the
 *              width at a size set by the edge's height, so a wide section
 *              gets more waves rather than stretched ones. These can drift.
 *   stretched  curve, slant — one shape across the whole width. These cannot
 *              slide, so when animated they swell and settle instead.
 *
 * `random-wave` is three waves of different lengths added together: it
 * reads as irregular, but it is FIXED for a given seed — the same in code and
 * in Figma, and the same on every load. A different seed per section keeps
 * stacked sections from matching. Its tile is long (16 x the height) and the
 * three lengths divide it exactly, so it still repeats without a seam.
 *
 * The Figma Section Edge component (Shapes page) is built from these same
 * formulas.
 */

const r1 = (n) => Math.round(n * 10) / 10;
const toPath = (pts) => 'M' + pts.map(([x, y]) => r1(x) + ' ' + r1(y)).join('L') + 'Z';

function sampled(f, steps = 48) {
  const pts = [[0, 100]];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    pts.push([x, f(x)]);
  }
  return pts.concat([[100, 100]]);
}

/* Seeded: three phases from a seed, so "random" is repeatable. */
function randomWave(seed = 0) {
  const ph = (k) => ((Math.sin((seed + 1) * 12.9898 * k) * 43758.5453) % 1) * 2 * Math.PI;
  const p1 = ph(1); const p2 = ph(2); const p3 = ph(3);
  return toPath(sampled((x) => {
    const t = (x / 100) * 2 * Math.PI;
    return 50 - (22 * Math.sin(2 * t + p1) + 14 * Math.sin(3 * t + p2) + 8 * Math.sin(5 * t + p3));
  }, 160));
}

/* name → [path, tile width as a multiple of the edge height, or 0 to stretch] */
const DEFS = {
  wave: [toPath(sampled((x) => 50 - 40 * Math.sin((x / 100) * 2 * Math.PI))), 6],
  scallop: [toPath(sampled((x) => 100 - 100 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 50) / 50, 2))))), 2],
  zigzag: [toPath([[0, 100], [50, 0], [100, 100]]), 2],
  steps: [toPath([[0, 100], [0, 20], [50, 20], [50, 80], [100, 80], [100, 100]]), 2],
  'random-wave': [randomWave(0), 16],
  curve: [toPath(sampled((x) => 100 - 100 * Math.sin((x / 100) * Math.PI))), 0],
  slant: [toPath([[0, 100], [100, 0], [100, 100]]), 0],
};

export const EDGE_NAMES = Object.keys(DEFS);
/** Edges built from a repeating tile — the ones that can drift. */
export const REPEATING_EDGES = EDGE_NAMES.filter((n) => DEFS[n][1] > 0);

export function edgePath(name, seed = 0) {
  if (name === 'random-wave' && seed) return randomWave(seed);
  return DEFS[name] ? DEFS[name][0] : null;
}

/** The tile width in px for a repeating edge at this height, or null. */
export function edgeTile(name, height) {
  return DEFS[name] && DEFS[name][1] ? DEFS[name][1] * height : null;
}

export function edgeMaskURL(name, seed = 0) {
  const d = edgePath(name, seed);
  if (!d) return null;
  return 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + d + '"/></svg>',
  ) + '")';
}
