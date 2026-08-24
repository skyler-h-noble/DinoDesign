// src/components/TreeView/TreeView.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  OmniTreeView, DefaultTreeView, SolidTreeView, LightTreeView, DEFAULT_ITEMS,
} from './TreeView';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const SIMPLE_ITEMS = [
  {
    id: 'parent',
    label: 'Parent',
    children: [
      { id: 'child-1', label: 'Child One' },
      { id: 'child-2', label: 'Child Two', disabled: true },
    ],
  },
  { id: 'leaf', label: 'Leaf Node' },
];

const renderTree = (props = {}) =>
  render(<OmniTreeView items={SIMPLE_ITEMS} {...props} />);

/* ─── Basic Rendering ─── */
describe('OmniTreeView', () => {
  test('renders without crashing', () => {
    renderTree();
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  test('renders root item labels', () => {
    renderTree({ defaultExpandedItems: ['parent'] });
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Leaf Node')).toBeInTheDocument();
  });

  test('renders children when expanded', () => {
    renderTree({ defaultExpandedItems: ['parent'] });
    expect(screen.getByText('Child One')).toBeInTheDocument();
    expect(screen.getByText('Child Two')).toBeInTheDocument();
  });

  test('does not render children when collapsed', () => {
    renderTree();
    expect(screen.queryByText('Child One')).not.toBeInTheDocument();
  });
});

/* ─── Wrapper element ─── */
describe('Wrapper element', () => {
  test('has omni-treeview class', () => {
    const { container } = renderTree();
    expect(container.querySelector('.omni-treeview')).toBeInTheDocument();
  });

  test('has variant class', () => {
    const { container } = renderTree({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.omni-treeview-solid')).toBeInTheDocument();
  });

  test('always has data-surface="Surface-Dim"', () => {
    const { container } = renderTree();
    expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
  });

  test('default variant has no data-theme', () => {
    const { container } = renderTree({ variant: 'default' });
    const wrapper = container.querySelector('.omni-treeview');
    expect(wrapper).not.toHaveAttribute('data-theme');
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme', () => {
  const cases = [
    ['primary',   'Primary'],
    ['secondary', 'Secondary'],
    ['tertiary',  'Tertiary'],
    ['neutral',   'Neutral'],
    ['info',      'Info-Medium'],
    ['success',   'Success-Medium'],
    ['warning',   'Warning-Medium'],
    ['error',     'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderTree({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
      expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme', () => {
  const cases = [
    ['primary',   'Primary-Light'],
    ['secondary', 'Secondary-Light'],
    ['tertiary',  'Tertiary-Light'],
    ['neutral',   'Neutral-Light'],
    ['info',      'Info-Light'],
    ['success',   'Success-Light'],
    ['warning',   'Warning-Light'],
    ['error',     'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderTree({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Density classes ─── */
describe('Density', () => {
  test('default density class', () => {
    const { container } = renderTree({ density: 'default' });
    expect(container.querySelector('.omni-treeview-default')).toBeInTheDocument();
  });

  test('compact density class', () => {
    const { container } = renderTree({ density: 'compact' });
    expect(container.querySelector('.omni-treeview-compact')).toBeInTheDocument();
  });
});

/* ─── Selection ─── */
describe('Selection', () => {
  test('renders tree with role="tree"', () => {
    renderTree();
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  test('multiSelect prop renders without error', () => {
    renderTree({ selectionMode: 'multi', defaultExpandedItems: ['parent'] });
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  test('disableSelection prop renders without error', () => {
    renderTree({ disableSelection: true });
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  test('checkboxSelection renders without error', () => {
    renderTree({ checkboxSelection: true, selectionMode: 'multi' });
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});

/* ─── Disabled items ─── */
describe('Disabled items', () => {
  test('disabled item has aria-disabled', () => {
    renderTree({ defaultExpandedItems: ['parent'] });
    const disabledItem = screen.getByText('Child Two').closest('[role="treeitem"]');
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
  });
});

/* ─── Controlled expansion ─── */
describe('Controlled expansion', () => {
  test('expandedItems controls which items are expanded', () => {
    const onExpand = jest.fn();
    renderTree({ expandedItems: ['parent'], onExpandedItemsChange: onExpand });
    expect(screen.getByText('Child One')).toBeInTheDocument();
  });
});

/* ─── Callbacks ─── */
describe('Callbacks', () => {
  test('onItemSelectionToggle fires on item click', () => {
    const onSelectionToggle = jest.fn();
    renderTree({ onItemSelectionToggle: onSelectionToggle });
    fireEvent.click(screen.getByText('Leaf Node'));
    expect(onSelectionToggle).toHaveBeenCalled();
  });

  test('onItemExpansionToggle fires on parent click', () => {
    const onExpansionToggle = jest.fn();
    renderTree({ onItemExpansionToggle: onExpansionToggle });
    // Click the expand icon area of Parent
    const parentItem = screen.getByText('Parent');
    fireEvent.click(parentItem);
    expect(onExpansionToggle).toHaveBeenCalled();
  });
});

/* ─── Convenience exports ─── */
describe('Convenience exports', () => {
  test('DefaultTreeView renders default variant', () => {
    const { container } = render(
      <DefaultTreeView items={SIMPLE_ITEMS} />
    );
    expect(container.querySelector('.omni-treeview-default')).toBeInTheDocument();
    expect(container.querySelector('[data-theme]')).not.toBeInTheDocument();
  });

  test('SolidTreeView renders solid data-theme', () => {
    const { container } = render(
      <SolidTreeView color="primary" items={SIMPLE_ITEMS} />
    );
    expect(container.querySelector('.omni-treeview-solid')).toBeInTheDocument();
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });

  test('LightTreeView renders light data-theme', () => {
    const { container } = render(
      <LightTreeView color="success" items={SIMPLE_ITEMS} />
    );
    expect(container.querySelector('.omni-treeview-light')).toBeInTheDocument();
    expect(container.querySelector('[data-theme="Success-Light"]')).toBeInTheDocument();
  });
});

/* ─── Default items ─── */
describe('DEFAULT_ITEMS', () => {
  test('renders with default items export', () => {
    render(<OmniTreeView items={DEFAULT_ITEMS} />);
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('TreeView — Accessibility (jest-axe)', () => {
  test('has no violations with default props', async () => {
    const { container } = render(
      <OmniTreeView items={SIMPLE_ITEMS} defaultExpandedItems={['parent']} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations in Primary solid theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <OmniTreeView variant="solid" color="primary" items={SIMPLE_ITEMS} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations in light theme', async () => {
    const { container } = render(
      <div data-theme="Primary-Light">
        <OmniTreeView variant="light" color="primary" items={SIMPLE_ITEMS} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no violations with multi-select and checkboxes', async () => {
    const { container } = render(
      <OmniTreeView
        selectionMode="multi"
        checkboxSelection
        variant="solid"
        color="secondary"
        items={SIMPLE_ITEMS}
        defaultExpandedItems={['parent']}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
