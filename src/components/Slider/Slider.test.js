// src/components/Slider/Slider.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Slider,
  SliderInput,
  RangeSlider,
  PrimarySlider,
  PrimaryLightSlider,
  SecondaryLightSlider,
  TertiaryLightSlider,
  NeutralLightSlider,
  InfoLightSlider,
  SuccessLightSlider,
  WarningLightSlider,
  ErrorLightSlider,
} from './Slider';
import { axe } from 'jest-axe';

// ─── Slider Component ───────────────────────────────────────────────────────

describe('Slider Component', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <Slider defaultValue={50} aria-label="Test slider" />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with role slider', () => {
    render(<Slider defaultValue={50} aria-label="Test slider" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('renders with correct default value', () => {
    render(<Slider defaultValue={75} aria-label="Test slider" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '75');
  });

  test('renders with controlled value', () => {
    render(<Slider value={30} aria-label="Test slider" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '30');
  });

  test('renders with label', () => {
    render(<Slider defaultValue={50} label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  test('renders without label', () => {
    const { container } = render(
      <Slider defaultValue={50} aria-label="No label" />
    );
    expect(container.querySelector('.slider-primary')).toBeInTheDocument();
  });

  // --- Disabled ---

  test('handles disabled state', () => {
    render(<Slider defaultValue={50} disabled aria-label="Disabled" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
  });

  test('label has reduced opacity when disabled', () => {
    render(<Slider defaultValue={50} label="Disabled" disabled />);
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  // --- Variants ---

  test('defaults to primary variant', () => {
    const { container } = render(
      <Slider defaultValue={50} aria-label="Test" />
    );
    expect(container.querySelector('.slider-primary')).toBeInTheDocument();
  });

  test('applies light variant class', () => {
    const { container } = render(
      <Slider variant="success-light" defaultValue={50} aria-label="Test" />
    );
    expect(container.querySelector('.slider-success-light')).toBeInTheDocument();
  });

  test('applies secondary light variant class', () => {
    const { container } = render(
      <Slider variant="secondary-light" defaultValue={50} aria-label="Test" />
    );
    expect(container.querySelector('.slider-secondary-light')).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(
      <Slider defaultValue={50} size={size} aria-label="Test" />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Min / Max / Step ---

  test('respects min and max', () => {
    render(<Slider defaultValue={5} min={0} max={10} aria-label="Test" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '10');
  });

  test('respects step', () => {
    const { container } = render(
      <Slider defaultValue={50} step={10} aria-label="Test" />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Marks ---

  test('renders with marks=true', () => {
    const { container } = render(
      <Slider defaultValue={50} step={25} marks aria-label="Test" />
    );
    const markElements = container.querySelectorAll('.MuiSlider-mark');
    expect(markElements.length).toBeGreaterThan(0);
  });

  test('renders with custom marks', () => {
    const marks = [
      { value: 0, label: 'Low' },
      { value: 50, label: 'Mid' },
      { value: 100, label: 'High' },
    ];
    render(<Slider defaultValue={50} marks={marks} aria-label="Test" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Mid')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  // --- Value Label Display ---

  test('renders with valueLabelDisplay on', () => {
    const { container } = render(
      <Slider defaultValue={50} valueLabelDisplay="on" aria-label="Test" />
    );
    const valueLabel = container.querySelector('.MuiSlider-valueLabel');
    expect(valueLabel).toBeInTheDocument();
  });

  test('renders with valueLabelDisplay off', () => {
    const { container } = render(
      <Slider defaultValue={50} valueLabelDisplay="off" aria-label="Test" />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with valueLabelDisplay auto', () => {
    const { container } = render(
      <Slider defaultValue={50} valueLabelDisplay="auto" aria-label="Test" />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Orientation ---

  test('renders horizontal by default', () => {
    render(<Slider defaultValue={50} aria-label="Test" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('renders vertical orientation', () => {
    render(
      <Slider defaultValue={50} orientation="vertical" aria-label="Test" />
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  });

  // --- Track ---

  test('renders normal track by default', () => {
    const { container } = render(
      <Slider defaultValue={50} aria-label="Test" />
    );
    const track = container.querySelector('.MuiSlider-track');
    expect(track).toBeInTheDocument();
  });

  test('renders inverted track', () => {
    const { container } = render(
      <Slider defaultValue={50} track="inverted" aria-label="Test" />
    );
    expect(container.querySelector('.MuiSlider-trackInverted, .MuiSlider-root')).toBeInTheDocument();
  });

  // --- Range Slider ---

  test('renders range slider with two thumbs', () => {
    render(
      <Slider
        defaultValue={[25, 75]}
        getAriaLabel={(i) => i === 0 ? 'Min' : 'Max'}
      />
    );
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(2);
  });

  test('range slider has correct values', () => {
    render(
      <Slider
        value={[20, 80]}
        getAriaLabel={(i) => i === 0 ? 'Min' : 'Max'}
      />
    );
    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  // --- ARIA ---

  test('passes aria-label', () => {
    render(<Slider defaultValue={50} aria-label="My slider" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', 'My slider');
  });

  test('passes aria-labelledby', () => {
    render(
      <>
        <span id="my-label">My Label</span>
        <Slider defaultValue={50} aria-labelledby="my-label" />
      </>
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-labelledby', 'my-label');
  });

  test('passes name prop', () => {
    const { container } = render(
      <Slider defaultValue={50} name="my-slider" aria-label="Test" />
    );
    const input = container.querySelector('input[name="my-slider"]');
    expect(input).toBeInTheDocument();
  });
});

// ─── Convenience Exports ─────────────────────────────────────────────────────

describe('Convenience Exports', () => {
  test('PrimarySlider renders', () => {
    const { container } = render(<PrimarySlider defaultValue={50} aria-label="Test" />);
    expect(container.querySelector('.slider-primary')).toBeInTheDocument();
  });

  // Light
  test.each([
    ['PrimaryLightSlider',   PrimaryLightSlider,   'primary-light'],
    ['SecondaryLightSlider', SecondaryLightSlider, 'secondary-light'],
    ['TertiaryLightSlider',  TertiaryLightSlider,  'tertiary-light'],
    ['NeutralLightSlider',   NeutralLightSlider,   'neutral-light'],
    ['InfoLightSlider',      InfoLightSlider,      'info-light'],
    ['SuccessLightSlider',   SuccessLightSlider,   'success-light'],
    ['WarningLightSlider',   WarningLightSlider,   'warning-light'],
    ['ErrorLightSlider',     ErrorLightSlider,     'error-light'],
  ])('%s renders with correct variant', (name, Component, variant) => {
    const { container } = render(<Component defaultValue={50} aria-label="Test" />);
    expect(container.querySelector(`.slider-${variant}`)).toBeInTheDocument();
  });

  // Legacy aliases
  test('SliderInput is an alias for Slider', () => {
    expect(SliderInput).toBe(Slider);
  });

  test('RangeSlider is an alias for Slider', () => {
    expect(RangeSlider).toBe(Slider);
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('has role="slider"', () => {
    render(<Slider defaultValue={50} aria-label="Accessible" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('has aria-valuemin and aria-valuemax', () => {
    render(<Slider defaultValue={50} min={10} max={90} aria-label="Test" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
  });

  test('has aria-valuenow', () => {
    render(<Slider defaultValue={42} aria-label="Test" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '42');
  });

  test('has aria-orientation horizontal by default', () => {
    render(<Slider defaultValue={50} aria-label="Test" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('has aria-orientation vertical', () => {
    render(<Slider defaultValue={50} orientation="vertical" aria-label="Test" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('disabled slider has aria-disabled', () => {
    render(<Slider defaultValue={50} disabled aria-label="Test" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  test('range slider thumbs have individual labels', () => {
    render(
      <Slider
        defaultValue={[20, 80]}
        getAriaLabel={(i) => i === 0 ? 'Minimum' : 'Maximum'}
      />
    );
    expect(screen.getByLabelText('Minimum')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Slider — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={50} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Slider aria-label="Volume" defaultValue={50} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Slider aria-label="Volume" defaultValue={50} />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
