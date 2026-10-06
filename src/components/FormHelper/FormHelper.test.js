import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormHelper, FORM_HELPER_VALIDATIONS, useFormHelperIds } from './FormHelper';
import { InputMessage, INPUT_MESSAGE_TYPES } from '../InputMessage';

const cssFor = (el) => {
  const raw = el.getAttribute ? (el.getAttribute('class') || '') : '';
  const cls = raw.split(/\s+/).find((c) => c.startsWith('css-'));
  if (!cls) return '';
  return Array.from(document.styleSheets)
    .flatMap((s) => Array.from(s.cssRules || []))
    .filter((r) => (r.selectorText || '').includes('.' + cls))
    .map((r) => r.cssText).join('\n');
};

/* A THEMED ZONE, not a coloured box. Figma wraps each message in a
   Theme-{State} frame pinning Theme and Surface=Surface-Brightest and fills it
   with Background, so the cascade resolves the fill and the text rather than
   the chip picking them. Writing a literal fill would lock it to one tone and
   leave its text on the parent's. */
describe('InputMessage declares a zone rather than painting one', () => {
  test.each(INPUT_MESSAGE_TYPES)('%s sets data-theme and data-surface', (type) => {
    const { container } = render(<InputMessage type={type}>Message</InputMessage>);
    const chip = container.querySelector('.input-message');
    expect(chip).toHaveAttribute('data-theme', type[0].toUpperCase() + type.slice(1));
    expect(chip).toHaveAttribute('data-surface', 'Surface-Brightest');
  });

  test('fills from --Background, never a literal or a Surface token', () => {
    const { container } = render(<InputMessage type="error">Bad</InputMessage>);
    const css = cssFor(container.querySelector('.input-message'));
    expect(css).toContain('background-color: var(--Background)');
    expect(css).not.toContain('var(--Surface)');
    expect(css).not.toMatch(/background-color:\s*#/);
  });

  /* Text-{State} rather than --Text: those are contrast-checked for carrying a
     semantic meaning, not for being body copy. */
  test('the text takes the semantic token', () => {
    const { container } = render(<InputMessage type="warning">Careful</InputMessage>);
    /* Via Typography's `color` prop rather than an inline override — which
       is both the library's rule and the only thing that works, since
       Typography folds `style` into its own styling. */
    expect(cssFor(container.querySelector('.input-message-text')))
      .toContain('var(--Text-Warning)');
  });

  /* The message text IS the message, so a named icon beside it would announce
     the state twice. */
  test('the icon is decoration, and can be turned off', () => {
    const { container } = render(<InputMessage type="error">Bad</InputMessage>);
    expect(container.querySelector('svg')).toBeInTheDocument();
    const { container: bare } = render(
      <InputMessage type="error" withIcon={false}>Bad</InputMessage>);
    expect(bare.querySelector('svg')).toBeNull();
  });
});

describe('FormHelper', () => {
  test('renders nothing when there is nothing to say', () => {
    const { container } = render(<FormHelper />);
    expect(container.firstChild).toBeNull();
  });

  /* Helper is what is always true about the field; the message is what is true
     right now. Standing guidance before the exception. */
  test('helper comes before the message in the DOM', () => {
    const { container } = render(
      <FormHelper helperText="Between 8 and 64 characters"
                  validation="error" validationMessage="Too short" />);
    const kids = Array.from(container.querySelector('.form-helper').children);
    expect(kids[0]).toHaveClass('form-helper-text');
    expect(kids[1]).toHaveClass('input-message');
  });

  /* Two switches, not one axis: a field can have helper and no error, an error
     and no helper, both, or neither. */
  test('the two are independent', () => {
    const { rerender } = render(<FormHelper helperText="Help" />);
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.queryByText('Too short')).toBeNull();

    rerender(<FormHelper showHelper={false} validation="error" validationMessage="Too short" />);
    expect(screen.queryByText('Help')).toBeNull();
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  test.each(FORM_HELPER_VALIDATIONS.filter((v) => v !== 'none'))(
    '%s renders its message', (v) => {
      render(<FormHelper validation={v} validationMessage={'Said ' + v} />);
      expect(screen.getByText('Said ' + v)).toBeInTheDocument();
    });

  test('validation="none" shows no message even with text', () => {
    render(<FormHelper validation="none" validationMessage="unused" helperText="Help" />);
    expect(screen.queryByText('unused')).toBeNull();
  });
});

/* aria-describedby announces in the order the ATTRIBUTE lists, not the order
   things appear on screen — so the ids have to come back already ordered, or
   a screen reader reads the error before the guidance. */
describe('useFormHelperIds', () => {
  function Probe(props) {
    const { describedBy, helperId, messageId } = useFormHelperIds(props);
    return <i data-d={describedBy || ''} data-h={helperId || ''} data-m={messageId || ''} />;
  }

  test('lists helper first, then message', () => {
    const { container } = render(<Probe showHelper validation="error" />);
    const el = container.querySelector('i');
    const d = el.getAttribute('data-d');
    expect(d.split(' ')).toEqual([el.getAttribute('data-h'), el.getAttribute('data-m')]);
  });

  test('is undefined when there is nothing to describe', () => {
    const { container } = render(<Probe showHelper={false} validation="none" />);
    expect(container.querySelector('i').getAttribute('data-d')).toBe('');
  });
});
