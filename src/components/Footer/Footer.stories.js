// src/components/Footer/Footer.stories.js
import React from 'react';
import { Footer } from './Footer';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default {
  title: 'Components/Footer',
  component: Footer,
};

const sampleAddress = {
  company: 'DinoDesign',
  lines: ['123 Market Street', 'San Francisco, CA 94103'],
  email: 'hello@dinodesign.dev',
  phone: '+1 (555) 010-0000',
};

const sampleColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Add-ons', href: '/addons' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' },
    ],
  },
];

const sampleSocial = [
  { icon: <TwitterIcon fontSize="small" />, url: 'https://twitter.com', label: 'Twitter' },
  { icon: <GitHubIcon fontSize="small" />, url: 'https://github.com', label: 'GitHub' },
  { icon: <LinkedInIcon fontSize="small" />, url: 'https://linkedin.com', label: 'LinkedIn' },
];

export const OneColumn = () => (
  <Footer address={sampleAddress} copyrightName="DinoDesign" />
);

export const TwoColumns = () => (
  <Footer
    address={sampleAddress}
    columns={[sampleColumns[0]]}
    copyrightName="DinoDesign"
  />
);

export const ThreeColumns = () => (
  <Footer
    address={sampleAddress}
    columns={sampleColumns.slice(0, 2)}
    copyrightName="DinoDesign"
  />
);

export const FourColumnsWithSocialAndSubscribe = () => (
  <Footer
    address={sampleAddress}
    columns={sampleColumns}
    socialLinks={sampleSocial}
    subscribe={{
      title: 'Stay in the loop',
      description: 'Monthly updates on new components and design system tips.',
      onSubscribe: async (email) => console.log('subscribe:', email),
    }}
    copyrightName="DinoDesign"
  />
);
