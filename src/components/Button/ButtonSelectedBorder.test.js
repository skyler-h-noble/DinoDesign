/** A selected button is rest + 1px: an inner ring inside the border makes up the difference. */
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';

const allRules = () => Array.from(document.styleSheets).flatMap((sh) => {
  try { return Array.from(sh.cssRules || []).map((r) => r.cssText); } catch { return []; }
}).join('\n');

describe('selected border', () => {
  it.each(['default', 'default-outline'])('%s: an inner ring when selected, the border unchanged', (variant) => {
    render(<Button variant={variant} selected>On</Button>);
    const css = allRules();
    expect(css).toContain('inset 0 0 0 calc(var(--Button-Selected-Border-Width, calc(var(--Button-Border-Width) + 1px)) - var(--Button-Border-Width)) var(--Buttons-Default-Border)');
    // The BORDER never thickens (that grew the button); only the ring adds.
    expect(css).not.toMatch(/border:\s*calc\(var\(--Button-Border-Width\) \+ 1px\)/);
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
  it('a number button uses the button number size (14px at medium), so it stays square', () => {
    render(<Button contentType="letterNumber" aria-label="Item 123">123</Button>);
    expect(allRules()).toMatch(/font-size:\s*var\(--Button-Number-Font-Size, 14px\)/);
  });
  it('a selected ghost is painted in its surface', () => {
    render(<Button variant="ghost" selected>On</Button>);
    expect(allRules()).toMatch(/background-color:\s*var\(--Background\)/);
  });
  it('a ghost lifts on hover (Level 1), like an outline button', () => {
    render(<Button variant="ghost">Go</Button>);
    expect(allRules()).toMatch(/:hover[^}]*box-shadow:\s*var\(--Effect-Level-1/);
  });
  it('a selected ghost draws the selected width (inner ring), and lifts on hover', () => {
    render(<Button variant="ghost" selected>On</Button>);
    const css = allRules();
    expect(css).toMatch(/box-shadow:\s*inset 0 0 0 calc\(var\(--Button-Selected-Border-Width/);
    expect(css).toMatch(/:hover[^}]*box-shadow:\s*inset 0 0 0 calc[^}]*--Effect-Level-1/);
  });
  it('a selected outline lifts on hover over its pressed-in bevel', () => {
    render(<Button variant="primary-outline" selected>On</Button>);
    expect(allRules()).toMatch(/:hover[^}]*box-shadow:[^}]*inset[^}]*--Effect-Level-1/);
  });
});
