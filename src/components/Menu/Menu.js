// src/components/Menu/Menu.js
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon } from '../Icon/Icon';
import { BodySmall, Body } from '../Typography';

/**
 * Menu Component Suite
 *
 * VARIANTS (on Menu popup):
 *   outline   bg transparent, border var(--Buttons-{C}-Border)
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}-Light" data-surface="Surface"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border var(--Buttons-{C}-Border), Effect-Level-3 shadow
 *   Inner content — data-theme + data-surface (for solid/light), bg var(--Background)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { py: '4px',  itemPx: '8px',  itemPy: '4px',  fontSize: '13px', minWidth: '140px' },
  medium: { py: '6px',  itemPx: '12px', itemPy: '6px',  fontSize: '14px', minWidth: '160px' },
  large:  { py: '8px',  itemPx: '16px', itemPy: '8px',  fontSize: '16px', minWidth: '180px' },
};

/* ─── Context ─── */
const DropdownContext = createContext({
  open: false, setOpen: () => {}, anchorRef: { current: null },
  menuId: '', buttonId: '',
  variant: 'outline', color: 'default', size: 'medium',
});
const useDropdown = () => useContext(DropdownContext);

/* ─── Dropdown ─── */
export function Dropdown({
  children, variant = 'outline', color = 'default', size = 'medium',
  open: controlledOpen, onOpenChange, ...props
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = controlledOpen !== undefined;
  const open = controlled ? controlledOpen : internalOpen;
  const anchorRef = useRef(null);
  const uid = useId();
  const menuId = 'menu-' + uid;
  const buttonId = 'menubtn-' + uid;

  const setOpen = useCallback((val) => {
    const next = typeof val === 'function' ? val(open) : val;
    if (controlled) onOpenChange?.(next);
    else setInternalOpen(next);
  }, [controlled, open, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, anchorRef, menuId, buttonId, variant, color, size }}>
      <Box sx={{ display: 'inline-flex', position: 'relative' }} {...props}>
        {children}
      </Box>
    </DropdownContext.Provider>
  );
}

/* ─── MenuButton ─── */
export function MenuButton({ children, className = '', sx = {}, ...props }) {
  const { open, setOpen, anchorRef, menuId, buttonId, size, color } = useDropdown();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const C = cap(color === 'default' ? 'Default' : color);

  return (
    <Box
      component="button" ref={anchorRef} id={buttonId}
      aria-haspopup="true" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => setOpen((prev) => !prev)}
      className={'menu-button ' + className}
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: s.itemPy + ' ' + s.itemPx,
        fontSize: s.fontSize, fontFamily: 'inherit', fontWeight: 600,
        color: 'var(--Text)',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Buttons-' + C + '-Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        cursor: 'pointer',
        boxShadow: 'var(--Effect-Level-1)',
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        ...sx,
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); setOpen(true);
        }
      }}
      {...props}
    >
      {children}
      <Icon size="small" sx={{ color: 'var(--Quiet)', transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        <ExpandMoreIcon />
      </Icon>
    </Box>
  );
}

/* ─── Menu ─── */
export function Menu({ children, className = '', placement = 'bottom-start', sx = {}, ...props }) {
  const { open, setOpen, anchorRef, menuId, buttonId, variant, color, size } = useDropdown();
  const menuRef = useRef(null);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const C = cap(color === 'default' ? 'Default' : color);
  const isOutline = variant === 'outline';
  const borderToken = 'var(--Buttons-' + C + '-Border)';

  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C + '-Light')
    : variant === 'solid' ? C : undefined;
  const dataSurface = (variant === 'solid' || variant === 'light') ? 'Surface' : undefined;

  useEffect(() => {
    if (open && menuRef.current) {
      const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([aria-disabled="true"])');
      if (firstItem) firstItem.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { setOpen(false); anchorRef.current?.focus(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen, anchorRef]);

  if (!open) return null;

  return (
    <Box
      className={'menu menu-' + variant + ' ' + className}
      sx={{
        position: 'absolute',
        top: '100%', left: placement === 'bottom-end' ? 'auto' : 0,
        right: placement === 'bottom-end' ? 0 : 'auto',
        zIndex: 99999, marginTop: '4px',
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: 'var(--Effect-Level-3)',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        ref={menuRef} id={menuId} role="menu" aria-labelledby={buttonId}
        data-theme={dataTheme} data-surface={dataSurface}
        sx={{
          minWidth: s.minWidth,
          backgroundColor: isOutline ? 'var(--Background)' : 'var(--Background)',
          color: 'var(--Text)',
          fontSize: s.fontSize, fontFamily: 'inherit',
          padding: s.py + ' 0',
          outline: 'none',
          borderRadius: 'calc(var(--Style-Border-Radius) - 1px)',
        }}
        onKeyDown={(e) => {
          const items = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
          if (!items?.length) return;
          const ci = Array.from(items).indexOf(document.activeElement);
          if (e.key === 'ArrowDown') { e.preventDefault(); items[(ci + 1) % items.length].focus(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); items[(ci - 1 + items.length) % items.length].focus(); }
          else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
          else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
          else if (e.key === 'Tab') setOpen(false);
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ─── MenuItem ─── */
export function MenuItem({ children, onClick, selected = false, disabled = false, className = '', sx = {}, ...props }) {
  const { setOpen, size } = useDropdown();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const TextComp = size === 'small' ? BodySmall : Body;

  const handleClick = () => {
    if (disabled) return;
    onClick?.(); setOpen(false);
  };

  return (
    <Box
      role="menuitem" tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined} aria-selected={selected || undefined}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className={'menu-item' + (selected ? ' menu-item-selected' : '') + ' ' + className}
      sx={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: s.itemPy + ' ' + s.itemPx,
        color: disabled ? 'var(--Quiet)' : (selected ? 'var(--Text)' : 'var(--Quiet)'),
        backgroundColor: selected ? 'var(--Hover)' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none', transition: 'background-color 0.1s ease, color 0.1s ease',
        userSelect: 'none',
        ...(!disabled && {
          '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
          '&:focus-visible': { backgroundColor: 'var(--Hover)', color: 'var(--Text)', outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
        }),
        ...sx,
      }}
      {...props}
    >
      <TextComp style={{ color: 'inherit', fontWeight: selected ? 600 : 'inherit' }}>{children}</TextComp>
    </Box>
  );
}

/* ─── MenuDivider ─── */
export function MenuDivider({ className = '', sx = {}, ...props }) {
  return (
    <Box component="hr" role="separator" className={'menu-divider ' + className}
      sx={{ border: 'none', borderTop: '1px solid var(--Border)', margin: '4px 0', ...sx }} {...props} />
  );
}

export default Menu;
