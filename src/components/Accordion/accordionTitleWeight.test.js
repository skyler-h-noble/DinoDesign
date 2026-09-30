// src/components/Accordion/accordionTitleWeight.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Accordion, AccordionSummary, AccordionDetails } from './Accordion';

/**
 * The accordion title is the SEMIBOLD type step, not Body with a weight
 * painted on top.
 *
 * It used to render Body and override fontWeight: 600 inline. That looks
 * equivalent and is not: 600 is a literal, while the semibold style reads
 * var(--Body-Medium-Semibold-Font-Weight) — the same token Figma binds. A
 * brand whose semibold is 650 moved in the design file and stayed at 600 in
 * the build, with nothing to report it.
 *
 * Asserted on the CLASS rather than a computed weight: jsdom does not resolve
 * custom properties, so a getComputedStyle check would pass against any value
 * including none.
 */

const renderAt = (size) => render(
  <Accordion defaultExpanded>
    <AccordionSummary size={size}>Accordion title</AccordionSummary>
    <AccordionDetails size={size}>Accordion body</AccordionDetails>
  </Accordion>,
);

const classesOf = (el) => [...el.classList].filter((c) => c.startsWith('typography-'));

describe('the title takes the semibold step at every size', () => {
  for (const size of ['small', 'medium', 'large']) {
    it(`${size} renders a semibold style`, () => {
      const { container } = renderAt(size);
      const title = container.querySelector('.accordion-summary .typography');
      if (!title) throw new Error(`size="${size}" rendered no title typography`);
      const styled = classesOf(title).join(' ');
      if (!/semibold/.test(styled)) {
        throw new Error(`size="${size}" title is "${styled}" — expected a semibold step`);
      }
    });
  }

  it('does not paint the weight inline', () => {
    /* The override this replaced. An inline fontWeight on a lib component
       bypasses the type system, which is the rule CLAUDE.md states and which
       Menu already had removed for the same reason. */
    const { container } = renderAt('medium');
    const title = container.querySelector('.accordion-summary .typography');
    expect(title.getAttribute('style') || '').not.toMatch(/font-weight/i);
  });
});

describe('the body stays regular', () => {
  it('is not semibold — the two differ by weight alone', () => {
    /* In Figma both styles now share Other/Body-Font-Size and differ only in
       weight. If the body drifted to semibold too, the distinction between a
       title and its content would disappear at every size at once. */
    const { container } = renderAt('medium');
    const body = container.querySelector('.accordion-details .typography');
    if (!body) throw new Error('rendered no details typography');
    expect(classesOf(body).join(' ')).not.toMatch(/semibold/);
  });
});
