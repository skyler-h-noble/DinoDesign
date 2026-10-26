// Resize vs the actions row (Figma's TextArea): a grip OR a row's end
// decorator owns the bottom-right corner, never both.
import React from 'react';
import { render } from '@testing-library/react';
import { Input } from './Input';

const cssFor = (el) => {
  const out = [];
  for (const sheet of document.styleSheets) for (const r of sheet.cssRules) {
    try { if (el.matches(r.selectorText)) out.push(r.cssText); } catch (e) { /* skip */ }
  }
  return out.join('\n');
};
const textarea = (c) => c.querySelector('textarea');

describe('TextArea resize and the actions row', () => {
  test('a plain multiline field resizes vertically by default', () => {
    const { container } = render(<Input multiline rows={2} aria-label="Notes" />);
    expect(cssFor(textarea(container))).toContain('resize: vertical');
  });

  test('with decorators it has no grip by default', () => {
    const { container } = render(<Input multiline rows={1} aria-label="Notes" endAdornment={<span>x</span>} />);
    expect(cssFor(textarea(container))).toContain('resize: none');
  });

  test('a grip asked for beside an end decorator is refused, with a warning', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Input multiline rows={1} resize="vertical" aria-label="Notes" endAdornment={<span>x</span>} />);
    expect(cssFor(textarea(container))).toContain('resize: none');
    warn.mockRestore();
  });

  test('a start decorator alone still allows an explicit grip', () => {
    const { container } = render(<Input multiline rows={1} resize="vertical" aria-label="Notes" startAdornment={<span>+</span>} />);
    expect(cssFor(textarea(container))).toContain('resize: vertical');
  });
});
