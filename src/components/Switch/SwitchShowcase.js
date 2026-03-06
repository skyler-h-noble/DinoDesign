// src/components/Switch/SwitchShowcase.js
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Grid, Tabs, Tab,
  Tooltip, IconButton as MuiIconButton,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Switch } from './Switch';
import {
  H2, H4, H5, Body, BodySmall, Caption, Label, OverlineSmall
} from '../Typography';

// --- Contrast Calculator -----------------------------------------------------

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
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function getCssVar(varName) {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

// --- Contrast Badge ----------------------------------------------------------

function ContrastBadge({ ratio, threshold }) {
  if (!ratio) return <Caption style={{ color: 'var(--Text-Quiet)' }}>--</Caption>;
  const passes = parseFloat(ratio) >= threshold;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{
        px: 1, py: 0.25, borderRadius: '4px',
        backgroundColor: passes ? 'var(--Tags-Success-BG)' : 'var(--Tags-Error-BG)',
        color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)',
        fontSize: '11px', fontWeight: 700,
      }}>
        {ratio}:1
      </Box>
      <Caption style={{ color: passes ? 'var(--Tags-Success-Text)' : 'var(--Tags-Error-Text)' }}>
        {passes ? 'Pass' : 'Fail'}
      </Caption>
    </Box>
  );
}

// --- Accessibility Row -------------------------------------------------------

function A11yRow({ label, ratio, threshold, note }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      py: 1.5, borderBottom: '1px solid var(--Border)',
    }}>
      <Box sx={{ flex: 1 }}>
        <BodySmall style={{ color: 'var(--Text)' }}>{label}</BodySmall>
        {note && <Caption style={{ color: 'var(--Text-Quiet)', display: 'block' }}>{note}</Caption>}
      </Box>
      <ContrastBadge ratio={ratio} threshold={threshold} />
    </Box>
  );
}

// --- Copy Button -------------------------------------------------------------

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Copy failed:', err); }
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

// --- Color Swatch Button -----------------------------------------------------

function ColorSwatchButton({ color, selected, onClick }) {
  const C = cap(color);
  return (
    <Tooltip title={C} arrow>
      <Box
        onClick={() => onClick(color)}
        role="button"
        aria-label={'Select ' + C + ' color'}
        aria-pressed={selected}
        sx={{
          width: 'var(--Button-Height)', height: 'var(--Button-Height)',
          borderRadius: '4px',
          backgroundColor: 'var(--Buttons-' + C + '-Button)',
          border: selected ? '2px solid var(--Text)' : '2px solid transparent',
          outline: selected ? '2px solid var(--Focus-Visible)' : '2px solid transparent',
          cursor: 'pointer',
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        {selected && <CheckIcon sx={{ fontSize: 24, color: 'var(--Buttons-' + C + '-Text)', pointerEvents: 'none' }} />}
      </Box>
    </Tooltip>
  );
}

// --- Control Button ----------------------------------------------------------

function ControlButton({ label, selected, onClick }) {
  return (
    <Box component="button" onClick={onClick}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        border: '2px solid var(--Buttons-Primary-Button)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        color: selected ? 'var(--Buttons-Primary-Text)' : 'var(--Text)',
        padding: '4px 12px', fontSize: '14px', fontFamily: 'inherit', fontWeight: 500,
        whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': { backgroundColor: selected ? 'var(--Buttons-Primary-Hover)' : 'var(--Surface-Dim)' },
        '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
      }}
    >
      {label}
    </Box>
  );
}

// --- Main Showcase -----------------------------------------------------------

export function SwitchShowcase() {
  const [mainTab, setMainTab] = useState(0);

  // Playground state
  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('primary');
  const [size, setSize] = useState('medium');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [contrastData, setContrastData] = useState({});

  const colors = COLORS;
  const styles = ['solid', 'outline', 'light'];

  // Map style + color to variant string
  const getVariant = () => {
    if (style === 'solid') return color;
    return color + '-' + style;
  };

  // Code snippet
  const generateCode = () => {
    const parts = ['variant="' + getVariant() + '"', 'size="' + size + '"'];
    if (isChecked) parts.push('defaultChecked');
    if (isDisabled) parts.push('disabled');
    parts.push('label="Notifications"');
    return '<Switch ' + parts.join(' ') + ' />';
  };

  // Contrast data
  useEffect(() => {
    const C = cap(color);
    const data = {};
    const bg = getCssVar('--Background');
    const focusVisible = getCssVar('--Focus-Visible');

    if (style === 'solid') {
      data.thumb = getCssVar('--Buttons-' + C + '-Button');
      data.trackOn = getCssVar('--Buttons-' + C + '-Border');
      data.trackOnBorder = null;
      data.trackOff = getCssVar('--Border-Variant');
    } else if (style === 'outline') {
      data.thumb = getCssVar('--Buttons-' + C + '-Border');
      data.trackOn = null;
      data.trackOnBorder = getCssVar('--Buttons-' + C + '-Border');
      data.trackOff = null;
      data.trackOffBorder = getCssVar('--Border-Variant');
    } else if (style === 'light') {
      data.thumb = getCssVar('--Buttons-' + C + '-Border');
      data.trackOn = getCssVar('--' + C + '-Color-11');
      data.trackOnBorder = null;
      data.trackOff = getCssVar('--Border-Variant');
    }

    data.background = bg;
    data.focusVisible = focusVisible;
    setContrastData(data);
  }, [style, color]);

  const sizeDetails = {
    small:  { thumb: '10px', track: '26×14px', container: '26×24px', note: 'Small switch (10px thumb) in 24px min-height root' },
    medium: { thumb: '15px', track: '34×18px', container: '34×24px', note: 'Medium switch (15px thumb) in 24px min-height root' },
    large:  { thumb: '18px', track: '42×22px', container: '42×24px', note: 'Large switch (18px thumb) in 24px min-height root' },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <H2 style={{ marginBottom: 8 }}>Switch</H2>
      <Body color="quiet" style={{ marginBottom: 24 }}>
        Toggle switch with solid, outline, and light variants across all 8 colors.
        All sizes meet the 24×24px minimum touch target.
      </Body>

      <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)}
        sx={{ borderBottom: '1px solid var(--Border)', mb: 0 }}>
        <Tab label="Playground" />
        <Tab label="Accessibility" />
      </Tabs>

      {/* PLAYGROUND TAB */}
      {mainTab === 0 && (
        <Grid container sx={{ minHeight: 400 }}>
          {/* LEFT: Preview + Code */}
          <Grid item sx={{
            width: { xs: '100%', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
          }}>
            {/* Preview */}
            <Box sx={{
              p: 4,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 200, backgroundColor: 'var(--Background)',
              borderBottom: '1px solid var(--Border)',
            }}>
              <Switch
                variant={getVariant()}
                size={size}
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                disabled={isDisabled}
                label="Notifications"
              />
            </Box>

            {/* Code */}
            <Box sx={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid var(--Border)' }}>
              <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                px: 2, py: 1, borderBottom: '1px solid #333',
              }}>
                <Caption style={{ color: '#9ca3af' }}>JSX</Caption>
                <CopyButton code={generateCode()} />
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>
                <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#e5e7eb', whiteSpace: 'pre', display: 'block' }}>
                  {generateCode()}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: Controls */}
          <Grid item sx={{
            width: { xs: 'calc(100vw - 432px)', md: 'calc((100vw - 432px) / 2)' },
            flexShrink: 0,
            p: 3, backgroundColor: 'var(--Container)', overflowY: 'auto',
          }}>
            <H4>Playground</H4>

            {/* Style */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>STYLE</OverlineSmall>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {styles.map((s) => (
                  <ControlButton key={s} label={cap(s)} selected={style === s}
                    onClick={() => setStyle(s)} />
                ))}
              </Stack>
            </Box>

            {/* Color */}
            <Box sx={{ mt: 3 }}>
              <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>COLOR</OverlineSmall>
              <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
                {colors.map((c) => (
                  <ColorSwatchButton key={c} color={c} selected={color === c} onClick={setColor} />
                ))}
              </Stack>
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
                {sizeDetails[size]?.note}
              </Caption>
            </Box>

            {/* Disabled */}
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={<MuiCheckbox checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} size="small" />}
                label={<BodySmall>Disabled</BodySmall>}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* ACCESSIBILITY TAB */}
      {mainTab === 1 && (
        <Box sx={{ p: 4 }}>
          <H4>Accessibility Requirements</H4>
          <BodySmall color="quiet" style={{ marginBottom: 32 }}>
            Based on current Playground settings: {style} · {color} · {size}
          </BodySmall>

          <Stack spacing={4}>
            {/* Thumb contrast — ON state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Thumb Contrast — ON State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The handle must have ≥ 3:1 contrast against the track when checked (WCAG 1.4.11)
              </BodySmall>
              {(() => {
                const thumbVsTrack = getContrast(contrastData.thumb, contrastData.trackOn);
                const thumbVsBorder = getContrast(contrastData.thumb, contrastData.trackOnBorder);
                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };
                return (
                  <A11yRow
                    label="Handle vs. Track (ON)"
                    ratio={style === 'outline' ? thumbVsBorder : bestOf(thumbVsTrack, thumbVsBorder)}
                    threshold={3.1}
                    note={style === 'outline'
                      ? 'Handle vs track border — outline has transparent track bg'
                      : 'BG ' + (thumbVsTrack || '--') + ':1 · Border ' + (thumbVsBorder || '--') + ':1 — best of the two'
                    }
                  />
                );
              })()}
            </Box>

            {/* Thumb contrast — OFF state */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Thumb Contrast — OFF State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The handle must have ≥ 3:1 contrast against the track when unchecked (WCAG 1.4.11)
              </BodySmall>
              {(() => {
                const thumbVsTrack = getContrast(contrastData.thumb, contrastData.trackOff);
                const thumbVsBorder = style === 'outline'
                  ? getContrast(contrastData.thumb, contrastData.trackOffBorder)
                  : null;
                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };
                return (
                  <A11yRow
                    label="Handle vs. Track (OFF)"
                    ratio={style === 'outline' ? bestOf(thumbVsTrack, thumbVsBorder) : thumbVsTrack}
                    threshold={3.1}
                    note="Handle must be distinguishable from the unchecked track"
                  />
                );
              })()}
            </Box>

            {/* Track contrast — ON state vs background */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Track Contrast — ON State</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                The track (background or border) must have ≥ 3:1 contrast against the page background when checked (WCAG 1.4.11)
              </BodySmall>
              {(() => {
                const bgVsBg = getContrast(contrastData.trackOn, contrastData.background);
                const brVsBg = getContrast(contrastData.trackOnBorder, contrastData.background);
                const bestOf = (a, b) => {
                  if (!a && !b) return null;
                  if (!a) return b;
                  if (!b) return a;
                  return parseFloat(a) >= parseFloat(b) ? a : b;
                };
                return (
                  <A11yRow
                    label="Track vs. Background (ON)"
                    ratio={bestOf(bgVsBg, brVsBg)}
                    threshold={3.1}
                    note={'BG ' + (bgVsBg || '--') + ':1 · Border ' + (brVsBg || '--') + ':1 — best of the two'}
                  />
                );
              })()}
            </Box>

            {/* Focus Visible */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Focus-Visible Indicator</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Focus ring must be visible to keyboard users
              </BodySmall>
              <A11yRow
                label="Focus-Visible outline vs. Background"
                ratio={getContrast(contrastData.focusVisible, contrastData.background)}
                threshold={3.1}
                note="var(--Focus-Visible) vs var(--Background) must be >= 3:1 WCAG AA, 2px solid, 2px offset"
              />
            </Box>

            {/* Touch Target */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>Touch Target Area</H5>
              <BodySmall color="quiet" style={{ marginBottom: 16 }}>
                Switch must have ≥ 24×24px touch target (WCAG 2.5.8). All sizes wrapped in a min 24px-tall container.
              </BodySmall>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                <Box>
                  <BodySmall>Touch target ({size})</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    {sizeDetails[size]?.container} container — track is {sizeDetails[size]?.track}
                  </Caption>
                </Box>
                <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', backgroundColor: 'var(--Tags-Success-BG)', color: 'var(--Tags-Success-Text)', fontSize: '11px', fontWeight: 700 }}>
                  24px Pass
                </Box>
              </Box>
            </Box>

            {/* ARIA Requirements */}
            <Box sx={{ p: 3, backgroundColor: 'var(--Container)', borderRadius: 'var(--Style-Border-Radius)', border: '1px solid var(--Border)' }}>
              <H5>ARIA & Label Requirements</H5>
              <Stack spacing={0}>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>With visible label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<Switch label="Notifications" /> — uses FormControlLabel'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Without visible label:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace' }}>
                    {'<Switch aria-label="Enable notifications" /> — required'}
                  </Caption>
                </Box>
                <Box sx={{ py: 1.5, borderBottom: '1px solid var(--Border)' }}>
                  <BodySmall style={{ display: 'block', marginBottom: 2 }}>Keyboard navigation:</BodySmall>
                  <Caption style={{ color: 'var(--Text-Quiet)' }}>
                    Space to toggle, Tab to focus, role="switch" with aria-checked
                  </Caption>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}


