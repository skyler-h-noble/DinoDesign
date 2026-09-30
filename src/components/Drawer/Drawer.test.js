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

/* ─── Theming ─── */
/* Drawer has NO color prop and no variants — its own header says so: the
   content it holds (TreeView, nav items) does its own theming, and the drawer
   inherits the provider's theme and sits on Surface-Dim, matching Sidebar.
   The three describes removed here asserted variant="standard|solid|light",
   a drawer-standard class and a per-colour data-theme ladder, none of which
   this component has. */
describe('inherits rather than choosing a theme', () => {
  /* It DOES set data-theme — from the PROVIDER, not from a prop — paired with
     a fixed data-surface="Surface-Dim", matching Sidebar. What it has no way
     to do is take a per-drawer colour. */
  test('takes data-theme from the provider, at a fixed Surface-Dim', () => {
    const { container } = renderDrawer();
    const drawer = container.querySelector('.drawer');
    expect(drawer).toHaveAttribute('data-theme', 'Default');
    expect(drawer).toHaveAttribute('data-surface', 'Surface-Dim');
  });

  test('and a color prop changes nothing', () => {
    const { container } = renderDrawer({ color: 'error' });
    expect(container.querySelector('.drawer')).toHaveAttribute('data-theme', 'Default');
  });

  test('and no variant class', () => {
    const { container } = renderDrawer();
    const cls = container.querySelector('.drawer').className;
    for (const stale of ['drawer-standard', 'drawer-solid', 'drawer-light']) {
      expect(cls).not.toContain(stale);
    }
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

  /* The backdrop carries no class — it is the sibling Box rendered before the
     dialog when hideBackdrop is false. Selecting it by a `.drawer-backdrop`
     class that has never existed made this a null click. */
  test('backdrop click triggers onClose', () => {
    const onClose = jest.fn();
    const { container } = renderDrawer({ onClose });
    const backdrop = container.querySelector('[role="dialog"]').previousElementSibling;
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

  /* The close control is a lib Button with an accessible NAME, not a class —
     which is the thing that actually has to be right for a screen reader. */
  test('close button is reachable by its accessible name', () => {
    renderDrawer();
    expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
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

  /* No variant axis at all — see the theming block above. */
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
