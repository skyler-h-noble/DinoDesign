// Every text field is its OWN surface: the element that paints the fill
// declares data-surface="Container" and paints that surface's --Background,
// and the placeholder is --Quiet — so the placeholder's color is the one the
// design system checks at 4.5:1 against that very fill, on every theme and
// surface, light and dark.
//
// Before, the fill was the PAGE's --Hover and the placeholder the PAGE's
// --Quiet: a pair nothing checks. Inside a Default card it measured 4.08:1
// (light) and 3.53:1 (dark) — the benchmark's "Select a country".
//
// The edge and the focus ring stay OUTSIDE that surface: they are drawn
// against the page, so they must read the page's --Border / --Focus-Visible.
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { declared } from './_testCss';
import { Select } from './Select/Select';
import { Input } from './Input/Input';
import { Autocomplete } from './Autocomplete/Autocomplete';
import { SearchField } from './SearchField/SearchField';
import { NumberField } from './NumberField/NumberField';
import { TextField } from './TextField/TextField';

/* The placeholder color that wins for `el`: rules whose selector ends in a
   placeholder pseudo-element and whose element part matches. Later rules of
   at least equal weight win — the sheets here are single-class-per-step, so
   source order is the tie-break that matters. Hover / active rules are left
   out: the resting placeholder is the one sitting on the resting fill. */
function placeholderColor(el) {
  let value;
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = Array.from(sheet.cssRules || []); } catch (e) { continue; }
    for (const r of list) {
      if (!r.selectorText || !/::placeholder\b/.test(r.selectorText)) continue;
      const parts = r.selectorText.split(',').map((x) => x.trim())
        .filter((p) => /::placeholder$/.test(p) && !/:(hover|active)\b/.test(p) && !/data-shrink/.test(p));
      const hit = parts.some((p) => { try { return el.matches(p.replace(/::placeholder$/, '')); } catch (e) { return false; } });
      const m = r.cssText.match(/(?:^|[;{\s])color:\s*([^;}]+)/);
      if (hit && m) value = m[1].trim();
    }
  }
  return value;
}

const fillOf = (root) => Array.from(root.querySelectorAll('*'))
  .find((el) => declared(el, 'background-color') === 'var(--Background)');

const CASES = [
  ['Select', () => <Select label="Country" placeholder="Select a country" options={['Portugal', 'Spain']} />, '.select-value'],
  ['TextInput', () => <Input label="Card number" placeholder="4242 4242 4242 4242" />, 'input'],
  ['Autocomplete', () => <Autocomplete label="City" placeholder="Type to search" options={['Lisbon']} />, 'input'],
  ['SearchField', () => <SearchField placeholder="Search…" />, 'input'],
  ['NumberField', () => <NumberField label="Quantity" placeholder="1" />, 'input'],
  ['TextField', () => <TextField label="Name" placeholder="Ana" />, 'input'],
];

describe.each(CASES)('%s', (name, ui, textSel) => {
  test('the fill is a Container surface painting its own --Background', () => {
    const { container } = render(ui());
    const fill = fillOf(container);
    expect(fill).toBeTruthy();
    expect(fill.closest('[data-surface]')).toHaveAttribute('data-surface', 'Container');
    // The text (placeholder / value) sits inside that surface.
    expect(fill.closest('[data-surface]').querySelector(textSel)).not.toBeNull();
  });

  test('nothing paints the page --Hover as the resting fill', () => {
    const { container } = render(ui());
    // NumberField's step buttons are their own controls (FieldButton).
    const hoverFilled = Array.from(container.querySelectorAll('*'))
      .filter((el) => !el.closest('.omni-fb') && declared(el, 'background-color') === 'var(--Hover)');
    expect(hoverFilled).toEqual([]);
  });

  if (textSel === 'input') {
    test('the placeholder is --Quiet at full strength, resolved inside the field surface', () => {
      const { container } = render(ui());
      const input = container.querySelector('input');
      expect(placeholderColor(input)).toMatch(/^var\(--Quiet\b/);
      expect(input.closest('[data-surface]')).toHaveAttribute('data-surface', 'Container');
    });
  }
});

test('Select: the placeholder is the trigger\'s --Quiet, inside the field surface; the ring and edge are outside it', () => {
  const { container } = render(<Select label="Country" placeholder="Select a country" options={['Portugal']} />);
  const trigger = container.querySelector('.select-trigger');
  expect(declared(trigger, 'color')).toBe('var(--Quiet)');
  expect(trigger.closest('[data-surface]')).toHaveAttribute('data-surface', 'Container');
  const shell = container.querySelector('.omni-sel-shell');
  expect(shell.closest('[data-surface]')).toBeNull();
});

test('TextInput: hover and press deepen the fill and turn the placeholder --Text', () => {
  render(<Input label="x" placeholder="y" />);
  const all = Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules || [])).map((r) => r.cssText).join('\n');
  expect(all).toMatch(/\.omni-inp-on:hover \.MuiOutlinedInput-root\s*\{\s*background-color: var\(--Hover\)/);
  expect(all).toMatch(/\.omni-inp-on:active \.MuiOutlinedInput-root\s*\{\s*background-color: var\(--Pressed\)/);
  expect(all).toMatch(/\.omni-inp-on:hover \.omni-inp-in \.MuiOutlinedInput-root input::placeholder\s*\{\s*color: var\(--Text\)/);
});
