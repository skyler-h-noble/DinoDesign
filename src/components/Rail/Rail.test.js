// src/components/Rail/Rail.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Rail } from './Rail';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import { axe } from 'jest-axe';

const ITEMS = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <InboxIcon />, label: 'Inbox' },
  { icon: <SendIcon />, label: 'Send' },
  { icon: <FavoriteIcon />, label: 'Favorites' },
];

const renderRail = (props = {}) =>
  render(<Rail items={ITEMS} {...props} />);

/* --- Basic --- */
describe('Rail', () => {
  test('renders', () => {
    const { container } = renderRail();
    expect(container.querySelector('.rail')).toBeInTheDocument();
  });
  test('nav landmark', () => {
    renderRail();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  test('aria-label', () => {
    renderRail();
    expect(screen.getByLabelText('Navigation rail')).toBeInTheDocument();
  });
  test('renders correct number of tabs', () => {
    renderRail();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });
});

/* --- Theme attributes --- */
describe('Theme', () => {
  test('data-theme="Default"', () => {
    const { container } = renderRail();
    expect(container.querySelector('[data-theme="Default"]')).toBeInTheDocument();
  });
  test('data-surface="Surface-Dim"', () => {
    const { container } = renderRail();
    expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
  });
});

/* --- Selection --- */
describe('Selection', () => {
  test('first item selected by default', () => {
    renderRail();
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
  test('clicking changes selection', () => {
    renderRail();
    fireEvent.click(screen.getAllByRole('tab')[2]);
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true');
  });
  test('onChange fires', () => {
    const onChange = jest.fn();
    renderRail({ onChange });
    fireEvent.click(screen.getAllByRole('tab')[1]);
    expect(onChange).toHaveBeenCalledWith(1);
  });
  test('controlled value', () => {
    renderRail({ value: 3 });
    expect(screen.getAllByRole('tab')[3]).toHaveAttribute('aria-selected', 'true');
  });
});

/* --- Expandable --- */
describe('Expandable', () => {
  test('collapsed by default', () => {
    const { container } = renderRail({ expandable: true });
    expect(container.querySelector('.rail-collapsed')).toBeInTheDocument();
  });
  test('shows expand button', () => {
    renderRail({ expandable: true });
    expect(screen.getByLabelText('Expand menu')).toBeInTheDocument();
  });
  test('clicking expand toggles', () => {
    const { container } = renderRail({ expandable: true });
    fireEvent.click(screen.getByLabelText('Expand menu'));
    expect(container.querySelector('.rail-expanded')).toBeInTheDocument();
    expect(screen.getByLabelText('Collapse menu')).toBeInTheDocument();
  });
  test('no expand button when not expandable', () => {
    renderRail({ expandable: false });
    expect(screen.queryByLabelText('Expand menu')).not.toBeInTheDocument();
  });
});

/* --- Classes --- */
describe('Classes', () => {
  test('fixed class when not expandable', () => {
    const { container } = renderRail({ expandable: false });
    expect(container.querySelector('.rail-fixed')).toBeInTheDocument();
  });
  test('expandable class', () => {
    const { container } = renderRail({ expandable: true });
    expect(container.querySelector('.rail-expandable')).toBeInTheDocument();
  });
});

/* --- Sections --- */
describe('Sections', () => {
  test('renders items from sections', () => {
    renderRail({
      items: undefined,
      sections: [
        { items: [{ icon: <HomeIcon />, label: 'Home' }, { icon: <InboxIcon />, label: 'Inbox' }] },
        { items: [{ icon: <SettingsIcon />, label: 'Settings' }] },
      ],
    });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });
});

/* --- FAB action --- */
describe('FAB action', () => {
  test('renders fab action button', () => {
    renderRail({ fabAction: { icon: <HomeIcon />, label: 'Compose', onClick: jest.fn() } });
    expect(screen.getByLabelText('Compose')).toBeInTheDocument();
  });
  test('no fab when not provided', () => {
    renderRail();
    expect(screen.queryByLabelText('Compose')).not.toBeInTheDocument();
  });
});

/* --- Labels --- */
describe('Labels', () => {
  test('shows labels', () => {
    renderRail();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Inbox')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Rail — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Rail />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Rail />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Rail />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
