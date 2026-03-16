// src/components/TransferList/TransferList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransferList } from './TransferList';
import { axe } from 'jest-axe';

const LEFT = ['Alpha', 'Beta', 'Gamma'];
const RIGHT = ['Delta', 'Epsilon'];

const renderTL = (props = {}) =>
  render(<TransferList defaultLeftItems={LEFT} defaultRightItems={RIGHT} {...props} />);

/* --- Basic --- */
describe('TransferList', () => {
  test('renders', () => {
    const { container } = renderTL();
    expect(container.querySelector('.transfer-list')).toBeInTheDocument();
  });
  test('has role group', () => {
    renderTL();
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
  test('has aria-label', () => {
    renderTL();
    expect(screen.getByLabelText('Transfer list')).toBeInTheDocument();
  });
  test('renders all items', () => {
    renderTL();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });
});

/* --- Modes --- */
describe('Modes', () => {
  test('basic class', () => {
    const { container } = renderTL({ mode: 'basic' });
    expect(container.querySelector('.transfer-list-basic')).toBeInTheDocument();
  });
  test('enhanced class', () => {
    const { container } = renderTL({ mode: 'enhanced' });
    expect(container.querySelector('.transfer-list-enhanced')).toBeInTheDocument();
  });
  test('basic has 2 move buttons', () => {
    renderTL({ mode: 'basic' });
    expect(screen.getByLabelText('Move selected right')).toBeInTheDocument();
    expect(screen.getByLabelText('Move selected left')).toBeInTheDocument();
    expect(screen.queryByLabelText('Move all right')).not.toBeInTheDocument();
  });
  test('enhanced has 4 move buttons', () => {
    renderTL({ mode: 'enhanced' });
    expect(screen.getByLabelText('Move selected right')).toBeInTheDocument();
    expect(screen.getByLabelText('Move selected left')).toBeInTheDocument();
    expect(screen.getByLabelText('Move all right')).toBeInTheDocument();
    expect(screen.getByLabelText('Move all left')).toBeInTheDocument();
  });
});

/* --- Titles --- */
describe('Titles', () => {
  test('default titles', () => {
    renderTL();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Chosen')).toBeInTheDocument();
  });
  test('custom titles', () => {
    renderTL({ leftTitle: 'Source', rightTitle: 'Target' });
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
  });
});

/* --- Selection and moving --- */
describe('Moving items', () => {
  test('move right button disabled when nothing selected', () => {
    renderTL();
    expect(screen.getByLabelText('Move selected right')).toBeDisabled();
  });
  test('selecting item and moving right', () => {
    const onChange = jest.fn();
    renderTL({ onChange });
    // Click on Alpha to select it
    fireEvent.click(screen.getByText('Alpha'));
    // Move right
    fireEvent.click(screen.getByLabelText('Move selected right'));
    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.left).not.toContain('Alpha');
    expect(call.right).toContain('Alpha');
  });
});

/* --- Enhanced --- */
describe('Enhanced features', () => {
  test('shows item counts', () => {
    renderTL({ mode: 'enhanced' });
    expect(screen.getByText('0/3')).toBeInTheDocument();
    expect(screen.getByText('0/2')).toBeInTheDocument();
  });
  test('move all right', () => {
    const onChange = jest.fn();
    renderTL({ mode: 'enhanced', onChange });
    fireEvent.click(screen.getByLabelText('Move all right'));
    expect(onChange).toHaveBeenCalled();
    const call = onChange.mock.calls[0][0];
    expect(call.left).toHaveLength(0);
    expect(call.right).toHaveLength(5);
  });
});

/* --- Disabled --- */
describe('Disabled', () => {
  test('disabled class', () => {
    const { container } = renderTL({ disabled: true });
    expect(container.querySelector('.transfer-list-disabled')).toBeInTheDocument();
  });
  test('move buttons disabled', () => {
    renderTL({ disabled: true });
    expect(screen.getByLabelText('Move selected right')).toBeDisabled();
    expect(screen.getByLabelText('Move selected left')).toBeDisabled();
  });
});

/* --- Empty state --- */
describe('Empty', () => {
  test('shows no items message', () => {
    renderTL({ defaultLeftItems: [], defaultRightItems: ['A'] });
    expect(screen.getByText('No items')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('TransferList — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <TransferList />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <TransferList />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <TransferList />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
