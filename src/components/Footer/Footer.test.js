// src/components/Footer/Footer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { axe } from 'jest-axe';

const sampleAddress = {
  company: 'TestCo',
  lines: ['1 Test Lane'],
  email: 'hi@test.dev',
};

describe('Footer Component', () => {
  test('renders a <footer> element', () => {
    const { container } = render(<Footer address={sampleAddress} />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  test('renders the address column', () => {
    render(<Footer address={sampleAddress} />);
    expect(screen.getByText('TestCo')).toBeInTheDocument();
    expect(screen.getByText('1 Test Lane')).toBeInTheDocument();
  });

  test('renders additional columns', () => {
    render(
      <Footer
        address={sampleAddress}
        columns={[{ title: 'Product', links: [{ label: 'Features', href: '/features' }] }]}
      />
    );
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  test('caps additional columns at 3 (4 total)', () => {
    render(
      <Footer
        address={sampleAddress}
        columns={[
          { title: 'A', links: [] },
          { title: 'B', links: [] },
          { title: 'C', links: [] },
          { title: 'D-should-not-render', links: [] },
        ]}
      />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('D-should-not-render')).not.toBeInTheDocument();
  });

  test('renders the copyright strip', () => {
    render(<Footer address={sampleAddress} copyrightName="TestCo" copyrightYear={2026} />);
    expect(screen.getByText(/© 2026 TestCo/)).toBeInTheDocument();
  });

  test('renders social links when provided', () => {
    render(
      <Footer
        address={sampleAddress}
        socialLinks={[{ icon: <span>tw</span>, url: 'https://twitter.com', label: 'Twitter' }]}
      />
    );
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Footer address={sampleAddress} copyrightName="TestCo" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
