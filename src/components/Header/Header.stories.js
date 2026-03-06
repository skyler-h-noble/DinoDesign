// src/components/Header/Header.stories.js
import {
  Header,
  SimpleHeader,
  MinimalHeader,
  CenteredHeader,
  StickyHeader,
} from './Header';

export default {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

const defaultNavItems = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'CONTACT', href: '#contact' },
];

// Basic Header
export const Basic = {
  render: () => (
    <Header
      title="My App"
      navItems={defaultNavItems}
      mode="light"
      onModeChange={() => {}}
    />
  ),
};

// Header Dark Mode
export const DarkMode = {
  render: () => (
    <Header
      title="My App"
      navItems={defaultNavItems}
      mode="dark"
      onModeChange={() => {}}
    />
  ),
};

// Simple Header
export const Simple = {
  render: () => (
    <SimpleHeader
      title="Simple App"
      mode="light"
      onModeChange={() => {}}
    />
  ),
};

// Minimal Header
export const Minimal = {
  render: () => (
    <MinimalHeader title="Minimal App" />
  ),
};

// Centered Header
export const Centered = {
  render: () => (
    <CenteredHeader
      title="Centered Nav"
      navItems={defaultNavItems}
      mode="light"
      onModeChange={() => {}}
    />
  ),
};

// Sticky Header
export const Sticky = {
  render: () => (
    <div style={{ height: '2000px' }}>
      <StickyHeader
        title="Sticky Header"
        navItems={defaultNavItems}
        mode="light"
        onModeChange={() => {}}
      />
      <div style={{ padding: '40px' }}>
        <p>Scroll down to see header stick to top</p>
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i}>Scrollable content...</p>
        ))}
      </div>
    </div>
  ),
};

// Header with Custom Title
export const CustomTitle = {
  render: () => (
    <Header
      title="TechCorp Dashboard"
      navItems={[
        { label: 'Dashboard', href: '#' },
        { label: 'Analytics', href: '#' },
        { label: 'Settings', href: '#' },
      ]}
      mode="light"
      onModeChange={() => {}}
    />
  ),
};

// Header with Few Nav Items
export const FewNavItems = {
  render: () => (
    <Header
      title="Simple Site"
      navItems={[
        { label: 'HOME', href: '#' },
        { label: 'CONTACT', href: '#' },
      ]}
      mode="light"
      onModeChange={() => {}}
    />
  ),
};

// Header with Many Nav Items
export const ManyNavItems = {
  render: () => (
    <Header
      title="Complex App"
      navItems={[
        { label: 'HOME', href: '#' },
        { label: 'ABOUT', href: '#' },
        { label: 'SERVICES', href: '#' },
        { label: 'BLOG', href: '#' },
        { label: 'GALLERY', href: '#' },
        { label: 'CONTACT', href: '#' },
      ]}
      mode="light"
      onModeChange={() => {}}
    />
  ),
};
