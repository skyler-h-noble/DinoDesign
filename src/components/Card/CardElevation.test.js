/**
 * Card sits on the elevation the design names, which is Level ONE.
 *
 * The five Effect-Levels ARE the five named effect styles. Lining up alphas and
 * radii from a published bundle against the Figma effect styles makes the
 * mapping exact:
 *
 *   Level 1  a=0.145 r=1.6   Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
 *   Level 2  a=0.169 r=3.6   Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover)
 *   Level 3  a=0.200 r=8.1   Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
 *   Level 4  a=0.184 r=18.1  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
 *   Level 5  a=0.251 r=40.4  Elevations/Level-5 (Dialog & Modal)
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
import { declared } from '../_testCss';

/* The levels a card resolves to: its rest / hover / drag shadows are custom
   properties on the card, re-pointed one step up by `elevated`. */
const levelOf = (el, which) => {
  const m = (declared(el, '--_cd-' + which) || '').match(/--Effect-Level-(\d)/);
  return m ? Number(m[1]) : null;
};

describe('Card elevation', () => {
  it('rests on Level 1, the level Figma calls "Card"', () => {
    const { container } = render(<Card>hi</Card>);
    expect(`rest level: ${levelOf(container.firstChild, 'rest')}`).toBe('rest level: 1');
  });

  it('never rests on the App-bar step', () => {
    /* Level 2 is Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus). A card wearing it at
       REST is the bug this file exists for. It may appear as the hover level. */
    const { container } = render(<Card>hi</Card>);
    expect(levelOf(container.firstChild, 'rest')).not.toBe(2);
    expect(levelOf(container.firstChild, 'hover')).toBe(2);
  });

  it('moves the whole set up one when elevated', () => {
    /* The prop means "one step up", so Card and Card-Hover stay one apart at
       either setting. If elevated only raised the rest state, a raised card
       would stop lifting on hover. */
    const plain = render(<Card>a</Card>).container.firstChild;
    const up = render(<Card elevated>b</Card>).container.firstChild;
    for (const which of ['rest', 'hover', 'drag']) {
      expect(`${which}: ${levelOf(up, which) - levelOf(plain, which)}`).toBe(`${which}: 1`);
    }
  });
});
