// src/components/Button/Button.js
import React from 'react';
import { Button as MuiButton, Avatar as MuiAvatar, Box, GlobalStyles } from '@mui/material';
import { Button as ButtonTypography, ButtonSmall as ButtonSmallTypography, ButtonExtraSmall as ButtonExtraSmallTypography, CAP_HEIGHT_TRIM } from '../Typography';
import { Avatar as DDAvatar } from '../Avatar/Avatar';
import { Icon as DDIcon, ICON_SIZE_MAP } from '../Icon/Icon';
import { Badge as DDBadge } from '../Badge/Badge';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, bevelShadow, tokenSegment } from '../_shadows';

// Auto-size mapping for start/end decorators based on Button size
// Padding on the label wrapper — Figma's "Typography Holder". Small and medium
// share 4px vertical / 2px horizontal; large is square at 4px.
const LABEL_PADDING_BY_SIZE = {
  small:  '4px 2px',
  medium: '4px 2px',
  large:  '4px',
};

const DECORATOR_SIZE_MAP = {
  small:  { avatar: 'xxx-small', icon: 'small'  },
  medium: { avatar: 'xx-small',  icon: 'medium' },
  large:  { avatar: 'small',     icon: 'large'  },
};

// Auto-detect decorator type by React element type and resize it.
// - Avatar → cloned with avatar size for the button size
// - Icon   → cloned with icon size for the button size
// - Other (raw MUI SvgIcon, etc.) → returned as-is so MUI's startIcon/endIcon
//   slot can size it via inherited font-size.
function resolveDecorator(node, buttonSize) {
  if (!React.isValidElement(node)) return node;
  const mapping = DECORATOR_SIZE_MAP[buttonSize] || DECORATOR_SIZE_MAP.medium;
  if (node.type === DDAvatar) {
    // Button avatars: size to the button (small→16, medium→24, large→40) AND
    // get 2px horizontal padding so they sit correctly beside the label /
    // within a group segment. insideButton applies the 2px L/R margin.
    return React.cloneElement(node, { size: mapping.avatar, insideButton: true });
  }
  if (node.type === DDIcon) {
    return React.cloneElement(node, { size: mapping.icon });
  }
  return node;
}

/**
 * Button Component
 * Full-featured button with complete design system integration
 *
 * ─── STRUCTURE (matches Figma) ─────────────────────────────────────────────────
 *
 * Button-Container (outer)
 *   border: 1px solid var(--Buttons-{Color}-Border)
 *   border-radius: var(--Button-Radius)
 *   box-shadow: elevation (5 dropshadow layers)
 *   padding: 1px (gap between border and inner)
 *
 *   Button-Contents (inner)
 *     background: var(--Buttons-{Color}-Button)
 *     border-radius: var(--Button-Inner-Radius)  ← radius - 1
 *     contains: Slot (icon) + Typography + Slot2 (icon)
 *
 *     Bevel Overlay (pseudo-element)
 *       pointer-events: none
 *       inset shadow: highlight top-left, lowlight bottom-right
 *
 * ─── VARIANTS ────────────────────────────────────────────────────────────────
 *
 * SOLID   — variant="{color}"
 * OUTLINE — variant="{color}-outline"
 * LIGHT   — variant="{color}-light"
 * GHOST   — variant="ghost"
 *
 * ─── SIZES ───────────────────────────────────────────────────────────────────
 *   small:  var(--Small-Button-Height)
 *   medium: var(--Button-Height)
 *   large:  var(--Large-Button-Height)
 *
 * ─── CONTENT TYPES ───────────────────────────────────────────────────────────
 *   text, number/letter, icon, avatar, swatch
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// `black-white` capitalises to `Black-white`, which is not a token. The design
// system emits --Buttons-BlackWhite-*, so token names go through the shared
// mapping in _shadows.js rather than through cap() directly.
const seg = tokenSegment;

// ─── Effect Levels (from base.css) ──────────────────────────────────────────
// Normal buttons:   Level 1 resting, Level 2 hover
// Elevated buttons: Level 2 resting, Level 3 hover

// ─── Variant Style Builders ───────────────────────────────────────────────────
// bevelShadow lives in src/components/_shadows.js so both Button and Slider
// can share it. Consumers must set --_bevel and --_height on the element.

function solidStyles(color, elevated = false, selected = false, size = 'medium') {
  const C = seg(color);
  const bevel = bevelShadow(color, size);
  const restLevel = elevated ? SHADOW_LEVEL_1 : 'none';
  const hoverLevel = elevated ? SHADOW_LEVEL_2 : SHADOW_LEVEL_1;
  const restShadow = restLevel === 'none' ? bevel : `${bevel}, ${restLevel}`;
  const hoverShadow = `${bevel}, ${hoverLevel}`;
  return {
    backgroundColor: `var(--Buttons-${C}-Button)`,
    color: `var(--Buttons-${C}-Text)`,
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: restShadow,
    position: 'relative',
    zIndex: 1,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Buttons-${C}-Hover)`,
      zIndex: -1,
    },
    '&:hover': {
      backgroundColor: `var(--Buttons-${C}-Hover)`,
      boxShadow: hoverShadow,
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: `var(--Buttons-${C}-Pressed)`,
      boxShadow: bevel, // No elevation on press
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--Buttons-${C}-Button)`,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
    '& .MuiTouchRipple-root': { zIndex: -1 },
    '& .MuiTypography-root': { zIndex: 1 },
    '& .MuiButton-icon': { zIndex: 1 },
  };
}

function outlineStyles(color, selected = false) {
  const C = seg(color);
  return {
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: 'none',
    // Outline (like Ghost) has no fill of its own, so its hover/active
    // feedback comes from the surface --Hover / --Pressed scrim — a
    // subtle tone-aware overlay that reads correctly on any surface
    // tone. Using --Buttons-{C}-Hover would paint a solid colored
    // background and lose the "outline" character of the variant.
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      backgroundColor: 'var(--Hover)',
      boxShadow: 'none',
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: 'var(--Pressed)',
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
  };
}

function lightStyles(color, elevated = false, selected = false) {
  const C = cap(color);
  const restLevel = elevated ? SHADOW_LEVEL_1 : 'none';
  const hoverLevel = elevated ? SHADOW_LEVEL_2 : SHADOW_LEVEL_1;
  return {
    backgroundColor: `var(--${C}-Color-11)`,
    color: `var(--Text-${C}-Color-11)`,
    border: `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`,
    boxShadow: restLevel,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Hover-${C}-Color-11)`,
    },
    '&:hover': {
      backgroundColor: `var(--Hover-${C}-Color-11)`,
      boxShadow: hoverLevel,
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: `var(--Pressed-${C}-Color-11)`,
      boxShadow: 'none',
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--${C}-Color-11)`,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
    },
  };
}

function ghostStyles(isTextContent, selected = false) {
  return {
    backgroundColor: 'transparent',
    // Text ghost buttons read like links (--Hotlink). Icon-only ghosts
    // are pure affordances — link styling is too colored for a calendar
    // icon, so they fall back to the secondary text token and only
    // darken to --Text on hover.
    color: isTextContent ? 'var(--Hotlink)' : 'var(--Quiet)',
    border: 'var(--Button-Border-Width) solid transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    ...(isTextContent && {
      // Underline lives on the text wrapper only — not on the button root or
      // arbitrary spans — so it never propagates into the start/end decorator
      // slots (icons, avatars and their inner spans).
      '& .btn-text-content': { textDecoration: 'underline' },
    }),
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      // Ghost and Outline use the surface --Hover / --Pressed scrim by
      // design — they're the only variants without a fill of their own,
      // so they need a tone-aware overlay tint to indicate hover. Solid
      // variants use --Buttons-{C}-Hover instead.
      backgroundColor: 'var(--Hover)',
      boxShadow: 'none',
      ...(!selected && { transform: 'translateY(-1px)' }),
      ...(isTextContent
        ? { '& .btn-text-content': { textDecoration: 'none' } }
        : { color: 'var(--Text)' }),
    },
    '&:active': {
      backgroundColor: 'var(--Pressed)',
      ...(!selected && { transform: 'translateY(0)' }),
      ...(isTextContent
        ? { '& .btn-text-content': { textDecoration: 'none' } }
        : { color: 'var(--Text)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'transparent',
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '2px',
      ...(isTextContent && {
        '& .btn-text-content': { textDecoration: 'none' },
      }),
    },
  };
}

function buildVariantMap(isTextContent, elevated = false, selected = false, size = 'medium') {
  const map = {};
  COLORS.forEach((color) => {
    map[color]                = solidStyles(color, elevated, selected, size);
    map[`${color}-outline`]   = outlineStyles(color, selected);
    map[`${color}-light`]     = lightStyles(color, elevated, selected);
  });
  // Black/white — solid and outline only.
  //
  // Not a member of COLORS on purpose: that loop also builds `-light`, which
  // reads --<C>-Color-11, and BlackWhite has no tonal ramp to take a Color-11
  // from. Solid and outline need only --Buttons-BlackWhite-{Button,Text,Border,
  // Hover,Pressed,Highlight,Lowlight}, which the system emits in every theme
  // and surface block — so the button resolves to black on a light surface and
  // white on a dark one wherever it is placed, with no prop change.
  map['black-white']         = solidStyles('black-white', elevated, selected, size);
  map['black-white-outline'] = outlineStyles('black-white', selected);

  map['danger']         = solidStyles('error', elevated, selected, size);
  map['outline']        = outlineStyles('default', selected);
  map['ghost']          = ghostStyles(isTextContent, selected);
  map['text']           = ghostStyles(isTextContent, selected);
  return map;
}

// ─── Sizing ───────────────────────────────────────────────────────────────────

const SIZE_HEIGHT = {
  small:  'var(--Small-Button-Height)',
  medium: 'var(--Button-Height)',
  large:  'var(--Large-Button-Height)',
};

// minWidth here is the TEXT button's floor. Small and medium share
// --Button-Min-Width; large has its own --Lg-Button-Min-Width (the standard
// floor plus 40px) because a 56px-tall button reads as a stub at the standard
// width. The fallback covers design systems generated before that token.
//
// The square types don't use it: icon-only, letter/number and avatar-only
// buttons take their min-width from the button HEIGHT instead, so they stay
// square. getSizingStyles overrides minWidth for those.
const SIZE_BASE = {
  small:  { minHeight: 'var(--Small-Button-Height)', minWidth: 'var(--Button-Min-Width)', fontSize: '13px', '--_height': 'var(--Small-Button-Height)' },
  large:  { minHeight: 'var(--Large-Button-Height)', minWidth: 'var(--Lg-Button-Min-Width, var(--Button-Min-Width))', fontSize: '17px', '--_height': 'var(--Large-Button-Height)' },
  medium: {
    minHeight: 'var(--Button-Height)',
    minWidth:  'var(--Button-Min-Width)',
    fontSize:  '15px',
    '--_height': 'var(--Button-Height)',
  },
};

function getSizingStyles({ size, iconOnly, letterNumber, avatar }) {
  const base       = SIZE_BASE[size] || SIZE_BASE.medium;
  const squareSize = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;

  // Icon / Avatar — fixed square, no padding, no min-width/height
  if (iconOnly) {
    const fontSize = avatar
      ? (size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px')
      : (size === 'small' ? '0.875rem' : base.fontSize);
    return {
      height:  squareSize,
      width:   squareSize,
      minWidth: 'unset',
      minHeight: 'unset',
      fontSize,
      padding: '0',
      '--_height': squareSize,
    };
  }

  // Letter / Number — square minimum, grows with content, no padding on shell
  if (letterNumber) {
    return {
      ...base,
      minHeight: squareSize,
      minWidth:  squareSize,
      padding: '0',
    };
  }

  // Text — minHeight from the size's height token, minWidth from
  // --Button-Min-Width (see SIZE_BASE).
  //
  // TWO padding tokens across three sizes: small and medium share
  // --Button-Padding (8px); large has its own --Lg-Button-Padding (16px),
  // because 8px reads cramped against a large button's taller box.
  //
  // There is deliberately no --Sm-Button-Padding here. It is still emitted by
  // the export, as an alias of --Button-Padding, so older markup keeps
  // resolving — but binding small to it is what previously made small buttons
  // 8px where the design says 16px.
  //
  // --Lg-Button-Padding is the canonical spelling, matching --Lg-Button-Min-Width
  // and --Lg-Input-Radius. The export also emits --Large-Button-Padding as an
  // alias of it, for brand CSS generated before the rename.
  return {
    ...base,
    padding: size === 'large'
      ? '0 var(--Lg-Button-Padding)'
      : '0 var(--Button-Padding)',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'default',
  size = 'medium',
  elevated = false,
  // Pass `selected` when the button represents a toggled-on state (e.g. the
  // active option in a ButtonGroup). Suppresses the hover translateY lift
  // so a selected button doesn't animate when the user hovers it again.
  selected = false,
  fullWidth = false,
  disabled = false,
  iconOnly = false,
  letterNumber = false,
  avatar = false,
  swatch = false,
  swatchColor,
  startIcon,
  endIcon,
  startDecorator,
  endDecorator,
  // Badge — optional count/status indicator anchored to the button corner.
  // When `badge` is true, the rendered button is wrapped in the design-system
  // Badge so positioning, colors, and theming match the standalone component.
  badge = false,
  badgeContent,
  badgeVariant = 'error',
  badgeSize,
  badgeDot = false,
  badgeMax = 99,
  badgeAnchorOrigin = { vertical: 'top', horizontal: 'right' },
  children,
  className = '',
  sx = {},
  ...props
}) {
  const isIconOnly     = iconOnly || avatar || swatch;

  /*
   * Accessible naming for icon buttons.
   *
   * Rule: the BUTTON carries the name; the icons inside carry none. Give both
   * a name and a screen reader announces the control twice — "Delete, Delete
   * button". Give neither and an icon-only button is announced as just
   * "button", which tells the user nothing.
   *
   * The lib's <Icon> already sets aria-hidden unless you pass it an aria-label,
   * so the common case is correct by default. The failure modes left are a raw
   * MUI SvgIcon with titleAccess, and an icon-only button with no name at all —
   * both silent, and both invisible unless you use a screen reader.
   */
  if (process.env.NODE_ENV !== 'production') {
    const named =
      props['aria-label'] || props['aria-labelledby'] || props.title;
    if (isIconOnly && !named) {
      // eslint-disable-next-line no-console
      console.error(
        '[OmniDesign] An icon-only <Button> has no accessible name. A screen ' +
        'reader announces it as just "button". Add aria-label="…" describing ' +
        'the ACTION ("Delete item"), not the icon ("trash").',
      );
    }
    if (named) {
      React.Children.forEach(children, (child) => {
        const childLabel = child?.props?.['aria-label'] || child?.props?.titleAccess;
        if (childLabel) {
          // eslint-disable-next-line no-console
          console.error(
            '[OmniDesign] <Button> is labelled "' + named + '" but also ' +
            'contains an icon labelled "' + childLabel + '". A screen reader ' +
            'reads both. Remove the icon\'s label — the button owns the name.',
          );
        }
      });
    }
  }
  const isTextContent  = !isIconOnly;
  const effectiveFullWidth = fullWidth && !isIconOnly && !letterNumber;

  // Ghost avatars/swatches fallback to primary
  const effectiveVariant = ((avatar || swatch) && (variant === 'ghost' || variant === 'text'))
    ? 'primary'
    : variant;

  const variantMap     = buildVariantMap(isTextContent, elevated, selected, size);
  const variantStyles  = variantMap[effectiveVariant] || variantMap.default;
  const sizingStyles   = getSizingStyles({ size, iconOnly: isIconOnly, letterNumber, avatar });

  const TypographyComp = size === 'small' ? ButtonSmallTypography : ButtonTypography;

  const renderChildren = () => {
    if (isIconOnly) return children;

    if (letterNumber) {
      const LetterComp = size === 'small' ? ButtonExtraSmallTypography : TypographyComp;
      return (
        <LetterComp
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            color: 'inherit',
            lineHeight: 1,
            // Trim to cap height / baseline so the letter or number centres on
            // its own form rather than on the font's ascender-to-descender box.
            ...CAP_HEIGHT_TRIM,
          }}
        >
          {children}
        </LetterComp>
      );
    }

    if (typeof children === 'string' || typeof children === 'number') {
      return (
        <Box
          component="span"
          className="btn-text-content"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: LABEL_PADDING_BY_SIZE[size] || LABEL_PADDING_BY_SIZE.medium,
          }}
        >
          <TypographyComp
            component="span"
            sx={{
              color: 'inherit',
              // line-height and letter-spacing come from the Button-* type
              // tokens, not from MUI's root. Inheriting them pulled in MUI's
              // 0.02857em tracking, which rendered as 0.371px where the token
              // says 0.
              // Figma's "cap height to baseline" vertical trim. The label then
              // centres on its cap height, which is what makes a button's text
              // look centred rather than measured-and-centred.
              ...CAP_HEIGHT_TRIM,
            }}
          >
            {children}
          </TypographyComp>
        </Box>
      );
    }
    return children;
  };

  const renderStartIcon = () => {
    if (avatar && children) {
      const avatarSize     = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;
      const avatarFontSize = size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px';
      return (
        <MuiAvatar
          sx={{
            width: avatarSize,
            height: avatarSize,
            backgroundColor: 'inherit',
            color: 'inherit',
            fontSize: avatarFontSize,
          }}
        >
          {children}
        </MuiAvatar>
      );
    }
    return startIcon;
  };

  // Decorators take precedence over legacy startIcon/endIcon
  const resolvedStartDecorator = startDecorator !== undefined
    ? resolveDecorator(startDecorator, size)
    : undefined;
  const resolvedEndDecorator = endDecorator !== undefined
    ? resolveDecorator(endDecorator, size)
    : undefined;

  // Default the badge size to match the button size when not explicitly set.
  // Badge only ships small/medium/large; "medium" is a safe fallback for any
  // future button sizes that don't have a 1:1 badge mapping.
  const resolvedBadgeSize = badgeSize
    || (size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium');

  const out = (
    <>
      <GlobalStyles styles={{
        '[class*="btn-"] .MuiButton-startIcon, [class*="btn-"] .MuiButton-icon': {
          marginLeft: '0px !important',
          marginRight: '2px !important',
        },
        '[class*="btn-"] .MuiButton-endIcon': {
          marginLeft: '2px !important',
          marginRight: '0px !important',
        },
        // MUI sizes icons per BUTTON size (18/20/22), which silently overrode
        // the Icon component's own scale — a medium button's icon rendered at
        // 20px where the scale says 24. Restate the scale here so the icon is
        // the size the design system says it is, whatever button it sits in.
        '[class*="btn-"] .MuiButton-iconSizeSmall .MuiSvgIcon-root, [class*="btn-"] .MuiButton-iconSizeSmall > *': {
          fontSize: ICON_SIZE_MAP.small + ' !important',
        },
        '[class*="btn-"] .MuiButton-iconSizeMedium .MuiSvgIcon-root, [class*="btn-"] .MuiButton-iconSizeMedium > *': {
          fontSize: ICON_SIZE_MAP.medium + ' !important',
        },
        '[class*="btn-"] .MuiButton-iconSizeLarge .MuiSvgIcon-root, [class*="btn-"] .MuiButton-iconSizeLarge > *': {
          fontSize: ICON_SIZE_MAP.large + ' !important',
        },
      }} />
      <MuiButton
      size={size}
      {...(effectiveFullWidth && { fullWidth: true })}
      disabled={disabled}
      // Icons inside a button are DECORATION. The button owns the accessible
      // name; anything in these slots must not contribute a second one, or a
      // screen-reader user hears the control announced twice ("Delete, Delete
      // button"). Wrapping enforces it structurally — the lib's own <Icon> is
      // already aria-hidden by default, but a raw SvgIcon with titleAccess, an
      // emoji, or a bare string in the slot would otherwise be read out.
      startIcon={resolvedStartDecorator !== undefined
        ? resolvedStartDecorator
        : (avatar ? renderStartIcon() : startIcon)}
      endIcon={resolvedEndDecorator !== undefined ? resolvedEndDecorator : endIcon}
      className={`btn-${variant} ${className}`}
      role="button"
      sx={{
        // Size-aware radius — pulls the Sm/Lg variant so each button size
        // gets the percent-of-its-own-height pixel value. Falls back to the
        // medium token if the size variants aren't defined.
        borderRadius: avatar
          ? 'var(--Large-Button-Height)'
          : (iconOnly || swatch)
            ? (size === 'small'
                ? 'var(--Sm-Button-Icon-Radius, var(--Button-Icon-Radius))'
                : size === 'large'
                  ? 'var(--Lg-Button-Icon-Radius, var(--Button-Icon-Radius))'
                  : 'var(--Button-Icon-Radius)')
            : (size === 'small'
                ? 'var(--Sm-Button-Radius, var(--Button-Radius))'
                : size === 'large'
                  ? 'var(--Lg-Button-Radius, var(--Button-Radius))'
                  : 'var(--Button-Radius)'),
        textTransform: 'none',
        fontWeight: 'inherit',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, transform 0.15s ease-in-out',
        // _bevel = (Button-Bevel% × height) / 100, capped at 20% of height
        // so the inset highlight/lowlight can never bleed into the text band.
        // Text occupies the middle ~60% of a button; a 20% inset on each side
        // (40% total) leaves the text safely clear regardless of bevel%.
        '--_bevel': 'min(calc(var(--Button-Bevel) * var(--_height) / 100), calc(var(--_height) / 5))',

        // Small button — hit target without a size change.
        //
        // The small button stays 24px on every platform; what grows is the
        // area that responds to a tap. --Target is the platform minimum
        // (24 desktop, 44 iOS, 48 Android) and --Platform-Spacer is the room
        // reserved around the button so the enlarged target doesn't sit on
        // top of whatever is next to it.
        //
        // Done with a centred ::before rather than a wrapper element: a
        // wrapper would change Button's DOM, and every consumer positioning,
        // measuring or flex-ing a Button would have to learn about it.
        ...(size === 'small' && {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            minWidth: 'var(--Target, 0px)',
            minHeight: 'var(--Target, 0px)',
          },
        }),

        ...sizingStyles,
        ...variantStyles,

        // Force padding override
        '&.MuiButton-root': {
          padding: sizingStyles.padding ?? '0 var(--Sizing-1)',
        },

        // Icon margins + color inheritance
        // No padding on the slots: the design spaces them with the 2px gap
        // alone, and the extra 2px each side made the icon sit 4px wider than
        // its glyph.
        '& .MuiButton-startIcon': {
          display: 'inherit',
          color: 'inherit',
          marginLeft: '0px !important',
          marginRight: avatar ? '0px !important' : '2px !important',
        },
        ...(avatar && {
          '& .MuiAvatar-root': {
            fontSize: size === 'small' ? 'var(--Button-ExtraSmall-Font-Size)' : size === 'large' ? '18px' : '14px',
          },
        }),
        '& .MuiButton-endIcon': {
          display: 'inherit',
          color: 'inherit',
          marginLeft: '2px !important',
          marginRight: '0px !important',
        },
        '& .MuiSvgIcon-root': { color: 'inherit' },

        '&:focus-visible, &.Mui-focusVisible': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },

        '&.Mui-disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
          pointerEvents: 'none',
          backgroundColor: variantStyles.backgroundColor,
          color: variantStyles.color,
          border: variantStyles.border,
          boxShadow: 'none',
        },

        ...(swatch && {
          border: 'var(--Button-Border-Width) solid var(--Border)',
          padding: '1px',
          width: SIZE_HEIGHT[size] || SIZE_HEIGHT.medium,
          height: SIZE_HEIGHT[size] || SIZE_HEIGHT.medium,
          minWidth: 'unset',
          minHeight: 'unset',
          boxShadow: 'none',
          '--_bevel': '0',
          backgroundColor: 'transparent !important',
          '&:hover': { backgroundColor: 'transparent !important', boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
          '&:hover .btn-swatch-inner': { filter: 'brightness(0.9)' },
        }),
        ...(effectiveFullWidth && { width: '100%' }),
        ...sx,
      }}
      {...props}
      {...(swatch ? { style: { backgroundColor: 'transparent' } } : {})}
    >
      {avatar ? null : swatch ? (
        <Box
          className="btn-swatch-inner"
          style={{
            width: '100%',
            height: '100%',
            // Inner swatch fill — use the size-aware Inner-Radius token
            // so it stays concentric with the outer button corner. Falls
            // back to the old calc() if the new tokens aren't in CSS.
            borderRadius: size === 'small'
              ? 'var(--Sm-Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))'
              : size === 'large'
                ? 'var(--Lg-Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))'
                : 'var(--Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))',
            ...(swatchColor ? { backgroundColor: swatchColor } : {}),
          }}
        />
      ) : renderChildren()}
    </MuiButton>
    </>
  );

  // Wrap in Badge if requested. Done after assembly so all the button-internal
  // styling (variant, size, sizing overrides, focus, etc.) is unaffected — the
  // badge just decorates the corner.
  if (badge) {
    return (
      <DDBadge
        variant={badgeVariant}
        size={resolvedBadgeSize}
        badgeContent={badgeContent}
        dot={badgeDot}
        max={badgeMax}
        anchorOrigin={badgeAnchorOrigin}
        showZero={badgeContent === 0}
      >
        {out}
      </DDBadge>
    );
  }
  return out;
}

// ─── Convenience Exports ──────────────────────────────────────────────────────

// Default
export const DefaultButton        = (p) => <Button variant="default"           {...p} />;
export const DefaultOutlineButton = (p) => <Button variant="default-outline"   {...p} />;

// Solid
export const PrimaryButton          = (p) => <Button variant="primary"            {...p} />;
export const SecondaryButton        = (p) => <Button variant="secondary"          {...p} />;
export const TertiaryButton         = (p) => <Button variant="tertiary"           {...p} />;
export const NeutralButton          = (p) => <Button variant="neutral"            {...p} />;
export const InfoButton             = (p) => <Button variant="info"               {...p} />;
export const SuccessButton          = (p) => <Button variant="success"            {...p} />;
export const WarningButton          = (p) => <Button variant="warning"            {...p} />;
export const ErrorButton            = (p) => <Button variant="error"              {...p} />;
export const DangerButton           = (p) => <Button variant="error"              {...p} />;

// Outline
export const PrimaryOutlineButton   = (p) => <Button variant="primary-outline"    {...p} />;
export const SecondaryOutlineButton = (p) => <Button variant="secondary-outline"  {...p} />;
export const TertiaryOutlineButton  = (p) => <Button variant="tertiary-outline"   {...p} />;
export const NeutralOutlineButton   = (p) => <Button variant="neutral-outline"    {...p} />;
export const InfoOutlineButton      = (p) => <Button variant="info-outline"       {...p} />;
export const SuccessOutlineButton   = (p) => <Button variant="success-outline"    {...p} />;
export const WarningOutlineButton   = (p) => <Button variant="warning-outline"    {...p} />;
export const ErrorOutlineButton     = (p) => <Button variant="error-outline"      {...p} />;

// Light
export const PrimaryLightButton     = (p) => <Button variant="primary-light"      {...p} />;
export const SecondaryLightButton   = (p) => <Button variant="secondary-light"    {...p} />;
export const TertiaryLightButton    = (p) => <Button variant="tertiary-light"     {...p} />;
export const NeutralLightButton     = (p) => <Button variant="neutral-light"      {...p} />;
export const InfoLightButton        = (p) => <Button variant="info-light"         {...p} />;
export const SuccessLightButton     = (p) => <Button variant="success-light"      {...p} />;
export const WarningLightButton     = (p) => <Button variant="warning-light"      {...p} />;
export const ErrorLightButton       = (p) => <Button variant="error-light"        {...p} />;

// Ghost / Text
export const GhostButton  = (p) => <Button variant="ghost" {...p} />;
export const TextButton   = (p) => <Button variant="text"  {...p} />;

// Aliases
export const OutlineButton = (p) => <Button variant="primary-outline" {...p} />;
export const IconButton    = (p) => <Button iconOnly     {...p} />;
export const LetterButton  = (p) => <Button letterNumber {...p} />;
export const AvatarButton  = (p) => <Button avatar       {...p} />;
export const SwatchButton  = (p) => <Button swatch       {...p} />;

export default Button;
