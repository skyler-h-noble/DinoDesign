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

describe('the selected item paints from the surface', () => {
  /* Still worth guarding: the ORIGINAL bug was a palette-less var(--Button),
     which is undefined, and an undefined custom property with no fallback
     drops the whole declaration — so the item painted nothing at all. */
  it('never emits the palette-less var(--Button)', () => {
    const css = cssFor();
    expect(css).toContain('var(--Text)');
    expect(css).not.toMatch(/var\(--Button\)/);
  });

  it('fills with --Text, the token the design binds', () => {
    expect(cssFor()).toContain('background-color: var(--Text)');
  });

  /* The whole point of the correction: not one Buttons token on the item. */
  it('reaches for no Buttons token at all', () => {
    expect(cssFor()).not.toMatch(/var\(--Buttons-/);
  });

  /* A contained item is filled edge to edge, so its label sits ON --Text and
     reverses out. Label-outside fills only the circle, leaving the caption on
     the surface in --Text itself — which is what the design shows. */
  it('reverses the label out of the fill when the item is filled', () => {
    expect(cssFor()).toContain('var(--Background)');
  });

  it('and leaves it on the surface when only the circle is filled', () => {
    const css = cssFor({ labelStyle: 'outside' });
    expect(css).toContain('background-color: var(--Text)');
    expect(css).not.toContain('var(--Background)');
  });

  /* The palette prop no longer reaches these two, because they are not
     palette tokens. It still drives whatever else wants a palette. */
  it('does not let the variant prop into the fill', () => {
    for (const variant of ['primary', 'error', 'black-white', 'nonsense']) {
      const css = cssFor({ variant });
      expect(css).toContain('background-color: var(--Text)');
      expect(css).not.toMatch(/var\(--Buttons-/);
    }
  });
});
