// src/components/Icon/Icon.js
import React from 'react';
import { useGhost } from '../_ghost';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Icon Component
 *
 * Wraps any MUI icon with design-system color tokens and sizing.
 *
 * COLORS:
 *   default    var(--Icons-Default)         Two-tone: the same at 50% opacity
 *   primary    var(--Icons-Primary)         Two-tone: the same at 50% opacity
 * *   secondary  var(--Icons-Secondary)       Two-tone: the same at 50% opacity
 *   tertiary   var(--Icons-Tertiary)        Two-tone: the same at 50% opacity
 *   neutral    var(--Icons-Neutral)         Two-tone: the same at 50% opacity
 *   info       var(--Icons-Info)            Two-tone: the same at 50% opacity
 *   success    var(--Icons-Success)         Two-tone: the same at 50% opacity
 *   warning    var(--Icons-Warning)         Two-tone: the same at 50% opacity
 *   error      var(--Icons-Error)           Two-tone: the same at 50% opacity
 *
 * SIZES (Figma-aligned):
 *   xs      12px
 *   small   16px
 *   medium  24px (default)
 *   large   36px
 *   custom  user-specified fontSize
 *
 * STYLES (determined by which MUI icon you pass):
 *   filled     HomeIcon            (default)
 *   outlined   HomeOutlined
 *   rounded    HomeRounded
 *   twotone    HomeTwoTone         (secondary fill = the icon color at 50%)
 *   sharp      HomeSharp
 *
 * DISABLED: 0.38 opacity
 *
 * Accessibility: aria-hidden="true" by default (decorative). Pass aria-label for meaningful icons.
 */

const COLOR_LABEL_MAP = {
  default:   'Default',
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info',
  success:   'Success',
  warning:   'Warning',
  error:     'Error',
};

// The icon scale. Exported so anything that has to restate it — the Button's
// slot rules, which otherwise inherit MUI's own per-button-size icon sizing —
// reads these numbers instead of keeping a second copy.
/* ALIGNED TO FIGMA 2026-09-28 — and this MOVED ALL THREE EXISTING NAMES.
 *
 * The lib carried three steps of a ladder Figma has seven of, and the names
 * were offset by two rungs:
 *
 *   Figma  xxs 16 · xs 20 · small 24 · medium 32 · large 40 · xl 56 · xxl 72
 *   was           small 16 ·          medium 24 ·  large 32
 *
 * So the lib's `small` was Figma's `xxs`, and its `large` was Figma's
 * `medium`. Same offset Avatar had, found the same way, and neither side could
 * report it because both used one vocabulary for different rungs.
 *
 *   size="small"   16 -> 24
 *   size="medium"  24 -> 32
 *   size="large"   32 -> 40
 *
 * BREAKING and unshimmable, for the same reason as Avatar: all three names
 * exist in both ladders with different values, so no runtime check can tell
 * which one a call site meant.
 *
 * The four sizes the lib never had are added rather than left out. A ladder
 * with holes is what produced the offset in the first place — three names
 * stretched across seven rungs, each drifting to whichever rung it was nearest.
 *
 * (An earlier note here recorded removing `xs: 12px` because "Figma has no
 * 12px icon". That was true of the old reading and is now moot: Figma's xs is
 * 20, and this ladder is Figma's.) */
export const ICON_SIZE_MAP = {
  xxs: '16px',
  xs: '20px',
  small: '24px',
  medium: '32px',
  large: '40px',
  xl: '56px',
  xxl: '72px',
};

const SIZE_MAP = ICON_SIZE_MAP;

/** Colors/Icon-Variant-Opacity in the Modes collection — 50 in both modes. */
const ICON_VARIANT_OPACITY = 50;

let warnedDisabled = false;
function warnDisabledOnce() {
  if (warnedDisabled || process.env.NODE_ENV === 'production') return;
  warnedDisabled = true;
  // eslint-disable-next-line no-console
  console.warn('[Icon] disabled is retired — an icon is not interactive. Disable the Button that holds it.');
}

/* The static sheet. Size and color differ per icon, so they arrive as custom
   properties (--_ic-size, --_ic-color) and one rule reads them. Not inline
   values: a parent's rule — Button sizing the icon of an icon-only button —
   has to be able to win, as it did when both were emotion's. */
const SxBox = lazySxBox('Icon');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

registerStaticStyles('omni-icon', [
  '.omni-icon{display:inline-flex;align-items:center;justify-content:center;font-size:var(--_ic-size);color:var(--_ic-color);line-height:1;flex-shrink:0}',
  /* A ghosting icon is a square of its own size — the glyph hidden, so it
     occupies exactly the space the real icon will. */
  '.omni-icon-ghost{background-color:var(--Border-Variant);border-radius:var(--Ghost-Radius, 4px);color:transparent;user-select:none;pointer-events:none;width:var(--_ic-size);height:var(--_ic-size)}',
  '.omni-icon-ghost-anim{background-image:linear-gradient(90deg, transparent 0%, var(--Background) 50%, transparent 100%);background-size:200% 100%;background-repeat:no-repeat;animation:omni-ghost-sweep 1.4s linear infinite}',
  '@media (prefers-reduced-motion: reduce){.omni-icon-ghost-anim{background-image:none;animation:none}}',
  '.omni-icon-ghost .MuiSvgIcon-root{visibility:hidden}',
  '.omni-icon .MuiSvgIcon-root{font-size:inherit;color:inherit}',
].join('\n'));

export function Icon({
  children,
  color = 'default',
  size = 'medium',
  fontSize: customFontSize,
  // Retired: an Icon is not interactive, so it has no disabled state — an
  // icon Button does. disabled still renders the icon at full strength and
  // warns once.
  disabled,
  twoTone = false,
  className = '',
  style,
  sx,
  'aria-label': ariaLabel,
  ...props
}) {
  useStaticStyles('omni-icon');
  if (disabled) warnDisabledOnce();
  const ghost = useGhost();
  const C = COLOR_LABEL_MAP[color] || 'Default';

  // Resolve font size
  const resolvedSize = size === 'custom' && customFontSize
    ? (typeof customFontSize === 'number' ? customFontSize + 'px' : customFontSize)
    : SIZE_MAP[size] || SIZE_MAP.medium;

  // Color token — 'default' inherits from parent (e.g. Button text color)
  const colorToken = color === 'default' ? 'inherit' : 'var(--Icons-' + C + ')';
  /* The two-tone secondary fill is the icon's OWN color at a fixed opacity,
     not a second token.

     This read var(--Icons-Variant-{Color}), which is not a token: the Icons
     collection has Icon, Icon-Variant and On-Icon, but Icon-Variant is not a
     separate color — it is `{ color: <the same Icon alias>, opacity: <shared
     variable> }`, and every one of the ten modes points at the same opacity.
     That variable is Colors/Icon-Variant-Opacity = 50, in light mode and dark.

     So there was nothing for the generator to emit, and the reference had no
     fallback: --twotone-variant resolved to nothing and the secondary fill of
     every TwoTone icon came out uncoloured. Composing it here is both correct
     and the only form that can follow `default`, where the icon inherits its
     color from whatever it sits in and no token names it. */
  const iconColor = color === 'default' ? 'currentColor' : 'var(--Icons-' + C + ')';
  const variantToken =
    `color-mix(in srgb, ${iconColor} ${ICON_VARIANT_OPACITY}%, transparent)`;

  const iconProps = {
    className:
      'icon icon-' + color + ' icon-' + size +
      (twoTone ? ' icon-twotone' : '') +
      ' omni-icon' + (ghost ? ' omni-icon-ghost' + (ghost.animate ? ' omni-icon-ghost-anim' : '') : '') +
      (className ? ' ' + className : ''),
    'aria-hidden': ariaLabel ? undefined : 'true',
    'aria-label': ariaLabel || undefined,
    role: ariaLabel ? 'img' : undefined,
    style: {
      '--_ic-size': resolvedSize,
      '--_ic-color': colorToken,
      ...(twoTone && { '--twotone-variant': variantToken }),
      ...style,
    },
    ...props,
  };
  if (hasSx(sx)) return <SxBox component="span" sx={sx} {...iconProps}>{children}</SxBox>;
  return <span {...iconProps}>{children}</span>;
}

export default Icon;