// src/docs/StatesGrid.js
//
// Every state of a component at once, drawn by the REAL component.
//
// Hover, Pressed and Focus-Visible are forced the way the studio's parity page
// does it: each rule that says :hover / :active / :focus-visible / :focus-within
// is copied once more with the pseudo-class swapped for a wrapper class, so a
// cell wrapped in `forced-hover` paints with the component's OWN hover rules.
// Nothing is restyled by hand — a hand-written hover would show the copy, not
// the component.
//
// A control nested inside another keeps its own state: wrap it in
// `.forced-own-state` and the copies skip it (an Input's end button is not
// hovered because the Input is).
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Caption } from '../components/Typography';

const STATES = [
  { pseudo: ':hover', cls: 'forced-hover' },
  { pseudo: ':active', cls: 'forced-active' },
  { pseudo: ':focus-visible', cls: 'forced-focus-visible' },
  { pseudo: ':focus-within', cls: 'forced-focus-visible' },
];
const OWN = 'forced-own-state';
const STYLE_ID = 'docs-forced-states';

function guard(sel) {
  // [data-own-state]: a control that marks ITSELF as keeping its own state
  // (NumberField's steppers), where the doc cannot wrap it from outside.
  const g = `:not(.${OWN}, .${OWN} *, [data-own-state], [data-own-state] *)`;
  const m = sel.match(/::?(before|after|placeholder|marker|selection)$/);
  return m ? sel.slice(0, m.index) + g + m[0] : sel + g;
}

function rewrite(selectorText) {
  const out = [];
  for (const { pseudo, cls } of STATES) {
    if (!selectorText.includes(pseudo)) continue;
    const parts = selectorText.split(',').filter((p) => p.includes(pseudo))
      .map((p) => `.${cls} ${guard(p.trim().split(pseudo).join(''))}`);
    if (parts.length) out.push(parts.join(', '));
  }
  return out;
}

function collect(rules, into) {
  for (const r of Array.from(rules)) {
    if (r.selectorText) {
      for (const sel of rewrite(r.selectorText)) into.push(`${sel} { ${r.style.cssText} }`);
    } else if (r.cssRules) {
      collect(r.cssRules, into);
    }
  }
}

/** Rebuild the forced-state copies from every stylesheet on the page. */
export function refreshForcedStates() {
  if (typeof document === 'undefined') return;
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.ownerNode && sheet.ownerNode.id === STYLE_ID) continue;
    let list;
    try { list = sheet.cssRules; } catch (e) { continue; }
    collect(list, rules);
  }
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = rules.join('\n');
}

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * rows: [{ label, state?: 'hover' | 'active' | 'focus-visible', render: () => node }]
 * The cell is inert to the real pointer, so what you see is the forced state,
 * not wherever the mouse happens to be.
 */
export function StatesGrid({ rows }) {
  const ref = useRef(null);
  useIso(() => {
    /* Emotion inserts a component's rules when it first renders, so copy after
       paint — and once more a frame later for anything that rendered late. */
    refreshForcedStates();
    /* inert: a sample, not a control — out of the tab order and the
       accessibility tree, so a keyboard user does not tab through twelve
       copies of the same field. (Set here: React 18 has no `inert` prop.) */
    ref.current?.querySelectorAll('.states-cell').forEach((c) => c.setAttribute('inert', ''));
    const id = requestAnimationFrame(refreshForcedStates);
    return () => cancelAnimationFrame(id);
  }, [rows]);
  return (
    <Box ref={ref} className="states-grid" sx={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', columnGap: 'var(--Sizing-3, 24px)', rowGap: 'var(--Sizing-2, 16px)', alignItems: 'center' }}>
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <Caption color="quiet">{r.label}</Caption>
          <Box className={'states-cell' + (r.state ? ' forced-' + r.state : '')}
            sx={{ pointerEvents: 'none', minWidth: 0, textAlign: 'left' }}>
            {r.render()}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}

export const FORCED_OWN_STATE = OWN;
export default StatesGrid;
