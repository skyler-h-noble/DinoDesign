import React from 'react';
import { render } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';


/* Figma's Copy In Header / Copy In Body, independently. */
describe('copy placement', () => {
  const copies = (c) => c.querySelectorAll('button').length;
  test('default: one copy, in the header', () => {
    const { container } = render(<CodeBlock code="npm i" />);
    expect(copies(container)).toBe(1);
  });
  test('header shown, copy in the body only', () => {
    const { container } = render(<CodeBlock code="npm i" copyInHeader={false} copyInBody />);
    expect(copies(container)).toBe(1);
  });
  test('copy in both', () => {
    const { container } = render(<CodeBlock code="npm i" copyInBody />);
    expect(copies(container)).toBe(2);
  });
  test('no header: copy moves to the body', () => {
    const { container } = render(<CodeBlock code="npm i" showHeader={false} />);
    expect(copies(container)).toBe(1);
  });
});
