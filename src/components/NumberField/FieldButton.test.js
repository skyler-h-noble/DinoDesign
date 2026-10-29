// src/components/NumberField/FieldButton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import AddIcon from '@omni-design/icons/Add';
import { FieldButton } from './FieldButton';

const allCss = () => Array.from(document.styleSheets).flatMap((s) => Array.from(s.cssRules).map((r) => r.cssText)).join('\n');

describe('FieldButton', () => {
  test('is a button, named by its aria-label', () => {
    render(<FieldButton aria-label="Increase"><AddIcon /></FieldButton>);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
  });

  test.each([['small', '--Sm-FieldButton-Width', '40px'], ['medium', '--FieldButton-Width', '48px'], ['large', '--Lg-FieldButton-Width', '64px']])(
    '%s reads %s, falling back to %s', (size, token, px) => {
      render(<FieldButton size={size} aria-label="Increase"><AddIcon /></FieldButton>);
      expect(allCss()).toContain('var(' + token + ', ' + px + ')');
    });

  test('outline draws an inset Buttons border; ghost draws none', () => {
    const { unmount } = render(<FieldButton variant="outline" aria-label="Up"><AddIcon /></FieldButton>);
    expect(allCss()).toContain('inset 0 0 0 1px var(--Buttons-Default-Border)');
    unmount();
  });

  test('disabled is a disabled button', () => {
    render(<FieldButton disabled aria-label="Up"><AddIcon /></FieldButton>);
    expect(screen.getByRole('button', { name: 'Up' })).toBeDisabled();
  });

  test('no accessibility violations', async () => {
    const { container } = render(<FieldButton aria-label="Increase"><AddIcon /></FieldButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
