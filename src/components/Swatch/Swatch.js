// src/components/Swatch/Swatch.js
//
// A colour chip, optionally labelled, optionally clickable.
//
// Built from the Figma Swatch set (9212:6816) rather than from the Button it
// used to be. It was `<Button swatch swatchColor={hex}>`, which never fitted:
// Button's two main axes are STYLE (solid / outline / ghost) and COLOUR (the
// nine palettes), and a swatch uses neither. Its colour is arbitrary data from
// a picker, not a palette choice, and "outline swatch" means nothing.
//
// Sizing follows the button ramp on purpose — the Figma swatch binds its width,
// height AND radius to Button/Button-Height — so a swatch lines up with the
// controls beside it and follows the device chain for free.
//
// The radius is the full height, so it is a CIRCLE. The old Button variant read
// --Button-Icon-Radius, which is why the studio reported swatches "staying
// square" when a brand set a large corner: that token is a percentage of a
// square's height and currently non-monotonic (12 / 32 / 28).
import React from 'react';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Radio } from '../Radio/Radio';

const SIZE_HEIGHT = {
  small:  'var(--Small-Button-Height, 24px)',
  medium: 'var(--Button-Height, 32px)',
  large:  'var(--Large-Button-Height, 56px)',
};

/* Selection is a CHECK ON ITS OWN DISC, not a ring.
 
   A ring was the first attempt and it did not work: the chip's own 1px Border
   and a 1px ring inset by 1px are adjacent and the same colour, so selected
   read as a 2px edge rather than a mark — and at 24px that is close to
   invisible.
 
   The disc is the part that matters. A check drawn straight onto the swatch
   would sit on an arbitrary colour, so its contrast could not be known in
   advance; the system has met this before on the Slider handle, where a known
   --Background ring is what makes the focus indicator measurable. Here the disc
   plays that role: the glyph is always on --Background, never on the colour, so
   no luminance has to be computed and the mark holds on any swatch.
 
   --Background and --Icon rather than white and a fixed grey: both follow the
   surface, so the pairing stays legible in dark mode. Figma draws the disc as a
   hardcoded white, which is the one value that cannot flip. */
const CHECK_DISC = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height: '50%',
  borderRadius: '50%',
  backgroundColor: 'var(--Background)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
};

const FOCUS_RING = {
  content: '""',
  position: 'absolute',
  inset: '-3px',
  borderRadius: '50%',
  border: '2px solid var(--Focus-Visible)',
  pointerEvents: 'none',
};

export function Swatch({
  color,
  label,
  size = 'medium',
  selected = false,
  disabled = false,
  /* Figma's Style axis: No-Radio | Radio.
 
     The two mark selection differently, and that is the point rather than an
     inconsistency. Without a radio, the chip itself carries the state and
     selection is the check on its disc. WITH one, every state is delegated to
     the radio — Figma pins State=Hover, State=Focus-Visible and
     Status=selected on the nested instance — so the chip stays a plain colour
     and the control says what is happening. Two marks for one state would be
     one too many.
 
     Radio has no `non-clickable`, which follows: a radio that cannot be chosen
     is not a radio — so a swatch with no onClick renders none, even with
     `radio` set. Figma simply does not draw that combination. */
  radio = false,
  onClick,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  /* Clickable is the PRESENCE of a handler, not a separate prop. Figma puts
     `non-clickable` on the same axis as the interaction states, which says the
     same thing: either it responds or it does not. */
  const clickable = Boolean(onClick) && !disabled;
  const dim = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;

  /* A colour alone is not a name. Where there is no visible label and the
     caller gave no aria-label, the colour value is a poor but honest last
     resort — better than announcing "button". */
  const accessibleName = ariaLabel || label || color;

  const chip = (
    <Box
      className="swatch-chip"
      sx={{
        position: 'relative',
        width: dim,
        height: dim,
        flexShrink: 0,
        borderRadius: '50%',
        backgroundColor: color,
        border: 'var(--Button-Border-Width, 1px) solid var(--Border)',
        boxSizing: 'border-box',
        boxShadow: 'var(--Effect-Level-0)',
        transition: 'box-shadow 120ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        ...(clickable && {
          cursor: 'pointer',
          /* The scrim is composited over the colour as a background LAYER, so
             it needs no extra element and cannot escape the circle.

             Figma draws it as a square overlay — radius 0 on a circular swatch,
             so its corners sit outside the chip — filled with hardcoded black at
             5% and 8%. Both are used here as --Hover and --Pressed instead:
             those are the surface-aware scrims the system already defines, and
             a fixed black tint does not work on a dark surface. The intent is
             the same; the Figma overlay wants its radius bound and its fill
             pointed at the token. */
          '&:hover': {
            boxShadow: 'var(--Effect-Level-1)',
            backgroundImage: 'linear-gradient(var(--Hover), var(--Hover))',
          },
          '&:active': {
            boxShadow: 'var(--Effect-Level-0)',
            backgroundImage: 'linear-gradient(var(--Pressed), var(--Pressed))',
          },
        }),
      }}
    >
      {selected && !radio ? (
        <Box className="swatch-check" sx={CHECK_DISC}>
          <CheckIcon
            aria-hidden="true"
            sx={{ width: '80%', height: '80%', color: 'var(--Icon, var(--Text))' }}
          />
        </Box>
      ) : null}
    </Box>
  );

  const Root = clickable ? 'button' : 'div';

  return (
    <Box
      component={Root}
      type={clickable ? 'button' : undefined}
      onClick={clickable ? onClick : undefined}
      disabled={clickable && disabled ? true : undefined}
      aria-pressed={clickable ? selected : undefined}
      aria-label={accessibleName}
      className={`swatch ${selected ? 'swatch-selected' : ''} ${className}`.trim()}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--Sizing-Half, 4px)',
        width: 'var(--Sizing-7, 56px)',
        padding: 0,
        background: 'none',
        border: 'none',
        font: 'inherit',
        color: 'var(--Text)',
        // 0.38 is what the Disabled variant carries in Figma.
        ...(disabled && { opacity: 0.38, pointerEvents: 'none' }),
        '&:focus': { outline: 'none' },
        ...(clickable && { '&:focus-visible': { outline: 'none', '& .swatch-chip::before': FOCUS_RING } }),
        ...sx,
      }}
      {...props}
    >
      {chip}
      {radio && clickable ? (
        /* Presentational: the whole swatch is the control, so the radio must
           not be a second tab stop or a second thing to announce. */
        <Radio
          checked={selected}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          onChange={() => {}}
          sx={{ pointerEvents: 'none' }}
        />
      ) : null}
      {label ? (
        <Box
          component="span"
          className="swatch-label"
          sx={{
            // The Legal type style, which is what the Figma label is bound to.
            fontFamily: 'var(--Legal-Font-Family, inherit)',
            fontSize: 'var(--Legal-Font-Size, 10px)',
            fontWeight: 'var(--Legal-Font-Weight, 400)',
            lineHeight: 'var(--Legal-Line-Height, 1.4)',
            letterSpacing: 'var(--Legal-Letter-Spacing, 0)',
            color: 'var(--Text)',
            textAlign: 'center',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Box>
      ) : null}
    </Box>
  );
}

export default Swatch;
