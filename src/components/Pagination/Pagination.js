// src/components/Pagination/Pagination.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Caption } from '../Typography';

/**
 * Pagination Component
 *
 * Solid only. Selected page: var(--Buttons-{C}-Button/Text/Border).
 * Unselected: outlined with var(--Quiet).
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

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, Math.min(3 + 2 * siblingCount + boundaryCount, count));
    return [...leftRange, 'ellipsis-right', ...range(count - boundaryCount + 1, count)];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(Math.max(count - (3 + 2 * siblingCount + boundaryCount) + 1, 1), count);
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
            <Button iconOnly variant={effectiveColor + '-outline'} size={s.btnSize}
              disabled={disabled || currentPage === 1}
              onClick={() => setPage(1)} aria-label="Go to first page">
              <Icon size="small"><FirstPageIcon /></Icon>
            </Button>
          </Box>
        )}

        <Box component="li">
          <Button iconOnly variant={effectiveColor + '-outline'} size={s.btnSize}
            disabled={disabled || currentPage === 1}
            onClick={() => setPage(currentPage - 1)} aria-label="Go to previous page">
            <Icon size="small"><ChevronLeftIcon /></Icon>
          </Button>
        </Box>

        {pages.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <Box component="li" key={item + '-' + idx}>
                <Caption style={{ color: 'var(--Quiet)', padding: '0 4px' }} aria-hidden="true">…</Caption>
              </Box>
            );
          }
          const isSelected = item === currentPage;
          return (
            <Box component="li" key={item}>
              <Button
                variant={isSelected ? effectiveColor : effectiveColor + '-outline'}
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
          <Button iconOnly variant={effectiveColor + '-outline'} size={s.btnSize}
            disabled={disabled || currentPage === count}
            onClick={() => setPage(currentPage + 1)} aria-label="Go to next page">
            <Icon size="small"><ChevronRightIcon /></Icon>
          </Button>
        </Box>

        {showLastButton && (
          <Box component="li">
            <Button iconOnly variant={effectiveColor + '-outline'} size={s.btnSize}
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
