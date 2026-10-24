// src/components/Input/InputDecorator.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { InputDecorator } from './InputDecorator';
import { Input } from './Input';

const allCss = () => Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules).map((r) => r.cssText)).join('\n');

describe('InputDecorator', () => {
  test('icon-only is a named button', () => {
    render(<InputDecorator aria-label="Clear"><BackspaceIcon /></InputDecorator>);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });
  test('square, no rise on hover, focus ring inside', () => {
    render(<InputDecorator aria-label="Clear"><BackspaceIcon /></InputDecorator>);
    const css = allCss();
    expect(css).toMatch(/outline-offset:\s*-5px/);
    expect(css).toMatch(/transform:\s*none/);
  });
  test('sits in an Input as its end decorator', () => {
    render(<Input aria-label="Name" endAdornment={<InputDecorator aria-label="Clear"><BackspaceIcon /></InputDecorator>} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
  });
});
