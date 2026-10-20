/**
 * BlackWhiteToggleButtonGroup paints from --Buttons-BlackWhite-*, the names
 * the design system emits. It read --Buttons-Black-white-* (cap('black-white'))
 * and painted no fill, border or label.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { BlackWhiteToggleButtonGroup } from './ToggleButtonGroup';
import { Button } from '../Button/Button';

const allRules = () => Array.from(document.styleSheets).flatMap((sh) => {
  try { return Array.from(sh.cssRules || []).map((r) => r.cssText); } catch { return []; }
}).join('\n');

describe('BlackWhiteToggleButtonGroup', () => {
  it('reads the BlackWhite button tokens', () => {
    render(
      <BlackWhiteToggleButtonGroup value="a" onChange={() => {}} aria-label="Align">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </BlackWhiteToggleButtonGroup>,
    );
    const css = allRules();
    expect(css).toContain('--Buttons-BlackWhite-');
    expect(css).not.toContain('--Buttons-Black-white-');
  });
});
