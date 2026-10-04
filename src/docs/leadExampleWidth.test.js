/**
 * The lead example gets a width to live in.
 *
 * Third time for this bug, which is the reason it now has a test. Slider,
 * Input, Select, TextField and Table are all `width: 100%` components: give
 * them a parent whose width comes from its content and they collapse to
 * nothing, and Slider collapses to a single visible dot — the only one of them
 * that looks obviously broken rather than merely narrow.
 *
 * The chain is PreviewSurface (centring flex) -> spacer -> capped box. The
 * first two fixes corrected the capped box, which was already right; the
 * spacer in between was the flex item with no width, and `100%` of a
 * content-sized parent is content-sized.
 *
 * Asserted on the declared width rather than a measured one, because jsdom
 * does no layout — so this catches the declaration going missing, which is
 * exactly how it went missing three times.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { DocSummary } from './DocPanels';

/* Slider is the real case: a component with a lead example, whose example is
   the one that collapses. Rendering the real page beats a stub, because the
   thing under test is the WRAPPER CHAIN this page builds, and a stub could
   only test a chain the test wrote itself. */
test('the example slot claims a width at every level', () => {
  const { container } = render(
    <DocSummary component="Slider" theme={null} surface="Surface" />,
  );

  const ex = container.querySelector('.MuiSlider-root');
  expect(ex).toBeTruthy();

  /* Walk from the example up to the surface. Every box in between has to
     declare a width, or the one below it has nothing to be a percentage of. */
  /* The two boxes BETWEEN the example and the surface. PreviewSurface itself
     is excluded on purpose: it is a block-level flex container, so it fills
     its parent without declaring anything, and asserting a width on it would
     be asserting a thing that does not need to be true. */
  const chain = [ex.parentElement, ex.parentElement.parentElement];

  for (const el of chain) {
    const w = window.getComputedStyle(el).width;
    expect(w === '100%' || /^\d/.test(w)).toBe(true);
  }
});
