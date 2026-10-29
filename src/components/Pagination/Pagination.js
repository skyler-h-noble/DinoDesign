// src/components/Pagination/Pagination.js
import React, { useState, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
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

const SxBox = lazySxBox('Pagination');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* What emotion's prefixer added beside align-items / justify-content — the
   legacy -webkit-box spellings — so the computed style stays exactly what it
   was. They only act on display:-webkit-box, which nothing here uses. */
const webkitBox = (css) => css
  .replace(/([;{])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/([;{])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:'
    + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);

/* The static sheet — what each part handed emotion, as classes over the same
   tokens. The ellipsis is Figma's Pagination Ellipsis: not a control, so no
   states. */
registerStaticStyles('omni-pagination', webkitBox([
  '.omni-pg{display:inline-flex}',
  '.omni-pg-list{display:flex;align-items:center;list-style:none;margin:0;padding:0;flex-wrap:wrap}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-pg-list-${k}{gap:${v.gap}}`),
  '.omni-pg-gap{display:inline-flex;align-items:center;justify-content:center;width:var(--Button-Height, 32px);height:var(--Button-Height, 32px);color:var(--Quiet)}',
].join('\n')));

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
  useStaticStyles('omni-pagination');
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;
  const C = cap(color === 'default' ? 'Default' : color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const Root = hasSx(sx) ? SxBox : 'nav';

  const setPage = useCallback((newPage) => {
    const clamped = Math.max(1, Math.min(count, newPage));
    if (!isControlled) setInternalPage(clamped);
    onChange?.(clamped);
  }, [count, isControlled, onChange]);

  const pages = usePaginationRange({ count, page: currentPage, siblingCount, boundaryCount });

  const effectiveColor = color === 'default' ? 'default' : color;

  return (
    <Root
      {...(Root === 'nav' ? {} : { component: 'nav', sx })}
      aria-label="Pagination"
      data-theme={theme || undefined}
      data-surface={surface || undefined}
      className={'pagination pagination-' + color + ' pagination-' + size + ' ' + className + ' MuiBox-root omni-pg'}
      {...props}
    >
      <ul className={'MuiBox-root omni-pg-list omni-pg-list-' + sizeKey}>
        {showFirstButton && (
          <li className="MuiBox-root">
            <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
              disabled={disabled || currentPage === 1}
              onClick={() => setPage(1)} aria-label="Go to first page">
              <Icon size="small"><FirstPageIcon /></Icon>
            </Button>
          </li>
        )}

        <li className="MuiBox-root">
          <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
            disabled={disabled || currentPage === 1}
            onClick={() => setPage(currentPage - 1)} aria-label="Go to previous page">
            <Icon size="small"><ChevronLeftIcon /></Icon>
          </Button>
        </li>

        {pages.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <li className="MuiBox-root" key={item + '-' + idx}>
                {/* Figma's Pagination Ellipsis: not a control, so no states. */}
                <div className="pagination-ellipsis MuiBox-root omni-pg-gap" aria-hidden="true">
                  <Icon size="small"><MoreHorizIcon /></Icon>
                </div>
              </li>
            );
          }
          const isSelected = item === currentPage;
          return (
            <li className="MuiBox-root" key={item}>
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
            </li>
          );
        })}

        <li className="MuiBox-root">
          <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
            disabled={disabled || currentPage === count}
            onClick={() => setPage(currentPage + 1)} aria-label="Go to next page">
            <Icon size="small"><ChevronRightIcon /></Icon>
          </Button>
        </li>

        {showLastButton && (
          <li className="MuiBox-root">
            <Button iconOnly variant={effectiveColor + '-ghost'} size={s.btnSize}
              disabled={disabled || currentPage === count}
              onClick={() => setPage(count)} aria-label="Go to last page">
              <Icon size="small"><LastPageIcon /></Icon>
            </Button>
          </li>
        )}
      </ul>
    </Root>
  );
}

export default Pagination;
