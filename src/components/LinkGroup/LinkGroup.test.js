// src/components/LinkGroup/LinkGroup.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LinkGroup } from './LinkGroup';
import { Link } from '../Link';

const three = (props = {}) => render(
  <LinkGroup {...props}>
    <Link href="/a">Privacy</Link>
    <Link href="/b">Terms</Link>
    <Link href="/c">Help</Link>
  </LinkGroup>,
);

describe('LinkGroup', () => {
  test('a list of links with a separator between each', () => {
    const { container } = three();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(container.querySelectorAll('.link-group-separator')).toHaveLength(2);
  });
  test('separators are hidden from assistive tech', () => {
    const { container } = three();
    container.querySelectorAll('.link-group-separator').forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
  });
  test('an aria-label makes it a nav landmark', () => {
    three({ 'aria-label': 'Legal' });
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument();
  });
  test('no accessibility violations', async () => {
    const { container } = three({ 'aria-label': 'Legal' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
