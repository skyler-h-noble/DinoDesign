// src/components/ButtonGroup/ButtonGroup.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';
import { axe } from 'jest-axe';

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
    /* getByText returns the label <span> inside the button, which is never
       "disabled" — the attribute is on the <button>. Query by role. */
    expect(screen.getAllByRole('button', { name: 'Disabled' })[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Enabled' })).not.toBeDisabled();
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
    /* Focus lands on the <button>; getByText returns the inner label span,
       which is not focusable, so .focus() was a no-op and focus stayed on
       <body>. */
    const button = screen.getByRole('button', { name: 'Focus me' });
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
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    expect(first).toHaveFocus();
  });
});

// ─── Accessibility — jest-axe ─────────────────────────────────────────────────

describe('ButtonGroup — Accessibility (jest-axe)', () => {
  test('has no accessibility violations with default props', async () => {
    const { container } = render(
      <ButtonGroup><button>One</button><button>Two</button></ButtonGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Primary theme', async () => {
    const { container } = render(
      <div data-theme="Primary">
        <ButtonGroup><button>One</button><button>Two</button></ButtonGroup>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has no accessibility violations in Secondary theme', async () => {
    const { container } = render(
      <div data-theme="Secondary">
        <ButtonGroup><button>One</button><button>Two</button></ButtonGroup>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* --- The light variant is a surface, not a theme --- */
describe('Light variant', () => {
  /* It used to wrap unselected segments in data-theme="{Color}-Light", and
     there is no such theme — every one of the nine bound nothing, so a light
     error group and a light success group rendered identically and both took
     the page's palette. Default-Light was never a theme even before the
     shades went. */
  const renderLight = (color) => render(
    <ButtonGroup variant="light" color={color} defaultValue="a">
      <Button value="a">One</Button>
      <Button value="b">Two</Button>
    </ButtonGroup>
  );

  test('names the bare palette, never a -Light theme', () => {
    const { container } = renderLight('error');
    /* The second line asserted the SAME selector was null — so this test
       required an element to be both present and absent and could never
       pass. What it means to check is that the STALE name is absent. */
    expect(container.querySelector('[data-theme="Error"]')).toBeInTheDocument();
    expect(container.querySelector('[data-theme="Error-Light"]')).toBeNull();
  });

  test('lightens with the surface, not the theme name', () => {
    const { container } = renderLight('success');
    const wrapper = container.querySelector('[data-theme="Success"]');
    expect(wrapper).toHaveAttribute('data-surface', 'Surface-Brightest');
  });

  test('two colours are actually different', () => {
    // The failure this replaces was invisible precisely because it was
    // uniform: every colour produced the same unthemed result.
    const { container: a } = renderLight('error');
    const { container: b } = renderLight('info');
    expect(a.querySelector('[data-theme="Error"]')).toBeInTheDocument();
    expect(b.querySelector('[data-theme="Info"]')).toBeInTheDocument();
  });

  test('default INHERITS rather than pinning the Default mode', () => {
    /* Naming Default would override whatever themed section the group sits
       in — the same bug Modal had. The surface still lightens it. */
    const { container } = renderLight('default');
    const wrapper = container.querySelector('[data-surface="Surface-Brightest"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).not.toHaveAttribute('data-theme');
  });

  test('only the UNSELECTED segments are lightened', () => {
    // The selected one fills with the palette's button colour; lightening it
    // would erase the thing that marks it as selected.
    const { container } = renderLight('primary');
    expect(container.querySelectorAll('[data-surface="Surface-Brightest"]')).toHaveLength(1);
  });
});

/* Selection escalates by ONE step from the group's own style:
 *
 *   outlined / light   `-outline`  ->  SOLID
 *   ghost              `ghost`     ->  `-outline`
 *
 * The ghost row is the one that changed. It used to fill on both: the child's
 * variant stayed 'ghost' while the group's own rules painted --Buttons-{C}-
 * Button at !important, so a selected ghost segment rendered as a solid fill
 * with no border — the loud treatment, in the group style chosen precisely
 * because the control should stay quiet.
 *
 * Asserted on the lib's own btn-* class, which names the variant that actually
 * painted. A bare /outline/ over the whole className matches MUI's internals.
 */
describe('selection escalates one step from the group style', () => {
  const libClass = (el) => (el.className || '').split(/\s+/).filter((c) => c.startsWith('btn-'));

  const segments = (container) =>
    Array.from(container.querySelectorAll('button'));

  /* emotion runs in speedy mode — the <style> nodes are empty and only
     cssRules carries the text. Match on the element's own generated class so
     a rule is attributed to the segment it actually styles. */
  const emotionCss = (el) => {
    const cls = (el.className || '').split(/\s+/).find((c) => c.startsWith('css-'));
    if (!cls) return '';
    return Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText)
      .join('\n');
  };

  test('an outlined group fills the selected segment', () => {
    const { container } = render(
      <ButtonGroup value="a" onChange={() => {}} aria-label="t">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>
    );
    const [selected, unselected] = segments(container);
    expect(libClass(selected)).toContain('btn-default');
    expect(libClass(unselected)).toContain('btn-default-outline');
  });

  test('a ghost group outlines it instead of filling it', () => {
    const { container } = render(
      <ButtonGroup variant="ghost" value="a" onChange={() => {}} aria-label="t">
        <Button value="a">A</Button>
        <Button value="b">B</Button>
      </ButtonGroup>
    );
    const [selected, unselected] = segments(container);
    expect(libClass(selected)).toContain('btn-default-outline');
    expect(libClass(selected)).not.toContain('btn-default');
    expect(libClass(unselected)).toContain('btn-ghost');

    /* The variant name alone is NOT enough, and asserting only that passed
       with the bug still in: `ghostSx` is spread after `selectedSx`, so an
       unscoped `border: none !important` erased the border while the class
       still said `-outline`. Assert the rule that actually reaches the
       element. */
    expect(emotionCss(selected)).not.toContain('border: none');
    expect(emotionCss(unselected)).toContain('border: none');
  });
});
