// src/components/BottomNavigation/BottomNavigation.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation } from './BottomNavigation';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';

const ITEMS_3 = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <FavoriteIcon />, label: 'Favorites' },
  { icon: <PersonIcon />, label: 'Profile' },
];
const ITEMS_4 = [...ITEMS_3, { icon: <StarIcon />, label: 'Stars' }];
const ITEMS_5 = [...ITEMS_4, { icon: <SearchIcon />, label: 'Search' }];

const renderNav = (props = {}) =>
  render(<BottomNavigation items={ITEMS_3} {...props} />);

/* --- Basic --- */
describe('BottomNavigation', () => {
  test('renders', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav')).toBeInTheDocument();
  });
  test('renders nav landmark', () => {
    renderNav();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  test('has aria-label', () => {
    renderNav();
    expect(screen.getByLabelText('Bottom navigation')).toBeInTheDocument();
  });
  test('renders tablist', () => {
    renderNav();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
  test('renders correct number of tabs', () => {
    renderNav();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });
});

/* --- Always present: data-surface --- */
describe('Data attributes', () => {
  test('always has data-surface="Surface-Dim"', () => {
    const { container } = renderNav();
    expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
  });
  test('data-surface present for non-default barColor', () => {
    const { container } = renderNav({ barColor: 'primary' });
    expect(container.querySelector('[data-surface="Surface-Dim"]')).toBeInTheDocument();
  });
});

/* --- data-theme per barColor --- */
describe('data-theme per barColor', () => {
  test('default sets data-theme="Nav-Bar"', () => {
    const { container } = renderNav();
    expect(container.querySelector('[data-theme="Nav-Bar"]')).toBeInTheDocument();
  });
  test('primary sets data-theme="Primary"', () => {
    const { container } = renderNav({ barColor: 'primary' });
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });
  test('primary-light sets data-theme="Primary-Light"', () => {
    const { container } = renderNav({ barColor: 'primary-light' });
    expect(container.querySelector('[data-theme="Primary-Light"]')).toBeInTheDocument();
  });
  test('primary-dark sets data-theme="Primary-Dark"', () => {
    const { container } = renderNav({ barColor: 'primary-dark' });
    expect(container.querySelector('[data-theme="Primary-Dark"]')).toBeInTheDocument();
  });
  test('white sets data-theme="White"', () => {
    const { container } = renderNav({ barColor: 'white' });
    expect(container.querySelector('[data-theme="White"]')).toBeInTheDocument();
  });
  test('black sets data-theme="Black"', () => {
    const { container } = renderNav({ barColor: 'black' });
    expect(container.querySelector('[data-theme="Black"]')).toBeInTheDocument();
  });
});

/* --- Selection --- */
describe('Selection', () => {
  test('first item selected by default', () => {
    renderNav();
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });
  test('clicking changes selection', () => {
    renderNav();
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });
  test('onChange callback fires', () => {
    const onChange = jest.fn();
    renderNav({ onChange });
    fireEvent.click(screen.getAllByRole('tab')[2]);
    expect(onChange).toHaveBeenCalledWith(2);
  });
  test('controlled value', () => {
    renderNav({ value: 2 });
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true');
  });
});

/* --- Labels --- */
describe('Labels', () => {
  test('shows labels by default', () => {
    renderNav();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  test('hides labels when showLabels=false', () => {
    renderNav({ showLabels: false });
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});

/* --- Horizontal constraint --- */
describe('Horizontal constraint', () => {
  test('5 items forces vertical', () => {
    const { container } = render(<BottomNavigation items={ITEMS_5} showLabels labelOrientation="horizontal" />);
    expect(container.querySelector('.bottom-nav-horizontal')).not.toBeInTheDocument();
  });
  test('4 items allows horizontal', () => {
    const { container } = render(<BottomNavigation items={ITEMS_4} showLabels labelOrientation="horizontal" />);
    expect(container.querySelector('.bottom-nav-horizontal')).toBeInTheDocument();
  });
});

/* --- Backfill --- */
describe('Backfill', () => {
  test('backfill class when enabled', () => {
    const { container } = renderNav({ backfill: true });
    expect(container.querySelector('.bottom-nav-backfill')).toBeInTheDocument();
  });
  test('no backfill class when disabled', () => {
    const { container } = renderNav({ backfill: false });
    expect(container.querySelector('.bottom-nav-backfill')).not.toBeInTheDocument();
  });
});

/* --- Fixed --- */
describe('Fixed', () => {
  test('fixed on by default', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-fixed')).toBeInTheDocument();
  });
  test('no fixed when fixed=false', () => {
    const { container } = renderNav({ fixed: false });
    expect(container.querySelector('.bottom-nav-fixed')).not.toBeInTheDocument();
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('default barColor is default', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-default')).toBeInTheDocument();
  });
  test('labels shown', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-labels')).toBeInTheDocument();
  });
  test('backfill on', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-backfill')).toBeInTheDocument();
  });
  test('fixed on', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-fixed')).toBeInTheDocument();
  });
});
