// src/components/Dialog/DialogShowcase.js
import React, { useState, forwardRef } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
  Checkbox as MuiCheckbox, FormControlLabel,
  Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent,
  DialogContentText as MuiDialogContentText, DialogActions as MuiDialogActions,
  Slide, Grow, Fade, Zoom,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';
import { useDynoDesign } from '../../DynoDesignProvider';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ─── Helpers ─── */
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Copy failed:', err); }
  };
  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
      <MuiIconButton size="small" onClick={handleCopy}
        sx={{ color: copied ? '#4ade80' : '#9ca3af', '&:hover': { backgroundColor: '#333', color: '#e5e7eb' } }}>
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </MuiIconButton>
    </Tooltip>
  );
}
function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function TextInput({ value, onChange, placeholder, sx: sxOverride }) {
  return (
    <Box
      component="input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{
        flex: 1, padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
        border: '1px solid var(--Border)', borderRadius: '4px',
        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
        minWidth: 0,
        '&:focus': { borderColor: 'var(--Focus-Visible)' },
        ...sxOverride,
      }}
    />
  );
}
function NumberStepper({ value, onChange, min, max, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 90 }}>{label}</Caption>
      <button type="button" onClick={() => { if (value > min) onChange(value - 1); }} disabled={value <= min}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value <= min ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value <= min ? 0.4 : 1, fontFamily: 'inherit' }}>−</button>
      <Box sx={{ fontWeight: 700, fontSize: '14px', minWidth: 24, textAlign: 'center' }}>{value}</Box>
      <button type="button" onClick={() => { if (value < max) onChange(value + 1); }} disabled={value >= max}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--Border)', borderRadius: '4px', backgroundColor: 'var(--Background)',
          color: 'var(--Text)', cursor: value >= max ? 'not-allowed' : 'pointer', fontSize: '14px',
          opacity: value >= max ? 0.4 : 1, fontFamily: 'inherit' }}>+</button>
    </Box>
  );
}
function CheckboxControl({ label, checked, onChange, caption }) {
  return (
    <Box sx={{ py: 0.5 }}>
      <FormControlLabel
        control={
          <MuiCheckbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            size="small"
            sx={{ color: 'var(--Text-Quiet)', '&.Mui-checked': { color: 'var(--Buttons-Primary-Button)' } }}
          />
        }
        label={<Label>{label}</Label>}
        sx={{ m: 0 }}
      />
      {caption && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginLeft: 32 }}>{caption}</Caption>}
    </Box>
  );
}

/* ─── Transition builders ─── */
const makeSlideTransition = (dir) =>
  forwardRef(function SlideTransition(props, ref) {
    return <Slide direction={dir} ref={ref} {...props} />;
  });

const TRANSITIONS = {
  none: null,
  fade: forwardRef(function FadeTransition(props, ref) { return <Fade ref={ref} {...props} />; }),
  grow: forwardRef(function GrowTransition(props, ref) { return <Grow ref={ref} {...props} />; }),
  zoom: forwardRef(function ZoomTransition(props, ref) { return <Zoom ref={ref} {...props} />; }),
  'slide-up': makeSlideTransition('up'),
  'slide-down': makeSlideTransition('down'),
  'slide-left': makeSlideTransition('left'),
  'slide-right': makeSlideTransition('right'),
};

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'fullScreen'];
const SIZE_LABELS = { xs: 'XS', sm: 'SM', md: 'MD', lg: 'LG', xl: 'XL', fullScreen: 'Full Screen' };
const TRANSITION_OPTIONS = ['none', 'fade', 'grow', 'zoom', 'slide-up', 'slide-down', 'slide-left', 'slide-right'];

const SCROLL_CONTENT = `Curabitur aliquet quam id dui posuere blandit. Nulla quis lorem ut libero malesuada feugiat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec sollicitudin molestie malesuada.

Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.

Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Curabitur aliquet quam id dui posuere blandit. Pellentesque in ipsum id orci porta dapibus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vivamus suscipit tortor eget felis porttitor volutpat.

Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Nulla quis lorem ut libero malesuada feugiat. Donec sollicitudin molestie malesuada. Sed porttitor lectus nibh.

Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Pellentesque in ipsum id orci porta dapibus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla porttitor accumsan tincidunt. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.

Curabitur aliquet quam id dui posuere blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Sed porttitor lectus nibh. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.`;

/* ─── Themed Dialog Styles ─── */
const dialogPaperSx = {
  backgroundColor: 'var(--Container)',
  color: 'var(--Text)',
  border: '1px solid var(--Border)',
  borderRadius: 'var(--Style-Border-Radius)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};
const dialogTitleSx = {
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
const dialogContentSx = {
  color: 'var(--Text)',
  fontFamily: 'inherit',
  fontSize: '14px',
  lineHeight: 1.6,
  py: 3,
  px: 3,
};
const dialogActionsSx = {
  borderTop: '1px solid var(--Border)',
  px: 3,
  py: 1.5,
  gap: 1,
};
const btnBaseSx = {
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
const primaryBtnSx = {
  ...btnBaseSx,
  backgroundColor: 'var(--Buttons-Primary-Button)',
  color: 'var(--Buttons-Primary-Text)',
  border: '1px solid var(--Buttons-Primary-Border)',
  '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
};
const outlineBtnSx = {
  ...btnBaseSx,
  backgroundColor: 'transparent',
  color: 'var(--Text)',
  border: '1px solid var(--Border)',
  '&:hover': { backgroundColor: 'var(--Hover)' },
};

export function DialogShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const { theme: currentTheme, style: currentStyle, surface: currentSurface } = useDynoDesign();

  // Dialog state
  const [open, setOpen] = useState(false);

  // Settings
  const [maxWidth, setMaxWidth] = useState('sm');
  const [nonModal, setNonModal] = useState(false);
  const [transition, setTransition] = useState('none');
  const [transitionSpeed, setTransitionSpeed] = useState(300);
  const [isAlert, setIsAlert] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  // Dialog content
  const [dialogTitle, setDialogTitle] = useState('Dialog Title');
  const [dialogBody, setDialogBody] = useState('This is the dialog content. You can put any information here that requires user attention or action.');

  // Button actions
  const [button1Text, setButton1Text] = useState('Cancel');
  const [button2Text, setButton2Text] = useState('Confirm');
  const [showButton2, setShowButton2] = useState(true);

  const isFullScreen = maxWidth === 'fullScreen';
  const TransitionComponent = TRANSITIONS[transition] || undefined;

  const handleClose = (event, reason) => {
    if (nonModal || reason !== 'backdropClick') {
      setOpen(false);
    }
    // Non-modal: always closeable; Modal: close on escape/button but not backdrop if alert
    if (!isAlert) setOpen(false);
    if (isAlert && reason !== 'backdropClick') setOpen(false);
  };

  const generateCode = () => {
    const lines = [];
    lines.push('<Dialog');
    lines.push('  open={open}');
    lines.push('  onClose={handleClose}');
    if (!isFullScreen) lines.push('  maxWidth="' + maxWidth + '"');
    if (isFullScreen) lines.push('  fullScreen');
    if (!isFullScreen) lines.push('  fullWidth');
    if (scrollable) lines.push('  scroll="paper"');
    if (nonModal) lines.push('  hideBackdrop');
    if (nonModal) lines.push('  disableEnforceFocus');
    if (isAlert) lines.push('  disableEscapeKeyDown');
    if (transition !== 'none') lines.push('  TransitionComponent={' + cap(transition.replace('-', '')) + 'Transition}');
    if (transitionSpeed !== 300) lines.push('  transitionDuration={' + transitionSpeed + '}');
    lines.push('>');
    lines.push('  <DialogTitle>' + dialogTitle + '</DialogTitle>');
    lines.push('  <DialogContent' + (scrollable ? ' dividers' : '') + '>');
    if (isAlert) {
      lines.push('    <DialogContentText>' + dialogBody + '</DialogContentText>');
    } else {
      lines.push('    ' + dialogBody);
    }
    lines.push('  </DialogContent>');
    lines.push('  <DialogActions>');
    lines.push('    <Button onClick={handleClose}>' + button1Text + '</Button>');
    if (showButton2) lines.push('    <Button variant="contained" onClick={handleClose}>' + button2Text + '</Button>');
    lines.push('  </DialogActions>');
    lines.push('</Dialog>');
    return lines.join('\n');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Dialog</H2>
      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ mt: 3, mb: 0, borderBottom: '1px solid var(--Border)',
          '& .MuiTabs-indicator': { backgroundColor: 'var(--Buttons-Primary-Button)', height: 3 },
          '& .MuiTab-root': { color: 'var(--Text-Quiet)', textTransform: 'none', fontWeight: 500, '&.Mui-selected': { color: 'var(--Text)' } } }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* Preview */}
          <Grid item sx={{ width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0 }}>
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', gap: 3 }}>

              {/* Open button */}
              <Box component="button" type="button" onClick={() => setOpen(true)}
                sx={{
                  ...primaryBtnSx,
                  padding: '10px 28px',
                  fontSize: '15px',
                }}>
                Open Dialog
              </Box>

              <Caption style={{ color: 'var(--Text-Quiet)', textAlign: 'center' }}>
                {isFullScreen ? 'Full Screen' : maxWidth.toUpperCase()} · {isAlert ? 'Alert' : 'Standard'}
                {nonModal ? ' · Non-Modal' : ''}{scrollable ? ' · Scrollable' : ''}
                {transition !== 'none' ? ' · ' + cap(transition.replace('-', ' ')) : ''}
              </Caption>

              {/* The actual Dialog */}
              <MuiDialog
                open={open}
                onClose={handleClose}
                maxWidth={isFullScreen ? false : maxWidth}
                fullScreen={isFullScreen}
                fullWidth={!isFullScreen}
                scroll={scrollable ? 'paper' : 'body'}
                hideBackdrop={nonModal}
                disableEnforceFocus={nonModal}
                disableEscapeKeyDown={isAlert}
                TransitionComponent={TransitionComponent}
                transitionDuration={transitionSpeed}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                style={{ zIndex: 10000000 }}
                slotProps={{
                  backdrop: {
                    sx: {
                      backgroundColor: nonModal ? 'transparent' : 'rgba(0,0,0,0.5)',
                    },
                  },
                }}
                PaperProps={{
                  'data-theme': currentTheme,
                  'data-style': currentStyle,
                  'data-surface': currentSurface,
                  sx: {
                    ...dialogPaperSx,
                    ...(isFullScreen && { borderRadius: 0, border: 'none' }),
                  },
                }}
              >
                {/* Title */}
                <MuiDialogTitle id="dialog-title" sx={dialogTitleSx}>
                  {dialogTitle}
                  {!isAlert && (
                    <MuiIconButton
                      aria-label="Close dialog"
                      onClick={() => setOpen(false)}
                      size="small"
                      sx={{ color: 'var(--Text-Quiet)', '&:hover': { backgroundColor: 'var(--Hover)' } }}
                    >
                      <CloseIcon fontSize="small" />
                    </MuiIconButton>
                  )}
                </MuiDialogTitle>

                {/* Content */}
                <MuiDialogContent dividers={scrollable} sx={{
                  ...dialogContentSx,
                  ...(scrollable && {
                    maxHeight: isFullScreen ? 'none' : '300px',
                    overflowY: 'auto',
                    borderColor: 'var(--Border)',
                  }),
                }}>
                  {isAlert ? (
                    <MuiDialogContentText id="dialog-description" sx={{ color: 'var(--Text)', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.6 }}>
                      {scrollable ? SCROLL_CONTENT : dialogBody}
                    </MuiDialogContentText>
                  ) : (
                    <Box id="dialog-description" sx={{ color: 'var(--Text)', fontFamily: 'inherit', fontSize: '14px', lineHeight: 1.6 }}>
                      {scrollable ? SCROLL_CONTENT.split('\n\n').map((p, i) => (
                        <Box key={i} sx={{ mb: 2 }}>{p}</Box>
                      )) : dialogBody}
                    </Box>
                  )}
                </MuiDialogContent>

                {/* Actions */}
                <MuiDialogActions sx={dialogActionsSx}>
                  <Box component="button" type="button"
                    onClick={() => setOpen(false)}
                    sx={outlineBtnSx}>
                    {button1Text}
                  </Box>
                  {showButton2 && (
                    <Box component="button" type="button"
                      onClick={() => setOpen(false)}
                      sx={primaryBtnSx}>
                      {button2Text}
                    </Box>
                  )}
                </MuiDialogActions>
              </MuiDialog>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 220 }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {SIZES.map((s) => (
                  <ControlButton key={s} label={SIZE_LABELS[s]} selected={maxWidth === s} onClick={() => setMaxWidth(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isFullScreen
                  ? 'Full screen — covers the entire viewport.'
                  : 'maxWidth="' + maxWidth + '" — dialog expands up to ' + maxWidth + ' breakpoint.'}
              </Caption>
            </Box>

            {/* Content */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>CONTENT</OverlineSmall>
              <Stack spacing={1.5}>
                <Box>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Title</Caption>
                  <TextInput value={dialogTitle} onChange={setDialogTitle} placeholder="Dialog Title" sx={{ width: '100%' }} />
                </Box>
                <Box>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Body</Caption>
                  <Box
                    component="textarea"
                    value={dialogBody}
                    onChange={(e) => setDialogBody(e.target.value)}
                    rows={3}
                    sx={{
                      width: '100%', padding: '6px 8px', fontSize: '13px', fontFamily: 'inherit',
                      border: '1px solid var(--Border)', borderRadius: '4px',
                      backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                      resize: 'vertical', '&:focus': { borderColor: 'var(--Focus-Visible)' },
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0}>
                <CheckboxControl
                  label="Non-Modal"
                  checked={nonModal}
                  onChange={setNonModal}
                  caption="No backdrop — user can interact with content behind."
                />
                <CheckboxControl
                  label="Alert Dialog"
                  checked={isAlert}
                  onChange={setIsAlert}
                  caption="No close button or Escape — must use action buttons. Uses role='alertdialog'."
                />
                <CheckboxControl
                  label="Scrollable Content"
                  checked={scrollable}
                  onChange={setScrollable}
                  caption="Long content with scroll inside the dialog paper."
                />
              </Stack>
            </Box>

            {/* Transition */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TRANSITION</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {TRANSITION_OPTIONS.map((t) => (
                  <ControlButton key={t} label={cap(t.replace('-', ' '))} selected={transition === t} onClick={() => setTransition(t)} />
                ))}
              </Stack>
              {transition !== 'none' && (
                <Box sx={{ mt: 1.5 }}>
                  <NumberStepper label="Speed (ms)" value={transitionSpeed} onChange={setTransitionSpeed} min={50} max={1000} />
                </Box>
              )}
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {transition === 'none' ? 'No transition animation.' : cap(transition.replace('-', ' ')) + ' at ' + transitionSpeed + 'ms.'}
              </Caption>
            </Box>

            {/* Actions */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>BUTTON ACTIONS</OverlineSmall>
              <Stack spacing={1.5}>
                <Box>
                  <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Button 1 (outline)</Caption>
                  <TextInput value={button1Text} onChange={setButton1Text} placeholder="Cancel" sx={{ width: '100%' }} />
                </Box>
                <CheckboxControl
                  label="Show Button 2"
                  checked={showButton2}
                  onChange={setShowButton2}
                  caption="Second action button (primary style)."
                />
                {showButton2 && (
                  <Box>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>Button 2 (primary)</Caption>
                    <TextInput value={button2Text} onChange={setButton2Text} placeholder="Confirm" sx={{ width: '100%' }} />
                  </Box>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current settings: {isFullScreen ? 'Full Screen' : maxWidth.toUpperCase()}
            {isAlert ? ' · Alert' : ''}{nonModal ? ' · Non-Modal' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* ARIA */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dialog role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {isAlert
                      ? 'role="alertdialog" — announces as an alert requiring immediate attention.'
                      : 'role="dialog" — standard dialog role. Focus trapped inside when modal.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Labelling:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-labelledby="dialog-title" — links to the DialogTitle for screen reader announcement.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Description:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-describedby="dialog-description" — links to the content for extended context.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus management:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {nonModal
                      ? 'Non-modal: focus is not trapped. User can Tab outside the dialog.'
                      : 'Modal: focus is trapped inside the dialog. Tab cycles through focusable elements. Focus returns to trigger on close.'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dismiss:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {isAlert
                      ? 'Alert: Escape key disabled. Must use action buttons to dismiss. No close icon.'
                      : 'Standard: Escape key closes. Close icon in title bar. Backdrop click closes (modal).'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Close button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {isAlert
                      ? 'No close button — alert dialogs require explicit user action.'
                      : 'aria-label="Close dialog" — accessible close button in title bar.'}
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Best Practices */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Best Practices</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Use sparingly:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Dialogs are interruptive. Use for critical information, confirmations, or decisions only.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Alert dialogs:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Reserve for destructive actions (delete, discard) or critical confirmations. Always provide clear action labels.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Non-modal:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Use when the dialog supplements the main content without blocking it (e.g., settings panel, search).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Scrollable:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Use scroll="paper" for long content. Dividers help separate fixed title/actions from scrolling body.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Transitions:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Use prefers-reduced-motion media query to disable or shorten animations for users who request it.
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                {[
                  { s: 'xs', desc: 'maxWidth: 444px — compact confirmations, simple alerts.' },
                  { s: 'sm', desc: 'maxWidth: 600px — standard dialogs, forms.' },
                  { s: 'md', desc: 'maxWidth: 900px — content-heavy dialogs, tables.' },
                  { s: 'lg', desc: 'maxWidth: 1200px — large forms, complex layouts.' },
                  { s: 'xl', desc: 'maxWidth: 1536px — near full-width content.' },
                  { s: 'fullScreen', desc: 'Covers entire viewport — mobile-first, immersive tasks.' },
                ].map(({ s, desc }, i, arr) => (
                  <Box key={s} sx={{ py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                    <BodySmall>{SIZE_LABELS[s]}</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>{desc}</Caption>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default DialogShowcase;
