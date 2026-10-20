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
  it('a selected ghost draws the Border, an unselected one stays transparent', () => {
    render(<Button variant="ghost" selected>On</Button>);
    expect(allRules()).toMatch(/border:\s*var\(--Button-Border-Width\) solid var\(--Buttons-Default-Border\)/);
  });
  it('a selected outline takes the button fill, hover and pressed colors', () => {
    render(<Button variant="primary-outline" selected>On</Button>);
    const css = allRules();
    expect(css).toMatch(/background-color:\s*var\(--Buttons-Primary-Button\)/);
    expect(css).toMatch(/:hover[^}]*background-color:\s*var\(--Buttons-Primary-Hover\)/);
    expect(css).toMatch(/:active[^}]*background-color:\s*var\(--Buttons-Primary-Pressed\)/);
    expect(css).toMatch(/color:\s*var\(--Buttons-Primary-Text\)/);
  });
  it('a selected button is pressed in: its bevel colors swap', () => {
    const { bevelShadow } = require('../_shadows');
    const rest = bevelShadow('primary', 'medium');
    const pressed = bevelShadow('primary', 'medium', true);
    // Same geometry, colors exchanged: the first (top-left offset) inset takes
    // the Highlight at rest and the Lowlight when pressed in, and vice versa.
    const [r1, r2] = rest.split('inset ').filter(Boolean);
    const [p1, p2] = pressed.split('inset ').filter(Boolean);
    expect(r1).toContain('--Buttons-Primary-Lowlight');
    expect(p1).toContain('--Buttons-Primary-Highlight');
    expect(r2).toContain('--Buttons-Primary-Highlight');
    expect(p2).toContain('--Buttons-Primary-Lowlight');
    render(<Button variant="primary" selected>On</Button>);
    render(<Button variant="primary-outline" selected>On</Button>);
    expect(allRules()).toContain(p1.trim().slice(0, 40));
  });
});
