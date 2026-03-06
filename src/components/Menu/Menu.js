// src/components/Menu/Menu.js
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from 'react';
import { Box } from '@mui/material';

/**
 * Menu Component Suite
 *
 * Dropdown  — context wrapper wiring MenuButton + Menu
 * MenuButton — trigger button that opens the menu
 * Menu — popup listbox (outlined border)
 * MenuItem — individual menu item
 * MenuDivider — visual separator between items
 *
 * VARIANTS (on Menu popup):
 *   default   No data-theme. bg: var(--Background), border: var(--Border).
 *   solid     data-theme={Color}, data-surface="Surface". bg: var(--Surface), border: var(--Border).
 *   light     data-theme={Color}-Light. bg: var(--Surface), border: var(--Border).
 *
 * ALL MENUS: outlined (1px solid var(--Border)), border-radius: var(--Style-Border-Radius)
 * SIZES: small | medium | large
 * OPEN STATE: uncontrolled (internal) or controlled (open prop)
 */

const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};

const SIZE_MAP = {
  small:  { py: '4px',  itemPx: '8px',  itemPy: '4px',  fontSize: '13px', gap: '0px', minWidth: '140px' },
  medium: { py: '6px',  itemPx: '12px', itemPy: '6px',  fontSize: '14px', gap: '0px', minWidth: '160px' },
  large:  { py: '8px',  itemPx: '16px', itemPy: '8px',  fontSize: '16px', gap: '0px', minWidth: '180px' },
};

/* ─── Context ─── */
const DropdownContext = createContext({
  open: false,
  setOpen: () => {},
  anchorRef: { current: null },
  menuId: '',
  buttonId: '',
  variant: 'default',
  color: 'primary',
  size: 'medium',
  controlled: false,
});
const useDropdown = () => useContext(DropdownContext);

/* ─── Dropdown ─── */
export function Dropdown({
  children,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  open: controlledOpen,
  onOpenChange,
  ...props
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
    if (controlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  }, [controlled, open, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, anchorRef, menuId, buttonId, variant, color, size, controlled }}>
      <Box
        className="dropdown"
        sx={{ display: 'inline-flex', position: 'relative' }}
        {...props}
      >
        {children}
      </Box>
    </DropdownContext.Provider>
  );
}

/* ─── MenuButton ─── */
export function MenuButton({
  children,
  className = '',
  sx = {},
  ...props
}) {
  const { open, setOpen, anchorRef, menuId, buttonId, size } = useDropdown();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <Box
      component="button"
      ref={anchorRef}
      id={buttonId}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      onClick={() => setOpen((prev) => !prev)}
      className={'menu-button menu-button-' + size + ' ' + className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: s.itemPy + ' ' + s.itemPx,
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        fontWeight: 600,
        color: 'var(--Text)',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          backgroundColor: 'var(--Surface-Dim)',
          borderColor: 'var(--Border)',
        },
        '&:focus-visible': {
          outline: '3px solid var(--Focus-Visible)',
          outlineOffset: '-3px',
        },
        '&::after': {
          content: '"▾"',
          fontSize: '0.8em',
          marginLeft: '2px',
          opacity: 0.6,
        },
        ...sx,
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen(true);
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── Menu ─── */
export function Menu({
  children,
  className = '',
  placement = 'bottom-start',
  sx = {},
  ...props
}) {
  const { open, setOpen, anchorRef, menuId, buttonId, variant, color, size } = useDropdown();
  const menuRef = useRef(null);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const isDefault = variant === 'default';
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';

  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  const bg = isDefault ? 'var(--Background)' : 'var(--Surface)';

  // Focus first item when opened
  useEffect(() => {
    if (open && menuRef.current) {
      const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([aria-disabled="true"])');
      if (firstItem) firstItem.focus();
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, setOpen, anchorRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen, anchorRef]);

  if (!open) return null;

  return (
    <Box
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-labelledby={buttonId}
      data-theme={dataTheme || undefined}
      {...(isSolid ? { 'data-surface': 'Surface' } : {})}
      className={
        'menu menu-' + variant + ' menu-' + size
        + (isSolid || isLight ? ' menu-' + color : '')
        + ' ' + className
      }
      sx={{
        position: 'absolute',
        top: '100%',
        left: placement === 'bottom-end' ? 'auto' : 0,
        right: placement === 'bottom-end' ? 0 : 'auto',
        zIndex: 1300,
        marginTop: '4px',
        minWidth: s.minWidth,
        backgroundColor: bg,
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        padding: s.py + ' 0',
        outline: 'none',
        color: 'var(--Text)',
        fontSize: s.fontSize,
        fontFamily: 'inherit',
        overflow: 'hidden',
        ...sx,
      }}
      onKeyDown={(e) => {
        const items = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
        if (!items?.length) return;
        const currentIndex = Array.from(items).indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (currentIndex + 1) % items.length;
          items[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (currentIndex - 1 + items.length) % items.length;
          items[prev].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (e.key === 'Tab') {
          setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── MenuItem ─── */
export function MenuItem({
  children,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  sx = {},
  ...props
}) {
  const { setOpen, size } = useDropdown();
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  return (
    <Box
      component="div"
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-selected={selected || undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={
        'menu-item menu-item-' + size
        + (selected ? ' menu-item-selected' : '')
        + (disabled ? ' menu-item-disabled' : '')
        + ' ' + className
      }
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: s.itemPy + ' ' + s.itemPx,
        fontSize: 'inherit',
        fontFamily: 'inherit',
        color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
        backgroundColor: selected ? 'var(--Surface-Dim)' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        transition: 'background-color 0.1s ease',
        userSelect: 'none',
        ...(!disabled && {
          '&:hover': {
            backgroundColor: 'var(--Surface-Dim)',
          },
          '&:focus-visible': {
            backgroundColor: 'var(--Surface-Dim)',
            outline: '3px solid var(--Focus-Visible)',
            outlineOffset: '-3px',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

/* ─── MenuDivider ─── */
export function MenuDivider({ className = '', sx = {}, ...props }) {
  return (
    <Box
      component="hr"
      role="separator"
      className={'menu-divider ' + className}
      sx={{
        border: 'none',
        borderTop: '1px solid var(--Border)',
        margin: '4px 0',
        ...sx,
      }}
      {...props}
    />
  );
}

export default Menu;
