// src/components/BottomNavigation/BottomNavigation.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation } from './BottomNavigation';
import HomeIcon from '@omni-design/icons/Home';
import FavoriteIcon from '@omni-design/icons/Favorite';
import PersonIcon from '@omni-design/icons/Person';
import StarIcon from '@omni-design/icons/Star';
import SearchIcon from '@omni-design/icons/Search';
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
  /* No level of its own: the Nav-Bar theme IS the user's pick (palette and
     tone), so a forced level would move the bar off what they chose. */
  test('no data-surface by default — the Nav-Bar pick stands as it is', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav')).toHaveAttribute('data-theme', 'Nav-Bar');
    expect(container.querySelector('.bottom-nav')).not.toHaveAttribute('data-surface');
  });
  test('surface sets the level when asked', () => {
    const { container } = renderNav({ barColor: 'primary', surface: 'Surface-Bright' });
    expect(container.querySelector('.bottom-nav')).toHaveAttribute('data-surface', 'Surface-Bright');
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

/* --- Padding: the current Nav-Bar set's, per style --- */
describe('Padding', () => {
  /* jsdom drops var() from computed padding, so read the injected rule. */
  const ruleOf = (props) => {
    const { container } = renderNav(props);
    const bar = container.querySelector('.bottom-nav');
    const cls = [...bar.classList].find((c) => c.startsWith('css-'));
    return [...document.styleSheets]
      .flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } })
      .map((r) => r.cssText)
      .find((t) => t.startsWith('.' + cls)) || '';
  };

  test('fixed: Sizing-1-and-Half down, Sizing-4 across', () => {
    const r = ruleOf({ variant: 'fixed' });
    expect(r).toContain('padding-left: var(--Sizing-4');
    expect(r).toContain('padding-top: var(--Sizing-1-and-Half');
  });

  test('floating: Sizing-1-and-Half down, Sizing-3 across', () => {
    const r = ruleOf({ variant: 'floating' });
    expect(r).toContain('padding-left: var(--Sizing-3');
    expect(r).toContain('padding-top: var(--Sizing-1-and-Half');
  });

  test('vertical floating: Sizing-1-and-Half all round', () => {
    const r = ruleOf({ variant: 'floating', orientation: 'vertical' });
    expect(r).toContain('padding-left: var(--Sizing-1-and-Half');
    expect(r).toContain('padding-top: var(--Sizing-1-and-Half');
  });
});

describe('The FAB: Raised and Right FAB styles', () => {
  /* Figma's Nav-Bar has two FAB styles: Floating +Raised FAB (the FAB on the
     bar's top edge over a gap in the items) and Right FAB (beside the bar).
     The FAB is the library's Fab, outside the tablist. */
  const fab = { label: 'Create', onClick: jest.fn() };
  const order = (container) =>
    Array.from(container.querySelectorAll('.bottom-nav-item, .bottom-nav-fab-gap'))
      .map((el) => (el.classList.contains('bottom-nav-fab-gap') ? 'GAP' : el.getAttribute('aria-label')));

  test('absent unless asked for', () => {
    const { container } = renderNav();
    expect(container.querySelector('.bottom-nav-fab')).toBeNull();
    expect(container.querySelector('.bottom-nav-wrap')).toBeNull();
  });

  test("Right FAB by default: beside the bar, after it, no gap in the items", () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab });
    const wrap = container.querySelector('.bottom-nav-wrap-right');
    expect(wrap).not.toBeNull();
    expect(wrap.lastElementChild).toHaveClass('bottom-nav-fab');
    expect(order(container)).toEqual(['Home', 'Favorites', 'Profile', 'Stars']);
  });

  test('Raised: the items part round a gap, the FAB sits over it', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab, fabPosition: 'center' });
    expect(container.querySelector('.bottom-nav-fab-raised')).not.toBeNull();
    expect(order(container)).toEqual(['Home', 'Favorites', 'GAP', 'Profile', 'Stars']);
  });

  test('an odd count puts the extra item before the gap', () => {
    const { container } = renderNav({ items: ITEMS_5, fabAction: fab, fabPosition: 'center' });
    expect(order(container)).toEqual(['Home', 'Favorites', 'Profile', 'GAP', 'Stars', 'Search']);
  });

  test('a FAB makes the bar a pill — both FAB styles are floating', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab, variant: 'fixed' });
    expect(container.querySelector('.bottom-nav')).toHaveClass('bottom-nav-style-floating');
  });

  test('the FAB is the library Fab', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab });
    expect(container.querySelector('.bottom-nav-fab .fab')).not.toBeNull();
  });

  test('is a button, not a tab — it acts, it is never the value', () => {
    const onChange = jest.fn();
    renderNav({ items: ITEMS_4, fabAction: fab, onChange });
    const btn = screen.getByRole('button', { name: 'Create' });
    expect(btn).not.toHaveAttribute('role', 'tab');
    expect(btn).not.toHaveAttribute('aria-selected');
    fireEvent.click(btn);
    expect(fab.onClick).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });

  test('has no accessibility violations', async () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: fab, fabPosition: 'center' });
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('The ring as a speed dial', () => {
  /* Given actions, the ring is the library's SpeedDial — Figma's Nav-Bar
     holds a SpeedDial where the FAB was. The + turns to an ×, the actions
     fan out above it, each a FAB named by its label. */
  const actions = [
    { label: 'New post', onClick: jest.fn() },
    { label: 'Upload', onClick: jest.fn() },
    { label: 'Record' },
  ];
  const dial = { label: 'Create', actions };

  test('closed until the ring is pressed, then its actions', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: dial });
    expect(container.querySelector('.bottom-nav-fab .speed-dial')).toBeTruthy();
    const ring = screen.getByRole('button', { name: 'Create' });
    expect(ring).toHaveAttribute('aria-haspopup', 'menu');
    expect(ring).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(ring);
    expect(ring).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem').map((m) => m.getAttribute('aria-label')))
      .toEqual(['New post', 'Upload', 'Record']);
  });

  test('an action fires and closes it', () => {
    renderNav({ items: ITEMS_4, fabAction: dial });
    const ring = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(ring);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Upload' }));
    expect(actions[1].onClick).toHaveBeenCalled();
    expect(ring).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes it', () => {
    renderNav({ items: ITEMS_4, fabAction: dial });
    const ring = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(ring);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(ring).toHaveAttribute('aria-expanded', 'false');
  });

  test('without actions it is a plain action, not a dial', () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: { label: 'Create', onClick: jest.fn() } });
    const ring = screen.getByRole('button', { name: 'Create' });
    expect(ring).not.toHaveAttribute('aria-haspopup');
    expect(container.querySelector('.speed-dial')).toBeNull();
  });

  test('has no accessibility violations open', async () => {
    const { container } = renderNav({ items: ITEMS_4, fabAction: dial, fabPosition: 'center' });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('BottomNavigation — items around a centred FAB', () => {
  const two = [{ label: 'Home', icon: <span /> }, { label: 'Products', icon: <span /> }];
  test('each side of the FAB is its own half, holding its share of the items', () => {
    const { container } = render(
      <BottomNavigation items={two} fabAction={{ icon: <span />, label: 'Create' }} fabPosition="center" fixed={false} />
    );
    const start = container.querySelector('.bottom-nav-half-start');
    const end = container.querySelector('.bottom-nav-half-end');
    expect(start.querySelectorAll('[role="tab"]')).toHaveLength(1);
    expect(end.querySelectorAll('[role="tab"]')).toHaveLength(1);
    // The FAB's gap sits between the halves.
    expect(start.nextElementSibling).toHaveClass('bottom-nav-fab-gap');
  });
});
