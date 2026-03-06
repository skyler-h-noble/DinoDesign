// src/components/AppBar/AppBar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppBar, DesktopAppBar, MobileAppBar } from './AppBar';
import CheckIcon from '@mui/icons-material/Check';

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
  test('always has data-surface="Surface-Bright"', () => {
    const { container } = render(<DesktopAppBar />);
    expect(container.querySelector('[data-surface="Surface-Bright"]')).toBeInTheDocument();
  });
  test('data-surface present for non-default barColor', () => {
    const { container } = render(<DesktopAppBar barColor="primary" />);
    expect(container.querySelector('[data-surface="Surface-Bright"]')).toBeInTheDocument();
  });
  test('data-surface on mobile', () => {
    const { container } = render(<MobileAppBar mobileVariant="small" title="P" barColor="black" />);
    expect(container.querySelector('[data-surface="Surface-Bright"]')).toBeInTheDocument();
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
  test('primary-light sets data-theme="Primary-Light"', () => {
    const { container } = render(<DesktopAppBar barColor="primary-light" />);
    expect(container.querySelector('[data-theme="Primary-Light"]')).toBeInTheDocument();
  });
  test('primary-dark sets data-theme="Primary-Dark"', () => {
    const { container } = render(<DesktopAppBar barColor="primary-dark" />);
    expect(container.querySelector('[data-theme="Primary-Dark"]')).toBeInTheDocument();
  });
  test('white sets data-theme="Neutral"', () => {
    const { container } = render(<DesktopAppBar barColor="white" />);
    expect(container.querySelector('[data-theme="Neutral"]')).toBeInTheDocument();
  });
  test('black sets data-theme="Neutral-Dark"', () => {
    const { container } = render(<DesktopAppBar barColor="black" />);
    expect(container.querySelector('[data-theme="Neutral-Dark"]')).toBeInTheDocument();
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
    render(<DesktopAppBar menuType="hamburger" />);
    expect(screen.getByLabelText('Menu')).toBeInTheDocument();
  });
  test('expanded nav with 3 links', () => {
    render(<DesktopAppBar menuType="expanded" navLinks={['Home', 'About', 'Help']} />);
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });
  test('forces hamburger when navLinks > 3', () => {
    render(<DesktopAppBar menuType="expanded" navLinks={['A', 'B', 'C', 'D']} />);
    expect(screen.getByLabelText('Menu')).toBeInTheDocument();
    expect(screen.queryByLabelText('Main navigation')).not.toBeInTheDocument();
  });
  test('login button', () => {
    render(<DesktopAppBar loginType="login" />);
    expect(screen.getByText('Login')).toBeInTheDocument();
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
