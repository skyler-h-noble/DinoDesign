// src/components/List/List.js
import React from 'react';
import { Box, Checkbox, Radio } from '@mui/material';

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
  medium: { py: 1,   px: 2,   fontSize: '14px', iconSize: 20, decoratorSize: 36, gap: 1.5, checkSize: 'small' },
  large:  { py: 1.5, px: 2.5, fontSize: '16px', iconSize: 24, decoratorSize: 40, gap: 2, checkSize: 'medium' },
};

export function ListItemDecorator({ children, size = 'medium', isButton = false, onAction, ariaLabel }) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  if (isButton) {
    return (
      <Box component="button" role="button" tabIndex={0}
        aria-label={ariaLabel || 'Action'}
        onClick={(e) => { e.stopPropagation(); onAction?.(e); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onAction?.(e); } }}
        className="list-item-decorator-button"
        sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          width: (s.decoratorSize + 4) + 'px', height: (s.decoratorSize + 4) + 'px', padding: '2px',
          border: 'none', backgroundColor: 'transparent', borderRadius: '50%', cursor: 'pointer', color: 'inherit',
          transition: 'background-color 0.15s ease',
          '&:hover': { backgroundColor: 'rgba(128,128,128,0.15)' },
          '&:active': { backgroundColor: 'rgba(128,128,128,0.25)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
          '& .MuiSvgIcon-root': { fontSize: s.iconSize + 'px' } }}>
        {children}
      </Box>
    );
  }
  return (
    <Box className="list-item-decorator"
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        width: s.decoratorSize + 'px', height: s.decoratorSize + 'px',
        '& .MuiSvgIcon-root': { fontSize: s.iconSize + 'px' },
        '& .MuiAvatar-root': { width: s.decoratorSize + 'px', height: s.decoratorSize + 'px', fontSize: (s.iconSize - 2) + 'px' },
        '& img': { width: s.decoratorSize + 'px', height: s.decoratorSize + 'px', borderRadius: '4px', objectFit: 'cover' } }}>
      {children}
    </Box>
  );
}

export function ListItem({
  children, startDecorator, endDecorator,
  startDecoratorIsButton = false, endDecoratorIsButton = false,
  onStartDecoratorAction, onEndDecoratorAction,
  startDecoratorAriaLabel, endDecoratorAriaLabel,
  size = 'medium', variant = 'default', color, secondary,
  clickable = false, disabled = false, selected = false,
  selectionMode = 'none', onSelect, onClick, sx = {}, ...props
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
      sx={{ display: 'flex', alignItems: 'center', gap: s.gap, py: s.py, px: s.px,
        fontSize: s.fontSize, fontFamily: 'inherit', color: 'var(--Text)', listStyle: 'none',
        cursor: isFocusable ? 'pointer' : 'default', opacity: disabled ? 0.5 : 1,
        borderRadius: 'var(--Style-Border-Radius)',
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        backgroundColor: selected ? 'var(--Hover)' : 'transparent',
        '&:hover': isFocusable ? { backgroundColor: 'var(--Hover)' } : {},
        '&:active': isFocusable ? { backgroundColor: 'var(--Background)' } : {},
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
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
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</Box>
        {secondary && (
          <Box sx={{ fontSize: size === 'small' ? '11px' : size === 'large' ? '13px' : '12px',
            opacity: 0.7, mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {secondary}
          </Box>
        )}
      </Box>
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
            secondary={item.secondary} clickable={clickable || item.clickable}
            disabled={item.disabled}
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
        alignItems: isHorizontal ? 'center' : 'stretch', gap: 0, m: 0,
        p: isDefault ? 0 : 1,
        backgroundColor: isDefault ? 'transparent' : 'var(--Background)',
        color: 'var(--Text)',
        border: '1px solid var(--Border)',
        borderRadius: isDefault ? 0 : 'var(--Style-Border-Radius)',
        listStyle: 'none', overflow: 'hidden', ...sx }}
      {...props}>
      {renderItems()}
    </Box>
  );
}

export const DefaultList = (p) => <List variant="default" {...p} />;
export const SolidList   = (p) => <List variant="solid"   {...p} />;
export const LightList   = (p) => <List variant="light"   {...p} />;
export default List;