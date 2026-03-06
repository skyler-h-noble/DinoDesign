// src/components/Colors/Colors.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Colors } from './Colors';

describe('Colors Component', () => {
  test('renders Colors component', () => {
    const { container } = render(<Colors />);
    expect(container).toBeInTheDocument();
  });

  test('renders Brand Colors section', () => {
    render(<Colors />);
    expect(screen.getByText('Brand Colors (Static)')).toBeInTheDocument();
  });

  test('renders Background Colors section', () => {
    render(<Colors />);
    expect(screen.getByText('Background Colors (Dynamic)')).toBeInTheDocument();
  });

  test('renders Dynamic Colors section', () => {
    render(<Colors />);
    expect(screen.getByText('Dynamic Colors (Update with Mode, Background & Surface)')).toBeInTheDocument();
  });

  test('renders How to Use section', () => {
    render(<Colors />);
    expect(screen.getByText('How to Use')).toBeInTheDocument();
  });

  test('displays Primary, Secondary, Tertiary brand colors', () => {
    render(<Colors />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Tertiary')).toBeInTheDocument();
  });

  test('displays background color variants', () => {
    render(<Colors />);
    expect(screen.getByText('Default Background')).toBeInTheDocument();
    expect(screen.getByText('Primary Background')).toBeInTheDocument();
    expect(screen.getByText('Secondary Background')).toBeInTheDocument();
    expect(screen.getByText('Tertiary Background')).toBeInTheDocument();
    expect(screen.getByText('Neutral Background')).toBeInTheDocument();
    expect(screen.getByText('Neutral-Variant Background')).toBeInTheDocument();
  });

  test('displays Layout & Surfaces colors', () => {
    render(<Colors />);
    expect(screen.getByText('Layout & Surfaces')).toBeInTheDocument();
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Container')).toBeInTheDocument();
    expect(screen.getByText('Border')).toBeInTheDocument();
  });

  test('displays Text & Links colors', () => {
    render(<Colors />);
    expect(screen.getByText('Text & Links')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Text-Secondary')).toBeInTheDocument();
  });

  test('displays Button Primary colors', () => {
    render(<Colors />);
    expect(screen.getByText('Buttons - Primary')).toBeInTheDocument();
    expect(screen.getByText('Button BG')).toBeInTheDocument();
    expect(screen.getByText('Button Text')).toBeInTheDocument();
  });

  test('displays Button Secondary colors', () => {
    render(<Colors />);
    expect(screen.getByText('Buttons - Secondary')).toBeInTheDocument();
  });

  test('displays Button Semantic colors', () => {
    render(<Colors />);
    expect(screen.getByText('Buttons - Semantic')).toBeInTheDocument();
    expect(screen.getByText('Info Button')).toBeInTheDocument();
    expect(screen.getByText('Success Button')).toBeInTheDocument();
    expect(screen.getByText('Warning Button')).toBeInTheDocument();
    expect(screen.getByText('Error Button')).toBeInTheDocument();
  });

  test('displays Icons colors', () => {
    render(<Colors />);
    expect(screen.getByText('Icons')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  test('displays Tags & Badges colors', () => {
    render(<Colors />);
    expect(screen.getByText('Tags & Badges')).toBeInTheDocument();
    expect(screen.getByText('Primary BG')).toBeInTheDocument();
    expect(screen.getByText('Primary Text')).toBeInTheDocument();
  });

  test('displays static colors explanation', () => {
    render(<Colors />);
    expect(screen.getByText('Static Colors')).toBeInTheDocument();
  });

  test('displays dynamic colors explanation', () => {
    render(<Colors />);
    const dynamicText = screen.getAllByText(/Dynamic/i).find(el => 
      el.textContent.includes('Dynamic Colors')
    );
    expect(dynamicText).toBeInTheDocument();
  });

  test('displays example usage', () => {
    render(<Colors />);
    expect(screen.getByText('Example Usage')).toBeInTheDocument();
  });

  test('displays CSS variable names', () => {
    render(<Colors />);
    expect(screen.getByText('--Primary-Color-11')).toBeInTheDocument();
    expect(screen.getByText('--Secondary-Color-11')).toBeInTheDocument();
    expect(screen.getByText('--Tertiary-Color-11')).toBeInTheDocument();
  });

  test('renders multiple color swatches', () => {
    const { container } = render(<Colors />);
    const swatches = container.querySelectorAll('[style*="background-color"]');
    expect(swatches.length).toBeGreaterThan(10);
  });

  test('all color swatches are 80x80', () => {
    const { container } = render(<Colors />);
    const swatches = container.querySelectorAll('div[style*="width: 80px"]');
    swatches.forEach(swatch => {
      expect(swatch).toHaveStyle('width: 80px');
      expect(swatch).toHaveStyle('height: 80px');
    });
  });

  test('displays description about theme settings', () => {
    render(<Colors />);
    expect(screen.getByText(/Most colors update automatically/)).toBeInTheDocument();
  });

  test('displays mode, background, and surface explanations', () => {
    render(<Colors />);
    expect(screen.getByText(/Light or Dark theme/)).toBeInTheDocument();
    expect(screen.getByText(/Default, Primary, Secondary, Tertiary/)).toBeInTheDocument();
    expect(screen.getByText(/Theme surface layer selection/)).toBeInTheDocument();
  });
});
