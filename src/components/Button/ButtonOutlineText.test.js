/**
 * An outline button's label comes from its own palette.
 *
 * Figma's Button draws it as Buttons::Outline-Text on every unfilled state, and
 * switches to Buttons::Text on Selected — the one outline variant that gains a
 * fill. The two are different colours on purpose: Buttons::Text is the label ON
 * the fill, contrast-checked against it; Outline-Text is the label on the
 * SURFACE, checked against that.
 *
 * The code used --Text, the surface's own body colour, so every outline button
 * had the same label regardless of palette — a success outline and an error
 * outline were identical. Nothing in the library read Outline-Text at all,
 * which is also why its one missing value went unnoticed: the generator emits
 * it for nine palettes and not BlackWhite, and a token nobody consumes cannot
 * be missed.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';

const cssFor = (el) => {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (r.selectorText && classes.some((c) => r.selectorText.includes('.' + c))) out.push(r.cssText);
    }
  }
  return out.join('\n');
};
const btnCss = (jsx) => cssFor(render(jsx).container.querySelector('button'));

describe('outline button label', () => {
  it('takes Outline-Text from its own palette', () => {
    for (const [variant, token] of [
      ['success-outline', '--Buttons-Success-Outline-Text'],
      ['error-outline', '--Buttons-Error-Outline-Text'],
      ['outline', '--Buttons-Default-Outline-Text'],
    ]) {
      const css = btnCss(<Button variant={variant}>x</Button>);
      expect(`${variant}: ${css.includes(token)}`).toBe(`${variant}: true`);
    }
  });

  it('does not fall back to the surface body colour', () => {
    /* --Text is the page's body colour. Using it made every outline button's
       label identical across palettes, which looks deliberate rather than
       wrong — there is no missing-value symptom to notice. */
    const css = btnCss(<Button variant="success-outline">x</Button>);
    const colorDecl = css.match(/[^-]color:\s*var\(--Text\)/);
    expect(`falls back to --Text: ${!!colorDecl}`).toBe('falls back to --Text: false');
  });

  it('keeps the FILLED button on Buttons-{C}-Text', () => {
    /* The distinction is the point: a filled button's label is checked against
       its fill, an outline button's against the surface. */
    const css = btnCss(<Button variant="success">x</Button>);
    expect(css).toMatch(/--Buttons-Success-Text/);
  });
});
