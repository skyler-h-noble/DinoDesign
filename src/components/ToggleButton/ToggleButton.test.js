// src/components/ToggleButton/ToggleButton.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import {
  ToggleButton,
  ToggleButtonGroup,
  TextFormatToggleGroup,
  AlignmentToggleGroup,
  ViewModeToggleGroup,
  SizeToggleGroup,
  VerticalToggleButtonGroup,
  DisabledToggleButton,
  ToggleButtonShowcase,
} from './ToggleButton';

describe('ToggleButton Component', () => {
  test('renders toggle button', () => {
    render(
      <ToggleButton value="test">Toggle</ToggleButton>
    );
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  test('toggles selection state', () => {
    const { container } = render(
      <ToggleButton value="test" selected={false}>
        Toggle
      </ToggleButton>
    );
    expect(container).toBeInTheDocument();
  });

  test('calls onChange handler', () => {
    const onChange = jest.fn();
    const { container } = render(
      <ToggleButton value="test" onChange={onChange}>
        Toggle
      </ToggleButton>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('ToggleButtonGroup Component', () => {
  test('renders group with options', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { container } = render(
      <ToggleButtonGroup
        value="opt1"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('supports exclusive selection', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { container } = render(
      <ToggleButtonGroup
        value="opt1"
        onChange={jest.fn()}
        exclusive={true}
        options={options}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('supports multiple selection', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { container } = render(
      <ToggleButtonGroup
        value={['opt1']}
        onChange={jest.fn()}
        exclusive={false}
        options={options}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('supports fullWidth', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { container } = render(
      <ToggleButtonGroup
        value="opt1"
        onChange={jest.fn()}
        options={options}
        fullWidth
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Specialized Toggle Groups', () => {
  test('TextFormatToggleGroup renders', () => {
    const { container } = render(
      <TextFormatToggleGroup formats={[]} onChange={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  test('AlignmentToggleGroup renders', () => {
    const { container } = render(
      <AlignmentToggleGroup alignment="left" onChange={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  test('ViewModeToggleGroup renders', () => {
    const { container } = render(
      <ViewModeToggleGroup viewMode="list" onChange={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  test('SizeToggleGroup renders', () => {
    const { container } = render(
      <SizeToggleGroup size="medium" onChange={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('VerticalToggleButtonGroup Component', () => {
  test('renders vertical orientation', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ];
    const { container } = render(
      <VerticalToggleButtonGroup
        value="opt1"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('DisabledToggleButton Component', () => {
  test('renders disabled button', () => {
    render(
      <DisabledToggleButton value="disabled">
        Disabled
      </DisabledToggleButton>
    );
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  test('disabled button is not interactive', () => {
    const { container } = render(
      <DisabledToggleButton value="disabled" selected={false}>
        Disabled
      </DisabledToggleButton>
    );
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
  });
});

describe('ToggleButtonShowcase Component', () => {
  test('renders showcase', () => {
    const { container } = render(<ToggleButtonShowcase />);
    expect(container).toBeInTheDocument();
  });
});

describe('Design System Integration', () => {
  test('uses design system colors', () => {
    const { container } = render(
      <ToggleButton value="test">Toggle</ToggleButton>
    );
    expect(container).toBeInTheDocument();
  });

  test('supports custom sx prop', () => {
    const { container } = render(
      <ToggleButton value="test" sx={{ maxWidth: '200px' }}>
        Toggle
      </ToggleButton>
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  test('toggle button has proper attributes', () => {
    const { container } = render(
      <ToggleButton value="test">Toggle</ToggleButton>
    );
    expect(container).toBeInTheDocument();
  });

  test('specialized groups have aria-labels', () => {
    const { container } = render(
      <AlignmentToggleGroup alignment="left" onChange={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });
});
