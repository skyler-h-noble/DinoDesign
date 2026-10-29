// src/components/Menu/Menu.js
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useId } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import ExpandMoreIcon from '@omni-design/icons/ExpandMore';
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

const SxBox = lazySxBox('Menu');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const FRAME_RADIUS = 'var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)))';

/* ─── Static sheet ───
   State rules weigh one class + one pseudo-class, as emotion's did, so a
   caller's sx state rule still wins. */
registerStaticStyles('omni-menu', [
  '.omni-dd{display:inline-flex;position:relative}',
  /* "Menus" sits in the Level 2 style, with App bars, Toolbars and Tooltip.
     Edges are the neutral --Border: the color marks the SELECTION, not the
     frame, so field and panel read as one control at the 3:1 an edge needs. */
  '.omni-menu{position:absolute;top:100%;left:0;right:auto;z-index:99999;margin-top:4px;border:1px solid var(--Border);'
    + `border-radius:${FRAME_RADIUS};box-shadow:${SHADOW_LEVEL_2};overflow:hidden}`,
  '.omni-menu-end{left:auto;right:0}',
  /* The TreeView panel's padding: a menu is a list of Menu Item rows. Its
     corner sits 1px inside the frame, so it tracks the SAME token. */
  '.omni-menu-list{background-color:var(--Background);color:var(--Text);font-family:inherit;text-align:left;'
    + `padding:var(--Sizing-1, 8px);outline:none;border-radius:calc(${FRAME_RADIUS} - 1px)}`,
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-menu-list-${k}{min-width:${v.minWidth}}`),
  // A MenuDivider replaces the row's own line rather than doubling it.
  '.omni-menu-list .menu-item:has(+ .menu-divider){box-shadow:none}',
  '.omni-mi{display:flex;-webkit-box-align:center;align-items:center;gap:var(--Sizing-Half, 4px);position:relative;box-sizing:border-box;'
    + 'padding:0 var(--Sizing-1, 8px) 0 var(--Menu-Level-0-Left-Margin, 8px);border-radius:var(--Menu-Item-Radius, 0px);'
    + 'color:var(--Text);box-shadow:none;background-color:transparent;cursor:pointer;opacity:1;outline:none;'
    + 'transition:background-color 0.15s ease;user-select:none}',
  '.omni-mi-small{min-height:var(--Sm-Button-Height, 32px)}',
  '.omni-mi-medium{min-height:var(--Button-Height, 32px)}',
  '.omni-mi-large{min-height:var(--Lg-Button-Height, 32px)}',
  '.omni-mi-rule{box-shadow:inset 0 -1px 0 var(--Border-Variant)}',
  '.omni-mi-off{cursor:not-allowed;opacity:var(--Disabled, 0.38)}',
  '.omni-mi-sel.omni-mi-mark::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background-color:var(--Buttons-Default-Border);pointer-events:none}',
  '.omni-mi-h:hover{background-color:var(--Hover)}',
  '.omni-mi-a:active{background-color:var(--Pressed)}',
  '.omni-mi-f:focus-visible{outline:3px solid var(--Focus-Visible);outline-offset:-4px}',
  '.omni-mi-deco{width:24px;height:24px;flex-shrink:0;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center}',
  '.omni-mi-deco .MuiSvgIcon-root{font-size:24px}',
  '.omni-mi-slot{flex:1;min-width:0;display:flex;padding:0 var(--Sizing-Half, 4px)}',
  '.omni-menu-hr{border:none;border-top:1px solid var(--Border-Variant);margin:0}',
].join('\n'));

/** A part's root: plain element, or an MUI box only when given sx. */
const Part = React.forwardRef(function Part({ sx, component: Tag = 'div', ...props }, ref) {
  if (hasSx(sx)) return <SxBox component={Tag} sx={sx} ref={ref} {...props} />;
  return <Tag ref={ref} {...props} />;
});

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
  open: controlledOpen, onOpenChange, className, ...props
}) {
  useStaticStyles('omni-menu');
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
      {/* A caller's sx REPLACED this root's own styles (it was spread after
          them), so with one the static class stays off, as before. */}
      <Part className={(hasSx(props.sx) ? '' : 'omni-dd') + (className ? ' ' + className : '')} {...props}>
        {children}
      </Part>
    </DropdownContext.Provider>
  );
}

/* ─── MenuButton ─── */
/* The trigger IS a Button — Figma has no Menu Button, a menu opens from an
   ordinary outline Button with a chevron. It was a hand-drawn pill (its own
   padding, 600 weight, border) that matched nothing in the design file. */
export function MenuButton({ children, className = '', variant: buttonVariant, sx, ...props }) {
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
export function Menu({ children, className = '', placement = 'bottom-start', sx, ...props }) {
  useStaticStyles('omni-menu');
  const { open, setOpen, anchorRef, menuId, buttonId, variant, color, size } = useDropdown();
  const menuRef = useRef(null);
  const sizeKey = SIZE_MAP[size] ? size : 'medium';

  const C = cap(color === 'default' ? 'Default' : color);

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
    <Part
      className={'menu menu-' + variant + ' omni-menu' + (placement === 'bottom-end' ? ' omni-menu-end' : '') + ' ' + className}
      sx={sx}
    >
      <div
        ref={menuRef} id={menuId} role="menu" aria-labelledby={buttonId}
        data-theme={dataTheme} data-surface={dataSurface}
        className={'omni-menu-list omni-menu-list-' + sizeKey}
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
      </div>
    </Part>
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
export function MenuItem({ children, onClick, selected = false, disabled = false, divider = true, startDecorator, className = '', sx, ...props }) {
  useStaticStyles('omni-menu');
  const { setOpen, size } = useDropdown();
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const own = (key) => hasSx(sx) && typeof sx === 'object' && !Array.isArray(sx) && sx[key] !== undefined;
  const TextComp = MENU_TEXT[size] || MENU_TEXT.medium;

  const handleClick = () => {
    if (disabled) return;
    onClick?.(); setOpen(false);
  };

  return (
    <Part
      role="menuitem" tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined} aria-current={selected || undefined}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className={'menu-item' + (selected ? ' menu-item-selected' : '')
        + ' omni-mi omni-mi-' + sizeKey + (divider ? ' omni-mi-rule' : '') + (disabled ? ' omni-mi-off' : '')
        /* A caller's sx state key REPLACED the row's own (one sx object), so
           with one the matching static rule stays off. */
        + (!disabled && !own('&:hover') ? ' omni-mi-h' : '') + (!disabled && !own('&:active') ? ' omni-mi-a' : '')
        + (!own('&:focus-visible') ? ' omni-mi-f' : '')
        + (selected ? ' omni-mi-sel' + (!own('&::before') ? ' omni-mi-mark' : '') : '') + ' ' + className}
      sx={sx}
      {...props}
    >
      {startDecorator && (
        <div aria-hidden="true" className="omni-mi-deco">
          {startDecorator}
        </div>
      )}
      {/* Figma's Menu Slot: the label with Sizing-Half either side. */}
      <div className="menu-item-slot omni-mi-slot">
        <TextComp color="standard">{children}</TextComp>
      </div>
    </Part>
  );
}

/* ─── MenuDivider ─── */
export function MenuDivider({ className = '', sx, ...props }) {
  useStaticStyles('omni-menu');
  return (
    <Part component="hr" role="separator" className={'menu-divider omni-menu-hr ' + className} sx={sx} {...props} />
  );
}

export default Menu;
