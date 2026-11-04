/**
 * Only Modal, Dialog, Toast (Snackbar) and Popover cast a BLACK shadow.
 *
 * The design system publishes two shadow sets with the same levels and
 * geometry: --Effect-Level-N, every layer rgba(var(--Dropshadow-Color), a), and
 * --Effect-Level-N-Neutral, every layer rgba(0, 0, 0, a).
 *
 * Owner rule, 2026-11-04 (replaces "anything floating over the page is
 * black"): the black set is for the four components that interrupt the page —
 * a modal or dialog over a scrim, a toast, a popover panel. Everything else —
 * AppBar (sticky too), Toolbar, Tooltip, Menu panel, Drawer, Sheet, Fab, cards
 * — takes the surface-tinted set, so its shadow belongs to its own theme.
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

const fs = require('fs');
const path = require('path');

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

describe('exactly Modal, Dialog, Toast and Popover use the black set', () => {
  /* Every component source that imports the neutral constants. A new import
     anywhere fails here, so the black set cannot quietly spread again. */
  it('pins the components that import SHADOW_NEUTRAL_* / NEUTRAL_SHADOWS', () => {
    const users = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.jsx?$/.test(e.name) && !/\.test\.jsx?$/.test(e.name) && e.name !== '_shadows.js') {
          const src = fs.readFileSync(full, 'utf8');
          if (/\bSHADOW_NEUTRAL_LEVEL_\d|\bNEUTRAL_SHADOWS\b|--Effect-Level-\d-Neutral/.test(src)) {
            users.push(path.relative(__dirname, full));
          }
        }
      }
    };
    walk(__dirname);
    expect(users.sort()).toEqual([
      'Dialog/Dialog.js',
      'Dialog/Dialog.mui.js',
      'Modal/Modal.js',
      'Popover/Popover.js',
      'Snackbar/Snackbar.js',
    ]);
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
    render(<Dialog open nonModal title="T">Body</Dialog>);
    expectBlack(declared(q('.omni-dlg-paper'), 'box-shadow'), 5);
  });

  it('Modal — Level 5', () => {
    render(<Modal open>Body</Modal>);
    expectBlack(declared(q('.omni-md'), 'box-shadow'), 5);
  });
});

describe('everything else that floats takes the tinted set, at its Figma level', () => {
  it('Tooltip bubble — Level 2', () => {
    render(<Tooltip open title="Tip"><button type="button">Anchor</button></Tooltip>);
    expectTinted(declared(q('.tooltip-content'), 'box-shadow'), 2);
  });

  it('Menu panel — Level 2', () => {
    render(
      <Dropdown open>
        <MenuButton>Actions</MenuButton>
        <Menu><MenuItem>Profile</MenuItem></Menu>
      </Dropdown>,
    );
    expectTinted(declared(q('.omni-menu'), 'box-shadow'), 2);
  });

  it('Drawer — Level 3, with and without the backdrop', () => {
    const { unmount } = render(<Drawer open>Body</Drawer>);
    expectTinted(declared(q('.omni-dr'), 'box-shadow'), 3);
    unmount();
    render(<Drawer open hideBackdrop>Body</Drawer>);
    expectTinted(declared(q('.omni-dr'), 'box-shadow'), 3);
  });

  it('Sheet — Level 1', async () => {
    /* Sheet passes its shadow to Drawer through sx, which loads the MUI box
       lazily; until it lands, the drawer's own Level 3 class is what applies. */
    render(<Sheet open>Body</Sheet>);
    await waitFor(() => expect(declared(q('.sheet'), 'box-shadow')).toContain('Level-1'));
    expectTinted(declared(q('.sheet'), 'box-shadow'), 1);
  });

  it('Fab — Level 3 at rest, Level 4 on hover', () => {
    const { container } = render(<Fab aria-label="Add" />);
    const fab = container.querySelector('.omni-fab');
    const rules = stateRules(fab);
    expectTinted(rules.base.match(/box-shadow: (.+?);(?: |$)/)[1], 3);
    expectTinted(rules.states.hover.match(/box-shadow: (.+?);(?: |$)/)[1], 4);
  });

  it('floating Toolbar — Level 2', () => {
    const { container } = render(<Toolbar type="floating" />);
    expectTinted(declared(container.querySelector('.omni-tb'), 'box-shadow'), 2);
  });

  it('sticky AppBar (the default) — Level 2', () => {
    const { container } = render(<AppBar brand="Acme" />);
    expectTinted(declared(container.querySelector('.omni-ab'), 'box-shadow'), 2);
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
