// src/components/Pagination/Pagination.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ChevronLeftIcon from '@omni-design/icons/KeyboardArrowLeft';
import ChevronRightIcon from '@omni-design/icons/KeyboardArrowRight';
import FirstPageIcon from '@omni-design/icons/KeyboardDoubleArrowLeft';
import LastPageIcon from '@omni-design/icons/KeyboardDoubleArrowRight';
import MoreHorizIcon from '@omni-design/icons/MoreHoriz';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

/**
 * Pagination Component
 *
 * Figma's Pagination Strip (Ellipsis = None | End | Both | Start, First and
 * Last) of Pagination Numbers. The current page is the outline button,
 * selected (Pressed fill, Border, Outline-Text); the other pages and every
 * arrow are ghost buttons in the palette ({color}-ghost). First / last are the
 * double arrows. A gap is the Pagination Ellipsis cell — a quiet more_horiz in
 * a Button-Height square, not a control.
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 * SIZES: small | medium | large
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { btnSize: 'small',  fontSize: '13px', gap: '2px' },
  medium: { btnSize: 'medium', fontSize: '14px', gap: '4px' },
  large:  { btnSize: 'large',  fontSize: '16px', gap: '4px' },
};

/* ─── Pagination algorithm ─── */
function usePaginationRange({ count, page, siblingCount = 1, boundaryCount = 1 }) {
  const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
  if (totalPageNumbers >= count) return range(1, count);

  const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1);
  const rightSiblingIndex = Math.min(page + siblingCount, count - boundaryCount);
  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < count - boundaryCount - 1;

  /* The same number of cells wherever you are — 1 2 3 4 5 … 10 at the start,
     1 … 4 5 6 … 10 in the middle, 1 … 6 7 8 9 10 at the end (Figma's
     Pagination Strip). The edge ranges counted the boundary pages twice, so
     the start and end showed one page more than the middle and the strip
     changed width as you paged. */
  const edgeCount = totalPageNumbers - boundaryCount - 1;
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, Math.min(edgeCount, count));
    return [...leftRange, 'ellipsis-right', ...range(count - boundaryCount + 1, count)];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(Math.max(count - edgeCount + 1, 1), count);
    return [...range(1, boundaryCount), 'ellipsis-left', ...rightRange];
  }
  if (showLeftEllipsis && showRightEllipsis) {
    return [...range(1, boundaryCount), 'ellipsis-left', ...range(leftSiblingIndex, rightSiblingIndex), 'ellipsis-right', ...range(count - boundaryCount + 1, count)];
  }
  return range(1, count);
}

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
export function Pagination({
  theme,
  surface,
  count = 10,
  page: controlledPage,
  defaultPage = 1,
  onChange,
  color = 'default',
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
  const C = cap(color === 'default' ? 'Default' : color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const setPage = useCallback((newPage) => {
    const clamped = Math.max(1, Math.min(count, newPage));
    if (!isControlled) setInternalPage(clamped);
    onChange?.(clamped);
  }, [count, isControlled, onChange]);

  const pages = usePaginationRange({ count, page: currentPage, siblingCount, boundaryCount });

  const effectiveColor = color === 'default' ? 'default' : color;

  return (
    <Box
      component="nav"
      aria-label="Pagination"
      data-theme={theme || undefined}
      data-surface={surface || undefined}
      className={'pagination pagination-' + color + ' pagination-' + size + ' ' + className}
      sx={{ display: 'inline-flex', ...sx }}
      {...props}
    >
      <Box
        component="ul"
        sx={{ display: 'flex', alignItems: 'center', gap: s.gap, listStyle: 'none', m: 0, p: 0, flexWrap: 'wrap' }}
      >
        {showFirstButton && (
          <Box component="li">
            <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
              disabled={disabled || currentPage === 1}
              onClick={() => setPage(1)} aria-label="Go to first page">
              <Icon size="small"><FirstPageIcon /></Icon>
            </Button>
          </Box>
        )}

        <Box component="li">
          <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
            disabled={disabled || currentPage === 1}
            onClick={() => setPage(currentPage - 1)} aria-label="Go to previous page">
            <Icon size="small"><ChevronLeftIcon /></Icon>
          </Button>
        </Box>

        {pages.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <Box component="li" key={item + '-' + idx}>
                {/* Figma's Pagination Ellipsis: not a control, so no states. */}
                <Box className="pagination-ellipsis" aria-hidden="true" sx={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 'var(--Button-Height, 32px)', height: 'var(--Button-Height, 32px)',
                  color: 'var(--Quiet)',
                }}>
                  <Icon size="small"><MoreHorizIcon /></Icon>
                </Box>
              </Box>
            );
          }
          const isSelected = item === currentPage;
          return (
            <Box component="li" key={item}>
              {/* Unselected pages are GHOST (Figma's Pagination Number):
                  Outline-Quiet at rest, Outline-Text when engaged, no edge,
                  so the current page is the only one with chrome. The
                  current page is the OUTLINE button with the Pressed fill —
                  not the solid one, whose --Buttons-{C}-Button resolves to
                  the surface's own tone on a themed surface and would vanish
                  into it. */}
              <Button
                variant={isSelected ? effectiveColor + '-outline' : effectiveColor + '-ghost'}
                selected={isSelected}
                size={s.btnSize}
                disabled={disabled}
                onClick={() => setPage(item)}
                aria-label={'Page ' + item}
                aria-current={isSelected ? 'page' : undefined}
                letterNumber
              >
                {item}
              </Button>
            </Box>
          );
        })}

        <Box component="li">
          <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
            disabled={disabled || currentPage === count}
            onClick={() => setPage(currentPage + 1)} aria-label="Go to next page">
            <Icon size="small"><ChevronRightIcon /></Icon>
          </Button>
        </Box>

        {showLastButton && (
          <Box component="li">
            <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
              disabled={disabled || currentPage === count}
              onClick={() => setPage(count)} aria-label="Go to last page">
              <Icon size="small"><LastPageIcon /></Icon>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Pagination;
