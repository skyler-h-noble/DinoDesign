// src/components/Swatch/Swatch.js
//
// A color chip, optionally labelled, optionally clickable.
//
// Built from the Figma Swatch set (9212:6816) rather than from the Button it
// used to be. It was `<Button swatch swatchColor={hex}>`, which never fitted:
// Button's two main axes are STYLE (solid / outline / ghost) and COLOR (the
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
import CheckIcon from '@omni-design/icons/Check';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('Swatch');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

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
const CHECK_DISC = 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);'
  /* A fixed circle, not a share of the chip: at 50% x 50% a Fit=Fill chip
     (54 x 32) stretched the disc into a 27 x 16 ellipse. Figma binds the check
     to Icon-Size in the `in-check` mode, which aliases Checkbox/Checkbox-Icon —
     14 / 12 / 18 by component size, the same glyph the checkbox draws. */
  + 'width:var(--Checkbox-Icon, 14px);height:var(--Checkbox-Icon, 14px);border-radius:50%;'
  + 'background-color:var(--Background);display:flex;align-items:center;justify-content:center;pointer-events:none';

/* The ring sits 3px outside the chip and takes its own radius token rather than
   the chip's. Figma binds it to Button-Focus-Radius (5) while the chip is
   Button-Radius (2), and the 3px gap is exactly the difference — an offset ring
   has to be rounder than what it surrounds or the corners pinch. */
const FOCUS_RING = 'content:"";position:absolute;'
  /* -3px from the chip's OUTER edge, as Figma draws it (a 2px OUTSIDE stroke
     on a frame 1px outside the chip). An absolute child measures inset from
     the padding box, inside the chip's own border, so -3px alone landed the
     ring a border-width short: 58px across on a 54px chip, not 60. */
  + 'inset:calc(-3px - var(--Button-Border-Width, 1px));border-radius:var(--Button-Focus-Radius, 5px);'
  + 'border:2px solid var(--Focus-Visible);pointer-events:none';

/* The static sheet. The chip's color is the one per-instance value, a custom
   property on the chip (--_sw-c); size, fit and the states are classes.

   The scrim is composited over the color as a background LAYER, so it needs
   no extra element and cannot escape the chip.

   TRANSLUCENT BLACK, not --Hover / --Pressed. This used those tokens on the
   reasoning that they are "the surface-aware scrims the system already
   defines, and a fixed black tint does not work on a dark surface". The first
   half of that is false and it takes the second half with it: --Hover and
   --Pressed are OPAQUE surface tones — activeAndHoverFor() walks the palette
   and returns hex — so linear-gradient(var(--Hover), var(--Hover)) painted a
   solid layer straight over the chip. Hovering a swatch replaced the color
   with the page's hover tone, which on a light brand is near-white: the one
   thing a color chip must never do is stop showing its color.

   Figma's values, read off the Swatch set (9212:6816): a black overlay at 5%
   on Hover and 8% on Pressed, over the Color Swatch fill. Those are used
   verbatim. A chip's fill is arbitrary USER data, not a theme token — there is
   no surface to be aware of, and darkening any color by 5% reads as
   pressed-ness on all of them.

   No shadow change on hover: every State in the Figma set carries the same
   Buttons effect, so hover is the scrim alone.

   THE RADIO. Figma's Style = Radio nests a radio that only REPORTS the state:
   the whole swatch is the control, so the radio is presentational — hidden
   from assistive tech, out of the tab order, and given no pointer events. It
   was the library's Radio (an MUI Radio inside); it is drawn here as the same
   markup — the radio input and the Radio's ring and dot, at medium size in the
   Default palette — so a swatch does not pull in MUI for a picture of a radio.
   Because it takes no pointer events and never takes focus, the Radio's
   hover, pressed and focus rings could never show here; only rest, checked
   and disabled are drawn. */
const RADIO_EDGE = 'var(--Buttons-Default-Border)';
registerBoxStyles('omni-swatch', [
  '.omni-swatch{position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:var(--Sizing-Half, 4px);'
    + 'width:var(--Sizing-7, 56px);padding:0;background:none;border:none;font:inherit;color:var(--Text)}',
  /* Fit=Fill hands the width to the layout, the root as well as the chip: a
     fixed 56px root left a Fill swatch 2px wider than its 54px slot. */
  '.omni-swatch-fit-fill{width:100%}',
  // 0.38 is what the Disabled variant carries in Figma.
  '.omni-swatch-off{opacity:0.38;pointer-events:none}',
  '.omni-swatch:focus{outline:none}',
  '.omni-swatch-click:focus-visible{outline:none}',
  '.omni-swatch-click:focus-visible .swatch-chip::before{' + FOCUS_RING + '}',
  '.omni-swatch-chip{position:relative;width:var(--_sw-d);height:var(--_sw-d);flex-shrink:0;border-radius:var(--Button-Radius, 2px);'
    /* Only a swatch you can click draws a border. Figma's Non-clickable
       variant has none: the border is a control's edge, and a display chip is
       just the color. border-box keeps both the same size. */
    + 'background-color:var(--_sw-c);border:none;box-sizing:border-box;box-shadow:var(--Effect-Level-0);'
    + 'transition:box-shadow 120ms ease;display:flex;align-items:center;justify-content:center}',
  ...Object.entries(SIZE_HEIGHT).map(([k, v]) => `.omni-swatch-chip-${k}{--_sw-d:${v}}`),
  '.omni-swatch-chip-fill{width:100%}',
  '.omni-swatch-chip-edge{border:var(--Button-Border-Width, 1px) solid var(--Border)}',
  '.omni-swatch-chip-click{cursor:pointer}',
  '.omni-swatch-chip-click:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))}',
  '.omni-swatch-chip-click:active{background-image:linear-gradient(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08))}',
  '.omni-swatch-check{' + CHECK_DISC + '}',
  /* The Radio, at rest: MUI's ButtonBase + SwitchBase reset, then the
     library Radio's own rules (2px hugging a Sizing-3 target, round). */
  '.omni-swatch-radio{display:inline-flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;border-radius:50%;'
    + 'padding:2px;cursor:pointer;user-select:none;vertical-align:middle;appearance:none;text-decoration:none;color:inherit;'
    + 'min-width:var(--Sizing-3, 24px);min-height:var(--Sizing-3, 24px);transition:background-color 0.15s ease-in-out;pointer-events:none}',
  '.omni-swatch-radio.Mui-disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed;color:rgba(0, 0, 0, 0.26)}',
  // MUI's disabled grey, undone by the library's checked rule after it.
  '.omni-swatch-radio.Mui-checked{color:inherit}',
  '.omni-swatch-radio>input{cursor:inherit;position:absolute;opacity:0;width:100%;height:100%;top:0;left:0;margin:0;padding:0;z-index:1}',
  /* As the Figma Radio set binds it: unselected, the ring is the surface's
     --Border; selected, ring and dot are both the button's Border. */
  '.omni-swatch-ring{width:20px;height:20px;box-sizing:border-box;border-radius:50%;border:2px solid var(--Border);flex-shrink:0;'
    + 'background-color:transparent;position:relative;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out}',
  '.omni-swatch-radio.Mui-checked .omni-swatch-ring{border-color:' + RADIO_EDGE + '}',
  '.omni-swatch-dot{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:10px;height:10px;border-radius:50%;'
    + 'background-color:' + RADIO_EDGE + '}',
  // The Legal type style, which is what the Figma label is bound to.
  '.omni-swatch-label{font-family:var(--Legal-Font-Family, inherit);font-size:var(--Legal-Font-Size, 10px);'
    + 'font-weight:var(--Legal-Font-Weight, 400);line-height:var(--Legal-Line-Height, 1.4);letter-spacing:var(--Legal-Letter-Spacing, 0);'
    + 'color:var(--Text);text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
].join('\n'));

export function Swatch({
  color,
  label,
  size = 'medium',
  /* Figma's Fit axis: Fixed | Fill. FIXED is the chip at its own size off the
     button ramp; FILL hands the width to whatever is laying it out, which is
     what a swatch inside a grid of colours needs — a row of fixed chips with
     a gap leaves a ragged right edge, and a picker is read as a block. The
     HEIGHT stays on the ramp either way: a swatch that stretched both ways
     would stop being a rounded square. */
  fit = 'fixed',
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
 
     Radio has no `Non-clickable`, which follows: a radio that cannot be chosen
     is not a radio — so a swatch with no onClick renders none, even with
     `radio` set. Figma simply does not draw that combination. */
  radio = false,
  onClick,
  className = '',
  sx,
  style,
  'aria-label': ariaLabel,
  ...props
}) {
  useStaticStyles('omni-swatch');
  /* Clickable is the PRESENCE of a handler, not a separate prop. Figma puts
     `State=Non-clickable` on the same axis as the interaction states, which says the
     same thing: either it responds or it does not. */
  const clickable = Boolean(onClick) && !disabled;
  /* A disabled swatch is still the CLICKABLE swatch, dimmed: Figma's
     State=Disabled draws the radio and the check like Default does. Only
     Non-clickable (no handler at all) drops them. `clickable` above decides
     whether it responds; `interactive` decides which variant it is. */
  const interactive = Boolean(onClick);
  const sizeKey = SIZE_HEIGHT[size] ? size : 'medium';

  /* A color alone is not a name. Where there is no visible label and the
     caller gave no aria-label, the color value is a poor but honest last
     resort — better than announcing "button". */
  const accessibleName = ariaLabel || label || color;

  const chip = (
    <div
      className={'swatch-chip MuiBox-root omni-swatch-chip omni-swatch-chip-' + sizeKey
        + (fit === 'fill' ? ' omni-swatch-chip-fill' : '')
        + (interactive ? ' omni-swatch-chip-edge' : '')
        + (clickable ? ' omni-swatch-chip-click' : '')}
      style={color !== undefined ? { '--_sw-c': color } : undefined}
    >
      {/* Figma's Non-clickable variant has no check layer — a display swatch
          is not chosen, so `selected` means nothing without a handler. */}
      {selected && !radio && interactive ? (
        <div className="swatch-check MuiBox-root omni-swatch-check">
          <CheckIcon
            aria-hidden="true"
            sx={{ width: '80%', height: '80%', color: 'var(--Icon, var(--Text))' }}
          />
        </div>
      ) : null}
    </div>
  );

  const Root = clickable ? 'button' : 'div';
  const root = {
    type: clickable ? 'button' : undefined,
    onClick: clickable ? onClick : undefined,
    disabled: clickable && disabled ? true : undefined,
    'aria-pressed': clickable ? selected : undefined,
    'aria-label': accessibleName,
    className: `swatch ${selected ? 'swatch-selected' : ''} ${className}`.trim()
      + ' MuiBox-root omni-swatch'
      + (fit === 'fill' ? ' omni-swatch-fit-fill' : '')
      + (disabled ? ' omni-swatch-off' : '')
      + (clickable ? ' omni-swatch-click' : ''),
    style,
    ...props,
  };
  const content = (
    <>
      {chip}
      {radio && interactive ? (
        /* Presentational: the whole swatch is the control, so the radio must
           not be a second tab stop or a second thing to announce. */
        <span
          className={'MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root radio-default '
            + (selected ? ' Mui-checked' : '') + (disabled ? ' Mui-disabled' : '') + ' omni-swatch-radio'}
          aria-hidden="true"
        >
          <input className="PrivateSwitchBase-input" type="radio" tabIndex={-1} checked={selected}
                 disabled={disabled} onChange={() => {}} />
          <div className="radio-circle-icon MuiBox-root omni-swatch-ring">
            {selected && <div className="MuiBox-root omni-swatch-dot" />}
          </div>
        </span>
      ) : null}
      {label ? (
        <span className="swatch-label MuiBox-root omni-swatch-label">
          {label}
        </span>
      ) : null}
    </>
  );
  if (hasSx(sx)) return <SxBox component={Root} sx={sx} {...root}>{content}</SxBox>;
  return <Root {...root}>{content}</Root>;
}

export default Swatch;
