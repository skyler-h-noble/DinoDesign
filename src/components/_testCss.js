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
