// src/components/AppBar/AppBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppBar, DesktopAppBar, MobileAppBar } from './AppBar';
import CheckIcon from '@mui/icons-material/Check';
import { axe } from 'jest-axe';

/* --- Basic --- */
describe('AppBar', () => {
  test('renders desktop by default', () => {
    const { container } = render(<AppBar />);
    expect(container.querySelector('.appbar-desktop')).toBeInTheDocument();
  });
  test('renders mobile', () => {
    const { container } = render(<AppBar mode="mobile" />);
    expect(container.querySelector('.appbar-mobile')).toBeInTheDocument();
  });
  test('has role="banner"', () => {
    render(<AppBar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

/* --- Always present: data-surface --- */
describe('Data attributes always present', () => {
  /* The default surface is "Surface", and a barColor that implies a lightness
     overrides it (primary-light / white -> Surface-Brightest, black ->
     Surface-Dimmest). Surface-Bright was never the default. */
  test('defaults to data-surface="Surface"', () => {
    const { container } = render(<DesktopAppBar />);
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });
  /* Only a barColor that implies a LIGHTNESS carries a surface of its own;
     the rest keep the default. Lightness is the surface axis. */
  test('a barColor with no lightness keeps the default surface', () => {
    const { container } = render(<DesktopAppBar barColor="primary" />);
    expect(container.querySelector('[data-surface="Surface"]')).toBeInTheDocument();
  });
  test('black is Surface-Dimmest, on mobile too', () => {
    const { container } = render(<MobileAppBar mobileVariant="small" title="P" barColor="black" />);
    expect(container.querySelector('[data-surface="Surface-Dimmest"]')).toBeInTheDocument();
  });
});

/* --- data-theme per barColor --- */
describe('data-theme per barColor', () => {
  test('default sets data-theme="App-Bar"', () => {
    const { container } = render(<DesktopAppBar />);
    expect(container.querySelector('[data-theme="App-Bar"]')).toBeInTheDocument();
  });
  test('primary sets data-theme="Primary"', () => {
    const { container } = render(<DesktopAppBar barColor="primary" />);
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });
  // Lightness is the SURFACE axis now — the *-Light themes are gone.
  test('primary-light sets data-theme="Primary" on Surface-Brightest', () => {
    const { container } = render(<DesktopAppBar barColor="primary-light" />);
    expect(container.querySelector('[data-theme="Primary"][data-surface="Surface-Brightest"]')).toBeInTheDocument();
  });
  /* `primary-dark` is not a barColor — the map is default / primary /
     primary-light / white / black — so it falls back to the default theme.
     That default is "App-Bar", which is a real CSS theme (CSS_ONLY_THEMES):
     it is emitted in the stylesheet and only absent from Figma's Theme
     collection, which is capped at ten modes. */
  test('an unknown barColor falls back to the App-Bar theme', () => {
    const { container } = render(<DesktopAppBar barColor="primary-dark" />);
    expect(container.querySelector('[data-theme="App-Bar"]')).toBeInTheDocument();
  });
  test('white sets data-theme="Neutral"', () => {
    const { container } = render(<DesktopAppBar barColor="white" />);
    expect(container.querySelector('[data-theme="Neutral"]')).toBeInTheDocument();
  });
  test('black sets data-theme="Neutral" on Surface-Dimmest', () => {
    const { container } = render(<DesktopAppBar barColor="black" />);
    expect(container.querySelector('[data-theme="Neutral"][data-surface="Surface-Dimmest"]')).toBeInTheDocument();
  });
  test('mobile default sets data-theme="App-Bar"', () => {
    const { container } = render(<MobileAppBar mobileVariant="small" title="P" />);
    expect(container.querySelector('[data-theme="App-Bar"]')).toBeInTheDocument();
  });
  test('mobile primary sets data-theme="Primary"', () => {
    const { container } = render(<MobileAppBar mobileVariant="small" title="P" barColor="primary" />);
    expect(container.querySelector('[data-theme="Primary"]')).toBeInTheDocument();
  });
});

/* --- Desktop --- */
describe('DesktopAppBar', () => {
  test('renders company name', () => {
    render(<DesktopAppBar companyName="TestCo" />);
    expect(screen.getByText('TestCo')).toBeInTheDocument();
  });
  test('hamburger menu', () => {
    render(<DesktopAppBar menuType="hamburger" navLinks={['Home']} />);
    /* The accessible name is "Open navigation menu" — naming the ACTION, not
       the glyph, which is the lib's own icon-button rule. */
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
  });
  /* The menu button opens a drawer of navLinks. Without links (or an
     onMenuClick) there is nothing to open, so there is no button — it used to
     open a drawer of placeholder Home / Products / About links. */
  test('no menu button when there is nothing to open', () => {
    render(<DesktopAppBar brand="Acme" endSlot={<span>end</span>} />);
    expect(screen.queryByLabelText('Open navigation menu')).not.toBeInTheDocument();
  });
  test('showMenu={false} hides the menu button', () => {
    render(<DesktopAppBar menuType="hamburger" navLinks={['Home']} showMenu={false} />);
    expect(screen.queryByLabelText('Open navigation menu')).not.toBeInTheDocument();
  });
  test('auto: links inline, and the menu button opens the same links', () => {
    render(<DesktopAppBar brand="Acme" navLinks={[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }]} />);
    const nav = screen.getByLabelText('Main navigation');
    expect(nav.querySelector('a[href="#features"]')).not.toBeNull();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(screen.getAllByText('Pricing').length).toBeGreaterThan(1);
  });
  test('auto: collapses below collapseAt (default 900px)', () => {
    render(<DesktopAppBar brand="Acme" navLinks={['A']} />);
    const css = Array.from(document.styleSheets).flatMap((sh) => Array.from(sh.cssRules).map((r) => r.cssText)).join('\n');
    expect(css).toMatch(/max-width:\s*899\.98px/);
  });
  test('a bar with navLinks has no search unless asked', () => {
    const { container, rerender } = render(<DesktopAppBar navLinks={['A']} />);
    expect(container.querySelector('input')).toBeNull();
    rerender(<DesktopAppBar navLinks={['A']} searchPosition="right" />);
    expect(container.querySelector('input')).not.toBeNull();
  });
  test('collapsed: every action but the last moves into the drawer', () => {
    render(<DesktopAppBar brand="Acme" navLinks={['Features']}
      endSlot={<><button type="button">Login</button><button type="button">Get started</button></>} />);
    // In the bar, Login sits in the part hidden below collapseAt; Get started does not.
    expect(screen.getAllByText('Login')[0].closest('.appbar-end-secondary')).not.toBeNull();
    expect(screen.getByText('Get started').closest('.appbar-end-secondary')).toBeNull();
    fireEvent.click(screen.getByLabelText('Open navigation menu'));
    expect(document.querySelector('.appbar-drawer-actions').textContent).toContain('Login');
  });
  test('a single endSlot action stays put and adds no menu button', () => {
    render(<DesktopAppBar brand="Acme" endSlot={<button type="button">Get started</button>} />);
    expect(screen.queryByLabelText('Open navigation menu')).not.toBeInTheDocument();
  });
  test('expanded nav with 3 links', () => {
    render(<DesktopAppBar menuType="expanded" navLinks={['Home', 'About', 'Help']} />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });
  test('forces hamburger when navLinks > 3', () => {
    render(<DesktopAppBar menuType="expanded" navLinks={['A', 'B', 'C', 'D']} />);
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument();
    expect(screen.queryByLabelText('Main navigation')).not.toBeInTheDocument();
  });
  /* The Login button renders only when an onLogin handler is supplied —
     loginType alone does not produce one. */
  test('login button', () => {
    render(<DesktopAppBar loginType="login" onLogin={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });
  test('search field', () => {
    render(<DesktopAppBar searchPosition="right" />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
  test('no search when none', () => {
    render(<DesktopAppBar searchPosition="none" />);
    expect(screen.queryByLabelText('Search')).not.toBeInTheDocument();
  });
});

/* --- Mobile --- */
describe('MobileAppBar', () => {
  test('search variant', () => {
    render(<MobileAppBar mobileVariant="search" />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });
  test('small renders title', () => {
    render(<MobileAppBar mobileVariant="small" title="My Page" />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });
  test('medium class', () => {
    const { container } = render(<MobileAppBar mobileVariant="medium" title="T" />);
    expect(container.querySelector('.appbar-mobile-medium')).toBeInTheDocument();
  });
  test('large class', () => {
    const { container } = render(<MobileAppBar mobileVariant="large" title="T" />);
    expect(container.querySelector('.appbar-mobile-large')).toBeInTheDocument();
  });
});

/* --- Defaults --- */
describe('Defaults', () => {
  test('default mode is desktop', () => {
    const { container } = render(<AppBar />);
    expect(container.querySelector('.appbar-desktop')).toBeInTheDocument();
  });
  test('default barColor is default', () => {
    const { container } = render(<AppBar />);
    expect(container.querySelector('.appbar-default')).toBeInTheDocument();
  });
  test('default mobile variant is search', () => {
    const { container } = render(<AppBar mode="mobile" />);
    expect(container.querySelector('.appbar-mobile-search')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('AppBar — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <AppBar />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <AppBar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <AppBar />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('AppBar size', () => {
  const cssFor = (el) => [...document.styleSheets].flatMap((sh) => { try { return [...sh.cssRules]; } catch (e) { return []; } })
    .filter((r) => r.selectorText && [...el.classList].some((c) => r.selectorText.includes('.' + c))).map((r) => r.cssText).join('\n');
  test.each([['small', '--Sm-App-Bar-Height'], ['medium', '--App-Bar-Height'], ['large', '--Lg-App-Bar-Height']])(
    '%s takes %s and sizes its own buttons to match', (size, token) => {
      const { container } = render(<AppBar layout="left-brand" brand="Brand" size={size} />);
      expect(cssFor(container.querySelector('.appbar'))).toContain(token);
      const menu = screen.getByRole('button', { name: 'Open navigation menu' });
      expect(menu.className).toMatch(new RegExp('MuiButton-size' + size.charAt(0).toUpperCase() + size.slice(1)));
    });
});
