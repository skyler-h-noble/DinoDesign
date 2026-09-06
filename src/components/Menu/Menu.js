// src/components/Menu/Menu.js
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon } from '../Icon/Icon';
import { BodySmall, Body, SubtitleSmall, Subtitle } from '../Typography';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2, SHADOW_LEVEL_3 } from '../_shadows';

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

// Menu metrics per size mode.
//
// The label size reads --Button-Text (14 / 16 / 20). A menu item is a control
// label like a button's, and that is the ladder the design system generates for
// one — there is no separate --Menu-Text. It steps with the brand's button
// heights, where these were three literals (13 / 14 / 16) that did not.
//
// Padding is on the --Sizing-* scale. Medium's 6px is the one value the scale
// cannot express (it falls between --Sizing-Half and --Sizing-1), the same gap
// Badge's medium row has.
const SIZE_MAP = {
  small:  {
    py: 'var(--Sizing-Half)',  itemPx: 'var(--Sizing-1)',
    itemPy: 'var(--Sizing-Half)', fontSize: 'var(--Sm-Button-Text)', minWidth: '140px',
  },
  medium: {
    py: '6px', itemPx: 'var(--Sizing-1-and-Half)',
    itemPy: '6px', fontSize: 'var(--Button-Text)', minWidth: '160px',
  },
  large:  {
    py: 'var(--Sizing-1)', itemPx: 'var(--Sizing-2)',
    itemPy: 'var(--Sizing-1)', fontSize: 'var(--Lg-Button-Text)', minWidth: '180px',
  },
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
        boxShadow: 'none',
        transition: 'box-shadow 0.15s ease',
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
      {typeof children === 'string' ? (
        size === 'small' ? <BodySmall style={{ color: 'inherit', fontWeight: 600 }}>{children}</BodySmall>
          : <Body style={{ color: 'inherit', fontWeight: 600 }}>{children}</Body>
      ) : children}
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

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes, so
  // `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = variant === 'light'
    ? (color === 'default' ? 'Default' : C)
    : variant === 'solid' ? C : undefined;
  const dataSurface = variant === 'light' ? 'Surface-Brightest'
    : variant === 'solid' ? 'Surface'
    : undefined;

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
        // Menu's floating panel — same frame role as Select's dropdown.
        borderRadius: 'var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)))',
        boxShadow: 'none',
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
          // Inner surface sits 1px inside the frame above, so it has to
          // track the SAME token or the two corners disagree.
          borderRadius: 'calc(var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px))) - 1px)',
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
  // Body ships standard and semibold only — there is no bold Body — so the
  // selected row steps to Subtitle, which IS Body at 700 (same face, size and
  // leading). That replaces an inline fontWeight override on a lib component.
  const TextComp = selected
    ? (size === 'small' ? SubtitleSmall : Subtitle)
    : (size === 'small' ? BodySmall : Body);

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
        display: 'flex', alignItems: 'center', gap: 'var(--Sizing-1)',
        padding: s.itemPy + ' ' + s.itemPx,
        // No fontSize here: TextComp below owns it. Setting both is how the
        // Accordion ended up rendering bare strings at a different size from
        // the same text passed through its slot.
        fontSize: s.fontSize,
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
      <TextComp color="standard" style={{ color: 'inherit' }}>{children}</TextComp>
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
