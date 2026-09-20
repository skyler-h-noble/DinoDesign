// src/components/Stepper/Stepper.js
import React, { createContext, useContext } from 'react';
import { Box } from '@mui/material';
import { BodySmall, Caption } from '../Typography';

/**
 * Stepper Component
 *
 * COMPONENTS:
 *   Stepper        — container (<ol>), sets orientation/size/color context
 *   Step           — individual step (<li>)
 *   StepIndicator  — circle showing number/icon
 *   StepConnector  — line between steps (auto-inserted)
 *
 * COLORS: 8 brand colors → maps to var(--Buttons-{Color}-*) tokens
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
  /* connectorThickness and dot read their tokens with the DESIGN's numbers as
     fallbacks — Component-Size / Other / `Step bar` (1/2/4) and
     `No Count Step` (8/12/16), which componentSizePayload writes. Same idiom
     as Rail-Width and the Divider ramp: an unbound token renders the intended
     weight rather than an invented one. */
  small:  { indicator: 24, fontSize: 'var(--Sm-Button-Numbers, 10px)',
            dot: 'var(--Sm-No-Count-Step, 8px)',
            labelFontSize: '13px', connectorThickness: 'var(--Sm-Step-Bar, 1px)', gap: 0 },
  medium: { indicator: 32, fontSize: 'var(--Button-Numbers, 12px)',
            dot: 'var(--No-Count-Step, 12px)',
            labelFontSize: '14px', connectorThickness: 'var(--Step-Bar, 2px)', gap: 0 },
  large:  { indicator: 40, fontSize: 'var(--Lg-Button-Numbers, 16px)',
            dot: 'var(--Lg-No-Count-Step, 16px)',
            labelFontSize: '16px', connectorThickness: 'var(--Lg-Step-Bar, 4px)', gap: 0 },
};

/* ─── Context ─── */
const StepperContext = createContext({
  orientation: 'horizontal',
  size: 'medium',
  color: 'primary',
  activeStep: 0,
  clickable: false,
  onStepClick: null,
  dashedIncomplete: false,
  totalSteps: 0,
  variant: 'count',
});
export const useStepperContext = () => useContext(StepperContext);

/* ─── Stepper ─── */
export function Stepper({
  children,
  orientation = 'horizontal',
  size = 'medium',
  color = 'primary',
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
  const C = COLOR_LABEL_MAP[color] || 'Primary';
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
   * painted incomplete's ring in the brand colour; the design uses Quiet, so a
   * column of unreached steps reads as quiet rather than as a row of buttons.
   * (Same reasoning as Checkbox's default box, which draws in --Quiet for
   * exactly that.)
   *
   * The number on a FILLED indicator takes --Buttons-<C>-Text, the token
   * paired with that fill, rather than --Text. The design binds --Text there,
   * which resolves legibly on the current theme but is the surface's text
   * colour, not the fill's: per invariant 3 the label is derived from the
   * fill, so a palette whose button is light would put light text on it. */
  const borderToken = isIncomplete ? 'var(--Quiet)' : 'var(--Buttons-' + C + '-Border)';
  const bgToken     = isActive ? 'var(--Buttons-' + C + '-Button)' : 'transparent';
  const textToken   = isActive     ? 'var(--Buttons-' + C + '-Text)'
                    : isIncomplete ? 'var(--Quiet)'
                    : 'var(--Text)';
  const hoverToken  = isActive ? 'var(--Buttons-' + C + '-Hover)' : 'var(--Hover)';
  const activeToken = isActive ? 'var(--Buttons-' + C + '-Pressed)' : 'var(--Pressed)';
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
        border: 'var(--Button-Border-Width, 1px) solid ' + borderToken,
        backgroundColor: bgToken,
        color: textToken,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 700,
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
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '2px',
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
              marginLeft: '8px',
              marginRight: '8px',
            }
          : {
              width: s.connectorThickness,
              minHeight: '24px',
              marginLeft: `calc(${s.indicator / 2}px - ${s.connectorThickness} / 2)`,
              marginTop: '4px',
              marginBottom: '4px',
            }),
        backgroundColor: connectorTraversed ? 'var(--Buttons-' + C + '-Button)' : 'var(--Border)',
        ...(dashedIncomplete && !connectorTraversed && {
          backgroundColor: 'transparent',
          backgroundImage: isHorizontal
            ? 'repeating-linear-gradient(90deg, var(--Border) 0px, var(--Border) 6px, transparent 6px, transparent 12px)'
            : 'repeating-linear-gradient(180deg, var(--Border) 0px, var(--Border) 6px, transparent 6px, transparent 12px)',
          backgroundSize: isHorizontal ? '12px 100%' : '100% 12px',
        }),
        transition: 'background-color 0.15s ease',
      }}
    />
  ) : null;

  const labelEl = displayLabel ? (() => {
    const LabelComp = size === 'small' ? Caption : BodySmall;
    return (
      <LabelComp style={{
        fontWeight: isActive ? 600 : 400,
        color: (isActive || isCompleted) ? 'var(--Text)' : 'var(--Quiet)',
        textAlign: isHorizontal ? 'center' : 'left',
        whiteSpace: 'nowrap',
        lineHeight: 1.3,
      }}>
        {displayLabel}
      </LabelComp>
    );
  })() : null;

  if (isHorizontal) {
    return (
      <Box
        component="li"
        className={'step step-' + size + ' step-horizontal' +
          (isActive ? ' step-active' : '') + (isCompleted ? ' step-completed' : '') +
          (isIncomplete ? ' step-incomplete' : '') + ' ' + className}
        sx={{
          display: 'flex', alignItems: 'center',
          flex: !isLast ? 1 : 'none',
          ...sx,
        }}
        {...props}
      >
        {/* Circle + label column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          {indicatorEl}
          {labelEl && <Box sx={{ mt: '4px' }}>{labelEl}</Box>}
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {indicatorEl}
        {labelEl}
      </Box>
      {connectorEl}
    </Box>
  );
}

export default Stepper;
