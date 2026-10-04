// @ts-nocheck
/**
 * Slider — every axis.
 *
 * Its doc listed variant, size, value, min, max and the two handlers and
 * stopped, so the five axes that most change how a slider looks — fill
 * direction, orientation, marks, the step, the value label — were
 * undocumented and unillustrated.
 */
import React from 'react';
import { Slider } from '../components/Slider';
import { VStack, HStack } from '../components/Stack';
import { Caption, BodySmall } from '../components/Typography';
import { PALETTES, SIZES, Axis, AxisStack, Toggle, Cell } from './samples';

/* A slider has no intrinsic width, so every sample has to give it one or the
   track collapses and the sample shows nothing. */
const W = 180;
const box = (children, width = W) => <div style={{ width }}>{children}</div>;

export const SLIDER_SAMPLES = {
  /* All nine palettes. The thumb, both rail edges and the marks move with the
     fill — that is the point of showing a whole slider per colour rather than
     a swatch: a coloured slider is coloured throughout. */
  variant: () => (
    <Axis
      values={['default', ...PALETTES]}
      defaultValue="default"
      width={W}
      render={(v) => box(<Slider variant={v} defaultValue={60} aria-label={v} />)}
    />
  ),

  /* 12 / 16 / 20px of VISUAL height. The thumb stays 24x24 at all three for
     the WCAG 2.2 target size, so what changes is the dot and the track, not
     the hit area — which is why they line up rather than growing together. */
  size: () => (
    <Axis
      values={SIZES}
      defaultValue="medium"
      width={W}
      render={(v) => box(<Slider size={v} defaultValue={60} aria-label={v} />)}
    />
  ),

  /* An ARRAY is the whole switch. There is no `range` prop, because Figma
     folds the thumb count into its Type axis (single / double) and code
     already carries it in the value. */
  'value / defaultValue': () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">a number — one thumb</Caption>
        {box(<Slider defaultValue={60} aria-label="single" />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">an array — two thumbs, a range</Caption>
        {box(<Slider defaultValue={[25, 75]} getAriaLabel={() => 'range'} />)}
      </VStack>
    </VStack>
  ),

  /* Figma's Type axis is these two crossed with the thumb count — single,
     single-inverted, double, double-inverted — so all four are shown. The
     fourth value, `false`, draws no fill at all and is MUI's, with no
     counterpart in the design. */
  fill: () => (
    <VStack gap="var(--Sizing-3)">
      <VStack gap="var(--Sizing-1)">
        <Caption color="standard">one thumb — Figma: single / single-inverted</Caption>
        <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap' }}>
          <Cell label="standard" emphasis width={W}>
            {box(<Slider defaultValue={60} aria-label="standard" />)}
          </Cell>
          <Cell label="inverted" width={W}>
            {box(<Slider defaultValue={60} fill="inverted" aria-label="inverted" />)}
          </Cell>
          <Cell label="false — no fill" width={W}>
            {box(<Slider defaultValue={60} fill={false} aria-label="no fill" />)}
          </Cell>
        </HStack>
      </VStack>
      <VStack gap="var(--Sizing-1)">
        <Caption color="quiet">two thumbs — Figma: double / double-inverted</Caption>
        <HStack gap="var(--Sizing-2)" style={{ flexWrap: 'wrap' }}>
          <Cell label="standard — fills between" width={W}>
            {box(<Slider defaultValue={[25, 75]} getAriaLabel={() => 'between'} />)}
          </Cell>
          <Cell label="inverted — fills outside" width={W}>
            {box(<Slider defaultValue={[25, 75]} fill="inverted" getAriaLabel={() => 'outside'} />)}
          </Cell>
        </HStack>
      </VStack>
    </VStack>
  ),

  /* A vertical slider has NO intrinsic height — it needs one from its
     container or it collapses the same way a horizontal one does without a
     width. Shown with a range too, because the two axes combine freely. */
  orientation: () => (
    <HStack gap="var(--Sizing-4)" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Cell label="horizontal" emphasis width={W}>
        {box(<Slider defaultValue={60} aria-label="horizontal" />)}
      </Cell>
      <Cell label="vertical" width={60}>
        <div style={{ height: 160 }}>
          <Slider orientation="vertical" defaultValue={60} aria-label="vertical" />
        </div>
      </Cell>
      <Cell label="vertical range" width={60}>
        <div style={{ height: 160 }}>
          <Slider orientation="vertical" defaultValue={[25, 75]}
                  getAriaLabel={() => 'vertical range'} />
        </div>
      </Cell>
      <Cell label="vertical, inverted" width={60}>
        <div style={{ height: 160 }}>
          <Slider orientation="vertical" fill="inverted" defaultValue={60}
                  aria-label="vertical inverted" />
        </div>
      </Cell>
    </HStack>
  ),

  /* Marks are 2px round dots, and they FLIP colour where the fill passes
     them — --Quiet on the bare rail, --Background on the filled part — so
     they stay legible on both sides of the thumb instead of disappearing
     into a saturated fill. */
  marks: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 420 }}>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">false — no marks</Caption>
        {box(<Slider defaultValue={60} aria-label="none" />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">true — a dot at every step</Caption>
        {box(<Slider defaultValue={60} step={10} marks aria-label="every step" />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">an array — dots where you say, with labels</Caption>
        {box(<Slider
          defaultValue={60}
          marks={[{ value: 0, label: '0' }, { value: 50, label: '50' },
                  { value: 100, label: '100' }]}
          aria-label="labelled marks" />, 260)}
      </VStack>
    </VStack>
  ),

  /* RESTRICTED VALUES. `step={null}` means "no even increment", so the thumb
     can only land on the marks — which is why it needs an explicit array and
     warns if given `marks={true}`: there would be nothing to snap to. */
  step: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 420 }}>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="standard">1 — every whole number</Caption>
        {box(<Slider defaultValue={60} aria-label="step 1" />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">25 — a fixed increment</Caption>
        {box(<Slider defaultValue={50} step={25} marks aria-label="step 25" />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">null — restricted to the marks, which need not be even</Caption>
        {box(<Slider
          defaultValue={40}
          step={null}
          marks={[{ value: 0, label: '0' }, { value: 10, label: '10' },
                  { value: 40, label: '40' }, { value: 100, label: '100' }]}
          aria-label="restricted" />, 260)}
      </VStack>
    </VStack>
  ),

  /* The bubble's ground is --Text with --Background text: the surface pair
     INVERTED, which is legible on any surface by definition. A palette colour
     would not be — the bubble floats over whatever happens to be under the
     thumb. `auto` is the one worth using; it appears on hover AND focus, so
     it is reachable by keyboard. */
  valueLabelDisplay: () => (
    <Axis
      values={['off', 'auto', 'on']}
      defaultValue="off"
      width={W}
      render={(v) => box(<Slider valueLabelDisplay={v} defaultValue={60} aria-label={v} />)}
    />
  ),

  label: () => (
    <VStack gap="var(--Sizing-3)" style={{ width: '100%', maxWidth: 420 }}>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">with a visible label</Caption>
        {box(<Slider label="Volume" defaultValue={60} />)}
      </VStack>
      <VStack gap="var(--Sizing-Half)">
        <Caption color="quiet">without one it needs aria-label</Caption>
        {box(<Slider defaultValue={60} aria-label="Volume" />)}
      </VStack>
      <BodySmall color="quiet">
        A RANGE slider needs `getAriaLabel` instead of either — one name per
        thumb. MUI warns in development if it is given `aria-label`.
      </BodySmall>
    </VStack>
  ),

  disabled: () => (
    <Toggle
      width={W}
      offLabel="enabled"
      onLabel="disabled"
      render={(on) => box(<Slider disabled={on} defaultValue={60} aria-label="x" />)}
    />
  ),
};
