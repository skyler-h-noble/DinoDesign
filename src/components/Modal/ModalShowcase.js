// src/components/Modal/ModalShowcase.js
import React, { useState } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Modal } from './Modal';
import {
  H2, H4, H5, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

/* --- Helpers --- */
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
function ControlButton({ label, selected, onClick, disabled }) {
  return (
    <Box component="button" onClick={onClick} disabled={disabled}
      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)', borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px',
        fontFamily: 'inherit', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: disabled ? 'transparent' : (selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)') },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' } }}>
      {label}
    </Box>
  );
}
function ColorSwatchButton({ color, selected, onClick }) {
  const C = COLOR_MAP[color] || 'Primary';
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 32, height: 32, borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 16, color: 'var(--Buttons-' + C + '-Text)' }} />}
      </Box>
    </Tooltip>
  );
}
function TextInput({ value, onChange, placeholder, label: inputLabel, sx: sxOverride }) {
  return (
    <Box>
      {inputLabel && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 4 }}>{inputLabel}</Caption>}
      <Box component="input" type="text" value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        sx={{
          width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
          border: '1px solid var(--Border)', borderRadius: '4px',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
          '&:focus': { borderColor: 'var(--Focus-Visible)' },
          ...sxOverride,
        }}
      />
    </Box>
  );
}

const SAMPLE_CONTENT = 'This is the modal body content. You can place any React elements here — forms, text, images, or other components. The modal handles scroll overflow, focus trapping, backdrop click, and Escape key automatically.';

export function ModalShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [variant, setVariant] = useState('default');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [layout, setLayout] = useState('center');
  const [transition, setTransition] = useState('fade');
  const [transitionSpeed, setTransitionSpeed] = useState(250);
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true);
  const [showCloseButton, setShowCloseButton] = useState(true);

  // Advanced
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Modal Title');

  const isDefault = variant === 'default';

  const generateCode = () => {
    const parts = ['open={isOpen}', 'onClose={() => setIsOpen(false)}'];
    if (modalTitle) parts.push('title="' + modalTitle + '"');
    if (variant !== 'default') parts.push('variant="' + variant + '"');
    if (!isDefault) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (layout !== 'center') parts.push('layout="' + layout + '"');
    if (transition !== 'fade') parts.push('transition="' + transition + '"');
    if (transitionSpeed !== 250) parts.push('transitionSpeed={' + transitionSpeed + '}');
    if (!closeOnBackdrop) parts.push('closeOnBackdrop={false}');
    if (!showCloseButton) parts.push('showCloseButton={false}');
    return '<Modal\n  ' + parts.join('\n  ') + '\n>\n  Content here\n</Modal>';
  };

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Modal</H2>
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

              <Box
                component="button" type="button"
                onClick={() => setModalOpen(true)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  px: 3, py: 1.5,
                  backgroundColor: 'var(--Buttons-Primary-Button)',
                  color: 'var(--Buttons-Primary-Text)',
                  border: '1px solid var(--Buttons-Primary-Border)',
                  borderRadius: 'var(--Style-Border-Radius)',
                  fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                Open Modal
              </Box>

              <Caption style={{ color: 'var(--Text-Quiet)' }}>
                {cap(variant)}{!isDefault ? ' · ' + cap(color) : ''} · {cap(size)} · {cap(layout)} · {cap(transition)} ({transitionSpeed}ms)
              </Caption>
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

            {/* Variant */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['default', 'soft', 'solid'].map((v) => (
                  <ControlButton key={v} label={cap(v)} selected={variant === v} onClick={() => setVariant(v)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {variant === 'default' ? 'No theme — bg: var(--Background).' :
                 variant === 'soft' ? 'Light theme — subtle colored background.' :
                 'Full theme — strong colored background.'}
              </Caption>
            </Box>

            {/* Color */}
            {!isDefault && (
              <Box sx={{ mt: 3 }}>
                <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                  {COLORS.map((c) => (
                    <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '400px max-width.' : size === 'medium' ? '560px max-width (default).' : '720px max-width.'}
              </Caption>
            </Box>

            {/* Layout */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>LAYOUT</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                <ControlButton label="Center" selected={layout === 'center'} onClick={() => setLayout('center')} />
                <ControlButton label="Full Screen" selected={layout === 'fullscreen'} onClick={() => setLayout('fullscreen')} />
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

            {/* Transition Speed */}
            {transition !== 'none' && (
              <Box sx={{ mt: 2 }}>
                <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 6 }}>Speed: {transitionSpeed}ms</Caption>
                <Box component="input" type="range" min={100} max={600} step={50}
                  value={transitionSpeed} onChange={(e) => setTransitionSpeed(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--Buttons-Primary-Button)' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>100ms</Caption>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>600ms</Caption>
                </Box>
              </Box>
            )}

            {/* Options */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>OPTIONS</OverlineSmall>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Close on Backdrop</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Click outside to close.</Caption>
                  </Box>
                  <Switch checked={closeOnBackdrop} onChange={(e) => setCloseOnBackdrop(e.target.checked)} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                  <Box>
                    <Label>Close Button</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>X button in header.</Caption>
                  </Box>
                  <Switch checked={showCloseButton} onChange={(e) => setShowCloseButton(e.target.checked)} size="small" />
                </Box>
              </Stack>
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <Box component="button" type="button" onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, width: '100%',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '14px', fontWeight: 600,
                  color: 'var(--Text)', p: 0, mb: advancedOpen ? 2 : 0,
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                }}
              >
                <Box component="span" sx={{ fontSize: '12px', transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</Box>
                Advanced Settings
              </Box>
              {advancedOpen && (
                <Stack spacing={2}>
                  <TextInput label="Title" value={modalTitle} onChange={setModalTitle} placeholder="Modal Title" />
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* The actual modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        variant={variant}
        color={color}
        size={size}
        layout={layout}
        transition={transition}
        transitionSpeed={transitionSpeed}
        closeOnBackdrop={closeOnBackdrop}
        showCloseButton={showCloseButton}
      >
        {SAMPLE_CONTENT}
      </Modal>

      {/* == ACCESSIBILITY == */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            {cap(variant)}{!isDefault ? ' · ' + cap(color) : ''} · {cap(size)} · {cap(layout)} · {cap(transition)}
          </BodySmall>

          <Stack spacing={4}>
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dialog:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'role="dialog" aria-modal="true" aria-label="[title]"'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus trap:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Modal receives focus on open. Previous focus restored on close.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Escape:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Escape key closes the modal.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Scroll lock:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Body scroll disabled while modal is open. Restored on close.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Close button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>aria-label="Close modal". Focus-visible ring on keyboard navigation.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Token Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>data-surface="Container-High" on all variants.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Default:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>No data-theme. bg: var(--Background), text: var(--Text).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Soft:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'data-theme="{Color}-Light". Light colored background.'}</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Solid:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>{'data-theme="{Color}". Full colored background.'}</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Backdrop:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>rgba(0,0,0,0.5) overlay. Click closes if closeOnBackdrop enabled.</Caption>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Transitions</H5>
              <Stack spacing={0}>
                {['none', 'fade', 'slide-up', 'slide-down', 'zoom'].map((t, i, arr) => (
                  <Box key={t} sx={{ py: 1.5, borderBottom: i < arr.length - 1 ? '1px solid var(--Border)' : 'none' }}>
                    <BodySmall>{cap(t)}:</BodySmall>
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>
                      {t === 'none' ? 'Instant — no animation.' :
                       t === 'fade' ? 'Opacity 0 → 1.' :
                       t === 'slide-up' ? 'Opacity + translateY(40px → 0).' :
                       t === 'slide-down' ? 'Opacity + translateY(-40px → 0).' :
                       'Opacity + scale(0.85 → 1).'}
                      {t !== 'none' && ' Speed adjustable 100–600ms.'}
                    </Caption>
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

export default ModalShowcase;
