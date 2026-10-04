/**
 * A selected row's ring is the SURFACE border, not a button's.
 *
 * Figma draws it as a sibling frame 2px larger than the row, stroked with
 * Border at Menu/Menu-Item-Radius — a 1px outline sitting just outside. The
 * stroke in the file was bound to the BUTTONS collection's `Border` rather
 * than Surface's: same variable name, different collection, which is as easy
 * to pick wrong as it sounds and reads as correct in every panel afterwards.
 *
 * The lib was already right, which is the only reason the drift was one-sided
 * and recoverable. Nothing asserted it, though, so "already right" was luck
 * holding rather than a decision being kept — and the next person reaching for
 * a border on a selected thing has a button-shaped one within reach.
 *
 * A button token here would also be wrong in a way that does not look wrong:
 * --Buttons-*-Border carries the palette of the BUTTON mode, so a list inside
 * a frame whose Buttons mode differs from its Theme would outline its selected
 * row in a color nothing else on the surface uses.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { List } from './List';

/** The ::before rules that apply to this element. */
function beforeRulesFor(el) {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      const sel = r.selectorText;
      if (!sel || !sel.includes('::before')) continue;
      if (!classes.some((c) => sel.includes('.' + c))) continue;
      out.push(r.cssText);
    }
  }
  return out.join('\n');
}

const items = [{ primary: 'One' }, { primary: 'Two' }];

const selectedRow = () => {
  const { container } = render(
    <List selectionMode="radio" items={items} selectedIndices={[0]}
          onSelectionChange={() => {}} />);
  const row = container.querySelector('[aria-selected="true"]');
  expect(row).toBeTruthy();
  return row;
};

describe('the selected row ring', () => {
  test('is painted with --Border', () => {
    expect(beforeRulesFor(selectedRow())).toMatch(/border:[^;}]*var\(--Border\)/);
  });

  /* Asserted as an ABSENCE, which is usually a weak test — here it is the
     whole point. The failure being guarded is a plausible token quietly
     replacing a correct one, and only its absence says the right one is still
     doing the work. --Border-Variant is included because it is the other
     one within reach: it is the DECORATIVE border, carries no contrast
     requirement, and a selected state is not decoration. */
  test('is not a button border, nor the decorative one', () => {
    const css = beforeRulesFor(selectedRow());
    expect(css).not.toMatch(/--Buttons-/);
    expect(css).not.toMatch(/--Border-Variant/);
  });
});
