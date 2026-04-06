// src/components/Dialog/DialogShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

/* ── Helpers ── */
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Copy failed:', err); }
  };
  return (
    <Button iconOnly variant="ghost" size="small" onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'} title={copied ? 'Copied!' : 'Copy code'}
      sx={{ color: copied ? '#4ade80' : '#9ca3af' }}>
      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
    </Button>
  );
}

function ControlButton({ label, selected, onClick }) {
  return (
    <Button variant={selected ? 'default' : 'default-outline'} size="small" onClick={onClick}>
      {label}
    </Button>
  );
}

/* ── Main Showcase ── */
export function DialogShowcase() {
  const [open, setOpen]             = useState(false);
  const [maxWidth, setMaxWidth]     = useState('sm');
  const [fullScreen, setFullScreen] = useState(false);
  const [transition, setTransition] = useState('none');
  const [alert, setAlert]           = useState(false);
  const [nonModal, setNonModal]     = useState(false);
  const [bgTheme, setBgTheme]       = useState(null);
  const [bgSurface, setBgSurface]   = useState('Surface');

  const handleClose = (event, reason) => {
    if (alert && reason === 'backdropClick') return;
    setOpen(false);
  };

  const generateCode = () => {
    const parts = ['open={open}', 'onClose={handleClose}'];
    if (maxWidth !== 'sm') parts.push('maxWidth="' + maxWidth + '"');
    if (fullScreen) parts.push('fullScreen');
    if (alert) parts.push('alert');
    if (nonModal) parts.push('nonModal');
    if (transition !== 'none') parts.push('transition="' + transition + '"');
    parts.push('title="Dialog Title"');
    parts.push('actions={<><Button variant="default-outline" onClick={handleClose}>Cancel</Button><Button variant="default" onClick={handleClose}>Confirm</Button></>}');
    return '<Dialog\n  ' + parts.join('\n  ') + '\n>\n  Dialog content goes here.\n</Dialog>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Dialog</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        {/* ── LEFT: Preview + Code ── */}
        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Button variant="default" onClick={() => setOpen(true)}>
              Open Dialog
            </Button>
          </PreviewSurface>

          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              px: 2, py: 1, borderBottom: '1px solid #333' }}>
              <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
              <CopyButton code={generateCode()} />
            </Box>
            <Box sx={{ p: 2, overflow: 'hidden' }}>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#e5e7eb',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%', display: 'block' }}>
                {generateCode()}
              </Box>
            </Box>
          </Box>

          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            fullScreen={fullScreen}
            alert={alert}
            nonModal={nonModal}
            transition={transition !== 'none' ? transition : undefined}
            title="Dialog Title"
            actions={
              <>
                <Button variant="default-outline" size="small" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="default" size="small" onClick={() => setOpen(false)}>Confirm</Button>
              </>
            }
          >
            <Body>This is the dialog content. You can put any information here that requires user attention or action.</Body>
          </Dialog>
        </Grid>

        {/* ── RIGHT: Tabs ── */}
        <Grid item sx={{ width: { xs: '100%', md: '45%' }, flexShrink: 0 }}>
          <Box sx={{ backgroundColor: 'var(--Background)', overflow: 'hidden' }}>
            <Tabs defaultValue={0} variant="standard" color="primary">
              <TabList>
                <Tab>Playground</Tab>
                <Tab>Accessibility</Tab>
              </TabList>

              <TabPanel value={0}>
                <Box sx={{ p: 3 }}>

                  <Box sx={{ mb: 3 }}>
                    <BackgroundPicker theme={bgTheme} onThemeChange={setBgTheme} surface={bgSurface} onSurfaceChange={setBgSurface} />
                  </Box>

                  {/* Size */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['xs', 'sm', 'md', 'lg', 'xl'].map((s) => (
                        <ControlButton key={s} label={s.toUpperCase()} selected={maxWidth === s} onClick={() => { setMaxWidth(s); setFullScreen(false); }} />
                      ))}
                      <ControlButton label="Full Screen" selected={fullScreen} onClick={() => setFullScreen(!fullScreen)} />
                    </Stack>
                  </Box>

                  {/* Transition */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TRANSITION</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['none', 'slide-up', 'slide-down', 'grow', 'fade', 'zoom'].map((t) => (
                        <ControlButton key={t} label={cap(t)} selected={transition === t} onClick={() => setTransition(t)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Alert</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>No backdrop dismiss, no Escape</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={alert} onChange={(e) => setAlert(e.target.checked)}
                      size="small" aria-label="Alert mode" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Non-Modal</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>No backdrop, interact with content behind</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={nonModal} onChange={(e) => setNonModal(e.target.checked)}
                      size="small" aria-label="Non-modal" />
                  </Box>
                </Box>
              </TabPanel>

              <TabPanel value={1}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box sx={{ p: 3, backgroundColor: 'var(--Background)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
                      <H5>ARIA and Semantics</H5>
                      <Stack spacing={0}>
                        {[
                          { label: 'Role',      value: 'role="dialog" (standard) or role="alertdialog" (alert mode)' },
                          { label: 'Label',     value: 'aria-labelledby links to title, aria-describedby links to content' },
                          { label: 'Focus',     value: 'Focus trapped inside dialog. Returns to trigger on close.' },
                          { label: 'Keyboard',  value: 'Escape closes (unless alert). Tab cycles through focusable elements.' },
                          { label: 'Backdrop',  value: 'Click closes (unless alert or non-modal)' },
                          { label: 'Close',     value: 'Close button with aria-label="Close dialog"' },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                            <BodySmall>{label}:</BodySmall>
                            <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{value}</Caption>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </TabPanel>
            </Tabs>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DialogShowcase;
