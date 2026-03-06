// src/components/Drawer/DrawerShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Drawer, DrawerClose, DrawerHeader, DrawerContent } from './Drawer';
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

export function DrawerShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [variant, setVariant] = useState('standard');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [anchor, setAnchor] = useState('left');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contrastData, setContrastData] = useState({});

  const isStandard = variant === 'standard';

  const getThemeName = () => {
    if (variant === 'solid') return SOLID_THEME_MAP[color] || '';
    if (variant === 'light') return LIGHT_THEME_MAP[color] || '';
    return '';
  };

  const generateCode = () => {
    const parts = [];
    parts.push('open={open}');
    parts.push('onClose={() => setOpen(false)}');
    if (variant !== 'standard') parts.push('variant="' + variant + '"');
    if (!isStandard) parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (anchor !== 'left') parts.push('anchor="' + anchor + '"');
    const propsStr = parts.join(' ');
    return '<Drawer ' + propsStr + '>\n  <DrawerClose onClick={() => setOpen(false)} />\n  <DrawerHeader>\n    <Typography level="h4">Navigation</Typography>\n  </DrawerHeader>\n  <DrawerContent>\n    {/* Content */}\n  </DrawerContent>\n</Drawer>';
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
      <H2>Drawer</H2>
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
              minHeight: 300, backgroundColor: 'var(--Background)', borderBottom: '1px solid var(--Border)' }}>
              <Box
                component="button"
                onClick={() => setDrawerOpen(true)}
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
                Open Drawer
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>{cap(anchor)} anchor</Caption>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>{cap(size)}</Caption>
                {!isStandard && <Caption style={{ color: 'var(--Text-Quiet)' }}>data-theme="{getThemeName()}"</Caption>}
              </Box>

              {/* Live drawer */}
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                variant={variant}
                color={color}
                size={size}
                anchor={anchor}
              >
                <DrawerClose onClick={() => setDrawerOpen(false)} />
                <DrawerHeader>
                  <H4 style={{ margin: 0 }}>Navigation</H4>
                </DrawerHeader>
                <DrawerContent>
                  <Stack spacing={2}>
                    {['Dashboard', 'Profile', 'Settings', 'Messages', 'Help'].map((item) => (
                      <Box
                        key={item}
                        component="button"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', width: '100%', textAlign: 'left',
                          fontSize: '14px', fontFamily: 'inherit', fontWeight: 500,
                          color: 'var(--Text)', backgroundColor: 'transparent',
                          border: 'none', borderRadius: 'var(--Style-Border-Radius)',
                          cursor: 'pointer', transition: 'background-color 0.1s ease',
                          '&:hover': { backgroundColor: 'var(--Hover)' },
                          '&:active': { backgroundColor: 'var(--Active)' },
                          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Stack>
                </DrawerContent>
              </Drawer>
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
                  ? 'No data-theme — bg: var(--Background), border: var(--Border).'
                  : 'data-theme="' + getThemeName() + '" — bg: var(--Background), border: var(--Border).'}
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
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {anchor === 'left' || anchor === 'right'
                  ? 'Width: small 240px, medium 320px, large 420px.'
                  : 'Height: small 200px, medium 280px, large 380px.'}
              </Caption>
            </Box>

            {/* Anchor */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ANCHOR</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['left', 'right', 'top', 'bottom'].map((a) => (
                  <ControlButton key={a} label={cap(a)} selected={anchor === a} onClick={() => setAnchor(a)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Border on the opposite edge: {anchor === 'left' ? 'right' : anchor === 'right' ? 'left' : anchor === 'top' ? 'bottom' : 'top'} — 1px solid var(--Border).
              </Caption>
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
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Drawer content must be readable (WCAG 1.4.3, 4.5:1)</BodySmall>
              <A11yRow label="var(--Text) vs. var(--Background)"
                ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                note="Primary text on drawer background" />
              <A11yRow label="var(--Text-Quiet) vs. var(--Background)"
                ratio={getContrast(contrastData.textQuiet, contrastData.background)} threshold={4.5}
                note="Secondary text on drawer background" />
            </Box>

            {/* Container Boundary */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Container Boundary</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Drawer edge must be distinguishable (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label="var(--Border) vs. var(--Background)"
                ratio={getContrast(contrastData.border, contrastData.background)} threshold={3.0}
                note="Edge border separating drawer from page content" />
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Dialog role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="dialog" aria-modal="true">'} — announced as a modal dialog. Content behind is inert.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Focus management:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Opening: focus moves to first focusable element inside the drawer. Closing: focus returns to the element that triggered the drawer. Focus is trapped within the drawer while open.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Escape to close:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Pressing Escape triggers onClose. Focus returns to previous element.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Backdrop click:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Clicking the semi-transparent backdrop (aria-hidden) triggers onClose.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Close button:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<button aria-label="Close drawer">'} — labeled button for screen readers. Focus ring: 3px solid var(--Focus-Visible).
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Body scroll lock:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    document.body overflow set to hidden while drawer is open. Restored on close.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Slide animation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    0.3s ease slide-in from anchor direction. Respects prefers-reduced-motion in production.
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
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Width: 240px (left/right), Height: 200px (top/bottom), 12px padding.</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Width: 320px (left/right), Height: 280px (top/bottom), 16px padding.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>Width: 420px (left/right), Height: 380px (top/bottom), 24px padding.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default DrawerShowcase;
