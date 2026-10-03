/**
 * Rail reads the BUTTONS table for its selected item.
 *
 * The selected fill in Figma binds a variable named plainly `Button`, from the
 * Buttons collection — a collection whose ten MODES are the palettes, aliasing
 * into Surface's Buttons/<Palette>/<Slot>. Nothing on the Rail page overrides
 * the mode, so the shipped design resolves at `default`.
 *
 * Copied literally, those names became `var(--Button)` and `var(--Text)`,
 * which is wrong in CSS for one reason: Figma's collections are separate
 * namespaces and CSS's custom properties are one. `Text` collided with the
 * surface role of the same name and resolved to it — plausible, and silent.
 * `Button` had nothing to collide with, so it was dropped and a selected item
 * painted nothing.
 *
 * These tests assert the palette is in the name, which is the thing that makes
 * both names unambiguous.
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
     label's colour is set that way, so a helper reading only stylesheet rules
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

describe('Rail selected state reads --Buttons-<Palette>-*', () => {
  it('never emits the palette-less var(--Button)', () => {
    const css = cssFor();
    /* Anchored: the same haystack must contain the token we DO expect, or the
       `.not` below would pass on CSS that never mentioned buttons at all. */
    expect(css).toContain('--Buttons-Default-Button');
    // `--Buttons-Default-Button` contains the substring, so the boundary matters.
    expect(/var\(\s*--Button\s*\)/.test(css)).toBe(false);
  });

  it('paints the selected item from the Default button fill', () => {
    expect(cssFor()).toContain('--Buttons-Default-Button');
  });

  it('pairs the selected label with that fill, not the surface text', () => {
    expect(cssFor()).toContain('--Buttons-Default-Text');
  });

  it('follows the variant prop into the token name', () => {
    const css = cssFor({ variant: 'primary' });
    expect(css).toContain('--Buttons-Primary-Button');
    expect(css).toContain('--Buttons-Primary-Text');
    expect(css).not.toContain('--Buttons-Default-Button');
  });

  it('closes up black-white the way the token name does', () => {
    const css = cssFor({ variant: 'black-white' });
    expect(css).toContain('--Buttons-BlackWhite-Button');
    expect(css).not.toContain('--Buttons-black-white-Button');
  });

  it('falls back to Default for an unknown palette rather than a dead token', () => {
    const css = cssFor({ variant: 'not-a-palette' });
    expect(css).toContain('--Buttons-Default-Button');
    expect(css).not.toContain('not-a-palette');
  });

  /* "Selected wins" — a selected item keeps its button fill through hover and
     pressed. Those paint SURFACE tokens, so applying them to a selected item
     swapped the button fill for the surface's hover tint. It went unnoticed
     because the fill resolved to nothing: a hover that painted something, over
     a rest state that painted nothing, read as the feature. */
  it('keeps the button fill through hover and pressed', () => {
    const css = cssFor();
    expect(css).not.toMatch(/:hover[^{]*\{[^}]*--Hover/);
    expect(css).not.toMatch(/:active[^{]*\{[^}]*--Pressed/);
  });

  it('still shows a focus ring on the selected item', () => {
    expect(cssFor()).toContain('--Focus-Visible');
  });

  it('keeps hover and pressed on an UNSELECTED item', () => {
    /* The exclusion above must be conditional, not a deletion. Asserted on the
       same render, from the unselected sibling's own classes. */
    const container = renderRail();
    const items = Array.from(container.querySelectorAll('.rail-item'));
    const unselected = items.find((el) => !el.classList.contains('rail-item-selected'));
    expect(unselected).toBeTruthy();
    const classes = Array.from(unselected.classList).filter((c) => c.startsWith('css-'));
    const out = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of Array.from(rules || [])) {
        if (classes.some((c) => (rule.selectorText || '').includes(c))) out.push(rule.cssText);
      }
    }
    const css = out.join('\n');
    expect(css).toMatch(/--Hover/);
    expect(css).toMatch(/--Pressed/);
  });
});
