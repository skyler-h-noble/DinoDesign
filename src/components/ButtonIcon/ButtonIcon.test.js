// src/components/ButtonIcon/ButtonIcon.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonIcon, IconButtonGroup } from './ButtonIcon';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';

describe('ButtonIcon Component', () => {
  // Render tests
  test('renders icon button', () => {
    render(<ButtonIcon><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('renders with children icon', () => {
    const { container } = render(
      <ButtonIcon><EditIcon data-testid="edit-icon" /></ButtonIcon>
    );
    expect(container.querySelector('[data-testid="edit-icon"]')).toBeInTheDocument();
  });

  // Size tests
  test('renders with small size', () => {
    const { container } = render(
      <ButtonIcon size="small"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('padding: 6px');
  });

  test('renders with medium size (default)', () => {
    const { container } = render(
      <ButtonIcon><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('padding: 8px');
  });

  test('renders with large size', () => {
    const { container } = render(
      <ButtonIcon size="large"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('padding: 12px');
  });

  // Color tests
  test('renders with primary color', () => {
    const { container } = render(
      <ButtonIcon color="primary"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('color: var(--Primary-Color-11)');
  });

  test('renders with secondary color', () => {
    const { container } = render(
      <ButtonIcon color="secondary"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('color: var(--Secondary-Color-11)');
  });

  test('renders with error color', () => {
    const { container } = render(
      <ButtonIcon color="error"><DeleteIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('color: var(--Error-Color-11)');
  });

  test('renders with success color', () => {
    const { container } = render(
      <ButtonIcon color="success"><SaveIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('color: var(--Success-Color-11)');
  });

  // Variant tests
  test('renders text variant (default)', () => {
    const { container } = render(
      <ButtonIcon variant="text"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('background-color: transparent');
  });

  test('renders filled variant', () => {
    const { container } = render(
      <ButtonIcon variant="filled"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('background-color: var(--Primary-Color-11)');
    expect(button).toHaveStyle('color: #FFFFFF');
  });

  test('renders outlined variant', () => {
    const { container } = render(
      <ButtonIcon variant="outlined"><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('background-color: transparent');
    expect(button).toHaveAttribute('style', expect.stringContaining('border'));
  });

  // Interaction tests
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonIcon onClick={handleClick}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Disabled state tests
  test('disables button when disabled prop is true', () => {
    render(<ButtonIcon disabled={true}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('shows opacity when disabled', () => {
    const { container } = render(
      <ButtonIcon disabled={true}><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('opacity: 0.5');
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<ButtonIcon disabled={true} onClick={handleClick}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Loading state tests
  test('disables button when loading is true', () => {
    render(<ButtonIcon loading={true}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Accessibility tests
  test('has aria-disabled when disabled', () => {
    render(<ButtonIcon disabled={true}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  test('has aria-disabled when loading', () => {
    render(<ButtonIcon loading={true}><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  // Props tests
  test('accepts additional props', () => {
    render(<ButtonIcon aria-label="Edit" title="Edit button"><EditIcon /></ButtonIcon>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Edit');
    expect(button).toHaveAttribute('title', 'Edit button');
  });

  // Styling tests
  test('applies custom sx props', () => {
    const { container } = render(
      <ButtonIcon sx={{ margin: '10px' }}><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('margin: 10px');
  });

  test('has border radius', () => {
    const { container } = render(
      <ButtonIcon><EditIcon /></ButtonIcon>
    );
    const button = container.querySelector('button');
    expect(button).toHaveStyle('border-radius: var(--Style-Border-Radius)');
  });
});

describe('IconButtonGroup Component', () => {
  const mockButtons = [
    { icon: <EditIcon />, label: 'Edit', onClick: jest.fn() },
    { icon: <DeleteIcon />, label: 'Delete', onClick: jest.fn() },
    { icon: <SaveIcon />, label: 'Save', onClick: jest.fn() },
  ];

  test('renders button group', () => {
    const { container } = render(
      <IconButtonGroup buttons={mockButtons} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });

  test('renders multiple buttons', () => {
    render(<IconButtonGroup buttons={mockButtons} />);
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
    expect(screen.getByLabelText('Save')).toBeInTheDocument();
  });

  test('applies size to all buttons', () => {
    const { container } = render(
      <IconButtonGroup buttons={mockButtons} size="large" />
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle('padding: 12px');
    });
  });

  test('applies color to all buttons', () => {
    const { container } = render(
      <IconButtonGroup buttons={mockButtons} color="primary" />
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle('color: var(--Primary-Color-11)');
    });
  });

  test('applies variant to all buttons', () => {
    const { container } = render(
      <IconButtonGroup buttons={mockButtons} variant="filled" />
    );
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle('background-color: var(--Primary-Color-11)');
    });
  });

  test('respects individual button colors', () => {
    const customButtons = [
      { icon: <EditIcon />, label: 'Edit', color: 'primary' },
      { icon: <DeleteIcon />, label: 'Delete', color: 'error' },
    ];
    const { container } = render(
      <IconButtonGroup buttons={customButtons} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveStyle('color: var(--Primary-Color-11)');
    expect(buttons[1]).toHaveStyle('color: var(--Error-Color-11)');
  });

  test('respects individual button variants', () => {
    const customButtons = [
      { icon: <EditIcon />, label: 'Edit', variant: 'filled' },
      { icon: <DeleteIcon />, label: 'Delete', variant: 'outlined' },
    ];
    const { container } = render(
      <IconButtonGroup buttons={customButtons} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveStyle('background-color: var(--Primary-Color-11)');
    expect(buttons[1]).toHaveStyle('background-color: transparent');
  });

  test('calls individual onClick handlers', () => {
    const handleClick1 = jest.fn();
    const handleClick2 = jest.fn();
    const customButtons = [
      { icon: <EditIcon />, label: 'Edit', onClick: handleClick1 },
      { icon: <DeleteIcon />, label: 'Delete', onClick: handleClick2 },
    ];
    render(<IconButtonGroup buttons={customButtons} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(handleClick1).toHaveBeenCalled();
    expect(handleClick2).toHaveBeenCalled();
  });

  test('disables individual buttons', () => {
    const customButtons = [
      { icon: <EditIcon />, label: 'Edit' },
      { icon: <DeleteIcon />, label: 'Delete', disabled: true },
    ];
    render(<IconButtonGroup buttons={customButtons} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  test('renders empty group with no buttons', () => {
    const { container } = render(<IconButtonGroup buttons={[]} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });
});
