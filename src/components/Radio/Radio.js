// src/components/Radio/Radio.js
import React, { useState } from 'react';
import {
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from '@mui/material';
import { BodyLarge, Body, BodySmall } from '../Typography';
import { tokenSegment } from '../_shadows';

/**
 * Radio Component
 *
 * Single style (no outline/light split). Color drives the ring + dot.
 *
 * GEOMETRY (Figma-aligned):
 *   small  — parent 24×24, outer ring 16×16, inner dot 8×8,    BodySmall label, 4px gap
 *   medium — parent 24×24, outer ring 20×20, inner dot 9.5×9.5, Body label,      8px gap
 *   large  — parent 24×24, outer ring 24×24, inner dot 9.5×9.5, BodyLarge label, 12px gap
 *
 * COLORS: default | primary | secondary | tertiary | neutral |
 *         info | success | warning | error
 *
 * ACCESSIBILITY:
 *   - aria-label / aria-labelledby forwarded to <input> per WCAG 1.3.1
 *   - Without a visible label prop, always provide aria-label
 *   - Use RadioGroup with a label for grouped radio buttons
 */

// black-white matches Button and Checkbox. It capitalises to `Black-white`,
// which is not a token — the system emits --Buttons-BlackWhite-*, so the name
// goes through the shared tokenSegment mapping rather than cap().
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'black-white'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seg = tokenSegment;

// --- Sizing ------------------------------------------------------------------
// touchTarget is the 24×24 parent container; box is the outer ring; dot is the
// inner filled circle when checked. Padding between target and ring is derived.

const SIZE_MAP = {
/* Radio/Radio and Radio/Dot from Figma's Component-Size collection. The dot was
   9.5 at medium and large, where the design says 10 and 12.
 
   9.5 is also why it looked off-centre rather than merely small: the ring is
   20px with a 2px border, so a 9.5px dot centres at 3.25px — a subpixel offset
   the browser rounds per axis, and it lands visibly off. 10 in 20 is 5 either
   side, which is what Figma draws (Dot at x=5, y=5). Whole pixels centre; halves
   do not. Large was wrong by 2.5px on top of that. */
  small:  { touchTarget: 24, box: 16, dot: 8,  gap: 4,  LabelComp: BodySmall },
  medium: { touchTarget: 24, box: 20, dot: 10, gap: 8,  LabelComp: Body },
  large:  { touchTarget: 24, box: 24, dot: 12, gap: 12, LabelComp: BodyLarge },
};

// --- Custom Radio Icons ------------------------------------------------------

function RadioCircleIcon({ size, color, checked }) {
  const C = seg(color);
  // Matches Checkbox: the DEFAULT color draws its ring in --Quiet so an
  // unselected radio reads as a quiet affordance rather than a button. The dot
  // keeps the button token, so selecting one is what brings in the brand
  // color. --Quiet is tuned to 4.5:1 on its surface, past the 3:1 a control
  // outline requires.
  const ringColor = C === 'Default' ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';
  const dotColor = 'var(--Buttons-' + C + '-Border)';
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <Box
      className="radio-circle-icon"
      sx={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        boxSizing: 'border-box',
        borderRadius: '50%',
        border: '2px solid ' + ringColor,
        flexShrink: 0,
        backgroundColor: 'var(--Background)',
        /* The dot is centred by POSITION, not by flex.
           Flex centring inside a bordered circle depends on the browser
           resolving the content box the same way the border is painted, and
           the two round independently — which leaves the dot a sub-pixel off
           and visibly so on a 10px dot inside a 20px ring. `overflow: hidden`
           then clipped the low side of that offset, so the dot read as
           both off-centre and slightly out of round.
           Half the box, less half the dot, applied as a transform: there is no
           content box in that sum, so nothing can disagree about where the
           middle is. */
        position: 'relative',
        transition: 'border-color 0.15s ease-in-out',
      }}
    >
      {checked && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: sizeConfig.dot,
            height: sizeConfig.dot,
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
      )}
    </Box>
  );
}

// --- Radio Component ---------------------------------------------------------

/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside, so the component takes its colors from the zone it sits
 * in rather than from a prop.
 *
 * Deliberately NOT derived from `color`. The two are different knobs: `color`
 * chooses which PALETTE a filled part draws from, while `theme` moves the whole
 * surface — including the parts that carry a contrast requirement and therefore
 * have to stay on zone tokens. Folding one into the other would make a palette
 * choice silently restyle the contrast-bearing parts too.
 *
 * Both undefined when not passed, so the component INHERITS its ancestor's
 * zone. An empty string would match [data-theme] selectors and pin it to
 * nothing, which is worse than absent. */
export function Radio({
  theme,
  surface,
  color = 'primary',
  size = 'medium',
  label,
  // 'end'    — label to the right of the radio (default)
  // 'bottom' — label below the radio (matches the "vertical" Figma layout)
  // 'top' / 'start' also accepted (forwarded to MUI FormControlLabel)
  labelPlacement = 'end',
  checked,
  disabled = false,
  onChange,
  name,
  value,
  className = '',
  sx = {},
  // Extract aria props explicitly so they go to <input> not the outer <span>
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  ...props
}) {
  const effectiveColor = COLORS.includes(color) ? color : 'primary';
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = sizeConfig.LabelComp;
  // Inset between the 24×24 parent and the outer ring. Comes out to:
  //   small  → 4px (24-16)/2
  //   medium → 2px (24-20)/2
  //   large  → 0px (24-24)/2
  const inset = (sizeConfig.touchTarget - sizeConfig.box) / 2;

  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };

  const radioElement = (
    <MuiRadio
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      name={name}
      value={value}
      icon={<RadioCircleIcon size={size} color={effectiveColor} checked={false} />}
      checkedIcon={<RadioCircleIcon size={size} color={effectiveColor} checked={true} />}
      data-theme={theme || undefined}
      data-surface={surface || undefined}
      className={'radio-' + effectiveColor + ' ' + className}
      inputProps={mergedInputProps}
      disableRipple
      sx={{
        padding: inset + 'px',
        width: sizeConfig.touchTarget,
        height: sizeConfig.touchTarget,
        minWidth: sizeConfig.touchTarget,
        minHeight: sizeConfig.touchTarget,
        boxSizing: 'border-box',
        borderRadius: '50%',
        color: 'inherit',
        transition: 'background-color 0.15s ease-in-out',
        '&.Mui-checked': { color: 'inherit' },
        /* Same as Checkbox: the ripple halo is suppressed and the ring takes
           the state instead, so the dot stays the one thing that means
           "selected". */
        '&:hover': { backgroundColor: 'transparent' },
        '&:hover .radio-circle-icon': { borderColor: 'var(--Text)' },
        '&:active .radio-circle-icon': { borderColor: 'var(--Text)', backgroundColor: 'var(--Pressed)' },
        '&.Mui-disabled .radio-circle-icon': { opacity: 'var(--Disabled, 0.38)' },
        '&.Mui-focusVisible .radio-circle-icon': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
        '&.Mui-disabled': {
          opacity: 'var(--Disabled, 0.38)',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        ...sx,
      }}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={radioElement}
        label={
          <LabelComp
            component="span"
            sx={{
              color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
              lineHeight: 1.4,
              userSelect: 'none',
            }}
          >
            {label}
          </LabelComp>
        }
        labelPlacement={labelPlacement}
        disabled={disabled}
        sx={{
          marginLeft: 0,
          marginRight: 0,
          gap: sizeConfig.gap + 'px',
          // alignItems: 'center' works for both end/start (cross-axis is
          // vertical) and top/bottom (cross-axis is horizontal) — the radio
          // sits centered relative to the label either way.
          alignItems: 'center',
          '&.Mui-disabled .MuiTypography-root': {
            color: 'var(--Text-Quiet)',
            opacity: 0.6,
          },
        }}
      />
    );
  }

  return radioElement;
}

// --- RadioGroup Component ----------------------------------------------------

export function RadioGroup({
  color = 'primary',
  size = 'medium',
  label,
  options = [],
  value,
  /* UNCONTROLLED MODE, which this did not have. Every other input in the
     library takes one, the docs assumed it worked, and two lead examples
     passed `defaultValue` that went nowhere — so both rendered a group with
     nothing selected and looked like the component could not hold a choice.
     An ignored prop is worse than a missing one: nothing warns, and the page
     is simply wrong. */
  defaultValue,
  onChange,
  orientation = 'vertical',
  // Threaded to each child Radio. See Radio() for accepted values.
  labelPlacement = 'end',
  disabled = false,
  spacing = 1,
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) {
  /* Controlled the moment `value` is passed, and not before. Reading
     `value !== undefined` once keeps a group that starts empty and is later
     given a value from flipping modes mid-life without saying so. */
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = isControlled ? value : innerValue;

  const handleChange = (event, next) => {
    if (!isControlled) setInnerValue(event?.target?.value ?? next);
    onChange?.(event, next);
  };

  return (
    <FormControl
      component="fieldset"
      disabled={disabled}
      className={'radio-group-' + color + ' ' + className}
      sx={sx}
    >
      {label && (
        <FormLabel
          component="legend"
          sx={{
            color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
            fontSize: size === 'small' ? '13px' : '15px',
            fontWeight: 500,
            mb: 1,
            '&.Mui-focused': { color: 'var(--Text)' },
            '&.Mui-disabled': { color: 'var(--Text-Quiet)', opacity: 'var(--Disabled, 0.38)' },
          }}
        >
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup
        value={current ?? ''}
        onChange={handleChange}
        name={name}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        row={orientation === 'horizontal'}
        sx={{
          // Explicit flex-direction so the layout flips even when sx ends up
          // winning over MUI's `row` prop in the cascade. Wrap keeps long
          // horizontal groups from overflowing.
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
          gap: spacing,
        }}
        {...props}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            color={color}
            size={size}
            label={option.label}
            labelPlacement={labelPlacement}
            value={option.value}
            disabled={option.disabled || disabled}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}

// --- Legacy / Convenience Aliases --------------------------------------------

// `RadioInput` is the historic export name — kept so older consumers don't
// break when the variant prop was removed.
export const RadioInput = Radio;

export default Radio;
