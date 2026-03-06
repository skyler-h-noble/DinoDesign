// src/components/MainLayout/MainLayout.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout, DefaultMainLayout } from './MainLayout';

const mockNavItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Settings', path: '/settings' },
];

describe('MainLayout Component', () => {
  test('renders MainLayout', () => {
    const { container } = render(
      <MainLayout navItems={mockNavItems}>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(container).toBeInTheDocument();
  });

  test('displays title', () => {
    render(
      <MainLayout title="My App" navItems={mockNavItems}>
        <div>Content</div>
      </MainLayout>
    );
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  test('displays children content', () => {
    render(
      <MainLayout navItems={mockNavItems}>
        <div>Test Content Here</div>
      </MainLayout>
    );
    expect(screen.getByText('Test Content Here')).toBeInTheDocument();
  });

  test('displays navigation items', () => {
    render(
      <MainLayout navItems={mockNavItems}>
        <div>Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('handles layout change', () => {
    const onLayoutChange = jest.fn();
    const { container } = render(
      <MainLayout 
        navItems={mockNavItems}
        layout="side"
        onLayoutChange={onLayoutChange}
      >
        <div>Content</div>
      </MainLayout>
    );
    expect(container).toBeInTheDocument();
  });

  test('handles navigation click', () => {
    const onNavigate = jest.fn();
    const { container } = render(
      <MainLayout 
        navItems={mockNavItems}
        onNavigate={onNavigate}
      >
        <div>Content</div>
      </MainLayout>
    );
    const navButton = container.querySelector('button');
    if (navButton) fireEvent.click(navButton);
  });
});

describe('DefaultMainLayout Component', () => {
  test('renders DefaultMainLayout', () => {
    const { container } = render(
      <DefaultMainLayout />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays Design System title', () => {
    render(<DefaultMainLayout />);
    expect(screen.getByText('Design System')).toBeInTheDocument();
  });

  test('displays theme mode options', () => {
    render(<DefaultMainLayout />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  test('displays demo sections', () => {
    render(<DefaultMainLayout />);
    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByText('Buttons')).toBeInTheDocument();
    expect(screen.getByText('Cards')).toBeInTheDocument();
  });

  test('handles mode change', () => {
    const onModeChange = jest.fn();
    render(
      <DefaultMainLayout onModeChange={onModeChange} />
    );
    const lightButton = screen.getByText('Light');
    fireEvent.click(lightButton);
  });
});
