// src/components/Button/Button.js
import React from 'react';
import { Button as ButtonTypography, ButtonSmall as ButtonSmallTypography, ButtonExtraSmall as ButtonExtraSmallTypography } from '../Typography';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Avatar as DDAvatar } from '../Avatar/Avatar';
import { Icon as DDIcon, ICON_SIZE_MAP } from '../Icon/Icon';
import { Badge as DDBadge } from '../Badge/Badge';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, bevelShadow, tokenSegment } from '../_shadows';

// Auto-size mapping for start/end decorators based on Button size
// Padding on the label wrapper — Figma's "Typography Holder", which the design
// system now generates per size mode as --Button-Text-Padding (4 / 4 / 8).
//
// This used to be '4px 2px' at small and medium, so the horizontal was half the
// vertical. The design's value is a single number applied on both axes, which
// widens a small or medium button's label box by 2px each side.
const LABEL_PADDING_BY_SIZE = {
  small:  'var(--Sm-Button-Text-Padding)',
  medium: 'var(--Button-Text-Padding)',
  large:  'var(--Lg-Button-Text-Padding)',
};

// Initials on an avatar inside a button. The design system generates this per
// size mode as --Avatar-Text (14 / 12 / 18), derived from the button height —
// it was three literals, one of which reached for a type-ramp token that is
// not the avatar's.
/* The initials INSIDE a button's avatar decorator — Button-Avatar-Text, which
   is 9 / 12 / 23 and sits on the same 7/12 of the diameter the standalone
   avatar uses. Not --Avatar-Text (12 / 14 / 18): that is the ramp for an
   avatar-ONLY button, whose circle is a different size again
   (Button-Avatar-Only, 24 / 32 / 56). Reading the wrong one put oversized
   initials in a decorator. */
const avatarTextFor = (size) =>
  size === 'small' ? 'var(--Sm-Button-Avatar-Text, 9px)'
    : size === 'large' ? 'var(--Lg-Button-Avatar-Text, 23px)'
      : 'var(--Button-Avatar-Text, 12px)';

/* Decorator sizes, in PIXELS, from Figma's Component-Size ramp.
 *
 * These used to name standalone Avatar/Icon sizes, and that was the mistake —
 * a button's decorator has its OWN ramp (Button-Avatar, Button-Icon) which does
 * not line up with the standalone ones. Two of the six were wrong because of
 * it: a medium button drew a 24px avatar where the design says 20, and both
 * small and medium drew the wrong icon.
 *
 * 20 is not a named size in either component, which is precisely why the
 * mapping could not be expressed as a name. Both take a pixel size instead. */
/* Button-Avatar and Button-Icon from Figma's Component-Size collection, at the
   Desktop device. Both chain Component-Size -> Devices-Type, so the published
   CSS carries the iOS and Android values too and `data-platform` picks between
   them; these numbers are the decorator FALLBACK, not the whole story.
 
   Small icon was 20 here, with a note saying it matched Button-Icon and that a
   16px icon "looked underfilled beside a 20px avatar". Neither held: Button-Icon
   is 16 at small, and the small decorator avatar is 16 too — so the icon was
   never beside a 20px avatar. */
const DECORATOR_SIZE_MAP = {
  small:  { avatar: 16, icon: 16 },
  medium: { avatar: 20, icon: 20 },
  large:  { avatar: 40, icon: 32 },
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
    // Button avatars: 16 / 20 / 40 by button size, matching Button-Avatar, AND
    // 2px horizontal padding so they sit correctly beside the label or within
    // a group segment. insideButton applies the 2px L/R margin.
    return React.cloneElement(node, {
      size: 'custom', customSize: mapping.avatar, insideButton: true,
    });
  }
  if (node.type === DDIcon) {
    // 16 / 20 / 32 — Button-Icon, the one icon ramp (decorators and the
    // icon-only type alike; Button-Icon-Only was retired 2026-10-20).
    return React.cloneElement(node, { size: 'custom', fontSize: mapping.icon });
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
 *     border-radius: var(--Button-Inner-Focus-Radius)  ← radius - 1
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
 * GHOST   — variant="ghost"  (alias: "text")
 *
 * The LIGHT shape was removed — see normalizeButtonVariant. "{color}-light"
 * still resolves, to the SOLID button of that color, and warns once in dev.
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
// Verified against Figma's Component-Elevations collection, which carries a
// Standard and an Elevated mode per component:
//
//   Standard  resting  none      (Figma sets every layer's Drop-Color to a:0)
//   Standard  hover    Level 1
//   Elevated  resting  Level 1
//   Elevated  hover    Level 2
//
// This block previously claimed Level 1/2 for standard and Level 2/3 for
// elevated — one level too high on all four, and wrong against both the code
// below and the Figma file. The code was right; only the comment was not.
//
// A standard button therefore has NO resting shadow, and an elevated one rests
// at Level 1, which is deliberately slight: 0.3/0.5/0.5/0 plus 1/2/2.1/-3.7 at
// roughly 0.31 alpha. Standard and Elevated are meant to separate on HOVER, not
// at rest, so the two looking near-identical sitting still is the design.

// ─── Variant Style Builders ───────────────────────────────────────────────────
// bevelShadow lives in src/components/_shadows.js so both Button and Slider
// can share it. Consumers must set --_bevel and --_height on the element.

/* A SELECTED button reads one pixel heavier than rest: 2px on a 1px brand,
   3px on a 2px one (--Button-Selected-Border-Width). */
const selectedBorderWidth = () => 'var(--Button-Border-Width)';
/* The extra selected pixel is an INNER RING (an inset box-shadow inside the
   border), not a thicker border: a button sizes to its content, so a 1px
   heavier border made a selected button 2px wider and shifted its contents —
   Figma's stroke sits inside and changes nothing. */
/* A selected button is --Button-Selected-Border-Width: the rest width + 1px
   (2px or 3px), generated alongside --Button-Border-Width. The ring is the
   difference, so it is 1px either way; the fallback states the same rule for
   a system published before the selected token existed. */
const selectedRing = (C) =>
  `inset 0 0 0 calc(var(--Button-Selected-Border-Width, calc(var(--Button-Border-Width) + 1px)) - var(--Button-Border-Width)) var(--Buttons-${C}-Border)`;
const withRing = (selected, C, shadow) =>
  !selected ? shadow : (!shadow || shadow === 'none' ? selectedRing(C) : `${selectedRing(C)}, ${shadow}`);

function solidStyles(color, elevated = false, selected = false, size = 'medium') {
  const C = seg(color);
  // Selected is pressed in: the bevel's colors swap, as Figma draws it.
  const bevel = bevelShadow(color, size, selected);
  const restLevel = elevated ? SHADOW_LEVEL_1 : 'none';
  const hoverLevel = elevated ? SHADOW_LEVEL_2 : SHADOW_LEVEL_1;
  const restShadow = restLevel === 'none' ? bevel : `${bevel}, ${restLevel}`;
  const hoverShadow = `${bevel}, ${hoverLevel}`;
  /* The label is MUTED at rest and goes full strength on interaction.
     Figma binds Buttons/Quiet on Default and Buttons/Text on Hover, Pressed
     and Focus-Visible — uniformly, across all 80 variants of the set — and
     the icon takes the same token as the label, which it gets here for free
     because Icon paints `currentColor`.
     SELECTED is the exception: it holds Text throughout, at rest and on
     interaction alike. A selected segment is the engaged one, and muting its
     label would make the chosen option read quieter than the ones beside it.
     `selected` decides WHICH pair applies by deciding whether there is a
     fill — Quiet/Text with one, Outline-Quiet/Outline-Text without — and then
     pins to that pair's Text end.

     Disabled takes the REST token plus opacity, since disabled is the resting
     button dimmed and nothing else. For a selected button that rest token is
     Text, so a disabled selected button stays legible rather than dropping
     two steps at once. */
  const restText = selected ? `var(--Buttons-${C}-Text)` : `var(--Buttons-${C}-Quiet)`;
  const activeText = `var(--Buttons-${C}-Text)`;
  return {
    backgroundColor: `var(--Buttons-${C}-Button)`,
    color: restText,
    border: `${selectedBorderWidth(selected)} solid var(--Buttons-${C}-Border)`,
    boxShadow: withRing(selected, C, restShadow),
    position: 'relative',
    zIndex: 1,
    '& .MuiTouchRipple-rippleVisible': {
      color: `var(--Buttons-${C}-Hover)`,
      zIndex: -1,
    },
    '&:hover': {
      backgroundColor: `var(--Buttons-${C}-Hover)`,
      color: activeText,
      boxShadow: withRing(selected, C, hoverShadow),
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: `var(--Buttons-${C}-Pressed)`,
      color: activeText,
      boxShadow: withRing(selected, C, bevel), // No elevation on press
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: `var(--Buttons-${C}-Button)`,
      color: activeText,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '1px',
    },
    '& .MuiTouchRipple-root': { zIndex: -1 },
    '& .MuiTypography-root': { zIndex: 1 },
    '& .MuiButton-icon': { zIndex: 1 },
  };
}

function outlineStyles(color, elevated = false, selected = false, size = 'medium') {
  const C = seg(color);
  /* A SELECTED outline is filled (Buttons::Button), and Figma bevels it the
     way it bevels every selected button — pressed in. Unselected has no fill
     and so no bevel. */
  const pressedBevel = selected ? withRing(true, C, bevelShadow(color, size, true)) : null;
  /* Elevation as the solid style has it — none (or Level 1 if elevated) at
     rest, one level up on hover, none while pressed. It needs an OPAQUE body
     to read: a shadow under a transparent button shows through it. */
  const restLevel = elevated ? SHADOW_LEVEL_1 : 'none';
  const hoverLevel = elevated ? SHADOW_LEVEL_2 : SHADOW_LEVEL_1;
  return {
    /* SELECTED ACTUALLY GAINS A FILL. The comment below has said so for a
       long time and the code did not do it — selected changed the label color
       and nothing else. On a neutral surface that reads, because
       Outline-Quiet and Text are far apart there. On a THEMED surface they
       are not: with data-theme="Info" both resolve to Info-Color-11, so a
       selected outline button and an unselected one came out pixel
       identical. That is how a pagination lost its current page.
       Pressed is the token the design names for it — Figma's Pagination
       Number set fills State=Selected with Pressed — and it is the right one
       structurally too: Pressed is derived to sit AGAINST the surface, so it
       cannot collapse into it the way Button can. */
    /* Unselected, the button is painted in the SURFACE's own color —
       --Background, then --Hover / --Pressed below. Figma's outline Button-Fill
       binds Background. It was transparent, so it matched the surface by
       accident and its elevation shadow showed through it. */
    /* SELECTED takes the button's own colors — Button at rest, then the
       generated --Buttons-{C}-Hover / -Pressed — with --Buttons-{C}-Text on
       top, which the generator holds at 4.5:1 on all three. Figma's selected
       outline fills Buttons::Button and steps to Hover and Pressed. It used to
       rest on Pressed and hover to the surface scrim, so a selected button got
       LIGHTER on hover and never showed its own color. */
    backgroundColor: selected ? `var(--Buttons-${C}-Button)` : 'var(--Background)',
    /* Buttons::Outline-Text — the label color for a button with NO fill.
       This was --Text, the surface's own body color, so an outline button's
       label ignored its palette entirely: a success outline and an error
       outline had identical text. The token exists per palette and nothing in
       this library read it, which is why its one gap (BlackWhite) went
       unnoticed — a token nobody consumes cannot be missed.

       It is a different color from --Buttons-{C}-Text on purpose. That one is
       the label ON the fill and is contrast-checked against it; Outline-Text is
       the label on the SURFACE, checked against that instead. Figma keeps them
       apart in the same way: the Selected state, which is the only outline
       variant that gains a fill, is also the only one that switches to
       Buttons::Text.

       Rest takes Outline-QUIET and interaction takes Outline-Text — the same
       two-step the solid style makes, one row down the table. This read
       Outline-Text in every state, so an outline button had no label change
       to give on hover at all; the only feedback was the surface scrim.
       Outline-Quiet had no consumer anywhere in the library until now, which
       is why its absence was easy to read as "the token is unused" rather
       than "the rest state is missing". */
    /* Selected gains a FILL, so it swaps to the filled pair — and pins to
       that pair's TEXT end, because a selected segment is the engaged one. */
    color: selected
      ? `var(--Buttons-${C}-Text)`
      /* Falls back to the surface's --Outline-Quiet: published systems emit
         the per-palette name for Default only, and an undefined var() makes
         the label inherit its parent — loud, not quiet. A fallback is right
         here because it fires only when the name is undefined. */
      : `var(--Buttons-${C}-Outline-Quiet, var(--Outline-Quiet))`,
    border: `${selectedBorderWidth(selected)} solid var(--Buttons-${C}-Border)`,
    boxShadow: selected ? pressedBevel : restLevel,
    /* A SELECTED outline is filled (Buttons::Button), so an avatar decorator's
       ring follows the LABEL color on that fill — Buttons::Text — as Figma
       draws it. The button Border would be a ring of the fill's own outline
       color, which on the fill is the weaker of the two. */
    ...(selected && { '& .avatar': { borderColor: `var(--Buttons-${C}-Text)` } }),
    // Outline (like Ghost) has no fill of its own, so its hover/active
    // feedback comes from the surface --Hover / --Pressed scrim — a
    // subtle tone-aware overlay that reads correctly on any surface
    // tone. Using --Buttons-{C}-Hover would paint a solid colored
    // background and lose the "outline" character of the variant.
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      backgroundColor: selected ? `var(--Buttons-${C}-Hover)` : 'var(--Hover)',
      color: selected
        ? `var(--Buttons-${C}-Text)`
        : `var(--Buttons-${C}-Outline-Text)`,
      // Selected lifts too, as the selected solid does (Figma's selected outline Hover).
      boxShadow: selected ? `${pressedBevel}, ${hoverLevel}` : hoverLevel,
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: selected ? `var(--Buttons-${C}-Pressed)` : 'var(--Pressed)',
      boxShadow: selected ? pressedBevel : 'none', // No elevation on press, as solid
      color: selected
        ? `var(--Buttons-${C}-Text)`
        : `var(--Buttons-${C}-Outline-Text)`,
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: selected ? `var(--Buttons-${C}-Button)` : 'var(--Background)',
      color: selected
        ? `var(--Buttons-${C}-Text)`
        : `var(--Buttons-${C}-Outline-Text)`,
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '1px',
    },
  };
}

function ghostStyles(isTextContent, selected = false, color = 'default') {
  /* The PALETTE is the Buttons mode, as solid and outline take it:
     variant="ghost" is the Default palette, "{color}-ghost" any other. It used
     to be Default whatever the mode — Figma's ghost binds Buttons ›
     Outline-Quiet / Outline-Text / Border, so a ghost inside a Primary
     Buttons mode was primary in the design and default in code. */
  const C = seg(color);
  /* Quiet at rest, full-strength when engaged — the same two-step outline
     buttons make, on the Default outline pair:

       rest, unselected          Buttons/Outline-Quiet
       rest, selected            Buttons/Outline-Text
       hover, pressed, focus     Buttons/Outline-Text

     Text ghosts used to read like links — --Hotlink, underlined — as a
     deliberate departure from Figma. Decided 2026-10-20 to drop that: the
     Figma set binds Outline-Quiet / Outline-Text with no underline, and a
     ghost is a button, not a link. A SELECTED ghost rests on Outline-Text,
     as Figma draws it (2026-10-27): the chosen one reads heavier than its
     unselected neighbours, on top of its border and ring. (For one day,
     2026-10-26, it rested on Quiet; Figma has since settled it.)
     (isTextContent no longer changes the color.) */
  void isTextContent;
  const quiet = `var(--Buttons-${C}-Outline-Quiet, var(--Outline-Quiet))`;
  const loud = `var(--Buttons-${C}-Outline-Text)`;
  return {
    // A selected ghost is painted in its surface, like an outline button —
    // Figma's selected ghost fills Background under its Border stroke.
    backgroundColor: selected ? 'var(--Background)' : 'transparent',
    color: selected ? loud : quiet,
    /* A SELECTED ghost draws its border — Figma's selected ghost strokes
       Buttons::Border at 1px, inside, as the mark that tells it from an
       unselected one (which has no fill and no stroke). The transparent border
       otherwise holds the same box, so selecting it never moves anything. */
    border: selected
      ? `var(--Button-Border-Width) solid var(--Buttons-${C}-Border)`
      : 'var(--Button-Border-Width) solid transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    // A selected ghost draws the selected border width like every selected
    // button: its border at the rest width plus the inner ring (2px or 3px).
    ...(selected && { boxShadow: selectedRing(C) }),
    '& .MuiTouchRipple-rippleVisible': {
      color: 'var(--Hover)',
    },
    '&:hover': {
      // Ghost and Outline use the surface --Hover / --Pressed scrim by
      // design — they're the only variants without a fill of their own,
      // so they need a tone-aware overlay tint to indicate hover. Solid
      // variants use --Buttons-{C}-Hover instead.
      backgroundColor: 'var(--Hover)',
      /* Lifts like an outline button: Figma's ghost Hover variants (selected
         and not) carry the Level 1 elevation on Button-Effect. The hover fill
         is the opaque --Hover, so the shadow has a body to sit under. */
      boxShadow: withRing(selected, C, SHADOW_LEVEL_1),
      color: loud,
      ...(!selected && { transform: 'translateY(-1px)' }),
    },
    '&:active': {
      backgroundColor: 'var(--Pressed)',
      boxShadow: withRing(selected, C, 'none'),
      color: loud,
      ...(!selected && { transform: 'translateY(0)' }),
    },
    '&.Mui-focusVisible': {
      backgroundColor: selected ? 'var(--Background)' : 'transparent',
      outline: '2px solid var(--Focus-Visible)',
      outlineOffset: '1px',
      /* Focus-Visible takes the interaction label too. Figma treats it as one
         of the three active states. */
      color: loud,
    },
  };
}

// The `-light` shape is removed. It painted --<C>-Color-11 with
// --Text-<C>-Color-11, a tinted fill that was never a shape in the Figma
// component; shape there is solid / outline / ghost / text, and color now
// arrives as a Buttons MODE.
//
// A hard delete would have been silent: an unknown variant falls through to
// `variantMap.default`, so every existing `X-light` call site would have
// repainted as a solid brand-default button with no error. Strip the suffix to
// the SOLID color of the same name and say so once in development.
const LIGHT_SUFFIX = /-light$/;
const warnedVariants = new Set();

export function normalizeButtonVariant(variant) {
  const v = String(variant || 'default');
  if (!LIGHT_SUFFIX.test(v)) return v;
  const base = v.replace(LIGHT_SUFFIX, '');
  if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
    warnedVariants.add(v);
    console.warn(
      '[Button] variant="' + v + '" — the -light shape was removed. Rendering ' +
      'variant="' + base + '" (solid). Use a Buttons mode for color and ' +
      'solid / -outline / ghost / text for shape.',
    );
  }
  return base;
}

export const BUTTON_CONTENT_TYPES = ['text', 'iconOnly', 'letterNumber', 'avatar'];

const warnedContentType = new Set();

function warnContentTypeOnce(key, message) {
  if (process.env.NODE_ENV === 'production' || warnedContentType.has(key)) return;
  warnedContentType.add(key);
  // eslint-disable-next-line no-console
  console.warn('[Button] ' + message);
}

/**
 * One axis out of three booleans.
 *
 * Figma models TYPE as a single dropdown — text | iconOnly | letterNumber |
 * Avatar — so exactly one is true at a time. Three independent booleans can
 * say things the design cannot, and `iconOnly` with `avatar` is not a third
 * kind of button; it is a mistake that renders anyway.
 */
function resolveContentType(contentType, flags) {
  if (contentType !== undefined) {
    const v = String(contentType);
    if (!BUTTON_CONTENT_TYPES.includes(v)) {
      warnContentTypeOnce('bad:' + v,
        'contentType="' + v + '" is not a type. Use one of ' +
        BUTTON_CONTENT_TYPES.join(' | ') + '. Rendering text.');
      return { iconOnly: false, letterNumber: false, avatar: false };
    }
    return {
      iconOnly: v === 'iconOnly',
      letterNumber: v === 'letterNumber',
      avatar: v === 'avatar',
    };
  }

  const on = BUTTON_CONTENT_TYPES.filter(k => k !== 'text' && flags[k]);
  if (on.length > 1) {
    warnContentTypeOnce('multi:' + on.join(','),
      on.join(' and ') + ' are both set. Type is ONE axis in the design — ' +
      'text | iconOnly | letterNumber | avatar — so there is no drawing for ' +
      'the combination. Using ' + on[0] + '. Prefer contentType="' + on[0] + '".');
    return {
      iconOnly: on[0] === 'iconOnly',
      letterNumber: on[0] === 'letterNumber',
      avatar: on[0] === 'avatar',
    };
  }
  return flags;
}

let warnedSwatch = false;

function warnSwatchOnce() {
  if (process.env.NODE_ENV === 'production' || warnedSwatch) return;
  warnedSwatch = true;
  // eslint-disable-next-line no-console
  console.warn(
    '[Button] `swatch` is retired — use the Swatch component. A swatch uses ' +
    'neither of Button\'s axes: its color is data from a picker rather than a ' +
    'palette, and it has no solid / outline / ghost shape. Swatch also fixes ' +
    'the corner: this read --Button-Icon-Radius, which is why swatches stayed ' +
    'square when a brand set a large radius.',
  );
}

const warnedUnknown = new Set();

function warnUnknownVariant(variant, map) {
  if (process.env.NODE_ENV !== 'production' && !warnedUnknown.has(variant)) {
    warnedUnknown.add(variant);
    // eslint-disable-next-line no-console
    console.warn(
      '[Button] variant="' + variant + '" is not a variant. Rendering the ' +
      'default. Shape is {color} (solid) / {color}-outline / {color}-ghost — ' +
      'ghost and text alone are the Default palette.',
    );
  }
  return map.default;
}

function buildVariantMap(isTextContent, elevated = false, selected = false, size = 'medium') {
  const map = {};
  COLORS.forEach((color) => {
    map[color]                = solidStyles(color, elevated, selected, size);
    map[`${color}-outline`]   = outlineStyles(color, elevated, selected, size);
    map[`${color}-ghost`]     = ghostStyles(isTextContent, selected, color);
  });
  // Black/white — solid and outline.
  //
  // It stayed out of COLORS because that loop used to build `-light` too, which
  // reads --<C>-Color-11, and BlackWhite has no tonal ramp to take a Color-11
  // from. With -light gone the exclusion no longer earns its keep, but the two
  // lines below are explicit and cost nothing, so they stay until the Figma
  // side settles. Solid and outline need only --Buttons-BlackWhite-{Button,Text,Border,
  // Hover,Pressed,Highlight,Lowlight}, which the system emits in every theme
  // and surface block — so the button resolves to black on a light surface and
  // white on a dark one wherever it is placed, with no prop change.
  map['black-white']         = solidStyles('black-white', elevated, selected, size);
  map['black-white-outline'] = outlineStyles('black-white', elevated, selected, size);
  map['black-white-ghost']   = ghostStyles(isTextContent, selected, 'black-white');

  map['danger']         = solidStyles('error', elevated, selected, size);
  map['outline']        = outlineStyles('default', elevated, selected, size);
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
  small:  { minHeight: 'var(--Small-Button-Height)', minWidth: 'var(--Button-Min-Width)', fontSize: 'var(--Sm-Button-Text)', '--_height': 'var(--Small-Button-Height)' },
  large:  { minHeight: 'var(--Large-Button-Height)', minWidth: 'var(--Lg-Button-Min-Width, var(--Button-Min-Width))', fontSize: 'var(--Lg-Button-Text)', '--_height': 'var(--Large-Button-Height)' },
  medium: {
    minHeight: 'var(--Button-Height)',
    minWidth:  'var(--Button-Min-Width)',
    fontSize:  'var(--Button-Text)',
    '--_height': 'var(--Button-Height)',
  },
};

function getSizingStyles({ size, iconOnly, letterNumber, avatar, swatch }) {
  const base       = SIZE_BASE[size] || SIZE_BASE.medium;
  const squareSize = SIZE_HEIGHT[size] || SIZE_HEIGHT.medium;

  // Icon / Avatar — fixed square, no padding, no min-width/height
  if (iconOnly) {
    const fontSize = avatar
      ? (avatarTextFor(size))
      : (size === 'small' ? '0.875rem' : base.fontSize);
    return {
      height:  squareSize,
      width:   squareSize,
      minWidth: 'unset',
      minHeight: 'unset',
      fontSize,
      padding: '0',
      '--_height': squareSize,
      /* ONE icon ramp, Button-Icon (16 / 20 / 32), for a decorator and for the
         icon-only type alike. Decided 2026-10-20: the Figma icon-only button
         resolves its icon through Icons & Avatars `in-button` -> Button-Icon,
         and the smaller icon is the intended one. The separate
         Button-Icon-Only ramp (16 / 24 / 40) is retired. */
      ...(!avatar && !swatch && {
        '& .MuiSvgIcon-root, & > *': {
          fontSize: size === 'small'
            ? 'var(--Sm-Button-Icon, var(--Button-Icon))'
            : size === 'large'
              ? 'var(--Lg-Button-Icon, var(--Button-Icon))'
              : 'var(--Button-Icon)',
        },
      }),
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
  /* The border sits INSIDE the padding, as Figma's stroke sits inside its
     frame: it costs no width there, and here it was added on top, so every
     button came out 2px wider than its design (4px at a 2px border). */
  return {
    ...base,
    padding: size === 'large'
      ? '0 calc(var(--Lg-Button-Padding) - var(--Button-Border-Width))'
      : '0 calc(var(--Button-Padding) - var(--Button-Border-Width))',
  };
}

// ─── Static sheet ─────────────────────────────────────────────────────────────
//
// Button used to be MUI's Button with an sx on top; it is its own <button> now,
// so this sheet carries both layers: the reset MUI's ButtonBase and Button gave
// it, then the design's own rules over the same tokens. There is no ripple —
// the Figma Button set draws none; Pressed is the palette's Pressed fill.
//
// COLOR / SHAPE / STATE: the style builders above still compute every value
// (they are the one place the variant logic lives), and the values travel to
// the element as custom properties — --_b-bg / -fg / -bd / -sh at rest, then
// -h (hover), -a (pressed) and -f (focus). A handful of fixed rules read them.
// The values resolve on the button itself, exactly where the sx did.
//
// SIZE x TYPE: a generated class each (15 of them), from getSizingStyles.
//
// State rules weigh one class + one pseudo-class, as emotion's did, so a
// caller's sx state rule still wins over them.

const SxBox = lazySxBox('Button');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

const kebab = (k) => (k.startsWith('--') ? k : k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
/** A style object (camelCase, nested '&…' selectors) as CSS rules under `sel`. */
function toCss(sel, obj) {
  const own = []; const nested = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') nested.push(...toCss(k.split(',').map((part) => part.trim().replace(/&/g, sel)).join(','), v));
    else if (v !== undefined && v !== false) own.push(`${kebab(k)}:${v}`);
  }
  return (own.length ? [`${sel}{${own.join(';')}}`] : []).concat(nested);
}

const SIZES = ['small', 'medium', 'large'];
const TYPES = ['text', 'letter', 'icon', 'avatar', 'swatch'];
const radiusFor = (type, size) => {
  if (type === 'avatar') {
    return size === 'small' ? 'var(--Small-Button-Height, var(--Button-Height))'
      : size === 'large' ? 'var(--Large-Button-Height, var(--Button-Height))' : 'var(--Button-Height)';
  }
  if (type === 'icon' || type === 'swatch') {
    return size === 'small' ? 'var(--Sm-Button-Icon-Radius, var(--Button-Icon-Radius))'
      : size === 'large' ? 'var(--Lg-Button-Icon-Radius, var(--Button-Icon-Radius))' : 'var(--Button-Icon-Radius)';
  }
  return size === 'small' ? 'var(--Sm-Button-Radius, var(--Button-Radius))'
    : size === 'large' ? 'var(--Lg-Button-Radius, var(--Button-Radius))' : 'var(--Button-Radius)';
};
const sizingFor = (type, size) => getSizingStyles({
  size,
  iconOnly: type === 'icon' || type === 'avatar' || type === 'swatch',
  letterNumber: type === 'letter',
  avatar: type === 'avatar',
  swatch: type === 'swatch',
});

/* What MUI's root carried that still shows: its font stack and tracking reach
   any child that is not the label (a raw node, an icon's text). Kept as they
   rendered; the label sets its own face and tracking from the Button tokens. */
const MUI_FONT = '"Roboto","Helvetica","Arial",sans-serif';
const TRIM = 'text-box-trim:trim-both;text-box-edge:cap alphabetic;padding-top:0;padding-bottom:0';

registerStaticStyles('omni-button', [
  /* The icon slots, as the library has always restated them over MUI's own
     margins and per-size icon sizes: --Button-Icon (16 / 20 / 32) is the size
     generated for an icon in a button, not the generic Icon ramp. */
  '[class*="btn-"] .MuiButton-startIcon,[class*="btn-"] .MuiButton-icon{margin-left:0px !important;margin-right:2px !important}',
  '[class*="btn-"] .MuiButton-endIcon{margin-left:2px !important;margin-right:0px !important}',
  '[class*="btn-"] .MuiButton-iconSizeSmall .MuiSvgIcon-root,[class*="btn-"] .MuiButton-iconSizeSmall > *{font-size:var(--Sm-Button-Icon) !important}',
  '[class*="btn-"] .MuiButton-iconSizeMedium .MuiSvgIcon-root,[class*="btn-"] .MuiButton-iconSizeMedium > *{font-size:var(--Button-Icon) !important}',
  '[class*="btn-"] .MuiButton-iconSizeLarge .MuiSvgIcon-root,[class*="btn-"] .MuiButton-iconSizeLarge > *{font-size:var(--Lg-Button-Icon) !important}',
  // The reset (MUI ButtonBase + Button), then the base every button shares.
  '.omni-btn{display:inline-flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;border-radius:0;padding:0;'
    + 'cursor:pointer;user-select:none;vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;text-decoration:none;color:inherit;'
    + `font-family:${MUI_FONT};font-size:0.875rem;letter-spacing:0.02857em;min-width:64px;`
    + 'text-transform:none;font-weight:inherit;line-height:1;white-space:nowrap;flex-shrink:0;'
    + 'transition:background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, transform 0.15s ease-in-out;'
    /* _bevel = (Button-Bevel% x height) / 100, capped at 20% of height so the
       inset highlight/lowlight never bleeds into the text band. */
    + '--_bevel:min(calc(var(--Button-Bevel) * var(--_height) / 100), calc(var(--_height) / 5))}',
  '.omni-btn::-moz-focus-inner{border-style:none}',
  '@media print{.omni-btn{color-adjust:exact}}',
  /* A zero-width character before a button with a start icon, as MUI drew it:
     it gives the row a text baseline. */
  '.omni-btn-hasstart::before{content:"\\200b";width:0;overflow:hidden}',
  /* Small button — hit target without a size change. --Target is the platform
     minimum (24 desktop, 44 iOS, 48 Android); a centred ::before carries it,
     so Button's DOM does not change. */
  '.omni-btn-small{position:relative}',
  '.omni-btn-small::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%;height:100%;min-width:var(--Target, 0px);min-height:var(--Target, 0px)}',
  /* The rules that reach INTO the button (an icon-only button sizing its
     icon) carry .omni-btn as well: the child may still be styled by emotion,
     which appends its rules after this sheet, and the button's rule has to
     win that tie as it did when both were emotion's. */
  ...SIZES.flatMap((size) => TYPES.flatMap((type) => {
    const sel = `.omni-btn-z-${type}-${size}`;
    return toCss(sel, { borderRadius: radiusFor(type, size), ...sizingFor(type, size) })
      .map((rule) => (rule.startsWith(sel + '{') ? rule : rule.split(sel).join('.omni-btn' + sel)));
  })),
  // Color / shape / state, from the builders' values.
  '.omni-btn-v{background-color:var(--_b-bg);color:var(--_b-fg);border:var(--_b-bd);box-shadow:var(--_b-sh)}',
  '.omni-btn-solid{position:relative;z-index:1}',
  '.omni-btn-solid .MuiTypography-root,.omni-btn-solid .MuiButton-icon{z-index:1}',
  '.omni-btn-ghost{text-decoration:none}',
  '.omni-btn-avring .avatar{border-color:var(--_b-avring)}',
  '.omni-btn-v:hover{background-color:var(--_b-bg-h);color:var(--_b-fg-h);box-shadow:var(--_b-sh-h)}',
  '.omni-btn-lift:hover{transform:translateY(-1px)}',
  '.omni-btn-v:active{background-color:var(--_b-bg-a);color:var(--_b-fg-a);box-shadow:var(--_b-sh-a)}',
  '.omni-btn-lift:active{transform:translateY(0)}',
  '.omni-btn-v:focus-visible{background-color:var(--_b-bg-f);color:var(--_b-fg-f);outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  // Icon slots inside this button.
  '.omni-btn .MuiButton-startIcon{display:inherit;color:inherit;margin-left:0px !important;margin-right:2px !important}',
  '.omni-btn-avatar .MuiButton-startIcon{margin-right:0px !important}',
  '.omni-btn-avatar .MuiAvatar-root{font-size:var(--_b-avtext)}',
  '.omni-btn .MuiButton-endIcon{display:inherit;color:inherit;margin-left:2px !important;margin-right:0px !important}',
  '.omni-btn .MuiSvgIcon-root{color:inherit}',
  '.omni-btn:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
  /* Disabled is the RESTING button with opacity applied, and nothing else —
     Figma's Disabled variant of every Type is its Default with opacity 0.38 on
     the whole component, effects included. */
  '.omni-btn:disabled,.omni-btn.Mui-disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed;pointer-events:none;background-color:var(--_b-bg-d);color:var(--_b-fg-d);border:var(--_b-bd-d)}',
  // The retired swatch type: its overrides replaced the variant's states.
  '.omni-btn-swatch{border:var(--Button-Border-Width) solid var(--Border);min-width:unset;min-height:unset;box-shadow:none;--_bevel:0;background-color:transparent !important}',
  '.omni-btn-swatch:hover{background-color:transparent !important;box-shadow:none;color:var(--_b-fg);transform:none}',
  '.omni-btn-swatch:active{box-shadow:none;color:var(--_b-fg);background-color:var(--_b-bg);transform:none}',
  '.omni-btn-swatch:hover .btn-swatch-inner{filter:brightness(0.9)}',
  '.omni-btn-full{width:100%}',
  // The decorator avatar MUI drew for an avatar button with text.
  `.omni-btn-muiavatar{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:${MUI_FONT};`
    + 'line-height:1;border-radius:50%;overflow:hidden;user-select:none;width:var(--_b-avsize);height:var(--_b-avsize);'
    + 'background-color:inherit;color:inherit;font-size:var(--_b-avtext)}',
  // The label and the letter / number, centred on their cap height.
  '.omni-btn-textbox{display:inline-flex;align-items:center}',
  ...SIZES.map((size) => `.omni-btn-textbox-${size}{padding:${LABEL_PADDING_BY_SIZE[size]}}`),
  '.omni-btn .omni-btn-letter{display:inline-block;text-align:center;padding:4px calc(4px - var(--Button-Border-Width));line-height:1}',
  /* Figma binds Dynamic-Button-Number-Font-Size: 12 / 14 / 16. The generator
     emits no variable for it yet, so the fallbacks carry it. */
  '.omni-btn .omni-btn-letter-small{font-size:var(--Sm-Button-Number-Font-Size, 12px)}',
  '.omni-btn .omni-btn-letter-medium{font-size:var(--Button-Number-Font-Size, 14px)}',
  '.omni-btn .omni-btn-letter-large{font-size:var(--Lg-Button-Number-Font-Size, 16px)}',
  `@supports (text-box-edge: cap alphabetic){.omni-btn .omni-btn-letter{${TRIM}}.omni-btn .omni-btn-label{${TRIM}}}`,
].join('\n'));

/** The variant's values as the custom properties the sheet reads. */
function variantVars(v) {
  const h = v['&:hover'] || {}; const a = v['&:active'] || {}; const f = v['&.Mui-focusVisible'] || {};
  return {
    '--_b-bg': v.backgroundColor, '--_b-fg': v.color, '--_b-bd': v.border, '--_b-sh': v.boxShadow || 'none',
    '--_b-bg-h': h.backgroundColor, '--_b-fg-h': h.color, '--_b-sh-h': h.boxShadow || 'none',
    '--_b-bg-a': a.backgroundColor, '--_b-fg-a': a.color, '--_b-sh-a': a.boxShadow || 'none',
    '--_b-bg-f': f.backgroundColor, '--_b-fg-f': f.color,
    /* The disabled look restates the VARIANT's rest values on their own names,
       so a parent that re-points --_b-bg / -fg (a ButtonGroup segment) does
       not change how the disabled button reads. */
    '--_b-bg-d': v.backgroundColor, '--_b-fg-d': v.color, '--_b-bd-d': v.border,
    ...(v['& .avatar'] ? { '--_b-avring': v['& .avatar'].borderColor } : {}),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

/* forwardRef, and it is not a nicety.
 *
 * MUI's Tooltip positions itself against its child and needs a ref to do it;
 * Popover takes an `anchorRef` and reads getBoundingClientRect off it. With a
 * plain function component both fail — React warns "Function components
 * cannot be given refs", the ref stays null, and the tooltip or panel has
 * nothing to anchor to. */
export const Button = React.forwardRef(function Button({
  variant = 'default',
  size = 'medium',
  elevated = false,
  // Pass `selected` when the button represents a toggled-on state (e.g. the
  // active option in a ButtonGroup). Suppresses the hover translateY lift
  // so a selected button doesn't animate when the user hovers it again.
  selected = false,
  fullWidth = false,
  disabled = false,
  /* Figma's TYPE axis — one dropdown, four exclusive values.

     Named `contentType` and not `type` because `type` is the HTML button
     attribute: a form's `type="submit"` must keep working. The three booleans
     below are what this replaces; they are still accepted and warn once. */
  contentType,
  iconOnly = false,
  letterNumber = false,
  avatar = false,
  /* RETIRED — use the Swatch component. Still rendered (the studio's color
     picker uses it), and warns once. */
  swatch = false,
  swatchColor,
  startIcon,
  endIcon,
  startDecorator,
  endDecorator,
  // Badge — optional count/status indicator anchored to the button corner.
  badge = false,
  badgeContent,
  badgeVariant = 'error',
  // Forwarded as the caller gave it, so Badge's own warning fires only when
  // someone actually passes the removed prop.
  badgeSize,
  badgeDot = false,
  badgeMax = 99,
  badgeAnchorOrigin = { vertical: 'top', horizontal: 'right' },
  /* The element to render. A button, or an <a> when there is an href. */
  component,
  type,
  tabIndex,
  style,
  children,
  className = '',
  sx,
  ...props
}, ref) {
  useStaticStyles('omni-button');
  /* contentType wins when given; otherwise the booleans are read as before. */
  if (swatch) warnSwatchOnce();
  const t = resolveContentType(contentType, { iconOnly, letterNumber, avatar });
  iconOnly     = t.iconOnly;
  letterNumber = t.letterNumber;
  avatar       = t.avatar;

  const isIconOnly     = iconOnly || avatar || swatch;

  /* Types that render NO readable text, and therefore need an accessible name.
   * letterNumber is the dangerous one: an unnamed letterNumber announces as
   * "123, button", which sounds deliberate and so never gets investigated. */
  const isLabelless    = isIconOnly || letterNumber;

  /* Accessible naming for icon buttons: the BUTTON carries the name; the icons
   * inside carry none. Both named announces twice; neither announces "button". */
  if (process.env.NODE_ENV !== 'production') {
    const named =
      props['aria-label'] || props['aria-labelledby'] || props.title;
    if (isLabelless && !named) {
      // eslint-disable-next-line no-console
      console.error(
        '[OmniDesign] A <Button> with no visible text has no accessible name. ' +
        'A screen reader announces it as just "button" — or, for letterNumber, ' +
        'reads the characters ("123") as if they were the label. Add ' +
        'aria-label="…" describing the ACTION ("Your account"), not the ' +
        'content ("JD") or the icon ("trash").',
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

  /* Figma draws every TYPE against every STYLE, including Type=Avatar,
     Style=ghost, so there is no fallback shape for any type. */
  const effectiveVariant = normalizeButtonVariant(variant);

  const variantMap     = buildVariantMap(isTextContent, elevated, selected, size);
  /* An unknown variant warns rather than painting something plausible. */
  const variantStyles  = variantMap[effectiveVariant] || warnUnknownVariant(effectiveVariant, variantMap);
  const sizeKey = SIZES.includes(size) ? size : 'medium';
  const typeKey = swatch ? 'swatch' : avatar ? 'avatar' : isIconOnly ? 'icon' : letterNumber ? 'letter' : 'text';
  const shape = variantStyles.zIndex === 1 ? 'solid' : variantStyles.textDecoration === 'none' ? 'ghost' : 'outline';

  const TypographyComp = size === 'small' ? ButtonSmallTypography : ButtonTypography;

  const renderChildren = () => {
    if (isIconOnly) return children;

    if (letterNumber) {
      const LetterComp = size === 'small' ? ButtonExtraSmallTypography : TypographyComp;
      /* inline-BLOCK, not inline-flex: text-box-trim applies only to a block
         container. The number button has no outer padding to absorb the
         border, so the label's 4px gives it up — then a 32px number button is
         32px. */
      return (
        <LetterComp component="span" color="inherit" className={'omni-btn-letter omni-btn-letter-' + sizeKey}>
          {children}
        </LetterComp>
      );
    }

    if (typeof children === 'string' || typeof children === 'number') {
      return (
        <span className={'btn-text-content omni-btn-textbox omni-btn-textbox-' + sizeKey}>
          {/* line-height and letter-spacing come from the Button-* type tokens.
              The label centres on its cap height (Figma's vertical trim). */}
          <TypographyComp component="span" color="inherit" className="omni-btn-label">
            {children}
          </TypographyComp>
        </span>
      );
    }
    return children;
  };

  const renderStartIcon = () => {
    if (avatar && children) {
      return <div className="MuiAvatar-root MuiAvatar-circular omni-btn-muiavatar">{children}</div>;
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
  const startNode = resolvedStartDecorator !== undefined
    ? resolvedStartDecorator
    : (avatar ? renderStartIcon() : startIcon);
  const endNode = resolvedEndDecorator !== undefined ? resolvedEndDecorator : endIcon;
  const SizeCap = cap(sizeKey);

  const Tag = component || (props.href ? 'a' : 'button');
  const isNativeButton = Tag === 'button';
  const vars = {
    ...variantVars(variantStyles),
    ...(avatar ? { '--_b-avtext': avatarTextFor(size), '--_b-avsize': SIZE_HEIGHT[size] || SIZE_HEIGHT.medium } : {}),
  };

  const rootProps = {
    ref,
    ...(isNativeButton ? { type: type === undefined ? 'button' : type, disabled } : { type }),
    tabIndex: disabled ? -1 : (tabIndex ?? 0),
    ...(!isNativeButton && disabled ? { 'aria-disabled': true } : {}),
    /* A button with href renders an <a>: it is a LINK, and saying role="button"
       on it told a screen reader the opposite. */
    role: props.href ? undefined : 'button',
    /* effectiveVariant, not variant: the class must name what actually PAINTED. */
    className:
      'MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-size' + SizeCap
      + ' MuiButton-textSize' + SizeCap + ' MuiButton-colorPrimary'
      + (effectiveFullWidth ? ' MuiButton-fullWidth' : '') + (disabled ? ' Mui-disabled' : '')
      + ' omni-btn omni-btn-v omni-btn-' + shape + ' omni-btn-z-' + typeKey + '-' + sizeKey
      + (sizeKey === 'small' ? ' omni-btn-small' : '')
      + (startNode ? ' omni-btn-hasstart' : '')
      + (!selected ? ' omni-btn-lift' : '')
      + (vars['--_b-avring'] ? ' omni-btn-avring' : '')
      + (avatar ? ' omni-btn-avatar' : '')
      + (swatch ? ' omni-btn-swatch' : '')
      + (effectiveFullWidth ? ' omni-btn-full' : '')
      + ' btn-' + effectiveVariant + ' ' + className,
    // A swatch's own background is fixed transparent, as it always was.
    style: { ...vars, ...(swatch ? { backgroundColor: 'transparent' } : style) },
    ...props,
  };

  const content = (
    <>
      {startNode && (
        <span className={'MuiButton-icon MuiButton-startIcon MuiButton-iconSize' + SizeCap}>{startNode}</span>
      )}
      {avatar ? null : swatch ? (
        <div
          className="btn-swatch-inner"
          style={{
            width: '100%',
            height: '100%',
            // Concentric with the outer corner.
            borderRadius: size === 'small'
              ? 'var(--Sm-Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))'
              : size === 'large'
                ? 'var(--Lg-Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))'
                : 'var(--Button-Icon-Inner-Radius, calc(var(--Button-Icon-Radius) - 2px))',
            ...(swatchColor ? { backgroundColor: swatchColor } : {}),
          }}
        />
      ) : renderChildren()}
      {endNode && (
        <span className={'MuiButton-icon MuiButton-endIcon MuiButton-iconSize' + SizeCap}>{endNode}</span>
      )}
    </>
  );

  const out = hasSx(sx)
    ? <SxBox component={Tag} sx={sx} {...rootProps}>{content}</SxBox>
    : <Tag {...rootProps}>{content}</Tag>;

  // Wrap in Badge if requested — the badge just decorates the corner.
  if (badge) {
    return (
      <DDBadge
        variant={badgeVariant}
        size={badgeSize}
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
});

// ─── Convenience Exports ──────────────────────────────────────────────────────

/* Built through a factory so each one FORWARDS ITS REF.
 *
 * They were 37 plain arrow functions — `(p) => <Button variant="x" {...p} />`
 * — and a plain function component cannot hold a ref, so every one of them
 * broke as a Tooltip child or a Popover anchor even after Button itself was
 * fixed. `IconButton` is where that showed: CodeBlock wraps it in a Tooltip
 * for the copy affordance, and React warned "Function components cannot be
 * given refs" on every code block in the library.
 *
 * A factory also gives each one a displayName, so they appear by name in the
 * React tree and in a warning rather than as anonymous ForwardRef.
 *
 * Caller props spread LAST, so a caller can still override the preset — which
 * is how the arrow versions behaved and what `<IconButton variant="ghost">`
 * in CodeBlock relies on. */
const preset = (displayName, presetProps) => {
  const Preset = React.forwardRef((props, ref) => (
    <Button ref={ref} {...presetProps} {...props} />
  ));
  Preset.displayName = displayName;
  return Preset;
};

// Default
export const DefaultButton        = preset('DefaultButton',        { variant: 'default' });
export const DefaultOutlineButton = preset('DefaultOutlineButton', { variant: 'default-outline' });

// Solid
export const PrimaryButton   = preset('PrimaryButton',   { variant: 'primary' });
export const SecondaryButton = preset('SecondaryButton', { variant: 'secondary' });
export const TertiaryButton  = preset('TertiaryButton',  { variant: 'tertiary' });
export const NeutralButton   = preset('NeutralButton',   { variant: 'neutral' });
export const InfoButton      = preset('InfoButton',      { variant: 'info' });
export const SuccessButton   = preset('SuccessButton',   { variant: 'success' });
export const WarningButton   = preset('WarningButton',   { variant: 'warning' });
export const ErrorButton     = preset('ErrorButton',     { variant: 'error' });
export const DangerButton    = preset('DangerButton',    { variant: 'error' });

// Outline
export const PrimaryOutlineButton   = preset('PrimaryOutlineButton',   { variant: 'primary-outline' });
export const SecondaryOutlineButton = preset('SecondaryOutlineButton', { variant: 'secondary-outline' });
export const TertiaryOutlineButton  = preset('TertiaryOutlineButton',  { variant: 'tertiary-outline' });
export const NeutralOutlineButton   = preset('NeutralOutlineButton',   { variant: 'neutral-outline' });
export const InfoOutlineButton      = preset('InfoOutlineButton',      { variant: 'info-outline' });
export const SuccessOutlineButton   = preset('SuccessOutlineButton',   { variant: 'success-outline' });
export const WarningOutlineButton   = preset('WarningOutlineButton',   { variant: 'warning-outline' });
export const ErrorOutlineButton     = preset('ErrorOutlineButton',     { variant: 'error-outline' });

// Deprecated: the Light shape is gone. Each renders its SOLID color.
// Kept because deleting a published export breaks an import at build time; they
// point at the solid variant directly so they do not fire the dev warning,
// which is aimed at hand-written variant strings. Remove on the next major.
export const PrimaryLightButton   = preset('PrimaryLightButton',   { variant: 'primary' });
export const SecondaryLightButton = preset('SecondaryLightButton', { variant: 'secondary' });
export const TertiaryLightButton  = preset('TertiaryLightButton',  { variant: 'tertiary' });
export const NeutralLightButton   = preset('NeutralLightButton',   { variant: 'neutral' });
export const InfoLightButton      = preset('InfoLightButton',      { variant: 'info' });
export const SuccessLightButton   = preset('SuccessLightButton',   { variant: 'success' });
export const WarningLightButton   = preset('WarningLightButton',   { variant: 'warning' });
export const ErrorLightButton     = preset('ErrorLightButton',     { variant: 'error' });

// Ghost / Text
export const GhostButton = preset('GhostButton', { variant: 'ghost' });
export const TextButton  = preset('TextButton',  { variant: 'text' });

// Aliases
export const OutlineButton = preset('OutlineButton', { variant: 'primary-outline' });
export const IconButton    = preset('IconButton',    { iconOnly: true });
export const LetterButton  = preset('LetterButton',  { letterNumber: true });
export const AvatarButton  = preset('AvatarButton',  { avatar: true });
export const SwatchButton  = preset('SwatchButton',  { swatch: true });

export default Button;
