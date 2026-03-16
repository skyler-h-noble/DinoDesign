// src/components/Drawer/Drawer.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer, DrawerClose, DrawerHeader, DrawerContent } from './Drawer';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const renderDrawer = (props = {}) =>
  render(
    <Drawer open={true} onClose={jest.fn()} {...props}>
      <DrawerClose onClick={props.onClose || jest.fn()} />
      <DrawerHeader>Title</DrawerHeader>
      <DrawerContent>Content here</DrawerContent>
    </Drawer>
  );

/* ─── Basic Rendering ─── */
describe('Drawer', () => {
  test('renders when open', () => {
    renderDrawer();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<Drawer open={false} onClose={jest.fn()}><DrawerContent>Hidden</DrawerContent></Drawer>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  test('has role="dialog"', () => {
    renderDrawer();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('has aria-modal="true"', () => {
    renderDrawer();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});

/* ─── Variants (no data-theme) ─── */
describe('Standard variant', () => {
  test('no data-theme on standard', () => {
    const { container } = renderDrawer({ variant: 'standard' });
    expect(container.querySelector('.drawer')).not.toHaveAttribute('data-theme');
  });

  test('has drawer-standard class', () => {
    const { container } = renderDrawer({ variant: 'standard' });
    expect(container.querySelector('.drawer-standard')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info-Medium'], ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'], ['error', 'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderDrawer({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary', 'Primary-Light'], ['secondary', 'Secondary-Light'], ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'], ['info', 'Info-Light'], ['success', 'Success-Light'],
    ['warning', 'Warning-Light'], ['error', 'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderDrawer({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class', () => {
      const { container } = renderDrawer({ size: s });
      expect(container.querySelector('.drawer-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Anchors ─── */
describe('Anchor classes', () => {
  ['left', 'right', 'top', 'bottom'].forEach((a) => {
    test(a + ' anchor class', () => {
      const { container } = renderDrawer({ anchor: a });
      expect(container.querySelector('.drawer-' + a)).toBeInTheDocument();
    });
  });
});

/* ─── Close Mechanisms ─── */
describe('Close mechanisms', () => {
  test('Escape key triggers onClose', () => {
    const onClose = jest.fn();
    renderDrawer({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('backdrop click triggers onClose', () => {
    const onClose = jest.fn();
    const { container } = renderDrawer({ onClose });
    const backdrop = container.querySelector('.drawer-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  test('no backdrop when hideBackdrop is true', () => {
    const { container } = renderDrawer({ hideBackdrop: true });
    expect(container.querySelector('.drawer-backdrop')).not.toBeInTheDocument();
  });
});

/* ─── DrawerClose ─── */
describe('DrawerClose', () => {
  test('renders close button', () => {
    renderDrawer();
    expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
  });

  test('close button has aria-label', () => {
    renderDrawer();
    expect(screen.getByLabelText('Close drawer')).toHaveAttribute('aria-label', 'Close drawer');
  });

  test('close button is a button element', () => {
    renderDrawer();
    expect(screen.getByLabelText('Close drawer').tagName).toBe('BUTTON');
  });

  test('close button has drawer-close class', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-close')).toBeInTheDocument();
  });

  test('clicking close button triggers onClick', () => {
    const onClick = jest.fn();
    render(
      <Drawer open={true} onClose={jest.fn()}>
        <DrawerClose onClick={onClick} />
      </Drawer>
    );
    fireEvent.click(screen.getByLabelText('Close drawer'));
    expect(onClick).toHaveBeenCalled();
  });
});

/* ─── DrawerHeader ─── */
describe('DrawerHeader', () => {
  test('renders header content', () => {
    renderDrawer();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  test('has drawer-header class', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-header')).toBeInTheDocument();
  });
});

/* ─── DrawerContent ─── */
describe('DrawerContent', () => {
  test('renders content', () => {
    renderDrawer();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });

  test('has drawer-content class', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-content')).toBeInTheDocument();
  });
});

/* ─── Default props ─── */
describe('Defaults', () => {
  test('default anchor is left', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-left')).toBeInTheDocument();
  });

  test('default size is medium', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-medium')).toBeInTheDocument();
  });

  test('default variant is standard', () => {
    const { container } = renderDrawer();
    expect(container.querySelector('.drawer-standard')).toBeInTheDocument();
  });
});

/* ─── Body scroll lock ─── */
describe('Body scroll', () => {
  test('body overflow is hidden when open', () => {
    renderDrawer();
    expect(document.body.style.overflow).toBe('hidden');
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Drawer — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Drawer open={false} aria-label="Navigation drawer"><p>Content</p></Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Drawer open={false} aria-label="Navigation drawer"><p>Content</p></Drawer>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Drawer open={false} aria-label="Navigation drawer"><p>Content</p></Drawer>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
