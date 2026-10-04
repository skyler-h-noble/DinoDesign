/**
 * The two-tone secondary fill is the icon's own color at 50%.
 *
 * It read var(--Icons-Variant-{Color}), which is not a token. The Icons
 * collection does have an Icon-Variant variable, but it is not a second color:
 * it is `{ color: <the same Icon alias>, opacity: <shared variable> }`, and all
 * ten modes point at the same opacity — Colors/Icon-Variant-Opacity = 50, in
 * light mode and dark.
 *
 * So there was nothing for the generator to emit, and the reference carried no
 * fallback: --twotone-variant resolved to nothing and every TwoTone icon's
 * secondary fill came out uncoloured. A composed value is also the only form
 * that can follow `default`, where the icon inherits from whatever it sits in
 * and no token names the color at all.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Icon } from './Icon';

const styleOf = (el) => {
  const classes = Array.from(el.classList);
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (r.selectorText && classes.some((c) => r.selectorText.includes('.' + c))) return r.cssText;
    }
  }
  return '';
};
const iconCss = (jsx) => styleOf(render(jsx).container.querySelector('.icon'));

describe('two-tone icons', () => {
  it('never references the phantom Icons-Variant token', () => {
    for (const color of ['primary', 'error', 'default']) {
      const css = iconCss(<Icon twoTone color={color}><span /></Icon>);
      expect(`${color} uses Icons-Variant: ${/--Icons-Variant-/.test(css)}`)
        .toBe(`${color} uses Icons-Variant: false`);
    }
  });

  it('composes the secondary fill from the icon color at 50%', () => {
    const css = iconCss(<Icon twoTone color="primary"><span /></Icon>);
    expect(css).toMatch(/--twotone-variant/);
    expect(css).toMatch(/color-mix\(in srgb, var\(--Icons-Primary\) 50%, transparent\)/);
  });

  it('follows currentColor when the icon inherits', () => {
    /* color="default" has no token — the icon takes its color from whatever it
       sits in, so the secondary has to be composed from currentColor or it
       cannot follow. */
    const css = iconCss(<Icon twoTone color="default"><span /></Icon>);
    expect(css).toMatch(/color-mix\(in srgb, currentColor 50%, transparent\)/);
  });

  it('sets no two-tone variable on a normal icon', () => {
    const css = iconCss(<Icon color="primary"><span /></Icon>);
    expect(`plain icon sets --twotone-variant: ${/--twotone-variant/.test(css)}`)
      .toBe('plain icon sets --twotone-variant: false');
  });
});
