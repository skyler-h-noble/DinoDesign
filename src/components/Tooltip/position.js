// src/components/Tooltip/position.js
//
// Places a floating element against an anchor the way the Tooltip always was
// placed — Popper.js's default pipeline as MUI's Tooltip ran it — without the
// dependency: the base placement, `flip` to the opposite side (and variation)
// when it would leave the viewport, `preventOverflow` sliding it along the
// edge (tethered, so the arrow never leaves the anchor), the `arrow` offset
// (4px padding), `hide`, and the same output styles — position: absolute at
// 0,0 (or bottom / right 0 for a top or end placement, Popper's "adaptive"
// sides) moved by a DPR-rounded translate. Keeping the output identical keeps
// the shrink-to-fit width identical, so a tooltip near an edge wraps where it
// always did.

const OPP = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
const basePart = (p) => p.split('-')[0];
const variationPart = (p) => p.split('-')[1];
const mainAxisOf = (b) => (b === 'top' || b === 'bottom' ? 'x' : 'y');
const oppositePlacement = (p) => p.replace(/left|right|bottom|top/g, (m) => OPP[m]);
const oppositeVariation = (p) => p.replace(/start|end/g, (m) => (m === 'start' ? 'end' : 'start'));
const within = (min, v, max) => Math.max(min, Math.min(v, max));
const isEl = (n) => n && n.nodeType === 1;

function layoutRect(el) {
  const r = el.getBoundingClientRect();
  let width = el.offsetWidth;
  let height = el.offsetHeight;
  if (Math.abs(r.width - width) <= 1) width = r.width;
  if (Math.abs(r.height - height) <= 1) height = r.height;
  return { x: el.offsetLeft, y: el.offsetTop, width, height };
}

/* Popper's getOffsetParent: the positioned ancestor, or the window when that
   would be a static <html> / <body>. */
function offsetParentOf(el) {
  const op = el.offsetParent;
  if (!op) return window;
  if ((op.nodeName === 'HTML' || op.nodeName === 'BODY') && getComputedStyle(op).position === 'static') return window;
  return op;
}

/** The anchor's rect relative to the popper's offset parent. */
function compositeRect(el, op) {
  const r = el.getBoundingClientRect();
  if (op === window) {
    const html = document.documentElement;
    const barX = html.getBoundingClientRect().left + window.pageXOffset;
    return { x: r.left + window.pageXOffset - barX, y: r.top + window.pageYOffset, width: r.width, height: r.height };
  }
  const o = op.getBoundingClientRect();
  const scroll = op.nodeName !== 'BODY' ? { left: op.scrollLeft, top: op.scrollTop } : { left: 0, top: 0 };
  return {
    x: r.left + scroll.left - (o.left + op.clientLeft),
    y: r.top + scroll.top - (o.top + op.clientTop),
    width: r.width,
    height: r.height,
  };
}

function computeOffsets(ref, el, placement) {
  const b = basePart(placement);
  const v = variationPart(placement);
  const cx = ref.x + ref.width / 2 - el.width / 2;
  const cy = ref.y + ref.height / 2 - el.height / 2;
  let o;
  if (b === 'top') o = { x: cx, y: ref.y - el.height };
  else if (b === 'bottom') o = { x: cx, y: ref.y + ref.height };
  else if (b === 'right') o = { x: ref.x + ref.width, y: cy };
  else o = { x: ref.x - el.width, y: cy };
  const axis = mainAxisOf(b);
  const len = axis === 'y' ? 'height' : 'width';
  if (v === 'start') o[axis] -= ref[len] / 2 - el[len] / 2;
  else if (v === 'end') o[axis] += ref[len] / 2 - el[len] / 2;
  return o;
}

const OVERFLOWING = /auto|scroll|overlay|hidden/;
function isScrollParent(el) {
  const cs = getComputedStyle(el);
  return OVERFLOWING.test(cs.overflow + cs.overflowY + cs.overflowX);
}

/* The clipping rect: the viewport, cut down by every clipping ancestor of the
   element (none for a popper on <body>, which escapes them all). */
function clippingRect(el) {
  const vv = window.visualViewport;
  const html = document.documentElement;
  let rect = { top: 0, left: 0, right: vv ? vv.width : html.clientWidth, bottom: vv ? vv.height : html.clientHeight };
  const pos = getComputedStyle(el).position;
  const clipper = pos === 'absolute' || pos === 'fixed' ? offsetParentOf(el) : el;
  if (!isEl(clipper)) return rect;
  for (let n = el.parentNode; n && isEl(n) && n.nodeName !== 'BODY' && n.nodeName !== 'HTML'; n = n.parentNode) {
    if (!isScrollParent(n) || !n.contains(clipper)) continue;
    const r = n.getBoundingClientRect();
    const top = r.top + n.clientTop;
    const left = r.left + n.clientLeft;
    rect = {
      top: Math.max(top, rect.top),
      left: Math.max(left, rect.left),
      right: Math.min(left + n.clientWidth, rect.right),
      bottom: Math.min(top + n.clientHeight, rect.bottom),
    };
  }
  return rect;
}

function detectOverflow(st, placement, { elementContext = 'popper', altBoundary = false } = {}) {
  const clip = clippingRect(altBoundary ? st.reference : st.popper);
  const refClient = st.reference.getBoundingClientRect();
  const o = computeOffsets(refClient, st.rects.popper, placement);
  const pr = { top: o.y, left: o.x, bottom: o.y + st.rects.popper.height, right: o.x + st.rects.popper.width };
  const e = elementContext === 'popper' ? pr : refClient;
  return { top: clip.top - e.top, bottom: e.bottom - clip.bottom, left: clip.left - e.left, right: e.right - clip.right };
}

function flip(st, preferred) {
  const b = basePart(preferred);
  const fallbacks = b === preferred
    ? [oppositePlacement(preferred)]
    : [oppositeVariation(preferred), oppositePlacement(preferred), oppositeVariation(oppositePlacement(preferred))];
  const placements = [preferred, ...fallbacks];
  const checksMap = new Map();
  for (const p of placements) {
    const pb = basePart(p);
    const isStart = variationPart(p) === 'start';
    const vertical = pb === 'top' || pb === 'bottom';
    const len = vertical ? 'width' : 'height';
    const ov = detectOverflow(st, p, { altBoundary: st.altBoundary });
    let mainVar = vertical ? (isStart ? 'right' : 'left') : (isStart ? 'bottom' : 'top');
    if (st.rects.reference[len] > st.rects.popper[len]) mainVar = OPP[mainVar];
    const altVar = OPP[mainVar];
    const checks = [ov[pb] <= 0, ov[mainVar] <= 0, ov[altVar] <= 0];
    if (checks.every(Boolean)) return p;
    checksMap.set(p, checks);
  }
  for (let n = 3; n > 0; n--) {
    const fit = placements.find((p) => checksMap.get(p).slice(0, n).every(Boolean));
    if (fit) return fit;
  }
  return preferred;
}

const PAD = 4; // MUI's arrow padding

/**
 * Compute and write the popper's (and arrow's) styles. Returns the placement
 * used, so the caller can set data-popper-placement.
 *  st: { reference, popper, arrow, placement, altBoundary }
 */
export function computePosition({ reference, popper, arrow, placement: preferred, altBoundary = false }) {
  const op = offsetParentOf(popper);
  const st = {
    reference, popper, altBoundary,
    rects: { reference: compositeRect(reference, op), popper: layoutRect(popper) },
  };
  const placement = flip(st, preferred);
  const b = basePart(placement);
  const variation = variationPart(placement);
  const offsets = computeOffsets(st.rects.reference, st.rects.popper, placement);
  const refR = st.rects.reference;
  const popR = st.rects.popper;

  // preventOverflow — main axis, tethered.
  const axis = mainAxisOf(b);
  const minSide = axis === 'y' ? 'top' : 'left';
  const maxSide = axis === 'y' ? 'bottom' : 'right';
  const len = axis === 'y' ? 'height' : 'width';
  const ov = detectOverflow(st, placement, { altBoundary });
  const offset = offsets[axis];
  const min = offset + ov[minSide];
  const max = offset - ov[maxSide];
  const additive = -popR[len] / 2;
  const minLen = variation === 'start' ? refR[len] : popR[len];
  const maxLen = variation === 'start' ? -popR[len] : -refR[len];
  const arrowRect = arrow ? layoutRect(arrow) : { width: 0, height: 0 };
  const padMin = arrow ? PAD : 0;
  const padMax = arrow ? PAD : 0;
  const arrowLen = within(0, refR[len], arrowRect[len]);
  const minOffset = !variation ? refR[len] / 2 - additive - arrowLen - padMin : minLen - arrowLen - padMin;
  const maxOffset = !variation ? -refR[len] / 2 + additive + arrowLen + padMax : maxLen + arrowLen + padMax;
  const arrowOP = arrow ? offsetParentOf(arrow) : null;
  const clientOffset = isEl(arrowOP) ? (axis === 'y' ? arrowOP.clientTop : arrowOP.clientLeft) || 0 : 0;
  const tetherMin = offset + minOffset - clientOffset;
  const tetherMax = offset + maxOffset;
  const prevented = within(Math.min(min, tetherMin), offset, Math.max(max, tetherMax));
  offsets[axis] = prevented;
  const preventedData = { x: 0, y: 0, [axis]: prevented - offset };

  // arrow
  let arrowData = null;
  if (arrow) {
    const vertical = b === 'left' || b === 'right';
    const alen = vertical ? 'height' : 'width';
    const endDiff = refR[alen] + refR[axis] - offsets[axis] - popR[alen];
    const startDiff = offsets[axis] - refR[axis];
    const clientSize = isEl(arrowOP) ? (axis === 'y' ? arrowOP.clientHeight : arrowOP.clientWidth) || 0 : 0;
    const centerToReference = endDiff / 2 - startDiff / 2;
    const center = clientSize / 2 - arrowRect[alen] / 2 + centerToReference;
    arrowData = { [axis]: within(PAD, center, clientSize - arrowRect[alen] - PAD) };
  }

  // hide
  const side = (o, r, p = { x: 0, y: 0 }) => ({
    top: o.top - r.height - p.y, right: o.right - r.width + p.x, bottom: o.bottom - r.height + p.y, left: o.left - r.width - p.x,
  });
  const clipped = (o) => ['top', 'right', 'bottom', 'left'].some((k) => o[k] >= 0);
  const refHidden = clipped(side(detectOverflow(st, placement, { elementContext: 'reference' }), refR));
  const escaped = clipped(side(detectOverflow(st, placement, { altBoundary: true }), popR, preventedData));

  // computeStyles — adaptive, GPU, DPR-rounded.
  const dpr = window.devicePixelRatio || 1;
  const round = (n) => Math.round(n * dpr) / dpr || 0;
  const translate = (x, y) => (dpr <= 1 ? `translate(${x}px, ${y}px)` : `translate3d(${x}px, ${y}px, 0)`);
  let { x, y } = offsets;
  let sideX = 'left';
  let sideY = 'top';
  const parent = op === window ? document.documentElement : op;
  const scrollSize = op === window && getComputedStyle(parent).position !== 'static';
  if (b === 'top' || ((b === 'left' || b === 'right') && variation === 'end')) {
    sideY = 'bottom';
    y -= (scrollSize ? parent.scrollHeight : parent.clientHeight) - popR.height;
  }
  if (b === 'left' || ((b === 'top' || b === 'bottom') && variation === 'end')) {
    sideX = 'right';
    x -= (scrollSize ? parent.scrollWidth : parent.clientWidth) - popR.width;
  }
  const ps = popper.style;
  ps.position = 'absolute';
  ps.top = 'auto'; ps.right = 'auto'; ps.bottom = 'auto'; ps.left = 'auto';
  ps[sideY] = '0';
  ps[sideX] = '0';
  ps.margin = '0';
  ps.transform = translate(round(x), round(y));
  if (refHidden) popper.setAttribute('data-popper-reference-hidden', ''); else popper.removeAttribute('data-popper-reference-hidden');
  if (escaped) popper.setAttribute('data-popper-escaped', ''); else popper.removeAttribute('data-popper-escaped');
  if (arrow && arrowData) {
    const as = arrow.style;
    as.position = 'absolute';
    if (axis === 'x') { as.top = ''; as.left = '0'; as.transform = translate(round(arrowData.x), 0); }
    else { as.left = ''; as.top = '0'; as.transform = translate(0, round(arrowData.y)); }
  }
  return placement;
}
