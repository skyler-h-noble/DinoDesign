/**
 * BlackWhiteToggleButtonGroup paints from --Buttons-BlackWhite-*, the names
 * the design system emits. It read --Buttons-Black-white-* (cap('black-white'))
 * and painted no fill, border or label.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { BlackWhiteToggleButtonGroup } from './ToggleButtonGroup';
import { Button } from '../Button/Button';
import { stateRules } from '../_testCss';

/* Every sheet's text, plus each rendered control's resolved declarations —
   Button's values travel as custom properties, so the tokens show up there
   (see _testCss). */
const allRules = () => Array.from(document.styleSheets).flatMap((sh) => {
  try { return Array.from(sh.cssRules || []).map((r) => r.cssText); } catch { return []; }
}).concat([...document.querySelectorAll('button, a, [role="button"]')].map((el) => stateRules(el).all)).join('\n');

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
