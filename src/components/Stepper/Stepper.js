// src/components/Stepper/Stepper.js
import React, { createContext, useContext } from 'react';
import { Box } from '@mui/material';
import { Label } from '../Typography';

/**
 * Stepper Component
 *
 * COMPONENTS:
 *   Stepper        — container (<ol>), sets orientation/size/color context
 *   Step           — individual step (<li>)
 *   StepIndicator  — circle showing number/icon
 *   StepConnector  — line between steps (auto-inserted)
 *
 * COLORS: 9 brand colors → maps to var(--Buttons-{Color}-*) tokens. The
 * default is `default`, not `primary`: the design's Count Step PINS NOTHING,
 * so the circle resolves whatever Buttons mode it inherits, which with nothing
 * above it is Default. Defaulting to primary painted --Buttons-Primary-Button
 * on a step that Figma draws in the brand's default button color, and because
 * both are real colors from the same system it looked like a design choice
 * rather than the wrong token.
 *   Selected:   bg var(--Buttons-{C}-Button), text var(--Buttons-{C}-Text),
 *               hover var(--Buttons-{C}-Hover), active var(--Buttons-{C}-Pressed)
 *   Unselected: bg transparent, text var(--Text),
 *               hover var(--Hover), active var(--Pressed)
 *   Border:     var(--Buttons-{C}-Border) always
 *   Focus:      var(--Focus-Visible)
 *
 * SIZES: small (24×24 indicator via ::after touch target), medium (32×32), large (40×40)
 * ORIENTATION: horizontal | vertical
 * BUTTONS: steps can be clickable StepButtons
 * DASHED: incomplete connector paths rendered dashed
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/* connectorThickness comes from Component-Size `Step bar` — 1 / 2 / 4.
   It was a flat 2 at every size, which is the MEDIUM value, so small
   connectors were double weight and large ones half. The 1/2/4 ramp is also
   what the lib's Divider was using; the design assigns that one to the step
   bar and gives Divider a lighter 0.5 / 1 / 2, so the two were swapped. */
const SIZE_MAP = {
  /* fontSize is the Button-Numbers ramp, the same one Badge reads — the design
     binds Button/Button-Numbers on the step indicator. It was 11 / 13 / 16 in
     literal pixels, so a brand that re-picked its button heights moved the
     design's step numbers and not the lib's.
     dot is Component-Size `No Count Step` (8 / 12 / 16), the diameter of a
     noCount step. */
  /* labelFontSize is NOT here. It sat in this table as 13 / 14 / 16 literal
     pixels and nothing ever read it — the label renders through Label, which
     takes its size from the Dynamic-Label ramp already. A dead entry
     that looks like configuration is worse than none: the next person tunes it
     and nothing happens.

     connectorThickness and dot read their tokens with the DESIGN's numbers as
     fallbacks — Component-Size / Other / `Step bar` (1/2/4) and
     `No Count Step` (8/12/16), which componentSizePayload writes. Same idiom
     as Rail-Width and the Divider ramp: an unbound token renders the intended
     weight rather than an invented one. */
  small:  { indicator: 24, fontSize: 'var(--Sm-Button-Numbers, 10px)',
            dot: 'var(--Sm-No-Count-Step, 8px)',
            connectorThickness: 'var(--Sm-Step-Bar, 1px)', gap: 0 },
  medium: { indicator: 32, fontSize: 'var(--Button-Numbers, 12px)',
            dot: 'var(--No-Count-Step, 12px)',
            connectorThickness: 'var(--Step-Bar, 2px)', gap: 0 },
  large:  { indicator: 40, fontSize: 'var(--Lg-Button-Numbers, 16px)',
            dot: 'var(--Lg-No-Count-Step, 16px)',
            connectorThickness: 'var(--Lg-Step-Bar, 4px)', gap: 0 },
};

/* ─── Context ─── */
const StepperContext = createContext({
  orientation: 'horizontal',
  size: 'medium',
  color: 'default',
  activeStep: 0,
  clickable: false,
  onStepClick: null,
  dashedIncomplete: false,
  totalSteps: 0,
  variant: 'count',
});
export const useStepperContext = () => useContext(StepperContext);

/* ─── Stepper ─── */
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
export function Stepper({
  theme,
  surface,
  children,
  orientation = 'horizontal',
  size = 'medium',
  /* `default`, matching the Count Step's unpinned Buttons mode — see COLORS
     above. Pass a palette name only where the design pins one. */
  color = 'default',
  activeStep = 0,
  clickable = false,
  onStepClick,
  dashedIncomplete = false,
  /* 'count' draws a numbered circle, 'noCount' a plain dot — the design's
     Style axis. Named `variant`, not `style`: React already owns `style` as
     the inline-style prop, so the Figma property name cannot be used verbatim
     here. The VALUES match exactly, which is what a converter reads. */
  variant = 'count',
  className = '',
  sx = {},
  ...props
}) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const totalSteps = items.length;
  const isHorizontal = orientation === 'horizontal';

  return (
    <StepperContext.Provider value={{ orientation, size, color, activeStep, clickable, onStepClick, dashedIncomplete, totalSteps, variant }}>
      <Box
        component="ol"
        role="list"
        aria-label="Progress"
        data-theme={theme || undefined}
        data-surface={surface || undefined}
        className={'stepper stepper-' + orientation + ' stepper-' + size + ' stepper-' + color + ' ' + className}
        sx={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          alignItems: isHorizontal ? 'flex-start' : 'stretch',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          width: '100%',
          gap: 0,
          ...sx,
        }}
        {...props}
      >
        {items.map((child, index) =>
          React.cloneElement(child, { _index: index, key: child.key || index })
        )}
      </Box>
    </StepperContext.Provider>
  );
}

/* ─── Step ─── */
export function Step({
  children,
  icon,
  label,
  disabled = false,
  _index = 0,
  className = '',
  sx = {},
  ...props
}) {
  const { orientation, size, color, activeStep, clickable: groupClickable, onStepClick, dashedIncomplete, totalSteps, variant } = useStepperContext();
  /* `clickable` is a Stepper-level switch, so before this a step you cannot
     reach yet was styled and announced exactly like one you can. Folding
     disabled into it here drops the role, tabIndex, key handler and onClick
     together rather than only dimming the indicator. */
  const clickable = groupClickable && !disabled;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const C = COLOR_LABEL_MAP[color] || 'Default';
  const isHorizontal = orientation === 'horizontal';
  const isActive = _index === activeStep;
  const isCompleted = _index < activeStep;
  const isIncomplete = _index > activeStep;
  const isLast = _index === totalSteps - 1;

  const displayContent = icon || (_index + 1);
  const displayLabel = label || children;

  /* The status ladder, three separable steps:
   *
   *   incomplete   Quiet outline, Quiet number,  no fill   — not reached
   *   complete     brand outline, --Text number, no fill   — done
   *   current      brand outline, brand FILL               — you are here
   *
   * Only the current step fills. This used to fill complete as well
   * (`isActive || isCompleted`), leaving those two a single pixel of border
   * apart while incomplete was the only one that looked different — so the
   * step you are ON was the hardest to pick out, which is backwards. It also
   * painted incomplete's ring in the brand color; the design uses Quiet, so a
   * column of unreached steps reads as quiet rather than as a row of buttons.
   * (Same reasoning as Checkbox's default box, which draws in --Quiet for
   * exactly that.)
   *
   * The number on a FILLED indicator takes --Buttons-<C>-Text, the token
   * paired with that fill, rather than --Text. The design binds --Text there,
   * which resolves legibly on the current theme but is the surface's text
   * color, not the fill's: per invariant 3 the label is derived from the
   * fill, so a palette whose button is light would put light text on it. */
  const borderToken = isIncomplete ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';
  /* --Background, not transparent. The design fills every unselected circle
     with Background rather than letting the surface through, which is the
     same picture on a plain surface and a different one the moment a step
     sits on a Container: transparent shows the container tone through the
     ring, Background punches the surface back out. */
  const bgToken     = isActive ? 'var(--Buttons-' + C + '-Button)' : 'var(--Background)';
  /* The COMPLETE circle has no fill, which makes it an outline button, so its
     digit is the outline button's text token. The CURRENT one is filled, so
     per invariant 3 its digit is the token paired with that fill.
     The file binds Outline-Text to BOTH. On this brand's default palette that
     happens to read (dark on pink), but Outline-Text is tuned for text on the
     SURFACE — on a palette whose Button is dark it would be dark on dark. See
     docs/figma-parity.md; this is a file fix, not a lib one. */
  const textToken   = isActive     ? 'var(--Buttons-' + C + '-Text)'
                    : isIncomplete ? 'var(--Quiet)'
                    : 'var(--Buttons-' + C + '-Outline-Text)';
  /* Hover and Pressed are BUTTONS tokens at every status, not just the
     current one. The lib read the surface's --Hover/--Pressed for complete
     and incomplete, so hovering those two steps picked up the page's grey
     instead of the palette's. */
  const hoverToken  = 'var(--Buttons-' + C + '-Hover)';
  const activeToken = 'var(--Buttons-' + C + '-Pressed)';
  const isDot       = variant === 'noCount';

  const indicatorEl = (
    <Box
      component={clickable ? 'button' : 'div'}
      onClick={clickable ? () => onStepClick?.(_index) : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStepClick?.(_index); }
      } : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? 'Go to step ' + (_index + 1) : undefined}
      aria-current={isActive ? 'step' : undefined}
      aria-disabled={disabled || undefined}
      className={
        'step-indicator step-indicator-' + size
        + (isActive ? ' step-indicator-active' : '')
        + (isCompleted ? ' step-indicator-completed' : '')
        + (isIncomplete ? ' step-indicator-incomplete' : '')
        + (clickable ? ' step-indicator-clickable' : '')
      }
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* `dot` is a token string and `indicator` a number, so the 'px' goes
           on the number only — appending it to a var() would emit
           `var(--No-Count-Step, 12px)px`, which the browser drops silently. */
        width: isDot ? s.dot : s.indicator + 'px',
        height: isDot ? s.dot : s.indicator + 'px',
        minWidth: isDot ? s.dot : s.indicator + 'px',
        minHeight: isDot ? s.dot : s.indicator + 'px',
        borderRadius: '50%',
        /* ONE border width. It was 2px on the current step and 1px elsewhere,
           carrying a distinction the fill now makes far more clearly; the
           design system has a single --Button-Border-Width (1px) and this is
           the same ring. */
        /* The COMPLETE ring is 2px and the other two are 1. A literal in the
           file as well as here — Button-Fill's strokeWeight is a plain 2 on
           all five complete states, bound to nothing — so it cannot follow a
           brand that moves its border width. Flagged in docs/figma-parity.md.
           This file previously consolidated to one width on the grounds that
           the fill already carries the distinction; that was right about the
           CURRENT step, which is filled, and wrong about the complete one,
           which is an outline and has only its ring to say so. */
        border: (isCompleted ? '2px' : 'var(--Button-Border-Width, 1px)')
                + ' solid ' + borderToken,
        backgroundColor: bgToken,
        color: textToken,
        fontSize: s.fontSize,
        /* The BUTTON face, not whatever is around it.
           Figma binds the step number to `Buttons/Button-Font-Family` — the
           count step IS a Button in the file, so its digit wears the button's
           typeface. `inherit` took the face from the page instead, so the
           number came out in the body font on a docs page and in whatever the
           host set everywhere else: a different-looking digit in a circle the
           right size, which reads as the whole component being wrong. */
        /* --Font-Family-Body is a REAL second step, not belt-and-braces.
           typography-tokens.css declares
             --Font-Family-Button: var(--Platform-Font-Families-Body);
           with no fallback, while --Font-Family-Body gets
             var(--Platform-Font-Families-Body, var(--Set-Font-Family-Body)).
           Nothing defines --Platform-Font-Families-Body outside a brand's own
           device blocks, so in the library's bundled CSS the Button one is
           the guaranteed-invalid value and the Body one is Poppins. A single
           `var(--Font-Family-Button, inherit)` therefore dropped straight to
           the page's font and the digit came out in whatever the host set.
           Naming the body face second is also correct rather than merely
           safe: the generator defines the button face AS the body face. */
        fontFamily: 'var(--Font-Family-Button, var(--Font-Family-Body, inherit))',
        /* The design binds Typography/Buttons/Small to the step's digit, so
           the weight comes from there rather than a literal 700 — a brand that
           picks a lighter button face moved the design's numbers and not the
           lib's. */
        /* The button's weight, for the same reason as the family. The old
           token was Button-Small's, which is one size's weight standing in for
           the ramp's. */
        fontWeight: 'var(--Button-Font-Weight, var(--Button-Small-Font-Weight, 700))',
        /* The digit is centred by the flex box above, so the line box only has
           to not add leading of its own. Figma trims cap-height-to-baseline;
           text-box-trim is the CSS equivalent and falls back to this. */
        lineHeight: 1,
        flexShrink: 0,
        position: 'relative',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        cursor: disabled ? 'not-allowed' : clickable ? 'pointer' : 'default',
        outline: 'none',
        padding: 0,
        ...(disabled && { opacity: 'var(--Disabled, 0.38)' }),

        // 24×24 minimum touch target via ::after for small size
        ...(size === 'small' && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
          },
        }),

        ...(clickable && {
          '&:hover': {
            backgroundColor: hoverToken,
          },
          '&:active': {
            backgroundColor: activeToken,
          },
          '&:focus-visible': {
            /* 2px, matching the design and the 35 other components that use
               2px — this was one of the 21 on 3px. The 1px offset is what
               makes the ring's radius 3 against a 4 outer corner elsewhere in
               the system; on a circular step it simply keeps the ring clear of
               the border without swallowing it. */
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '1px',
          },
        }),
      }}
    >
      {isDot ? null : displayContent}
    </Box>
  );

  // Connector line
  const connectorTraversed = _index < activeStep;
  const connectorEl = !isLast ? (
    <Box
      className={
        /* A connector is about the SEGMENT between two steps, not about the
           step it hangs off — so it is traversed or not, with no third case.
           It used to reuse the step's own isCompleted / isIncomplete, and the
           ACTIVE step is neither, so the connector leading out of the step you
           are on got no class at all. That also meant dashedIncomplete never
           dashed it: the one segment you have most clearly not travelled yet
           rendered solid. */
        'step-connector'
        + (connectorTraversed ? ' step-connector-completed' : ' step-connector-incomplete')
        + (dashedIncomplete && !connectorTraversed ? ' step-connector-dashed' : '')
      }
      aria-hidden="true"
      sx={{
        flex: 1,
        ...(isHorizontal
          ? {
              height: s.connectorThickness,
              minWidth: '20px',
              alignSelf: 'flex-start',
              /* calc, not arithmetic: connectorThickness is a token now, so
                 `indicator / 2 - thickness / 2` would produce NaN. The maths
                 moves into CSS, where the variable can actually resolve. */
              marginTop: `calc(${s.indicator / 2}px - ${s.connectorThickness} / 2)`,
            }
          : {
              width: s.connectorThickness,
              minHeight: '24px',
              marginLeft: `calc(${s.indicator / 2}px - ${s.connectorThickness} / 2)`,
            }),
        /* Step-Line binds its stroke to Border when complete and Quiet when
           not. Border is a BUTTONS token and Quiet a SURFACE one, so the two
           sides of the connector come from different collections — which is
           why a traversed segment follows the palette and an untravelled one
           follows the page. The lib had --Buttons-{C}-Button for traversed,
           a full-strength fill where the design draws a border tone. */
        backgroundColor: connectorTraversed
          ? 'var(--Buttons-' + C + '-Border)'
          : 'var(--Quiet)',
        ...(dashedIncomplete && !connectorTraversed && {
          backgroundColor: 'transparent',
          /* 2 on, 2 off across and 4/4 down, copied from the file's dash
             arrays. It was 6/6 both ways, which at a 2px rule reads as a row
             of dashes rather than the dotted line the design draws. */
          backgroundImage: isHorizontal
            ? 'repeating-linear-gradient(90deg, var(--Quiet) 0px, var(--Quiet) 2px, transparent 2px, transparent 4px)'
            : 'repeating-linear-gradient(180deg, var(--Quiet) 0px, var(--Quiet) 4px, transparent 4px, transparent 8px)',
          backgroundSize: isHorizontal ? '4px 100%' : '100% 8px',
        }),
        transition: 'background-color 0.15s ease',
      }}
    />
  ) : null;

  /* The LABEL type style, not Caption or BodySmall. Every step label in the
     file binds Labels/Label-Font-Family and the Dynamic-Label ramp for size,
     spacing, line-height and weight — so a brand that picks a label face was
     moving the design's step labels and not the lib's. One component at every
     size, because the ramp is already per size mode.
     Its color tracks status the way the circle does: Quiet before you reach
     it, Text on the one you are on, and the palette's Border tone once it is
     behind you. That last one is a 3:1 token carrying text — see
     docs/figma-parity.md. */
  const labelToken = isActive     ? 'var(--Text)'
                   : isIncomplete ? 'var(--Quiet)'
                   : 'var(--Buttons-' + C + '-Border)';
  const labelEl = displayLabel ? (
    <Label style={{
      fontWeight: isActive ? 600 : 400,
      color: labelToken,
      textAlign: isHorizontal ? 'center' : 'left',
      whiteSpace: 'nowrap',
      /* A flex item, and one that must not be squeezed: the column it sits in
         is one circle wide and the label is routinely wider. */
      flexShrink: 0,
    }}>
      {displayLabel}
    </Label>
  ) : null;

  if (isHorizontal) {
    return (
      <Box
        component="li"
        className={'step step-' + size + ' step-horizontal' +
          (isActive ? ' step-active' : '') + (isCompleted ? ' step-completed' : '') +
          (isIncomplete ? ' step-incomplete' : '') + ' ' + className}
        sx={{
          display: 'flex', alignItems: 'flex-start',
          flex: !isLast ? 1 : 'none',
          ...sx,
        }}
        {...props}
      >
        {/* THE STEP IS ONE CIRCLE WIDE AND THE LABEL HANGS OUT OF IT.
            Count Step is layoutSizingHorizontal FIXED at Button-Height with
            clipsContent false, and its Bottom Label sits at x = -6 — 44px of
            text centred on a 32px column, overflowing 6px each side. In the
            assembled row the steps are 32 wide at x 48 / 185 / 321 and the
            lines FILL everything between them.
            Without the explicit width this column sized to the LABEL, so a
            long one pushed the connector away from the circle. That is the
            rest of the gap: removing the 8px margins was necessary and not
            sufficient, because the column itself was too wide. */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          flexShrink: 0,
          width: isDot ? s.dot : s.indicator + 'px',
        }}>
          {indicatorEl}
          {/* width 100% so the nowrap label centres on the circle and spills
              evenly both ways; it adds height to the column but never width. */}
          {/* CENTRED BY FLEX, not by text-align. The wrapper is one circle
              wide and the label is wider, so `text-align: center` only
              centres it if the label is a block that fills the wrapper —
              Label is not, so it sat against the left edge and the whole
              caption read as shifted right of its circle. A flex container
              with justify-content: center centres the item on the box and
              lets it overflow both ways, whatever the child's display. */}
          {labelEl && (
            <Box sx={{
              mt: 'var(--Sizing-Half)', width: '100%',
              display: 'flex', justifyContent: 'center',
            }}>{labelEl}</Box>
          )}
        </Box>
        {/* Connector — centered to circle via negative margin for label height */}
        {connectorEl}
      </Box>
    );
  }

  // Vertical
  return (
    <Box
      component="li"
      className={'step step-' + size + ' step-vertical' +
        (isActive ? ' step-active' : '') + (isCompleted ? ' step-completed' : '') +
        (isIncomplete ? ' step-incomplete' : '') + ' ' + className}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ...sx }}
      {...props}
    >
      {/* Step and Right Label binds itemSpacing -> Sizing-1. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1)' }}>
        {indicatorEl}
        {labelEl}
      </Box>
      {connectorEl}
    </Box>
  );
}

export default Stepper;
