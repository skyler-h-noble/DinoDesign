// src/components/Menu/Menu.js
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five styles:
     1  Card / Accordion, Handle, Alert, Bottom-Sheet
     2  Card-Hover / App bars, Toolbars, Menus, Tooltip, Bottom-Sheet-Hover
     3  FAB, Snackbar
     4  FAB-Hover
     5  Dialog & Modal */
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '../Button/Button';
import { BodySmall, Body, BodyLarge } from '../Typography';
import { SHADOW_LEVEL_2 } from '../_shadows';

/**
 * Menu Component Suite
 *
 * VARIANTS (on Menu popup):
 *   outline   bg transparent, border var(--Buttons-{C}-Border)
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}"       data-surface="Surface-Brightest"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE:
 *   Outer shell — border var(--Buttons-{C}-Border), Effect-Level-3 shadow
 *   Inner content — data-theme + data-surface (for solid/light), bg var(--Background)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* Menu type, by component size: the row's label is Body at the size's step.
   Selection is the leading bar, not a weight change. */
const MENU_TEXT          = { small: BodySmall,     medium: Body,     large: BodyLarge };

const SIZE_MAP = {
  small:  { minWidth: '140px' },
  medium: { minWidth: '160px' },
  large:  { minWidth: '180px' },
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
/* The trigger IS a Button — Figma has no Menu Button, a menu opens from an
   ordinary outline Button with a chevron. It was a hand-drawn pill (its own
   padding, 600 weight, border) that matched nothing in the design file. */
export function MenuButton({ children, className = '', variant: buttonVariant, sx = {}, ...props }) {
  const { open, setOpen, anchorRef, menuId, buttonId, size, color } = useDropdown();
  return (
    <Button
      ref={anchorRef} id={buttonId}
      variant={buttonVariant || (color === 'default' ? 'default-outline' : color + '-outline')}
      size={size}
      aria-haspopup="true" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => setOpen((prev) => !prev)}
      onKeyDown={(e) => {
        // preventDefault stops the native click that would toggle it shut again.
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
      }}
      endDecorator={
        <ExpandMoreIcon sx={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'none' }} />
      }
      className={'menu-button ' + className}
      sx={sx}
      {...props}
    >
      {children}
    </Button>
  );
}

/* ─── Menu ─── */
export function Menu({ children, className = '', placement = 'bottom-start', sx = {}, ...props }) {
  const { open, setOpen, anchorRef, menuId, buttonId, variant, color, size } = useDropdown();
  const menuRef = useRef(null);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const C = cap(color === 'default' ? 'Default' : color);
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
        /* "Menus" sits in the Level 2 style, with App bars, Toolbars and
           Tooltip. The panel floats over the page and had no shadow at all,
           so it read as part of whatever it covered. */
        boxShadow: SHADOW_LEVEL_2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        ref={menuRef} id={menuId} role="menu" aria-labelledby={buttonId}
        data-theme={dataTheme} data-surface={dataSurface}
        sx={{
          minWidth: s.minWidth,
          backgroundColor: 'var(--Background)',
          color: 'var(--Text)',
          fontFamily: 'inherit',
          textAlign: 'left',
          // The TreeView panel's padding: a menu is a list of Menu Item rows.
          padding: 'var(--Sizing-1, 8px)',
          // A MenuDivider replaces the row's own line rather than doubling it.
          '& .menu-item:has(+ .menu-divider)': { boxShadow: 'none' },
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
/* The row is Figma's Menu Item (8007:25355) — the same row TreeView draws,
   which the parity page checks:
     height   Button-Height; padding Menu-Level-0-Left-Margin | Sizing-1
     label    Body in --Text, left-aligned, Sizing-Half either side
     divider  1px --Border-Variant under the row (MenuItem `divider={false}`)
     selected a 4px --Buttons-Default-Border bar on the leading edge
     hover / pressed   --Hover / --Pressed
     focus    a 3px ring 1px inside
     disabled 38%
   It drew centered Quiet labels with a bold Hover-filled selected row, which
   is in nothing in the design file. */
export function MenuItem({ children, onClick, selected = false, disabled = false, divider = true, startDecorator, className = '', sx = {}, ...props }) {
  const { setOpen, size } = useDropdown();
  const TextComp = MENU_TEXT[size] || MENU_TEXT.medium;

  const handleClick = () => {
    if (disabled) return;
    onClick?.(); setOpen(false);
  };

  return (
    <Box
      role="menuitem" tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined} aria-current={selected || undefined}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className={'menu-item' + (selected ? ' menu-item-selected' : '') + ' ' + className}
      sx={{
        display: 'flex', alignItems: 'center', gap: 'var(--Sizing-Half, 4px)',
        position: 'relative', boxSizing: 'border-box',
        minHeight: 'var(--' + ({ small: 'Sm-', large: 'Lg-' }[size] || '') + 'Button-Height, 32px)',
        padding: '0 var(--Sizing-1, 8px) 0 var(--Menu-Level-0-Left-Margin, 8px)',
        borderRadius: 'var(--Menu-Item-Radius, 0px)',
        color: 'var(--Text)',
        boxShadow: divider ? 'inset 0 -1px 0 var(--Border-Variant)' : 'none',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
        outline: 'none', transition: 'background-color 0.15s ease',
        userSelect: 'none',
        ...(selected && {
          '&::before': {
            content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
            backgroundColor: 'var(--Buttons-Default-Border)', pointerEvents: 'none',
          },
        }),
        ...(!disabled && {
          '&:hover': { backgroundColor: 'var(--Hover)' },
          '&:active': { backgroundColor: 'var(--Pressed)' },
        }),
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-4px' },
        ...sx,
      }}
      {...props}
    >
      {startDecorator && (
        <Box aria-hidden="true" sx={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: 24 } }}>
          {startDecorator}
        </Box>
      )}
      {/* Figma's Menu Slot: the label with Sizing-Half either side. */}
      <Box className="menu-item-slot" sx={{ flex: 1, minWidth: 0, display: 'flex', padding: '0 var(--Sizing-Half, 4px)' }}>
        <TextComp color="standard">{children}</TextComp>
      </Box>
    </Box>
  );
}

/* ─── MenuDivider ─── */
export function MenuDivider({ className = '', sx = {}, ...props }) {
  return (
    <Box component="hr" role="separator" className={'menu-divider ' + className}
      sx={{ border: 'none', borderTop: '1px solid var(--Border-Variant)', margin: 0, ...sx }} {...props} />
  );
}

export default Menu;
