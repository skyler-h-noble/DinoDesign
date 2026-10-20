/** A selected solid or outline button draws --Button-Border-Width + 1px. */
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';

const allRules = () => Array.from(document.styleSheets).flatMap((sh) => {
  try { return Array.from(sh.cssRules || []).map((r) => r.cssText); } catch { return []; }
}).join('\n');

describe('selected border', () => {
  it.each(['default', 'default-outline'])('%s: one pixel heavier when selected', (variant) => {
    render(<Button variant={variant} selected>On</Button>);
    expect(allRules()).toMatch(/border:\s*calc\(var\(--Button-Border-Width\) \+ 1px\) solid/);
  });
  it('rest keeps the base width', () => {
    render(<Button variant="default">Off</Button>);
    const css = allRules();
    expect(css).toMatch(/border:\s*var\(--Button-Border-Width\) solid/);
  });
});
