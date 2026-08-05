// src/components/ButtonGroup/ButtonGroup.js
import React, { useState } from 'react';
import { Box } from '@mui/material';

/**
 * ButtonGroup Component
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *   outlined  transparent bg, colored border, selected button fills
 *   light     unselected buttons carry data-theme="{Color}-Light" + data-surface="Surface"
 *             selected button fills with var(--Buttons-{Color}-Button)
 *   ghost     no border on container or buttons; selected fills
 *
 * ─── COLORS ──────────────────────────────────────────────────────────────────
 *   default (first / default) | primary | secondary | tertiary | neutral
 *   info | success | warning | error
 *
 * ─── TOKEN CONTRACT ──────────────────────────────────────────────────────────
 *   Container border:          var(--Buttons-{Color}-Border)
 *   Selected bg:               var(--Buttons-{Color}-Button)
 *   Selected text:             var(--Buttons-{Color}-Text)
 *   Unselected text:           var(--Text-Quiet)
 *   Hover (unselected) bg:     var(--Hover)
 *   Hover (unselected) text:   var(--Text)
 *   Active (unselected) bg:    var(--Pressed)
 *   Focus ring:                var(--Focus-Visible)
 *
 * ─── SELECTION ───────────────────────────────────────────────────────────────
 *   value / defaultValue / onChange — controlled or uncontrolled
 *   Each child button should carry a `value` prop.
 *   Falls back to index (0, 1, 2…) if no value prop is present.
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small | medium (default) | large
 *
 * ─── ORIENTATION ─────────────────────────────────────────────────────────────
 *   horizontal (default) | vertical
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Maps color → light theme name for data-theme attribute
const LIGHT_THEME = {
  default:   'Default-Light',
  primary:   'Primary-Light',
  secondary: 'Secondary-Light',
  tertiary:  'Tertiary-Light',
  neutral:   'Neutral-Light',
  info:      'Info-Light',
  success:   'Success-Light',
  warning:   'Warning-Light',
  error:     'Error-Light',
};

export function ButtonGroup({
  variant = 'outlined',    // 'outlined' | 'light' | 'ghost'
  color = 'default',       // 'default' | 'primary' | 'secondary' | …
  size = 'medium',
  disabled = false,
  orientation = 'horizontal',
  spacing = 0,
  // fit — the group's WIDTH variant (in Figma, a "Width"/"Fit" variant property):
  //   'hug'   (default) each button sizes to its own content
  //   'fill'  group fills its container; buttons share the width equally
  //   'equal' group HUGS its content but every button matches the WIDEST one
  //           (horizontal group laid out as inline-grid with equal 1fr columns,
  //           whose fr tracks resolve to the widest column's max-content; a
  //           vertical group already equalizes width via alignItems:stretch).
  fit,
  fullWidth = false,    // back-compat alias → fit="fill"
  equalWidth = false,   // back-compat alias → fit="equal"

  // Selection
  value: controlledValue,
  defaultValue,
  onChange,

  children,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled   = controlledValue !== undefined;
  const selectedValue  = isControlled ? controlledValue : internalValue;

  const isHorizontal = orientation === 'horizontal';
  const isConnected  = spacing === 0;
  const isLight      = variant === 'light';
  const isGhost      = variant === 'ghost';

  // Resolve the width variant (fit) from the prop or the back-compat booleans.
  const fitMode = fit ?? (fullWidth ? 'fill' : equalWidth ? 'equal' : 'hug');
  const isFill  = fitMode === 'fill';
  const isEqual = fitMode === 'equal';
  const useGrid = isEqual && isHorizontal;   // equal-width-hug uses an inline-grid

  const C            = cap(color);                               // 'Default', 'Primary', …
  const btnBorder    = 'var(--Buttons-' + C + '-Border)';
  const btnBg        = 'var(--Buttons-' + C + '-Button)';
  const btnText      = 'var(--Buttons-' + C + '-Text)';
  const lightTheme   = LIGHT_THEME[color] || 'Default-Light';

  const childArray = React.Children.toArray(children).filter(Boolean);
  const count = childArray.length;

  const handleClick = (childValue, childOnClick) => (e) => {
    if (!isControlled) setInternalValue(childValue);
    onChange?.(childValue, e);
    childOnClick?.(e);
  };

  const wrappedChildren = childArray.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    const isFirst    = index === 0;
    const isLast     = index === count - 1;
    const childValue = child.props.value ?? index;
    const isSelected = selectedValue === childValue;

    // ── Border radius in connected mode ───────────────────────────────────
    let borderRadius;
    if (isConnected && count > 1) {
      const r = 'var(--Style-Border-Radius)';
      if (isHorizontal) {
        borderRadius = (isFirst && isLast) ? r
          : isFirst ? r + ' 0 0 ' + r
          : isLast  ? '0 ' + r + ' ' + r + ' 0'
          : '0';
      } else {
        borderRadius = (isFirst && isLast) ? r
          : isFirst ? r + ' ' + r + ' 0 0'
          : isLast  ? '0 0 ' + r + ' ' + r
          : '0';
      }
    }

    // ── Per-button sx ─────────────────────────────────────────────────────
    const positionalSx = isConnected && count > 1 ? {
      borderRadius,
      ...(!isFirst && (isHorizontal ? { marginLeft: 'calc(-1 * var(--Button-Border-Width))' } : { marginTop: 'calc(-1 * var(--Button-Border-Width))' })),
      position: 'relative',
      '&:hover, &:focus-visible': { zIndex: 1 },
    } : {};

    // ── Selected styles ───────────────────────────────────────────────────
    // The selected segment is already "on" — it must NOT change on hover.
    // Without this, it inherits the solid Button's &:hover (which paints
    // var(--Buttons-{C}-Hover), a near-white scrim) and flips light on hover.
    const selectedSx = isSelected ? {
      backgroundColor:  btnBg    + ' !important',
      color:            btnText  + ' !important',
      borderColor:      btnBorder + ' !important',
      // The selected segment is "on" — freeze it across hover, active (press)
      // AND focus so it never picks up the solid Button's hover/active scrim.
      // Only unselected segments should react to :hover / :active.
      '&:hover, &:active, &.Mui-focusVisible, &:focus-visible': {
        backgroundColor: btnBg    + ' !important',
        color:           btnText  + ' !important',
        borderColor:     btnBorder + ' !important',
      },
    } : {};

    // ── Unselected styles ─────────────────────────────────────────────────
    const unselectedSx = !isSelected ? {
      color:           'var(--Quiet)',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'var(--Hover)',
        color:           'var(--Text)',
        zIndex:          1,
      },
      '&:active': {
        backgroundColor: 'var(--Pressed)',
        color:           'var(--Buttons-Default-Text)',
      },
    } : {};

    // ── Ghost: no border on individual buttons ────────────────────────────
    const ghostSx = isGhost ? {
      border: 'none !important',
      '&:hover': { border: 'none !important' },
    } : {};

    const buttonSx = {
      // Grid items stretch to fill their 1fr cell via the default
      // justify-self:stretch — do NOT set width:100% here. An explicit
      // width:100% fixes each segment to exactly the cell width, so the
      // -Button-Border-Width marginLeft only makes neighbors TOUCH (two 2px
      // borders side by side = a 4px double border). Letting them stretch lets
      // that negative margin OVERLAP the shared edge into a single border —
      // the same collapse the flex (hug/fill) modes already get.
      ...positionalSx,
      ...selectedSx,
      ...unselectedSx,
      ...ghostSx,
      '&:focus-visible': {
        outline:       '2px solid var(--Focus-Visible)',
        outlineOffset: '2px',
        zIndex:        2,
      },
      ...child.props.sx,
    };

    const clonedButton = React.cloneElement(child, {
      // Selected → filled (solidStyles applies the per-variant bevel).
      // Unselected → outline (flat). Ghost group stays ghost on both.
      // An explicit child.variant always wins.
      variant: child.props.variant ?? (
        isGhost
          ? 'ghost'
          : isSelected
            ? color
            : color + '-outline'
      ),
      size:    child.props.size ?? size,
      disabled: child.props.disabled ?? disabled,
      onClick: handleClick(childValue, child.props.onClick),
      'aria-pressed': isSelected,
      sx: buttonSx,
    });

    // ── Light variant: wrap unselected buttons in themed Box ──────────────
    if (isLight && !isSelected) {
      return (
        <Box
          key={index}
          data-theme={lightTheme}
          data-surface="Surface"
          sx={{ display: 'contents' }}
        >
          {clonedButton}
        </Box>
      );
    }

    return React.cloneElement(clonedButton, { key: index });
  });

  // ── Container — no border on the outer wrapper ──────────────────────────
  const containerBorder = 'none';

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      className={'btn-group btn-group-' + variant + ' btn-group-' + color + ' ' + className}
      sx={{
        ...(useGrid
          ? {
              // equal-width-hug: inline-grid, equal 1fr columns → every button
              // matches the widest; inline-grid shrink-wraps so the group hugs.
              display:        isFill ? 'grid' : 'inline-grid',
              gridAutoFlow:   'column',
              gridAutoColumns:'1fr',
              justifyItems:   'stretch',   // buttons fill their column width (equal)
              alignItems:     'stretch',   // buttons fill the row height → if one
                                           // wraps to 2 lines, all match the tallest
              width:          isFill ? '100%' : 'fit-content',
            }
          : {
              display:        isFill ? 'flex' : 'inline-flex',
              flexDirection:  isHorizontal ? 'row' : 'column',
              alignItems:     'stretch',
              width:          isFill ? '100%' : 'auto',
            }),
        gap:            isConnected ? 0 : spacing,
        border:         containerBorder,
        borderRadius:   'var(--Style-Border-Radius)',
        // No overflow:hidden — would clip button borders, focus rings, and
        // the outline-offset on focus-visible. Connected-mode corner shaping
        // is already handled per-button via the borderRadius logic above.
        ...sx,
      }}
      {...props}
    >
      {wrappedChildren}
    </Box>
  );
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Outlined
export const DefaultOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="default"   {...p} />;
export const PrimaryOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="primary"   {...p} />;
export const SecondaryOutlineButtonGroup = (p) => <ButtonGroup variant="outlined" color="secondary" {...p} />;
export const TertiaryOutlineButtonGroup  = (p) => <ButtonGroup variant="outlined" color="tertiary"  {...p} />;
export const NeutralOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="neutral"   {...p} />;
export const InfoOutlineButtonGroup      = (p) => <ButtonGroup variant="outlined" color="info"      {...p} />;
export const SuccessOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="success"   {...p} />;
export const WarningOutlineButtonGroup   = (p) => <ButtonGroup variant="outlined" color="warning"   {...p} />;
export const ErrorOutlineButtonGroup     = (p) => <ButtonGroup variant="outlined" color="error"     {...p} />;

// Light
export const DefaultLightButtonGroup    = (p) => <ButtonGroup variant="light" color="default"   {...p} />;
export const PrimaryLightButtonGroup    = (p) => <ButtonGroup variant="light" color="primary"   {...p} />;
export const SecondaryLightButtonGroup  = (p) => <ButtonGroup variant="light" color="secondary" {...p} />;
export const TertiaryLightButtonGroup   = (p) => <ButtonGroup variant="light" color="tertiary"  {...p} />;
export const NeutralLightButtonGroup    = (p) => <ButtonGroup variant="light" color="neutral"   {...p} />;
export const InfoLightButtonGroup       = (p) => <ButtonGroup variant="light" color="info"      {...p} />;
export const SuccessLightButtonGroup    = (p) => <ButtonGroup variant="light" color="success"   {...p} />;
export const WarningLightButtonGroup    = (p) => <ButtonGroup variant="light" color="warning"   {...p} />;
export const ErrorLightButtonGroup      = (p) => <ButtonGroup variant="light" color="error"     {...p} />;

// Ghost
export const GhostButtonGroup = (p) => <ButtonGroup variant="ghost" {...p} />;

// Backward-compat aliases
export const PrimaryButtonGroup  = (p) => <ButtonGroup variant="outlined" color="primary" {...p} />;
export const OutlineButtonGroup  = (p) => <ButtonGroup variant="outlined" color="default" {...p} />;

export default ButtonGroup;