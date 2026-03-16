// src/components/TextField/TextField.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TextField,
  EmailTextField,
  PasswordTextField,
  SearchTextField,
  NumberTextField,
  PhoneTextField,
  URLTextField,
  TextArea,
  TextFieldGroup,
} from './TextField';
import { axe } from 'jest-axe';

describe('TextField Component', () => {
  test('renders with label', () => {
    render(<TextField label="Test Field" />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  test('updates value on input change', async () => {
    const { getByRole } = render(
      <TextField label="Test" value="" onChange={(e) => {}} />
    );
    const input = getByRole('textbox');
    await userEvent.type(input, 'Hello');
    expect(input.value).toBe('Hello');
  });

  test('displays placeholder text', () => {
    render(
      <TextField label="Test" placeholder="Enter text" />
    );
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(
      <TextField label="Test" error={true} errorMessage="This field is required" />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('disables input when disabled prop is true', () => {
    render(
      <TextField label="Test" disabled={true} />
    );
    expect(screen.getByLabelText('Test')).toBeDisabled();
  });

  test('shows required indicator', () => {
    render(
      <TextField label="Test" required={true} />
    );
    expect(screen.getByLabelText(/\*/)).toBeInTheDocument();
  });

  test('changes input type', () => {
    render(
      <TextField label="Email" type="email" />
    );
    const input = screen.getByLabelText('Email');
    expect(input.type).toBe('email');
  });

  test('handles focus and blur events', async () => {
    const { getByRole } = render(
      <TextField label="Test" />
    );
    const input = getByRole('textbox');

    fireEvent.focus(input);
    expect(input).toHaveFocus();

    fireEvent.blur(input);
    expect(input).not.toHaveFocus();
  });

  test('EmailTextField renders with email type', () => {
    render(<EmailTextField />);
    const input = screen.getByLabelText('Email');
    expect(input.type).toBe('email');
  });

  test('PasswordTextField renders with password type', () => {
    render(<PasswordTextField />);
    const input = screen.getByLabelText('Password');
    expect(input.type).toBe('password');
  });

  test('SearchTextField renders with search type', () => {
    render(<SearchTextField />);
    const input = screen.getByLabelText('Search');
    expect(input.type).toBe('search');
  });

  test('NumberTextField renders with number type', () => {
    render(<NumberTextField />);
    const input = screen.getByLabelText('Number');
    expect(input.type).toBe('number');
  });

  test('PhoneTextField renders with tel type', () => {
    render(<PhoneTextField />);
    const input = screen.getByLabelText('Phone');
    expect(input.type).toBe('tel');
  });

  test('URLTextField renders with url type', () => {
    render(<URLTextField />);
    const input = screen.getByLabelText('Website');
    expect(input.type).toBe('url');
  });

  test('TextArea renders with multiple lines', () => {
    render(<TextArea label="Message" rows={4} />);
    const textarea = screen.getByLabelText('Message');
    expect(textarea.getAttribute('rows')).toBe('4');
  });

  test('TextFieldGroup renders multiple fields', () => {
    const fields = [
      { id: '1', label: 'Field 1' },
      { id: '2', label: 'Field 2' },
      { id: '3', label: 'Field 3' },
    ];
    render(<TextFieldGroup fields={fields} />);
    expect(screen.getByLabelText('Field 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Field 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Field 3')).toBeInTheDocument();
  });

  test('applies custom sx styles', () => {
    const { getByRole } = render(
      <TextField
        label="Test"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--Test)',
          },
        }}
      />
    );
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  test('fullWidth prop works', () => {
    const { container } = render(
      <TextField label="Test" fullWidth={true} />
    );
    const box = container.querySelector('div');
    expect(box).toHaveStyle('width: 100%');
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('TextField — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <TextField aria-label="Text field" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <TextField aria-label="Text field" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <TextField aria-label="Text field" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
