/**
 * Slider fill direction: `standard` | `inverted` | `false`.
 *
 * Figma folds this into the Slider's `Type` axis together with the thumb
 * count — single / single-inverted / double / double-inverted — because a
 * variant set needs one axis per property and "how many thumbs" is not a
 * property there. In code the thumb count already comes from `value` being an
 * array, so only the direction needs a prop.
 *
 * `fill` is the name, `standard` is the value, both matching Figma. `track`
 * is MUI's name for the same thing and keeps working, including `normal` —
 * the component wraps MUI, so a MUI-shaped call should not be a silent no-op.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Slider } from './Slider';

/* MUI marks all three cases on the ROOT, which is the only observable that
   distinguishes them without measuring geometry: trackInverted, trackFalse,
   or neither for the standard fill.
   `hasTrack` deliberately does NOT look for a `.MuiSlider-track` element —
   MUI renders that span in all three cases and hides it with
   `.MuiSlider-trackFalse .MuiSlider-track { display: none }`, so presence of
   the element says nothing about whether a fill is drawn. */
const rootOf = (c) => c.querySelector('.MuiSlider-root');
const isInverted = (c) => rootOf(c).className.includes('trackInverted');
const hasTrack = (c) => !rootOf(c).className.includes('trackFalse');

const renderSlider = (props) =>
  render(<Slider defaultValue={40} aria-label="t" {...props} />).container;

describe('Slider fill direction', () => {
  it('fills from the start by default', () => {
    expect(isInverted(renderSlider())).toBe(false);
    expect(hasTrack(renderSlider())).toBe(true);
  });

  it('accepts fill="standard" as the explicit form of the default', () => {
    expect(isInverted(renderSlider({ fill: 'standard' }))).toBe(false);
  });

  it('inverts on fill="inverted"', () => {
    expect(isInverted(renderSlider({ fill: 'inverted' }))).toBe(true);
  });

  it('draws no fill at all on fill={false}', () => {
    expect(hasTrack(renderSlider({ fill: false }))).toBe(false);
  });

  // --- MUI's name for the same prop ---

  it("still honours MUI's track='inverted'", () => {
    expect(isInverted(renderSlider({ track: 'inverted' }))).toBe(true);
  });

  it("treats MUI's 'normal' as standard rather than dropping it", () => {
    expect(isInverted(renderSlider({ track: 'normal' }))).toBe(false);
    expect(hasTrack(renderSlider({ track: 'normal' }))).toBe(true);
  });

  it('still honours track={false}', () => {
    expect(hasTrack(renderSlider({ track: false }))).toBe(false);
  });

  it('lets fill win when both are passed', () => {
    expect(isInverted(renderSlider({ fill: 'inverted', track: 'normal' }))).toBe(true);
    expect(isInverted(renderSlider({ fill: 'standard', track: 'inverted' }))).toBe(false);
  });

  // --- Range, which is the other half of Figma's Type axis ---

  it('inverts a range slider too — double-inverted in Figma', () => {
    const c = renderSlider({ value: [20, 80], fill: 'inverted' });
    expect(isInverted(c)).toBe(true);
    expect(c.querySelectorAll('.MuiSlider-thumb').length).toBe(2);
  });

  it('takes the thumb count from value, not from a Type prop', () => {
    expect(renderSlider({ value: [20, 80] })
      .querySelectorAll('.MuiSlider-thumb').length).toBe(2);
    expect(renderSlider()
      .querySelectorAll('.MuiSlider-thumb').length).toBe(1);
  });

  it('works vertically, which is Figma\'s separate Orientation axis', () => {
    const c = renderSlider({ orientation: 'vertical', fill: 'inverted' });
    expect(isInverted(c)).toBe(true);
    expect(rootOf(c).className).toMatch(/vertical/i);
  });
});
