// src/components/Sheet/Sheet.js
import React from 'react';
import { Drawer } from '../Drawer/Drawer';
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * Sheet — a bottom sheet. Figma's Sheet (8326:2842): a panel that rises from
 * the bottom of the screen, centred, no wider than 640px.
 *
 *   surface   Container (Figma pins the Surface mode)
 *   corners   16px on the top two — the bottom edge sits on the screen's
 *   padding   Sizing-2 (16), and the same gap between children
 *   height    var(--Sheet, 540px) — Figma's Component-Size/Other/Sheet
 *   shadow    Level 1, the Elevations/Level-1 style
 *
 * Built on Drawer (anchor="bottom"): the scrim, Escape, the focus trap and
 * the slide come from there, so a sheet is a dialog like a drawer is.
 *
 * It used to be a plain surface panel — the same job as Box with `surface`,
 * under a name the design gives to something else. For that, use
 * <Box surface="…">. The old props (`elevated`, `color`, `variant`) are
 * gone; `surface` stays.
 */
export function Sheet({
  open = false,
  onClose,
  children,
  surface = 'Container',
  hideBackdrop = false,
  className = '',
  sx = {},
  ...props
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="bottom"
      surface={surface}
      hideBackdrop={hideBackdrop}
      className={'sheet ' + className}
      sx={{
        left: 0,
        right: 0,
        marginInline: 'auto',
        width: 'min(640px, 100%)',
        height: 'var(--Sheet, 540px)',
        maxHeight: '100%',
        boxSizing: 'border-box',
        borderTop: 'none',
        borderRadius: '16px 16px 0 0',
        padding: 'var(--Sizing-2, 16px)',
        gap: 'var(--Sizing-2, 16px)',
        boxShadow: SHADOW_LEVEL_1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
}

export default Sheet;
