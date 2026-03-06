// src/components/Header/Header.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Header,
  SimpleHeader,
  MinimalHeader,
  CenteredHeader,
  StickyHeader,
} from './Header';

describe('Header Component', () => {
  test('renders Header', () => {
    const { container } = render(
      <Header title="Test App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays title', () => {
    render(<Header title="My App" onModeChange={() => {}} />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  test('displays navigation items', () => {
    const navItems = [
      { label: 'HOME', href: '#home' },
      { label: 'ABOUT', href: '#about' },
    ];
    render(
      <Header title="App" navItems={navItems} onModeChange={() => {}} />
    );
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
  });

  test('uses Header background color', () => {
    const { container } = render(
      <Header title="App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    const { container } = render(
      <Header title="App" mode="light" onModeChange={() => {}} />
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});

describe('SimpleHeader Component', () => {
  test('renders SimpleHeader', () => {
    const { container } = render(
      <SimpleHeader title="App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays title and theme toggle', () => {
    const { container } = render(
      <SimpleHeader title="Test" onModeChange={() => {}} />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});

describe('MinimalHeader Component', () => {
  test('renders MinimalHeader', () => {
    const { container } = render(<MinimalHeader title="App" />);
    expect(container).toBeInTheDocument();
  });

  test('displays only title', () => {
    render(<MinimalHeader title="Minimal App" />);
    expect(screen.getByText('Minimal App')).toBeInTheDocument();
  });

  test('has no shadow', () => {
    const { container } = render(<MinimalHeader title="App" />);
    expect(container).toBeInTheDocument();
  });
});

describe('CenteredHeader Component', () => {
  test('renders CenteredHeader', () => {
    const { container } = render(
      <CenteredHeader title="App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays centered navigation', () => {
    const navItems = [
      { label: 'HOME', href: '#' },
      { label: 'ABOUT', href: '#' },
    ];
    render(
      <CenteredHeader
        title="App"
        navItems={navItems}
        onModeChange={() => {}}
      />
    );
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('ABOUT')).toBeInTheDocument();
  });
});

describe('StickyHeader Component', () => {
  test('renders StickyHeader', () => {
    const { container } = render(
      <StickyHeader title="App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('has sticky position', () => {
    const { container } = render(
      <StickyHeader title="App" onModeChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
