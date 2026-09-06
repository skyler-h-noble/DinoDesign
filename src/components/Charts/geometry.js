// src/components/Charts/geometry.js
//
// Pure chart geometry — no React, no DOM, no CSS.
//
// This layer exists to be used TWICE. The SVG components in this folder render
// its output as path data; a Figma plugin renders the same output through
// figma.createVector() and binds Figma variables where the components bind CSS
// custom properties. Keeping the math here means the two can never disagree
// about where a slice ends or how a curve bends — the failure mode a design
// system cannot afford, because a chart that is subtly wrong still looks like
// a chart.
//
// Everything below takes plain numbers and returns plain numbers or SVG path
// strings. Nothing here reads a token.

/** Coerce a data array to finite numbers, dropping nothing (index = category). */
export const toNumbers = (data) =>
  (data || []).map((d) => {
    const n = typeof d === 'number' ? d : Number(d?.value);
    return Number.isFinite(n) ? n : 0;
  });

/** Label for a datum, when the caller passed objects rather than bare numbers. */
export const toLabels = (data) =>
  (data || []).map((d, i) => (typeof d === 'number' ? String(i + 1) : d?.label ?? String(i + 1)));

/**
 * The value axis. Bar charts start at zero so bar LENGTH stays proportional to
 * value — a bar chart with a clipped baseline misreports its own data, which is
 * the single most common way a chart lies. Line charts may float, since a line
 * encodes shape rather than magnitude.
 */
export function extent(values, { fromZero = true } = {}) {
  if (!values.length) return { min: 0, max: 1 };
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (fromZero) min = Math.min(0, min);
  // A flat series has no range to divide by; give it one so every point lands
  // mid-plot rather than at NaN.
  if (max === min) max = min + 1;
  return { min, max };
}

/** Map a value onto a pixel position, y growing DOWNWARD as SVG does. */
export const scaleY = (value, { min, max }, top, height) =>
  top + height - ((value - min) / (max - min)) * height;

/**
 * Evenly spaced band centres across a width — the x position of bar i or
 * point i. `inset` keeps the first and last from touching the plot edge.
 */
export function bands(count, left, width, { inset = 0 } = {}) {
  if (count <= 0) return [];
  const usable = width - inset * 2;
  if (count === 1) return [left + width / 2];
  const step = usable / (count - 1);
  return Array.from({ length: count }, (_, i) => left + inset + i * step);
}

/** Band centres and a bar width, for charts whose marks occupy a slot. */
export function slots(count, left, width, { gapRatio = 0.4 } = {}) {
  if (count <= 0) return { centres: [], bandWidth: 0 };
  const slot = width / count;
  const bandWidth = slot * (1 - gapRatio);
  return {
    centres: Array.from({ length: count }, (_, i) => left + slot * i + slot / 2),
    bandWidth,
  };
}

/** A polyline through points, as SVG path data. */
export const linePath = (points) =>
  points.length ? points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ') : '';

/**
 * A smooth path through the points — Catmull-Rom converted to cubic Béziers.
 *
 * Catmull-Rom is used rather than a plain bezier smoothing because it passes
 * THROUGH every point. A curve that merely approaches its data points is
 * drawing something other than the data. `tension` 0 gives the standard
 * uniform spline; higher values flatten it toward straight segments.
 */
export function smoothPath(points, { tension = 0 } = {}) {
  if (points.length < 2) return linePath(points);
  const k = (1 - tension) / 6;
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = { x: p1.x + (p2.x - p0.x) * k, y: p1.y + (p2.y - p0.y) * k };
    const c2 = { x: p2.x - (p3.x - p1.x) * k, y: p2.y - (p3.y - p1.y) * k };
    d += ` C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Close a line path down to a baseline, giving the area under it. */
export const areaPath = (d, points, baselineY) =>
  !d || !points.length
    ? ''
    : `${d} L${points[points.length - 1].x} ${baselineY} L${points[0].x} ${baselineY} Z`;

/**
 * One pie/donut slice as SVG path data.
 *
 * Angles are in radians measured clockwise from twelve o'clock, which is where
 * a reader's eye starts. `innerR` of 0 gives a pie; anything larger gives a
 * donut ring.
 */
export function arcPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const sweep = endAngle - startAngle;
  // A slice covering the whole circle cannot be drawn as a single arc — the
  // start and end points coincide and the renderer draws nothing at all. Two
  // half-arcs are the standard workaround.
  if (sweep >= Math.PI * 2 - 1e-9) {
    const half = startAngle + Math.PI;
    return (
      arcPath(cx, cy, innerR, outerR, startAngle, half) +
      ' ' +
      arcPath(cx, cy, innerR, outerR, half, startAngle + Math.PI * 2)
    );
  }
  const at = (r, a) => ({ x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) });
  const large = sweep > Math.PI ? 1 : 0;
  const o0 = at(outerR, startAngle);
  const o1 = at(outerR, endAngle);
  if (innerR <= 0) {
    return `M${cx} ${cy} L${o0.x} ${o0.y} A${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y} Z`;
  }
  const i1 = at(innerR, endAngle);
  const i0 = at(innerR, startAngle);
  return (
    `M${o0.x} ${o0.y} A${outerR} ${outerR} 0 ${large} 1 ${o1.x} ${o1.y} ` +
    `L${i1.x} ${i1.y} A${innerR} ${innerR} 0 ${large} 0 ${i0.x} ${i0.y} Z`
  );
}

/**
 * Slice angles for a set of values.
 *
 * Negative values are dropped rather than mirrored: a pie encodes parts of a
 * whole, and a negative part of a whole has no meaning. Callers get the count
 * back so they can say so rather than silently showing a different total.
 */
export function sliceAngles(values, { startAngle = 0 } = {}) {
  const usable = values.map((v) => (v > 0 ? v : 0));
  const total = usable.reduce((a, b) => a + b, 0);
  const dropped = values.filter((v) => v <= 0).length;
  if (total <= 0) return { slices: [], total: 0, dropped };
  let a = startAngle;
  const slices = usable.map((v) => {
    const sweep = (v / total) * Math.PI * 2;
    const s = { start: a, end: a + sweep, value: v, fraction: v / total };
    a += sweep;
    return s;
  });
  return { slices, total, dropped };
}

/** Round tick values across a range, for gridlines and axis labels. */
export function ticks({ min, max }, count = 4) {
  if (count < 1) return [];
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(raw) || 1)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10;
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    // Floating-point accumulation turns 0.30000000000000004 into a tick label.
    out.push(Number(v.toFixed(10)));
  }
  return out;
}
