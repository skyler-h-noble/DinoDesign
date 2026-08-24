// src/components/Switch/Switch.js
import React from 'react';
import { Switch as MuiSwitch, FormControlLabel } from '@mui/material';
import { Body, BodySmall } from '../Typography';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2 } from '../_shadows';

/**
 * Switch Component
 *
 * Geometry, colour roles and states follow the Figma component
 * (Omni-Designs, node 6779:2252).
 *
 * VARIANTS:
 *   variant="default"           the design-file switch — theme-driven, no
 *                               colour ramp. On: --Border track, --Text dot.
 *                               Off: --Background track, --Quiet border + dot.
 *                               `default-outline` and `outline` are the same.
 *   variant="{color}-outline"   bordered track + coloured dot, all 8 colours
 *   variant="{color}-light"     tinted track, all 8 colours
 *
 * SIZES (track, straight from the design):
 *   small  20×12, 8px dot     medium 30×16, 12px dot     large 48×24, 20px dot
 *   The dot is trackH - 4 and sits 2px in on every side.
 *   The ROOT keeps a 24×24 box for the WCAG 2.2 AA touch target even where the
 *   track is smaller.
 *
 * ICON: pass a node to `icon` to put a glyph inside the dot (8px on
 *   small/medium, 16px on large), painted in the track's own fill. Use
 *   `iconOn` / `iconOff` for a different glyph either side of the toggle —
 *   each falls back to `icon`.
 *
 * STATES: checked | unchecked | disabled | hover | active | focus-visible
 *   Hover and press lift the TRACK. Focus draws a 1px --Focus-Visible ring
 *   outside the track. Disabled dims the whole control to --Disabled (0.38).
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

// The Figma component is THEME-DRIVEN: it reads the surface tokens of whatever
// data-theme / data-surface it is placed in, rather than a per-colour Buttons-*
// ramp. On is the surface's --Border with a --Text dot; off is --Background
// with a --Quiet border and dot. That is what `default` renders, and it is the
// only model the design file has — the colour variants below are the lib's own
// addition and keep working on the same geometry.
//
// iconOff/iconOn are the track's own fill, so a glyph inside the dot reads as a
// knockout rather than a second colour.
function themedStyles() {
  return {
    type: 'themed',
    trackOff:       'var(--Background)',
    trackOffBorder: 'var(--Quiet)',
    // ON is a FILLED track with a knockout dot. The design file names --Border
    // for the fill and --Text for the dot, which works in the theme it was
    // drawn in (a dark green track, a near-white dot) but does not survive a
    // theme change: on Popsicles' Default surface those two resolve to #784284
    // and #593462 — a 1.39:1 dot, effectively invisible.
    //
    // --Buttons-*-Button / -Text is the pair the system publishes FOR fill +
    // mark-on-that-fill, and it holds 8:1 or better in every family, so it
    // keeps the design's intent (a solid track, a legible dot) wherever the
    // switch is themed.
    trackOn:        'var(--Buttons-Default-Button)',
    trackOnBorder:  'var(--Buttons-Default-Border)',
    dotOff:         'var(--Quiet)',
    dotOn:          'var(--Buttons-Default-Text)',
    iconOff:        'var(--Background)',
    iconOn:         'var(--Buttons-Default-Button)',
  };
}

function outlineStyles(color) {
  const C = cap(color);
  return {
    type: 'outline',
    color: C,
    trackOff:       'var(--Background)',
    trackOffBorder: 'var(--Border-Variant)',
    // ON is a FILLED track, same as the design's default. It used to be
    // transparent, which read as "nothing happened" next to the default
    // variant — only the border changed colour.
    trackOn:        'var(--Buttons-' + C + '-Button)',
    trackOnBorder:  'var(--Buttons-' + C + '-Border)',
    dotOff:         'var(--Quiet)',
    dotOn:          'var(--Buttons-' + C + '-Text)',
    iconOff:        'var(--Background)',
    iconOn:         'var(--Buttons-' + C + '-Button)',
  };
}

function lightStyles(color) {
  const C = cap(color);
  return {
    type: 'light',
    color: C,
    trackOff:       'var(--Border-Variant)',
    trackOffBorder: 'transparent',
    // The light tone fills the track. There are no --Buttons-*-Light-* tokens
    // in the export, so this uses Color-11 — the same tone Button's light
    // variant fills with.
    trackOn:        'var(--' + C + '-Color-11)',
    trackOnBorder:  'var(--Buttons-' + C + '-Border)',
    dotOff:         'var(--Quiet)',
    dotOn:          'var(--Buttons-' + C + '-Border)',
    iconOff:        'var(--Border-Variant)',
    iconOn:         'var(--' + C + '-Color-11)',
    dataTheme:      C + '-Light',
  };
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    map[color + '-outline'] = outlineStyles(color);
    map[color + '-light']   = lightStyles(color);
  });
  // `default` in every spelling is the design-file switch.
  map['default']         = themedStyles();
  map['default-outline'] = themedStyles();
  map['outline']         = themedStyles();
  map['primary']         = outlineStyles('primary');
  map['light']           = lightStyles('primary');
  return map;
}

// --- Sizing ------------------------------------------------------------------

// WCAG 2.2 AA. The design's small switch is 12px tall, which is far under the
// minimum tappable size, so the ROOT keeps a 24px box around the track. The
// track itself still renders at the design's size.
const TOUCH_MIN = 24;

// Straight from the Figma variant matrix.
//
// The dot is trackH - 4: Figma strokes the track on the INSIDE, so the 1px
// border overlaps the 2px padding instead of adding to it, and the dot ends up
// 2px in from the outer edge on every side.
//
// The focus ring is the track + 4px (2px a side). The design file positions it
// at -3px on the left, which would make it 1px lop-sided; it is centred here.
const THUMB_INSET = 2;

const SIZE_MAP = {
  small:  { trackW: 28, trackH: 16, dotRadius: 'var(--Sizing-2, 16px)',          icon: 8  },
  medium: { trackW: 40, trackH: 24, dotRadius: 'var(--Sizing-2-and-Half, 20px)', icon: 16 },
  large:  { trackW: 56, trackH: 32, dotRadius: 'var(--Sizing-2-and-Half, 20px)', icon: 16 },
};

// --- Component ---------------------------------------------------------------

export function Switch({
  variant = 'default',
  size = 'medium',
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  labelPlacement = 'end',
  name,
  value,
  // Optional glyph inside the dot — the design's `icon` boolean, as slots.
  // Sized to the design's 8px (small/medium) or 16px (large) and painted in the
  // track's own fill.
  //
  // The design draws a different glyph either side of the toggle, so ON and OFF
  // are separate slots. `icon` is the shorthand for "same glyph both ways";
  // iconOn / iconOff override it per state.
  icon,
  iconOn,
  iconOff,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}) {
  const variantMap = buildVariantMap();
  const styles = variantMap[variant] || variantMap['default'];
  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  const dot      = sc.trackH - THUMB_INSET * 2;
  const rootW    = Math.max(TOUCH_MIN, sc.trackW);
  const rootH    = Math.max(TOUCH_MIN, sc.trackH);
  const trackTop = (rootH - sc.trackH) / 2;

  const thumbBase = {
    width: dot,
    height: dot,
    borderRadius: sc.dotRadius,
    boxShadow: 'none',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s ease',
    '& > *': { width: sc.icon, height: sc.icon, display: 'block' },
  };

  const switchSx = {
    width: sc.trackW,
    minWidth: TOUCH_MIN,
    height: rootH,
    minHeight: TOUCH_MIN,
    padding: 0,
    overflow: 'visible',
    // The design dims the WHOLE control rather than its parts.
    opacity: disabled ? 'var(--Disabled, 0.38)' : 1,

    // switchBase FILLS the root, and the thumb is placed with padding rather
    // than by sizing the base to the track.
    //
    // Two things depend on this. The hit area is the <input>, which fills
    // switchBase — sizing it to the track gave a 20x12 target on small, under
    // the WCAG 2.2 24x24 minimum. And `calc(100% - 4px)` measured the ROOT,
    // which is 24px wide on small while the track is 20px, so the checked
    // thumb landed 2px past the track's right edge. Medium and large hid the
    // bug because their tracks are already wider than the touch minimum.
    '& .MuiSwitch-switchBase': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: THUMB_INSET + 'px',
      // The track sits at the root's left edge, so any slack between the track
      // and the root goes on the right.
      paddingRight: (rootW - sc.trackW + THUMB_INSET) + 'px',
      color: 'transparent',
      transition: 'justify-content 0.15s ease',
      transform: 'none',

      '& .MuiSwitch-input': { left: 0, top: 0, width: '100%', height: '100%', margin: 0 },

      '& .MuiSwitch-thumb': {
        ...thumbBase,
        backgroundColor: styles.dotOff,
        color: styles.iconOff,
      },

      // ON
      '&.Mui-checked': {
        justifyContent: 'flex-end',
        transform: 'none',
        '& .MuiSwitch-thumb': {
          ...thumbBase,
          backgroundColor: styles.dotOn,
          color: styles.iconOn,
        },
        '& + .MuiSwitch-track': {
          backgroundColor: styles.trackOn,
          borderColor: styles.trackOnBorder,
          opacity: 1,
        },
      },

      // Hover / pressed lift the TRACK, matching the design's effect style.
      // The repo's canonical scale stands in for the design's five-layer stack.
      '&:hover, &.Mui-checked:hover': { backgroundColor: 'transparent' },
      '&:hover + .MuiSwitch-track': { boxShadow: SHADOW_LEVEL_2 },
      '&:active + .MuiSwitch-track': { boxShadow: SHADOW_LEVEL_1 },

      // Focus ring sits OUTSIDE the track, not on the dot.
      '&.Mui-focusVisible + .MuiSwitch-track': {
        outline: '1px solid var(--Focus-Visible)',
        outlineOffset: THUMB_INSET + 'px',
      },

      '&.Mui-disabled + .MuiSwitch-track': { opacity: 1 },
    },

    '& .MuiSwitch-track': {
      width: sc.trackW,
      height: sc.trackH,
      borderRadius: 'var(--Sizing-3, 24px)',
      backgroundColor: styles.trackOff,
      border: '1px solid ' + styles.trackOffBorder,
      boxSizing: 'border-box',
      opacity: 1,
      position: 'absolute',
      top: trackTop,
      left: 0,
      transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    },

    ...sx,
  };

  const isLight = variant.includes('-light') || variant === 'light';

  // MUI renders the thumb from its icon / checkedIcon props. Supplying our own
  // span keeps the .MuiSwitch-thumb class — and therefore every style above —
  // while giving the glyph somewhere to live.
  const glyphOff = iconOff !== undefined ? iconOff : icon;
  const glyphOn  = iconOn  !== undefined ? iconOn  : icon;
  const hasGlyph = glyphOff !== undefined || glyphOn !== undefined;
  const thumbNode = (glyph) => <span className="MuiSwitch-thumb">{glyph}</span>;

  const switchElement = (
    <MuiSwitch
      {...(hasGlyph ? { icon: thumbNode(glyphOff), checkedIcon: thumbNode(glyphOn) } : {})}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      name={name}
      value={value}
      // slotProps.input, NOT inputProps: MUI 7 deprecated inputProps on Switch
      // and drops it on the floor — it builds the SwitchBase's slotProps from
      // slotProps.input alone. The old form silently produced an input with no
      // accessible name, so every unlabelled Switch failed axe.
      slotProps={{
        input: {
          ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
          ...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {}),
        },
      }}
      className={'switch-' + variant + ' ' + className}
      sx={switchSx}
      disableRipple
      {...(isLight && styles.dataTheme ? {
        'data-theme': styles.dataTheme,
        'data-surface': 'Surface-Dim',
      } : {})}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchElement}
        label={
          <LabelComp
            component="span"
            sx={{
              color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
              fontSize: size === 'small' ? '13px' : '15px',
              fontWeight: 500,
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {label}
          </LabelComp>
        }
        labelPlacement={labelPlacement}
        sx={{ gap: '8px', marginLeft: 0, marginRight: 0 }}
      />
    );
  }

  return switchElement;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Solid
export const PrimarySwitch                = (p) => <Switch variant="primary"              {...p} />;
export const SecondarySwitch              = (p) => <Switch variant="secondary"            {...p} />;
export const TertiarySwitch               = (p) => <Switch variant="tertiary"             {...p} />;
export const NeutralSwitch                = (p) => <Switch variant="neutral"              {...p} />;
export const InfoSwitch                   = (p) => <Switch variant="info"                 {...p} />;
export const SuccessSwitch                = (p) => <Switch variant="success"              {...p} />;
export const WarningSwitch                = (p) => <Switch variant="warning"              {...p} />;
export const ErrorSwitch                  = (p) => <Switch variant="error"                {...p} />;

// Outline
export const PrimaryOutlineSwitch         = (p) => <Switch variant="primary-outline"      {...p} />;
export const SecondaryOutlineSwitch       = (p) => <Switch variant="secondary-outline"    {...p} />;
export const TertiaryOutlineSwitch        = (p) => <Switch variant="tertiary-outline"     {...p} />;
export const NeutralOutlineSwitch         = (p) => <Switch variant="neutral-outline"      {...p} />;
export const InfoOutlineSwitch            = (p) => <Switch variant="info-outline"         {...p} />;
export const SuccessOutlineSwitch         = (p) => <Switch variant="success-outline"      {...p} />;
export const WarningOutlineSwitch         = (p) => <Switch variant="warning-outline"      {...p} />;
export const ErrorOutlineSwitch           = (p) => <Switch variant="error-outline"        {...p} />;

// Light
export const PrimaryLightSwitch           = (p) => <Switch variant="primary-light"        {...p} />;
export const SecondaryLightSwitch         = (p) => <Switch variant="secondary-light"      {...p} />;
export const TertiaryLightSwitch          = (p) => <Switch variant="tertiary-light"       {...p} />;
export const NeutralLightSwitch           = (p) => <Switch variant="neutral-light"        {...p} />;
export const InfoLightSwitch              = (p) => <Switch variant="info-light"           {...p} />;
export const SuccessLightSwitch           = (p) => <Switch variant="success-light"        {...p} />;
export const WarningLightSwitch           = (p) => <Switch variant="warning-light"        {...p} />;
export const ErrorLightSwitch             = (p) => <Switch variant="error-light"          {...p} />;

// Legacy alias
export const SwitchInput = Switch;

export default Switch;