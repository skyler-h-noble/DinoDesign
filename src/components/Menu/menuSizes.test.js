// src/components/Menu/menuSizes.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Dropdown, MenuButton, Menu, MenuItem } from './Menu';

/* NOTE: this project runs JEST, whose `expect` takes ONE argument. The
   two-argument form is Vitest's, and using it here does not fail the
   assertion — it throws "Expect takes at most one argument" and the test
   fails for the wrong reason, which reads like a product bug. Context goes in
   a thrown message instead. */

/**
 * Menu renders three sizes, matching the three Component-Size modes in Figma.
 *
 * It used to render two. The branch asked `size === 'small' ? BodySmall : Body`,
 * so `large` fell through to medium — a large menu kept medium type while every
 * other component in the row grew. Nothing failed, because nothing asked.
 *
 * A mode the code silently ignores is worse than one it does not offer: the
 * design file and the build disagree and neither says so. That is the same
 * shape as the Accordion binding to a variable nothing writes.
 */

const sizes = ['small', 'medium', 'large'];

/* `size` lives on the DROPDOWN, not on the children — MenuButton, Menu and
   MenuItem all read it from useDropdown(). And Dropdown has no `defaultOpen`;
   it is `open` (controlled) or internal state. Getting either wrong renders a
   closed medium menu for all three cases, which looks exactly like the
   component ignoring size. */
const openMenu = (size, extra = {}) => render(
  <Dropdown size={size} open>
    <MenuButton>Actions</MenuButton>
    <Menu>
      <MenuItem {...extra}>Profile</MenuItem>
    </Menu>
  </Dropdown>,
);

/* The MenuItem's label, not the MenuButton's — querySelectorAll returns the
   button first, and asserting on it would test the trigger while claiming to
   test the row. */
const itemText = (container) => {
  const els = [...container.querySelectorAll('.typography')];
  return els[els.length - 1];
};

describe('Menu renders all three sizes distinctly', () => {
  it('gives each size its own typography class', () => {
    const seen = new Set();
    for (const size of sizes) {
      const { container } = openMenu(size);
      const el = itemText(container);
      if (!el) throw new Error(`size="${size}" rendered no typography element`);
      const styleClass = [...el.classList].find((c) => c.startsWith('typography-') && !c.startsWith('typography-color') && !c.startsWith('typography-width'));
      seen.add(styleClass);
    }
    // Three sizes must produce three DIFFERENT type styles. Two would mean one
    // size is silently borrowing another's — the bug this file exists for.
    expect(seen.size).toBe(3);
  });

  it('a selected row steps to the matching Subtitle, at every size', () => {
    /* Body ships standard and semibold only — there is no bold Body — so the
       selected row steps to Subtitle, which IS Body at 700. The large branch
       has to step too, or a selected large row loses its weight. */
    const seen = new Set();
    for (const size of sizes) {
      const { container } = openMenu(size, { selected: true });
      const el = itemText(container);
      const styleClass = [...el.classList].find((c) => /^typography-subtitle/.test(c));
      if (!styleClass) throw new Error(`size="${size}" selected row is not a Subtitle style`);
      seen.add(styleClass);
    }
    expect(seen.size).toBe(3);
  });

  it('an unknown size falls back to medium rather than rendering nothing', () => {
    const { container } = openMenu('enormous');
    expect(itemText(container)).toBeInTheDocument();
  });
});
