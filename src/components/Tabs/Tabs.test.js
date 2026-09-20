// src/components/Tabs/Tabs.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabList, Tab, TabPanel } from './Tabs';
import { axe } from 'jest-axe';

/* ─── Helpers ─── */
const LABELS = ['Home', 'Settings', 'Profile'];

const renderTabs = (tabsProps = {}, tabProps = {}) =>
  render(
    <Tabs defaultValue={0} {...tabsProps}>
      <TabList>
        {LABELS.map((l, i) => <Tab key={i} {...tabProps}>{l}</Tab>)}
      </TabList>
      {LABELS.map((l, i) => (
        <TabPanel key={i} value={i}>Content of {l}</TabPanel>
      ))}
    </Tabs>
  );

/* The ARIA, tabIndex and focus all live on the role="tab" ELEMENT. getByText
 * returns the label node inside it, so every attribute read here came back
 * null and every focus assertion compared the wrong node — the same mistake
 * Menu's ARIA tests made against getByText('Actions').
 *
 * Querying by role and accessible name is also the stronger assertion: it
 * fails if a tab stops being a tab or loses its name, which is the thing that
 * actually matters to a screen reader.
 */
const tab = (name) => screen.getByRole('tab', { name });

/* ─── Basic Rendering ─── */
describe('Tabs', () => {
  test('renders all tab triggers', () => {
    renderTabs();
    LABELS.forEach((l) => expect(screen.getByText(l)).toBeInTheDocument());
  });

  test('renders first panel by default', () => {
    renderTabs();
    expect(screen.getByText('Content of Home')).toBeInTheDocument();
  });

  test('other panels are hidden', () => {
    renderTabs();
    expect(screen.queryByText('Content of Settings')).not.toBeInTheDocument();
  });
});

/* ─── Tab Selection ─── */
describe('Tab selection', () => {
  test('clicking tab shows its panel', () => {
    renderTabs();
    fireEvent.click(tab('Settings'));
    expect(screen.getByText('Content of Settings')).toBeInTheDocument();
    expect(screen.queryByText('Content of Home')).not.toBeInTheDocument();
  });

  test('clicking third tab shows third panel', () => {
    renderTabs();
    fireEvent.click(tab('Profile'));
    expect(screen.getByText('Content of Profile')).toBeInTheDocument();
  });
});

/* ─── Theme / surface live on TabList ─── */
/* These asserted the pair on the `.tabs` wrapper and asserted TabList had
   NEITHER — the exact opposite of where they belong. `.tabs` paints nothing
   (display:flex + overflow:hidden); `.tab-list` sets backgroundColor
   var(--Background), and theme+surface have to travel together to whatever
   paints or the text resolves against the parent's tone. The component's own
   header claimed the wrapper carried them too, so doc and tests agreed with
   each other and both disagreed with the code. The code was right. */
describe('theme and surface sit on the element that paints', () => {
  const list = (container) => container.querySelector('.tab-list');

  test.each([
    ['standard', undefined, undefined],
    ['solid',    'Primary', 'Surface'],
    ['light',    'Primary', 'Surface-Brightest'],
    ['dark',     'Primary', 'Surface-Dimmest'],
  ])('%s → theme=%s surface=%s', (variant, theme, surface) => {
    const { container } = renderTabs({ variant, color: 'primary' });
    const el = list(container);
    if (theme) expect(el).toHaveAttribute('data-theme', theme);
    else expect(el).not.toHaveAttribute('data-theme');
    if (surface) expect(el).toHaveAttribute('data-surface', surface);
    else expect(el).not.toHaveAttribute('data-surface');
  });

  test('the Tabs wrapper carries neither', () => {
    const { container } = renderTabs({ variant: 'solid', color: 'primary' });
    const wrapper = container.querySelector('.tabs');
    expect(wrapper).not.toHaveAttribute('data-theme');
    expect(wrapper).not.toHaveAttribute('data-surface');
  });

  test('individual tabs carry no surface of their own', () => {
    renderTabs();
    expect(tab('Home')).not.toHaveAttribute('data-surface');
  });
});

/* ─── Tab ARIA ─── */
describe('Tab ARIA', () => {
  test('tabs have role="tab"', () => {
    renderTabs();
    expect(screen.getAllByRole('tab').length).toBe(3);
  });

  test('selected tab has aria-selected="true"', () => {
    renderTabs();
    expect(tab('Home')).toHaveAttribute('aria-selected', 'true');
  });

  test('unselected tabs have aria-selected="false"', () => {
    renderTabs();
    expect(tab('Settings')).toHaveAttribute('aria-selected', 'false');
  });

  test('selected tab has tabIndex 0', () => {
    renderTabs();
    expect(tab('Home')).toHaveAttribute('tabindex', '0');
  });

  test('unselected tabs have tabIndex -1', () => {
    renderTabs();
    expect(tab('Settings')).toHaveAttribute('tabindex', '-1');
    expect(tab('Profile')).toHaveAttribute('tabindex', '-1');
  });

  test('tabs have aria-controls linking to panel', () => {
    renderTabs();
    const el = tab('Home');
    expect(el).toHaveAttribute('aria-controls');
  });
});

/* ─── TabPanel ARIA ─── */
describe('TabPanel ARIA', () => {
  test('active panel has role="tabpanel"', () => {
    renderTabs();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  test('panel has aria-labelledby', () => {
    renderTabs();
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby');
  });

  test('tab id matches panel aria-labelledby', () => {
    renderTabs();
    const el = tab('Home');
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(el.getAttribute('id'));
  });

  test('tab aria-controls matches panel id', () => {
    renderTabs();
    const el = tab('Home');
    const panel = screen.getByRole('tabpanel');
    expect(el.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
  });
});

/* ─── Keyboard Navigation ─── */
describe('Keyboard navigation (horizontal)', () => {
  test('ArrowRight moves to next tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    tab('Home').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tab('Settings'));
  });

  test('ArrowLeft moves to previous tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    tab('Settings').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(tab('Home'));
  });

  test('Home moves to first tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    tab('Profile').focus();
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(document.activeElement).toBe(tab('Home'));
  });

  test('End moves to last tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    tab('Home').focus();
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(document.activeElement).toBe(tab('Profile'));
  });
});

describe('Keyboard navigation (vertical)', () => {
  test('ArrowDown moves to next tab', () => {
    renderTabs({ orientation: 'vertical' });
    const tablist = screen.getByRole('tablist');
    tab('Home').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tab('Settings'));
  });

  test('ArrowUp moves to previous tab', () => {
    renderTabs({ orientation: 'vertical' });
    const tablist = screen.getByRole('tablist');
    tab('Settings').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(tab('Home'));
  });
});

/* ─── Variants ─── */
describe('Variants', () => {
  /* standard sets NO theme — it is the unthemed variant, and the wrapper
     never carried one anyway. Covered in the theme/surface block above. */

  test('standard has tab-list-standard class', () => {
    const { container } = renderTabs({ variant: 'standard' });
    expect(container.querySelector('.tab-list-standard')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme on Tabs wrapper', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'],
    ['warning', 'Warning'], ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderTabs({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
// Light is the same THEME as solid on a bright SURFACE, mirroring dark (same
// theme on Surface-Dimmest). The *-Light themes these used to assert no longer
// exist in any design system.
describe('Light variant data-theme on Tabs wrapper', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'],
    ['warning', 'Warning'], ['error', 'Error'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '" on Surface-Brightest', () => {
      const { container } = renderTabs({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"][data-surface="Surface-Brightest"]')).toBeInTheDocument();
    });
  });
});

/* ─── Sizes ─── */
describe('Size classes', () => {
  ['small', 'medium', 'large'].forEach((s) => {
    test(s + ' size class on tabs container', () => {
      const { container } = renderTabs({ size: s });
      expect(container.querySelector('.tabs-' + s)).toBeInTheDocument();
    });

    test(s + ' size class on tab-list', () => {
      const { container } = renderTabs({ size: s });
      expect(container.querySelector('.tab-list-' + s)).toBeInTheDocument();
    });

    test(s + ' size class on tab', () => {
      const { container } = renderTabs({ size: s });
      expect(container.querySelector('.tab-' + s)).toBeInTheDocument();
    });
  });
});

/* ─── Orientation ─── */
describe('Orientation classes', () => {
  test('horizontal class', () => {
    const { container } = renderTabs({ orientation: 'horizontal' });
    expect(container.querySelector('.tabs-horizontal')).toBeInTheDocument();
    expect(container.querySelector('.tab-list-horizontal')).toBeInTheDocument();
  });

  test('vertical class', () => {
    const { container } = renderTabs({ orientation: 'vertical' });
    expect(container.querySelector('.tabs-vertical')).toBeInTheDocument();
    expect(container.querySelector('.tab-list-vertical')).toBeInTheDocument();
  });
});

/* ─── Disabled ─── */
describe('Disabled tab', () => {
  test('disabled tab has aria-disabled', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>A</Tab>
          <Tab disabled>B</Tab>
        </TabList>
      </Tabs>
    );
    expect(tab('B')).toHaveAttribute('aria-disabled', 'true');
  });

  test('disabled tab has tabIndex -1', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>A</Tab>
          <Tab disabled>B</Tab>
        </TabList>
      </Tabs>
    );
    expect(tab('B')).toHaveAttribute('tabindex', '-1');
  });

  test('disabled tab has tab-disabled class', () => {
    const { container } = render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>A</Tab>
          <Tab disabled>B</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-disabled')).toBeInTheDocument();
  });
});

/* ─── Decorators ─── */
describe('Decorators', () => {
  test('startDecorator renders', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab startDecorator={<span data-testid="start-icon">★</span>}>A</Tab>
        </TabList>
      </Tabs>
    );
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  test('endDecorator renders', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab endDecorator={<span data-testid="end-icon">✓</span>}>A</Tab>
        </TabList>
      </Tabs>
    );
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('startDecorator has tab-start-decorator class', () => {
    const { container } = render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab startDecorator={<span>★</span>}>A</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-start-decorator')).toBeInTheDocument();
  });

  test('endDecorator has tab-end-decorator class', () => {
    const { container } = render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab endDecorator={<span>✓</span>}>A</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-end-decorator')).toBeInTheDocument();
  });
});

/* ─── Icon Only ─── */
describe('Icon only', () => {
  test('icon-only hides label text', () => {
    const { container } = render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab iconOnly startDecorator={<span data-testid="ico">★</span>}>Hidden</Tab>
        </TabList>
      </Tabs>
    );
    expect(screen.getByTestId('ico')).toBeInTheDocument();
    expect(container.querySelector('.tab-label')).not.toBeInTheDocument();
  });

  test('icon-only tab has tab-icon-only class', () => {
    const { container } = render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab iconOnly startDecorator={<span>★</span>}>H</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-icon-only')).toBeInTheDocument();
  });
});

/* ─── Tab count ─── */
describe('Tab count', () => {
  test('renders correct number of tabs', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          {Array.from({ length: 12 }, (_, i) => <Tab key={i}>T{i}</Tab>)}
        </TabList>
      </Tabs>
    );
    expect(screen.getAllByRole('tab').length).toBe(12);
  });
});

/* ─── Scrollable ─── */
describe('Scrollable', () => {
  test('scrollable adds tabs-scrollable class', () => {
    const { container } = render(
      <Tabs defaultValue={0} scrollable>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tabs-scrollable')).toBeInTheDocument();
  });

  test('scrollable adds tab-list-scrollable class', () => {
    const { container } = render(
      <Tabs defaultValue={0} scrollable>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-list-scrollable')).toBeInTheDocument();
  });

  test('scrollable renders scroll buttons', () => {
    render(
      <Tabs defaultValue={0} scrollable>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(screen.getByLabelText('Scroll tabs left')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll tabs right')).toBeInTheDocument();
  });

  test('scroll buttons have tab-list-scroll-btn class', () => {
    const { container } = render(
      <Tabs defaultValue={0} scrollable>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelectorAll('.tab-list-scroll-btn').length).toBe(2);
    expect(container.querySelector('.tab-list-scroll-btn-left')).toBeInTheDocument();
    expect(container.querySelector('.tab-list-scroll-btn-right')).toBeInTheDocument();
  });

  test('scroll container has tab-list-scroll-container class', () => {
    const { container } = render(
      <Tabs defaultValue={0} scrollable>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(container.querySelector('.tab-list-scroll-container')).toBeInTheDocument();
  });

  test('non-scrollable does not render scroll buttons', () => {
    render(
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>A</Tab><Tab>B</Tab><Tab>C</Tab>
        </TabList>
      </Tabs>
    );
    expect(screen.queryByLabelText('Scroll tabs left')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Scroll tabs right')).not.toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Tabs — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Tabs defaultValue={0}><TabList><Tab>Tab 1</Tab><Tab>Tab 2</Tab></TabList><TabPanel value={0}>Panel 1</TabPanel><TabPanel value={1}>Panel 2</TabPanel></Tabs>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Tabs defaultValue={0}><TabList><Tab>Tab 1</Tab><Tab>Tab 2</Tab></TabList><TabPanel value={0}>Panel 1</TabPanel><TabPanel value={1}>Panel 2</TabPanel></Tabs>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Tabs defaultValue={0}><TabList><Tab>Tab 1</Tab><Tab>Tab 2</Tab></TabList><TabPanel value={0}>Panel 1</TabPanel><TabPanel value={1}>Panel 2</TabPanel></Tabs>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
