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
