// src/components/Accordion/Accordion.js
import React, { useState, createContext, useContext } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon } from '../Icon/Icon';
import {
  EyebrowSmall, BodyLarge, Body, BodySmall,
  BodyLargeSemibold, BodySemibold, BodySmallSemibold,
} from '../Typography';
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * Accordion Component
 *
 * VARIANTS (on AccordionGroup):
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}"       data-surface="Surface-Brightest"
 *   dark      data-theme="{Theme}" data-surface="Surface-Dimmest"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * SPACING: 0 = connected (dividers between items), > 0 = gap between items (each gets own border)
 *
 * SIZES: small | medium | large
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  /* Padding and gap in --Sizing-* tokens, not literal px.
   *
   * Medium matches the Figma ("Accordion Segments"): summary is Sizing-1 top
   * and bottom, Sizing-1 right, Sizing-2 left — the left inset is larger
   * because the text column starts there while the chevron sits tight to the
   * right edge. Details is Sizing-2 on the sides and bottom, with no top
   * padding since the summary already provides that separation.
   *
   * Small and large step the same shape one stop down and up the scale.
   *
   * These were hardcoded px ('12px 8px 12px 16px'), which disagreed with the
   * design at medium on three counts — summary py 12 vs 8, gap 12 vs 8,
   * details bottom 12 vs 16 — and could not follow a brand that rescales its
   * spacing, because the numbers were not tokens.
   *
   * `gap` is the space between the text column and the chevron.
   */
  /* One padding at every size, because that is how Figma binds it: the
     Accordion Summary is Sizing-1 Sizing-1 Sizing-1 Sizing-2 and the Details
     Sizing-2 whether the group resolves small, medium or large (the Accordion
     page puts the group at small). The small and large ramps here were not in
     the design — small made a 32px row where Figma draws 40. The chevron is
     Figma's Icons & Avatars `in-button` size, which aliases Button/Button-Icon
     and so follows the size: 16 / 20 / 32 (Icon xxs / xs / medium). Size also
     picks the type. */
  small: {
    summaryPadding: 'var(--Sizing-1) var(--Sizing-1) var(--Sizing-1) var(--Sizing-2)',
    gap: 'var(--Sizing-1)',
    detailsPy: 'var(--Sizing-2)',
    detailsPx: 'var(--Sizing-2)',
    iconSize: 'xxs',
  },
  medium: {
    summaryPadding: 'var(--Sizing-1) var(--Sizing-1) var(--Sizing-1) var(--Sizing-2)',
    gap: 'var(--Sizing-1)',
    detailsPy: 'var(--Sizing-2)',
    detailsPx: 'var(--Sizing-2)',
    iconSize: 'xs',
  },
  large: {
    summaryPadding: 'var(--Sizing-1) var(--Sizing-1) var(--Sizing-1) var(--Sizing-2)',
    gap: 'var(--Sizing-1)',
    detailsPy: 'var(--Sizing-2)',
    detailsPx: 'var(--Sizing-2)',
    iconSize: 'medium',
  },
};

/* ─── Contexts ─── */
const GroupContext = createContext({
  variant: 'solid', color: 'default', size: 'medium', spacing: 0,
});
const AccordionContext = createContext({
  expanded: false, toggle: () => {}, disabled: false, accordionId: '',
});

/* ─── AccordionGroup ─── */
/* The accordion's own corner.
 *
 * --Accordion-Radius is min(buttonRadius, buttonHeight/2): the design system
 * emits it precisely so an accordion cannot saturate into a stadium the way a
 * pill button can. It was generated and consumed by nothing — every rule here
 * read --Button-Radius, which at a 100% button radius rounds an accordion into
 * a pill. Falls back to --Button-Radius for a system that predates the token. */
const RADIUS = 'var(--Accordion-Radius, var(--Button-Radius))';

export function AccordionGroup({
  children,
  variant = 'solid',
  surface,
  color = 'default',
  size = 'medium',
  spacing = 0,
  className = '',
  sx = {},
  ...props
}) {
  const effectiveColor = color === 'default' ? 'Default' : cap(color);
  const isConnected = spacing === 0;

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes — their
  // sheets carry Default, Primary, Secondary, Tertiary, Neutral and the states —
  // so `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = color === 'default' ? 'Default' : effectiveColor;

  /* Explicit surface override — see the note on Alert. `variant` reaches only
   * three of the five surface levels; this takes any of them and wins, with
   * the variant mapping kept as the default so existing usage is untouched. */
  const dataSurface = surface || (variant === 'dark' ? 'Surface-Dimmest'
    : variant === 'light' ? 'Surface-Brightest'
    : 'Surface');

  if (isConnected) {
    /* Connected: the segments keep their OWN borders and overlap by one pixel,
     * exactly as ButtonGroup does — first segment rounds its top corners, last
     * rounds its bottom, the ones between stay square, and the -1px pulls
     * adjacent borders onto each other so the seam reads as a single line.
     *
     * This used to be a single outer shell with overflow:hidden and a
     * borderBottom divider per item. That looks similar but is a different
     * object: the group owned the border and the items owned a divider, so an
     * item could never be styled, reordered or conditionally rendered without
     * the shell's corners and the dividers disagreeing. The design (Figma
     * "Accordion Segments") models each segment as self-contained, which is
     * also what lets the same segment be used standalone. */
    return (
      <GroupContext.Provider value={{ variant, color, size, spacing, dataTheme, dataSurface }}>
        <Box
          role="presentation"
          className={'accordion-group accordion-group-connected accordion-group-' + variant + ' ' + className}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            /* The stack casts ONE shadow, as Figma puts the effect on the
               connected group rather than on each segment: a shadow per
               segment would band at every seam. Rounded like the stack so
               the shadow follows its outer corners. */
            borderRadius: RADIUS,
            boxShadow: SHADOW_LEVEL_1,
            '& > .accordion-segment': {
              borderRadius: 0,
              marginBottom: '-1px',
              boxShadow: 'none',
            },
            /* The summary follows its segment, or its focus ring is a square
               inside a rounded corner. Set here rather than in JS because the
               segment's own corners are applied by these descendant selectors,
               which the component cannot read. */
            '& > .accordion-segment .accordion-summary': {
              borderRadius: 0,
            },
            /* A connected segment rings INSIDE, as Figma draws it: 3px, its
               outer edge 2px in from the segment's — an outside ring would be
               painted over by the neighbours. The outline follows the corners
               each position has (rounded top, rounded bottom, square middle).
               A lone segment keeps the outside ring set on the segment. */
            '& > .accordion-segment:has(> .accordion-summary:focus-visible)': {
              outline: '3px solid var(--Focus-Visible)',
              outlineOffset: '-5px',
            },
            '& > .accordion-segment:first-of-type': {
              borderTopLeftRadius: RADIUS,
              borderTopRightRadius: RADIUS,
            },
            '& > .accordion-segment:first-of-type .accordion-summary': {
              borderTopLeftRadius: RADIUS,
              borderTopRightRadius: RADIUS,
            },
            '& > .accordion-segment:last-of-type': {
              borderBottomLeftRadius: RADIUS,
              borderBottomRightRadius: RADIUS,
              marginBottom: 0,
            },
            /* Only when it is also collapsed — an expanded last segment has
               its details below the summary, so the summary is not the bottom
               edge. */
            '& > .accordion-segment:last-of-type .accordion-summary:not(.accordion-summary-expanded)': {
              borderBottomLeftRadius: RADIUS,
              borderBottomRightRadius: RADIUS,
            },
            ...sx,
          }}
          {...props}
        >
          {children}
        </Box>
      </GroupContext.Provider>
    );
  }

  // Disconnected: each accordion gets its own border/shadow
  return (
    <GroupContext.Provider value={{ variant, color, size, spacing, dataTheme, dataSurface }}>
      <Box
        role="presentation"
        className={'accordion-group accordion-group-' + variant + ' accordion-group-spaced ' + className}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          /* Design default is Sizing-1 (8px) between segments. */
          gap: spacing === 0.5 ? 'var(--Sizing-Half)'
            : spacing === 1   ? 'var(--Sizing-1)'
            : spacing === 1.5 ? 'var(--Sizing-1-and-Half)'
            : spacing === 2   ? 'var(--Sizing-2)'
            : spacing * 8 + 'px',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </GroupContext.Provider>
  );
}

/* ─── Accordion ─── */
export function Accordion({
  children,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onChange,
  disabled = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;
  const { dataTheme, dataSurface } = useContext(GroupContext);

  const [accordionId] = useState(() => 'accordion-' + Math.random().toString(36).substring(2, 9));

  const toggle = () => {
    if (disabled) return;
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onChange?.(next);
  };

  /* One shell for both modes — the segment is self-contained.
   *
   * It used to render bare inside a connected group (the group owned the
   * border) and wrapped in its own shell when spaced, so the same component
   * produced two different DOM shapes and could not be used on its own. Now it
   * always carries its own border, background and theme; the GROUP only
   * overrides the corners and the overlap. That is what makes an Accordion
   * Segment usable standalone, which is how the design models it.
   *
   * The shadow is dropped in connected mode by the group's rule — a stack of
   * overlapping segments each casting their own shadow reads as banding. */
  const content = (
    <AccordionContext.Provider value={{ expanded, toggle, disabled, accordionId }}>
      <Box
        className={
          'accordion-segment accordion'
          + (expanded ? ' accordion-expanded' : '')
          + (disabled ? ' accordion-disabled' : '')
          + ' ' + className
        }
        data-theme={dataTheme}
        data-surface={dataSurface}
        sx={{
          /* The border is an OVERLAY, not a CSS border — Figma's Theme-
             Container stroke is INSIDE, which takes no room and paints over
             the contents. A CSS border added 2px to every segment (77 where
             Figma draws 75) and pushed the text 1px in. Drawn last, above the
             summary and details, so a hover or pressed fill on the summary
             cannot cover it; `inherit` follows the corners a connected group
             sets per position. */
          position: 'relative',
          borderRadius: RADIUS,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: '1px solid var(--Border)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 1,
          },
          /* Focus ring round the whole segment, as Figma's Focus-Visible frame:
             2px, 1px out, so its outer edge is 3px outside the segment — the
             same ring Swatch and Radio draw. It was a 3px ring inset in the
             summary. An outline, not a child, so the segment's own
             overflow:hidden cannot clip it; raised so a connected neighbour
             does not paint over it. */
          /* The whole segment takes the state tint while its summary is
             hovered or pressed — summary and open details alike, as Figma's
             Hover and Pressed variants fill the segment. Not when disabled. */
          '&:not(.accordion-disabled):has(> .accordion-summary:hover)': {
            backgroundColor: 'var(--Hover)',
          },
          '&:not(.accordion-disabled):has(> .accordion-summary:active)': {
            backgroundColor: 'var(--Pressed)',
          },
          '&:has(> .accordion-summary:focus-visible)': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '1px',
            zIndex: 2,
          },
          backgroundColor: 'var(--Background)',
          overflow: 'hidden',
          boxShadow: SHADOW_LEVEL_1,  // Accordion

          opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </AccordionContext.Provider>
  );

  return content;
}

/* ─── AccordionSummary ─── */
// Title typography scales per size — Body is the default ("Body Medium"),
// BodySmall for compact rows, BodyLarge for spacious ones. Eyebrow and
// secondary stay constant (EyebrowSmall + BodySmall) and only render when
// the consumer passes them.
/* Title and body both step with the accordion's size, so "Accordion Title" and
   "Accordion Body" render at the mode's scale rather than one fixed size.
   Medium is the default, matching the design. */
/* The title is the SEMIBOLD step, not Body with a weight painted on.
 *
 * It used to render Body and override fontWeight: 600 inline — which is the
 * pattern Menu already removed, and for the reason that matters here: 600 is a
 * literal, while the semibold style reads var(--Body-Medium-Semibold-Font-Weight).
 * Figma binds that same token. So a brand whose semibold is 650 moved in the
 * design file and stayed at 600 in the build, and nothing said so.
 *
 * Body ships standard and semibold only — there is no bold Body — so semibold
 * is the step, not Subtitle, which is 700. */
const TITLE_COMPS = { small: BodySmallSemibold, medium: BodySemibold, large: BodyLargeSemibold };
const BODY_COMPS  = { small: BodySmall,         medium: Body,         large: BodyLarge };

export function AccordionSummary({
  children,
  // List-style slots — empty by default. Both hug their content, so an
  // <Icon size="small" /> or <Avatar size="x-small" /> drops in cleanly.
  startDecorator,
  endDecorator,
  // Optional text layers above and below the title. With both empty, only
  // the Body (medium) title renders — matches the Figma default.
  // `overline` is the former name for `eyebrow`, still accepted.
  eyebrow,
  overline,
  secondary,
  expandIcon,
  className = '',
  sx = {},
  ...props
}) {
  const { expanded, toggle, disabled, accordionId } = useContext(AccordionContext);
  const { size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const TitleComp = TITLE_COMPS[size] || TITLE_COMPS.medium;

  const icon = expandIcon || (
    <Icon size={s.iconSize} sx={{ color: expanded ? 'var(--Text)' : 'var(--Quiet)', transition: 'color 0.15s ease' }}>
      <ExpandMoreIcon />
    </Icon>
  );

  const lineSx = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  };

  return (
    <Box
      component="button"
      role="button"
      aria-expanded={expanded}
      aria-controls={accordionId + '-content'}
      id={accordionId + '-header'}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      className={'accordion-summary' + (expanded ? ' accordion-summary-expanded' : '') + ' ' + className}
      sx={{
        // hstack, centred vertically as Figma's Accordion Summary is: a 21px
        // title sits in the middle of the 24px chevron row (it was pinned to
        // the top, 1.5px high), and a tall summary keeps its chevron centred.
        // The gap scales with size — it was pinned to Sizing-1-and-Half,
        // which left medium 4px wider than the design.
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        gap: s.gap,
        padding: s.summaryPadding,
        border: 'none',
        backgroundColor: 'transparent',
        color: expanded ? 'var(--Text)' : 'var(--Quiet)',
        /* No fontSize here. The summary is a shell; its title renders through
           TITLE_COMPS (BodySmall / Body / BodyLarge), which already carries the
           size for the mode. A literal fontSize on the button overrode the
           typography component for any bare string passed as a child, so the
           same title rendered at two different sizes depending on whether it
           went through the slot or the children. */
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'color 0.2s ease, background-color 0.15s ease',
        /* The ring below is drawn with `outline`, and an outline takes its
           corner radius from the element it sits on — so a square summary
           inside a rounded segment produced a SQUARE ring whose corners were
           then clipped by the segment's overflow:hidden. It read as a broken
           rectangle rather than a focus indicator.

           Matching the segment fixes it for free: the browser draws an
           `outline` concentric with the border radius, so an inset ring inside
           an 8px corner comes out at 5px without anyone computing it. That is
           the same geometry Figma parameterises by hand as
           Accordian-Inner-Focus-Radius (8 - 3 = 5) and Accordian-Focus-Radius
           (8 + 3 = 11).

           Only the TOP corners when expanded: the details panel sits directly
           beneath, so rounding the bottom would curve the hover scrim inward
           mid-panel. Collapsed, the summary IS the segment, so it takes all
           four. A grouped segment overrides both — see the group rules. */
        borderRadius: expanded ? RADIUS + ' ' + RADIUS + ' 0 0' : RADIUS,
        /* Hover and Pressed tint the whole SEGMENT, as Figma draws them — the
           fill is set by the :has() rules on the segment. The summary only
           takes its text and chevron to --Text. */
        '&:hover': !disabled ? {
          color: 'var(--Text)',
          '& .omni-icon': { color: 'var(--Text)' },
        } : {},
        '&:active': !disabled ? {
          color: 'var(--Text)',
          '& .omni-icon': { color: 'var(--Text)' },
        } : {},
        // The focus ring belongs to the SEGMENT — see the :has() rule on it.
        '&:focus-visible': { outline: 'none' },
        ...sx,
      }}
      {...props}
    >
      {/* Start slot — hugs content, only renders when supplied. */}
      {startDecorator && (
        <Box
          className="accordion-summary-start"
          sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          {startDecorator}
        </Box>
      )}

      {/* Text frame — flex-fill vstack, Sizing-Half (4px) gap between
          the optional eyebrow, the title, and the optional secondary. */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--Sizing-Half)',
      }}>
        {(eyebrow ?? overline) && (
          /* --Eyebrow, not Quiet: the eyebrow is the surface's rotated
             palette color (Figma's Eyebrow variable). */
          <EyebrowSmall style={{ ...lineSx, color: 'var(--Eyebrow, var(--Text-Quiet))' }}>
            {eyebrow ?? overline}
          </EyebrowSmall>
        )}
        {children !== undefined && children !== null && (
          <TitleComp style={{ ...lineSx, color: 'inherit' }}>
            {children}
          </TitleComp>
        )}
        {secondary && (
          <BodySmall style={{ ...lineSx, color: 'var(--Text-Quiet)' }}>
            {secondary}
          </BodySmall>
        )}
      </Box>

      {/* End slot — hugs content, only renders when supplied. The chevron
          is separate from this slot so the consumer's end decorator never
          conflicts with the expand/collapse affordance. */}
      {endDecorator && (
        <Box
          className="accordion-summary-end"
          sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          {endDecorator}
        </Box>
      )}

      {/* Chevron — always rendered at the far right. */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
}

/* ─── AccordionDetails ─── */
export function AccordionDetails({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { expanded, accordionId } = useContext(AccordionContext);
  const { size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const BodyComp = BODY_COMPS[size] || BODY_COMPS.medium;

  if (!expanded) return null;

  return (
    <Box
      role="region"
      id={accordionId + '-content'}
      aria-labelledby={accordionId + '-header'}
      className={'accordion-details ' + className}
      sx={{
        padding: '0 ' + s.detailsPx + ' ' + s.detailsPy + ' ' + s.detailsPx,
        color: 'var(--Text)',
        /* Body typography comes from BODY_COMPS, applied to bare text below —
           not from a literal fontSize, which would override it. */
        fontFamily: 'inherit',
        lineHeight: 1.6,
        ...sx,
      }}
      {...props}
    >
      {/* A bare string or number is the Accordion Body style, so it renders
          through the size-matched typography component. Anything else is the
          caller's own markup and is left exactly as passed — wrapping JSX
          would nest a <p> around arbitrary content. */}
      {(typeof children === 'string' || typeof children === 'number')
        ? <BodyComp>{children}</BodyComp>
        : children}
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const SolidAccordionGroup = (p) => <AccordionGroup variant="solid" {...p} />;
export const LightAccordionGroup = (p) => <AccordionGroup variant="light" {...p} />;
export const DarkAccordionGroup  = (p) => <AccordionGroup variant="dark"  {...p} />;

export default AccordionGroup;
