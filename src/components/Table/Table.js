// src/components/Table/Table.js
import React from 'react';
import { Ghost } from '../_ghost';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

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

/* Theme modes, by the color prop. Same table as List, and deliberately a
   LOOKUP rather than cap(color): the nine modes are a closed set, so an
   unrecognised color has to emit no data-theme at all rather than a name the
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

// --- Static sheet --------------------------------------------------------------

/* Table used to be MUI Boxes with an sx each. It renders plain table markup
   now, styled from this sheet over the same tokens.

   The cell rules hang off the <table> (`.omni-tb-t thead th`, one class and
   two elements), the weight the old nested sx rules had. That weight is why a
   column's `align` never showed: the table's own `text-align: left` outweighed
   the cell's — kept as it was, so nothing moves.

   Per-instance values arrive as custom properties on the <table>: the size's
   padding and font sizes (plain lengths), and for `light` the palette's
   Buttons tokens. */
registerStaticStyles('omni-table', [
  '.omni-tb{width:100%;overflow:auto;border:none;border-radius:0}',
  '.omni-tb-outlined{border:1px solid var(--_tb-bd)}',
  '.omni-tb-round{border-radius:var(--Style-Border-Radius)}',
  '.omni-tb-t{width:100%;border-collapse:collapse;table-layout:fixed;font-family:inherit}',
  '.omni-tb-t thead th{font-weight:600;font-size:var(--_tb-hfs);text-align:left;padding:var(--_tb-py) var(--_tb-px);'
    + 'border-bottom:2px solid var(--Border);color:var(--Text);white-space:nowrap;background-color:var(--Background)}',
  '.omni-tb-t tbody td{padding:var(--_tb-py) var(--_tb-px);font-size:var(--_tb-fs);color:var(--Text);border-bottom:1px solid var(--Border);text-align:left}',
  '.omni-tb-t tfoot td,.omni-tb-t tfoot th{font-weight:600;font-size:var(--_tb-hfs);text-align:left;padding:var(--_tb-py) var(--_tb-px);'
    + 'border-top:2px solid var(--Border);color:var(--Text);white-space:nowrap;background-color:var(--Background)}',
  '.omni-tb-light thead th,.omni-tb-light tfoot td,.omni-tb-light tfoot th{background-color:var(--_tb-btn);color:var(--_tb-btxt)}',
  '.omni-tb-solid thead th,.omni-tb-solid tfoot td,.omni-tb-solid tfoot th{background-color:var(--Hover)}',
  '.omni-tb-sh thead th{position:sticky;top:0;z-index:2}',
  '.omni-tb-sf tfoot td,.omni-tb-sf tfoot th{position:sticky;bottom:0;z-index:2}',
  /* The structured rows' own fill, at a single class as the row's sx was. */
  '.omni-tb-row-Surface{background-color:var(--Surface)}',
  '.omni-tb-row-Surface-Dim{background-color:var(--Surface-Dim)}',
  /* The ghost table inside a loading row. */
  '.omni-tb-ghost{width:100%;border-collapse:collapse;table-layout:fixed}',
  /* A loading footer cell is ghosted on the cell (Ghost's <div> cannot sit in
     a <tfoot>). The footer rule above outweighs the block's own fill and
     text color, so only the corner, the sweep and the inertness show. */
  '.omni-tb-ghostcell{border-radius:var(--Ghost-Radius, 4px);user-select:none;pointer-events:none;'
    + 'background-image:linear-gradient(90deg, transparent 0%, var(--Background) 50%, transparent 100%);'
    + 'background-size:200% 100%;background-repeat:no-repeat;animation:omni-ghost-sweep 1.4s linear infinite}',
  '@media (prefers-reduced-motion: reduce){.omni-tb-ghostcell{background-image:none;animation:none}}',
].join('\n'));

const SxBox = lazySxBox('Table');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const B = 'MuiBox-root';

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
  style,
  ...props
}) {
  useStaticStyles('omni-table');
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isSolid = variant === 'solid';
  const isOutlined = variant === 'outlined';
  const isLight = variant === 'light';
  const C = cap(color);

  /* Wrapper data attributes for the solid theme.

     This was C + '-Medium'. The Theme collection is nine BARE modes — there is
     no Primary-Medium — so the attribute matched no rule, --Background never
     resolved, and the solid table painted whatever palette its parent had.
     It reads as the color prop being ignored rather than as a missing token,
     which is why it survived the shade removal. */
  const wrapperDataAttrs = {};
  if (isSolid && THEME_MAP[color]) {
    wrapperDataAttrs['data-theme'] = THEME_MAP[color];
  }

  // Row data-surface for striping
  const getRowSurface = (rowIndex) => {
    if (stripe === 'none') return 'Surface';
    if (stripe === 'odd') return rowIndex % 2 === 0 ? 'Surface' : 'Surface-Dim';
    if (stripe === 'even') return rowIndex % 2 === 0 ? 'Surface-Dim' : 'Surface';
    return 'Surface';
  };

  /* Precedence: error beats loading beats empty. A failed request that is
     retrying is still an error the user has to see, and a request that
     returned nothing is not empty until it has finished. Ordering these the
     other way produces the classic flash of "no results" before the data
     lands. */
  const dataState = error ? 'error' : loading ? 'loading' : (rows && rows.length === 0 && empty) ? 'empty' : null;

  const hasFooter = Boolean(footerRows && footerRows.length > 0);
  /* Shown whenever there is one, EXCEPT on error — see the note at the
     <tfoot> below for why error is the exception rather than the rule. */
  const footerShown = hasFooter && dataState !== 'error';

  /* The header is kept in every state. Dropping it makes the region change
     width between states, so the page jumps each time a filter runs — the same
     reflow Ghost exists to avoid. The cell's own padding: 0 / border: none
     never showed (the table's tbody rule outweighs them), so it is not set. */
  const renderMessageRow = (content) => (
    <tbody className={B}>
      <tr className={B}>
        <td className={B} colSpan={columns ? columns.length : 1}>
          {content}
        </td>
      </tr>
    </tbody>
  );

  const cellsOf = (row) => (Array.isArray(row) ? row : columns.map((col) => row[col.field || col.key]));

  // Build table from columns/rows if provided
  const renderStructured = () => {
    if (!columns) return null;
    if (!rows && !dataState) return null;

    return (
      <>
        <thead className={B}>
          <tr className={B}>
            {columns.map((col, i) => (
              <th className={B} key={'h-' + i} style={col.width ? { width: col.width } : undefined}>
                {col.label || col.header || col}
              </th>
            ))}
          </tr>
        </thead>
        {dataState === 'loading' && renderMessageRow(
          /* Real rows of placeholder text, ghosted — so the column widths and
             row heights are the ones the data will land in. A generic block
             here would resize the moment the rows arrived. */
          <Ghost label="Loading">
            <table className={B + ' omni-tb-ghost'}>
              <tbody className={B}>
                {Array.from({ length: skeletonRows }).map((_, ri) => (
                  <tr className={B} key={'sk-' + ri} data-surface={getRowSurface(ri)}>
                    {columns.map((_c, ci) => (
                      <td className={B} key={'skc-' + ri + '-' + ci}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Ghost>,
        )}

        {dataState === 'error' && renderMessageRow(error)}
        {dataState === 'empty' && renderMessageRow(empty)}

        {!dataState && rows && (
        <tbody className={B}>
          {rows.map((row, ri) => (
            <tr className={B + ' omni-tb-row-' + getRowSurface(ri)} key={'r-' + ri} data-surface={getRowSurface(ri)}>
              {cellsOf(row).map((cell, ci) => (
                <td className={B} key={'c-' + ri + '-' + ci}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        )}
        {/* The footer is decided PER STATE, not dropped wholesale.

           loading — ghosted, not hidden. A total that vanishes and reappears
             moves the table's height twice, which is the reflow the header is
             already kept to avoid; and the total genuinely IS loading, so a
             placeholder is the honest thing to show rather than a gap.

           empty — SHOWN as given. This is the case the first version got
             wrong. A filtered view with no matching invoices has a real total:
             zero. Hiding it makes the user wonder whether the filter or the
             sum failed, when the answer is simply "none, and they add up to
             nothing".

           error — dropped, and this is the one that must stay dropped. A total
             computed over data that failed to arrive is not missing, it is
             WRONG, and a wrong number shown confidently is worse than no
             number. Partial failures are the sharp case: some rows land, the
             sum looks plausible, and nothing on screen says it is short.

           This comment was written WITHOUT the surrounding braces, so JSX
           treated the whole thing as a string child and rendered it into
           every table as a text node — invalid directly inside a table
           element, and React said so on every render. A block comment in JSX
           is CONTENT unless it is wrapped in braces. */}
        {footerShown && (
          <tfoot className={B}>
            {footerRows.map((row, fi) => (
              <tr className={B} key={'f-' + fi}>
                {cellsOf(row).map((cell, ci) => (
                  /* Ghosted on the CELL, not via a <Ghost> wrapper: Ghost
                     renders a <div>, and a div inside <tfoot> is invalid
                     markup that browsers hoist out of the table. */
                  <td className={B + (dataState === 'loading' ? ' omni-tb-ghostcell' : '')} key={'fc-' + fi + '-' + ci}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </>
    );
  };

  const wrapperClass = 'table-wrapper table-' + variant + (isSolid || isLight || isOutlined ? ' table-' + color : '') + ' ' + className
    + ' ' + B + ' omni-tb' + (isOutlined ? ' omni-tb-outlined' : '') + (isOutlined || isLight ? ' omni-tb-round' : '');
  const wrapperProps = {
    className: wrapperClass,
    ...wrapperDataAttrs,
    /* On the WRAPPER, not on Ghost's inner div: this is the element a screen
       reader lands on, and aria-busy has to be on the region whose content is
       in flux, not on a node buried inside a cell. */
    'aria-busy': dataState === 'loading' ? 'true' : undefined,
    style: isOutlined ? { '--_tb-bd': 'var(--Buttons-' + C + '-Border)' } : undefined,
  };
  const tableVars = { '--_tb-py': s.py, '--_tb-px': s.px, '--_tb-fs': s.fontSize, '--_tb-hfs': s.headerFontSize };
  if (isLight) Object.assign(tableVars, { '--_tb-btn': 'var(--Buttons-' + C + '-Button)', '--_tb-btxt': 'var(--Buttons-' + C + '-Text)' });
  const table = (
    <table
      className={B + ' omni-tb-t' + (isLight ? ' omni-tb-light' : isSolid ? ' omni-tb-solid' : '')
        + (stickyHeader ? ' omni-tb-sh' : '') + (stickyFooter ? ' omni-tb-sf' : '')}
      style={style ? { ...tableVars, ...style } : tableVars}
      {...props}
    >
      {columns && rows ? renderStructured() : children}
    </table>
  );

  if (hasSx(sx)) return <SxBox sx={sx} {...wrapperProps}>{table}</SxBox>;
  return <div {...wrapperProps}>{table}</div>;
}

// --- Convenience Exports -----------------------------------------------------

export const DefaultTable  = (p) => <Table variant="default"  {...p} />;
export const OutlinedTable = (p) => <Table variant="outlined" {...p} />;
export const LightTable    = (p) => <Table variant="light"    {...p} />;
export const SolidTable    = (p) => <Table variant="solid"    {...p} />;

export default Table;
