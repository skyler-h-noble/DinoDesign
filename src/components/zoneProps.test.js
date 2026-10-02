/**
 * Every component that offers colors accepts a ZONE.
 *
 * The rule: a component people can color must also take `theme` / `surface`,
 * so it can draw from the zone it sits in rather than only from a prop. The
 * attributes redefine --Background, --Text, --Border, --Quiet, --Hover and
 * --Pressed for everything inside, which is how a Slider's thumb recolors
 * without Slider.js knowing anything about themes.
 *
 * Asserted across components rather than inside each one, because the failure
 * is a component MISSING the pair — and a test that lives in the component
 * that doesn't have it is a test nobody writes.
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Slider } from './Slider/Slider';
import { Stepper } from './Stepper/Stepper';
import { Rating } from './Rating/Rating';
import { Radio } from './Radio/Radio';
import { Pagination } from './Pagination/Pagination';
import { Loader } from './Loader/Loader';
import { TransferList } from './TransferList/TransferList';

const CASES = [
  ['Slider', (p) => <Slider {...p} />],
  ['Stepper', (p) => <Stepper steps={[{ label: 'A' }, { label: 'B' }]} activeStep={0} {...p} />],
  ['Rating', (p) => <Rating value={3} {...p} />],
  ['Radio', (p) => <Radio value="a" {...p} />],
  ['Pagination', (p) => <Pagination count={3} page={1} {...p} />],
  ['Loader', (p) => <Loader {...p} />],
  ['TransferList', (p) => <TransferList left={[]} right={[]} {...p} />],
];

describe.each(CASES)('%s accepts a zone', (name, renderEl) => {
  it('puts theme and surface on an element', () => {
    const { container } = render(renderEl({ theme: 'Success', surface: 'Surface-Brightest' }));
    /* Jest's expect takes no message argument, so the component name goes in
       the test title (describe.each) rather than the assertion. */
    const themed = container.querySelector('[data-theme="Success"]');
    expect(themed).toBeInTheDocument();
    expect(themed.getAttribute('data-surface')).toBe('Surface-Brightest');
  });

  it('INHERITS when no zone is passed', () => {
    /* The attribute must be absent, not empty. `data-theme=""` matches
       [data-theme] selectors and pins the component to a zone that defines
       nothing, which paints worse than inheriting — and looks like a theming
       bug rather than a missing prop. */
    const { container } = render(renderEl({}));
    expect(container.querySelector('[data-theme=""]')).toBeNull();
    expect(container.querySelector('[data-surface=""]')).toBeNull();
  });
});
