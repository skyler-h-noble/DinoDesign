/**
 * Badge against the Figma set (3156:5150): a 1px stroke in the badge's own
 * Icons color, inside the 16px, and no background-colored ring.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Badge } from './Badge';

const allRules = () => Array.from(document.styleSheets).flatMap((sh) => {
  try { return Array.from(sh.cssRules || []).map((r) => r.cssText); } catch { return []; }
}).join('\n');

describe('Badge matches the Figma set', () => {
  it('strokes 1px in its own color and draws no ring', () => {
    render(<Badge variant="error" badgeContent={1}><span>x</span></Badge>);
    const css = allRules();
    expect(css).toMatch(/border:\s*1px solid var\(--Icons-Error\)/);
    expect(css).not.toMatch(/0 0 0 1px var\(--Background\)/);
  });
});
