// src/components/_testCss.js
//
// Test helper: the CSS that applies to an element — every rule whose selector
// matches it, plus its inline style — whether the rule came from emotion or a
// static component sheet. Tests used to look up the element's emotion class
// (css-xyz), which finds nothing once a component renders from static classes.
export function cssFor(el) {
  if (!el) return '';
  const rules = Array.from(document.styleSheets)
    .flatMap((sheet) => { try { return Array.from(sheet.cssRules || []); } catch (e) { return []; } })
    .filter((r) => {
      if (!r.selectorText) return false;
      try { return el.matches(r.selectorText); } catch (e) {
        // A selector jsdom cannot parse (e.g. :where) — match it per part.
        return r.selectorText.split(',').some((part) => {
          try { return el.matches(part.trim()); } catch (e2) { return false; }
        });
      }
    })
    .map((r) => r.cssText);
  const inline = el.getAttribute && el.getAttribute('style');
  return rules.concat(inline ? ['{' + inline + '}'] : []).join('\n');
}

/* A selector's weight: [ids, classes + attributes + pseudo-classes, elements].
   :where() weighs nothing; good enough for the selectors this lib writes. */
function specificity(sel) {
  const s = sel.replace(/:where\([^)]*\)/g, '').replace(/::[\w-]+/g, ' ');
  const ids = (s.match(/#[\w-]+/g) || []).length;
  const cls = (s.match(/\.[\w-]+|\[[^\]]*\]|:(?!:)[\w-]+(\([^)]*\))?/g) || []).length;
  const els = (s.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;
  return [ids, cls, els];
}
const heavier = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** The value that wins for one property on an element: the matching rules
 *  ordered by selector weight, then source order, then the inline style — the
 *  cascade, minus !important. Reads custom properties too, so a test can
 *  follow --x: var(--Token). */
export function declared(el, prop) {
  const re = new RegExp('(?:^|[;{\\s])' + prop.replace(/[-]/g, '\\-') + ':\\s*([^;}]+)', 'g');
  const hits = [];
  let order = 0;
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = Array.from(sheet.cssRules || []); } catch (e) { continue; }
    for (const r of list) {
      if (!r.selectorText) continue;
      const parts = r.selectorText.split(',').map((x) => x.trim()).filter((part) => {
        try { return el.matches(part); } catch (e) { return false; }
      });
      if (!parts.length) continue;
      const weight = parts.map(specificity).sort(heavier).pop();
      for (const m of r.cssText.matchAll(re)) hits.push({ weight, order: order++, value: m[1].trim() });
    }
  }
  hits.sort((a, b) => heavier(a.weight, b.weight) || a.order - b.order);
  let value = hits.length ? hits[hits.length - 1].value : undefined;
  const inline = el.getAttribute && el.getAttribute('style');
  if (inline) for (const m of ('{' + inline).matchAll(re)) value = m[1].trim();
  return value;
}

/* The style rules in every sheet, flattened out of @supports / @media blocks
   that apply in jsdom (it applies neither, so their contents are skipped). */
function styleRules() {
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = Array.from(sheet.cssRules || []); } catch (e) { continue; }
    for (const r of list) if (r.selectorText && r.style) out.push(r);
  }
  return out;
}

const STATE_RE = /:(hover|active|focus-visible|disabled)\b|\.Mui-(focusVisible|disabled)\b/;
const STATE_NAME = { 'focus-visible': 'focusVisible' };

/** What applies to an element at rest and in each interaction state — the
 *  WINNING declaration per property (selector weight, then source order),
 *  with private custom properties (--_x) replaced by what the element
 *  declares for them, so a test sees the real token.
 *
 *  Returns { base, states: { hover, active, focusVisible, disabled } }, each a
 *  `prop: value;` text, plus `all`: every part as `:state{…}` rules, for tests
 *  that match a state and a value together. Emotion's rules and static sheet
 *  rules read the same way. */
export function stateRules(el) {
  const buckets = { base: [] };
  let order = 0;
  for (const r of styleRules()) {
    for (const part of r.selectorText.split(',').map((x) => x.trim())) {
      if (part.includes('::')) continue;
      const m = part.match(STATE_RE);
      const state = m ? (STATE_NAME[m[1]] || m[1] || m[2]) : 'base';
      const bare = part.replace(new RegExp(STATE_RE.source, 'g'), '') || '*';
      let hit = false; try { hit = el.matches(bare); } catch (e) { hit = false; }
      if (!hit) continue;
      const weight = specificity(part);
      const o = order++;
      for (let i = 0; i < r.style.length; i++) {
        const prop = r.style[i];
        (buckets[state] = buckets[state] || []).push({
          prop, value: r.style.getPropertyValue(prop).trim(), important: r.style.getPropertyPriority(prop) === 'important', weight, order: o,
        });
      }
    }
  }
  const inline = el.getAttribute && el.getAttribute('style');
  if (inline) {
    for (const m of inline.matchAll(/(--[\w-]+|[a-z-]+)\s*:\s*([^;]+)/g)) buckets.base.push({ prop: m[1], value: m[2].trim(), weight: [9, 0, 0], order: order++ });
  }
  const winners = (list) => {
    const best = new Map();
    for (const d of list || []) {
      const cur = best.get(d.prop);
      const beats = !cur
        || (d.important && !cur.important)
        || (d.important === cur.important && (heavier(d.weight, cur.weight) > 0 || (heavier(d.weight, cur.weight) === 0 && d.order > cur.order)));
      if (beats) best.set(d.prop, d);
    }
    return best;
  };
  const baseWin = winners(buckets.base);
  const priv = (v, depth = 0) => (depth > 4 ? v : v.replace(/var\((--_[\w-]+)\)/g, (all, name) => {
    const d = baseWin.get(name); return d ? priv(d.value, depth + 1) : all;
  }));
  const text = (map) => [...map.values()].filter((d) => !d.prop.startsWith('--_'))
    .map((d) => `${d.prop}: ${priv(d.value)}${d.important ? ' !important' : ''};`).join(' ');
  /* An !important rest declaration holds in every state, so it competes with
     each state's own rules — and wins, as it does in the browser. */
  const restImportant = (buckets.base || []).filter((d) => d.important);
  const states = {};
  for (const k of Object.keys(buckets)) {
    if (k === 'base') continue;
    const own = new Set(buckets[k].map((d) => d.prop));
    states[k] = text(winners([...restImportant.filter((d) => own.has(d.prop)), ...buckets[k]]));
  }
  if (states.focusVisible !== undefined) states['focus-visible'] = states.focusVisible;
  const base = text(baseWin);
  const all = ['{' + base + '}', ...Object.entries(states).map(([k, v]) => `:${k}{${v}}`)].join('\n');
  return { base, states, all };
}
