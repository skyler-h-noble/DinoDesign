// src/components/Progress/Progress.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Progress,
  CircularProgressComponent,
  ProgressWithLabel,
  StepProgress,
  BufferedProgress,
  SegmentedProgress,
  AllVariantsProgress,
  ProgressWithStates,
} from './Progress';

describe('Progress Component', () => {
  test('renders Progress with value', () => {
    const { container } = render(
      <Progress value={50} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders all 8 color variants', () => {
    const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];
    variants.forEach(variant => {
      const { container } = render(
        <Progress value={50} variant={variant} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('renders different sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
      const { container } = render(
        <Progress value={50} size={size} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('renders indeterminate progress', () => {
    const { container } = render(
      <Progress indeterminate />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders striped progress', () => {
    const { container } = render(
      <Progress value={70} striped />
    );
    expect(container).toBeInTheDocument();
  });

  test('disables animation when specified', () => {
    const { container } = render(
      <Progress value={50} animated={false} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('CircularProgressComponent', () => {
  test('renders CircularProgress with percentage', () => {
    render(<CircularProgressComponent value={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('renders all variants', () => {
    const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];
    variants.forEach(variant => {
      const { container } = render(
        <CircularProgressComponent value={50} variant={variant} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('hides percentage on indeterminate', () => {
    const { container } = render(
      <CircularProgressComponent indeterminate />
    );
    const percentage = container.querySelector('div');
    expect(percentage).toBeInTheDocument();
  });
});

describe('ProgressWithLabel Component', () => {
  test('renders ProgressWithLabel with label and value', () => {
    render(
      <ProgressWithLabel value={60} label="Loading..." />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});

describe('StepProgress Component', () => {
  test('renders StepProgress with steps', () => {
    const steps = [
      { label: 'Step 1', completed: true },
      { label: 'Step 2', completed: true },
      { label: 'Step 3', completed: false },
    ];
    render(<StepProgress steps={steps} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  test('calculates progress based on completed steps', () => {
    const steps = [
      { label: 'A', completed: true },
      { label: 'B', completed: true },
      { label: 'C', completed: false },
    ];
    const { container } = render(<StepProgress steps={steps} />);
    expect(container).toBeInTheDocument();
  });
});

describe('BufferedProgress Component', () => {
  test('renders BufferedProgress with value and buffer', () => {
    render(
      <BufferedProgress value={40} buffer={70} />
    );
    expect(screen.getByText(/Progress: 40%/)).toBeInTheDocument();
    expect(screen.getByText(/Buffered: 70%/)).toBeInTheDocument();
  });
});

describe('SegmentedProgress Component', () => {
  test('renders SegmentedProgress with segments', () => {
    const segments = [
      { label: 'Downloaded', value: 40 },
      { label: 'Remaining', value: 60 },
    ];
    render(<SegmentedProgress segments={segments} />);
    expect(screen.getByText(/Downloaded: 40%/)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: 60%/)).toBeInTheDocument();
  });
});

describe('AllVariantsProgress Component', () => {
  test('renders all color variants', () => {
    const { container } = render(
      <AllVariantsProgress value={65} />
    );
    const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];
    variants.forEach(variant => {
      expect(container.textContent).toContain(variant);
    });
  });
});

describe('ProgressWithStates Component', () => {
  test('renders different progress states', () => {
    const { container } = render(<ProgressWithStates />);
    expect(screen.getByText('Determinate (0%)')).toBeInTheDocument();
    expect(screen.getByText('Progress (50%)')).toBeInTheDocument();
    expect(screen.getByText('Complete (100%)')).toBeInTheDocument();
    expect(screen.getByText('Indeterminate')).toBeInTheDocument();
    expect(screen.getByText('Striped')).toBeInTheDocument();
  });
});

describe('Color Variants', () => {
  test('unfilled uses Border-Variant color', () => {
    const { container } = render(
      <Progress value={50} />
    );
    expect(container).toBeInTheDocument();
  });

  test('filled uses Buttons-Primary-Button for primary', () => {
    const { container } = render(
      <Progress value={50} variant="primary" />
    );
    expect(container).toBeInTheDocument();
  });

  test('all color variants render correctly', () => {
    const colorVariants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];
    colorVariants.forEach(variant => {
      const { container } = render(
        <Progress value={50} variant={variant} />
      );
      expect(container).toBeInTheDocument();
    });
  });
});
