/**
 * The hover and pressed scrims are TRANSLUCENT, so the chip keeps its colour.
 *
 * They were `linear-gradient(var(--Hover), var(--Hover))`, on the reasoning
 * that those tokens are "the surface-aware scrims the system already defines".
 * They are not: --Hover and --Pressed are OPAQUE surface tones — the generator
 * walks the palette and emits hex — so the gradient painted a solid layer over
 * the chip and hovering a swatch replaced its colour with the page's hover
 * tone. On a light brand that is near-white, so the swatch simply vanished.
 *
 * A colour chip that stops showing its colour on hover has lost the only thing
 * it is for, and nothing about the code said so: both tokens resolve, the
 * gradient is valid, and every wrong answer is still a real colour.
 *
 * Figma's Swatch set (9212:6816) draws black at 5% on Hover and 8% on Pressed
 * over the Color Swatch fill. Those values are used verbatim.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Swatch } from './Swatch';

const rulesFor = (el) => {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (!r.selectorText) continue;
      if (!classes.some((c) => r.selectorText.includes('.' + c))) continue;
      out.push(r.cssText);
    }
  }
  return out.join('\n');
};

describe('Swatch hover and pressed scrims', () => {
  const chipOf = (c) => c.querySelector('.swatch-chip');

  it('never paints an opaque layer over the chip', () => {
    const { container } = render(<Swatch color="#b8329b" onClick={() => {}} radio />);
    const css = rulesFor(chipOf(container));
    /* The specific failure: a bare var() token as the gradient stop. Those
       tokens are opaque, so this is the shape that hides the colour. */
    expect(`opaque token scrim: ${/linear-gradient\(var\(--(Hover|Pressed)\)/.test(css)}`)
      .toBe('opaque token scrim: false');
  });

  it('uses the design’s 5% and 8% black', () => {
    const { container } = render(<Swatch color="#b8329b" onClick={() => {}} radio />);
    const css = rulesFor(chipOf(container));
    expect(css).toMatch(/rgba\(0,\s*0,\s*0,\s*0\.05\)/);
    expect(css).toMatch(/rgba\(0,\s*0,\s*0,\s*0\.08\)/);
  });

  it('keeps the chip’s own colour as the background', () => {
    /* The scrim is a background LAYER over backgroundColor, not a replacement.
       If the colour ever moved into the gradient the two would fight. */
    const { container } = render(<Swatch color="#b8329b" onClick={() => {}} />);
    expect(rulesFor(chipOf(container))).toMatch(/background-color:\s*(#b8329b|rgb\(184,\s*50,\s*155\))/i);
  });

  it('paints no scrim at all when there is nothing to click', () => {
    const { container } = render(<Swatch color="#b8329b" />);
    const css = rulesFor(chipOf(container));
    expect(`non-clickable scrim: ${/rgba\(0,\s*0,\s*0,\s*0\.0[58]\)/.test(css)}`)
      .toBe('non-clickable scrim: false');
  });
});
