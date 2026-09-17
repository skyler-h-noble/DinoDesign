// src/components/Table/Table.js
import React from 'react';
import { Box } from '@mui/material';
import { Ghost } from '../_ghost';

/**
 * Table Component
 *
 * STYLES:
 *   default   No color selection. Borders: var(--Border), Text: var(--Text)
 *   outlined  Container border: var(--Buttons-{C}-Border), internal: var(--Border), Text: var(--Text)
 *   light     Header bg: var(--Buttons-{C}-Button), header text: var(--Buttons-{C}-Text), body text: var(--Text), borders: var(--Border)
 *   solid     Wrapper gets data-theme="{Color}", borders: var(--Border), text: var(--Text).
 *             The surface is left to the page, matching List.
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

/* Theme modes, by the colour prop. Same table as List, and deliberately a
   LOOKUP rather than cap(color): the nine modes are a closed set, so an
   unrecognised colour has to emit no data-theme at all rather than a name the
   cascade will not match. cap('black-white') would produce "Black-white",
   which binds to nothing and paints the parent's palette — the same silent
   failure this fixes. */
const THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

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
  /* Data states. `loading` and `skeletonRows` are PROPS because loading has no
     copy; `empty` and `error` are SLOTS because they do — "no invoices yet"
     and "no results for that filter" are the same design and different words,
     which a component cannot author. Slots also keep Table at its 288 variant
     combinations instead of the 1,440 a five-value state property would make,
     and an empty table does not look different in Primary and in Error. */
  loading = false,
  skeletonRows = 3,
  empty,
  error,
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

  /* Wrapper data attributes for the solid theme.

     This was C + '-Medium'. The Theme collection is nine BARE modes — there is
     no Primary-Medium — so the attribute matched no rule, --Background never
     resolved, and the solid table painted whatever palette its parent had.
     It reads as the colour prop being ignored rather than as a missing token,
     which is why it survived the shade removal. */
  const wrapperDataAttrs = {};
  if (isSolid && THEME_MAP[color]) {
    wrapperDataAttrs['data-theme'] = THEME_MAP[color];
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

  /* Precedence: error beats loading beats empty. A failed request that is
     retrying is still an error the user has to see, and a request that
     returned nothing is not empty until it has finished. Ordering these the
     other way produces the classic flash of "no results" before the data
     lands. */
  const dataState = error ? 'error' : loading ? 'loading' : (rows && rows.length === 0 && empty) ? 'empty' : null;

  /* The header is kept in every state. Dropping it makes the region change
     width between states, so the page jumps each time a filter runs — the same
     reflow Ghost exists to avoid. */
  const renderMessageRow = (content) => (
    <Box component="tbody">
      <Box component="tr">
        <Box
          component="td"
          colSpan={columns ? columns.length : 1}
          sx={{ padding: 0, border: 'none' }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );

  // Build table from columns/rows if provided
  const renderStructured = () => {
    if (!columns) return null;
    if (!rows && !dataState) return null;

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
        {dataState === 'loading' && renderMessageRow(
          /* Real rows of placeholder text, ghosted — so the column widths and
             row heights are the ones the data will land in. A generic block
             here would resize the moment the rows arrived. */
          <Ghost label="Loading">
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <Box component="tbody">
                {Array.from({ length: skeletonRows }).map((_, ri) => (
                  <Box component="tr" key={'sk-' + ri} data-surface={getRowSurface(ri)}>
                    {columns.map((_c, ci) => (
                      <Box component="td" key={'skc-' + ri + '-' + ci} sx={getCellSx()}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Ghost>,
        )}

        {dataState === 'error' && renderMessageRow(error)}
        {dataState === 'empty' && renderMessageRow(empty)}

        {!dataState && rows && (
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
        )}
        {/* The footer follows the rows: totals over placeholder data would be
            wrong, and totals over an error message are meaningless. */}
        {!dataState && footerRows && footerRows.length > 0 && (
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
      /* On the WRAPPER, not on Ghost's inner div: this is the element a screen
         reader lands on, and aria-busy has to be on the region whose content is
         in flux, not on a node buried inside a cell. */
      aria-busy={dataState === 'loading' ? 'true' : undefined}
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
