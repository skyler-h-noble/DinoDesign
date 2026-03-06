// src/components/Snackbar/SnackbarShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Snackbar } from './Snackbar';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const SOLID_THEME_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info-Medium', success: 'Success-Medium', warning: 'Warning-Medium', error: 'Error-Medium',
};
const LIGHT_THEME_MAP = {
  primary: 'Primary-Light', secondary: 'Secondary-Light', tertiary: 'Tertiary-Light', neutral: 'Neutral-Light',
  info: 'Info-Light', success: 'Success-Light', warning: 'Warning-Light', error: 'Error-Light',
};
const DECORATOR_MAP = {
  info: <InfoOutlinedIcon sx={{ fontSize: 'inherit' }} />,
  success: <CheckCircleOutlineIcon sx={{ fontSize: 'inherit' }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 'inherit' }} />,
  error: <ErrorOutlineIcon sx={{ fontSize: 'inherit' }} />,
};

function getLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function getContrast(hex1, hex2) {
  if (!hex1 || !hex2 || !hex1.startsWith('#') || !hex2.startsWith('#')) return null;
  const l1 = getLuminance(hex1); const l2 = getLuminance(hex2);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
}
function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700 }}>{ratio}:1</Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}
function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}
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
function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box onClick={() => onClick(color)} role="button" aria-label={'Select ' + C} aria-pressed={selected}
        sx={{ width: 'var(--Button-Height)', height: 'var(--Button-Height)', borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          outlineOffset: '1px', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.1s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
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

export function SnackbarShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('standard');
  const [color, setColor] = useState('info');
  const [size, setSize] = useState('medium');
  const [anchor, setAnchor] = useState('bottom');
  const [snackOpen, setSnackOpen] = useState(false);
  const [message, setMessage] = useState('Changes have been saved successfully.');
  const [autoHide, setAutoHide] = useState(true);
  const [autoHideDuration, setAutoHideDuration] = useState(5000);
  const [showStartDeco, setShowStartDeco] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const isStandard = variant === 'standard';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const handleClose = (e, reason) => {
    setSnackOpen(false);
  };

  const generateCode = () => {
    const parts = [];
    parts.push('open={open}');
    parts.push('onClose={handleClose}');
    if (variant !== 'standard') parts.push('variant="' + variant + '"');
    if (!isStandard) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (anchor !== 'bottom') parts.push('anchor="' + anchor + '"');
    if (autoHide) parts.push('autoHideDuration={' + autoHideDuration + '}');
    if (showStartDeco) parts.push('startDecorator={<Icon />}');
    return '<Snackbar\n  ' + parts.join('\n  ') + '\n>\n  ' + message + '\n</Snackbar>';
  };

  useEffect(() => {
    const data = {};
    data.text = getCssVar('--Text');
    data.textQuiet = getCssVar('--Text-Quiet');
    data.background = getCssVar('--Background');
    data.border = getCssVar('--Border');
    data.focusVisible = getCssVar('--Focus-Visible');
    setContrastData(data);
  }, [variant, color]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Snackbar</H2>
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
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)', position: 'relative' }}>

              {/* Inline preview (not fixed) */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {anchor === 'top' && (
                  <Box
                    data-theme={variant === 'solid' ? (SOLID_THEME_MAP[color] || undefined) : variant === 'light' ? (LIGHT_THEME_MAP[color] || undefined) : undefined}
                    data-surface="Container-High"
                    className={'snackbar-preview snackbar-' + variant + ' snackbar-' + size + ' snackbar-' + anchor}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: size === 'small' ? '8px' : size === 'large' ? '16px' : '12px',
                      minWidth: size === 'small' ? '240px' : size === 'large' ? '360px' : '300px',
                      maxWidth: '100%',
                      padding: size === 'small' ? '8px 12px' : size === 'large' ? '14px 20px' : '10px 16px',
                      fontSize: size === 'small' ? '13px' : size === 'large' ? '16px' : '14px',
                      fontWeight: 500, color: 'var(--Text)', backgroundColor: 'var(--Background)',
                      border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    {showStartDeco && DECORATOR_MAP[color] && (
                      <Box sx={{ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em' }}>{DECORATOR_MAP[color]}</Box>
                    )}
                    <Box sx={{ flex: 1 }}>{message}</Box>
                    <Box component="button" aria-label="Close"
                      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: size === 'small' ? '24px' : size === 'large' ? '32px' : '28px',
                        height: size === 'small' ? '24px' : size === 'large' ? '32px' : '28px',
                        borderRadius: '50%', border: 'none', backgroundColor: 'transparent',
                        color: 'var(--Text-Quiet)', cursor: 'pointer', fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
                        '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
                        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
                      }}>✕</Box>
                  </Box>
                )}

                <Box
                  component="button"
                  onClick={() => setSnackOpen(true)}
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 20px', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600,
                    color: 'var(--Buttons-Primary-Text)', backgroundColor: 'var(--Buttons-Primary-Button)',
                    border: '1px solid var(--Buttons-Primary-Border)', borderRadius: 'var(--Style-Border-Radius)',
                    cursor: 'pointer', transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: 'var(--Buttons-Primary-Hover)' },
                    '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
                  }}
                >
                  Show Snackbar
                </Box>

                {anchor === 'bottom' && (
                  <Box
                    data-theme={variant === 'solid' ? (SOLID_THEME_MAP[color] || undefined) : variant === 'light' ? (LIGHT_THEME_MAP[color] || undefined) : undefined}
                    data-surface="Container-High"
                    className={'snackbar-preview snackbar-' + variant + ' snackbar-' + size + ' snackbar-' + anchor}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: size === 'small' ? '8px' : size === 'large' ? '16px' : '12px',
                      minWidth: size === 'small' ? '240px' : size === 'large' ? '360px' : '300px',
                      maxWidth: '100%',
                      padding: size === 'small' ? '8px 12px' : size === 'large' ? '14px 20px' : '10px 16px',
                      fontSize: size === 'small' ? '13px' : size === 'large' ? '16px' : '14px',
                      fontWeight: 500, color: 'var(--Text)', backgroundColor: 'var(--Background)',
                      border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    {showStartDeco && DECORATOR_MAP[color] && (
                      <Box sx={{ display: 'inline-flex', flexShrink: 0, fontSize: '1.2em' }}>{DECORATOR_MAP[color]}</Box>
                    )}
                    <Box sx={{ flex: 1 }}>{message}</Box>
                    <Box component="button" aria-label="Close"
                      sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: size === 'small' ? '24px' : size === 'large' ? '32px' : '28px',
                        height: size === 'small' ? '24px' : size === 'large' ? '32px' : '28px',
                        borderRadius: '50%', border: 'none', backgroundColor: 'transparent',
                        color: 'var(--Text-Quiet)', cursor: 'pointer', fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
                        '&:hover': { backgroundColor: 'var(--Hover)', color: 'var(--Text)' },
                        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
                      }}>✕</Box>
                  </Box>
                )}

                <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>data-surface="Container-High"</Caption>
                  {!isStandard && <Caption style={{ color: 'var(--Text-Quiet)' }}>data-theme="{getThemeName()}"</Caption>}
                </Box>
              </Box>

              {/* Live snackbar (fixed position) */}
              <Snackbar
                open={snackOpen}
                onClose={handleClose}
                variant={variant}
                color={color}
                size={size}
                anchor={anchor}
                autoHideDuration={autoHide ? autoHideDuration : undefined}
                startDecorator={showStartDeco ? DECORATOR_MAP[color] : undefined}
              >
                {message}
              </Snackbar>
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid #333' }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>{generateCode()}</Box>
              </Box>
            </Box>
          </Grid>

          {/* Controls */}
          <Grid item sx={{ width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' }, flexShrink: 0, p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto' }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['standard', 'solid', 'light'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={variant === s} onClick={() => setVariant(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {isStandard
                  ? 'No data-theme. Uses page-level tokens. No color picker.'
                  : 'data-theme="' + getThemeName() + '" applied to snackbar.'}
              </Caption>
            </Box>

            {/* Color */}
            {!isStandard && (
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
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
            </Box>

            {/* Anchor */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ANCHOR</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['top', 'bottom'].map((a) => (
                  <ControlButton key={a} label={cap(a)} selected={anchor === a} onClick={() => setAnchor(a)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Centered horizontally, 16px from viewport edge.
              </Caption>
            </Box>

            {/* Message */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>MESSAGE</OverlineSmall>
              <Box
                component="input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  width: '100%', padding: '6px 10px', fontSize: '13px', fontFamily: 'inherit',
                  border: '1px solid var(--Border)', borderRadius: '4px',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                  '&:focus': { borderColor: 'var(--Focus-Visible)' },
                }}
              />
            </Box>

            {/* Advanced */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ADVANCED</OverlineSmall>
              <Stack spacing={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Auto-hide</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Automatically dismiss after duration.</Caption>
                  </Box>
                  <Switch checked={autoHide} onChange={(e) => setAutoHide(e.target.checked)} size="small" />
                </Box>
                {autoHide && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, pl: 2 }}>
                    <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0 }}>Duration (ms):</Caption>
                    <Box
                      component="input"
                      type="number"
                      value={autoHideDuration}
                      onChange={(e) => setAutoHideDuration(Math.max(1000, Number(e.target.value)))}
                      min={1000}
                      step={1000}
                      sx={{
                        width: '80px', padding: '4px 8px', fontSize: '13px', fontFamily: 'inherit',
                        border: '1px solid var(--Border)', borderRadius: '4px',
                        backgroundColor: 'var(--Background)', color: 'var(--Text)', outline: 'none',
                        '&:focus': { borderColor: 'var(--Focus-Visible)' },
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Start Decorator</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Status icon before message.</Caption>
                  </Box>
                  <Switch checked={showStartDeco} onChange={(e) => setShowStartDeco(e.target.checked)} size="small" />
                </Box>
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
            Based on current settings: {variant} / {size} / {anchor}
            {!isStandard ? ' — data-theme="' + getThemeName() + '"' : ''}
          </BodySmall>

          <Stack spacing={4}>
            {/* Text Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Text Readability</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Snackbar text must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note='Primary message text (data-surface="Container-High")' />
              <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Close button idle color" />
            </Box>

            {/* Container Boundary */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Container Boundary</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Snackbar must be visually distinct (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label="var(--Border) vs. var(--Background)"
                ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                note="1px solid var(--Border) on all sides" />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Alert role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="alert" aria-live="polite" aria-atomic="true">'} — screen readers announce the snackbar when it appears without interrupting the current task.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>data-surface:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    data-surface="Container-High" on all snackbars regardless of variant. Ensures elevated surface token resolution.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Escape to dismiss:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Pressing Escape triggers onClose with reason "escapeKeyDown".
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Auto-hide pause:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Timer pauses on mouse enter, resumes on mouse leave. Gives users time to read longer messages.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Close button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button aria-label="Close notification">'} — focus ring: 3px solid var(--Focus-Visible), outlineOffset: -3px.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Slide animation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    0.3s ease slide-in from anchor direction. Centered horizontally via translateX(-50%).
                  </Caption>
                </Box>
              </Stack>
            </Box>

            {/* Size Reference */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Size Reference</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Small</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>13px text, 8px/12px padding, 240px min-width, 24px close button.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>14px text, 10px/16px padding, 300px min-width, 28px close button.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>16px text, 14px/20px padding, 360px min-width, 32px close button.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default SnackbarShowcase;
