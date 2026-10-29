// Tabs in navigation mode: the Tabs look, as a <nav> of links — the current
// one marked with aria-current, no tab roles (a site nav goes to a place; it
// does not switch a panel).
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabList, Tab } from './Tabs';

const Nav = (props) => (
  <Tabs navigation {...props}>
    <TabList aria-label="Main navigation">
      <Tab href="#how">How it works</Tab>
      <Tab href="#pricing">Pricing</Tab>
    </TabList>
  </Tabs>
);

test('renders a nav of links with hrefs, and no tab roles', () => {
  render(<Nav />);
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(nav.querySelectorAll('a[href]').length).toBe(2);
  expect(screen.queryByRole('tablist')).toBeNull();
  expect(screen.queryByRole('tab')).toBeNull();
});

test('the selected link carries aria-current="location" and the tab-selected look', () => {
  render(<Nav defaultValue={1} />);
  const pricing = screen.getByRole('link', { name: 'Pricing' });
  expect(pricing).toHaveAttribute('aria-current', 'location');
  expect(pricing.className).toMatch(/tab-selected/);
  expect(screen.getByRole('link', { name: 'How it works' })).not.toHaveAttribute('aria-current');
});

test('clicking a link moves aria-current to it', () => {
  render(<Nav />);
  fireEvent.click(screen.getByRole('link', { name: 'Pricing' }));
  expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'location');
});
