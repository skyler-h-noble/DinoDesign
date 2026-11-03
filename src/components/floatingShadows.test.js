/**
 * Anything FIXED or FLOATING over the whole page casts a BLACK shadow.
 *
 * The design system publishes two shadow sets with the same levels and
 * geometry: --Effect-Level-N, every layer rgba(var(--Dropshadow-Color), a), and
 * --Effect-Level-N-Neutral, every layer rgba(0, 0, 0, a). The tinted one is
 * right for something sitting ON a surface — a card on a Primary section
 * takes that section's tint. A tooltip, a menu panel, a dialog or a sticky app
 * bar passes over every color on the page, and a shadow tinted by the one
 * surface it was declared in shows up as a colored halo over all the others.
 *
 * Asserted on the declaration the element actually gets (static sheet or
 * inline style), not on the source: a component could import the black
 * constant and still paint the tinted one through a later, heavier rule —
 * which is what the drawer's and dialog's no-backdrop classes used to do.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { declared, stateRules } from './_testCss';
import { AppBar } from './AppBar/AppBar';
import { Card } from './Card/Card';
import { Chip } from './Chip/Chip';
import { Dialog } from './Dialog/Dialog';
import { Drawer } from './Drawer/Drawer';
import { Fab } from './Fab/Fab';
import { Dropdown, MenuButton, Menu, MenuItem } from './Menu/Menu';
import { Modal } from './Modal/Modal';
import { Popover } from './Popover/Popover';
import { Sheet } from './Sheet/Sheet';
import { Snackbar } from './Snackbar/Snackbar';
import { Toolbar } from './Toolbar/Toolbar';
import { Tooltip } from './Tooltip/Tooltip';
import { NEUTRAL_SHADOWS, SHADOWS } from './_shadows';

/* Black: reads the -Neutral token, and nothing in it is tinted (the fallback
   is the black geometry, not --Dropshadow-Color). */
const expectBlack = (shadow, level) => {
  expect(shadow).toContain(`var(--Effect-Level-${level}-Neutral, `);
  expect(shadow).not.toContain('--Dropshadow-Color');
};
/* Tinted: reads the plain token, with the tinted fallback. */
const expectTinted = (shadow, level) => {
  expect(shadow).toContain(`var(--Effect-Level-${level}, `);
  expect(shadow).toContain('--Dropshadow-Color');
  expect(shadow).not.toContain('-Neutral');
};
const q = (sel) => document.querySelector(sel);

describe('the black shadow set (_shadows.js)', () => {
  it.each([1, 2, 3, 4, 5])('Level %i reads --Effect-Level-%i-Neutral and falls back to black', (level) => {
    const s = NEUTRAL_SHADOWS[level];
    expect(s.startsWith(`var(--Effect-Level-${level}-Neutral, `)).toBe(true);
    // Same geometry as the tinted fallback, layer for layer, in black.
    const layers = (str) => (str.match(/rgba\(/g) || []).length;
    expect(layers(s)).toBe(layers(SHADOWS[level]));
    expect(s).toContain('rgba(0, 0, 0, ');
    expect(s).not.toContain('--Dropshadow-Color');
  });

  it('Level 0 is none in both sets', () => {
    expect(NEUTRAL_SHADOWS[0]).toBe('none');
    expect(SHADOWS[0]).toBe('none');
  });
});

describe('floating components cast black shadows', () => {
  it('Tooltip bubble — Level 2', () => {
    render(<Tooltip open title="Tip"><button type="button">Anchor</button></Tooltip>);
    expectBlack(declared(q('.tooltip-content'), 'box-shadow'), 2);
  });

  it('Menu panel — Level 2', () => {
    render(
      <Dropdown open>
        <MenuButton>Actions</MenuButton>
        <Menu><MenuItem>Profile</MenuItem></Menu>
      </Dropdown>,
    );
    expectBlack(declared(q('.omni-menu'), 'box-shadow'), 2);
  });

  it('Popover, portaled — Level 2', () => {
    render(<Popover open anchorEl={document.body}>Panel</Popover>);
    expectBlack(declared(q('.omni-pop'), 'box-shadow'), 2);
  });

  it('Snackbar — Level 3', () => {
    render(<Snackbar open message="Saved" />);
    expectBlack(declared(q('.omni-sb'), 'box-shadow'), 3);
  });

  it('Dialog — Level 5, with and without the backdrop', () => {
    const { unmount } = render(<Dialog open title="T">Body</Dialog>);
    expectBlack(declared(q('.omni-dlg-paper'), 'box-shadow'), 5);
    unmount();
    // A non-modal dialog used to take the page's tint; it still floats.
    render(<Dialog open nonModal title="T">Body</Dialog>);
    expectBlack(declared(q('.omni-dlg-paper'), 'box-shadow'), 5);
  });

  it('Modal — Level 5', () => {
    render(<Modal open>Body</Modal>);
    expectBlack(declared(q('.omni-md'), 'box-shadow'), 5);
  });

  it('Drawer — Level 3, with and without the backdrop', () => {
    const { unmount } = render(<Drawer open>Body</Drawer>);
    expectBlack(declared(q('.omni-dr'), 'box-shadow'), 3);
    unmount();
    // hideBackdrop used to switch it to the page's tint; it is still fixed over the page.
    render(<Drawer open hideBackdrop>Body</Drawer>);
    expectBlack(declared(q('.omni-dr'), 'box-shadow'), 3);
  });

  it('Sheet — Level 1', async () => {
    /* Sheet passes its shadow to Drawer through sx, which loads the MUI box
       lazily; until it lands, the drawer's own Level 3 class is what applies. */
    render(<Sheet open>Body</Sheet>);
    await waitFor(() => expect(declared(q('.sheet'), 'box-shadow')).toContain('Level-1'));
    expectBlack(declared(q('.sheet'), 'box-shadow'), 1);
  });

  it('Fab — Level 3 at rest, Level 4 on hover', () => {
    const { container } = render(<Fab aria-label="Add" />);
    const fab = container.querySelector('.omni-fab');
    const rules = stateRules(fab);
    expectBlack(rules.base.match(/box-shadow: ([^;]+);/)[1], 3);
    expectBlack(rules.states.hover.match(/box-shadow: ([^;]+);/)[1], 4);
  });

  it('floating Toolbar — Level 2', () => {
    const { container } = render(<Toolbar type="floating" />);
    expectBlack(declared(container.querySelector('.omni-tb'), 'box-shadow'), 2);
  });

  it('sticky AppBar (the default) — Level 2', () => {
    const { container } = render(<AppBar brand="Acme" />);
    expectBlack(declared(container.querySelector('.omni-ab'), 'box-shadow'), 2);
  });
});

describe('in-flow components keep the tinted shadow', () => {
  it('Card rests on the tinted Level 1', () => {
    const { container } = render(<Card>hi</Card>);
    expectTinted(declared(container.firstChild, '--_cd-rest'), 1);
  });

  it('clickable Chip hovers to the tinted Level 1', () => {
    const { container } = render(<Chip label="Tag" onClick={() => {}} />);
    const chip = container.querySelector('.omni-chip');
    expectTinted(stateRules(chip).states.hover.match(/box-shadow: ([^;]+);/)[1], 1);
  });

  it('AppBar with sticky={false} scrolls with its section and keeps the tint', () => {
    const { container } = render(<AppBar brand="Acme" sticky={false} />);
    expectTinted(declared(container.querySelector('.omni-ab'), 'box-shadow'), 2);
  });

  it('Popover with disablePortal sits in the flow and keeps the tint', () => {
    render(<Popover open disablePortal anchorEl={document.body}>Panel</Popover>);
    expectTinted(declared(q('.omni-pop'), 'box-shadow'), 2);
  });
});
