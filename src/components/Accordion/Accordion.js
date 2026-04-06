// src/components/Accordion/Accordion.js
import React, { useState, createContext, useContext } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon } from '../Icon/Icon';
import { BodySmall, Body } from '../Typography';

/**
 * Accordion Component
 *
 * VARIANTS (on AccordionGroup):
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}-Light" data-surface="Surface"
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
  small:  { summaryPy: '8px', summaryPx: '12px', detailsPy: '8px', detailsPx: '12px', fontSize: '13px', iconSize: 18 },
  medium: { summaryPy: '12px', summaryPx: '16px', detailsPy: '12px', detailsPx: '16px', fontSize: '14px', iconSize: 20 },
  large:  { summaryPy: '16px', summaryPx: '20px', detailsPy: '16px', detailsPx: '20px', fontSize: '16px', iconSize: 22 },
};

/* ─── Contexts ─── */
const GroupContext = createContext({
  variant: 'solid', color: 'default', size: 'medium', spacing: 0,
});
const AccordionContext = createContext({
  expanded: false, toggle: () => {}, disabled: false, accordionId: '',
});

/* ─── AccordionGroup ─── */
export function AccordionGroup({
  children,
  variant = 'solid',
  color = 'default',
  size = 'medium',
  spacing = 0,
  className = '',
  sx = {},
  ...props
}) {
  const effectiveColor = color === 'default' ? 'Default' : cap(color);
  const isConnected = spacing === 0;

  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : effectiveColor + '-Light')
    : effectiveColor;

  const dataSurface = variant === 'dark' ? 'Surface-Dimmest' : 'Surface';

  if (isConnected) {
    // Connected: single outer shell wrapping all items
    return (
      <GroupContext.Provider value={{ variant, color, size, spacing }}>
        <Box
          role="presentation"
          className={'accordion-group accordion-group-' + variant + ' ' + className}
          sx={{
            border: '1px solid var(--Border-Variant)',
            borderRadius: 'var(--Style-Border-Radius)',
            overflow: 'hidden',
            boxShadow: 'var(--Effect-Level-2)',
            ...sx,
          }}
          {...props}
        >
          <Box
            data-theme={dataTheme}
            data-surface={dataSurface}
            sx={{
              backgroundColor: 'var(--Background)',
              borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
            }}
          >
            {children}
          </Box>
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
  const { spacing, dataTheme, dataSurface } = useContext(GroupContext);
  const isConnected = spacing === 0;

  const [accordionId] = useState(() => 'accordion-' + Math.random().toString(36).substring(2, 9));

  const toggle = () => {
    if (disabled) return;
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onChange?.(next);
  };

  const content = (
    <AccordionContext.Provider value={{ expanded, toggle, disabled, accordionId }}>
      <Box
        className={'accordion' + (expanded ? ' accordion-expanded' : '') + (disabled ? ' accordion-disabled' : '') + ' ' + className}
        sx={{
          ...(isConnected && {
            borderBottom: '1px solid var(--Border-Variant)',
            '&:last-child': { borderBottom: 'none' },
          }),
          opacity: disabled ? 0.5 : 1,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </AccordionContext.Provider>
  );

  if (!isConnected) {
    // Disconnected: wrap each accordion in its own themed shell
    return (
      <Box sx={{
        border: '1px solid var(--Border-Variant)',
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        boxShadow: 'var(--Effect-Level-2)',
      }}>
        <Box
          data-theme={dataTheme}
          data-surface={dataSurface}
          sx={{
            backgroundColor: 'var(--Background)',
            borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
          }}
        >
          {content}
        </Box>
      </Box>
    );
  }

  return content;
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
  const { size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const TextComp = size === 'small' ? BodySmall : Body;

  const icon = expandIcon || (
    <Icon size="small" sx={{ color: expanded ? 'var(--Text)' : 'var(--Quiet)', transition: 'color 0.15s ease' }}>
      <ExpandMoreIcon />
    </Icon>
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
        color: expanded ? 'var(--Text)' : 'var(--Quiet)',
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'color 0.2s ease, background-color 0.15s ease',
        borderRadius: 0,
        '&:hover': !disabled ? {
          color: 'var(--Text)',
          '& .dyno-icon': { color: 'var(--Text)' },
        } : {},
        '&:focus-visible': {
          outline: '3px solid var(--Focus-Visible)',
          outlineOffset: '-3px',
        },
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ flex: 1 }}>
        <TextComp style={{ color: 'inherit', fontWeight: 600 }}>{children}</TextComp>
      </Box>
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
  const { size } = useContext(GroupContext);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

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
export const SolidAccordionGroup = (p) => <AccordionGroup variant="solid" {...p} />;
export const LightAccordionGroup = (p) => <AccordionGroup variant="light" {...p} />;
export const DarkAccordionGroup  = (p) => <AccordionGroup variant="dark"  {...p} />;

export default AccordionGroup;
