// src/components/Pagination/Pagination.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * Pagination Component
 *
 * VARIANTS (on selected page button):
 *   solid   bg: var(--Buttons-{C}-Button), text: var(--Buttons-{C}-Text), border: var(--Buttons-{C}-Border)
 *   light   bg: var(--Buttons-{C}-Light-Button), text: var(--Buttons-{C}-Light-Text), border: var(--Buttons-{C}-Light-Border)
 *
 * UNSELECTED (outlined):
 *   text: var(--Text-Quiet), border: var(--Border)
 *   hover: var(--Hover), active: var(--Active)
 *
 * SIZES:
 *   small:  28px visible, 24×24 min touch target (padding trick), 13px text
 *   medium: 32px, 14px text
 *   large:  40px, 16px text
 *
 * PROPS:
 *   count, page, defaultPage, onChange, siblingCount, boundaryCount
 *   variant, color, size, disabled, showFirstButton, showLastButton
 *
 * Accessibility: nav with aria-label, current page aria-current="page"
 */

const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { visible: 28, minTouch: 24, fontSize: '13px', iconSize: '16px', gap: '2px', borderRadius: '6px' },
  medium: { visible: 32, minTouch: 32, fontSize: '14px', iconSize: '18px', gap: '4px', borderRadius: '8px' },
  large:  { visible: 40, minTouch: 40, fontSize: '16px', iconSize: '20px', gap: '4px', borderRadius: '8px' },
};

/* ─── Pagination algorithm ─── */
function usePaginationRange({ count, page, siblingCount = 1, boundaryCount = 1 }) {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

  if (totalPageNumbers >= count) {
    return range(1, count);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1);
  const rightSiblingIndex = Math.min(page + siblingCount, count - boundaryCount);

  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < count - boundaryCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount + boundaryCount;
    const leftRange = range(1, Math.min(leftItemCount, count));
    return [...leftRange, 'ellipsis-right', ...range(count - boundaryCount + 1, count)];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount + boundaryCount;
    const rightRange = range(Math.max(count - rightItemCount + 1, 1), count);
    return [...range(1, boundaryCount), 'ellipsis-left', ...rightRange];
  }

  if (showLeftEllipsis && showRightEllipsis) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [
      ...range(1, boundaryCount),
      'ellipsis-left',
      ...middleRange,
      'ellipsis-right',
      ...range(count - boundaryCount + 1, count),
    ];
  }

  return range(1, count);
}

/* ─── Arrow SVG icons ─── */
const ChevronLeft = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronsLeft = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
  </svg>
);
const ChevronsRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
  </svg>
);

/* ─── Pagination ─── */
export function Pagination({
  count = 10,
  page: controlledPage,
  defaultPage = 1,
  onChange,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  showFirstButton = false,
  showLastButton = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const C = COLOR_MAP[color] || 'Primary';
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isSolid = variant === 'solid';

  const setPage = useCallback((newPage) => {
    const clamped = Math.max(1, Math.min(count, newPage));
    if (!isControlled) setInternalPage(clamped);
    onChange?.(clamped);
  }, [count, isControlled, onChange]);

  const pages = usePaginationRange({ count, page: currentPage, siblingCount, boundaryCount });

  // Token references
  const selectedBg = isSolid ? 'var(--Buttons-' + C + '-Button)' : 'var(--Buttons-' + C + '-Light-Button)';
  const selectedText = isSolid ? 'var(--Buttons-' + C + '-Text)' : 'var(--Buttons-' + C + '-Light-Text)';
  const selectedBorder = isSolid ? 'var(--Buttons-' + C + '-Border)' : 'var(--Buttons-' + C + '-Light-Border)';
  const selectedHover = isSolid ? 'var(--Buttons-' + C + '-Hover)' : 'var(--Buttons-' + C + '-Light-Hover)';
  const selectedActive = isSolid ? 'var(--Buttons-' + C + '-Active)' : 'var(--Buttons-' + C + '-Light-Active)';

  const baseBtnSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s.visible + 'px',
    height: s.visible + 'px',
    fontSize: s.fontSize,
    fontFamily: 'inherit',
    fontWeight: 500,
    lineHeight: 1,
    border: 'none',
    borderRadius: s.borderRadius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    padding: 0,
    position: 'relative',
    outline: 'none',
    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
    // Ensure 24×24 min touch target for small size
    ...(size === 'small' && {
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '24px',
        minHeight: '24px',
      },
    }),
  };

  const unselectedSx = {
    ...baseBtnSx,
    backgroundColor: 'transparent',
    color: 'var(--Text-Quiet)',
    border: '1px solid var(--Border)',
    opacity: disabled ? 0.5 : 1,
    ...(!disabled && {
      '&:hover': { backgroundColor: 'var(--Hover)' },
      '&:active': { backgroundColor: 'var(--Active)' },
      '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
    }),
  };

  const selectedSx = {
    ...baseBtnSx,
    backgroundColor: selectedBg,
    color: selectedText,
    border: '1px solid ' + selectedBorder,
    fontWeight: 600,
    opacity: disabled ? 0.5 : 1,
    ...(!disabled && {
      '&:hover': { backgroundColor: selectedHover },
      '&:active': { backgroundColor: selectedActive },
      '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
    }),
  };

  const arrowSx = {
    ...baseBtnSx,
    backgroundColor: 'transparent',
    color: 'var(--Text-Quiet)',
    border: '1px solid var(--Border)',
    opacity: disabled ? 0.5 : 1,
    ...(!disabled && {
      '&:hover': { backgroundColor: 'var(--Hover)' },
      '&:active': { backgroundColor: 'var(--Active)' },
      '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
    }),
  };

  const ellipsisSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s.visible + 'px',
    height: s.visible + 'px',
    fontSize: s.fontSize,
    color: 'var(--Text-Quiet)',
    userSelect: 'none',
    letterSpacing: '1px',
  };

  return (
    <Box
      component="nav"
      aria-label="Pagination"
      className={'pagination pagination-' + variant + ' pagination-' + color + ' pagination-' + size + ' ' + className}
      sx={{ display: 'inline-flex', ...sx }}
      {...props}
    >
      <Box
        component="ul"
        className="pagination-list"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: s.gap,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexWrap: 'wrap',
        }}
      >
        {/* First button */}
        {showFirstButton && (
          <Box component="li">
            <Box
              component="button"
              aria-label="Go to first page"
              disabled={disabled || currentPage === 1}
              onClick={() => setPage(1)}
              className="pagination-btn pagination-first"
              sx={{
                ...arrowSx,
                opacity: (disabled || currentPage === 1) ? 0.35 : 1,
                cursor: (disabled || currentPage === 1) ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronsLeft size={s.iconSize} />
            </Box>
          </Box>
        )}

        {/* Previous */}
        <Box component="li">
          <Box
            component="button"
            aria-label="Go to previous page"
            disabled={disabled || currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="pagination-btn pagination-prev"
            sx={{
              ...arrowSx,
              opacity: (disabled || currentPage === 1) ? 0.35 : 1,
              cursor: (disabled || currentPage === 1) ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={s.iconSize} />
          </Box>
        </Box>

        {/* Page numbers and ellipses */}
        {pages.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <Box component="li" key={item + '-' + idx}>
                <Box className="pagination-ellipsis" sx={ellipsisSx} aria-hidden="true">…</Box>
              </Box>
            );
          }
          const isSelected = item === currentPage;
          return (
            <Box component="li" key={item}>
              <Box
                component="button"
                aria-label={'Page ' + item}
                aria-current={isSelected ? 'page' : undefined}
                disabled={disabled}
                onClick={() => setPage(item)}
                className={'pagination-btn pagination-page' + (isSelected ? ' pagination-selected' : '')}
                sx={isSelected ? selectedSx : unselectedSx}
              >
                {item}
              </Box>
            </Box>
          );
        })}

        {/* Next */}
        <Box component="li">
          <Box
            component="button"
            aria-label="Go to next page"
            disabled={disabled || currentPage === count}
            onClick={() => setPage(currentPage + 1)}
            className="pagination-btn pagination-next"
            sx={{
              ...arrowSx,
              opacity: (disabled || currentPage === count) ? 0.35 : 1,
              cursor: (disabled || currentPage === count) ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronRight size={s.iconSize} />
          </Box>
        </Box>

        {/* Last button */}
        {showLastButton && (
          <Box component="li">
            <Box
              component="button"
              aria-label="Go to last page"
              disabled={disabled || currentPage === count}
              onClick={() => setPage(count)}
              className="pagination-btn pagination-last"
              sx={{
                ...arrowSx,
                opacity: (disabled || currentPage === count) ? 0.35 : 1,
                cursor: (disabled || currentPage === count) ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronsRight size={s.iconSize} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Pagination;
