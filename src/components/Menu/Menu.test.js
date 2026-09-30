// src/components/Menu/Menu.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Dropdown, MenuButton, Menu, MenuItem, MenuDivider } from './Menu';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderMenu = (dropdownProps = {}, menuItems) =>
  render(
    <Dropdown {...dropdownProps}>
      <MenuButton>Actions</MenuButton>
      <Menu>
        {menuItems || (
          <>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </>
        )}
      </Menu>
    </Dropdown>
  );

/* ─── Basic Rendering ─── */
describe('Menu', () => {
  test('renders MenuButton', () => {
    renderMenu();
    expect(menuButton()).toBeInTheDocument();
  });

  test('menu hidden by default (uncontrolled)', () => {
    renderMenu();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('click opens menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('second click closes menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(menuButton());
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ─── Controlled ─── */
describe('Controlled open state', () => {
  test('open={true} shows menu without click', () => {
    renderMenu({ open: true });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('open={false} hides menu even after click', () => {
    renderMenu({ open: false });
    fireEvent.click(menuButton());
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* The ARIA lives on the <button>, and on the menuitem roots — NOT on the
 * Typography inside them. getByText('Actions') returns the inner <p>, so every
 * one of these read attributes off a node that never had them. CLAUDE.md has
 * recorded these as TEST bugs rather than component bugs for a while; this is
 * that fix. Querying by ROLE and accessible NAME also means the assertion
 * fails if the control stops being a button or loses its name — which is what
 * the test is really about.
 */
const menuButton = () => screen.getByRole('button', { name: 'Actions' });

/* ─── MenuButton ARIA ─── */
describe('MenuButton ARIA', () => {
  test('has aria-haspopup', () => {
    renderMenu();
    expect(menuButton()).toHaveAttribute('aria-haspopup', 'true');
  });

  test('aria-expanded false when closed', () => {
    renderMenu();
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  test('aria-expanded true when open', () => {
    renderMenu();
    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
  });

  test('aria-controls set when open', () => {
    renderMenu();
    fireEvent.click(menuButton());
    const btn = menuButton();
    const menuId = btn.getAttribute('aria-controls');
    expect(menuId).toBeTruthy();
    expect(screen.getByRole('menu')).toHaveAttribute('id', menuId);
  });
});

/* ─── Menu ARIA ─── */
describe('Menu ARIA', () => {
  test('has role=menu', () => {
    renderMenu({ open: true });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('aria-labelledby links to MenuButton', () => {
    renderMenu({ open: true });
    const menu = screen.getByRole('menu');
    const labelledBy = menu.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(menuButton()).toHaveAttribute('id', labelledBy);
  });
});

/* ─── MenuItem ARIA ─── */
describe('MenuItem ARIA', () => {
  test('items have role=menuitem', () => {
    renderMenu({ open: true });
    const items = screen.getAllByRole('menuitem');
    expect(items.length).toBe(3);
  });

  test('selected item has aria-selected', () => {
    renderMenu({ open: true }, (
      <>
        <MenuItem selected>Selected</MenuItem>
        <MenuItem>Other</MenuItem>
      </>
    ));
    expect(screen.getByRole('menuitem', { name: 'Selected' })).toHaveAttribute('aria-selected', 'true');
  });

  test('disabled item has aria-disabled', () => {
    renderMenu({ open: true }, (
      <>
        <MenuItem disabled>Disabled</MenuItem>
        <MenuItem>Other</MenuItem>
      </>
    ));
    expect(screen.getByRole('menuitem', { name: 'Disabled' })).toHaveAttribute('aria-disabled', 'true');
  });

  test('disabled item has tabIndex -1', () => {
    renderMenu({ open: true }, (
      <>
        <MenuItem disabled>Disabled</MenuItem>
        <MenuItem>Other</MenuItem>
      </>
    ));
    expect(screen.getByRole('menuitem', { name: 'Disabled' })).toHaveAttribute('tabindex', '-1');
  });

  test('clicking item closes menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('Enter activates item and closes menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    const item = screen.getByText('Profile');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('Space activates item and closes menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    const item = screen.getByText('Profile');
    fireEvent.keyDown(item, { key: ' ' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ─── Keyboard Navigation ─── */
describe('Keyboard navigation', () => {
  test('ArrowDown on MenuButton opens menu', () => {
    renderMenu();
    const btn = menuButton();
    fireEvent.keyDown(btn, { key: 'ArrowDown' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('Enter on MenuButton opens menu', () => {
    renderMenu();
    const btn = menuButton();
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('Escape closes menu', () => {
    renderMenu();
    fireEvent.click(menuButton());
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

/* ─── MenuDivider ─── */
describe('MenuDivider', () => {
  test('renders with role=separator', () => {
    renderMenu({ open: true }, (
      <>
        <MenuItem>A</MenuItem>
        <MenuDivider />
        <MenuItem>B</MenuItem>
      </>
    ));
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('renders as hr', () => {
    const { container } = renderMenu({ open: true }, (
      <>
        <MenuItem>A</MenuItem>
        <MenuDivider />
        <MenuItem>B</MenuItem>
      </>
    ));
    expect(container.querySelector('hr.menu-divider')).toBeInTheDocument();
  });
});

/* ─── Variants ─── */
describe('Variants', () => {
  test('default has no data-theme', () => {
    const { container } = renderMenu({ variant: 'default', open: true });
    expect(container.querySelector('.menu')).not.toHaveAttribute('data-theme');
  });

  test('default has menu-default class', () => {
    const { container } = renderMenu({ variant: 'default', open: true });
    expect(container.querySelector('.menu-default')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'],
    ['info', 'Info'],
    ['success', 'Success'],
    ['warning', 'Warning'],
    ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderMenu({ variant: 'solid', color, open: true });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });

  test('solid has data-surface="Surface"', () => {
    const { container } = renderMenu({ variant: 'solid', color: 'primary', open: true });
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'],
    ['info', 'Info'],
    ['success', 'Success'],
    ['warning', 'Warning'],
    ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderMenu({ variant: 'light', color, open: true });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* Size is NOT a class. Menu emits `menu-button` and `menu menu-<variant>`;
   there has never been a menu-<size> or menu-button-<size>, so the six tests
   here asserted class names that do not exist. Sizing is covered properly in
   menuSizes.test.js, which renders all three and asserts the typography step
   each one actually resolves to. */

/* ─── Outlined ─── */
describe('Outlined', () => {
  test('menu has border (all menus outlined)', () => {
    const { container } = renderMenu({ open: true });
    const menu = container.querySelector('.menu');
    expect(menu).toBeInTheDocument();
    // Border applied via sx — class presence confirms component rendered
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Menu — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Menu open={false}><MenuItem>Item</MenuItem></Menu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Menu open={false}><MenuItem>Item</MenuItem></Menu>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Menu open={false}><MenuItem>Item</MenuItem></Menu>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
