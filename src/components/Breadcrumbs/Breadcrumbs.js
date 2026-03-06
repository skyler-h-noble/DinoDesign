// src/components/Breadcrumbs/Breadcrumbs.js
import React, { Children, isValidElement } from 'react';
import { Box } from '@mui/material';

/**
 * Breadcrumbs Component
 *
 * A navigational trail showing page hierarchy within the application.
 *
 * SIZES: small | medium | large  — scales font-size and gap
 * SEPARATOR: any React node (default "/")
 * CONDENSE: collapses middle crumbs into "…" (keeps first + last N)
 * BACK ONLY MOBILE: at ≤600px, shows only "← Parent" link
 *
 * Children should be Link or Typography elements.
 * The last child is treated as the current page (not a link, aria-current="page").
 */

const SIZE_MAP = {
  small:  { fontSize: 'var(--Body-Small-Font-Size)', gap: '6px',  py: '4px' },
  medium: { fontSize: 'var(--Body-Font-Size)',       gap: '8px',  py: '6px' },
  large:  { fontSize: 'var(--Body-Large-Font-Size)', gap: '10px', py: '8px' },
};

export function Breadcrumbs({
  children,
  separator = '/',
  size = 'medium',
  condense = false,
  maxItems = 4,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  backOnlyMobile = false,
  onExpand,
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;

  // ── Condensed items ──
  const shouldCondense = condense && total > maxItems;
  let visibleItems = items;
  const [expanded, setExpanded] = React.useState(false);

  if (shouldCondense && !expanded) {
    const before = items.slice(0, itemsBeforeCollapse);
    const after = items.slice(total - itemsAfterCollapse);
    const ellipsis = (
      <Box
        key="__breadcrumb-ellipsis"
        component="button"
        onClick={() => { setExpanded(true); onExpand?.(); }}
        aria-label="Show full breadcrumb trail"
        className="breadcrumb-ellipsis"
        sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', padding: '2px 4px',
          cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit',
          color: 'var(--Text-Quiet)', borderRadius: '4px',
          '&:hover': { backgroundColor: 'var(--Surface-Dim)', color: 'var(--Text)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
        }}
      >
        …
      </Box>
    );
    visibleItems = [...before, ellipsis, ...after];
  }

  // ── Separator renderer ──
  const renderSeparator = (key) => (
    <Box
      key={'sep-' + key}
      component="li"
      role="presentation"
      aria-hidden="true"
      className="breadcrumb-separator"
      sx={{
        display: 'inline-flex', alignItems: 'center',
        color: 'var(--Text-Quiet)', userSelect: 'none',
        fontSize: 'inherit', lineHeight: 1, flexShrink: 0,
      }}
    >
      {separator}
    </Box>
  );

  // ── Build interleaved list ──
  const interleaved = [];
  visibleItems.forEach((item, i) => {
    const isLast = (shouldCondense && !expanded)
      ? i === visibleItems.length - 1
      : i === total - 1;

    interleaved.push(
      <Box
        key={'crumb-' + i}
        component="li"
        className={'breadcrumb-item' + (isLast ? ' breadcrumb-current' : '')}
        sx={{
          display: 'inline-flex', alignItems: 'center',
          ...(isLast && { color: 'var(--Text)', fontWeight: 600 }),
          ...(!isLast && { color: 'var(--Text-Quiet)' }),
          // Truncate long crumbs
          maxWidth: '200px',
          '& > *': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        }}
        {...(isLast ? { 'aria-current': 'page' } : {})}
      >
        {item}
      </Box>
    );
    if (i < visibleItems.length - 1) {
      interleaved.push(renderSeparator(i));
    }
  });

  // ── Back-only mobile: parent link ──
  const parentItem = total >= 2 ? items[total - 2] : null;

  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      className={'breadcrumbs breadcrumbs-' + size + ' ' + className}
      sx={{
        fontSize: s.fontSize,
        fontFamily: 'var(--Body-Font-Family)',
        lineHeight: 1.5,
        ...sx,
      }}
      {...props}
    >
      {/* Full breadcrumb trail */}
      <Box
        component="ol"
        className="breadcrumbs-list"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: s.gap,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          ...(backOnlyMobile && {
            '@media (max-width: 600px)': { display: 'none' },
          }),
        }}
      >
        {interleaved}
      </Box>

      {/* Back-only mobile view */}
      {backOnlyMobile && parentItem && (
        <Box
          className="breadcrumbs-back-mobile"
          sx={{
            display: 'none',
            '@media (max-width: 600px)': {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: s.fontSize,
              color: 'var(--Link)',
            },
          }}
        >
          <Box
            component="span"
            aria-hidden="true"
            sx={{ fontSize: '1.1em', lineHeight: 1 }}
          >
            ←
          </Box>
          {React.cloneElement(parentItem, {
            style: {
              ...(parentItem.props?.style || {}),
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          })}
        </Box>
      )}
    </Box>
  );
}

/* ─── BreadcrumbItem: optional typed wrapper ─── */
export function BreadcrumbItem({ children, href, className = '', sx = {}, ...props }) {
  const isLink = !!href;
  return (
    <Box
      component={isLink ? 'a' : 'span'}
      href={href || undefined}
      className={'breadcrumb-link ' + className}
      sx={{
        color: 'inherit',
        textDecoration: isLink ? 'underline' : 'none',
        textUnderlineOffset: '3px',
        textDecorationThickness: '1px',
        cursor: isLink ? 'pointer' : 'default',
        transition: 'color 0.15s ease',
        ...(isLink && {
          '&:hover': { color: 'var(--Link-Hover)', textDecorationThickness: '2px' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px', borderRadius: '2px' },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default Breadcrumbs;
