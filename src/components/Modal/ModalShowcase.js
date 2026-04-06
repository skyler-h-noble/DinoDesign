// src/components/Modal/ModalShowcase.js
import React, { useState } from 'react';
import { Box, Stack, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Switch } from '../Switch/Switch';
import { Tabs, TabList, Tab, TabPanel } from '../Tabs/Tabs';
import { PreviewSurface } from '../PreviewSurface';
import { BackgroundPicker } from '../BackgroundPicker';
import {
  H2, H5, Body, BodySmall, Caption, Label, OverlineSmall,
} from '../Typography';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const COLOR_GROUPS = [
  { label: 'Default', colors: ['default'] },
  { label: 'Theme', colors: ['primary', 'secondary', 'tertiary', 'neutral'] },
  { label: 'Semantic', colors: ['info', 'success', 'warning', 'error'] },
];

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

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Box
      component="button"
      onClick={() => onClick(color)}
      aria-label={'Select ' + C}
      aria-pressed={selected}
      title={C}
      sx={{
        width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
        backgroundColor: 'var(--Buttons-' + C + '-Button)',
        border: selected ? '2px solid var(--Text)' : '2px solid transparent',
        outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
        outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' },
      }}>
      {selected && (
        <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />
      )}
    </Box>
  );
}

/* ── Main Showcase ── */
export function ModalShowcase() {
  const [open, setOpen]               = useState(false);
  const [variant, setVariant]         = useState('default');
  const [color, setColor]             = useState('default');
  const [size, setSize]               = useState('medium');
  const [layout, setLayout]           = useState('center');
  const [transition, setTransition]   = useState('fade');
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true);
  const [showClose, setShowClose]     = useState(true);
  const [bgTheme, setBgTheme]         = useState(null);
  const [bgSurface, setBgSurface]     = useState('Surface');

  const generateCode = () => {
    const parts = ['open={open}', 'onClose={handleClose}'];
    if (variant !== 'default') parts.push('variant="' + variant + '"');
    if (color !== 'default') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (layout !== 'center') parts.push('layout="' + layout + '"');
    if (transition !== 'fade') parts.push('transition="' + transition + '"');
    if (!closeOnBackdrop) parts.push('closeOnBackdrop={false}');
    if (!showClose) parts.push('showCloseButton={false}');
    parts.push('title="Modal Title"');
    return '<Modal\n  ' + parts.join('\n  ') + '\n>\n  Modal content goes here.\n</Modal>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Modal</H2>

      <Grid container sx={{ mt: 2, alignItems: 'flex-start' }}>

        <Grid item sx={{ width: { xs: '100%', md: '55%' }, flexShrink: 0, pr: { md: 3 } }}>

          <PreviewSurface theme={bgTheme} surface={bgSurface}>
            <Button variant="default" onClick={() => setOpen(true)}>
              Open Modal
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

          <Modal
            open={open}
            onClose={() => setOpen(false)}
            variant={variant}
            color={color}
            size={size}
            layout={layout}
            transition={transition}
            closeOnBackdrop={closeOnBackdrop}
            showCloseButton={showClose}
            title="Modal Title"
          >
            <Body style={{ color: 'var(--Quiet)' }}>
              This is the modal content. You can put any information here that requires user attention.
            </Body>
            <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="default-outline" size="small" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="default" size="small" onClick={() => setOpen(false)}>Confirm</Button>
            </Box>
          </Modal>
        </Grid>

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

                  {/* Variant */}
                  <Box>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['default', 'soft', 'solid'].map((v) => (
                        <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Color */}
                  {variant !== 'default' && (
                    <Box sx={{ mt: 3 }}>
                      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                      <Stack spacing={1.5}>
                        {COLOR_GROUPS.map((group) => (
                          <Box key={group.label}>
                            <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{group.label}</Caption>
                            <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                              {group.colors.map((c) => (
                                <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                              ))}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Size */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['small', 'medium', 'large'].map((s) => (
                        <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Layout */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LAYOUT</OverlineSmall>
                    <Stack direction="row" spacing={1}>
                      {['center', 'fullscreen'].map((l) => (
                        <ControlButton key={l} label={cap(l)} selected={layout === l} onClick={() => setLayout(l)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Transition */}
                  <Box sx={{ mt: 3 }}>
                    <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>TRANSITION</OverlineSmall>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                      {['none', 'fade', 'slide-up', 'slide-down', 'zoom'].map((t) => (
                        <ControlButton key={t} label={cap(t)} selected={transition === t} onClick={() => setTransition(t)} />
                      ))}
                    </Stack>
                  </Box>

                  {/* Options */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Close on Backdrop</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Click backdrop to dismiss</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={closeOnBackdrop} onChange={(e) => setCloseOnBackdrop(e.target.checked)}
                      size="small" aria-label="Close on backdrop" />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Label>Close Button</Label>
                      <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Show X button in corner</Caption>
                    </Box>
                    <Switch variant="default-outline" checked={showClose} onChange={(e) => setShowClose(e.target.checked)}
                      size="small" aria-label="Show close button" />
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
                          { label: 'Role',      value: 'role="dialog" aria-modal="true"' },
                          { label: 'Label',     value: 'aria-label from title prop' },
                          { label: 'Focus',     value: 'Focus trapped. Returns to trigger on close.' },
                          { label: 'Keyboard',  value: 'Escape closes. Tab cycles focusable elements.' },
                          { label: 'Close',     value: 'aria-label="Close" on close button' },
                          { label: 'Body',      value: 'document.body overflow hidden while open' },
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

export default ModalShowcase;
