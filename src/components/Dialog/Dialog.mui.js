// src/components/Dialog/Dialog.mui.js
//
// The MUI version of Dialog, loaded on demand (see _lazyFallback.js): only a
// caller passing a prop that only MUI's Dialog understands (slots, slotProps,
// TransitionProps, keepMounted, disablePortal, container, …) ever downloads
// it. Dialog.js renders everything else without MUI. This is the
// implementation Dialog had before the conversion, unchanged apart from
// dropping the AlertDialog / FormDialog conveniences (they live in Dialog.js).
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal) */
import { SHADOW_LEVEL_5, SHADOW_SCRIM_LEVEL_5 } from '../_shadows';
import React, { forwardRef } from 'react';
import {
  Dialog as MuiDialog,
  Slide, Grow, Fade, Zoom,
} from '@mui/material';
import CloseIcon from '@omni-design/icons/Close';
import { Box } from '@mui/material';
import { useOmniDesign } from '../../OmniDesignProvider';
import { IconButton } from '../Button/Button';
import { Body, Subtitle } from '../Typography/Typography';
/* The lib's own icon button — <Button iconOnly> — not MUI's, so hover,
   pressed, focus-visible and disabled all come from Button rather than
   being re-derived at each call site. */

/**
 * Dialog Component
 *
 * SIZES: xs, sm, md, lg, xl, fullScreen
 *   xs: maxWidth 444px    sm: 600px    md: 900px
 *   lg: 1200px            xl: 1536px   fullScreen: 100vw×100vh
 *
 * MODES:
 *   standard  — close icon, Escape key, backdrop click
 *   alert     — no close icon, no Escape, must use action buttons (role="alertdialog")
 *   nonModal  — no backdrop, no focus trap
 *
 * TRANSITIONS: none, fade, grow, zoom, slide-up, slide-down, slide-left, slide-right
 *
 * SCROLL: 'body' (default) or 'paper' (content scrolls inside dialog)
 *
 * TOKENS:
 *   Paper:   bg var(--Container), border var(--Border), radius var(--Style-Border-Radius)
 *   Title:   color var(--Text), border-bottom var(--Border)
 *   Content: color var(--Text)
 *   Actions: border-top var(--Border)
 *   Primary btn:  bg var(--Buttons-Primary-Button), text var(--Buttons-Primary-Text)
 *   Outline btn:  border var(--Border), text var(--Text)
 *
 * Accessibility:
 *   aria-labelledby → DialogTitle id
 *   aria-describedby → DialogContent id
 *   role="dialog" (standard) or role="alertdialog" (alert)
 *   Focus trapped in modal mode, returned to trigger on close
 */

/* ─── Transition factories ─── */
const makeSlide = (dir) =>
  forwardRef(function SlideTransition(props, ref) {
    return <Slide direction={dir} ref={ref} {...props} />;
  });

const TRANSITION_MAP = {
  fade: forwardRef(function FadeT(props, ref) { return <Fade ref={ref} {...props} />; }),
  grow: forwardRef(function GrowT(props, ref) { return <Grow ref={ref} {...props} />; }),
  zoom: forwardRef(function ZoomT(props, ref) { return <Zoom ref={ref} {...props} />; }),
  'slide-up': makeSlide('up'),
  'slide-down': makeSlide('down'),
  'slide-left': makeSlide('left'),
  'slide-right': makeSlide('right'),
};

/* ─── Styled tokens ─── */
/* Figma's Dialog: Dialog-Width wide, Card-Radius corners, a 1px edge in the
   Background of its Container-Highest zone, the Level 5 shadow. The content
   inside is its own Container zone (see the render). */
const paperSx = {
  backgroundColor: 'var(--Background)',
  color: 'var(--Text)',
  border: '1px solid var(--Background)',
  borderRadius: 'var(--Card-Radius, var(--Style-Border-Radius))',
  boxShadow: SHADOW_LEVEL_5,
  overflow: 'hidden',
  // The 1px edge is INSIDE the width, as Figma's stroke is: 560 overall, not 562.
  boxSizing: 'border-box',
};

/* One padded slot: Card-Padding round, Sizing-Half between title and body. */
const contentSx = {
  display: 'flex', flexDirection: 'column',
  gap: 'var(--Sizing-Half, 4px)',
  padding: 'var(--Card-Padding, 30px)',
  '&[data-surface]': { backgroundColor: 'var(--Background)', color: 'var(--Text)' },
};

const DIALOG_WIDTH = 'var(--Dialog-Width, 560px)';

const btnBase = {
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '14px',
  borderRadius: 'var(--Style-Border-Radius)',
  padding: '6px 16px',
  cursor: 'pointer',
  border: 'none',
  transition: 'background-color 0.15s, color 0.15s',
  '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '1px' },
};

export const dialogButtonStyles = {
  primary: {
    ...btnBase,
    backgroundColor: 'var(--Buttons-Primary-Button)',
    color: 'var(--Buttons-Primary-Text)',
    border: '1px solid var(--Buttons-Primary-Border)',
    '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
    '&:active': { backgroundColor: 'var(--Buttons-Primary-Pressed)' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  },
  outline: {
    ...btnBase,
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: '1px solid var(--Border)',
    '&:hover': { backgroundColor: 'var(--Hover)' },
    '&:active': { backgroundColor: 'var(--Pressed)' },
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  },
};

/* ─── Dialog ─── */
export function Dialog({
  open = false,
  onClose,
  title,
  children,
  actions,
  /* 'dialog' (default) is Figma's Dialog-Width (560); xs / sm / md / lg / xl
     are MUI's wider breakpoints for code that needs them. */
  maxWidth = 'dialog',
  fullScreen = false,
  scroll = 'body',
  alert = false,
  nonModal = false,
  transition,
  transitionDuration = 300,
  titleId = 'dialog-title',
  contentId = 'dialog-description',
  className = '',
  sx = {},
  PaperProps = {},
  ...props
}) {
  const TransitionComponent = transition ? TRANSITION_MAP[transition] : undefined;

  // Get current theme context so the portal inherits the right tokens
  let omniCtx;
  try { omniCtx = useOmniDesign(); } catch { omniCtx = null; }
  const currentTheme = omniCtx?.theme || 'Default';
  const currentStyle = omniCtx?.style || 'Modern';

  const handleClose = (event, reason) => {
    if (alert && reason === 'backdropClick') return;
    if (alert && reason === 'escapeKeyDown') return;
    onClose?.(event, reason);
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={fullScreen || maxWidth === 'dialog' ? false : maxWidth}
      fullScreen={fullScreen}
      fullWidth={!fullScreen}
      scroll={scroll}
      hideBackdrop={nonModal}
      disableEnforceFocus={nonModal}
      disableEscapeKeyDown={alert}
      TransitionComponent={TransitionComponent}
      transitionDuration={transitionDuration}
      aria-labelledby={titleId}
      aria-describedby={contentId}
      className={'dialog dialog-' + maxWidth + (fullScreen ? ' dialog-fullscreen' : '') + (alert ? ' dialog-alert' : '') + (className ? ' ' + className : '')}
      style={{ zIndex: 10000000 }}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: nonModal ? 'transparent' : 'rgba(0,0,0,0.5)' },
        },
      }}
      PaperProps={{
        ...PaperProps,
        'data-theme': currentTheme,
        'data-style': currentStyle,
        'data-surface': 'Container-Highest',
        sx: {
          ...paperSx,
          // Neutral over the backdrop; a non-modal dialog sits on the page and keeps its tint.
          boxShadow: nonModal ? SHADOW_LEVEL_5 : SHADOW_SCRIM_LEVEL_5,
          ...(maxWidth === 'dialog' && !fullScreen && { maxWidth: DIALOG_WIDTH }),
          ...(fullScreen && { borderRadius: 0, border: 'none' }),
          ...PaperProps.sx,
        },
        role: alert ? 'alertdialog' : 'dialog',
      }}
      {...props}
    >
      {/* Dialog Content — the Container zone, one padded slot. */}
      <Box className="dialog-content" data-surface="Container" sx={{
        ...contentSx,
        ...(scroll === 'paper' && { maxHeight: fullScreen ? 'none' : '400px', overflowY: 'auto' }),
      }}>
        {title && (
          <Box className="dialog-title" sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--Sizing-1, 8px)' }}>
            {/* Figma: Dynamic Subtitle — bold body, in --Text. */}
            <Subtitle component="h2" id={titleId} sx={{ m: 0 }}>{title}</Subtitle>
            {!alert && onClose && (
              <IconButton aria-label="Close dialog" onClick={(e) => onClose(e, 'closeButton')} size="small" variant="ghost">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}
        <Box id={contentId} className="dialog-body">
          {typeof children === 'string' ? <Body>{children}</Body> : children}
        </Box>
        {actions && (
          <Box className="dialog-actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--Sizing-1, 8px)', mt: 'var(--Sizing-2, 16px)' }}>
            {actions}
          </Box>
        )}
      </Box>
    </MuiDialog>
  );
}

export default Dialog;
