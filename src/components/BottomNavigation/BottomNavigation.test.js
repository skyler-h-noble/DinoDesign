// src/components/BottomNavigation/BottomNavigation.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation } from './BottomNavigation';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import { axe } from 'jest-axe';

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
  /* The nine themes. primary-light / primary-dark / white / black were here
     and are not Theme modes — they bound nothing and left the bar on its
     parent's palette, which reads as barColor being ignored rather than as a
     dead name. A light bar is now the palette on a brighter SURFACE. */
  test('default sets data-theme="Nav-Bar"', () => {
    const { container } = renderNav();
    expect(container.querySelector('[data-theme="Nav-Bar"]')).toBeInTheDocument();
  });

  for (const [prop, theme] of [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'],
    ['warning', 'Warning'], ['error', 'Error'],
  ]) {
    test(`${prop} sets data-theme="${theme}"`, () => {
      const { container } = renderNav({ barColor: prop });
      expect(container.querySelector(`[data-theme="${theme}"]`)).toBeInTheDocument();
    });
  }

  test('an unknown barColor falls back rather than binding nothing', () => {
    const { container } = renderNav({ barColor: 'chartreuse' });
    expect(container.querySelector('[data-theme="Nav-Bar"]')).toBeInTheDocument();
  });
});

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
describe('Orientation is the BAR, not the label', () => {
  /* This used to be labelOrientation — whether the label sat beside the icon
     or under it — with an automatic override forcing "vertical" past four
     items. The design has neither: the label is always under the icon, and
     Orientation is the bar's own direction, 398x83 against 64x377.
     
     One word for two axes is how the vertical BAR ended up unreachable.
     Asking for orientation="vertical" moved the label. */
  test('horizontal by default', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-bar-horizontal')).toBeInTheDocument();
  });
  test('vertical when asked, whatever the item count', () => {
    const { container } = render(
      <BottomNavigation items={ITEMS_5} orientation="vertical" />
    );
    expect(container.querySelector('.bottom-nav-bar-vertical')).toBeInTheDocument();
  });
  test('five items do not silently change the arrangement', () => {
    const { container } = render(<BottomNavigation items={ITEMS_5} />);
    expect(container.querySelector('.bottom-nav-bar-horizontal')).toBeInTheDocument();
  });
});

describe('Style — fixed band or floating pill', () => {
  /* Replaces `backfill`, which drew the selected item as a --Buttons-Primary
     pill with a border. That made it look like a primary BUTTON sitting in
     the bar, and tied the accent to the Primary palette rather than to the
     theme the bar is set to. The design fills a circle in --Text and reverses
     the icon out of it, always — there is no off switch, so there is no prop.
     
     What IS a choice is the bar's shape. */
  test('fixed by default', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-style-fixed')).toBeInTheDocument();
  });
  test('floating when asked', () => {
    const { container } = renderNav({ variant: 'floating' });
    expect(container.querySelector('.bottom-nav-style-floating')).toBeInTheDocument();
  });
  test('style and positioning are separate axes', () => {
    // A floating bar is usually pinned too — the words are not alternatives.
    const { container } = renderNav({ variant: 'floating', fixed: true });
    expect(container.querySelector('.bottom-nav-style-floating')).toBeInTheDocument();
    expect(container.querySelector('.bottom-nav-fixed')).toBeInTheDocument();
  });
});

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
  test('style defaults to fixed', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-style-fixed')).toBeInTheDocument();
  });
  test('fixed on', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-fixed')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('BottomNavigation — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <BottomNavigation />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <BottomNavigation />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <BottomNavigation />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
