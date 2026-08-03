// src/components/List/List.js
import React from 'react';
import { Box, Checkbox, Radio } from '@mui/material';
import { OverlineSmall, SubtitleLarge, Body, BodySmallSemibold } from '../Typography';

// Default three-layer typography for the text frame. Order is top→bottom:
//   overline  — OverlineSmall  (optional metadata kicker on top)
//   title     — SubtitleLarge  (children, the main label)
//   secondary — Body           (supporting description)
// Single-line consumers (just `children`) render only the SubtitleLarge title
// so plain "Home" / "Inbox" rows still look like titles, not metadata.
const DEFAULT_LAYERS = {
  overline:  OverlineSmall,
  title:     Body,                // children / name → Body-Medium
  secondary: BodySmallSemibold,   // supporting / role → Body-Small-Semibold
};

const SOLID_THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info-Medium',
  success: 'Success-Medium',
  warning: 'Warning-Medium',
  error: 'Error-Medium',
};

const LIGHT_THEME_MAP = {
  primary: 'Primary-Light',
  secondary: 'Secondary-Light',
  tertiary: 'Tertiary-Light',
  neutral: 'Neutral-Light',
  info: 'Info-Light',
  success: 'Success-Light',
  warning: 'Warning-Light',
  error: 'Error-Light',
};

const SIZE_MAP = {
  small:  { py: 0.5, px: 1.5, fontSize: '13px', iconSize: 16, decoratorSize: 28, gap: 1, checkSize: 'small' },
  medium: { py: 1,   px: 1,   fontSize: '14px', iconSize: 20, decoratorSize: 36, gap: 1.5, checkSize: 'small' },
  large:  { py: 1.5, px: 2.5, fontSize: '16px', iconSize: 24, decoratorSize: 40, gap: 2, checkSize: 'medium' },
};

export function ListItemDecorator({ children, size = 'medium', isButton = false, onAction, ariaLabel }) {
  // Both decorator paths now hug their content — no forced width/height. The
  // consumer passes a sized child (Icon size="small", Avatar size="medium",
  // Ratio ratio="1:1" with maxWidth, etc.) and the slot wraps it tightly.
  if (isButton) {
    return (
      <Box component="button" role="button" tabIndex={0}
        aria-label={ariaLabel || 'Action'}
        onClick={(e) => { e.stopPropagation(); onAction?.(e); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onAction?.(e); } }}
        className="list-item-decorator-button"
        sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          padding: 0,
          border: 'none', backgroundColor: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'inherit',
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(128,128,128,0.15)' },
          '&:active': { backgroundColor: 'rgba(128,128,128,0.25)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' } }}>
        {children}
      </Box>
    );
  }
  return (
    <Box className="list-item-decorator"
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </Box>
  );
}

export function ListItem({
  children, startDecorator, endDecorator,
  startDecoratorIsButton = false, endDecoratorIsButton = false,
  onStartDecoratorAction, onEndDecoratorAction,
  startDecoratorAriaLabel, endDecoratorAriaLabel,
  size = 'medium', variant = 'default', color,
  // Three stacked text layers — children is the title (SubtitleLarge),
  // secondary is supporting body (Body), overline is the optional kicker
  // on top (OverlineSmall). Vstacked with no gap (line-height carries rhythm).
  overline, secondary,
  clickable = false, disabled = false, selected = false,
  selectionMode = 'none', onSelect, onClick,
  // Non-clickable mode dividers. Apply only when !clickable — the clickable
  // mode has its own card chrome (border + shadow) instead. bottomBorder
  // separates rows in a vertical non-clickable list; rightBorder separates
  // items in a horizontal non-clickable list.
  bottomBorder = false, rightBorder = false,
  sx = {}, ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isClickable = clickable || !!onClick;
  const isSelectable = selectionMode === 'checkbox' || selectionMode === 'radio';
  const isFocusable = (isClickable || isSelectable) && !disabled;

  const getRole = () => {
    if (isSelectable) return 'option';
    if (isClickable) return 'button';
    return 'listitem';
  };

  const handleClick = (e) => {
    if (disabled) return;
    if (isSelectable) onSelect?.(e);
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(e); }
  };

  return (
    <Box component="li" role={getRole()} tabIndex={isFocusable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      aria-selected={isSelectable ? selected : (selected || undefined)}
      aria-checked={selectionMode === 'checkbox' ? selected : undefined}
      onClick={handleClick} onKeyDown={isFocusable ? handleKeyDown : undefined}
      className={'list-item' + (selected ? ' list-item-selected' : '') + (disabled ? ' list-item-disabled' : '')
        + (isClickable ? ' list-item-clickable' : '') + (isSelectable ? ' list-item-selectable' : '')}
      sx={{
        // hstack, top-left aligned, fill width, with Sizing-1-and-Half (12px)
        // gap between Start slot → Text frame → End slot.
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        // Include padding in the 100% width so the row fills — not overflows —
        // its parent (without this, width:100% + 16px L/R padding spills 32px).
        boxSizing: 'border-box',
        gap: 'var(--Sizing-1-and-Half)',
        py: s.py, px: s.px,
        minHeight: '32px',
        fontSize: s.fontSize, fontFamily: 'inherit', color: 'var(--Text)', listStyle: 'none',
        cursor: isFocusable ? 'pointer' : 'default', opacity: disabled ? 0.5 : 1,
        position: 'relative',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        // Card chrome — only when the row is clickable. Non-clickable rows
        // stay bare so they sit flat in a stack; non-clickable dividers
        // (bottomBorder / rightBorder) handle row separation instead.
        ...(isClickable ? {
          border: '1px solid var(--Border)',
          boxShadow: 'var(--Effect-Level-1)',
          padding: 'var(--Sizing-1)',
          borderRadius: 'var(--Input-Radius)',
        } : {}),
        // Non-clickable separators — single hairline at the edge the user
        // requested. Mutually exclusive with card chrome above.
        ...(!isClickable && bottomBorder ? {
          borderBottom: '1px solid var(--Border-Variant)',
        } : {}),
        ...(!isClickable && rightBorder ? {
          borderRight: '1px solid var(--Border-Variant)',
        } : {}),
        backgroundColor: selected ? 'var(--Hover)' : 'transparent',
        '&:hover':         isFocusable ? { backgroundColor: 'var(--Hover)',  boxShadow: 'var(--Effect-Level-2)' } : {},
        '&:active':        isFocusable ? { backgroundColor: 'var(--Active)', boxShadow: 'var(--Effect-Level-1)' } : {},
        // Inset focus ring rendered as a pseudo-element so the corner
        // radius (--Input-Inner-Focus-Visible = Input-Radius minus 1px)
        // can differ from the row's outer radius. A CSS `outline` follows
        // the element's own border-radius and can't be tuned per-state.
        '&:focus-visible': { outline: 'none' },
        '&:focus-visible::after': {
          content: '""',
          position: 'absolute',
          inset: '1px',
          border: '3px solid var(--Focus-Visible)',
          borderRadius: 'var(--Input-Inner-Focus-Visible)',
          pointerEvents: 'none',
        },
        ...sx }}
      {...props}>
      {selectionMode === 'checkbox' && (
        <Checkbox checked={selected} disabled={disabled} size={s.checkSize} tabIndex={-1}
          onClick={(e) => e.stopPropagation()} onChange={() => onSelect?.()}
          sx={{ p: 0, mr: 0, color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
          inputProps={{ 'aria-label': 'Select ' + (typeof children === 'string' ? children : 'item') }} />
      )}
      {selectionMode === 'radio' && (
        <Radio checked={selected} disabled={disabled} size={s.checkSize} tabIndex={-1}
          onClick={(e) => e.stopPropagation()} onChange={() => onSelect?.()}
          sx={{ p: 0, mr: 0, color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
          inputProps={{ 'aria-label': 'Select ' + (typeof children === 'string' ? children : 'item') }} />
      )}
      {startDecorator && (
        <ListItemDecorator size={size} isButton={startDecoratorIsButton}
          onAction={onStartDecoratorAction} ariaLabel={startDecoratorAriaLabel}>
          {startDecorator}
        </ListItemDecorator>
      )}
      {(() => {
        // Text frame — flex-fills the remaining horizontal space between
        // start decorator and end decorator. The text frame ITSELF fills,
        // and each line wraps naturally rather than ellipsis-truncating.
        // Order is top→bottom: overline (kicker) → children (title) →
        // secondary (body).
        const Layers = DEFAULT_LAYERS;
        const lineSx = {
          display: 'block',
          width: '100%',
          // Allow natural wrapping. Long strings flow to multiple lines
          // instead of getting cut with ellipsis — the row's minHeight
          // gives the visual baseline; the text decides the real height.
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        };
        return (
          <Box sx={{
            // Fill the remaining horizontal space. minWidth:0 lets flex
            // shrink past the children's intrinsic size so wrapping works
            // (without it, long unbroken text would overflow the row).
            flex: '1 1 auto',
            width: '100%',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            // Text layers (overline → title → secondary) stack with NO gap —
            // line-height carries the rhythm; matches the Figma text frame.
            gap: 0,
          }}>
            {overline && (
              <Layers.overline style={{ ...lineSx, color: 'var(--Quiet)' }}>
                {overline}
              </Layers.overline>
            )}
            {children !== undefined && children !== null && (
              <Layers.title style={{ ...lineSx, color: 'var(--Text)' }}>
                {children}
              </Layers.title>
            )}
            {secondary && (
              <Layers.secondary style={{ ...lineSx, color: 'var(--Quiet)' }}>
                {secondary}
              </Layers.secondary>
            )}
          </Box>
        );
      })()}
      {endDecorator && (
        <ListItemDecorator size={size} isButton={endDecoratorIsButton}
          onAction={onEndDecoratorAction} ariaLabel={endDecoratorAriaLabel}>
          {endDecorator}
        </ListItemDecorator>
      )}
    </Box>
  );
}

export function List({
  children, items, variant = 'default', color = 'primary', size = 'medium',
  orientation = 'vertical', dividers = false, selectionMode = 'none',
  selectedIndices = [], onSelectionChange, clickable = false,
  component = 'ul', className = '', sx = {}, ...props
}) {
  const isHorizontal = orientation === 'horizontal';
  const isSelectable = selectionMode === 'checkbox' || selectionMode === 'radio';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isDefault = variant === 'default';

  const wrapperDataAttrs = {};
  if (isSolid && SOLID_THEME_MAP[color]) {
    wrapperDataAttrs['data-theme'] = SOLID_THEME_MAP[color];
  } else if (isLight && LIGHT_THEME_MAP[color]) {
    wrapperDataAttrs['data-theme'] = LIGHT_THEME_MAP[color];
  }

  const handleItemSelect = (index) => {
    if (!onSelectionChange) return;
    if (selectionMode === 'radio') {
      onSelectionChange([index]);
    } else {
      const next = selectedIndices.includes(index)
        ? selectedIndices.filter((i) => i !== index)
        : [...selectedIndices, index];
      onSelectionChange(next);
    }
  };

  const renderItems = () => {
    if (items && items.length > 0) {
      const elements = [];
      items.forEach((item, index) => {
        elements.push(
          <ListItem key={'item-' + index} size={size} variant={variant} color={color}
            startDecorator={item.startDecorator} endDecorator={item.endDecorator}
            startDecoratorIsButton={item.startDecoratorIsButton}
            endDecoratorIsButton={item.endDecoratorIsButton}
            onStartDecoratorAction={item.onStartDecoratorAction}
            onEndDecoratorAction={item.onEndDecoratorAction}
            startDecoratorAriaLabel={item.startDecoratorAriaLabel}
            endDecoratorAriaLabel={item.endDecoratorAriaLabel}
            overline={item.overline} secondary={item.secondary}
            clickable={clickable || item.clickable}
            disabled={item.disabled}
            bottomBorder={item.bottomBorder}
            rightBorder={item.rightBorder}
            selected={isSelectable ? selectedIndices.includes(index) : item.selected}
            selectionMode={selectionMode} onSelect={() => handleItemSelect(index)}
            onClick={item.onClick}>
            {item.label || item.children}
          </ListItem>
        );
        if (dividers && index < items.length - 1) {
          elements.push(
            <Box key={'div-' + index} component="li" role="separator" aria-hidden="true"
              sx={isHorizontal
                ? { width: '1px', alignSelf: 'stretch', backgroundColor: 'var(--Border)', flexShrink: 0 }
                : { height: '1px', backgroundColor: 'var(--Border)' }} />
          );
        }
      });
      return elements;
    }
    if (children) {
      const childArray = React.Children.toArray(children);
      if (!dividers) return childArray;
      const elements = [];
      childArray.forEach((child, index) => {
        elements.push(child);
        if (index < childArray.length - 1) {
          elements.push(
            <Box key={'div-' + index} component="li" role="separator" aria-hidden="true"
              sx={isHorizontal
                ? { width: '1px', alignSelf: 'stretch', backgroundColor: 'var(--Border)', flexShrink: 0 }
                : { height: '1px', backgroundColor: 'var(--Border)' }} />
          );
        }
      });
      return elements;
    }
    return null;
  };

  return (
    <Box component={component} role={isSelectable ? 'listbox' : 'list'}
      aria-multiselectable={selectionMode === 'checkbox' ? true : undefined}
      {...wrapperDataAttrs}
      className={'list-container list-' + variant + ' list-' + color + ' ' + className}
      sx={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column',
        boxSizing: 'border-box',
        // Stretch in both orientations:
        //   • vertical → items span full width
        //   • horizontal → items match the tallest sibling's height, so
        //     a row of items all have a uniform bottom edge and the
        //     content within each item is top-aligned.
        alignItems: 'stretch',
        // Clickable Lists separate their card-chromed items with 8px to
        // keep individual borders + shadows visually distinct. Non-clickable
        // Lists keep gap:0 — rows are visually joined by hairlines or just
        // sit flush against each other.
        gap: clickable ? 'var(--Sizing-1)' : 0,
        m: 0,
        p: isDefault ? 0 : 1,
        backgroundColor: isDefault ? 'transparent' : 'var(--Background)',
        color: 'var(--Text)',
        // The List container has NO border by itself. Visual separation
        // between rows is the responsibility of ListItem (via clickable
        // chrome OR bottomBorder/rightBorder dividers).
        borderRadius: isDefault ? 0 : 'var(--Style-Border-Radius)',
        // List fills its parent's width. No overflow:hidden — items'
        // shadows and focus rings (which can extend slightly beyond the
        // row edge) shouldn't be clipped at the container boundary.
        width: '100%',
        listStyle: 'none',
        // In horizontal mode, every direct child item flexes equally so a
        // row of items has uniform column widths. width:100% on the item
        // works for vertical stacks but in a row it'd force each item to
        // 100% of the container; flex:1 1 0 distributes evenly instead.
        ...(isHorizontal ? {
          '& > .list-item': { flex: '1 1 0', width: 'auto' },
        } : {}),
        ...sx }}
      {...props}>
      {renderItems()}
    </Box>
  );
}

export const DefaultList = (p) => <List variant="default" {...p} />;
export const SolidList   = (p) => <List variant="solid"   {...p} />;
export const LightList   = (p) => <List variant="light"   {...p} />;
export default List;