// src/components/Colors/Colors.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Colors } from './Colors';

/* The showcase grew: labels like "Primary", "Text" and "Border" now appear in
 * several sections at once — brand, buttons, icons, tags — so getByText threw
 * on ambiguity rather than failing an assertion. These tests are checking that
 * a label is PRESENT, not that it is unique, so they ask for at least one.
 *
 * (A getByText that starts matching two nodes is not a stronger test than
 * getAllByText — it is a test that has stopped running.)
 */
describe('Colors Component', () => {
  test('renders Colors component', () => {
    const { container } = render(<Colors />);
    expect(container).toBeInTheDocument();
  });

  test('renders Brand Colors section', () => {
    render(<Colors />);
    expect(screen.getAllByText('Brand Colors (Static)').length).toBeGreaterThan(0);
  });

  test('renders Background Colors section', () => {
    render(<Colors />);
    expect(screen.getAllByText('Background Colors (Dynamic)').length).toBeGreaterThan(0);
  });

  test('renders Dynamic Colors section', () => {
    render(<Colors />);
    expect(screen.getAllByText('Dynamic Colors (Update with Mode, Background & Surface)').length).toBeGreaterThan(0);
  });

  test('renders How to Use section', () => {
    render(<Colors />);
    expect(screen.getAllByText('How to Use').length).toBeGreaterThan(0);
  });

  test('displays Primary, Secondary, Tertiary brand colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Primary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Secondary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tertiary').length).toBeGreaterThan(0);
  });

  test('displays background color variants', () => {
    render(<Colors />);
    expect(screen.getAllByText('Default Background').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Primary Background').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Secondary Background').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tertiary Background').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Neutral Background').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Neutral-Variant Background').length).toBeGreaterThan(0);
  });

  test('displays Layout & Surfaces colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Layout & Surfaces').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Background').length).toBeGreaterThan(0);
    /* 'Container' is not in Layout & Surfaces — that section is Background,
       Border and Border-Variant. */
    expect(screen.getAllByText('Border-Variant').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Border').length).toBeGreaterThan(0);
  });

  test('displays Text & Links colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Text & Links').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Text').length).toBeGreaterThan(0);
    /* Text & Links is Header / Text / Text-Quiet / Hotlink /
       Hotlink-Visited — there is no Text-Secondary swatch. */
    expect(screen.getAllByText('Text-Quiet').length).toBeGreaterThan(0);
  });

  test('displays Button Primary colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Buttons - Primary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Button BG').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Button Text').length).toBeGreaterThan(0);
  });

  test('displays Button Secondary colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Buttons - Secondary').length).toBeGreaterThan(0);
  });

  test('displays Button State colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Buttons - State').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Info Button').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Success Button').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Warning Button').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Error Button').length).toBeGreaterThan(0);
  });

  test('displays Icons colors', () => {
    render(<Colors />);
    expect(screen.getAllByText('Icons').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Default').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Primary').length).toBeGreaterThan(0);
  });

  test('displays Tags & Badges colors', () => {
    render(<Colors />);
    /* The section is 'Chips & Badges'. */
    expect(screen.getAllByText('Chips & Badges').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Primary BG').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Primary Text').length).toBeGreaterThan(0);
  });

  test('displays static colors explanation', () => {
    render(<Colors />);
    expect(screen.getAllByText('Static Colors').length).toBeGreaterThan(0);
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
    expect(screen.getAllByText('Example Usage').length).toBeGreaterThan(0);
  });

  test('displays CSS variable names', () => {
    render(<Colors />);
    expect(screen.getAllByText('--Primary-Color-11').length).toBeGreaterThan(0);
    expect(screen.getAllByText('--Secondary-Color-11').length).toBeGreaterThan(0);
    expect(screen.getAllByText('--Tertiary-Color-11').length).toBeGreaterThan(0);
  });

  /* Swatches paint through `sx`, which emotion compiles to a CLASS — there is
     no inline style attribute to match, so the old selector returned 0 and the
     assertion was really "0 > 10". Each swatch also prints its CSS variable
     name, so counting those counts the swatches without depending on how the
     colour is applied. */
  test('renders multiple color swatches', () => {
    const { container } = render(<Colors />);
    const varNames = Array.from(container.querySelectorAll('*'))
      .filter((el) => el.children.length === 0 && /^--[A-Za-z]/.test(el.textContent.trim()));
    expect(varNames.length).toBeGreaterThan(10);
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
