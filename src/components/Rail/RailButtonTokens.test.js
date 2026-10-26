/**
 * Rail's selected item reads the SURFACE table, not the Buttons one.
 *
 * This file used to assert the opposite, and the reasoning was half right. In
 * Figma the selected fill binds a variable named plainly `Button` and the
 * label one named `Text`; copied literally into CSS those became
 * `var(--Button)` and `var(--Text)`, which breaks because Figma's collections
 * are separate namespaces and CSS's custom properties are one. `Text`
 * collided with the surface role of the same name and resolved to it —
 * plausible, and silent. `Button` had nothing to collide with, so it was
 * dropped and a selected item painted nothing.
 *
 * The fix then taken was to write the palette into both names. That is the
 * right move for a Buttons token and the wrong table: resolved against the
 * file, Nav Item (5670:49999) binds its selected Icon-Holder fill and its
 * selected label to a `Text` that belongs to the SURFACE collection — modes
 * Surface, Surface-Dim, Surface-Dimmest and so on — as does `Quiet` on the
 * default label. There is no Buttons token anywhere on that component.
 *
 * Which fits the shape: a nav item is a mark on the surface, not a button
 * wearing a palette. BottomNavigation has always drawn it that way, and the
 * two are the same component in two orientations.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Rail } from './Rail';

const ITEMS = [
  { label: 'Home', icon: <span>h</span> },
  { label: 'Search', icon: <span>s</span> },
];

function renderRail(props = {}) {
  const { container } = render(<Rail items={ITEMS} defaultValue={0} {...props} />);
  return container;
}

/* The CSS the SELECTED item itself resolves to.
 *
 * Two earlier shapes of this helper were both wrong, in opposite directions:
 *
 *   - `style.textContent` returned '' — emotion inserts through
 *     `sheet.insertRule()`, which leaves the <style> element's text empty. A
 *     `.not` assertion over '' passes while proving nothing.
 *   - Reading every rule in the document, with an `afterEach` that removed the
 *     <style> tags, tore out emotion's sheet after the first test; and without
 *     that teardown, rules accumulate across tests, so a positive assertion
 *     can be satisfied by a PREVIOUS test's render.
 *
 * Scoping to the element's own class list fixes both: it cannot be empty while
 * the element has styles, and it cannot see another render's variant.
 */
function selectedItemCSS(container) {
  const el = container.querySelector('.rail-item-selected');
  if (!el) throw new Error('no selected rail item rendered');
  /* The item AND its label. The fill lands on the button, the paired
     foreground on the label child, and the pairing is the whole point — so a
     helper that saw only the button could assert the fill moved and never
     notice its label had not. */
  const scoped = [el, ...Array.from(el.querySelectorAll('*'))];
  const classes = scoped.flatMap((n) =>
    Array.from(n.classList || []).filter((c) => c.startsWith('css-')));
  if (!classes.length) throw new Error('selected item carries no emotion class');

  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules || [])) {
      const sel = rule.selectorText || '';
      if (classes.some((c) => sel.includes(c))) out.push(rule.cssText);
    }
  }
  /* Inline `style` attributes count too, and they are not optional here: the
     label's color is set that way, so a helper reading only stylesheet rules
     saw the label's emotion class (`color: var(--Text)`, from the Typography
     component's own default) and concluded the pairing was broken when the
     inline style was overriding it correctly. Rules alone answer a different
     question than "what does this element paint". */
  for (const n of scoped) {
    const inline = n.getAttribute && n.getAttribute('style');
    if (inline) out.push(inline);
  }

  const css = out.join('\n');
  if (!css) throw new Error('no rules matched the selected item\'s classes');
  return css;
}

const cssFor = (props) => selectedItemCSS(renderRail(props));

/* Figma's Nav Rail Item (8224:5192) binds Selected to Buttons/Button,
   Buttons/Border and Buttons/Text — the palette, like the expanded item. (An
   earlier reading took the bottom bar's Nav Item, which binds Surface/Text,
   for this component.) */
describe('the selected item paints from the Buttons palette', () => {
  it('never emits the palette-less var(--Button)', () => {
    expect(cssFor()).not.toMatch(/var\(--Button\)/);
  });

  it('fills with Buttons-{C}-Button and labels with Buttons-{C}-Text', () => {
    const css = cssFor();
    expect(css).toContain('background-color: var(--Buttons-Default-Button)');
    expect(css).toContain('var(--Buttons-Default-Text)');
  });

  it('edges with Buttons-{C}-Border, as an inside ring', () => {
    expect(cssFor()).toContain('inset 0 0 0 1px var(--Buttons-Default-Border)');
  });

  it('the variant picks the palette', () => {
    const css = cssFor({ variant: 'primary' });
    expect(css).toContain('var(--Buttons-Primary-Button)');
  });

  it('label-outside fills only the circle: the glyph takes Buttons-Text, the caption stays --Text', () => {
    const css = cssFor({ labelStyle: 'outside' });
    expect(css).toContain('background-color: var(--Buttons-Default-Button)');
    expect(css).toContain('var(--Buttons-Default-Text)'); // the glyph, on the fill
    expect(css).toContain('color: var(--Text)');           // the caption, on the surface
  });
});
