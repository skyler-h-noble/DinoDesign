// @ts-nocheck
/* Checking is off here for the same reason as examples.js: the lib's
   components are plain JS, so their props are INFERRED from destructuring and
   anything without a default reads as required. Correct usage below would
   report as an error for that reason alone. */
/**
 * Per-prop samples: every value of every axis, laid out so the axis is
 * readable at a glance.
 *
 * The summary leads with ONE example, which answers "what is this". These
 * answer the next question — "what can it be" — and they are only useful if
 * they are COMPLETE. A sample showing four of nine colors reads as the
 * component having four, which is worse than no sample: a missing one sends
 * you to the prop values, and a partial one stops you looking.
 *
 * So the axis lists below are built from constants rather than typed out per
 * component. Hand-written lists are where a palette quietly loses `neutral`,
 * which is exactly what had happened to the FAB's color sample.
 *
 * Imported from each component's OWN module, never from '../components' — the
 * barrel re-exports the docs, so a barrel import closes a cycle that resolves
 * half-initialised and renders a blank page. See the note in examples.js.
 */
import React from 'react';
import { VStack, HStack } from '../components/Stack';
import { Caption } from '../components/Typography';
import { Divider } from '../components/Divider';

/* The eight accent palettes, in the order the design system lists them.
   `default` is handled separately everywhere — it is the answer to "what do I
   get if I pass nothing", and as one swatch among nine it is the hardest
   thing on the page to find. */
export const PALETTES = ['primary', 'secondary', 'tertiary', 'neutral',
                         'info', 'success', 'warning', 'error'];

/* Buttons has a tenth mode the Theme collection does not: black-white is
   reachable from code and not from Figma. Kept separate so a sample can be
   explicit about which list it is showing. */
export const BUTTON_ONLY = ['black-white'];

export const SIZES = ['small', 'medium', 'large'];

/** One labelled cell. */
/* One labelled cell. The label sits BELOW the thing it names, and the row
   bottom-aligns, so every label in an axis starts at the same y. */
export const Cell = ({ label, emphasis = false, width, children }) => (
  <VStack gap="var(--Sizing-Half)" style={{ alignItems: 'flex-start', width }}>
    <div>{children}</div>
    <Caption color={emphasis ? 'standard' : 'quiet'}>{label}</Caption>
  </VStack>
);

/**
 * Every value of one axis, labelled.
 *
 * `defaultValue` is pulled to the front and separated by a rule, so the
 * resting configuration is findable rather than being swatch number six.
 */
export const Axis = ({ values, render, defaultValue, width }) => {
  const rest = values.filter(v => v !== defaultValue);
  const cell = (v) => (
    <Cell key={String(v)} label={String(v)} emphasis={v === defaultValue} width={width}>
      {render(v)}
    </Cell>
  );
  return (
    /* BOTTOM-aligned, always, and no longer a prop.
       A size ramp has a different height in every cell, so a centred row put
       each label wherever its own glyph happened to end — seven labels on
       seven baselines, which reads as a list of unrelated things rather than
       one axis. Bottom-aligning lands every label's top at the same y.
       It was an `align` prop defaulting to flex-start, and callers showing a
       ramp passed "center" precisely because the row looked wrong — fixing
       the symptom one sample at a time while making the misalignment worse.
       Uniform-height axes are unaffected: with equal cells, bottom and top
       alignment are the same picture. */
    <HStack gap="var(--Sizing-2)" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {defaultValue !== undefined ? cell(defaultValue) : null}
      {/* `alignSelf: stretch` rather than MUI's `flexItem`.
          The lib's Divider is its own component with no such prop, and it
          spreads unknown props straight onto the DOM node — so `flexItem`
          reached the element and React warned on every render. The style is
          what flexItem does anyway: let the rule take the row's height. */}
      {defaultValue !== undefined && rest.length ? (
        <Divider orientation="vertical" style={{ alignSelf: 'stretch' }} />
      ) : null}
      {rest.map(cell)}
    </HStack>
  );
};

/** Stacked rather than side by side — for anything that wants the full width. */
export const AxisStack = ({ values, render, defaultValue, width = '100%' }) => {
  const ordered = defaultValue !== undefined
    ? [defaultValue, ...values.filter(v => v !== defaultValue)]
    : values;
  return (
    <VStack gap="var(--Sizing-2)" style={{ width: '100%', maxWidth: 420 }}>
      {ordered.map(v => (
        <VStack key={String(v)} gap="var(--Sizing-Half)" style={{ width }}>
          <Caption color={v === defaultValue ? 'standard' : 'quiet'}>{String(v)}</Caption>
          {render(v)}
        </VStack>
      ))}
    </VStack>
  );
};

/** Two states of one boolean, side by side — the point is the difference. */
export const Toggle = ({ render, offLabel = 'false', onLabel = 'true', width }) => (
  <HStack gap="var(--Sizing-2)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
    <Cell label={offLabel} emphasis width={width}>{render(false)}</Cell>
    <Cell label={onLabel} width={width}>{render(true)}</Cell>
  </HStack>
);
