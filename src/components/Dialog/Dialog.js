// src/components/Dialog/Dialog.js
import React, { forwardRef } from 'react';
import {
  Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText, DialogActions as MuiDialogActions,
  Slide, Grow, Fade, Zoom, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';

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
const paperSx = {
  backgroundColor: 'var(--Container)',
  color: 'var(--Text)',
  border: '1px solid var(--Border)',
  borderRadius: 'var(--Style-Border-Radius)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};

const titleSx = {
  color: 'var(--Text)',
  fontWeight: 600,
  fontSize: '18px',
  fontFamily: 'inherit',
  borderBottom: '1px solid var(--Border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 1.5,
  px: 3,
};

const contentSx = {
  color: 'var(--Text)',
  fontFamily: 'inherit',
  fontSize: '14px',
  lineHeight: 1.6,
  py: 3,
  px: 3,
};

const actionsSx = {
  borderTop: '1px solid var(--Border)',
  px: 3,
  py: 1.5,
  gap: 1,
};

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
  },
  outline: {
    ...btnBase,
    backgroundColor: 'transparent',
    color: 'var(--Text)',
    border: '1px solid var(--Border)',
    '&:hover': { backgroundColor: 'var(--Hover)' },
  },
};

/* ─── Dialog ─── */
export function Dialog({
  open = false,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
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

  const handleClose = (event, reason) => {
    if (alert && reason === 'backdropClick') return;
    if (alert && reason === 'escapeKeyDown') return;
    onClose?.(event, reason);
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={fullScreen ? false : maxWidth}
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
      slotProps={{
        backdrop: {
          sx: { backgroundColor: nonModal ? 'transparent' : 'rgba(0,0,0,0.5)' },
        },
      }}
      PaperProps={{
        ...PaperProps,
        sx: {
          ...paperSx,
          ...(fullScreen && { borderRadius: 0, border: 'none' }),
          ...PaperProps.sx,
        },
        role: alert ? 'alertdialog' : 'dialog',
      }}
      {...props}
    >
      {/* Title */}
      {title && (
        <MuiDialogTitle id={titleId} sx={titleSx}>
          {title}
          {!alert && onClose && (
            <IconButton
              aria-label="Close dialog"
              onClick={(e) => onClose(e, 'closeButton')}
              size="small"
              sx={{ color: 'var(--Text-Quiet)', '&:hover': { backgroundColor: 'var(--Hover)' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </MuiDialogTitle>
      )}

      {/* Content */}
      <MuiDialogContent
        dividers={scroll === 'paper'}
        sx={{
          ...contentSx,
          ...(scroll === 'paper' && {
            maxHeight: fullScreen ? 'none' : '400px',
            overflowY: 'auto',
            borderColor: 'var(--Border)',
          }),
        }}
      >
        {alert ? (
          <MuiDialogContentText id={contentId} sx={{ color: 'var(--Text)', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.6 }}>
            {children}
          </MuiDialogContentText>
        ) : (
          <Box id={contentId}>{children}</Box>
        )}
      </MuiDialogContent>

      {/* Actions */}
      {actions && (
        <MuiDialogActions sx={actionsSx}>
          {actions}
        </MuiDialogActions>
      )}
    </MuiDialog>
  );
}

/* ─── Convenience: AlertDialog ─── */
export function AlertDialog({
  open, onClose, title, children, confirmText = 'Confirm', cancelText = 'Cancel',
  onConfirm, onCancel, ...rest
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} alert {...rest}
      actions={
        <>
          <Box component="button" type="button" onClick={onCancel || onClose} sx={dialogButtonStyles.outline}>{cancelText}</Box>
          <Box component="button" type="button" onClick={onConfirm || onClose} sx={dialogButtonStyles.primary}>{confirmText}</Box>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

/* ─── Convenience: FormDialog ─── */
export function FormDialog({
  open, onClose, title, children, submitText = 'Submit', cancelText = 'Cancel',
  onSubmit, ...rest
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} {...rest}
      actions={
        <>
          <Box component="button" type="button" onClick={onClose} sx={dialogButtonStyles.outline}>{cancelText}</Box>
          <Box component="button" type="button" onClick={onSubmit} sx={dialogButtonStyles.primary}>{submitText}</Box>
        </>
      }
    >
      {children}
    </Dialog>
  );
}

export default Dialog;
