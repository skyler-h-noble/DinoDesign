// src/components/CircularProgress/CircularProgressShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab, Tooltip, IconButton as MuiIconButton, Switch, Slider,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress } from './CircularProgress';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const COLOR_LABEL_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
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

export function CircularProgressShowcase() {
  const [mainTab, setMainTab] = useState(0);
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [determinate, setDeterminate] = useState(false);
  const [value, setValue] = useState(65);
  const [showLabel, setShowLabel] = useState(true);
  const [contrastData, setContrastData] = useState({});

  const C = COLOR_LABEL_MAP[color] || 'Primary';

  const generateCode = () => {
    const parts = [];
    if (color !== 'primary') parts.push('color="' + color + '"');
    if (size !== 'medium') parts.push('size="' + size + '"');
    if (determinate) {
      parts.push('value={' + value + '}');
      if (showLabel) parts.push('showValue');
    }
    return '<CircularProgress' + (parts.length ? ' ' + parts.join(' ') : '') + ' />';
  };

  useEffect(() => {
    const data = {};
    data.fill = getCssVar('--Buttons-' + C + '-Border');
    data.track = getCssVar('--Border-Variant');
    data.background = getCssVar('--Background');
    data.text = getCssVar('--Text');
    setContrastData(data);
  }, [color, C]);

  return (
    <Box sx={{ pb: 8 }}>
      <H2>Circular Progress</H2>
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

              {/* Main preview */}
              <CircularProgress
                color={color}
                size={size}
                value={determinate ? value : undefined}
                showValue={determinate && showLabel}
              />

              {/* All sizes side by side */}
              <Stack direction="row" spacing={3} alignItems="center">
                {['small', 'medium', 'large'].map((s) => (
                  <Box key={s} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      color={color}
                      size={s}
                      value={determinate ? value : undefined}
                      showValue={determinate && showLabel && s !== 'small'}
                    />
                    <Caption style={{ color: 'var(--Text-Quiet)' }}>{cap(s)}</Caption>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>Track: var(--Border-Variant)</Caption>
                <Caption style={{ color: 'var(--Text-Quiet)' }}>Fill: var(--Buttons-{C}-Border)</Caption>
              </Box>
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

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {COLORS.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                Fill: var(--Buttons-{C}-Border). Track: var(--Border-Variant).
              </Caption>
            </Box>

            {/* Size */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>SIZE</OverlineSmall>
              <Stack direction="row" spacing={1}>
                {['small', 'medium', 'large'].map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={size === s} onClick={() => setSize(s)} />
                ))}
              </Stack>
              <Caption style={{ color: 'var(--Text-Quiet)', display: 'block', marginTop: 6 }}>
                {size === 'small' ? '24px diameter, 3px stroke.' : size === 'medium' ? '40px diameter, 4px stroke.' : '56px diameter, 5px stroke.'}
              </Caption>
            </Box>

            {/* Determinate */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>DETERMINATE</OverlineSmall>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box>
                    <Label>Determinate</Label>
                    <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Off = indeterminate (spinning). On = static arc at given %.</Caption>
                  </Box>
                  <Switch checked={determinate} onChange={(e) => setDeterminate(e.target.checked)} size="small" />
                </Box>
                {determinate && (
                  <>
                    <Box sx={{ px: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Caption style={{ color: 'var(--Text-Quiet)', flexShrink: 0, width: 32 }}>{value}%</Caption>
                        <Slider
                          value={value}
                          onChange={(e, v) => setValue(v)}
                          min={0}
                          max={100}
                          step={1}
                          size="small"
                          sx={{
                            color: 'var(--Buttons-' + C + '-Border)',
                            '& .MuiSlider-thumb': { width: 14, height: 14 },
                          }}
                        />
                      </Stack>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Box>
                        <Label>Show Label</Label>
                        <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>Display percentage text in center (medium and large only).</Caption>
                      </Box>
                      <Switch checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} size="small" />
                    </Box>
                  </>
                )}
              </Stack>
            </Box>

            {/* All colors preview */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>ALL COLORS</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 2 }}>
                {COLORS.map((c) => (
                  <Box key={c} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <CircularProgress
                      color={c}
                      size="medium"
                      value={determinate ? value : undefined}
                    />
                    <Caption style={{ color: 'var(--Text-Quiet)', fontSize: '10px' }}>{cap(c)}</Caption>
                  </Box>
                ))}
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
            Based on current settings: {color} / {size} / {determinate ? 'determinate ' + value + '%' : 'indeterminate'}
          </BodySmall>

          <Stack spacing={4}>
            {/* Visual Contrast */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Visual Contrast</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>Progress indicator must be visually distinct (WCAG 1.4.11, 3:1)</BodySmall>
              <A11yRow label={'Fill: var(--Buttons-' + C + '-Border) vs. var(--Background)'}
                ratio={getContrast(contrastData.fill, contrastData.background)} threshold={3.0}
                note="Progress arc against page background" />
              <A11yRow label="Track: var(--Border-Variant) vs. var(--Background)"
                ratio={getContrast(contrastData.track, contrastData.background)} threshold={3.0}
                note="Background track circle" />
              <A11yRow label={'Fill vs. Track'}
                ratio={getContrast(contrastData.fill, contrastData.track)} threshold={3.0}
                note="Filled arc vs. unfilled track — distinguishable progress" />
              {determinate && showLabel && (
                <A11yRow label="Label: var(--Text) vs. var(--Background)"
                  ratio={getContrast(contrastData.text, contrastData.background)} threshold={4.5}
                  note="Center percentage text readability (WCAG 1.4.3, 4.5:1)" />
              )}
            </Box>

            {/* ARIA and Semantics */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA and Semantics</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Progress role:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<div role="progressbar">'} — screen readers identify this as a progress indicator.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Determinate mode:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    aria-valuenow={'{value}'}, aria-valuemin="0", aria-valuemax="100", aria-label="{'{value}'}% progress". Announces current percentage to screen readers.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Indeterminate mode:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    No aria-valuenow/min/max (absence indicates indeterminate to assistive tech). aria-label="Loading". CSS animation spins at 1.2s per revolution.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Center label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    aria-hidden="true" — decorative only since aria-valuenow already communicates the value programmatically. Visible on medium/large sizes only.
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>SVG accessibility:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    SVG is purely presentational. The outer container carries all ARIA attributes. Track uses strokeLinecap="round" for smooth arc ends.
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
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>24×24px, 3px stroke. No center label (too small).</Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall>Medium</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>40×40px, 4px stroke. 12px center label.</Caption>
                </Box>
                <Box sx={{ py: 1.5 }}>
                  <BodySmall>Large</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>56×56px, 5px stroke. 14px center label.</Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default CircularProgressShowcase;
