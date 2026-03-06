// src/components/Footer/Footer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Footer,
  FooterLayout,
  MinimalFooter,
  SocialFooter,
  MultiColumnFooter,
} from './Footer';

describe('Footer Component', () => {
  test('renders Footer component', () => {
    const { container } = render(
      <Footer>
        <div>Footer content</div>
      </Footer>
    );
    expect(container).toBeInTheDocument();
  });

  test('renders as footer element', () => {
    const { container } = render(
      <Footer>
        <div>Content</div>
      </Footer>
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });

  test('applies Container background by default', () => {
    const { container } = render(
      <Footer>
        <div>Content</div>
      </Footer>
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveStyle('background-color: var(--Container)');
  });

  test('applies custom surface background', () => {
    const { container } = render(
      <Footer surface="Surface">
        <div>Content</div>
      </Footer>
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveStyle('background-color: var(--Surface)');
  });

  test('applies Border-Variant color to top border', () => {
    const { container } = render(
      <Footer>
        <div>Content</div>
      </Footer>
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveStyle('border-top: 1px solid var(--Border-Variant)');
  });

  test('renders children content', () => {
    const { getByText } = render(
      <Footer>
        <div>Test content here</div>
      </Footer>
    );
    expect(getByText('Test content here')).toBeInTheDocument();
  });
});

describe('FooterLayout Component', () => {
  const mockColumns = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
      ],
    },
  ];

  test('renders FooterLayout', () => {
    const { container } = render(
      <FooterLayout columns={mockColumns} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays all column titles', () => {
    const { getByText } = render(
      <FooterLayout columns={mockColumns} />
    );
    expect(getByText('Company')).toBeInTheDocument();
    expect(getByText('Legal')).toBeInTheDocument();
  });

  test('displays all links', () => {
    const { getByText } = render(
      <FooterLayout columns={mockColumns} />
    );
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText('Blog')).toBeInTheDocument();
    expect(getByText('Privacy')).toBeInTheDocument();
    expect(getByText('Terms')).toBeInTheDocument();
  });

  test('displays copyright text', () => {
    const { getByText } = render(
      <FooterLayout columns={mockColumns} />
    );
    expect(getByText(/© 2024 MyApp/)).toBeInTheDocument();
  });

  test('displays build text', () => {
    const { getByText } = render(
      <FooterLayout columns={mockColumns} />
    );
    expect(getByText(/Built with React & Material-UI/)).toBeInTheDocument();
  });

  test('accepts custom copyright text', () => {
    const { getByText } = render(
      <FooterLayout columns={mockColumns} copyrightText="© 2024 Custom App" />
    );
    expect(getByText('© 2024 Custom App')).toBeInTheDocument();
  });
});

describe('MinimalFooter Component', () => {
  test('renders MinimalFooter', () => {
    const { container } = render(<MinimalFooter />);
    expect(container).toBeInTheDocument();
  });

  test('renders as footer element', () => {
    const { container } = render(<MinimalFooter />);
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });

  test('displays copyright text centered', () => {
    const { getByText } = render(<MinimalFooter />);
    expect(getByText(/© 2024 MyApp/)).toBeInTheDocument();
  });

  test('accepts custom copyright text', () => {
    const { getByText } = render(
      <MinimalFooter copyrightText="© 2024 My Custom App" />
    );
    expect(getByText('© 2024 My Custom App')).toBeInTheDocument();
  });

  test('applies correct styling', () => {
    const { container } = render(<MinimalFooter />);
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveStyle('background-color: var(--Container)');
    expect(footerElement).toHaveStyle('border-top: 1px solid var(--Border-Variant)');
  });
});

describe('SocialFooter Component', () => {
  const mockSocials = [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ];

  test('renders SocialFooter', () => {
    const { container } = render(
      <SocialFooter socials={mockSocials} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays all social links', () => {
    const { getByText } = render(
      <SocialFooter socials={mockSocials} />
    );
    expect(getByText('Twitter')).toBeInTheDocument();
    expect(getByText('LinkedIn')).toBeInTheDocument();
    expect(getByText('GitHub')).toBeInTheDocument();
  });

  test('renders as footer element', () => {
    const { container } = render(
      <SocialFooter socials={mockSocials} />
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });

  test('social links have correct hrefs', () => {
    const { getByText } = render(
      <SocialFooter socials={mockSocials} />
    );
    expect(getByText('Twitter')).toHaveAttribute('href', 'https://twitter.com');
    expect(getByText('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com');
    expect(getByText('GitHub')).toHaveAttribute('href', 'https://github.com');
  });
});

describe('MultiColumnFooter Component', () => {
  const mockCompany = {
    name: 'TestApp',
    description: 'A test application',
  };

  const mockColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Docs', href: '/docs' },
        { label: 'API', href: '/api' },
      ],
    },
  ];

  test('renders MultiColumnFooter', () => {
    const { container } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays company name', () => {
    const { getByText } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(getByText('TestApp')).toBeInTheDocument();
  });

  test('displays company description', () => {
    const { getByText } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(getByText('A test application')).toBeInTheDocument();
  });

  test('displays all column titles', () => {
    const { getByText } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(getByText('Product')).toBeInTheDocument();
    expect(getByText('Developers')).toBeInTheDocument();
  });

  test('displays all links', () => {
    const { getByText } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(getByText('Features')).toBeInTheDocument();
    expect(getByText('Pricing')).toBeInTheDocument();
    expect(getByText('Docs')).toBeInTheDocument();
    expect(getByText('API')).toBeInTheDocument();
  });

  test('displays copyright with company name', () => {
    const { getByText } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    expect(getByText(/© 2024 TestApp/)).toBeInTheDocument();
  });

  test('renders as footer element', () => {
    const { container } = render(
      <MultiColumnFooter company={mockCompany} columns={mockColumns} />
    );
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
  });
});
