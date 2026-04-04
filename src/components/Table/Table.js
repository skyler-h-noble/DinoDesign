// src/components/Table/Table.js
import React from 'react';
import { Box } from '@mui/material';

/**
 * Table Component
 *
 * STYLES:
 *   default   No color selection. Borders: var(--Border), Text: var(--Text)
 *   outlined  Container border: var(--Buttons-{C}-Border), internal: var(--Border), Text: var(--Text)
 *   light     Header bg: var(--Buttons-{C}-Button), header text: var(--Buttons-{C}-Text), body text: var(--Text), borders: var(--Border)
 *   solid     Wrapper gets data-theme="{Color}-Medium", borders: var(--Border), text: var(--Text)
 *
 * SIZES:
 *   small   py: 4px,  fontSize: 13px
 *   medium  py: 8px,  fontSize: 14px
 *   large   py: 12px, fontSize: 16px
 *
 * STRIPING:
 *   none | odd | even
 *   Stripe rows get data-surface="Surface-Dim", non-stripe get data-surface="Surface"
 *
 * STICKY: stickyHeader, stickyFooter (boolean)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { py: '4px',  px: '8px',  fontSize: '13px', headerFontSize: '12px' },
  medium: { py: '8px',  px: '12px', fontSize: '14px', headerFontSize: '13px' },
  large:  { py: '12px', px: '16px', fontSize: '16px', headerFontSize: '14px' },
};

// --- Table -------------------------------------------------------------------

export function Table({
  children,
  columns,
  rows,
  footerRows,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  stripe = 'none',
  stickyHeader = false,
  stickyFooter = false,
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isSolid = variant === 'solid';
  const isOutlined = variant === 'outlined';
  const isLight = variant === 'light';
  const isDefault = variant === 'default';
  const C = cap(color);

  // Container border for outlined
  const containerBorder = isOutlined
    ? '1px solid var(--Buttons-' + C + '-Border)'
    : 'none';

  // Wrapper data attributes for solid theme
  const wrapperDataAttrs = {};
  if (isSolid) {
    wrapperDataAttrs['data-theme'] = C + '-Medium';
  }

  // Header styles per variant
  const getHeaderSx = () => {
    const base = {
      fontWeight: 600,
      fontSize: s.headerFontSize,
      textAlign: 'left',
      padding: s.py + ' ' + s.px,
      borderBottom: '2px solid var(--Border)',
      color: 'var(--Text)',
      whiteSpace: 'nowrap',
    };

    if (isLight) {
      base.backgroundColor = 'var(--Buttons-' + C + '-Button)';
      base.color = 'var(--Buttons-' + C + '-Text)';
    } else if (isSolid) {
      base.backgroundColor = 'var(--Hover)';
    } else {
      base.backgroundColor = 'var(--Background)';
    }

    if (stickyHeader) {
      base.position = 'sticky';
      base.top = 0;
      base.zIndex = 2;
    }

    return base;
  };

  // Footer styles
  const getFooterSx = () => {
    const base = {
      fontWeight: 600,
      fontSize: s.headerFontSize,
      textAlign: 'left',
      padding: s.py + ' ' + s.px,
      borderTop: '2px solid var(--Border)',
      color: 'var(--Text)',
      whiteSpace: 'nowrap',
    };

    if (isLight) {
      base.backgroundColor = 'var(--Buttons-' + C + '-Button)';
      base.color = 'var(--Buttons-' + C + '-Text)';
    } else if (isSolid) {
      base.backgroundColor = 'var(--Hover)';
    } else {
      base.backgroundColor = 'var(--Background)';
    }

    if (stickyFooter) {
      base.position = 'sticky';
      base.bottom = 0;
      base.zIndex = 2;
    }

    return base;
  };

  // Row data-surface for striping
  const getRowSurface = (rowIndex) => {
    if (stripe === 'none') return 'Surface';
    if (stripe === 'odd') return rowIndex % 2 === 0 ? 'Surface' : 'Surface-Dim';
    if (stripe === 'even') return rowIndex % 2 === 0 ? 'Surface-Dim' : 'Surface';
    return 'Surface';
  };

  // Cell styles
  const getCellSx = () => ({
    padding: s.py + ' ' + s.px,
    fontSize: s.fontSize,
    color: 'var(--Text)',
    borderBottom: '1px solid var(--Border)',
    textAlign: 'left',
  });

  // Build table from columns/rows if provided
  const renderStructured = () => {
    if (!columns || !rows) return null;

    return (
      <>
        <Box component="thead">
          <Box component="tr">
            {columns.map((col, i) => (
              <Box
                component="th"
                key={'h-' + i}
                sx={{
                  ...getHeaderSx(),
                  ...(col.width ? { width: col.width } : {}),
                  ...(col.align ? { textAlign: col.align } : {}),
                }}
              >
                {col.label || col.header || col}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row, ri) => (
            <Box
              component="tr"
              key={'r-' + ri}
              data-surface={getRowSurface(ri)}
              sx={{
                backgroundColor: 'var(--' + getRowSurface(ri) + ')',
              }}
            >
              {(Array.isArray(row) ? row : columns.map((col) => row[col.field || col.key])).map((cell, ci) => (
                <Box
                  component="td"
                  key={'c-' + ri + '-' + ci}
                  sx={{
                    ...getCellSx(),
                    ...(columns[ci] && columns[ci].align ? { textAlign: columns[ci].align } : {}),
                  }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        {footerRows && footerRows.length > 0 && (
          <Box component="tfoot">
            {footerRows.map((row, fi) => (
              <Box component="tr" key={'f-' + fi}>
                {(Array.isArray(row) ? row : columns.map((col) => row[col.field || col.key])).map((cell, ci) => (
                  <Box
                    component="td"
                    key={'fc-' + fi + '-' + ci}
                    sx={{
                      ...getFooterSx(),
                      ...(columns[ci] && columns[ci].align ? { textAlign: columns[ci].align } : {}),
                    }}
                  >
                    {cell}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </>
    );
  };

  return (
    <Box
      className={'table-wrapper table-' + variant + (isSolid || isLight || isOutlined ? ' table-' + color : '') + ' ' + className}
      {...wrapperDataAttrs}
      sx={{
        width: '100%',
        overflow: 'auto',
        border: containerBorder,
        borderRadius: isOutlined || isLight ? 'var(--Style-Border-Radius)' : 0,
        ...sx,
      }}
    >
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          fontFamily: 'inherit',
          '& thead th': getHeaderSx(),
          '& tbody td': getCellSx(),
          '& tfoot td, & tfoot th': getFooterSx(),
          ...(stickyHeader ? {
            '& thead th': {
              ...getHeaderSx(),
              position: 'sticky',
              top: 0,
              zIndex: 2,
            },
          } : {}),
          ...(stickyFooter ? {
            '& tfoot td, & tfoot th': {
              ...getFooterSx(),
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
            },
          } : {}),
        }}
        {...props}
      >
        {columns && rows ? renderStructured() : children}
      </Box>
    </Box>
  );
}

// --- Convenience Exports -----------------------------------------------------

export const DefaultTable  = (p) => <Table variant="default"  {...p} />;
export const OutlinedTable = (p) => <Table variant="outlined" {...p} />;
export const LightTable    = (p) => <Table variant="light"    {...p} />;
export const SolidTable    = (p) => <Table variant="solid"    {...p} />;

export default Table;
