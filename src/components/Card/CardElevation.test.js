/**
 * Card sits on the elevation the design names, which is Level ONE.
 *
 * The five Effect-Levels ARE the five named effect styles. Lining up alphas and
 * radii from a published bundle against the Figma effect styles makes the
 * mapping exact:
 *
 *   Level 1  a=0.145 r=1.6   Card / Accordion, Handle, Alert, Bottom-Sheet
 *   Level 2  a=0.169 r=3.6   Card-Hover / App bars, Toolbars, Menus, Tooltip
 *   Level 3  a=0.200 r=8.1   FAB, Snackbar
 *   Level 4  a=0.184 r=18.1  FAB-Hover
 *   Level 5  a=0.251 r=40.4  Dialog & Modal
 *
 * Card rested at Level 2 — the App-bar step — so every card in every brand wore
 * a shadow a full level too heavy, and a card nested in a card wore it twice.
 * Nothing about it reads as broken: an over-heavy shadow is still a plausible
 * shadow, and `2` looks as reasonable in the source as `1` does. Only the
 * Figma effect style names tell you which is right.
 *
 * Asserted as the LEVEL rather than a rendered color: the literals are
 * brand-generated, so a test on the painted shadow would be a test of the
 * shadow generator, not of which rung Card chose.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Card } from './Card';

const shadowRulesFor = (el) => {
  const classes = Array.from(el.classList);
  const out = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list; try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list || [])) {
      if (!r.selectorText || !classes.some((c) => r.selectorText.includes('.' + c))) continue;
      out.push(r.cssText);
    }
  }
  return out.join('\n');
};

const levelsIn = (css) =>
  [...css.matchAll(/--Effect-Level-(\d)/g)].map((m) => Number(m[1]));

describe('Card elevation', () => {
  it('rests on Level 1, the level Figma calls "Card"', () => {
    const { container } = render(<Card>hi</Card>);
    const css = shadowRulesFor(container.firstChild);
    expect(`rest uses Level 1: ${levelsIn(css).includes(1)}`).toBe('rest uses Level 1: true');
  });

  it('never rests on the App-bar step', () => {
    /* Level 2 is "Card-Hover / App bars, Toolbars, Menus". A card wearing it at
       REST is the bug this file exists for. It may appear in a hover rule. */
    const { container } = render(<Card>hi</Card>);
    const css = shadowRulesFor(container.firstChild);
    const restRule = css.split('\n').find((r) => !/:hover|:active|:focus/.test(r)) || '';
    expect(`rest uses Level 2: ${/--Effect-Level-2/.test(restRule)}`).toBe('rest uses Level 2: false');
  });

  it('moves the whole set up one when elevated', () => {
    /* The prop means "one step up", so Card and Card-Hover stay one apart at
       either setting. If elevated only raised the rest state, a raised card
       would stop lifting on hover. */
    const plain = shadowRulesFor(render(<Card>a</Card>).container.firstChild);
    const up = shadowRulesFor(render(<Card elevated>b</Card>).container.firstChild);
    const maxPlain = Math.max(...levelsIn(plain), 0);
    const maxUp = Math.max(...levelsIn(up), 0);
    expect(`elevated is higher: ${maxUp > maxPlain}`).toBe('elevated is higher: true');
  });
});
