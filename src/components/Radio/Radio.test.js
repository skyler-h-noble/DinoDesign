// src/components/Radio/Radio.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup, RadioInput } from './Radio';
import { axe } from 'jest-axe';

// ─── Radio (single) ─────────────────────────────────────────────────────────

describe('Radio Component', () => {
  test('renders without crashing', () => {
    const { container } = render(
      <Radio value="a" label="Option A" />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays label text', () => {
    render(<Radio value="a" label="My Label" />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  test('renders without label', () => {
    const { container } = render(
      <Radio value="a" aria-label="Hidden label" />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toBeInTheDocument();
  });

  test('handles checked state', () => {
    const { container } = render(
      <Radio value="a" label="Checked" checked onChange={() => {}} />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  test('handles unchecked state', () => {
    const { container } = render(
      <Radio value="a" label="Unchecked" checked={false} onChange={() => {}} />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).not.toBeChecked();
  });

  test('fires onChange callback', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Radio value="a" label="Click me" onChange={onChange} />);
    await user.click(screen.getByText('Click me'));
    expect(onChange).toHaveBeenCalled();
  });

  test('handles disabled state', () => {
    const { container } = render(
      <Radio value="a" label="Disabled" disabled />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toBeDisabled();
  });

  test('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Radio value="a" label="Disabled" disabled onChange={onChange} />);
    await user.click(screen.getByText('Disabled'));
    expect(onChange).not.toHaveBeenCalled();
  });

  // --- Color ---

  test('defaults to primary color', () => {
    const { container } = render(<Radio value="a" label="Default" />);
    expect(container.querySelector('.radio-primary')).toBeInTheDocument();
  });

  test('applies named color class', () => {
    const { container } = render(<Radio color="secondary" value="a" label="Sec" />);
    expect(container.querySelector('.radio-secondary')).toBeInTheDocument();
  });

  test('falls back to primary for unknown colors', () => {
    const { container } = render(<Radio color="purple" value="a" label="Bad" />);
    expect(container.querySelector('.radio-primary')).toBeInTheDocument();
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size', (size) => {
    const { container } = render(
      <Radio value="a" label={`Size ${size}`} size={size} />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Custom icon rendering ---

  test('renders custom circle icon unchecked', () => {
    const { container } = render(
      <Radio value="a" label="Unchecked" checked={false} onChange={() => {}} />
    );
    expect(container.querySelector('.radio-circle-icon')).toBeInTheDocument();
  });

  test('renders dot inside circle when checked', () => {
    const { container } = render(
      <Radio value="a" label="Checked" checked onChange={() => {}} />
    );
    const icons = container.querySelectorAll('.radio-circle-icon');
    // The checked icon should contain a child dot div
    const checkedIcon = icons[icons.length - 1];
    expect(checkedIcon.children.length).toBeGreaterThan(0);
  });

  // --- Additional props ---

  test('passes name prop to input', () => {
    const { container } = render(
      <Radio value="a" label="Named" name="my-radio" />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toHaveAttribute('name', 'my-radio');
  });

  test('passes value prop to input', () => {
    const { container } = render(
      <Radio value="test-val" label="Valued" />
    );
    const radio = container.querySelector('input[type="radio"]');
    expect(radio).toHaveAttribute('value', 'test-val');
  });
});

// ─── RadioGroup ──────────────────────────────────────────────────────────────

describe('RadioGroup Component', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  test('renders without crashing', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays all option labels', () => {
    render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  test('renders correct number of radio inputs', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} />
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(3);
  });

  test('displays group label', () => {
    render(
      <RadioGroup label="Choose one" options={options} value="opt1" onChange={() => {}} />
    );
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  test('renders without group label', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} aria-label="Hidden label" />
    );
    expect(container).toBeInTheDocument();
  });

  test('selects the correct value', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt2" onChange={() => {}} />
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  test('fires onChange with new value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <RadioGroup options={options} value="opt1" onChange={onChange} />
    );
    await user.click(screen.getByText('Option 2'));
    expect(onChange).toHaveBeenCalled();
  });

  // --- Color ---

  test('passes color to child radios', () => {
    const { container } = render(
      <RadioGroup color="error" options={options} value="opt1" onChange={() => {}} />
    );
    const radioButtons = container.querySelectorAll('.radio-error');
    expect(radioButtons.length).toBe(3);
  });

  // --- Sizes ---

  test.each(['small', 'medium', 'large'])('renders %s size group', (size) => {
    const { container } = render(
      <RadioGroup size={size} options={options} value="opt1" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Orientation ---

  test('renders vertical by default', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeInTheDocument();
  });

  test('renders horizontal orientation', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} orientation="horizontal" />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeInTheDocument();
    expect(group.className).toContain('row');
  });

  // --- Disabled ---

  test('disables all radios when group disabled', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} disabled />
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  test('disables individual options', () => {
    const partialOptions = [
      { label: 'Enabled', value: 'a' },
      { label: 'Disabled', value: 'b', disabled: true },
      { label: 'Enabled too', value: 'c' },
    ];
    const { container } = render(
      <RadioGroup options={partialOptions} value="a" onChange={() => {}} />
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[0]).not.toBeDisabled();
    expect(radios[1]).toBeDisabled();
    expect(radios[2]).not.toBeDisabled();
  });

  // --- Spacing ---

  test('accepts custom spacing', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} spacing={2} />
    );
    expect(container).toBeInTheDocument();
  });

  // --- Name ---

  test('passes name to all radio inputs', () => {
    const { container } = render(
      <RadioGroup options={options} value="opt1" onChange={() => {}} name="my-group" />
    );
    const radios = container.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'my-group');
    });
  });
});

// ─── Legacy Aliases ─────────────────────────────────────────────────────────

describe('Legacy Aliases', () => {
  test('RadioInput is an alias for Radio', () => {
    expect(RadioInput).toBe(Radio);
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────────

describe('Accessibility', () => {
  test('radio has role="radio"', () => {
    render(<Radio value="a" label="Accessible" />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  test('radiogroup has role="radiogroup"', () => {
    const options = [{ label: 'A', value: 'a' }];
    render(<RadioGroup options={options} value="a" onChange={() => {}} aria-label="Group" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  test('aria-label passed through on Radio', () => {
    render(<Radio value="a" aria-label="Custom label" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-label', 'Custom label');
  });

  test('disabled radio has aria-disabled', () => {
    render(<Radio value="a" label="Disabled" disabled />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  test('radio group fieldset wraps options', () => {
    const options = [{ label: 'A', value: 'a' }];
    const { container } = render(
      <RadioGroup label="Group Label" options={options} value="a" onChange={() => {}} />
    );
    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toBeInTheDocument();
  });

  test('radio group legend text matches label', () => {
    const options = [{ label: 'A', value: 'a' }];
    render(
      <RadioGroup label="Pick one" options={options} value="a" onChange={() => {}} />
    );
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('Radio — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <Radio aria-label="Option one" value="one" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <Radio aria-label="Option one" value="one" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <Radio aria-label="Option one" value="one" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
