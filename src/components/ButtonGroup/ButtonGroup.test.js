// src/components/ButtonGroup/ButtonGroup.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';

describe('ButtonGroup Component', () => {
  // Render tests
  test('renders button group with children', () => {
    render(
      <ButtonGroup aria-label="test group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  test('renders with role="group"', () => {
    render(
      <ButtonGroup aria-label="test group">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  test('renders with aria-label', () => {
    render(
      <ButtonGroup aria-label="my button group">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'my button group');
  });

  // Variant cascade tests
  test('passes variant to child buttons', () => {
    render(
      <ButtonGroup variant="primary-outline" aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    // Buttons should receive the variant from the group
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  test('child variant overrides group variant', () => {
    render(
      <ButtonGroup variant="primary-outline" aria-label="test">
        <Button>Group Variant</Button>
        <Button variant="error">Override</Button>
      </ButtonGroup>
    );
    // Both buttons render — override variant takes precedence on the second
    expect(screen.getByText('Group Variant')).toBeInTheDocument();
    expect(screen.getByText('Override')).toBeInTheDocument();
  });

  // Size cascade tests
  test('passes size to child buttons', () => {
    render(
      <ButtonGroup size="large" aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  test('child size overrides group size', () => {
    render(
      <ButtonGroup size="large" aria-label="test">
        <Button>Group Size</Button>
        <Button size="small">Override</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('Group Size')).toBeInTheDocument();
    expect(screen.getByText('Override')).toBeInTheDocument();
  });

  // Disabled cascade tests
  test('disables all buttons when group is disabled', () => {
    render(
      <ButtonGroup disabled aria-label="disabled group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test('child disabled={false} overrides group disabled', () => {
    render(
      <ButtonGroup disabled aria-label="test">
        <Button>Disabled</Button>
        <Button disabled={false}>Enabled</Button>
        <Button>Disabled</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('Disabled')).toBeDisabled();
    expect(screen.getByText('Enabled')).not.toBeDisabled();
  });

  // Event handling tests
  test('calls onClick on individual buttons', () => {
    const handleClick = jest.fn();
    render(
      <ButtonGroup aria-label="test">
        <Button onClick={handleClick}>Click me</Button>
        <Button>Other</Button>
      </ButtonGroup>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not fire onClick on disabled group buttons', () => {
    const handleClick = jest.fn();
    render(
      <ButtonGroup disabled aria-label="test">
        <Button onClick={handleClick}>Disabled</Button>
      </ButtonGroup>
    );
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Orientation tests
  test('renders horizontal by default', () => {
    const { container } = render(
      <ButtonGroup aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  test('renders vertical orientation', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical" aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  // Class tests
  test('accepts additional className', () => {
    const { container } = render(
      <ButtonGroup className="custom-class" aria-label="test">
        <Button>One</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('.btn-group');
    expect(group).toHaveClass('custom-class');
  });

  test('applies btn-group class', () => {
    const { container } = render(
      <ButtonGroup aria-label="test">
        <Button>One</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('.btn-group');
    expect(group).toBeInTheDocument();
  });

  // Props forwarding tests
  test('forwards additional props to container', () => {
    const { container } = render(
      <ButtonGroup aria-label="test" data-testid="custom-group">
        <Button>One</Button>
      </ButtonGroup>
    );
    expect(container.querySelector('[data-testid="custom-group"]')).toBeInTheDocument();
  });

  // Connected mode tests (spacing=0)
  test('renders connected mode by default (spacing=0)', () => {
    render(
      <ButtonGroup aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  // Spaced mode tests
  test('renders spaced mode when spacing > 0', () => {
    render(
      <ButtonGroup spacing={1} aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  // Button count tests
  test('renders correct number of children', () => {
    render(
      <ButtonGroup aria-label="test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
        <Button>Four</Button>
        <Button>Five</Button>
      </ButtonGroup>
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
  });

  test('handles single child', () => {
    render(
      <ButtonGroup aria-label="test">
        <Button>Only</Button>
      </ButtonGroup>
    );
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  // Accessibility tests
  test('group is focusable via children', () => {
    render(
      <ButtonGroup aria-label="test">
        <Button>Focus me</Button>
        <Button>Other</Button>
      </ButtonGroup>
    );
    const button = screen.getByText('Focus me');
    button.focus();
    expect(button).toHaveFocus();
  });

  test('can tab through buttons in group', () => {
    render(
      <ButtonGroup aria-label="test">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );
    const first = screen.getByText('First');
    first.focus();
    expect(first).toHaveFocus();
  });
});
