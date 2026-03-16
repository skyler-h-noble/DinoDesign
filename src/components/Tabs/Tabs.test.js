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
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Content of Settings')).toBeInTheDocument();
    expect(screen.queryByText('Content of Home')).not.toBeInTheDocument();
  });

  test('clicking third tab shows third panel', () => {
    renderTabs();
    fireEvent.click(screen.getByText('Profile'));
    expect(screen.getByText('Content of Profile')).toBeInTheDocument();
  });
});

/* ─── data attributes on Tabs wrapper ─── */
describe('Tabs wrapper data attributes', () => {
  test('Tabs wrapper always has data-surface="Surface"', () => {
    const { container } = renderTabs();
    expect(container.querySelector('.tabs')).toHaveAttribute('data-surface', 'Surface');
  });

  test('standard variant has data-theme="Default"', () => {
    const { container } = renderTabs({ variant: 'standard' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-theme', 'Default');
  });

  test('solid variant has data-surface="Surface" on Tabs wrapper', () => {
    const { container } = renderTabs({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-surface', 'Surface');
  });

  test('light variant has data-surface="Surface" on Tabs wrapper', () => {
    const { container } = renderTabs({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-surface', 'Surface');
  });

  test('individual tabs have no data-surface', () => {
    renderTabs();
    expect(screen.getByText('Home')).not.toHaveAttribute('data-surface');
    expect(screen.getByText('Settings')).not.toHaveAttribute('data-surface');
  });

  test('TabList has no data-theme', () => {
    renderTabs({ variant: 'solid', color: 'primary' });
    const tabList = screen.getByRole('tablist').closest('.tab-list');
    expect(tabList).not.toHaveAttribute('data-theme');
  });

  test('TabList has no data-surface', () => {
    renderTabs({ variant: 'light', color: 'primary' });
    const tabList = screen.getByRole('tablist').closest('.tab-list');
    expect(tabList).not.toHaveAttribute('data-surface');
  });

  test('light variant data-theme on Tabs wrapper', () => {
    const { container } = renderTabs({ variant: 'light', color: 'primary' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-theme', 'Primary-Light');
  });

  test('solid variant data-theme on Tabs wrapper', () => {
    const { container } = renderTabs({ variant: 'solid', color: 'primary' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-theme', 'Primary');
  });

  test('Tabs wrapper has no data-background', () => {
    const { container } = renderTabs();
    expect(container.querySelector('.tabs')).not.toHaveAttribute('data-background');
  });
});

/* ─── TabList ARIA ─── */
describe('TabList ARIA', () => {
  test('has role="tablist"', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  test('has aria-orientation', () => {
    renderTabs({ orientation: 'horizontal' });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('vertical orientation', () => {
    renderTabs({ orientation: 'vertical' });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
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
    expect(screen.getByText('Home')).toHaveAttribute('aria-selected', 'true');
  });

  test('unselected tabs have aria-selected="false"', () => {
    renderTabs();
    expect(screen.getByText('Settings')).toHaveAttribute('aria-selected', 'false');
  });

  test('selected tab has tabIndex 0', () => {
    renderTabs();
    expect(screen.getByText('Home')).toHaveAttribute('tabindex', '0');
  });

  test('unselected tabs have tabIndex -1', () => {
    renderTabs();
    expect(screen.getByText('Settings')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('Profile')).toHaveAttribute('tabindex', '-1');
  });

  test('tabs have aria-controls linking to panel', () => {
    renderTabs();
    const tab = screen.getByText('Home');
    expect(tab).toHaveAttribute('aria-controls');
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
    const tab = screen.getByText('Home');
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.getAttribute('id'));
  });

  test('tab aria-controls matches panel id', () => {
    renderTabs();
    const tab = screen.getByText('Home');
    const panel = screen.getByRole('tabpanel');
    expect(tab.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
  });
});

/* ─── Keyboard Navigation ─── */
describe('Keyboard navigation (horizontal)', () => {
  test('ArrowRight moves to next tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    screen.getByText('Home').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByText('Settings'));
  });

  test('ArrowLeft moves to previous tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    screen.getByText('Settings').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(screen.getByText('Home'));
  });

  test('Home moves to first tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    screen.getByText('Profile').focus();
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(document.activeElement).toBe(screen.getByText('Home'));
  });

  test('End moves to last tab', () => {
    renderTabs();
    const tablist = screen.getByRole('tablist');
    screen.getByText('Home').focus();
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByText('Profile'));
  });
});

describe('Keyboard navigation (vertical)', () => {
  test('ArrowDown moves to next tab', () => {
    renderTabs({ orientation: 'vertical' });
    const tablist = screen.getByRole('tablist');
    screen.getByText('Home').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('Settings'));
  });

  test('ArrowUp moves to previous tab', () => {
    renderTabs({ orientation: 'vertical' });
    const tablist = screen.getByRole('tablist');
    screen.getByText('Settings').focus();
    fireEvent.keyDown(tablist, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(screen.getByText('Home'));
  });
});

/* ─── Variants ─── */
describe('Variants', () => {
  test('standard has data-theme="Default" on tabs wrapper', () => {
    const { container } = renderTabs({ variant: 'standard' });
    expect(container.querySelector('.tabs')).toHaveAttribute('data-theme', 'Default');
  });

  test('standard has tab-list-standard class', () => {
    const { container } = renderTabs({ variant: 'standard' });
    expect(container.querySelector('.tab-list-standard')).toBeInTheDocument();
  });
});

/* ─── Solid data-theme ─── */
describe('Solid variant data-theme on Tabs wrapper', () => {
  const cases = [
    ['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary'],
    ['neutral', 'Neutral'], ['info', 'Info-Medium'], ['success', 'Success-Medium'],
    ['warning', 'Warning-Medium'], ['error', 'Error-Medium'],
  ];

  cases.forEach(([color, theme]) => {
    test('solid ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderTabs({ variant: 'solid', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
    });
  });
});

/* ─── Light data-theme ─── */
describe('Light variant data-theme on Tabs wrapper', () => {
  const cases = [
    ['primary', 'Primary-Light'], ['secondary', 'Secondary-Light'], ['tertiary', 'Tertiary-Light'],
    ['neutral', 'Neutral-Light'], ['info', 'Info-Light'], ['success', 'Success-Light'],
    ['warning', 'Warning-Light'], ['error', 'Error-Light'],
  ];

  cases.forEach(([color, theme]) => {
    test('light ' + color + ' → data-theme="' + theme + '"', () => {
      const { container } = renderTabs({ variant: 'light', color });
      expect(container.querySelector('[data-theme="' + theme + '"]')).toBeInTheDocument();
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
    expect(screen.getByText('B')).toHaveAttribute('aria-disabled', 'true');
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
    expect(screen.getByText('B')).toHaveAttribute('tabindex', '-1');
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
