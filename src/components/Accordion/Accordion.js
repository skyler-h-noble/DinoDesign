// src/components/Accordion/Accordion.js
import React, { useState, createContext, useContext } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Accordion Component
 *
 * STYLES:
 *   default   No data-theme. border: var(--Border), bg: var(--Background)
 *             Closed summary: var(--Quiet). Open summary: var(--Text)
 *
 *   solid     data-theme={Color} data-surface="Surface"
 *             bg: var(--Background), text: var(--Text), border: none
 *
 *   light     data-theme={Color}-Light
 *             bg: var(--Background), text: var(--Text), border: none
 *
 * SIZES: small | medium | large
 * COLORS: 8 brand colors (primary..error)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const SIZE_MAP = {
  small:  { summaryPy: '8px', summaryPx: '12px', detailsPy: '8px', detailsPx: '12px', fontSize: '13px', iconSize: 18, gap: '0px' },
  medium: { summaryPy: '12px', summaryPx: '16px', detailsPy: '12px', detailsPx: '16px', fontSize: '14px', iconSize: 20, gap: '0px' },
  large:  { summaryPy: '16px', summaryPx: '20px', detailsPy: '16px', detailsPx: '20px', fontSize: '16px', iconSize: 22, gap: '0px' },
};

/* ─── Contexts ─── */
const GroupContext = createContext({
  variant: 'default', color: 'primary', size: 'medium', disableDivider: false,
});
const AccordionContext = createContext({
  expanded: false, toggle: () => {}, disabled: false, accordionId: '',
});

/* ─── AccordionGroup ─── */
export function AccordionGroup({
  children,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  disableDivider = false,
  className = '',
  sx = {},
  ...props
}) {
  const isDefault = variant === 'default';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null; // default variant inherits data-theme from PreviewSurface wrapper

  const containerBg = isDefault ? 'var(--Background)' : 'var(--Background)';
  const containerBorder = '1px solid var(--Border)';

  return (
    <GroupContext.Provider value={{ variant, color, size, disableDivider }}>
      <Box
        data-theme={dataTheme || undefined}
        data-surface={isSolid || isLight ? 'Surface' : undefined}
        role="presentation"
        className={'accordion-group accordion-group-' + variant + ' accordion-group-' + color + ' ' + className}
        sx={{
          backgroundColor: containerBg,
          border: containerBorder,
          borderRadius: 'var(--Style-Border-Radius)',
          overflow: 'hidden',
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
  const { variant, disableDivider } = useContext(GroupContext);
  const isDefault = variant === 'default';

  const [accordionId] = useState(() => 'accordion-' + Math.random().toString(36).substring(2, 9));

  const toggle = () => {
    if (disabled) return;
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onChange?.(next);
  };

  const dividerColor = isDefault ? 'var(--Border)' : 'var(--Border)';

  return (
    <AccordionContext.Provider value={{ expanded, toggle, disabled, accordionId }}>
      <Box
        className={'accordion' + (expanded ? ' accordion-expanded' : '') + (disabled ? ' accordion-disabled' : '') + ' ' + className}
        sx={{
          borderBottom: disableDivider ? 'none' : '1px solid ' + dividerColor,
          '&:last-child': { borderBottom: 'none' },
          opacity: disabled ? 0.5 : 1,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </AccordionContext.Provider>
  );
}

/* ─── AccordionSummary ─── */
export function AccordionSummary({
  children,
  expandIcon,
  className = '',
  sx = {},
  ...props
}) {
  const { expanded, toggle, disabled, accordionId } = useContext(AccordionContext);
  const { variant, size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isDefault = variant === 'default';

  // Default variant: closed = quiet, open = standard
  const textColor = isDefault
    ? (expanded ? 'var(--Text)' : 'var(--Quiet)')
    : 'var(--Text)';

  const icon = expandIcon || (
    <ExpandMoreIcon sx={{
      fontSize: s.iconSize + 'px',
      fill: 'var(--Quiet)',
      transition: 'fill 0.15s ease',
    }} />
  );

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: s.summaryPy + ' ' + s.summaryPx,
        border: 'none',
        backgroundColor: 'transparent',
        color: textColor,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'color 0.2s ease, background-color 0.15s ease',
        borderRadius: 0,
        '&:hover': !disabled ? {
          backgroundColor: isDefault ? 'var(--Hover)' : 'var(--Hover)',
          '& .MuiSvgIcon-root': { fill: 'var(--Text)' },
        } : {},
        '&:active .MuiSvgIcon-root': { fill: 'var(--Text)' },
        '&:focus-visible': {
          outline: '3px solid var(--Focus-Visible)',
          outlineOffset: '-3px',
        },
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          flexShrink: 0,
          ml: 1,
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
  const { variant, size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isDefault = variant === 'default';
  const textColor = isDefault ? 'var(--Text)' : 'var(--Text)';

  if (!expanded) return null;

  return (
    <Box
      role="region"
      id={accordionId + '-content'}
      aria-labelledby={accordionId + '-header'}
      className={'accordion-details' + ' ' + className}
      sx={{
        padding: '0 ' + s.detailsPx + ' ' + s.detailsPy + ' ' + s.detailsPx,
        color: textColor,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        lineHeight: 1.6,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const DefaultAccordionGroup = (p) => <AccordionGroup variant="default" {...p} />;
export const SolidAccordionGroup   = (p) => <AccordionGroup variant="solid"   {...p} />;
export const LightAccordionGroup   = (p) => <AccordionGroup variant="light"   {...p} />;

export default AccordionGroup;