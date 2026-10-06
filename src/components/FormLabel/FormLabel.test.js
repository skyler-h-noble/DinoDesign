import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormLabel } from './FormLabel';

const cssFor = (el) => {
  const raw = el.getAttribute ? (el.getAttribute('class') || '') : '';
  const cls = raw.split(/\s+/).find((c) => c.startsWith('css-'));
  if (!cls) return '';
  return Array.from(document.styleSheets)
    .flatMap((s) => Array.from(s.cssRules || []))
    .filter((r) => (r.selectorText || '').includes('.' + cls))
    .map((r) => r.cssText).join('\n');
};

/* THE WHOLE REASON THIS COMPONENT EXISTS. Not one form component in the
   library read the Label type style — Input, Select and NumberField render
   labels through Body/BodySmall at a literal 13px, RadioGroup through MUI
   FormLabel with a hand-set weight. Figma binds Labels/Label-Font-Family and
   the Dynamic-Label ramp, so a brand re-picking its label scale moved every
   label in the design file and none here. */
describe('it reads the Label type style', () => {
  test('and not the Body ramp', () => {
    const { container } = render(<FormLabel htmlFor="x">Email</FormLabel>);
    const css = cssFor(container.querySelector('.form-label'));
    /* Label-Medium is the `label` textStyle's ramp. The point is that the SIZE
       and WEIGHT come from the Label scale — every other form component in
       this library reads Body/BodySmall, or a literal 13px. */
    expect(css).toContain('var(--Label-Medium-Font-Size)');
    expect(css).toContain('var(--Label-Medium-Font-Weight)');
    expect(css).not.toContain('--Body-Font-Size');
    expect(css).not.toContain('13px');
  });
});

describe('it associates with its control', () => {
  test('htmlFor lands on the label element', () => {
    render(<FormLabel htmlFor="email-1">Email</FormLabel>);
    expect(screen.getByText('Email').closest('label')).toHaveAttribute('for', 'email-1');
  });

  /* A <label> whose control is a SIBLING has no association, explicit or
     implicit — it announces as unlabelled while looking perfect. That exact
     bug shipped in Input, so this warns rather than failing silently. */
  test('warns when there is no htmlFor to associate with', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<FormLabel>Email</FormLabel>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no `htmlFor`'));
    warn.mockRestore();
  });

  /* A group names itself with a legend, not a label: "choose one" is a fact
     about the set rather than about any one control. */
  test('as="legend" renders a legend and takes no htmlFor', () => {
    const { container } = render(
      <fieldset><FormLabel as="legend">Delivery</FormLabel></fieldset>);
    const legend = container.querySelector('legend');
    expect(legend).toBeInTheDocument();
    expect(legend).not.toHaveAttribute('for');
  });
});

/* REQUIRED AND OPTIONAL ARE ANNOUNCED DIFFERENTLY, deliberately.
   `aria-required` on the control carries requiredness, so reading the marker
   too announces "Email star Required" as part of the name. There is no
   aria-optional, so that marker is the only way to convey it and must be
   read. */
describe('the markers', () => {
  test('required is shown but hidden from the accessible name', () => {
    render(<FormLabel htmlFor="x" type="required">Email</FormLabel>);
    const marker = screen.getByText(/Required/);
    expect(marker).toBeVisible();
    expect(marker).toHaveAttribute('aria-hidden', 'true');
  });

  test('optional is shown AND announced', () => {
    render(<FormLabel htmlFor="x" type="optional">Nickname</FormLabel>);
    const marker = screen.getByText(/Optional/);
    expect(marker).toBeVisible();
    expect(marker).not.toHaveAttribute('aria-hidden');
  });

  test('default shows neither', () => {
    render(<FormLabel htmlFor="x">Email</FormLabel>);
    expect(screen.queryByText(/Required/)).toBeNull();
    expect(screen.queryByText(/Optional/)).toBeNull();
  });
});

/* MORE INFO IS A SIBLING OF THE LABEL, NOT A CHILD. A <label> forwards clicks
   to its control, so a link inside one has two jobs on the same click — and
   everything inside a label joins the field's accessible name, so the field
   would announce as "Email More about this field". */
describe('the More Info affordance', () => {
  test('sits outside the label element', () => {
    const { container } = render(
      <FormLabel htmlFor="x" moreInfo={{ label: 'More about your email', href: '#' }}>
        Email
      </FormLabel>);
    const label = container.querySelector('label');
    expect(container.querySelector('.form-label-more-info')).toBeInTheDocument();
    expect(label.querySelector('.form-label-more-info')).toBeNull();
  });

  test('carries its own name, naming the field', () => {
    render(
      <FormLabel htmlFor="x" moreInfo={{ label: 'More about your email', href: '#' }}>
        Email
      </FormLabel>);
    expect(screen.getByLabelText('More about your email')).toBeInTheDocument();
  });

  /* Six fields each with "More information" gives a screen reader user six
     identical controls, so an unnamed one warns. */
  test('warns when it has no name', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<FormLabel htmlFor="x" moreInfo={{ href: '#' }}>Email</FormLabel>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('needs a `label`'));
    warn.mockRestore();
  });
});
