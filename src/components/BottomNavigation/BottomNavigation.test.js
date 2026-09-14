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

/* --- Padding belongs to the style, not the orientation --- */
describe('Padding', () => {
  /* A floating bar is a pill sitting on the page, and the padding holds its
     contents off its own rounded ends. A FIXED bar is the edge of the screen:
     it has nothing to be held off, and the inset only pushed the first and
     last items away from the corners a thumb actually reaches. */
  const padOf = (props) => {
    const { container } = renderNav(props);
    const bar = container.querySelector('.bottom-nav');
    const cs = getComputedStyle(bar);
    return { x: cs.paddingLeft, y: cs.paddingTop };
  };

  test('fixed has none', () => {
    const p = padOf({ variant: 'fixed' });
    expect([p.x, p.y]).toEqual(['0px', '0px']);
  });

  test('floating has it', () => {
    const p = padOf({ variant: 'floating' });
    expect(p.x).not.toBe('0px');
  });

  test('a vertical FIXED bar has none either — style decides, not direction', () => {
    const p = padOf({ variant: 'fixed', orientation: 'vertical' });
    expect([p.x, p.y]).toEqual(['0px', '0px']);
  });
});

describe('The FAB is in the bar', () => {
  /* An action among the items, the way Rail's fabAction is: a ring the size
     of an item's icon holder, outlined rather than filled. It takes an
     item's place in the row so it lands where a thumb already goes. */
  const fab = { label: 'Create', onClick: jest.fn() };
  const order = (container) =>
    Array.from(container.querySelectorAll('.bottom-nav-item, .bottom-nav-fab'))
      .map((el) => (el.classList.contains('bottom-nav-fab') ? 'FAB' : el.getAttribute('aria-label')));

  test('absent unless asked for', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-fab')).toBeNull();
  });

  test('at the end by default', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab });
    expect(order(container)).toEqual(['Home', 'Favorites', 'Profile', 'Stars', 'FAB']);
  });

  test('centred splits the items either side of it', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab, fabPosition: 'center' });
    expect(order(container)).toEqual(['Home', 'Favorites', 'FAB', 'Profile', 'Stars']);
  });

  test('an odd count puts the extra item before it', () => {
    const { container } = renderNav({ items: ITEMS_5, fabAction: fab, fabPosition: 'center' });
    expect(order(container)).toEqual(['Home', 'Favorites', 'Profile', 'FAB', 'Stars', 'Search']);
  });

  test('is a button, not a tab — it acts, it is never the value', () => {
    const onChange = jest.fn();
    renderNav({ items: ITEMS_4, fabAction: fab, onChange });
    const ring = screen.getByRole('button', { name: 'Create' });
    expect(ring).not.toHaveAttribute('role', 'tab');
    expect(ring).not.toHaveAttribute('aria-selected');
    fireEvent.click(ring);
    expect(fab.onClick).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });

  test('outlined in the default button border, on no fill', () => {
    /* Not a filled circle: the selected item is the filled circle, and two
       filled circles in one bar say two things are current. */
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab });
    const holder = container.querySelector('.bottom-nav-fab > div');
    /* jsdom drops a var() from a computed border colour, so read the
       injected rule rather than the computed style. */
    const rule = [...document.styleSheets]
      .flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } })
      .map((r) => r.cssText)
      .find((t) => t.startsWith('.' + [...holder.classList].find((c) => c.startsWith('css-'))));
    expect(rule).toContain('border-color: var(--Buttons-Default-Border)');
    expect(rule).toContain('color: var(--Buttons-Default-Border)');
    expect(rule).toContain('background-color: transparent');
    expect(rule).not.toMatch(/background-color: var\(--Text\)/);
  });

  test('has no accessibility violations', async () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab, fabPosition: 'center' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
