import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  /* The label and the control have to be ASSOCIATED, not merely stacked. The
     Field generates the id and hands the same one to both, so a consumer
     cannot forget. */
  test('the label names the textarea', () => {
    render(<TextAreaField label="Tell us about yourself" />);
    const field = screen.getByLabelText('Tell us about yourself');
    expect(field.tagName).toBe('TEXTAREA');
  });

  test('an explicit id wins over the generated one', () => {
    render(<TextAreaField id="bio" label="Bio" />);
    expect(screen.getByLabelText('Bio')).toHaveAttribute('id', 'bio');
  });

  /* ONE label. Input renders its own when given `label`, so passing it through
     would draw a second — and the one Input draws reads Body/BodySmall at a
     literal 13px rather than the Label type style. */
  test('renders exactly one label element', () => {
    const { container } = render(<TextAreaField label="Bio" />);
    expect(container.querySelectorAll('label')).toHaveLength(1);
  });

  /* Requiredness is announced by aria-required on the CONTROL. The marker
     beside the label is aria-hidden precisely so this is the single place a
     screen reader learns it — otherwise the field announces as "Bio star
     Required". */
  test('required sets aria-required on the control, not the marker', () => {
    render(<TextAreaField label="Bio" type="required" />);
    /* /Bio/ rather than 'Bio': the label's TEXT is "Bio * Required" even
       though its accessible NAME is just "Bio", because the marker is
       aria-hidden. getByLabelText matches the text. */
    expect(screen.getByLabelText(/Bio/)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText(/Required/)).toHaveAttribute('aria-hidden', 'true');
  });

  test('optional sets no aria-required', () => {
    render(<TextAreaField label="Bio" type="optional" />);
    expect(screen.getByLabelText(/Bio/)).not.toHaveAttribute('aria-required');
  });

  test('default sets neither', () => {
    render(<TextAreaField label="Bio" />);
    expect(screen.getByLabelText('Bio')).not.toHaveAttribute('aria-required');
    expect(screen.queryByText(/Required|Optional/)).toBeNull();
  });

  test('disabled reaches the control', () => {
    render(<TextAreaField label="Bio" disabled />);
    expect(screen.getByLabelText('Bio')).toBeDisabled();
  });

  test('moreInfo is reachable and names the field', () => {
    render(
      <TextAreaField label="Bio" moreInfo={{ label: 'More about your bio', href: '#' }} />);
    expect(screen.getByLabelText('More about your bio')).toBeInTheDocument();
  });

  /* A text area takes no other placement: floating has nowhere to float on a
     field whose value starts at the top and grows down, and left disconnects
     from a field four lines tall. A prop with one legal value is a question
     nobody should be asked, so there isn't one. */
  test('stacks the label above the control, always', () => {
    const { container } = render(<TextAreaField label="Bio" />);
    const root = container.querySelector('.textarea-field');
    const cls = (root.getAttribute('class') || '').split(/\s+/).find((c) => c.startsWith('css-'));
    const css = Array.from(document.styleSheets)
      .flatMap((s2) => Array.from(s2.cssRules || []))
      .filter((r) => (r.selectorText || '').includes('.' + cls))
      .map((r) => r.cssText).join('\n');
    expect(css).toContain('flex-direction: column');
    /* And the label comes first in the DOM, so reading order matches. */
    const kids = Array.from(root.children);
    expect(kids[0].querySelector('label')).toBeTruthy();
  });

  test('forwards the rest to the textarea', () => {
    render(<TextAreaField label="Bio" placeholder="My thoughts…" rows={6} />);
    const ta = screen.getByLabelText('Bio');
    expect(ta).toHaveAttribute('placeholder', 'My thoughts…');
    expect(ta).toHaveAttribute('rows', '6');
  });
});
