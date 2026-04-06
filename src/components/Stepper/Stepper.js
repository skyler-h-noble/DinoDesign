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
 *               hover var(--Buttons-{C}-Hover), active var(--Buttons-{C}-Active)
 *   Unselected: bg transparent, text var(--Text),
 *               hover var(--Hover), active var(--Active)
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

const SIZE_MAP = {
  small:  { indicator: 24, fontSize: '11px', labelFontSize: '13px', connectorThickness: 2, gap: 0 },
  medium: { indicator: 32, fontSize: '13px', labelFontSize: '14px', connectorThickness: 2, gap: 0 },
  large:  { indicator: 40, fontSize: '16px', labelFontSize: '16px', connectorThickness: 2, gap: 0 },
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
  className = '',
  sx = {},
  ...props
}) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  const totalSteps = items.length;
  const isHorizontal = orientation === 'horizontal';

  return (
    <StepperContext.Provider value={{ orientation, size, color, activeStep, clickable, onStepClick, dashedIncomplete, totalSteps }}>
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
  _index = 0,
  className = '',
  sx = {},
  ...props
}) {
  const { orientation, size, color, activeStep, clickable, onStepClick, dashedIncomplete, totalSteps } = useStepperContext();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const C = COLOR_LABEL_MAP[color] || 'Primary';
  const isHorizontal = orientation === 'horizontal';
  const isActive = _index === activeStep;
  const isCompleted = _index < activeStep;
  const isIncomplete = _index > activeStep;
  const isLast = _index === totalSteps - 1;

  const displayContent = icon || (_index + 1);
  const displayLabel = label || children;

  // Token resolution
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const bgToken = (isActive || isCompleted) ? 'var(--Buttons-' + C + '-Button)' : 'transparent';
  const textToken = (isActive || isCompleted) ? 'var(--Buttons-' + C + '-Text)' : 'var(--Text)';
  const hoverToken = (isActive || isCompleted) ? 'var(--Buttons-' + C + '-Hover)' : 'var(--Hover)';
  const activeToken = (isActive || isCompleted) ? 'var(--Buttons-' + C + '-Active)' : 'var(--Active)';

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
        width: s.indicator + 'px',
        height: s.indicator + 'px',
        minWidth: s.indicator + 'px',
        minHeight: s.indicator + 'px',
        borderRadius: '50%',
        border: (isActive ? '2px' : '1px') + ' solid ' + borderToken,
        backgroundColor: bgToken,
        color: textToken,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 700,
        lineHeight: 1,
        flexShrink: 0,
        position: 'relative',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        cursor: clickable ? 'pointer' : 'default',
        outline: 'none',
        padding: 0,

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
      {displayContent}
    </Box>
  );

  // Connector line
  const connectorEl = !isLast ? (
    <Box
      className={
        'step-connector'
        + (isCompleted ? ' step-connector-completed' : '')
        + (isIncomplete ? ' step-connector-incomplete' : '')
        + (dashedIncomplete && isIncomplete ? ' step-connector-dashed' : '')
      }
      aria-hidden="true"
      sx={{
        flex: 1,
        ...(isHorizontal
          ? {
              height: s.connectorThickness + 'px',
              minWidth: '20px',
              alignSelf: 'flex-start',
              marginTop: (s.indicator / 2 - s.connectorThickness / 2) + 'px',
              marginLeft: '8px',
              marginRight: '8px',
            }
          : {
              width: s.connectorThickness + 'px',
              minHeight: '24px',
              marginLeft: (s.indicator / 2 - s.connectorThickness / 2) + 'px',
              marginTop: '4px',
              marginBottom: '4px',
            }),
        backgroundColor: isCompleted ? 'var(--Buttons-' + C + '-Button)' : 'var(--Border)',
        ...(dashedIncomplete && isIncomplete && {
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
