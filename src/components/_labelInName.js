/* _labelInName.js — keeps an interactive element's name in line with its
 * visible text (WCAG 2.5.3 Label in Name; axe label-content-name-mismatch).
 *
 * WHY THIS EXISTS
 * A control that shows text is already named by that text. An aria-label on
 * top of it REPLACES the name, and in practice the replacement differs from
 * what is on screen — "Linen Throw, $40" on a card that reads "Sale  Linen
 * Throw  $40", "Add item" on a button that says "Add to cart". A voice-control
 * user says what they see and nothing happens. Clean-room AI builds produced
 * this on every store page; the contrast and states the design system owns
 * came out clean, this did not.
 *
 * WHAT IT DOES
 * Only when the caller passes `aria-label` or `aria-labelledby` — with
 * neither, `labelInName` returns null on its first line: no hook, no ref, no
 * DOM read. Otherwise:
 *
 *   aria-label that does not CONTAIN the visible text (case, whitespace and
 *   punctuation ignored, as axe compares them)
 *     development: console.warn once per component, naming the fix
 *     production:  the aria-label is dropped, so the visible text names it
 *
 *   aria-labelledby that neither points at the element itself nor at text
 *   containing the visible text
 *     development: console.warn once per component
 *     production:  the element's own id is put FIRST in aria-labelledby
 *                  (an id is generated if it has none), so the name starts
 *                  with what is on screen and keeps the extra context
 *
 * No visible text (an icon-only control) leaves both attributes untouched —
 * there the label is required, and the components' own warnings say so.
 *
 * HOW THE TEXT IS READ
 * Children made only of strings, numbers and plain host elements (<span>,
 * <strong>, …) are read from the React tree during render — no DOM, works
 * in server rendering. Anything else (a <Body>, an image, a component) is read
 * once from the mounted DOM through a callback ref: text nodes only, skipping
 * <svg> and aria-hidden subtrees — textContent, never innerText, so it causes
 * no layout. The result is cached on the node per label value, so a re-render
 * does not read it again.
 *
 * Why production FIXES and development only warns: the visible-text name is
 * always a correct name, and a mismatching label is always a 2.5.3 failure,
 * so shipping the fix is safe. In development the label is left alone so the
 * warning and the code agree, and the author removes it at the source.
 */
import { Fragment } from 'react';

/* axe strips punctuation and symbols, then collapses whitespace, before it
   compares (curateString in label-content-name-mismatch). Same here, so the
   guard and the checker agree on what "contains" means.
   ASCII punctuation and symbols, Latin-1 punctuation, general punctuation
   (dashes, curly quotes, ellipsis) and currency signs. A character class, not
   \p{P}: a transpiler expands Unicode property escapes into kilobytes. */
const PUNCT = /[!-\/:-@[-`{-~\u00A1-\u00BF\u00D7\u00F7\u2010-\u205E\u20A0-\u20CF]/g;

export function normalizeName(s) {
  return String(s == null ? '' : s).replace(PUNCT, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

/** True when `label` contains `text` once both are normalized. Empty text is
 *  always contained (nothing visible to match). */
export function nameContains(label, text) {
  const t = normalizeName(text);
  if (!t) return true;
  return normalizeName(label).includes(t);
}

const SKIP_TAGS = { svg: 1, img: 1, picture: 1, video: 1, audio: 1, canvas: 1, iframe: 1 };

/**
 * Visible text of a children tree read without rendering, or null when it
 * cannot be known from the tree alone (a component element, a function).
 */
export function staticText(children) {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    let out = '';
    for (let i = 0; i < children.length; i++) {
      const t = staticText(children[i]);
      if (t === null) return null;
      if (t) out += (out ? ' ' : '') + t;
    }
    return out;
  }
  if (typeof children === 'object' && children.$$typeof && typeof children.type === 'string') {
    const p = children.props || {};
    if (SKIP_TAGS[children.type] || p['aria-hidden'] === true || p['aria-hidden'] === 'true' || p.hidden) return '';
    return staticText(p.children);
  }
  /* A fragment's children are readable too. */
  if (typeof children === 'object' && children.$$typeof && children.type === Fragment) {
    return staticText(children.props && children.props.children);
  }
  return null;
}

/** Visible text of a mounted element: its text nodes, minus svg / aria-hidden
 *  / hidden subtrees. No layout is read. */
export function domText(root) {
  if (!root || typeof document === 'undefined' || !document.createTreeWalker) return '';
  const SKIP = 'svg,[aria-hidden="true"],[hidden],img,picture,video,audio,canvas,iframe,script,style,template';
  const walker = document.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */, {
    acceptNode(n) {
      const el = n.parentElement;
      const hit = el && el.closest(SKIP);
      return hit && (hit === root || root.contains(hit)) ? 2 /* REJECT */ : 1 /* ACCEPT */;
    },
  });
  const parts = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const v = n.nodeValue;
    if (v && v.trim()) parts.push(v);
  }
  return parts.join(' ');
}

/* Every call site is wrapped in a literal `process.env.NODE_ENV !== 'production'`
   check, so an app's production build drops the warnings and their text. */
const warned = new Set();
function warnOnce(component, kind, message) {
  const key = component + ':' + kind;
  if (warned.has(key)) return;
  warned.add(key);
  // eslint-disable-next-line no-console
  console.warn('[OmniDesign] <' + component + '> ' + message);
}
/** Test hook: forget which warnings already fired. */
export function _resetLabelInNameWarnings() { warned.clear(); }

const labelMessage = (label, text) =>
  'has aria-label="' + label + '" but shows "' + text.trim().replace(/\s+/g, ' ').slice(0, 60)
  + '". Remove aria-label — the visible text already names it (WCAG 2.5.3, axe '
  + 'label-content-name-mismatch: a voice-control user says what they see). '
  + 'In production builds the label is dropped.';
const labelledbyMessage = (text) =>
  'has aria-labelledby that replaces its visible text "' + text.trim().replace(/\s+/g, ' ').slice(0, 60)
  + '". Remove aria-labelledby, or put the element\'s own id first in it so the name '
  + 'starts with what is on screen (WCAG 2.5.3). In production builds its own id is added first.';

let seq = 0;

/* The DOM-time check. Runs once per node and label pair. */
function checkNode(component, node, label, labelledby) {
  const key = label + '\u0000' + labelledby;
  if (node.__omniNameChecked === key) return;
  node.__omniNameChecked = key;
  const text = domText(node);
  if (!normalizeName(text)) return; // icon-only: the label is the name
  if (label != null && labelledby == null && !nameContains(label, text)) {
    if (process.env.NODE_ENV !== 'production') warnOnce(component, 'label', labelMessage(label, text));
    else node.removeAttribute('aria-label');
  }
  if (labelledby != null) {
    const ids = String(labelledby).split(/\s+/).filter(Boolean);
    if (node.id && ids.includes(node.id)) return;
    const refText = ids.map((id) => {
      const el = node.ownerDocument.getElementById(id);
      return el ? el.textContent : '';
    }).join(' ');
    if (nameContains(refText, text)) return;
    if (process.env.NODE_ENV !== 'production') warnOnce(component, 'labelledby', labelledbyMessage(text));
    else {
      if (!node.id) node.id = 'omni-name-' + (++seq);
      node.setAttribute('aria-labelledby', [node.id, ...ids].join(' '));
    }
  }
}

/**
 * The guard. Call during render with the props about to reach the DOM and the
 * children that make the element's visible text.
 *
 *   const guard = labelInName('Link', props, children);
 *   // guard === null              → nothing to do (no aria-label / -labelledby)
 *   // guard.props                 → props to render (a mismatching aria-label
 *   //                               already removed in production)
 *   // guard.ref                   → callback ref to attach to the DOM node, or
 *   //                               null when the text was read from the tree
 *
 * `dom: false` skips the DOM read for children that cannot be read from the
 * tree (for components that cannot take a ref cheaply).
 */
export function labelInName(component, props, children, { dom = true } = {}) {
  const label = props['aria-label'];
  const labelledby = props['aria-labelledby'];
  if (label == null && labelledby == null) return null;

  const text = staticText(children);
  if (text !== null && labelledby == null) {
    /* Known now: decide during render. */
    if (!normalizeName(text) || nameContains(label, text)) return { props, ref: null };
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(component, 'label', labelMessage(label, text));
      return { props, ref: null };
    }
    const { 'aria-label': _drop, ...rest } = props;
    return { props: rest, ref: null };
  }
  if (text !== null && !normalizeName(text)) return { props, ref: null };
  if (!dom) return { props, ref: null };
  return { props, ref: (node) => { if (node) checkNode(component, node, label, labelledby); } };
}

/** One ref from two (either may be null, a function or a ref object). */
export function mergeRefs(a, b) {
  if (!a) return b;
  if (!b) return a;
  return (node) => {
    [a, b].forEach((r) => {
      if (typeof r === 'function') r(node);
      else if (r) r.current = node;
    });
  };
}
