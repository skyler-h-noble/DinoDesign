// src/components/Footer/Footer.stories.js
import {
  Footer,
  FooterLayout,
  MinimalFooter,
  SocialFooter,
  MultiColumnFooter,
} from './Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

const defaultColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
];

const defaultSocials = [
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'GitHub', href: 'https://github.com' },
];

// Basic Footer
export const Basic = {
  render: () => (
    <Footer>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Custom footer content here
      </div>
    </Footer>
  ),
};

// Footer Layout - Standard
export const StandardLayout = {
  render: () => (
    <FooterLayout
      columns={defaultColumns}
      copyrightText="© 2024 MyApp. All rights reserved."
      buildText="Built with React & Material-UI"
    />
  ),
};

// Footer Layout - Minimal Text
export const LayoutMinimal = {
  render: () => (
    <FooterLayout
      columns={[
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#' },
            { label: 'Pricing', href: '#' },
          ],
        },
        {
          title: 'Developers',
          links: [
            { label: 'Docs', href: '#' },
            { label: 'API', href: '#' },
          ],
        },
      ]}
    />
  ),
};

// Minimal Footer
export const Minimal = {
  render: () => (
    <MinimalFooter copyrightText="© 2024 MyApp. All rights reserved." />
  ),
};

// Social Footer
export const Social = {
  render: () => (
    <SocialFooter socials={defaultSocials} />
  ),
};

// Multi Column Footer
export const MultiColumn = {
  render: () => (
    <MultiColumnFooter
      company={{
        name: 'MyApp',
        description: 'Building amazing products with React and Material-UI',
      }}
      columns={defaultColumns}
    />
  ),
};

// Multi Column Footer - Extended
export const MultiColumnExtended = {
  render: () => (
    <MultiColumnFooter
      company={{
        name: 'TechCorp',
        description: 'Leading provider of innovative technology solutions since 2020',
      }}
      columns={[
        {
          title: 'Products',
          links: [
            { label: 'Cloud Platform', href: '#' },
            { label: 'Analytics', href: '#' },
            { label: 'Security', href: '#' },
            { label: 'Support', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Press', href: '#' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Documentation', href: '#' },
            { label: 'API Reference', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'Contact Sales', href: '#' },
          ],
        },
      ]}
    />
  ),
};

// Footer with Different Surface
export const DifferentSurface = {
  render: () => (
    <Footer surface="Surface">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Footer with Surface background
      </div>
    </Footer>
  ),
};

// Footer with No Columns
export const NoColumns = {
  render: () => (
    <FooterLayout columns={[]} />
  ),
};

// Social Footer - Multiple Links
export const SocialMultiple = {
  render: () => (
    <SocialFooter
      socials={[
        { label: 'Facebook', href: 'https://facebook.com' },
        { label: 'Twitter', href: 'https://twitter.com' },
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'YouTube', href: 'https://youtube.com' },
      ]}
    />
  ),
};

// Custom Content
export const CustomContent = {
  render: () => (
    <Footer>
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Completely Custom Footer</h3>
        <p style={{ margin: '0 0 20px 0', color: 'var(--Text-Secondary)' }}>
          This footer can contain any custom content you want
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <a href="#" style={{ color: 'var(--Text)', textDecoration: 'none' }}>Link 1</a>
          <a href="#" style={{ color: 'var(--Text)', textDecoration: 'none' }}>Link 2</a>
          <a href="#" style={{ color: 'var(--Text)', textDecoration: 'none' }}>Link 3</a>
        </div>
      </div>
    </Footer>
  ),
};
