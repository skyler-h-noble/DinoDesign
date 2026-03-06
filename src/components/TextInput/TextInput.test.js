// src/components/TextInput/TextInput.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput, EmailInput, PasswordInput, TextArea } from './TextInput';

describe('TextInput Component', () => {
  test('renders TextInput', () => {
    const { container } = render(
      <TextInput label="Username" value="" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('displays label', () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  test('accepts user input', async () => {
    const onChange = jest.fn();
    const { container } = render(
      <TextInput value="" onChange={onChange} />
    );
    const input = container.querySelector('input');
    await userEvent.type(input, 'test');
    expect(onChange).toHaveBeenCalled();
  });

  test('displays placeholder', () => {
    const { container } = render(
      <TextInput placeholder="Enter text" value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  test('shows helper text', () => {
    render(
      <TextInput
        label="Test"
        value=""
        onChange={() => {}}
        helperText="Helper text"
      />
    );
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  test('displays error state', () => {
    render(
      <TextInput
        label="Test"
        value=""
        onChange={() => {}}
        error={true}
        helperText="Error message"
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('uses Border color for unfocused state', () => {
    const { container } = render(
      <TextInput value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });
});

describe('EmailInput Component', () => {
  test('renders EmailInput', () => {
    const { container } = render(
      <EmailInput value="" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('has email type', () => {
    const { container } = render(
      <EmailInput value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('displays default label', () => {
    render(<EmailInput value="" onChange={() => {}} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('displays default placeholder', () => {
    const { container } = render(
      <EmailInput value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'your@email.com');
  });
});

describe('PasswordInput Component', () => {
  test('renders PasswordInput', () => {
    const { container } = render(
      <PasswordInput value="" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('has password type', () => {
    const { container } = render(
      <PasswordInput value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('displays default label', () => {
    render(<PasswordInput value="" onChange={() => {}} />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  test('displays default placeholder', () => {
    const { container } = render(
      <PasswordInput value="" onChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', '••••••••');
  });
});

describe('TextArea Component', () => {
  test('renders TextArea', () => {
    const { container } = render(
      <TextArea label="Comments" value="" onChange={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });

  test('is multiline', () => {
    const { container } = render(
      <TextArea value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
  });

  test('has default rows', () => {
    const { container } = render(
      <TextArea value="" onChange={() => {}} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  test('accepts custom rows', () => {
    const { container } = render(
      <TextArea value="" onChange={() => {}} rows={6} />
    );
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '6');
  });

  test('displays label', () => {
    render(<TextArea label="Comments" value="" onChange={() => {}} />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });
});
