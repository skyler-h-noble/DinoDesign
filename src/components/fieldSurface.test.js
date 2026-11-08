// Every text field fills with the --Hover of the surface it sits on, as
// Figma's Input does (Default: Surface/Hover; Hover: Pressed; Pressed: Hover
// with a 2px edge), and its placeholder is that surface's --Quiet.
//
// For a while each field was its OWN Container surface instead, because the
// placeholder measured 4.08:1 (light) / 3.53:1 (dark) on a Default card's
// Hover. The fault was the card Hover — it moved TOWARD the card's text — and
// it is fixed in the design system, which also solves card Quiet against the
// card's Hover (dinodesign-studio utils/cardStates.ts, pageCardTextParity).
// A Container of its own also resolved through the nearest theme by source
// order: a search field in an App Bar on a Brand page took the Brand's card.
//
// So no field pins a surface: fill, placeholder, value, edge and ring all read
// the surface the field sits on.
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

const CASES = [
  ['Select', () => <Select label="Country" placeholder="Select a country" options={['Portugal', 'Spain']} />, '.select-value'],
  ['TextInput', () => <Input label="Card number" placeholder="4242 4242 4242 4242" />, 'input'],
  ['Autocomplete', () => <Autocomplete label="City" placeholder="Type to search" options={['Lisbon']} />, 'input'],
  ['SearchField', () => <SearchField placeholder="Search…" />, 'input'],
  ['NumberField', () => <NumberField label="Quantity" placeholder="1" />, 'input'],
  ['TextField', () => <TextField label="Name" placeholder="Ana" />, 'input'],
];

describe.each(CASES)('%s', (name, ui, textSel) => {
  test('the resting fill is the surface\'s --Hover, and the text sits on it', () => {
    const { container } = render(ui());
    const fill = Array.from(container.querySelectorAll('*'))
      .find((el) => declared(el, 'background-color') === 'var(--Hover)');
    expect(fill).toBeTruthy();
    expect(fill.querySelector(textSel)).not.toBeNull();
  });

  test('no field pins a surface of its own', () => {
    const { container } = render(ui());
    expect(container.querySelectorAll('[data-surface]')).toHaveLength(0);
  });

  if (textSel === 'input') {
    test('the placeholder is --Quiet at full strength', () => {
      const { container } = render(ui());
      expect(placeholderColor(container.querySelector('input'))).toMatch(/^var\(--Quiet\b/);
    });
  }
});

test('Select: the placeholder is the trigger\'s --Quiet', () => {
  const { container } = render(<Select label="Country" placeholder="Select a country" options={['Portugal']} />);
  expect(declared(container.querySelector('.select-trigger'), 'color')).toBe('var(--Quiet)');
});

test('TextInput: hover fills with --Pressed, press with --Hover (Figma\'s Input), and the placeholder turns --Text', () => {
  render(<Input label="x" placeholder="y" />);
  const all = Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules || [])).map((r) => r.cssText).join('\n');
  expect(all).toMatch(/\.omni-inp-on:hover \.MuiOutlinedInput-root\s*\{\s*background-color: var\(--Pressed\)/);
  expect(all).toMatch(/\.omni-inp-on:active \.MuiOutlinedInput-root\s*\{\s*background-color: var\(--Hover\)/);
  expect(all).toMatch(/\.omni-inp-on:hover \.omni-inp-in \.MuiOutlinedInput-root input::placeholder\s*\{\s*color: var\(--Text\)/);
});
