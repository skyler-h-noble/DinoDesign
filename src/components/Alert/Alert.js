// src/components/Alert/Alert.js
import React from 'react';
import { Box } from '@mui/material';
import { Body, BodySmall } from '../Typography';

/**
 * Alert Component
 *
 * VARIANTS:
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}-Light" data-surface="Surface"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border var(--Buttons-{C}-Border), border-radius, Effect-Level-3 shadow
 *   Inner content — data-theme + data-surface, bg var(--Background), color var(--Text)
 *
 * SIZES: small | medium | large
 *
 * SLOTS:
 *   startDecorator — icon or avatar before message
 *   endDecorator   — icon, link, or button after message
 *
 * Accessibility: role="alert" for live-region announcement.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { px: '12px', py: '8px',  fontSize: '13px', iconSize: '18px', gap: '8px' },
  medium: { px: '16px', py: '12px', fontSize: '14px', iconSize: '20px', gap: '10px' },
  large:  { px: '20px', py: '14px', fontSize: '16px', iconSize: '22px', gap: '12px' },
};

export function Alert({
  children,
  variant = 'light',
  color = 'info',
  size = 'medium',
  startDecorator,
  endDecorator,
  className = '',
  sx = {},
  ...props
}) {
  const C = cap(color === 'default' ? 'Default' : color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : C;

  const dataSurface = 'Surface';
  const borderToken = 'var(--Buttons-' + C + '-Border)';

  const innerContent = (
    <>
      {startDecorator && (
        <Box
          className="alert-start-decorator"
          sx={{ display: 'inline-flex', alignItems: 'center', fontSize: s.iconSize, lineHeight: 1, flexShrink: 0, mt: '2px' }}
        >
          {startDecorator}
        </Box>
      )}
      <Box className="alert-message" sx={{ flex: 1, minWidth: 0 }}>
        {typeof children === 'string' ? (
          size === 'small'
            ? <BodySmall>{children}</BodySmall>
            : <Body>{children}</Body>
        ) : children}
      </Box>
      {endDecorator && (
        <Box
          className="alert-end-decorator"
          sx={{ display: 'inline-flex', alignItems: 'flex-start', flexShrink: 0, gap: s.gap, paddingTop: '2px' }}
        >
          {endDecorator}
        </Box>
      )}
    </>
  );

  return (
    <Box
      role="alert"
      className={'alert alert-' + variant + ' alert-' + size + ' alert-' + color + ' ' + className}
      sx={{
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        boxShadow: 'var(--Effect-Level-3)',
        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface={dataSurface}
        className="alert-inner"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: s.gap,
          padding: s.py + ' ' + s.px,
          fontSize: s.fontSize,
          fontFamily: 'inherit',
          lineHeight: 1.5,
          color: 'var(--Text)',
          backgroundColor: 'var(--Background)',
          borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
        }}
      >
        {innerContent}
      </Box>
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const SolidAlert = (p) => <Alert variant="solid" {...p} />;
export const LightAlert = (p) => <Alert variant="light" {...p} />;

export default Alert;
