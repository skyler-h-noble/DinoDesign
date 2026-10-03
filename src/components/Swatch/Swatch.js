// src/components/Swatch/Swatch.js
//
// A color chip, optionally labelled, optionally clickable.
//
// Built from the Figma Swatch set (9212:6816) rather than from the Button it
// used to be. It was `<Button swatch swatchColor={hex}>`, which never fitted:
// Button's two main axes are STYLE (solid / outline / ghost) and COLOUR (the
// nine palettes), and a swatch uses neither. Its color is arbitrary data from
// a picker, not a palette choice, and "outline swatch" means nothing.
//
// Sizing follows the button ramp on purpose — the Figma swatch binds its width,
// height AND radius to Button/Button-Height — so a swatch lines up with the
// controls beside it and follows the device chain for free.
//
// It is a ROUNDED SQUARE, not a circle. Figma binds the chip's width and height
// to Button/Button-Height and its radius to Button/Button-Radius — two separate
// tokens, and the radius is a flat 2 at every size.
//
// This comment previously said the radius was bound to Button-Height too, so
// "the radius is the full height, so it is a CIRCLE". That binding does not
// exist, and the circle was derived from it rather than from the design. A
// stated binding is worth checking against the file precisely because everything
// downstream follows it without re-deriving: the focus ring was drawn at 50% to
// match a circle that should never have been round.
//
// The old Button variant read --Button-Icon-Radius, which is why the studio
// reported swatches "staying square" when a brand set a large corner: that token
// is a percentage of a square's height and currently non-monotonic (12 / 32 /
// 28). --Button-Radius has no such problem — it is pixels, and the same value
// the buttons beside it use.
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
   and a 1px ring inset by 1px are adjacent and the same color, so selected
   read as a 2px edge rather than a mark — and at 24px that is close to
   invisible.
 
   The disc is the part that matters. A check drawn straight onto the swatch
   would sit on an arbitrary color, so its contrast could not be known in
   advance; the system has met this before on the Slider handle, where a known
   --Background ring is what makes the focus indicator measurable. Here the disc
   plays that role: the glyph is always on --Background, never on the color, so
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

/* The ring sits 3px outside the chip and takes its own radius token rather than
   the chip's. Figma binds it to Button-Focus-Radius (5) while the chip is
   Button-Radius (2), and the 3px gap is exactly the difference — an offset ring
   has to be rounder than what it surrounds or the corners pinch. */
const FOCUS_RING = {
  content: '""',
  position: 'absolute',
  inset: '-3px',
  borderRadius: 'var(--Button-Focus-Radius, 5px)',
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
     Status=selected on the nested instance — so the chip stays a plain color
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

  /* A color alone is not a name. Where there is no visible label and the
     caller gave no aria-label, the color value is a poor but honest last
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
        borderRadius: 'var(--Button-Radius, 2px)',
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
          /* The scrim is composited over the color as a background LAYER, so
             it needs no extra element and cannot escape the chip.

             TRANSLUCENT BLACK, not --Hover / --Pressed. This used those tokens
             on the reasoning that they are "the surface-aware scrims the system
             already defines, and a fixed black tint does not work on a dark
             surface". The first half of that is false and it takes the second
             half with it: --Hover and --Pressed are OPAQUE surface tones —
             activeAndHoverFor() walks the palette and returns hex — so
             linear-gradient(var(--Hover), var(--Hover)) painted a solid layer
             straight over the chip. Hovering a swatch replaced the colour with
             the page's hover tone, which on a light brand is near-white: the
             one thing a colour chip must never do is stop showing its colour.

             Figma's values, read off the Swatch set (9212:6816): a black
             overlay at 5% on Hover and 8% on Pressed, over the Color Swatch
             fill. Those are used verbatim.

             The dark-surface objection does not apply here and that is why the
             design says black. A chip's fill is arbitrary USER data, not a
             theme token — there is no surface to be aware of, and darkening any
             colour by 5% reads as pressed-ness on all of them. A surface-aware
             token is the right instinct for a themed element and the wrong one
             for a swatch. */
          '&:hover': {
            boxShadow: 'var(--Effect-Level-1)',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))',
          },
          '&:active': {
            boxShadow: 'var(--Effect-Level-0)',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08))',
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
